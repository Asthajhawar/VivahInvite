import "./globals.css";
import type { Metadata } from "next";
import { LenisProvider } from "@/components/LenisProvider";
import { devanagariFont, serifFont, scriptFont } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://vivah-invite.vercel.app"),
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
        url: "https://vivah-invite.vercel.app/invite1.jpg",
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
      className={`${devanagariFont.variable} ${serifFont.variable} ${scriptFont.variable}`}
    >
      <body className="bg-[#fff8ed] text-[#1b2a4a] antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
