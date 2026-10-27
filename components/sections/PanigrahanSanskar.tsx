"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function PanigrahanSanskar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden h-screen">
      {/* Background Image — full cover */}
      <Image
        src="/images/pannigrahan/pannigrahan.png"
        alt="Panigrahan Sanskar ceremony at Godhuli Bela"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient covers the flower/bell zone at top so text always pops */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-transparent z-[1]" />

      {/*
        Content — positioned BELOW the hanging flowers/bells.
        The decorations take ~37-40 vh on small phones, less on larger screens.
        We use viewport-height offsets so text clears them at every size.
      */}
      <div
        ref={contentRef}
        className="absolute left-1/2 -translate-x-1/2 z-10 text-center px-6 w-full
                   top-[35vh] sm:top-[31vh] md:top-[25vh] lg:top-[19vh]"
      >
        {/* Label */}
        <div className="flex items-center gap-3 mb-2 sm:mb-3 justify-center">
          <span className="block h-px w-6 sm:w-8 bg-[#c9a24b]/80" />
          <span
            className="font-serif text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.28em]"
            style={{ color: "#c9a24b" }}
          >
            Sacred Ceremony
          </span>
          <span className="block h-px w-6 sm:w-8 bg-[#c9a24b]/80" />
        </div>

        {/* Main heading — scales with viewport */}
        <h2
          className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-medium leading-tight drop-shadow-md"
          style={{ color: "#800020" }}
        >
          Panigrahan Sanskar
        </h2>

        {/* Subtitle */}
        <p
          className="mt-1.5 sm:mt-2 font-serif text-lg sm:text-xl md:text-2xl drop-shadow"
          style={{ color: "#6b7a3a" }}
        >
          at{" "}
          <span className="font-semibold" style={{ color: "#800020" }}>
            Godhuli Bela
          </span>
        </p>

        {/* Decorative dot row */}
        <div className="mt-3 sm:mt-4 flex gap-1.5 items-center justify-center">
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a24b]/60" />
          <span className="block w-5 sm:w-6 h-px bg-[#c9a24b]/60" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a24b]" />
          <span className="block w-5 sm:w-6 h-px bg-[#c9a24b]/60" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a24b]/60" />
        </div>
      </div>
    </section>
  );
}
