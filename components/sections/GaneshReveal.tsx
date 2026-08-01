"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GaneshReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ganeshRef = useRef<HTMLDivElement>(null);
  const flowerARef = useRef<HTMLDivElement>(null);
  const flowerBRef = useRef<HTMLDivElement>(null);
  const textTopRef = useRef<HTMLParagraphElement>(null);
  const textBottomRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      // ── Phase 1: Ganesh starts super-zoomed-in (matching the end state
      //    of HeroArch's arch zoom), then zooms OUT to its resting size.
      //    All other elements fade/slide in in parallel during this zoom-out.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      });

      // Ganesh enters at scale ~5 (matching HeroArch exit) and settles
      // at scale 1.65 -- confirmed resting size from DevTools.
      tl.fromTo(
        ganeshRef.current,
        { scale: 5, transformOrigin: "50% 42%" },
        { scale: 1.65, transformOrigin: "50% 50%", ease: "power2.out", duration: 1 }
      );

      // Flowers slide in AND grow to their confirmed resting scale
      // (206% for flower A, 183% for flower B) during the same window.
      tl.fromTo(
        flowerARef.current,
        { opacity: 0, x: -60, y: -60, scale: 1 },
        { opacity: 1, x: 0, y: 0, scale: 2.06, ease: "power2.out", duration: 1 },
        "<" // starts at the same time as the ganesh zoom-out
      )
        .fromTo(
          flowerBRef.current,
          { opacity: 0, x: 60, y: 60, scale: 1 },
          { opacity: 1, x: 0, y: 0, scale: 1.83, ease: "power2.out", duration: 1 },
          "<"
        )
        // Text appears only after Ganesh has fully settled at its resting position
        .from(
          textTopRef.current,
          { opacity: 0, y: 20, ease: "power1.out", duration: 0.6 },
          ">" // starts after zoom-out ends
        )
        .from(
          textBottomRef.current,
          { opacity: 0, y: 20, ease: "power1.out", duration: 0.6 },
          "<0.1"
        )
        // Hold everything fully visible so the user can read before unpinning
        .to({}, { duration: 1.2 }, ">");

      if (window.matchMedia("(pointer: fine)").matches) {
        const flowerX = gsap.quickTo(flowerARef.current, "xPercent", {
          duration: 0.5,
        });
        const ganeshX = gsap.quickTo(ganeshRef.current, "xPercent", {
          duration: 0.6,
        });

        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          flowerX(nx * -8);
          ganeshX(nx * 3);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <Image
        src="/images/ganesh/into_wallpaper_keyframe_1.png"
        alt=""
        fill
        className="object-cover"
      />
      {/* Bigger base font size, no longer relying on a scale trick.
          clamp(min, preferred, max) means: never smaller than the first
          value, never bigger than the last, and grows smoothly with
          viewport width in between -- so it scales on its own across
          phone/tablet/desktop without you setting separate breakpoints. */}
      <p
        ref={textTopRef}
        className="absolute left-[49%] top-32 z-30 -translate-x-1/2 whitespace-nowrap font-devanagari text-[clamp(1.75rem,1.4rem+2vw,3rem)] text-[#800020]"
      >
        ॐ श्री गणेशाय नमः॥
      </p>

      {/* Container resized to match the confirmed resting frame
          (height 87% / width 105%). Actual growth still comes from
          the scale animation above, ending at 1.65. */}
      <div
        ref={ganeshRef}
        className="absolute left-1/2 top-[42%] z-10 h-[87%] w-[105%] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/images/ganesh/ganeshji.png"
          alt="Lord Ganesh"
          fill
          className="object-contain scale-[0.85]"
          style={{ left: "2.2%" }}
        />
      </div>

      <div ref={flowerARef} className="absolute left-0 top-0 z-20 h-32 w-32">
        <Image
          src="/images/ganesh/intro_flower_frame_5.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div
        ref={flowerBRef}
        className="absolute z-20 h-60 w-40"
        style={{ bottom: "-10.3%", right: "-1.5%" }}
      >
        <Image
          src="/images/ganesh/intro_flower_frame_3.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* 20px base (text-xl = 20px), bold added, and same clamp()
          responsive scaling as the top text. */}
      <p
        ref={textBottomRef}
        className="absolute bottom-32 left-1/2 z-30 -translate-x-1/2 text-center font-devanagari font-bold leading-relaxed text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] text-[#800020]"
      >
        वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
        <br />
        निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
      </p>
    </section>
  );
}
