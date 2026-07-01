import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        shippingAddresses: true,
        notifyOrderUpdates: true,
        notifyPromotions: true,
        notifyNewArrivals: true,
        notifyTips: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, phone, notifyOrderUpdates, notifyPromotions, notifyNewArrivals, notifyTips } = await request.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(notifyOrderUpdates !== undefined && { notifyOrderUpdates }),
        ...(notifyPromotions !== undefined && { notifyPromotions }),
        ...(notifyNewArrivals !== undefined && { notifyNewArrivals }),
        ...(notifyTips !== undefined && { notifyTips }),
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        shippingAddresses: true,
        notifyOrderUpdates: true,
        notifyPromotions: true,
        notifyNewArrivals: true,
        notifyTips: true,
      },
    })

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}