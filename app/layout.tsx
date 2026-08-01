import "./globals.css";
import type { Metadata } from "next";
import { LenisProvider } from "@/components/LenisProvider";
import { devanagariFont, serifFont } from "./fonts";

export const metadata: Metadata = {
  title: "Astha & Saksham",
  description: "Wedding invitation — Astha weds Saksham",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Astha & Saksham",
    description: "Join us in celebrating our wedding",
    url: "https://vivah-invite.vercel.app/",
    images: [
      {
        url: "https://vivah-invite.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
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
