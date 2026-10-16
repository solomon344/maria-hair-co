import type { Metadata } from "next";

import { ShopContent } from "@/components/shop-content";

export const metadata: Metadata = {
  title: "Shop Natural Hair Care Products",
  description:
    "Shop botanical shampoos, conditioners, hair oils and treatments for every hair type — made with cold-pressed oils and organic extracts.",
  // Filtered views (?category=…) all point back to the main shop page.
  alternates: { canonical: "/shop" },
  openGraph: { url: "/shop", title: "Shop Natural Hair Care Products" },
};

export default function ShopPage() {
  return <ShopContent />;
}
