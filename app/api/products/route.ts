import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      });
      if (!product) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({
        product: {
          ...product,
          price: Number(product.price),
        },
      });
    }

    const where: any = {};
    if (category) {
      where.category = { name: category };
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        price: Number(p.price),
      })),
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}