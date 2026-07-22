"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function ShrinathjiHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gardenRef = useRef<HTMLDivElement>(null);
  const cowLeftRef = useRef<HTMLDivElement>(null);
  const cowRightRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const deityRef = useRef<HTMLDivElement>(null);
  const glimmerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        })
        .from(gardenRef.current, { opacity: 0, y: 60 })
        .from(cowLeftRef.current, { opacity: 0, x: -80 }, "<")
        .from(cowRightRef.current, { opacity: 0, x: 80 }, "<")
        .from(archRef.current, { opacity: 0, scale: 1.08 }, "+=0.1")
        .from(deityRef.current, { opacity: 0, y: 40, scale: 0.96 }, "+=0.1");
    },
    { scope: sectionRef }
  );

  // Pause glimmer animation when off-screen (battery saving)
  useEffect(() => {
    const el = glimmerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          el.style.animationPlayState = e.isIntersecting ? "running" : "paused";
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <Image
        src="/images/shrinathji/background.png"
        alt=""
        fill
        className="object-cover"
      />
      <div ref={gardenRef} className="absolute inset-0">
        <Image
          src="/images/shrinathji/garden.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div ref={cowLeftRef} className="absolute inset-0">
        <Image
          src="/images/shrinathji/left-cow.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div ref={cowRightRef} className="absolute inset-0">
        <Image
          src="/images/shrinathji/right-cow.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div ref={archRef} className="absolute inset-0">
        <Image
          src="/images/shrinathji/pillar.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div ref={deityRef} className="absolute inset-0">
        <Image
          src="/images/shrinathji/shrinathji.png"
          alt="Shrinathji"
          fill
          className="object-contain"
        />
      </div>
      <div
        ref={glimmerRef}
        className="glimmer-overlay pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(212,175,55,0.3), transparent 40%)",
          mixBlendMode: "overlay",
        }}
      />
    </section>
  );
}
