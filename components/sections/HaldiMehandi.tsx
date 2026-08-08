"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface WeddingEvent {
  heading: string;
  date: string;
  time: string;
  image: string;
}

const EVENTS: WeddingEvent[] = [
  {
    heading: "Haldi Ceremony",
    date: "25 November 2026",
    time: "10:00 AM – 12:00 PM",
    image: "/images/haldi-mehandi/event-haldi.jpeg",
  },
  {
    heading: "Mehandi Ceremony",
    date: "24 November 2026",
    time: "4:00 PM – 7:00 PM",
    image: "/images/haldi-mehandi/event-mehandi.jpeg",
  },
  {
    heading: "Maayra Ceremony",
    date: "25 November 2026",
    time: "4:00 PM – 7:00 PM",
    image: "/images/haldi-mehandi/event-maayra.png",
  },
];

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
            p.style.animationPlayState = e.isIntersecting
              ? "running"
              : "paused";
          });
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Petal shape SVG paths (all drawn in a 20×30 viewBox) ────────────
  // Each path traces a distinct flower-petal silhouette.
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
    // Slight initial tilt so they don't all fall perfectly vertical
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

export function HaldiMehandi() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function onTrackScroll() {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0] as HTMLElement | undefined;
    const cardWidth = first?.clientWidth ?? 1;
    const gap = 16;
    setActiveIndex(Math.round(track.scrollLeft / (cardWidth + gap)));
  }

  function scrollToCard(i: number) {
    const card = trackRef.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }

  return (
    <section className="relative overflow-hidden py-20">
      <Image
        src="/images/haldi-mehandi/background.png"
        alt=""
        fill
        className="-z-10 object-cover"
      />
      <Image
        src="/images/haldi-mehandi/decorations.png"
        alt=""
        fill
        className="-z-10 object-cover"
        style={{ top: "-2.2%" }}
      />
      <div
        className="absolute -z-10"
        style={{ height: "174%", width: "105%", left: 0, top: 0 }}
      >
        <Image
          src="/images/haldi-mehandi/ceremonial_objects.png"
          alt=""
          fill
          className="object-contain"
          style={{ scale: "109%" }}
        />
      </div>
      <PetalDrift />

      <div className="relative z-10 mb-6 text-center">
        <h2 className="font-script font-semibold text-5xl text-[#800020]">
          Events
        </h2>
        <p className="text-sm text-[#6b7a3a]">Swipe through the celebrations</p>
      </div>

      <div
        ref={trackRef}
        onScroll={onTrackScroll}
        data-lenis-prevent
        className="no-scrollbar flex gap-4 overflow-x-auto px-5"
        style={{ scrollSnapType: "x mandatory", touchAction: "pan-x" }}
      >
        {EVENTS.map((event) => (
          <article
            key={event.heading}
            className="flex-none basis-[85%] rounded-xl border border-[#c9a24b] bg-[#fff8ed] p-4 shadow-md md:basis-[45%]"
            style={{ scrollSnapAlign: "center" }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src={event.image}
                alt={event.heading}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-3 font-serif text-lg text-[#1b2a4a]">
              {event.heading}
            </h3>
            <p className="mt-1 flex flex-wrap gap-4 text-sm text-[#6b7a3a]">
              <span>{event.date}</span>
              <span>{event.time}</span>
            </p>
          </article>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {EVENTS.map((event, i) => (
          <button
            key={event.heading}
            aria-label={`Go to ${event.heading}`}
            onClick={() => scrollToCard(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === activeIndex ? "bg-[#c9a24b]" : "bg-[#e3d3ad]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
