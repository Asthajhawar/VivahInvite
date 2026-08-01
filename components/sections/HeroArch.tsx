"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollIndicator } from "./ScrollIndicator";
import { GaneshReveal } from "./GaneshReveal";

export function HeroArch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=80%",
          scrub: true,
          pin: true,
        },
      });

      tl.to(archRef.current, {
        scale: 3,
        transformOrigin: "50% 42%",
        ease: "none",
      })
        // Starts at 0.5 (halfway through the zoom, roughly when cream
        // fill starts dominating the screen) and finishes at 1 (exact
        // end of the zoom / exact moment pin releases). By the time
        // GaneshReveal takes over, this overlay is already fully
        // opaque and looks identical to GaneshReveal's opening frame --
        // so the pin-release cut becomes invisible.
        .to(transitionRef.current, { opacity: 1, ease: "none" }, 0.5);
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <div ref={archRef} className="absolute inset-0">
        <Image
          src="/images/hero/hero-arch.png"
          alt="Wedding mandap archway"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Preview of GaneshReveal's opening frame -- crossfades in on
          top of the zoomed arch so the section transition is smooth
          instead of a hard cut. */}
      <div ref={transitionRef} className="absolute inset-0 z-20 opacity-0">
        <GaneshReveal />
      </div>

      <ScrollIndicator />
    </section>
  );
}
