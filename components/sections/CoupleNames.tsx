"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface CoupleInfo {
  brideName: string;
  brideParentage: string;
  groomName: string;
  groomParentage: string;
}

const COUPLE: CoupleInfo = {
  brideName: "Astha",
  brideParentage: "D/O Mrs. Jyoti & Mr. Giriraj Jhawar",
  groomName: "Saksham",
  groomParentage: "S/O Mrs. Shewta & Mr. Rajeev Kumar",
};

export function CoupleNames() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const mandapRef = useRef<HTMLDivElement>(null);
  const peacockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const omRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=250%",
            scrub: 1,
            pin: true,
          },
        })
        // Fade Om down as the first scene layers appear
        .to(omRef.current, { opacity: 0.13, ease: "power1.inOut" })
        .from(leavesRef.current, { opacity: 0, y: 50 }, "<")
        .from(mandapRef.current, { opacity: 0, scale: 0.95 }, "+=0.1")
        .from(peacockRef.current, { opacity: 0, x: 40 }, "+=0.1")
        .from(
          textRef.current!.querySelectorAll(".reveal-line"),
          {
            opacity: 0,
            y: 10,
            stagger: 0.12,
          },
          "+=0.1"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <Image
        src="/images/couple/background.png"
        alt=""
        fill
        className="object-cover"
      />
      {/* Om symbol overlay — full opacity on entry, fades as scene layers appear */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
      >
        <div
          ref={omRef}
          style={{
            position: "relative",
            width: "70%",
            maxWidth: 420,
            aspectRatio: "1 / 1",
            opacity: 1,
          }}
        >
          <Image
            src="/images/couple/om symbol.png"
            alt="Om"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div ref={leavesRef} className="absolute inset-x-0 bottom-0 top-[250px]">
        <Image
          src="/images/couple/leaves.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div
        ref={mandapRef}
        className="absolute"
        style={{
          height: "141%",
          width: "76%",
          left: "12.5%",
          top: 0,
          bottom: 0,
        }}
      >
        <Image
          src="/images/couple/mandap.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div
        ref={peacockRef}
        className="absolute"
        style={{
          height: "171%",
          width: "41%",
          left: "21.4%",
          top: 0,
          bottom: 0,
        }}
      >
        <Image
          src="/images/couple/peacock.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div
        ref={textRef}
        className="absolute left-1/2 top-[27%] z-30 -translate-x-1/2 -translate-y-1/2 px-4 text-center"
      >
        <p className="reveal-line text-xs tracking-wide text-[#1b2a4a] sm:text-sm">
          We cordially invite you to the
          <br />
          wedding ceremony of
        </p>
        <p className="reveal-line mt-2 font-serif text-3xl text-[#800020] sm:text-4xl">
          {COUPLE.brideName}
        </p>
        <p className="reveal-line text-[10px] text-[#6b7a3a] sm:text-xs">
          {COUPLE.brideParentage}
        </p>
        <div className="reveal-line my-3 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#c9a24b]" />
          <span className="font-serif italic text-[#c9a24b]">Weds</span>
          <span className="h-px w-10 bg-[#c9a24b]" />
        </div>
        <p className="reveal-line font-serif text-3xl text-[#800020] sm:text-4xl">
          {COUPLE.groomName}
        </p>
        <p className="reveal-line text-[10px] text-[#6b7a3a] sm:text-xs">
          {COUPLE.groomParentage}
        </p>
      </div>
    </section>
  );
}
