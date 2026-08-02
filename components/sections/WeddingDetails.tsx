"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { MapModal } from "./MapModal";

const VENUE_NAME = "Surbhi Sadan";
const VENUE_ADDRESS = "Sanganer Jaipur, Rajasthan";

export function WeddingDetails() {
  const [mapOpen, setMapOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const landscapeRef = useRef<HTMLDivElement>(null);
  const mandapRef = useRef<HTMLDivElement>(null);
  const coupleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Landscape fades up from below
      tl.from(landscapeRef.current, {
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: "power2.out",
      })
        // 2. Mandap scales in
        .from(
          mandapRef.current,
          { opacity: 0, scale: 0.93, duration: 0.9, ease: "power2.out" },
          "-=0.5"
        )
        // 3. Couple slides in from left
        .from(
          coupleRef.current,
          { opacity: 0, x: -70, duration: 0.9, ease: "power2.out" },
          "-=0.5"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden py-32"
    >
      <Image
        src="/images/venue/background.png"
        alt=""
        fill
        className="-z-10 object-cover"
      />

      {/* Landscape — fades & rises first */}
      <div
        ref={landscapeRef}
        className="absolute -z-10"
        style={{ height: "90%", width: "100%", left: 0, top: "18.8%" }}
      >
        <Image
          src="/images/venue/landscape.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Mandap — scales in second */}
      <div
        ref={mandapRef}
        className="absolute -z-10"
        style={{ height: "146%", width: "100%", left: 0, top: 0 }}
      >
        <Image
          src="/images/venue/mandap.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Top decorations — static, no animation */}
      <div
        className="absolute -z-10"
        style={{ height: "57%", width: "100%", left: 0, top: "-5.1%" }}
      >
        <Image
          src="/images/venue/top-decorations.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Couple — slides in from left last */}
      <div
        ref={coupleRef}
        className="absolute -z-10"
        style={{ height: "173%", width: "32%", left: "35.3%", top: 0 }}
      >
        <Image
          src="/images/venue/couple.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div
        className="relative z-10 mx-auto max-w-md text-center"
        style={{ top: "clamp(-110px, -12.3vh, -60px)" }}
      >
        <h2 className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-[#6b7a3a]">Wedding Venue</h2>
        <p className="mt-1 font-serif italic text-4xl font-medium text-[#800020] sm:text-5xl">{VENUE_NAME}</p>
        <p className="text-sm text-[#6b7a3a]">{VENUE_ADDRESS}</p>

        <button
          onClick={() => setMapOpen(true)}
          className="relative mx-auto mt-4 block w-full max-w-xs overflow-hidden rounded-lg border border-[#c9a24b] transition-transform hover:scale-[1.02]"
        >
          <Image
            src="/images/venue/venue-map-illustration.png"
            alt="Tap to view live map to venue"
            width={600}
            height={450}
            className="w-full"
          />
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/40 py-1.5">
            {/* Tap / map-pin icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5"
              style={{ animation: "map-pin-pulse 1.4s ease-in-out infinite" }}>
              <path d="M12 2C8.68 2 6 4.68 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.32-2.68-6-6-6z"
                fill="#FFD700" opacity="0.9"/>
              <circle cx="12" cy="8" r="2.2" fill="white" opacity="0.8"/>
            </svg>
            <span className="text-xs text-white font-serif italic tracking-wide"
              style={{ animation: "map-label-fade 1.4s ease-in-out infinite" }}>
              Tap to view live map
            </span>
          </span>
          <style>{`
            @keyframes map-pin-pulse {
              0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
              50%       { transform: translateY(-2px) scale(1.15); opacity: 1; }
            }
            @keyframes map-label-fade {
              0%, 100% { opacity: 0.6; }
              50%       { opacity: 1; }
            }
          `}</style>
        </button>
      </div>

      <MapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        query={`${VENUE_NAME}, ${VENUE_ADDRESS}`}
      />
    </section>
  );
}
