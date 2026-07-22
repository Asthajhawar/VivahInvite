"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useMounted } from "@/hooks/useMounted";

const WEDDING_DATE_ISO = "2027-01-26T00:00:00+05:30";
const WEDDING_LOCATION = "Kottayam, Kerala";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdown(target: string): Countdown {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export function DateRevealCard() {
  const mounted = useMounted();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    if (!mounted) return;
    setCountdown(getCountdown(WEDDING_DATE_ISO));
    const id = setInterval(
      () => setCountdown(getCountdown(WEDDING_DATE_ISO)),
      1000
    );
    return () => clearInterval(id);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#d9b45f";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    let isDown = false;
    let sampleCount = 0;

    function erase(x: number, y: number) {
      if (!ctx) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    function pos(e: PointerEvent): { x: number; y: number } {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function checkErasedPercent() {
      if (!ctx || !canvas) return;
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 4 * 40) {
        total++;
        if (data[i] === 0) transparent++;
      }
      const percent = total > 0 ? transparent / total : 0;
      if (percent > 0.5) {
        setRevealed(true);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ["#D4AF37", "#B76E79", "#800020", "#0B3D91", "#F4A460"],
        });
      }
    }

    function onDown(e: PointerEvent) {
      isDown = true;
      const { x, y } = pos(e);
      erase(x, y);
    }
    function onMove(e: PointerEvent) {
      if (!isDown) return;
      const { x, y } = pos(e);
      erase(x, y);
      sampleCount++;
      if (sampleCount % 10 === 0) checkErasedPercent();
    }
    function onUp() {
      isDown = false;
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [mounted, revealed]);

  if (!mounted) return null;

  return (
    <section className="flex justify-center bg-[#fff8ed] py-16">
      <div className="relative h-64 w-80 overflow-hidden rounded-2xl border-2 border-[#c9a24b] bg-[#fff8ed] shadow-lg">
        <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
          <p className="text-xs tracking-widest text-[#6b7a3a]">SAVE THE DATE</p>
          <p className="font-serif text-2xl text-[#800020]">26th January 2027</p>
          <p className="text-xs tracking-wide text-[#1b2a4a]">
            {WEDDING_LOCATION.toUpperCase()}
          </p>
          {countdown && (
            <div className="mt-2 flex gap-3">
              {(["days", "hours", "minutes", "seconds"] as const).map(
                (unit) => (
                  <div key={unit} className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-[#1b2a4a]">
                      {String(countdown[unit]).padStart(
                        unit === "days" ? 3 : 2,
                        "0"
                      )}
                    </span>
                    <span className="text-[10px] uppercase text-[#6b7a3a]">
                      {unit}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {!revealed && (
          <canvas
            ref={canvasRef}
            data-lenis-prevent
            className="absolute inset-0 h-full w-full cursor-pointer touch-none"
            style={{ touchAction: "none" }}
          />
        )}

        {revealed && (
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#6b7a3a]">
            Date revealed!
          </p>
        )}
      </div>
    </section>
  );
}
