import { HeroArch } from "@/components/sections/HeroArch";
import { CoupleNames } from "@/components/sections/CoupleNames";
import { ShrinathjiHero } from "@/components/sections/ShrinathjiHero";
import { DateRevealCard } from "@/components/sections/DateRevealCard";
import { HaldiMehandi } from "@/components/sections/HaldiMehandi";
import { WeddingDetails } from "@/components/sections/WeddingDetails";
import { BaaratTiming } from "@/components/sections/BaaratTiming";

export default function Page() {
  return (
    <main>
      <HeroArch />
      <CoupleNames />
      <ShrinathjiHero />
      <DateRevealCard />
      <HaldiMehandi />
      <BaaratTiming title="Baarat Swaagat" startTime="4:00 PM" />
      <WeddingDetails />
    </main>
  );
}
