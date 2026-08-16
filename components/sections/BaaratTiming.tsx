"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function BaaratTiming() {
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
    // Full viewport height section
    <section ref={sectionRef} className="relative overflow-hidden h-screen">
      {/* Background Image — full cover */}
      <Image
        src="/images/groom-events/baarat.png"
        alt="Baarat procession"
        fill
        className="object-cover object-center"
        priority
      />


      {/* Content — top-center, nudged slightly right */}
      <div
        ref={contentRef}
        className="absolute top-[7rem] left-1/2 -translate-x-1/2 z-10 text-center px-6"
      >
        {/* Label */}
        <div className="flex items-center gap-3 mb-3 justify-center">
          <span className="block h-px w-8 bg-[#c9a24b]/80" />
          <span
            className="font-serif text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "#c9a24b" }}
          >
            Baraat Procession
          </span>
          <span className="block h-px w-8 bg-[#c9a24b]/80" />
        </div>

        {/* Main heading — matches page red */}
        <h2
          className="font-serif italic text-4xl sm:text-5xl font-medium leading-tight drop-shadow-md"
          style={{ color: "#800020" }}
        >
          Baraat Timing
        </h2>

        {/* Time line — olive green like rest of page labels */}
        <p
          className="mt-2 font-serif text-xl sm:text-2xl drop-shadow"
          style={{ color: "#6b7a3a" }}
        >
          Starts from{" "}
          <span className="font-semibold" style={{ color: "#800020" }}>
            2:30 PM
          </span>
        </p>

        {/* Decorative dot row */}
        <div className="mt-4 flex gap-1.5 items-center justify-center">
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a24b]/60" />
          <span className="block w-6 h-px bg-[#c9a24b]/60" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a24b]" />
          <span className="block w-6 h-px bg-[#c9a24b]/60" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a24b]/60" />
        </div>
      </div>
    </section>
  );
}
