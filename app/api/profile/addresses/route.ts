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
      select: { shippingAddresses: true },
    });

    const addresses = user?.shippingAddresses ? JSON.parse(user.shippingAddresses as string) : [];

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const address = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { shippingAddresses: true },
    });

    const current = user?.shippingAddresses ? JSON.parse(user.shippingAddresses as string) : [];
    current.push(address);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { shippingAddresses: JSON.stringify(current) },
    });

    return NextResponse.json({ addresses: current });
  } catch (error) {
    console.error("Save address error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}