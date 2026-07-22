"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/LenisProvider";

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  query: string;
}

export function MapModal({ open, onClose, query }: MapModalProps) {
  const { stop, start } = useLenis();

  useEffect(() => {
    if (open) {
      stop();
    } else {
      start();
    }
    return () => start();
  }, [open, stop, start]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  const encoded = encodeURIComponent(query);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-[#1b2a4a]/60"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 flex h-[70vh] w-[92%] max-w-md flex-col gap-3 rounded-2xl border-2 border-[#c9a24b] bg-[#fff8ed] p-4 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close map"
          className="self-end text-lg text-[#1b2a4a] hover:text-[#800020]"
        >
          ✕
        </button>
        <div className="flex-1 overflow-hidden rounded-lg">
          <iframe
            title="Venue map"
            src={`https://www.google.com/maps?q=${encoded}&output=embed`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={`https://www.google.com/maps?q=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#c9a24b] py-2 text-center font-semibold text-white transition-colors hover:bg-[#b89020]"
        >
          Open in Google Maps app
        </a>
      </div>
    </div>
  );
}
