import "@/styles/globals.css";

import clsx from "clsx";

import { Providers } from "./providers";
import {Metadata, Viewport} from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/json-ld";
import { fontSans, headerFont, bodyFont } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart-drawer";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Natural Botanical Hair Care`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${siteConfig.name} — Natural Botanical Hair Care`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Natural Botanical Hair Care`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

// Site-wide structured data: who the brand is, and the site itself.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon-512.png`,
      slogan: siteConfig.tagline,
      ...(siteConfig.social.length ? { sameAs: siteConfig.social } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a120b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <JsonLd data={siteJsonLd} />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background-secondary font-sans antialiased",
          fontSans.variable,
          headerFont.variable,
          bodyFont.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <CartProvider>
            <div className="relative flex flex-col bg-white/80 ">
              <Navbar />
              <main className="">
                {children}
              </main>
              <Footer />
            </div>
            <CartDrawer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}