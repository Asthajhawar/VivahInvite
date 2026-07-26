"use client";

import { useState } from "react";
import Image from "next/image";
import { MapModal } from "./MapModal";

const VENUE_NAME = "Surbhi Sadan";
const VENUE_ADDRESS = "Sanganer Jaipur, Rajasthan";

export function WeddingDetails() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden py-32">
      <Image
        src="/images/venue/background.png"
        alt=""
        fill
        className="-z-10 object-cover"
      />
      <div
        className="absolute -z-10"
        style={{ height: "90%", width: "100%", left: 0, top: "139px" }}
      >
        <Image
          src="/images/venue/landscape.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div
        className="absolute -z-10"
        style={{ height: "146%", width: "100%", left: 0, top: 0 }}
      >
        <Image
          src="/images/venue/mandap.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div
        className="absolute -z-10"
        style={{ height: "57%", width: "100%", left: 0, top: "-38px" }}
      >
        <Image
          src="/images/venue/top-decorations.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div
        className="absolute -z-10"
        style={{ height: "173%", width: "32%", left: "127px", top: 0 }}
      >
        <Image
          src="/images/venue/couple.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div
        className="relative z-10 mx-auto max-w-md text-center"
        style={{ top: "-91px" }}
      >
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
