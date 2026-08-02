"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollIndicator } from "./ScrollIndicator";

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
//                    Reset only by onLeaveBack (user fully above the section).
// ─────────────────────────────────────────────────────────────────────────────

/** Progress (0–1) at which the overlay begins fading in. Keep in sync with
 *  the GSAP timeline position below (0.20). */
const VIDEO_START_PROGRESS = 0.20;

export function HeroArch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const archRef    = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  const hasPlayedRef   = useRef(false);
  const hasFinishedRef = useRef(false);

  useGSAP(
    () => {
      const video = videoRef.current;
      if (!video) return;

      // Mute required for programmatic play() on mobile browsers
      video.muted = true;
      // Pre-seek to frame 0 NOW so the first frame is rendered in the
      // video element before the overlay ever fades in → no black flash
      video.pause();
      video.currentTime = 0;

      // ── rAF scrub loop ────────────────────────────────────────────────────
      // Used ONLY when the user scrolls backward (to lerp currentTime backward).
      // Self-cancels when scrubTarget returns to -1 so it burns no CPU at rest.
      // Declared as const (not function) so TypeScript narrows `video` correctly.
      let rafId = 0;
      let scrubTarget = -1;

      const tick = (): void => {
        if (scrubTarget >= 0 && video.duration > 0) {
          const diff = scrubTarget - video.currentTime;
          video.currentTime =
            Math.abs(diff) > 0.016 ? video.currentTime + diff * 0.15 : scrubTarget;
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = 0; // self-cancel
        }
      };
      const stopRaf = () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      };
      const startRaf = () => { if (!rafId) rafId = requestAnimationFrame(tick); };

      // ── freeze(): permanent last-frame hold ───────────────────────────────
      // Idempotent (safe to call multiple times from both "ended" and onLeave).
      const freeze = () => {
        if (hasFinishedRef.current) return; // already frozen
        hasFinishedRef.current = true;
        scrubTarget = -1;
        stopRaf();
        video.pause();
        if (video.duration > 0) video.currentTime = video.duration - 0.01;
      };

      // ── "ended" event: catches natural video completion ───────────────────
      // Without this: if the video ends BEFORE the pin's scroll range is
      // exhausted, onUpdate (direction=1) sees a paused video and calls play()
      // again → video restarts from frame 0 inside the pin range.
      video.addEventListener("ended", freeze);

      // ── SINGLE unified ScrollTrigger ──────────────────────────────────────
      // Controls BOTH the arch/overlay animation (via the scrubbed timeline)
      // AND the video state machine (via onUpdate/onLeave/onEnterBack/onLeaveBack).
      // Keeping them in ONE trigger eliminates ordering races between two STs.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   "top top",
          end:     "+=120%",    // 120 vh pin — snappy, not "stuck"
          scrub:   true,
          pin:     true,

          onUpdate(self) {
            // ── Hard gate ────────────────────────────────────────────────
            // Once frozen, this is the ONLY exit. Nothing after this can
            // call play() — regardless of how many times Lenis fires onUpdate.
            if (hasFinishedRef.current) return;

            const { direction, progress } = self;

            if (direction === -1 && video.duration > 0) {
              // ── Scrolling UP: scrub backward via rAF ──────────────────
              if (!hasPlayedRef.current) return; // video never started — nothing to scrub
              if (!video.paused) video.pause();
              scrubTarget = Math.max(0, progress * video.duration);
              startRaf();

            } else if (direction === 1) {
              // ── Scrolling DOWN ────────────────────────────────────────
              if (progress < VIDEO_START_PROGRESS) return; // overlay invisible — too early

              if (!hasPlayedRef.current) {
                // First play this pass: always reset to frame 0 for clean start
                scrubTarget = -1;
                stopRaf();
                video.currentTime = 0;
                hasPlayedRef.current = true;
                video.play().catch(() => {});

              } else if (video.paused && !video.ended) {
                // Resume after user scrolled up then back down.
                // Guard: !video.ended prevents restarting a naturally-ended video
                // (the "ended" listener already called freeze() for that case).
                scrubTarget = -1;
                stopRaf();
                video.play().catch(() => {});
              }
              // video.ended === true → freeze() already ran → hasFinishedRef
              // is true → we already returned at the top of this handler.
            }
          },

          onLeave() {
            // User scrolled fully PAST the pin end — freeze permanently.
            freeze();
          },

          onEnterBack() {
            // User scrolled back UP into the section from the next section.
            // If video is done → hold last frame (onUpdate is already gated).
            // If video is not done → onUpdate direction=-1 will scrub it backward.
            if (hasFinishedRef.current) {
              scrubTarget = -1;
              stopRaf();
              if (!video.paused) video.pause();
              if (video.duration > 0) video.currentTime = video.duration - 0.01;
            }
          },

          onLeaveBack() {
            // User scrolled fully ABOVE the section → complete reset.
            // The NEXT downward scroll will replay the video from frame 0.
            scrubTarget = -1;
            stopRaf();
            video.pause();
            video.currentTime = 0;
            hasPlayedRef.current   = false;
            hasFinishedRef.current = false;
          },
        },
      });

      // ── Animation: arch zoom + overlay crossfade ──────────────────────────
      //  0.00 → 0.40  Arch zooms in (scale 1 → 3)
      //  0.20 → 0.40  Overlay fades in (VIDEO_START_PROGRESS = 0.20)
      //  0.88 → 1.00  Hold — lets the user see the video before pin releases
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
        video.removeEventListener("ended", freeze);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      {/* ── Arch image ──────────────────────────────────────────────────── */}
      <div ref={archRef} className="absolute inset-0">
        <Image
          src="/images/hero/hero-arch.png"
          alt="Wedding mandap archway"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* ── Overlay: cream wallpaper + video ──────────────────────────────
           • Starts at opacity-0; GSAP fades it in from progress 0.20
           • NO autoPlay — JS owns playback entirely via the state machine
           • preload="auto" buffers the video file in the background so
             play() has no loading delay when the overlay becomes visible   */}
      <div ref={overlayRef} className="absolute inset-0 z-20 flex flex-col opacity-0">
        <video
          ref={videoRef}
          src="/images/ganesh/Utah 2.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <ScrollIndicator />
    </section>
  );
}
