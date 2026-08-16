"use client";

/**
 * ScrollDownHint
 * ──────────────
 * Minimal, non-intrusive "Scroll Down" prompt shown AFTER the video ends,
 * while the pin is still active. Sits above the overlay (z-30), bottom-center.
 *
 * Intentionally small — just a soft glow pill with text + animated chevrons.
 * No large circular frame so it doesn't compete with the Ganesh / video.
 */

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  visible: boolean;
}

export function ScrollDownHint({ visible }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-1.5">
        {/* Label */}
        <span
          className="font-serif italic tracking-[0.18em] text-[#f5e6c8] drop-shadow-md"
          style={{ fontSize: "0.78rem" }}
        >
          Scroll Down
        </span>

        {/* Three staggered chevrons */}
        <div className="flex flex-col items-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 12"
              fill="none"
              className="w-5 h-2.5"
              style={{
                animation: reducedMotion
                  ? "none"
                  : `sdh-chevron 1.6s ease-in-out ${i * 0.2}s infinite`,
              }}
            >
              <polyline
                points="2,2 12,10 22,2"
                stroke="#d4af37"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes sdh-chevron {
          0%, 100% { opacity: 0.15; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}
