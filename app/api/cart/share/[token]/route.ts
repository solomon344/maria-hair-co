import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const shared = await prisma.sharedCart.findUnique({
      where: { token: params.token },
    });

    if (!shared || shared.expiresAt < new Date()) {
      return NextResponse.json({ error: "Shared cart not found or expired" }, { status: 404 });
    }

    return NextResponse.json({ items: shared.items });
  } catch (error) {
    console.error("Fetch shared cart error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}