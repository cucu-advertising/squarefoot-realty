"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isPinned, stepStops } from "./useSeqIndex";

const IDLE_MS = 6000; // advance after 6 s without input
const ARM_MS = 1000; // the ring on the next arrow starts filling after 1 s

/**
 * Autoplay: when nobody has scrolled, clicked, touched or typed for six seconds, the sequence on
 * screen moves to its next step. Pinned sequences step through their stops (and stop at the end);
 * carousels and swipe rows step and loop. The next arrow of that sequence shows a filling ring.
 * Off for reduced motion, while a menu or viewer is open, and in a background tab.
 */
export default function AutoAdvance() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.__sfNoAutoplay) return;
    let last = performance.now();
    let armed: HTMLElement | null = null;
    let spent = new WeakSet<HTMLElement>(); // sequences that reached their end since the last input

    const disarm = () => {
      armed?.removeAttribute("data-autoplay-armed");
      armed = null;
    };
    const activity = () => {
      last = performance.now();
      spent = new WeakSet();
      disarm();
    };

    const blocked = () =>
      document.hidden ||
      !window.__sfReady ||
      document.documentElement.style.overflow === "hidden" ||
      Boolean(document.querySelector("[role='dialog']")) ||
      Boolean(document.querySelector(".nav__drop.is-open"));

    const target = () => {
      const vh = window.innerHeight;
      for (const el of document.querySelectorAll<HTMLElement>("[data-autoplay]")) {
        if (spent.has(el)) continue;
        const r = el.getBoundingClientRect();
        const pinnedNow = isPinned() && el.classList.contains("pin");
        const inView = pinnedNow ? r.top <= 2 && r.bottom >= vh - 2 : r.top < vh * 0.55 && r.bottom > vh * 0.45 && r.height > 0;
        if (inView) return el;
      }
      return null;
    };

    const tick = () => {
      const idle = performance.now() - last;
      if (blocked()) return disarm();
      const el = target();
      if (el !== armed) disarm();
      if (!el) return;
      if (idle >= ARM_MS && !armed) {
        armed = el;
        el.setAttribute("data-autoplay-armed", "");
      }
      if (idle < IDLE_MS) return;
      let moved = stepStops(el, 1);
      if (!moved) {
        const ev = new CustomEvent("sf:next", { cancelable: true });
        el.dispatchEvent(ev);
        moved = ev.defaultPrevented;
      }
      if (!moved) spent.add(el);
      // Wait another full interval before the next step (the ring restarts after the move).
      last = performance.now();
      disarm();
    };

    const opts = { passive: true } as const;
    const events = ["wheel", "touchstart", "pointerdown", "keydown", "mousemove"] as const;
    events.forEach((e) => window.addEventListener(e, activity, opts));
    const id = window.setInterval(tick, 250);
    return () => {
      window.clearInterval(id);
      events.forEach((e) => window.removeEventListener(e, activity));
      disarm();
    };
  }, [pathname]);
  return null;
}
