import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { ProductDetail, type ShopProduct } from "@/components/product-detail";
import { absoluteUrl, siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

// Re-render product pages at most every 10 minutes (price/stock changes).
export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

const getProduct = cache(async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
  return product ? { ...product, price: Number(product.price) } : null;
});

const imageUrl = (src: string) => (src.startsWith("http") ? src : absoluteUrl(src));

const truncate = (text: string, max = 160) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({ select: { slug: true } });
    return products.map(({ slug }) => ({ slug }));
  } catch {
    // DB unavailable at build time — pages will render on first request instead.
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const description = truncate(product.tagline || product.description);
  const path = `/shop/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${product.name} | ${siteConfig.name}`,
      description,
      images: [{ url: imageUrl(product.image), alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [imageUrl(product.image)],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    // Old or mistyped links like /shop/Hydrating%20Shampoo → /shop/hydrating-shampoo
    const normalized = slugify(decodeURIComponent(slug));
    if (normalized && normalized !== slug && (await getProduct(normalized))) {
      permanentRedirect(`/shop/${normalized}`);
    }
    notFound();
  }

  const related = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const relatedProducts = related.map((p) => ({ ...p, price: Number(p.price) }));

  const url = absoluteUrl(`/shop/${product.slug}`);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: [imageUrl(product.image)],
        sku: product.id,
        url,
        brand: { "@type": "Brand", name: siteConfig.name },
        ...(product.category ? { category: product.category.name } : {}),
        offers: {
          "@type": "Offer",
          url,
          price: product.price.toFixed(2),
          priceCurrency: siteConfig.currency,
          availability:
            product.stockQty > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${siteConfig.url}/#organization` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
          { "@type": "ListItem", position: 3, name: product.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <ProductDetail
        product={product as ShopProduct}
        relatedProducts={relatedProducts as ShopProduct[]}
      />
    </>
  );
}
