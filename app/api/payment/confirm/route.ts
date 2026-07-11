import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/modempay";
import { prisma } from "@/lib/prisma";

/**
 * Confirms an inline (client-side ModemPayCheckout) payment.
 *
 * The browser `callback` receives a `transaction` object whose `id` (or
 * `payment_intent_id`) we send here. We verify it against the ModemPay API and,
 * if successful, mark the pending order as PAID.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, transactionId } = body;

    if (!orderId || !transactionId) {
      return NextResponse.json(
        { error: "orderId and transactionId are required" },
        { status: 400 }
      );
    }

    const result = await verifyTransaction(transactionId);
    const record = result.data as unknown as {
      id: string;
      status: string;
      payment_intent_id?: string;
    };

    const isPaid =
      record.status === "succeeded" ||
      record.status === "completed" ||
      record.status === "paid" ||
      record.status === "successful";

    if (!isPaid) {
      return NextResponse.json(
        { success: false, status: record.status },
        { status: 402 }
      );
    }

    const ref = record.payment_intent_id || record.id;
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID", paymentRef: ref },
    });

    return NextResponse.json({ success: true, status: record.status });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}