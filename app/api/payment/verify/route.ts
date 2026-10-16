import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/modempay";
import { markOrderPaid, type ModemPayRecord } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

/**
 * Used by /payment/return to show the outcome of a payment.
 *
 * - `?orderId=` — inline flow: the order was already confirmed by
 *   /api/payment/confirm (or the webhook); just report its status.
 * - `?transactionId=` / `?intentId=` — redirect flow: verify against the
 *   ModemPay API and mark the matching order PAID if it checks out.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const reference = searchParams.get("transactionId") || searchParams.get("intentId");

  if (!orderId && !reference) {
    return NextResponse.json(
      { error: "orderId, transactionId or intentId is required" },
      { status: 400 }
    );
  }

  try {
    let targetOrderId = orderId;
    let paymentStatus: string | undefined;

    if (reference) {
      const result = await verifyTransaction(reference);
      const record = result.data as unknown as ModemPayRecord;
      paymentStatus = record.status;

      if (!targetOrderId) {
        const metaOrderId = record.metadata?.orderId;
        if (typeof metaOrderId === "string") {
          targetOrderId = metaOrderId;
        } else {
          const byRef = await prisma.order.findFirst({
            where: { paymentRef: { in: [record.id, record.payment_intent_id || record.id] } },
            select: { id: true },
          });
          targetOrderId = byRef?.id ?? null;
        }
      }

      if (targetOrderId) {
        const outcome = await markOrderPaid(targetOrderId, record);
        if (!outcome.ok) {
          console.warn(`Payment verify rejected for order ${targetOrderId}: ${outcome.reason}`);
        }
      }
    }

    if (!targetOrderId) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = await prisma.order.findUnique({
      where: { id: targetOrderId },
      select: { id: true, total: true, status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isPaid = order.status !== "PENDING_PAYMENT" && order.status !== "CANCELED";

    return NextResponse.json({
      success: isPaid,
      status: paymentStatus ?? order.status,
      order,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
