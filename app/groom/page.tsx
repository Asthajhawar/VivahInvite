import { HeroArch } from "@/components/sections/HeroArch";
import { CoupleNames } from "@/components/sections/CoupleNames";
import { ShrinathjiHero } from "@/components/sections/ShrinathjiHero";
import { DateRevealCard } from "@/components/sections/DateRevealCard";
import { WeddingDetails } from "@/components/sections/WeddingDetails";
import type { Metadata } from "next";
import { JanvasaVenue } from "@/components/sections/JanvasaVenue";
import { BaaratTiming } from "@/components/sections/BaaratTiming";

export const metadata: Metadata = {
  title: "Saksham & Astha Wedding Invitation",
  description:
    "Join us for Saksham & Astha pre-wedding celebrations — Matkor, Haldi, Priti Bhoj & Maatrika Pooja.",
  openGraph: {
    title: "Saksham & Astha Wedding Invitation",
    description:
      "Join us for Saksham & Astha's wedding celebrations — Matkor, Haldi, Priti Bhoj & Maatrika Pooja.",
    url: "https://vivah-invite.vercel.app/groom/events",
    images: [
      {
        url: "https://vivah-invite.vercel.app/Inital.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

/**
 * Groom-side view of the wedding invitation.
 *
 * Differences from the default (bride-side) page:
 *  • Haldi & Mehandi section is hidden — visit /groom/events for groom's ceremonies
 *  • CoupleNames shows Saksham first, then Astha
 */
export default function GroomPage() {
  return (
    <main>
      <HeroArch />
      <CoupleNames perspective="groom" />
      <ShrinathjiHero />
      <DateRevealCard />
      <JanvasaVenue />
      <BaaratTiming />
      <WeddingDetails />
    </main>
  );
}
