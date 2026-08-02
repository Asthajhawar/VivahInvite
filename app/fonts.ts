import { Noto_Serif_Devanagari, Cormorant_Garamond, Pinyon_Script } from "next/font/google";

export const devanagariFont = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-devanagari",
  display: "swap",
});

export const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const scriptFont = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});
