"use client";

import { useState } from "react";
import Image from "next/image";
import { MapModal } from "./MapModal";

const VENUE_NAME = "Taj Hotel";
const VENUE_ADDRESS = "Kottayam, Kerala";

export function WeddingDetails() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <section className="relative overflow-hidden py-24">
      <Image
        src="/images/venue/background.png"
        alt=""
        fill
        className="-z-10 object-cover"
      />
      <Image
        src="/images/venue/landscape.png"
        alt=""
        fill
        className="-z-10 object-cover"
      />
      <Image
        src="/images/venue/mandap.png"
        alt=""
        fill
        className="-z-10 object-contain"
      />
      <Image
        src="/images/venue/top-decorations.png"
        alt=""
        fill
        className="-z-10 object-cover"
      />
      <Image
        src="/images/venue/couple.png"
        alt=""
        fill
        className="-z-10 object-contain"
      />

      <div className="relative z-10 mx-auto max-w-md text-center">
        <h2 className="font-serif text-2xl text-[#1b2a4a]">Wedding Venue</h2>
        <p className="mt-1 font-serif text-lg text-[#800020]">{VENUE_NAME}</p>
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
          <span className="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-xs text-white">
            Tap to view live map
          </span>
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
