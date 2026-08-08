"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoupleInfo {
  brideName: string;
  brideParentage: string;
  groomName: string;
  groomParentage: string;
}

interface ImageStyle {
  height: string;
  width: string;
  left: string;
  top: string | number;
}

interface Breakpoint<T> {
  /** minimum viewport width (px) this style applies from */
  minWidth: number;
  style: T;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COUPLE: CoupleInfo = {
  brideName: "Astha",
  brideParentage: "D/O Mrs. Jyoti & Mr. Giriraj Jhawar",
  groomName: "Saksham",
  groomParentage: "S/O Mrs. Shewta & Mr. Rajeev Kumar",
};

/**
 * Breakpoints are evaluated largest-first.
 * To add a new device: insert a new { minWidth, style } entry — no other code changes needed.
 */
const MANDAP_BREAKPOINTS: Breakpoint<ImageStyle>[] = [
  // >= 440 px  (e.g. Galaxy S24, Pixel 8)
  { minWidth: 440, style: { height: "151%", width: "69%", left: "14.5%", top: "5px" } },
  // >= 405 px  (e.g. iPhone 14 Pro, Pixel 7)
  { minWidth: 405, style: { height: "149%", width: "73%", left: "12.5%", top: "5px" } },
  // < 405 px   (default / smallest phones)
  { minWidth: 0,   style: { height: "145%", width: "73%", left: "12.5%", top: "5px" } },
];

const PEACOCK_BREAKPOINTS: Breakpoint<ImageStyle>[] = [
  // >= 440 px
  { minWidth: 440, style: { height: "191%", width: "30%", left: "28.4%", top: "2px" } },
  // >= 405 px
  { minWidth: 405, style: { height: "189%", width: "39%", left: "22.4%", top: "3px" } },
  // < 405 px
  { minWidth: 0,   style: { height: "183%", width: "41%", left: "20.4%", top: 0 } },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Returns the style for the largest breakpoint that fits the current viewport width. */
function resolveStyle<T>(breakpoints: Breakpoint<T>[], viewportWidth: number): T {
  const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
  return (sorted.find((bp) => viewportWidth >= bp.minWidth) ?? sorted[sorted.length - 1]).style;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CoupleNames() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leavesRef  = useRef<HTMLDivElement>(null);
  const mandapRef  = useRef<HTMLDivElement>(null);
  const peacockRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const omRef      = useRef<HTMLDivElement>(null);

  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const mandapStyle  = resolveStyle(MANDAP_BREAKPOINTS,  viewportWidth);
  const peacockStyle = resolveStyle(PEACOCK_BREAKPOINTS, viewportWidth);

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
        // Fade Om down as the first scene layers appear
        .to(omRef.current, { opacity: 0.13, duration: 0.7, ease: "power1.inOut" })
        .from(leavesRef.current, { opacity: 0, y: 50, duration: 0.7 }, "<")
        .from(mandapRef.current, { opacity: 0, scale: 0.95, duration: 0.8 }, "+=0.1")
        .from(peacockRef.current, { opacity: 0, x: 40, duration: 0.8 }, "+=0.1")
        .from(
          textRef.current!.querySelectorAll(".reveal-line"),
          {
            opacity: 0,
            y: 10,
            stagger: 0.12,
            duration: 0.6,
          },
          "+=0.1"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <Image
        src="/images/couple/background.png"
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
      <div ref={leavesRef} className="absolute inset-x-0 bottom-0 top-[250px]">
        <Image
          src="/images/couple/leaves.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div
        ref={mandapRef}
        className="absolute"
        style={{ ...mandapStyle, bottom: 0 }}
      >
        <Image
          src="/images/couple/mandap.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div
        ref={peacockRef}
        className="absolute"
        style={{ ...peacockStyle, bottom: 0 }}
      >
        <Image
          src="/images/couple/peacock.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div
        ref={textRef}
        className="absolute left-1/2 top-[27%] z-30 -translate-x-1/2 -translate-y-1/2 px-4 text-center"
      >
        <p className="reveal-line text-xs tracking-wide text-[#1b2a4a] sm:text-sm">
          We cordially invite you to the
          <br />
          wedding ceremony of
        </p>
        <p className="reveal-line mt-2 font-serif italic tracking-wide text-5xl font-medium text-[#800020] capitalize first-letter:text-7xl sm:text-6xl sm:first-letter:text-8xl">
          {COUPLE.brideName}
        </p>
        <p className="reveal-line text-xs text-[#6b7a3a] sm:text-sm">
          {COUPLE.brideParentage}
        </p>
        <div className="reveal-line my-3 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#c9a24b]" />
          <span className="font-script italic text-2xl text-[#c9a24b]">Weds</span>
          <span className="h-px w-10 bg-[#c9a24b]" />
        </div>
        <p className="reveal-line font-serif italic tracking-wide text-5xl font-medium text-[#800020] capitalize first-letter:text-7xl sm:text-6xl sm:first-letter:text-8xl -mt-5">
          {COUPLE.groomName}
        </p>
        <p className="reveal-line text-xs text-[#6b7a3a] sm:text-sm">
          {COUPLE.groomParentage}
        </p>
      </div>
    </section>
  );
}
