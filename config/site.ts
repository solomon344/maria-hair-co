export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Mariéa Hair Co.",
  shortName: "Mariéa",
  tagline: "Naturally Rooted. Beautifully You.",
  description:
    "Botanical hair care for every texture — shampoos, conditioners, oils and treatments made with cold-pressed oils and organic extracts. Shop Mariéa Hair Co. online.",
  // Canonical site URL used for metadata, sitemap and structured data.
  url: (process.env.NEXT_PUBLIC_BASE_URL || "https://marieahairco.com").replace(/\/$/, ""),
  locale: "en_US",
  currency: "GMD",
  keywords: [
    "natural hair care",
    "4C hair products",
    "botanical shampoo",
    "hair oil",
    "curly hair conditioner",
    "Mariéa Hair Co",
  ],
  // Add real profile URLs here; they are published in structured data (sameAs).
  social: [] as string[],
};

export const absoluteUrl = (path = "/") =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
