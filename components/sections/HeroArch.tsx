"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollIndicator } from "./ScrollIndicator";
import { ScrollDownHint } from "./ScrollDownHint";
import { useLenis } from "@/components/LenisProvider";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// Architecture note:
//   ALL scroll logic — arch animation AND video state machine — lives in ONE
//   ScrollTrigger (the main timeline's). A second ST was the source of all bugs:
//   GSAP cannot guarantee callback ordering between two STs on the same trigger,
//   and Lenis's easing caused rapid onUpdate calls near the pin boundary,
//   creating race conditions between onLeave on ST-A and onUpdate on ST-B.
//
// Video state machine:
//   hasPlayedRef   – true once play() has been called in this scroll pass
//   hasFinishedRef – true once the video ends (either naturally via "ended" event
//                    or via onLeave). Blocks every subsequent play() call.
//                    Reset only by onLeaveBack (user fully above the section).\
//
// Indicator state machine:
//   tapVisible    – "Tap to Begin" shown (start of experience)
//   hintVisible   – "Scroll Down" shown (after video ends, still pinned)
//   Both are false during the animation (arch zoom + video playing).
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = "vivah_audio_unlocked";

/** Progress (0–1) at which the overlay begins fading in. Keep in sync with
 *  the GSAP timeline position below (0.20). */
const VIDEO_START_PROGRESS = 0.20;

