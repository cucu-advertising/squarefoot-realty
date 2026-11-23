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

/* ---- Stops: progress (0–1) at which each step of a pinned sequence is fully on screen ----
   Motion.tsx writes them to data-stops on the section, so buttons and autoplay use the same map. */
const readStops = (el: HTMLElement) => (el.dataset.stops ? el.dataset.stops.split(",").map(Number) : null);

/** Progress through a pinned section (0 at its top, 1 when its last frame is reached). */
export function sectionProgress(el: HTMLElement) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  const span = el.offsetHeight - window.innerHeight;
  return span > 0 ? (window.scrollY - top) / span : 0;
}

function scrollToProgress(el: HTMLElement, p: number, duration = 1.2) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  const span = el.offsetHeight - window.innerHeight;
  const y = top + Math.max(0, Math.min(1, p)) * span + 2;
  if (window.__lenis) window.__lenis.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/** Scroll a pinned section to step k. Returns false when the section has no stops (or is not pinned). */
export function goToStop(el: HTMLElement, k: number) {
  const stops = readStops(el);
  if (!stops || !isPinned()) return false;
  scrollToProgress(el, stops[Math.max(0, Math.min(stops.length - 1, k))]);
  return true;
}

/** Move a pinned section to its next (dir 1) or previous (dir -1) stop. Returns false at the end. */
export function stepStops(el: HTMLElement, dir: 1 | -1) {
  const stops = readStops(el);
  if (!stops || !isPinned()) return false;
  const p = sectionProgress(el);
  const target = dir > 0 ? stops.find((s) => s > p + 0.004) : [...stops].reverse().find((s) => s < p - 0.004);
  if (target === undefined) return false;
  scrollToProgress(el, target);
  return true;
}

/** Listen for the autoplay "next" request on a section; the handler returns true when it advanced. */
export function onAutoNext(el: HTMLElement | null, next: () => boolean) {
  if (!el) return () => {};
  const h = (e: Event) => {
    if (e.defaultPrevented) return;
    if (next()) e.preventDefault();
  };
  el.addEventListener("sf:next", h);
  return () => el.removeEventListener("sf:next", h);
}

export const isPinned = () => typeof document !== "undefined" && document.documentElement.classList.contains("pin");
