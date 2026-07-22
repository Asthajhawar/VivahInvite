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
    date: "14 December 2026",
    time: "10:00 AM – 12:00 PM",
    image: "/images/haldi-mehandi/event-haldi.jpeg",
  },
  {
    heading: "Mehandi Ceremony",
    date: "14 December 2026",
    time: "4:00 PM – 7:00 PM",
    image: "/images/haldi-mehandi/event-mehandi.jpeg",
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

  const petals = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 7 + 5) % 100}%`,
    duration: `${10 + (i % 5) * 3}s`,
    delay: `${(i % 7) * 1.3}s`,
    size: 10 + (i % 3) * 6,
    color: i % 2 === 0 ? "#f0a020" : "#fff8ed",
  }));

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            opacity: 0.7,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
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
      />
      <Image
        src="/images/haldi-mehandi/ceremonial_objects.png"
        alt=""
        fill
        className="-z-10 object-contain"
      />
      <PetalDrift />

      <div className="relative z-10 mb-6 text-center">
        <h2 className="font-serif text-3xl text-[#800020]">
          Haldi &amp; Mehandi
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
