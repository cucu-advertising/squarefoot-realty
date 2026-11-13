"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole page: any element with [data-reveal] gets
 * .is-in when it enters the viewport. Number counters use [data-count].
 * Content is fully visible without JS (see `.js` gating in globals.css).
 */
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const count = (el: HTMLElement) => {
      const target = el.dataset.count!;
      const n = Number(target.replace(/,/g, ""));
      const dec = target.includes(".") ? target.split(".")[1].length : 0;
      if (reduce || !Number.isFinite(n)) return;
      const t0 = performance.now();
      const dur = 1600;
      const fmt = (v: number) =>
        dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN").replace(/^(\d+),(\d{3})$/, "$1,$2");
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = p < 1 ? fmt(n * e) : target;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
