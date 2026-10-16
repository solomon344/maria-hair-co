import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/modempay";
import { markOrderPaid, type ModemPayRecord } from "@/lib/orders";

/**
 * Confirms an inline (client-side ModemPayCheckout) payment.
 *
 * The browser `callback` receives a `transaction` object whose `id` (or
 * `payment_intent_id`) we send here. We fetch it from the ModemPay API and only
 * mark the order PAID if the amount, currency and status check out.
 */
export async function POST(request: Request) {
  try {
    const { orderId, transactionId } = await request.json();

    if (!orderId || !transactionId) {
      return NextResponse.json(
        { error: "orderId and transactionId are required" },
        { status: 400 }
      );
    }

    const result = await verifyTransaction(transactionId);
    const record = result.data as unknown as ModemPayRecord;

    const outcome = await markOrderPaid(orderId, record);
    if (!outcome.ok) {
      console.warn(`Payment confirm rejected for order ${orderId}: ${outcome.reason}`);
      return NextResponse.json(
        { success: false, status: record.status, error: outcome.reason },
        { status: 402 }
      );
    }

    return NextResponse.json({ success: true, status: record.status });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
