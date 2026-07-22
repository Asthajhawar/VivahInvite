"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function GaneshReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ganeshRef = useRef<HTMLDivElement>(null);
  const flowerARef = useRef<HTMLDivElement>(null);
  const flowerBRef = useRef<HTMLDivElement>(null);
  const textTopRef = useRef<HTMLParagraphElement>(null);
  const textBottomRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
        },
      });

      tl.from(ganeshRef.current, { opacity: 0, y: 40 })
        .from(flowerARef.current, { opacity: 0, x: -60, y: -60 }, "<0.1")
        .from(flowerBRef.current, { opacity: 0, x: 60, y: 60 }, "<0.1")
        .to(ganeshRef.current, { y: "-20%", scale: 0.75, ease: "power1.inOut" })
        .to(
          [flowerARef.current, flowerBRef.current],
          { scale: 1.25, opacity: 1 },
          "<"
        )
        .from(textTopRef.current, { opacity: 0, y: 10 }, ">-0.2")
        .from(textBottomRef.current, { opacity: 0, y: 10 }, "<0.15");

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
        className="absolute left-1/2 top-8 z-30 -translate-x-1/2 font-devanagari text-lg text-[#800020]"
      >
        ॐ श्री गणेशाय नमः॥
      </p>

      <div
        ref={ganeshRef}
        className="absolute left-1/2 top-1/2 z-10 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2"
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
        className="absolute bottom-0 right-0 z-20 h-32 w-32"
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
        className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center font-devanagari text-base leading-relaxed text-[#800020]"
      >
        वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
        <br />
        निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
      </p>
    </section>
  );
}
