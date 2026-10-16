import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateTotals } from "@/lib/pricing";

/**
 * Creates a PENDING order for the inline (client-side) ModemPay flow.
 *
 * With inline payments the actual charge happens in the browser via the
 * `ModemPayCheckout` drop-in modal (using the public key). The server only
 * records the order so it can be marked PAID once the payment is verified
 * (inline callback → /api/payment/confirm, or the ModemPay webhook).
 *
 * Prices and the total are always recalculated from the database — anything
 * the browser sends about money is ignored. The returned `amount` is what the
 * checkout modal must charge.
 *
 * Signed-in customers can always check out. Without an account, checkout is
 * allowed only when paying for a valid shared-cart link (`sharedToken`), e.g. a
 * partner buying a cart that was sent to them. That order is attached to the
 * account of the person who shared the cart, if they have one.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { items, customerInfo, sharedToken } = body;

    let userId: string | null = session?.user?.id ?? null;

    if (!userId) {
      const shared =
        typeof sharedToken === "string"
          ? await prisma.sharedCart.findUnique({ where: { token: sharedToken } })
          : null;

      if (!shared || shared.expiresAt < new Date()) {
        return NextResponse.json(
          { error: "Please sign in to place an order" },
          { status: 401 }
        );
      }

      if (!customerInfo?.email) {
        return NextResponse.json(
          { error: "An email address is required to place an order" },
          { status: 400 }
        );
      }

      if (shared.userEmail) {
        const sharer = await prisma.user.findUnique({
          where: { email: shared.userEmail },
          select: { id: true },
        });
        userId = sharer?.id ?? null;
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: items are required" },
        { status: 400 }
      );
    }

    const quantities = new Map<string, number>();
    for (const item of items) {
      const qty = Number(item?.quantity);
      if (typeof item?.productId !== "string" || !Number.isInteger(qty) || qty < 1) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
      }
      quantities.set(item.productId, (quantities.get(item.productId) || 0) + qty);
    }

    const products = await prisma.product.findMany({
      where: { id: { in: Array.from(quantities.keys()) } },
      select: { id: true, name: true, price: true, image: true, stockQty: true },
    });

    if (products.length !== quantities.size) {
      return NextResponse.json(
        { error: "Some items in your cart are no longer available" },
        { status: 400 }
      );
    }

    for (const p of products) {
      if (p.stockQty < quantities.get(p.id)!) {
        return NextResponse.json(
          { error: `Not enough stock for ${p.name}` },
          { status: 400 }
        );
      }
    }

    const subtotal = products.reduce(
      (sum, p) => sum + Number(p.price) * quantities.get(p.id)!,
      0
    );
    const { total } = calculateTotals(subtotal);

    const order = await prisma.order.create({
      data: {
        userId,
        customerName: customerInfo?.name || session?.user?.name || "Customer",
        customerEmail: customerInfo?.email || session?.user?.email || "",
        customerPhone: customerInfo?.phone || null,
        address: customerInfo || {},
        total,
        status: "PENDING_PAYMENT",
        items: {
          create: products.map((p) => ({
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: quantities.get(p.id)!,
            image: p.image,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: total,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
