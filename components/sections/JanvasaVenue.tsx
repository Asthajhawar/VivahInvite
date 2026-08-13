"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { MapModal } from "./MapModal";

const VENUE_NAME  = "Hotel Nesta";
const VENUE_SHORT = "GH-1, Haldighati Marg, Pratap Nagar, Jaipur";
const VENUE_QUERY = "Hotel Nesta GH-1, Haldighati Marg, Sector 9/Sector 17, Pratap Nagar, Jaipur, 302033";

export function JanvasaVenue() {
  const [mapOpen, setMapOpen] = useState(false);
  const sectionRef  = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);

  // Fade-up entrance animation for the content block
  useGSAP(
    () => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20"
    >
      {/* Background */}
      <Image
        src="/images/ganesh/into_wallpaper_keyframe_1.png"
        alt=""
        fill
        className="-z-10 object-cover"
        priority
      />

      {/* Content — height driven by this block */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-md text-center px-4"
      >
        {/* Section label */}
        <h2 className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-[#6b7a3a]">
          Janvasa Location
        </h2>
        <p className="mt-1 font-serif italic text-4xl font-medium text-[#800020] sm:text-5xl">
          {VENUE_NAME}
        </p>
        <p className="text-sm text-[#6b7a3a] mt-1">{VENUE_SHORT}</p>

        {/* Map thumbnail button */}
        <button
          onClick={() => setMapOpen(true)}
          className="relative mx-auto mt-4 block w-full max-w-xs overflow-hidden rounded-lg border border-[#c9a24b] transition-transform hover:scale-[1.02]"
          aria-label="Tap to view live map to Janvasa venue"
        >
          <Image
            src="/images/venue/janvasa-location.png"
            alt="Tap to view live map to Janvasa venue"
            width={600}
            height={450}
            className="w-full"
          />
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/40 py-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="w-3.5 h-3.5"
              style={{ animation: "janvasa-pin-pulse 1.4s ease-in-out infinite" }}
            >
              <path
                d="M12 2C8.68 2 6 4.68 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.32-2.68-6-6-6z"
                fill="#FFD700"
                opacity="0.9"
              />
              <circle cx="12" cy="8" r="2.2" fill="white" opacity="0.8" />
            </svg>
            <span
              className="text-xs text-white font-serif italic tracking-wide"
              style={{ animation: "janvasa-label-fade 1.4s ease-in-out infinite" }}
            >
              Tap to view live map
            </span>
          </span>
          <style>{`
            @keyframes janvasa-pin-pulse {
              0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
              50%       { transform: translateY(-2px) scale(1.15); opacity: 1; }
            }
            @keyframes janvasa-label-fade {
              0%, 100% { opacity: 0.6; }
              50%       { opacity: 1; }
            }
          `}</style>
        </button>
      </div>

      <MapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        query={VENUE_QUERY}
      />
    </section>
  );
}
