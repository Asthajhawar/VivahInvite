// Route: /groom/events
// Full groom invitation page including the groom-specific pre-wedding ceremonies.

import { HeroArch } from "@/components/sections/HeroArch";
import { CoupleNames } from "@/components/sections/CoupleNames";
import { ShrinathjiHero } from "@/components/sections/ShrinathjiHero";
import { DateRevealCard } from "@/components/sections/DateRevealCard";
import { HaldiMehandi } from "@/components/sections/HaldiMehandi";
import { JanvasaVenue } from "@/components/sections/JanvasaVenue";
import { WeddingDetails } from "@/components/sections/WeddingDetails";
import { BaaratTiming } from "@/components/sections/BaaratTiming";
import type { Metadata } from "next";

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

// Note: Next.js serves files from /public as the web root.
// Paths start with /images/... (NOT /public/images/...)
const GROOM_EVENTS = [
  {
    heading: "Matkor Ceremony",
    date: "21 November 2026",
    time: "",
    image: "/images/groom-events/matkor.png",
  },
  {
    heading: "Haldi Ceremony",
    date: "21 November 2026",
    time: "",
    image: "/images/groom-events/haldi.png",
  },
  {
    heading: "Priti Bhoj",
    date: "21 November 2026",
    time: "4:00 PM – 7:00 PM",
    image: "/images/groom-events/priti-bhoj.png",
  },
  {
    heading: "Maatrika Pooja",
    date: "22 November 2026",
    time: "",
    image: "/images/groom-events/Maatrika-Pooja.png",
  },
];

/**
 * Groom-side full invitation page including pre-wedding ceremonies.
 * Sections: Hero → Couple Names → Shrinathji → Date → Events → Wedding Details
 */
export default function GroomEventsPage() {
  return (
    <main>
      <HeroArch />
      <CoupleNames perspective="groom" />
      <ShrinathjiHero />
      <DateRevealCard />
      <HaldiMehandi events={GROOM_EVENTS} />
      <JanvasaVenue />
      <BaaratTiming />
      <WeddingDetails />
    </main>
  );
}
