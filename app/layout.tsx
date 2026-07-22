import "./globals.css";
import type { Metadata } from "next";
import { LenisProvider } from "@/components/LenisProvider";
import { devanagariFont, serifFont } from "./fonts";

export const metadata: Metadata = {
  title: "Astha & Saksham",
  description: "Wedding invitation — Astha weds Saksham",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${devanagariFont.variable} ${serifFont.variable}`}
    >
      <body className="bg-[#fff8ed] text-[#1b2a4a] antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
