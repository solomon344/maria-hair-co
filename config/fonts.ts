import { Fira_Code as FontMono, Inter as FontSans, Libre_Caslon_Text as HeaderFont, Manrope as BodyFont, } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const headerFont = HeaderFont({
  subsets: ["latin"],
  variable: "--font-header",
  weight: ["400", "700"],
});

export const bodyFont = BodyFont({
  subsets: ["latin"],
  variable: "--font-body",
});
