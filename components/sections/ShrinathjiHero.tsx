"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageStyle {
  height: string;
  width: string;
  left: string | number;
  top: string | number;
  right?: string | number;
  bottom?: string | number;
}

interface Breakpoint<T> {
  /** minimum viewport width (px) this style applies from */
  minWidth: number;
  style: T;
}

// ─── Breakpoint configs ───────────────────────────────────────────────────────

/**
 * Breakpoints are evaluated largest-first.
 * To add a new device: insert a new { minWidth, style } row — no other code changes needed.
 */

const ARCH_BREAKPOINTS: Breakpoint<ImageStyle>[] = [
  // >= 405 px
  { minWidth: 405, style: { height: "121%", width: "165%", left: "-32.5%", top: "-25%" } },
  // < 405 px  (default)
  { minWidth: 0,   style: { height: "114%", width: "162%", left: "-30.5%", top: "-19%" } },
];

const COW_LEFT_BREAKPOINTS: Breakpoint<ImageStyle>[] = [
  // >= 405 px
  { minWidth: 405, style: { height: "181%", width: "52%", left: "-6px", top: 0 } },
  // < 405 px  (default)
  { minWidth: 0,   style: { height: "181%", width: "52%", left: 0, top: 0 } },
];

const COW_RIGHT_BREAKPOINTS: Breakpoint<ImageStyle>[] = [
  // >= 405 px
  { minWidth: 405, style: { height: "181%", width: "51%", left: "51.4%", top: 0 } },
  // < 405 px  (default)
  { minWidth: 0,   style: { height: "181%", width: "51%", left: "49.4%", top: 0 } },
];

const DEITY_BREAKPOINTS: Breakpoint<ImageStyle>[] = [
  // >= 405 px
  { minWidth: 405, style: { height: "90%", width: "86%", left: "7%", top: "4%" } },
  // < 405 px  (default — mirrors inset-0 behaviour)
  { minWidth: 0,   style: { height: "100%", width: "100%", left: 0, top: 0 } },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Returns the style for the largest breakpoint that fits the current viewport width. */
function resolveStyle<T>(breakpoints: Breakpoint<T>[], viewportWidth: number): T {
  const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
  return (sorted.find((bp) => viewportWidth >= bp.minWidth) ?? sorted[sorted.length - 1]).style;
}

// ── Realistic SVG petal drift (rose, marigold, frangipani, jasmine) ────────
function PetalDrift() {
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

  const PETAL_SHAPES = [
    // Rose petal – broad, slightly cupped
    "M10 1 C17 1,20 9,18 17 C16 25,13 30,10 30 C7 30,4 25,2 17 C0 9,3 1,10 1Z",
    // Marigold petal – narrow, elongated
    "M10 0 C14 4,15 10,14 18 C13 24,12 28,10 30 C8 28,7 24,6 18 C5 10,6 4,10 0Z",
    // Frangipani / plumeria – wide, rounded
    "M10 2 C18 0,22 12,18 20 C15 27,12 31,10 30 C8 31,5 27,2 20 C-2 12,2 0,10 2Z",
    // Slim pointed petal (jasmine-like)
    "M10 0 C13 5,13 14,11 22 C10.5 27,10 30,10 30 C10 30,9.5 27,9 22 C7 14,7 5,10 0Z",
  ];

  const PETAL_COLORS = [
    "#e8416a", // deep rose
    "#f06090", // blush rose
    "#f0a020", // marigold gold
    "#f5c842", // marigold yellow
    "#ff8c42", // orange marigold
    "#ffd6e0", // pale blush
    "#fff8ed", // ivory
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
          <defs>
            <radialGradient id={`spg${i}`} cx="40%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="100%" stopColor={p.color} stopOpacity="1" />
            </radialGradient>
          </defs>
          <path d={p.path} fill={`url(#spg${i})`} />
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

// ─── Component ────────────────────────────────────────────────────────────────

export function ShrinathjiHero() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const gardenRef   = useRef<HTMLDivElement>(null);
  const cowLeftRef  = useRef<HTMLDivElement>(null);
  const cowRightRef = useRef<HTMLDivElement>(null);
  const archRef     = useRef<HTMLDivElement>(null);
  const deityRef    = useRef<HTMLDivElement>(null);
  const glimmerRef  = useRef<HTMLDivElement>(null);
  const omRef       = useRef<HTMLDivElement>(null);

  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const archStyle     = resolveStyle(ARCH_BREAKPOINTS,      viewportWidth);
  const cowLeftStyle  = resolveStyle(COW_LEFT_BREAKPOINTS,  viewportWidth);
  const cowRightStyle = resolveStyle(COW_RIGHT_BREAKPOINTS, viewportWidth);
  const deityStyle    = resolveStyle(DEITY_BREAKPOINTS,     viewportWidth);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
        // Fade Om symbol down as the first scene layers appear
        .to(omRef.current, { opacity: 0.13, duration: 0.7, ease: "power1.inOut" })
        .from(gardenRef.current, { opacity: 0, y: 60, duration: 0.7 }, "<")
        .from(cowLeftRef.current, { opacity: 0, x: -80, duration: 0.7 }, "<")
        .from(cowRightRef.current, { opacity: 0, x: 80, duration: 0.7 }, "<")
        .from(archRef.current, { opacity: 0, scale: 1.08, duration: 0.8 }, "+=0.1")
        .from(deityRef.current, { opacity: 0, y: 40, scale: 0.96, duration: 0.9 }, "+=0.1");
    },
    { scope: sectionRef }
  );

  // Pause glimmer animation when off-screen (battery saving)
  useEffect(() => {
    const el = glimmerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          el.style.animationPlayState = e.isIntersecting ? "running" : "paused";
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <Image
        src="/images/shrinathji/background.png"
        alt=""
        fill
        className="object-cover"
      />
      {/* Om symbol overlay — full opacity on entry, fades as scene layers appear */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
      >
        <div
          ref={omRef}
          style={{
            position: "relative",
            width: "70%",
            maxWidth: 420,
            aspectRatio: "1 / 1",
            opacity: 1,
          }}
        >
          <Image
            src="/images/couple/om symbol.png"
            alt="Om"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div
        ref={archRef}
        className="absolute"
        style={archStyle}
      >
        <Image
          src="/images/shrinathji/pillar.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div
        ref={gardenRef}
        className="absolute"
        style={{ height: "110%", width: "104%", left: 0, top: 0 }}
      >
        <Image
          src="/images/shrinathji/garden.png"
          alt=""
          fill
          className="object-cover"
          style={{ filter: "blur(1px)" }}
        />
      </div>
      <div
        ref={cowLeftRef}
        className="absolute"
        style={cowLeftStyle}
      >
        <Image
          src="/images/shrinathji/left-cow.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div
        ref={cowRightRef}
        className="absolute"
        style={cowRightStyle}
      >
        <Image
          src="/images/shrinathji/right-cow.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div ref={deityRef} className="absolute" style={deityStyle}>
        <Image
          src="/images/shrinathji/shrinathji.png"
          alt="Shrinathji"
          fill
          className="object-contain"
        />
      </div>
      <div
        ref={glimmerRef}
        className="glimmer-overlay pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(212,175,55,0.3), transparent 40%)",
          mixBlendMode: "overlay",
        }}
      />
      <PetalDrift />
    </section>
  );
}
