import "@/styles/globals.css";

import clsx from "clsx";

import { Providers } from "./providers";
import {Metadata, Viewport} from "next";
import { siteConfig } from "@/config/site";
import { fontSans, headerFont, bodyFont } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart-drawer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
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