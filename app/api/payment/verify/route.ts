import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/modempay";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("transactionId") || searchParams.get("intentId");

  if (!reference) {
    return NextResponse.json(
      { error: "Transaction ID or intent ID is required" },
      { status: 400 }
    );
  }

  try {
    // Verify payment via the ModemPay API (no webhooks involved).
    const result = await verifyTransaction(reference);
    const record = result.data as unknown as {
      id: string;
      status: string;
      amount?: number;
      metadata?: Record<string, string>;
    };

    // Find the order by payment reference (intent id or transaction id).
    const order = await prisma.order.findFirst({
      where: { paymentRef: record.id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Determine paid status from the API response.
    const isPaid =
      record.status === "succeeded" ||
      record.status === "completed" ||
      record.status === "paid" ||
      record.status === "successful";

    if (isPaid && order.status !== "PAID") {
      // Update order status to paid.
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });
    }

    return NextResponse.json({
      success: isPaid,
      status: record.status,
      order: {
        id: order.id,
        total: order.total,
        status: isPaid ? "PAID" : order.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}