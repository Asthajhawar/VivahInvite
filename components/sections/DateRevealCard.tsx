"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useMounted } from "@/hooks/useMounted";

const WEDDING_DATE_ISO = "2026-11-26T00:00:00+05:30";
const WEDDING_LOCATION = "Jaipur, Rajasthan";

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

// ── Glitter particle system ────────────────────────────────────────────────
interface Glitter {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  speed: number;
  phase: number;
  shape: "circle" | "star" | "diamond";
}

const GLITTER_COLORS = [
  "#FFD700", "#FFC300", "#F0C040", "#E8B84B",
  "#FFE066", "#FFECB3", "#D4AF37", "#C9A84C",
  "#FFF9C4", "#fff",
];

function buildGlitters(count: number, w: number, h: number): Glitter[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 2.5 + 0.5,
    color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
    alpha: Math.random() * 0.7 + 0.3,
    speed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2,
    shape: (["circle", "star", "diamond"] as const)[Math.floor(Math.random() * 3)],
  }));
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const b = a + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(b) * (r * 0.4), cy + Math.sin(b) * (r * 0.4));
  }
  ctx.closePath();
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r * 0.55, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r * 0.55, cy);
  ctx.closePath();
}

export function DateRevealCard() {
  const mounted = useMounted();
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const glitterCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const glittersRef = useRef<Glitter[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    setCountdown(getCountdown(WEDDING_DATE_ISO));
    const id = setInterval(() => setCountdown(getCountdown(WEDDING_DATE_ISO)), 1000);
    return () => clearInterval(id);
  }, [mounted]);

  // ── Glitter animation (always visible, runs on top of everything) ────────
  useEffect(() => {
    if (!mounted) return;
    const canvas = glitterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    glittersRef.current = buildGlitters(120, W, H);
    let t = 0;

    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      t += 1;
      for (const g of glittersRef.current) {
        const a = g.alpha * (0.5 + 0.5 * Math.sin(t * g.speed + g.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle = g.color;
        if (g.shape === "circle") {
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (g.shape === "star") {
          drawStar(ctx, g.x, g.y, g.size * 1.6);
          ctx.fill();
        } else {
          drawDiamond(ctx, g.x, g.y, g.size * 1.4);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(tick);
    }
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [mounted]);

  // ── Scratch-off layer ────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || revealed) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Rich gold gradient for the scratch layer
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#c9973a");
    grad.addColorStop(0.25, "#e8c76a");
    grad.addColorStop(0.5, "#f5e08a");
    grad.addColorStop(0.75, "#d4a83c");
    grad.addColorStop(1, "#b8872a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle cross-hatch texture on gold
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < W; i += 8) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let j = 0; j < H; j += 8) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
    }

    // ── "SCRATCH TO REVEAL" text ──────────────────────────────────────────
    const cx = W / 2;
    const cy = H / 2;

    // Decorative lines
    const lineW = W * 0.55;
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - lineW / 2, cy - 32);
    ctx.lineTo(cx + lineW / 2, cy - 32);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - lineW / 2, cy + 28);
    ctx.lineTo(cx + lineW / 2, cy + 28);
    ctx.stroke();

    // Diamond ornaments on lines
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    drawDiamond(ctx, cx, cy - 32, 4);
    ctx.fill();
    drawDiamond(ctx, cx, cy + 28, 4);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Drop shadow for main heading
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.font = `bold ${Math.round(W * 0.075)}px 'Georgia', serif`;
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillText("SCRATCH TO REVEAL", cx + 1, cy - 9);

    // Main heading
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = `bold ${Math.round(W * 0.075)}px 'Georgia', serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("SCRATCH TO REVEAL", cx, cy - 10);

    // Sub-text: our special day
    ctx.font = `italic ${Math.round(W * 0.048)}px 'Georgia', serif`;
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.fillText("our special day", cx, cy + 14);

    // Sparkle dots around text
    const sparkles = [
      [cx - lineW / 2 - 12, cy - 10], [cx + lineW / 2 + 12, cy - 10],
      [cx - 60, cy - 22], [cx + 60, cy - 22],
      [cx - 80, cy + 18], [cx + 80, cy + 18],
    ];
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (const [sx, sy] of sparkles) {
      drawStar(ctx, sx, sy, 4);
      ctx.fill();
    }

    let isDown = false;
    let sampleCount = 0;

    function erase(x: number, y: number) {
      if (!ctx) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    function pos(e: PointerEvent): { x: number; y: number } {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function checkErasedPercent() {
      if (!ctx || !canvas) return;
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0, total = 0;
      for (let i = 3; i < data.length; i += 4 * 40) {
        total++;
        if (data[i] === 0) transparent++;
      }
      if (total > 0 && transparent / total > 0.35) {
        setRevealed(true);
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.55 },
          colors: ["#D4AF37", "#B76E79", "#800020", "#0B3D91", "#F4A460", "#fff"],
        });
      }
    }

    function onDown(e: PointerEvent) { isDown = true; const { x, y } = pos(e); erase(x, y); }
    function onMove(e: PointerEvent) {
      if (!isDown) return;
      const { x, y } = pos(e);
      erase(x, y);
      sampleCount++;
      if (sampleCount % 10 === 0) checkErasedPercent();
    }
    function onUp() { isDown = false; }

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
    <section className="relative flex justify-center py-16">
      {/* Section-wide background image */}
      <Image
        src="/images/shrinathji/background.png"
        alt=""
        fill
        className="object-cover"
        priority
      />
      {/* Card wrapper */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-[0_8px_40px_rgba(180,140,60,0.35)]"
        style={{ width: 340, height: 280 }}
      >

        {/* Card content (revealed layer) */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
          <p
            className="text-[10px] font-semibold tracking-[0.25em] text-[#8b6914]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            ✦ SAVE THE DATE ✦
          </p>
          <p
            className="mt-1 text-[11px] tracking-[0.15em] text-[#a07820]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            WITH JOY WE INVITE YOU TO CELEBRATE
          </p>
          <p
            className="my-1 text-3xl font-bold text-[#800020]"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.02em" }}
          >
            26th November 2026
          </p>
          <p
            className="text-[10px] tracking-widest text-[#5a4010]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {WEDDING_LOCATION.toUpperCase()}
          </p>

          {countdown && (
            <div className="mt-3 flex gap-4">
              {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
                <div key={unit} className="flex flex-col items-center">
                  <span
                    className="text-xl font-bold text-[#800020]"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {String(countdown[unit]).padStart(unit === "days" ? 3 : 2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#8b6914]">
                    {unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gold border frame */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
          style={{
            border: "2px solid #d4a83c",
            boxShadow: "inset 0 0 0 1px rgba(201,151,58,0.25)",
          }}
        />

        {/* Glitter canvas — always visible, below scratch layer */}
        <canvas
          ref={glitterCanvasRef}
          className="pointer-events-none absolute inset-0 z-30 h-full w-full"
        />

        {/* Scratch-off canvas */}
        {!revealed && (
          <canvas
            ref={scratchCanvasRef}
            data-lenis-prevent
            className="absolute inset-0 z-40 h-full w-full cursor-pointer touch-none"
            style={{ touchAction: "none" }}
          />
        )}

        {/* Revealed badge */}
        {revealed && (
          <p
            className="absolute bottom-2 left-1/2 z-50 -translate-x-1/2 text-[9px] tracking-widest text-[#8b6914]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            ✦ DATE REVEALED ✦
          </p>
        )}
      </div>
    </section>
  );
}
