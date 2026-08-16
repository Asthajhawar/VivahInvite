"use client";

/**
 * AudioGate
 * ---------
 * Renders a full-screen "Tap to Begin" overlay on the very first visit.
 *
 * WHY this exists:
 *   Mobile browsers (iOS Safari, Android Chrome) REQUIRE a user gesture before
 *   any audio can play with sound. A tap-to-enter overlay is the cleanest UX
 *   pattern: it gives us a guaranteed gesture at the perfect moment (page load)
 *   and lets us start the audio unmuted immediately.
 *
 * HOW it works:
 *   1. On mount, create the Audio object and preload it (but don't play yet).
 *   2. User taps the overlay → inside the same synchronous click handler we
 *      call audio.play() immediately. This is the "user gesture" the browser
 *      requires — the call must happen synchronously inside the handler.
 *   3. We then fade the overlay out and remove it.
 *   4. sessionStorage flag ensures the gate only shows once per tab session.
 *      If the user refreshes mid-session they skip the gate, but audio is
 *      resumed via the visibility-change listener in BackgroundAudio.tsx.
 */

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/Piya-Ghar-Aayege.mp3";
const SESSION_KEY = "vivah_audio_unlocked";

interface Props {
  /** Called once after the user taps and audio starts. */
  onUnlock?: () => void;
}

export default function AudioGate({ onUnlock }: Props) {
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const [visible, setVisible]   = useState(false);   // gate shown?
  const [fading,  setFading]    = useState(false);   // fade-out in progress?

  // Expose the audio element globally so BackgroundAudio (or any component)
  // can attach loop/visibilitychange listeners to it.
  useEffect(() => {
    // Already unlocked in this session → skip the gate
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const audio = new Audio(AUDIO_SRC);
    audio.loop    = true;
    audio.preload = "auto";   // start buffering now so tap→play is instant
    audio.volume  = 0.65;
    audioRef.current = audio;

    // Store on window so BackgroundAudio can pick it up
    (window as any).__vivahAudio = audio;

    setVisible(true);
  }, []);

  const handleUnlock = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // ⚠️  MUST be synchronous inside the click handler — no await, no setTimeout.
    audio.play().catch(() => {});

    sessionStorage.setItem(SESSION_KEY, "1");

    // Trigger fade-out animation
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      onUnlock?.();
    }, 700);
  };

  if (!visible) return null;

  return (
    <div
      id="audio-gate"
      onClick={handleUnlock}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9999,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        cursor:         "pointer",
        userSelect:     "none",
        background:     "radial-gradient(ellipse at center, #3b1f0a 0%, #1a0d04 60%, #0d0602 100%)",
        opacity:        fading ? 0 : 1,
        transition:     "opacity 0.7s ease",
      }}
    >
      {/* Decorative mandala ring */}
      <div style={{
        position:     "relative",
        width:        180,
        height:       180,
        marginBottom: 32,
      }}>
        {/* Outer pulsing ring */}
        <div style={{
          position:     "absolute",
          inset:        -12,
          borderRadius: "50%",
          border:       "1.5px solid rgba(212,175,55,0.35)",
          animation:    "vivah-pulse 2.4s ease-in-out infinite",
        }} />
        {/* Middle ring */}
        <div style={{
          position:     "absolute",
          inset:        0,
          borderRadius: "50%",
          border:       "1px solid rgba(212,175,55,0.6)",
        }} />
        {/* Icon area */}
        <div style={{
          position:       "absolute",
          inset:          0,
          borderRadius:   "50%",
          background:     "rgba(212,175,55,0.08)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}>
          {/* Music note SVG */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path
              d="M24 48V20l24-6v28"
              stroke="#d4af37"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="18" cy="48" r="6" stroke="#d4af37" strokeWidth="2.5" />
            <circle cx="42" cy="42" r="6" stroke="#d4af37" strokeWidth="2.5" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <p style={{
        color:       "rgba(212,175,55,0.9)",
        fontSize:    "0.75rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        marginBottom: 8,
        fontFamily:  "Georgia, serif",
      }}>
        ♪ Piya Ghar Aayege ♪
      </p>
      <h2 style={{
        color:       "#fff8ed",
        fontSize:    "clamp(1.5rem, 4vw, 2.25rem)",
        fontWeight:  400,
        letterSpacing: "0.06em",
        fontFamily:  "Georgia, serif",
        marginBottom: 32,
        textAlign:   "center",
      }}>
        Tap to Begin
      </h2>

      {/* Pulsing tap hint */}
      <div style={{
        display:      "flex",
        alignItems:   "center",
        gap:          10,
        color:        "rgba(255,248,237,0.5)",
        fontSize:     "0.8rem",
        letterSpacing: "0.12em",
        animation:    "vivah-blink 1.8s ease-in-out infinite",
      }}>
        <span style={{ fontSize: "1.1rem" }}>👆</span>
        <span>Touch anywhere</span>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes vivah-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.08); opacity: 1;   }
        }
        @keyframes vivah-blink {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
