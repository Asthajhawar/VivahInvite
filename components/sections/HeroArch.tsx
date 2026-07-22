"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollIndicator } from "./ScrollIndicator";

export function HeroArch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const ganeshLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: true,
          pin: true,
        },
      });

      tl.to(archRef.current, {
        scale: 5,
        transformOrigin: "50% 42%",
        ease: "none",
      }).to(ganeshLayerRef.current, { opacity: 1, duration: 0.3 }, ">-0.3");
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
      <div ref={ganeshLayerRef} className="absolute inset-0 opacity-0">
        <Image
          src="/images/ganesh/ganeshji.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <ScrollIndicator />
    </section>
  );
}
