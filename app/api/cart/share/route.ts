import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, userName, userEmail } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const token = crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const shared = await prisma.sharedCart.create({
      data: {
        token,
        userId: userEmail || "guest",
        userName: userName || "Someone special",
        userEmail: userEmail || "",
        items,
        expiresAt,
      },
    });

    const url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cart/share/${shared.token}`;

    return NextResponse.json({ url, token: shared.token });
  } catch (error) {
    console.error("Share cart error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}