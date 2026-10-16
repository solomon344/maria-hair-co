import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Maps the notification type sent by the client to the User preference column.
const PREFERENCE_FIELD = {
  newArrivals: "notifyNewArrivals",
  promotions: "notifyPromotions",
  tips: "notifyTips",
} as const;

type NotifyType = keyof typeof PREFERENCE_FIELD;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await request.json();
    if (!type || !(type in PREFERENCE_FIELD)) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }
    const field = PREFERENCE_FIELD[type as NotifyType];

    const users = await prisma.user.findMany({
      where: { [field]: true },
      select: { id: true, email: true, name: true, lastNotifiedAt: true },
    });

    const lastNotified = users[0]?.lastNotifiedAt || new Date(0);
    const newProducts = await prisma.product.findMany({
      where: { createdAt: { gt: lastNotified } },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, slug: true, image: true, price: true },
    });

    // NOTE: this only records who would be notified — it does not send email.
    // Actual sending is done by /api/admin/send-email.
    await prisma.user.updateMany({
      where: { [field]: true },
      data: { lastNotifiedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      notifiedCount: users.length,
      newProductCount: newProducts.length,
    });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
