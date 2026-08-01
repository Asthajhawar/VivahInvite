"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollIndicator } from "./ScrollIndicator";

gsap.registerPlugin(ScrollTrigger);

// Everything — arch zoom AND GaneshReveal reveal — happens in ONE pinned
// section. The user scrolls once; the animation plays on the same screen
// without any new section sliding up from below.
export function HeroArch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const archRef    = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const videoRef   = useRef<HTMLVideoElement>(null);


  useGSAP(
    () => {
      // One long scrub timeline — 200 vh of scroll while pinned.
      //
      //  0 → 0.40  Arch zooms in (scale 1 → 3)
      //  0.20→0.40  Overlay fades in (cream wallpaper crossfade)
      //  0.40→0.65  Ganesh zooms out (scale 5 → 1.65) + flowers slide in
      //  0.65→0.75  Sanskrit text fades in
      //  0.75→1.00  Hold so user can read before pin releases
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",   // 220 vh total — extra room for smooth ganesh reveal
          scrub: true,
          pin: true,
        },
      });

      // ── Phase 1: Arch zoom ───────────────────────────────────────────
      tl.to(archRef.current, {
        scale: 3,
        transformOrigin: "50% 42%",
        ease: "none",
        duration: 0.4,
      })
        // Cream wallpaper crossfades in during the second half of the zoom
        .to(overlayRef.current, { opacity: 1, ease: "none", duration: 0.2 }, 0.2)

       
        // ── Phase 4: Hold ─────────────────────────────────────────────
        // Empty segment so everything stays visible while the user reads
        // before the pin releases.
        .to({}, { duration: 0.12 }, 0.88);

      // ── Video: hybrid autoPlay + scrub ───────────────────────────────
      // Forward (scroll down): autoPlay runs naturally — no intervention.
      // Backward (scroll up): video is paused, rAF lerps currentTime backward.
      // Leaving section (scroll past end): pause + snap to very last frame.
      // Re-entering from below: snap to last frame immediately, hold it,
      //   then let onUpdate scrub it backward as user scrolls up.
      const video = videoRef.current;
      if (video) {
        video.muted = true;
        video.play().catch(() => {});

        let rafId = 0;
        let scrubTarget = -1;          // -1 = hands-off (autoPlay running)
        let ignoreUpdateUntil = 0;     // timestamp — suppresses onUpdate briefly

        const tick = () => {
          if (scrubTarget >= 0 && video.duration > 0) {
            const cur  = video.currentTime;
            const diff = scrubTarget - cur;
            if (Math.abs(diff) > 0.016) {
              video.currentTime = cur + diff * 0.15;
            } else {
              video.currentTime = scrubTarget;
            }
          }
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          onUpdate: (self) => {
            // Skip if we just snapped to last frame (give it 200ms to settle)
            if (performance.now() < ignoreUpdateUntil) return;

            if (self.direction === -1 && video.duration > 0) {
              // Scrolling UP → pause autoplay and scrub backward via rAF
              if (!video.paused) video.pause();
              scrubTarget = self.progress * video.duration;
            } else if (self.direction === 1) {
              // Scrolling DOWN → hand back to autoPlay
              scrubTarget = -1;
              if (video.paused) video.play().catch(() => {});
            }
          },
          onLeaveBack: () => {
            // Scrolled fully above section → reset to very beginning
            scrubTarget = -1;
            video.pause();
            video.currentTime = 0;
          },
          onLeave: () => {
            // Scrolled fully past section → freeze at last frame
            video.pause();
            if (video.duration > 0) {
              video.currentTime = video.duration - 0.01;
            }
            scrubTarget = -1;
          },
          onEnterBack: () => {
            // Coming back UP from next section.
            // 1. Snap immediately to last frame so user sees it.
            // 2. Suppress onUpdate for 200ms so this snap isn't overridden.
            // 3. onUpdate (direction=-1) will then take over and scrub backward.
            if (video.duration > 0) {
              video.currentTime = video.duration - 0.01;
              scrubTarget      = video.duration - 0.01;
            }
            ignoreUpdateUntil = performance.now() + 200;
          },
        });

        return () => cancelAnimationFrame(rafId);
      }

    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      {/* ── Arch image ────────────────────────────────────────────────── */}
      <div ref={archRef} className="absolute inset-0">
        <Image
          src="/images/hero/hero-arch.png"
          alt="Wedding mandap archway"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* ── GaneshReveal overlay ─────────────────────────────────────── */}
      {/* Uses a flex-column layout so spacing is viewport-relative:       */}
      {/*   [14dvh] top text zone                                          */}
      {/*   [flex-1] ganesh zone  (~66dvh on a typical phone)              */}
      {/*   [22dvh] bottom shloka zone                                     */}
      {/* This guarantees zero text/image overlap on any screen size.      */}
      {/* ── Overlay: video crossfade ───────────────────────────────────── */}
      <div ref={overlayRef} className="absolute inset-0 z-20 flex flex-col opacity-0">
        <video
          ref={videoRef}
          src="/images/ganesh/Utah 2.mp4"
          autoPlay
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
