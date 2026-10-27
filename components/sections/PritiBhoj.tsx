"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function PritiBhoj() {
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
        src="/images/pannigrahan/pritibhoj.png"
        alt="Priti Bhoj celebration"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Multi-directional gradient — darkens top (tree zone) and adds soft veil in center */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-[1]" />

      {/*
        Content — placed in the clear sky band below the tree canopy.
        Tree + lanterns occupy ~42-48 vh on mobile, less on wider screens.
        Centered so it avoids both left tree and right edge clipping.
      */}
      <div
        ref={contentRef}
        className="absolute right-4 sm:right-8 z-10 text-center w-[60%] max-w-xs
                   top-[38vh] sm:top-[32vh] md:top-[26vh] lg:top-[20vh]"
      >
        {/* Frosted pill backdrop — ensures text is legible over any part of the image */}
        <div className="rounded-2xl px-5 py-4 sm:px-6 sm:py-5"
          style={{ background: "rgba(255,245,235,0.18)", backdropFilter: "blur(6px)" }}
        >
          {/* Label */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 justify-center">
            <span className="block h-px w-5 sm:w-7 bg-[#c9a24b]/80" />
            <span
              className="font-serif text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.28em]"
              style={{ color: "#c9a24b" }}
            >
              Grand Celebration
            </span>
            <span className="block h-px w-5 sm:w-7 bg-[#c9a24b]/80" />
          </div>

          {/* Main heading */}
          <h2
            className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-medium leading-tight drop-shadow-md"
            style={{ color: "#800020" }}
          >
            Priti Bhoj
          </h2>

          {/* Time line */}
          <p
            className="mt-1.5 sm:mt-2 font-serif text-lg sm:text-xl md:text-2xl drop-shadow"
            style={{ color: "#6b7a3a" }}
          >
            Starts at{" "}
            <span className="font-semibold" style={{ color: "#800020" }}>
              7:00 PM
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
      </div>
    </section>
  );
}
