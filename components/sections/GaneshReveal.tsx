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
          start: "top top",
          end: "+=250%",
          scrub: true,
          pin: true,
        },
      });

      // Ganesh enters at scale ~5 (matching HeroArch exit) and zooms back to 1.
      // transformOrigin mirrors HeroArch so it feels continuous.
      tl.fromTo(
        ganeshRef.current,
        { scale: 5, transformOrigin: "50% 42%" },
        { scale: 1, transformOrigin: "50% 50%", ease: "none", duration: 1 }
      );

      // Flowers and text all animate in during the same zoom-out window.
      tl.from(
        flowerARef.current,
        { opacity: 0, x: -60, y: -60, ease: "none", duration: 1 },
        "<" // starts at the same time as the zoom-out
      )
        .from(
          flowerBRef.current,
          { opacity: 0, x: 60, y: 60, ease: "none", duration: 1 },
          "<"
        )
        // Text appears only after Ganesh has fully settled at its resting position
        .from(
          textTopRef.current,
          { opacity: 0, y: 20, ease: "none", duration: 0.6 },
          ">" // starts after zoom-out ends
        )
        .from(
          textBottomRef.current,
          { opacity: 0, y: 20, ease: "none", duration: 0.6 },
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
      <p
        ref={textTopRef}
        className="absolute left-1/2 top-24 z-30 -translate-x-1/2 font-devanagari text-2xl text-[#800020]"
      >
        ॐ श्री गणेशाय नमः॥
      </p>

      <div
        ref={ganeshRef}
        className="absolute left-1/2 top-1/2 z-10 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/images/ganesh/ganeshji.png"
          alt="Lord Ganesh"
          fill
          className="object-contain"
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
        className="absolute bottom-0 right-0 z-20 h-56 w-40"
      >
        <Image
          src="/images/ganesh/intro_flower_frame_3.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <p
        ref={textBottomRef}
        className="absolute bottom-32 left-1/2 z-30 -translate-x-1/2 text-center font-devanagari text-xl leading-relaxed text-[#800020]"
      >
        वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
        <br />
        निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
      </p>
    </section>
  );
}
