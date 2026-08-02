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

    // Ensure Google Fonts are ready before drawing canvas text
    const serifPx   = Math.round(canvas.clientWidth * 0.075);
    const scriptPx  = Math.round(canvas.clientWidth * 0.052);
    Promise.all([
      document.fonts.load(`italic bold ${serifPx}px 'Cormorant Garamond'`),
      document.fonts.load(`${scriptPx}px 'Pinyon Script'`),
    ]).catch(() => {}); // non-blocking — fallback to Georgia if not ready

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
    const headingFont = `italic bold ${Math.round(W * 0.075)}px 'Cormorant Garamond', 'Georgia', serif`;
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    ctx.font = headingFont;
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillText("Scratch to Reveal", cx + 1, cy - 9);

    // Main heading
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = headingFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Scratch to Reveal", cx, cy - 10);

    // Sub-text: our special day — Pinyon Script
    ctx.font = `${Math.round(W * 0.052)}px 'Pinyon Script', cursive`;
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fillText("our special day", cx, cy + 16);

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
        style={{ width: "min(94vw, 340px)", aspectRatio: "340 / 280" }}
      >

        {/* Card content (revealed layer) */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
          <p
            className="font-serif text-[10px] font-semibold tracking-[0.25em] text-[#8b6914]"
          >
            ✦ SAVE THE DATE ✦
          </p>
          <p
            className="font-serif mt-1 text-[11px] tracking-[0.15em] text-[#a07820]"
          >
            With Joy We Invite You
          </p>
          <p
            className="font-script my-1 text-4xl text-[#800020]"
            style={{ letterSpacing: "0.01em" }}
          >
            26th November 2026
          </p>
          <p
            className="font-serif text-[10px] tracking-widest text-[#5a4010]"
          >
            {WEDDING_LOCATION.toUpperCase()}
          </p>

          {countdown && (
            <div className="mt-3 flex gap-4">
              {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
                <div key={unit} className="flex flex-col items-center">
                  <span
                    className="font-serif text-xl font-bold text-[#800020]"
                  >
                    {String(countdown[unit]).padStart(unit === "days" ? 3 : 2, "0")}
                  </span>
                  <span className="font-serif text-[9px] uppercase tracking-widest text-[#8b6914]">
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
            className="font-serif absolute bottom-2 left-1/2 z-50 -translate-x-1/2 text-[9px] tracking-widest text-[#8b6914]"
          >
            ✦ DATE REVEALED ✦
          </p>
        )}
      </div>

      {/* Scratch hint — hidden once revealed */}
      {!revealed && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none">
          {/* Finger swipe icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            className="w-7 h-7"
            style={{ animation: "scratch-hint-finger 1.6s ease-in-out infinite" }}
          >
            {/* Finger body */}
            <path
              d="M16 6 C14 6 13 7.5 13 9 L13 18 C11.5 17 9.5 17.5 9 19 C8.5 20.5 9.5 22 11 23 L16 27 C18.5 28.5 22 27 22 24 L22 14 C22 12.5 21 11 19.5 11 C19 11 18.5 11.2 18 11.5 L18 9 C18 7.5 17 6 16 6 Z"
              fill="#c9a24b"
              opacity="0.9"
            />
            {/* Swipe lines */}
            <path d="M5 14 L9 14" stroke="#c9a24b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <path d="M4 17 L8 17" stroke="#c9a24b" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
            <path d="M5 20 L9 20" stroke="#c9a24b" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
          </svg>

          {/* Label */}
          <span
            className="font-serif italic text-[10px] text-[#c9a24b] tracking-widest"
            style={{ animation: "scratch-hint-fade 1.6s ease-in-out infinite" }}
          >
            scratch to reveal
          </span>
        </div>
      )}

      <style>{`
        @keyframes scratch-hint-finger {
          0%, 100% { transform: translateX(0) rotate(-10deg); opacity: 0.6; }
          40%       { transform: translateX(8px) rotate(5deg); opacity: 1; }
          70%       { transform: translateX(-4px) rotate(-5deg); opacity: 0.8; }
        }
        @keyframes scratch-hint-fade {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
