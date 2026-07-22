"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useMounted } from "@/hooks/useMounted";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollIndicator() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const mounted = useMounted();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !wrapperRef.current) return;
      gsap.to(wrapperRef.current, {
        y: -8,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: wrapperRef, dependencies: [reducedMotion] }
  );

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY <= 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="relative h-[140px] w-[140px]">
        <Image
          src="/images/hero/scroll-down-2.png"
          alt=""
          fill
          className="scroll-frame-shadow"
        />
        <span className="absolute inset-0 flex items-center justify-center font-serif text-sm text-[#3a4a3a]">
          Scroll Down
        </span>
      </div>
    </div>
  );
}
