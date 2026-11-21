"use client";

import { useEffect, useState, type RefObject } from "react";

/** Current step of a pinned sequence; Motion.tsx dispatches "sf:index" on the section element. */
export function useSeqIndex(ref: RefObject<HTMLElement | null>, initial = 0) {
  const [i, setI] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = (e: Event) => setI((e as CustomEvent<number>).detail);
    el.addEventListener("sf:index", on);
    return () => el.removeEventListener("sf:index", on);
  }, [ref]);
  return [i, setI] as const;
}

/** Scroll so that a pinned section shows step k of n (used by rails, dots and prev/next). */
export function scrollToStep(el: HTMLElement, k: number, n: number, map?: (k: number) => number) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  const span = el.offsetHeight - window.innerHeight;
  const p = map ? map(k) : n > 1 ? k / (n - 1) : 0;
  const y = top + Math.max(0, Math.min(1, p)) * span + 2;
  if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/**
 * Project discovery timeline (Motion.tsx › discover). The first card grows over 0–1; each later
 * project wipes in at at(i) and then holds, fully legible, until the next one arrives.
 */
export const DISCOVER = {
  first: 1.6,
  gap: 1.5,
  at: (i: number) => DISCOVER.first + (i - 1) * DISCOVER.gap,
  duration: (n: number) => DISCOVER.first + (n - 1) * DISCOVER.gap,
  /** Timeline time at which step k is fully on screen. */
  rest: (k: number) => (k === 0 ? 1.25 : DISCOVER.at(k) + 1.05),
  /** Step showing at time t (switches once the next wipe is half way). */
  index: (t: number, n: number) => (t < DISCOVER.first + 0.4 ? 0 : Math.min(n - 1, 1 + Math.floor((t - DISCOVER.first - 0.4) / DISCOVER.gap))),
};

export const isPinned = () => typeof document !== "undefined" && document.documentElement.classList.contains("pin");
