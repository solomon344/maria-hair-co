import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { blogPosts } from "@/lib/blog-data";
import { prisma } from "@/lib/prisma";

// Rebuild hourly so new products show up without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/haircare"), changeFrequency: "weekly", priority: 0.7 },
  ];

  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/haircare/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  let products: MetadataRoute.Sitemap = [];
  try {
    const rows = await prisma.product.findMany({ select: { slug: true, updatedAt: true, image: true } });
    products = rows.map((p) => ({
      url: absoluteUrl(`/shop/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
      images: [p.image.startsWith("http") ? p.image : absoluteUrl(p.image)],
    }));
  } catch (error) {
    // Don't fail the whole sitemap (or the build) if the DB is unreachable.
    console.error("Sitemap: could not load products", error);
  }

  return [...staticPages, ...products, ...posts];
}
