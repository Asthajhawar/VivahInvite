import { HeroArch } from "@/components/sections/HeroArch";
import { GaneshReveal } from "@/components/sections/GaneshReveal";
import { CoupleNames } from "@/components/sections/CoupleNames";
import { ShrinathjiHero } from "@/components/sections/ShrinathjiHero";
import { DateRevealCard } from "@/components/sections/DateRevealCard";
import { HaldiMehandi } from "@/components/sections/HaldiMehandi";
import { WeddingDetails } from "@/components/sections/WeddingDetails";

export default function Page() {
  return (
    <main>
      <HeroArch />
      <GaneshReveal />
      <CoupleNames />
      <ShrinathjiHero />
      <DateRevealCard />
      <HaldiMehandi />
      <WeddingDetails />
    </main>
  );
}