// Ease-out expo: starts fast, decelerates smoothly
const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function HeroArch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const archRef    = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  const hasPlayedRef   = useRef(false);
  const hasFinishedRef = useRef(false);

  // ── Indicator visibility ──────────────────────────────────────────────────
  // tapVisible : "Tap to Begin" — shown on every fresh page load, always.
  //              Hidden only after the user actually taps.
  // hintVisible: "Scroll Down"  — shown only after video ends naturally
  //              while still in the pinned section.
  const [tapVisible,  setTapVisible]  = useState(true);
  const [hintVisible, setHintVisible] = useState(false);

  // Stable refs so GSAP callbacks can call setState without stale closures
  const setHintRef = useRef(setHintVisible);
  setHintRef.current = setHintVisible;
  const setTapRef = useRef(setTapVisible);
  setTapRef.current = setTapVisible;

  // ── Lenis ─────────────────────────────────────────────────────────────────
  const { lenis } = useLenis();
  const lenisRef  = useRef(lenis);
  lenisRef.current = lenis;

  // ── Audio tap handler ─────────────────────────────────────────────────────
  // MUST be synchronous inside the click handler → valid browser gesture.
  const handleGateTap = useCallback(() => {
    // 1. Unlock audio
    const audio = (window as any).__vivahAudio as HTMLAudioElement | undefined;
    if (audio) {
      audio.muted = false;
      if (audio.paused) audio.play().catch(() => {});
      sessionStorage.setItem(SESSION_KEY, "1");
    }

    // 2. Hide tap indicator immediately
    setTapVisible(false);

    // 3. Auto-scroll through the entire pinned section.
    //    Pin end = section natural top + 120 vh (matches end: "+=120%").
    //    scrub:true on the ST means the GSAP animation follows scroll position,
    //    so auto-scrolling drives the arch zoom + video automatically.
    if (!sectionRef.current) return;
    const pinEnd = sectionRef.current.offsetTop + window.innerHeight * 1.22;
    lenisRef.current?.scrollTo(pinEnd, {
      duration: 9,           // ~9 s — gives video enough time to complete
      easing:   easeOutExpo,
    });
  }, []);

  // Defer video preloading until AFTER the page's critical assets
  // (hero-arch.png, scroll-down-2.png) have finished loading.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const startPreload = () => { video.preload = "auto"; };
    if (document.readyState === "complete") {
      startPreload();
    } else {
      window.addEventListener("load", startPreload, { once: true });
      return () => window.removeEventListener("load", startPreload);
    }
  }, []);

  useGSAP(
    () => {
      const video = videoRef.current;
      if (!video) return;

      video.muted = true;
      video.pause();
      video.currentTime = 0;

      // ── rAF scrub loop ────────────────────────────────────────────────────
      let rafId = 0;
      let scrubTarget = -1;

      const tick = (): void => {
        if (scrubTarget >= 0 && video.duration > 0) {
          const diff = scrubTarget - video.currentTime;
          video.currentTime =
            Math.abs(diff) > 0.016 ? video.currentTime + diff * 0.15 : scrubTarget;
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = 0;
        }
      };
      const stopRaf = () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      };
      const startRaf = () => { if (!rafId) rafId = requestAnimationFrame(tick); };

      // ── freeze(): permanent last-frame hold ───────────────────────────────
      const freeze = () => {
        if (hasFinishedRef.current) return;
        hasFinishedRef.current = true;
        scrubTarget = -1;
        stopRaf();
        video.pause();
        if (video.duration > 0) video.currentTime = video.duration - 0.01;
      };

      // ── "ended" event ─────────────────────────────────────────────────────
      // Video finished naturally while still pinned.
      // Show "Scroll Down" hint AND auto-scroll to pin end to complete the ride.
      const onVideoEnded = () => {
        freeze();
        setHintRef.current(true);

        // In case the user scrolled manually (no tap auto-scroll in progress),
        // drive lenis to the pin end automatically so they don't have to scroll.
        if (!sectionRef.current) return;
        const pinEnd = sectionRef.current.offsetTop + window.innerHeight * 1.22;
        lenisRef.current?.scrollTo(pinEnd, {
          duration: 2.5,
          easing:   easeOutExpo,
        });
      };
      video.addEventListener("ended", onVideoEnded);

      // ── SINGLE unified ScrollTrigger ──────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   "top top",
          end:     "+=120%",
          scrub:   true,
          pin:     true,

          onUpdate(self) {
            if (hasFinishedRef.current) return;

            const { direction, progress } = self;

            if (direction === -1 && video.duration > 0) {
              if (!hasPlayedRef.current) return;
              if (!video.paused) video.pause();
              scrubTarget = Math.max(0, progress * video.duration);
              startRaf();

            } else if (direction === 1) {
              if (progress < VIDEO_START_PROGRESS) return;

              if (!hasPlayedRef.current) {
                scrubTarget = -1;
                stopRaf();
                video.currentTime = 0;
                hasPlayedRef.current = true;
                video.play().catch(() => {});

              } else if (video.paused && !video.ended) {
                scrubTarget = -1;
                stopRaf();
                video.play().catch(() => {});
              }
            }
          },

          onLeave() {
            // Pin released — freeze video, hide both indicators.
            freeze();
            setHintRef.current(false);
          },

          onEnterBack() {
            // User scrolled back into the pinned section from below.
            setHintRef.current(false);
            if (hasFinishedRef.current) {
              scrubTarget = -1;
              stopRaf();
              if (!video.paused) video.pause();
              if (video.duration > 0) video.currentTime = video.duration - 0.01;
            }
          },

          onLeaveBack() {
            // User scrolled fully above — full reset.
            // Restore "Tap to Begin" so the gate shows again.
            setTapRef.current(true);
            setHintRef.current(false);
            scrubTarget = -1;
            stopRaf();
            video.pause();
            video.currentTime = 0;
            hasPlayedRef.current   = false;
            hasFinishedRef.current = false;
          },
        },
      });

      // ── Animation ─────────────────────────────────────────────────────────
      //  0.00 → 0.40  Arch zooms in (scale 1 → 3)
      //  0.20 → 0.40  Overlay fades in
      //  0.88 → 1.00  Hold before pin releases
      tl.to(archRef.current, {
        scale: 3,
        transformOrigin: "50% 42%",
        ease: "none",
        duration: 0.4,
      })
        .to(overlayRef.current, { opacity: 1, ease: "none", duration: 0.2 }, 0.2)
        .to({}, { duration: 0.12 }, 0.88);

      return () => {
        stopRaf();
        video.removeEventListener("ended", onVideoEnded);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">

      {/* ── Arch image ──────────────────────────────────────────────────── */}
      <div ref={archRef} className="absolute inset-0">
        <Image
          src="/images/hero/hero-arch.jpg"
          alt="Wedding mandap archway"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* ── Overlay: Ganesh fallback + video ──────────────────────────────
           • Starts at opacity-0; GSAP fades it in from progress 0.20
           • Fallback image (intro_ganeshji.jpg) sits BEHIND the video.
             On mobile/slow connections where video fails or is blocked,
             the Ganesh image shows automatically — no blank screen.
           • Video sits on top and covers the fallback when it plays.   */}
      <div ref={overlayRef} className="absolute inset-0 z-20 flex flex-col opacity-0">
        <Image
          src="/images/ganesh/intro_ganeshji.jpg"
          alt="Shri Ganesh"
          fill
          priority
          className="object-cover"
        />
        <video
          ref={videoRef}
          src="/images/ganesh/Utah 2.mp4"
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover z-10"
          suppressHydrationWarning
        />
      </div>

      {/* ── Tap to Begin indicator ────────────────────────────────────────
           Always shown on page load; hidden after user taps.            */}
      <ScrollIndicator
        visible={tapVisible}
        onTap={handleGateTap}
      />

      {/* ── Scroll Down hint ──────────────────────────────────────────────
           Shown after the video ends while still in the pinned section.  */}
      <ScrollDownHint visible={hintVisible} />

    </section>
  );
}
