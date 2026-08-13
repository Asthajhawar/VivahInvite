"use client";

import { useEffect, useRef, useState } from "react";

interface WeddingEvent {
  heading: string;
  date: string;
  time: string;
  /** Pre-rendered image node passed from the server component */
  imageNode: React.ReactNode;
}

interface Props {
  events: WeddingEvent[];
}

export function HaldiMehandiCarousel({ events }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // ── Non-passive touch listeners so we can preventDefault for horizontal swipes ──
  const touchStartX  = useRef(0);
  const touchStartY  = useRef(0);
  const gestureDir   = useRef<"h" | "v" | null>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    function handleStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      gestureDir.current  = null;
    }

    function handleMove(e: TouchEvent) {
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (gestureDir.current === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        gestureDir.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }
      if (gestureDir.current === "h") e.preventDefault();
    }

    function handleEnd(e: TouchEvent) {
      if (gestureDir.current !== "h") return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const THRESHOLD = 40;
      setActiveIndex((cur) => {
        if (dx < -THRESHOLD && cur < events.length - 1) return cur + 1;
        if (dx >  THRESHOLD && cur > 0)                 return cur - 1;
        return cur;
      });
      gestureDir.current = null;
    }

    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchmove",  handleMove,  { passive: false });
    el.addEventListener("touchend",   handleEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove",  handleMove);
      el.removeEventListener("touchend",   handleEnd);
    };
  }, [events.length]);

  return (
    <>
      {/* ── Transform carousel ── */}
      <div ref={carouselRef} className="relative overflow-hidden px-5">
        <div
          className="flex gap-4 transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(${activeIndex * -85}% - ${activeIndex * 16}px))`,
          }}
        >
          {events.map((event) => (
            <article
              key={event.heading}
              className="flex-none basis-[85%] rounded-xl border border-[#c9a24b] bg-[#fff8ed] p-4 shadow-md md:basis-[45%]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                {event.imageNode}
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
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {events.map((event, i) => (
          <button
            key={event.heading}
            aria-label={`Go to ${event.heading}`}
            onClick={() => setActiveIndex(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === activeIndex ? "bg-[#c9a24b]" : "bg-[#e3d3ad]"
            }`}
          />
        ))}
      </div>
    </>
  );
}
