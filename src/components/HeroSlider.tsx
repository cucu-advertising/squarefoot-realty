"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface Slide {
  src: string;
  alt: string;
  caption: string;
  href: string;
  position?: string;
  mobilePosition?: string;
}

const MS = 6500;

/** Full-viewport cross-fading hero with a slow push-in on each render. Pauses on hover/focus and when hidden. */
export default function HeroSlider({ slides, children }: { slides: Slide[]; children: React.ReactNode }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const timer = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || userPaused || n < 2) return;
    timer.current = window.setTimeout(() => go(i + 1), MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [i, paused, userPaused, go, n]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <section
      className={`hero tsec ${paused || userPaused ? "is-paused" : ""}`}
      data-theme="dark"
      data-hero-image
      aria-roledescription="carousel"
      aria-label="Featured architecture"
      style={{ ["--slide-ms" as string]: `${MS}ms` }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {slides.map((s, k) => (
        <div key={s.src} className={`hero__slide ${k === i ? "is-active" : ""}`} aria-hidden={k !== i}>
          <Image
            src={s.src}
            alt={s.alt}
            fill
            priority={k === 0}
            sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"
            quality={80}
            className="hero__img"
            style={{ ["--pos" as string]: s.position ?? "50% 50%", ["--mpos" as string]: s.mobilePosition ?? s.position ?? "50% 50%" }}
          />
        </div>
      ))}
      <div className="hero__shade" />
      <div className="hero__content on-image">
        <div className="container">
          {children}
          <div className="hero__bar">
            <div className="hero__dots" role="tablist" aria-label="Choose image">
              {slides.map((s, k) => (
                <button
                  key={s.src}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  aria-current={k === i}
                  aria-label={`Show ${s.caption}`}
                  className="hero__dot"
                  onClick={() => go(k)}
                >
                  <span>{s.caption}</span>
                  <i />
                </button>
              ))}
            </div>
            <button type="button" className="hero__pause" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}>
              <svg viewBox="0 0 12 12" width="12" aria-hidden>
                {userPaused ? <path d="M2 1l9 5-9 5z" fill="currentColor" /> : <path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor" />}
              </svg>
            </button>
            <Link href={slides[i].href} className="hero__scroll" aria-label={`View ${slides[i].caption}`}>
              {slides[i].caption.split(" · ")[0]}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
