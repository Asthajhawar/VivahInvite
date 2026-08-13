"use client";

import { useEffect, useRef } from "react";

// ── Petal shape SVG paths (all drawn in a 20×30 viewBox) ────────────
const PETAL_SHAPES = [
  // Rose petal – broad, slightly cupped
  "M10 1 C17 1,20 9,18 17 C16 25,13 30,10 30 C7 30,4 25,2 17 C0 9,3 1,10 1Z",
  // Marigold petal – narrow, elongated, slightly notched tip
  "M10 0 C14 4,15 10,14 18 C13 24,12 28,10 30 C8 28,7 24,6 18 C5 10,6 4,10 0Z",
  // Frangipani / plumeria – wide, rounded, twisted base
  "M10 2 C18 0,22 12,18 20 C15 27,12 31,10 30 C8 31,5 27,2 20 C-2 12,2 0,10 2Z",
  // Slim pointed petal (jasmine-like)
  "M10 0 C13 5,13 14,11 22 C10.5 27,10 30,10 30 C10 30,9.5 27,9 22 C7 14,7 5,10 0Z",
];

// Mixed rose + marigold palette
const PETAL_COLORS = [
  "#e8416a", // deep rose
  "#f06090", // blush rose
  "#f0a020", // marigold gold
  "#f5c842", // marigold yellow
  "#ff8c42", // orange marigold
  "#ffd6e0", // pale blush
  "#fff8ed", // ivory white
  "#e85d7a", // magenta rose
];

const petals = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7 + 5) % 100}%`,
  duration: `${10 + (i % 5) * 3}s`,
  delay: `${(i % 7) * 1.3}s`,
  size: 10 + (i % 3) * 6,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
  path: PETAL_SHAPES[i % PETAL_SHAPES.length],
  rotate: `${(i * 37) % 60 - 30}deg`,
}));

export function PetalDrift() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          el.style.animationPlayState = e.isIntersecting ? "running" : "paused";
          el.querySelectorAll<HTMLElement>(".petal").forEach((p) => {
            p.style.animationPlayState = e.isIntersecting ? "running" : "paused";
          });
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {petals.map((p, i) => (
        <svg
          key={i}
          className="petal"
          viewBox="0 0 20 30"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.6,
            opacity: 0.82,
            animationDuration: p.duration,
            animationDelay: p.delay,
            transform: `rotate(${p.rotate})`,
            overflow: "visible",
          }}
        >
          {/* Gradient fill for depth */}
          <defs>
            <radialGradient id={`pg${i}`} cx="40%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="100%" stopColor={p.color} stopOpacity="1" />
            </radialGradient>
          </defs>
          <path d={p.path} fill={`url(#pg${i})`} />
          {/* Subtle midrib vein */}
          <line
            x1="10" y1="3"
            x2="10" y2="27"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}
