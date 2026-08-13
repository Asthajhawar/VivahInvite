import { HeroArch } from "@/components/sections/HeroArch";
import { CoupleNames } from "@/components/sections/CoupleNames";
import { ShrinathjiHero } from "@/components/sections/ShrinathjiHero";
import { DateRevealCard } from "@/components/sections/DateRevealCard";
import { WeddingDetails } from "@/components/sections/WeddingDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saksham weds Astha | Wedding Invitation",
  description: "Join us to celebrate the wedding of Saksham & Astha.",
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
      <WeddingDetails />
    </main>
  );
}
