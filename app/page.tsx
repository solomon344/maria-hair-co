import type { Metadata } from "next";

import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function HomePage() {
  return <HomeContent />;
}
