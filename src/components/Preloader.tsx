"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Mark } from "./Logo";

/**
 * First-visit preloader (once per session): brand, a counter 00→100 tied to real image
 * loading, then a wipe that hands over to the hero entrance. Skipped for reduced motion.
 */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const done = () => {
      window.__sfReady = true;
      window.dispatchEvent(new Event("sf:ready"));
    };
    if (!root.classList.contains("motion") || root.classList.contains("no-preload") || !ref.current) {
      done();
      return;
    }
    const imgs = [...document.images].filter((i) => i.loading !== "lazy");
    const total = Math.max(1, imgs.length);
    const state = { shown: 0 };
    const start = performance.now();
    let raf = 0;
    let finished = false;
    const loaded = () => imgs.filter((i) => i.complete).length / total;
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      // Never faster than ~1.2s, never slower than ~3.5s.
      const target = Math.min(1, Math.max(Math.min(loaded(), elapsed / 1.2), elapsed / 3.5));
      state.shown += (target - state.shown) * 0.12;
      if (target >= 1 && state.shown > 0.995) state.shown = 1;
      if (countRef.current) countRef.current.textContent = String(Math.round(state.shown * 100)).padStart(2, "0");
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${state.shown})`;
      if (state.shown >= 1 && !finished) {
        finished = true;
        gsap.to(ref.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.1,
          ease: "expo.inOut",
          delay: 0.15,
          onStart: done,
          onComplete: () => {
            try {
              sessionStorage.setItem("sf-loaded", "1");
            } catch {}
            root.classList.add("no-preload");
          },
        });
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="preloader" aria-hidden>
      <div className="preloader__row">
        <span className="preloader__brand">
          <Mark />
          Squarefoot Realty
        </span>
        <span ref={countRef} className="preloader__count">
          00
        </span>
        <span className="preloader__line">
          <i ref={lineRef} />
        </span>
      </div>
    </div>
  );
}
