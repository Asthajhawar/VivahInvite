// Server Component — no "use client" directive.
// All images are rendered on the server so they arrive in the initial HTML,
// eliminating the client-side waterfall that caused slow loading.
//
// Accepts an optional `events` prop so the same component can be reused
// for both the bride page (default events) and the groom page (custom events).

import Image from "next/image";
import { HaldiMehandiCarousel } from "./HaldiMehandiCarousel";
import { PetalDrift } from "./PetalDrift";

export interface EventData {
  heading: string;
  date: string;
  time: string;
  image: string;
}

const BRIDE_EVENTS: EventData[] = [
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

interface Props {
  /** Custom event list. Defaults to the bride-side events when omitted. */
  events?: EventData[];
}

export function HaldiMehandi({ events = BRIDE_EVENTS }: Props) {
  // Build carousel event data with server-rendered image nodes.
  // The first card image gets `priority` so it is preloaded in the <head>.
  const carouselEvents = events.map((event, i) => ({
    heading: event.heading,
    date: event.date,
    time: event.time,
    imageNode: (
      <Image
        key={event.image}
        src={event.image}
        alt={event.heading}
        fill
        sizes="85vw"
        className="object-cover"
        priority={i === 0}           // preload the first visible card
        loading={i === 0 ? "eager" : "lazy"}
      />
    ),
  }));

  return (
    <section
      className="relative overflow-hidden py-20"
      style={{ contain: "layout style" }}
    >
      {/* ── Stable background layer — images rendered on server, no layout shift ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ willChange: "transform", contain: "strict" }}
      >
        <Image
          src="/images/haldi-mehandi/background.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority          // above-the-fold background → preload
          loading="eager"
        />
        <Image
          src="/images/haldi-mehandi/decorations.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ top: "-2.2%" }}
          priority
          loading="eager"
        />
        <div
          className="absolute"
          style={{ height: "174%", width: "105%", left: 0, top: 0 }}
        >
          <Image
            src="/images/haldi-mehandi/ceremonial_objects.png"
            alt=""
            fill
            sizes="105vw"
            className="object-contain"
            style={{ transform: "scale(1.09)", transformOrigin: "top left" }}
            priority
            loading="eager"
          />
        </div>
      </div>

      {/* Petal animation (client component) */}
      <PetalDrift />

      <div className="relative z-10 mb-6 text-center">
        <h2 className="font-script font-semibold text-5xl text-[#800020]">
          Events
        </h2>
        <p className="text-sm text-[#6b7a3a]">Swipe through the celebrations</p>
      </div>

      {/* Interactive carousel — client component receives server-rendered image nodes */}
      <HaldiMehandiCarousel events={carouselEvents} />
    </section>
  );
}
