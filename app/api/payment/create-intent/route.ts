import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Creates a PENDING order for the inline (client-side) ModemPay flow.
 *
 * With inline payments the actual charge happens in the browser via the
 * `ModemPayCheckout` drop-in modal (using the public key). The server does not
 * create a hosted payment intent here — it only records the order so it can be
 * marked PAID once the inline `callback` returns a transaction id, which is
 * then verified via the API.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      items,
      userId,
      customerInfo,
      metadata,
    } = body;

    if (!amount || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid request: amount and items are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        customerName: customerInfo?.name || "Guest",
        customerEmail: customerInfo?.email || "",
        customerPhone: customerInfo?.phone || null,
        address: customerInfo?.address || {},
        total: amount,
        status: "PENDING_PAYMENT",
        // No paymentRef yet; set after the inline callback verifies the charge.
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}