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
      <div className="flex flex-col items-center gap-1">
        <div className="relative h-[170px] w-[170px]">
          <Image
            src="/images/hero/scroll-down-2.png"
            alt=""
            fill
            priority
            className="scroll-frame-shadow"
          />
          <span className="absolute inset-0 flex items-center justify-center font-serif italic text-base font-medium leading-none tracking-widest text-[#7a5a1a] drop-shadow-sm">
            Scroll Down
          </span>
        </div>

        {/* Animated chevron arrows */}
        <div className="flex flex-col items-center -mt-1">
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 12"
              fill="none"
              className="w-6 h-3"
              style={{
                animation: reducedMotion
                  ? "none"
                  : `chevron-pulse 1.5s ease-in-out ${i * 0.25}s infinite`,
              }}
            >
              <polyline
                points="2,2 12,10 22,2"
                stroke="#c9a24b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes chevron-pulse {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(3px); }
        }
      `}</style>
    </div>
  );
}
