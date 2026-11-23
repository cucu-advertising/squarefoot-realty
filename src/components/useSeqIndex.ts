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

export const isPinned = () => typeof document !== "undefined" && document.documentElement.classList.contains("pin");
