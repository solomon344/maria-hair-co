import { prisma } from "@/lib/prisma";

/** Shape of a ModemPay transaction / charge payload (API response or webhook). */
export interface ModemPayRecord {
  id: string;
  status: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown> | null;
  payment_intent_id?: string | null;
}

// "completed" is what ModemPay documents for a finished charge; the others are
// kept for safety since the API has used different wording across resources.
const PAID_STATUSES = new Set(["completed", "succeeded", "successful", "paid"]);

export const isPaidStatus = (status?: string) =>
  !!status && PAID_STATUSES.has(status.toLowerCase());

export type MarkPaidResult =
  | { ok: true; orderId: string; alreadyPaid: boolean }
  | { ok: false; reason: string };

/**
 * Marks an order as PAID after checking the ModemPay record really pays for it:
 * the status is successful, the amount covers the order total, the currency is
 * GMD, and (when present) metadata.orderId points at this order.
 *
 * Idempotent — safe to call from the inline callback, the return page and the
 * webhook for the same payment.
 */
export async function markOrderPaid(
  orderId: string,
  record: ModemPayRecord
): Promise<MarkPaidResult> {
  if (!isPaidStatus(record.status)) {
    return { ok: false, reason: `Payment status is "${record.status}"` };
  }

  const metaOrderId = record.metadata?.orderId;
  if (metaOrderId && metaOrderId !== orderId) {
    return { ok: false, reason: "Payment belongs to a different order" };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, reason: "Order not found" };

  const ref = record.payment_intent_id || record.id;

  if (order.status !== "PENDING_PAYMENT") {
    // Already processed. Only report success if it was this same payment.
    return order.paymentRef === ref || order.paymentRef === record.id
      ? { ok: true, orderId, alreadyPaid: true }
      : { ok: false, reason: `Order is already ${order.status}` };
  }

  if (record.currency && record.currency.toUpperCase() !== "GMD") {
    return { ok: false, reason: `Unexpected currency ${record.currency}` };
  }

  const expected = Number(order.total);
  if (typeof record.amount !== "number" || record.amount + 0.001 < expected) {
    return {
      ok: false,
      reason: `Amount paid (${record.amount}) is less than order total (${expected})`,
    };
  }

  // A single payment must never settle two orders.
  const reused = await prisma.order.findFirst({
    where: { paymentRef: { in: [ref, record.id] }, id: { not: orderId } },
    select: { id: true },
  });
  if (reused) return { ok: false, reason: "Payment already used for another order" };

  // Conditional update so two concurrent confirmations can't both "win".
  const { count } = await prisma.order.updateMany({
    where: { id: orderId, status: "PENDING_PAYMENT" },
    data: { status: "PAID", paymentRef: ref },
  });

  return { ok: true, orderId, alreadyPaid: count === 0 };
}
