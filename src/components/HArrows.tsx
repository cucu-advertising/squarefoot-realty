"use client";

import { useEffect, useRef, useState } from "react";
import { isPinned } from "./useSeqIndex";

/**
 * Prev / next arrows and a "scroll" hint for horizontal sequences. Works on the nearest section's
 * [data-track]: on desktop the track is moved by vertical scroll (pinned), so the arrows scroll the
 * page to the next card; on touch the track scrolls natively, so the arrows scroll the track.
 */
export default function HArrows({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [pinned, setPinned] = useState(false);

  const parts = () => {
    const section = ref.current?.closest<HTMLElement>("section");
    const track = section?.querySelector<HTMLElement>("[data-track]");
    return { section, track };
  };

  useEffect(() => {
    setPinned(isPinned());
    const { section, track } = parts();
    if (!section || !track) return;
    const update = () => {
      if (isPinned()) {
        const span = section.offsetHeight - window.innerHeight;
        const p = span > 0 ? (window.scrollY - (section.getBoundingClientRect().top + window.scrollY)) / span : 0;
        setEdge({ start: p <= 0.01, end: p >= 0.99 });
      } else {
        setEdge({ start: track.scrollLeft <= 4, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 });
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const { section, track } = parts();
    if (!section || !track) return;
    const items = [...track.children].filter((el) => !(el as HTMLElement).hasAttribute("data-track-skip")) as HTMLElement[];
    const pad = parseFloat(getComputedStyle(track).paddingLeft || "0");
    if (isPinned()) {
      const dist = Math.max(1, track.scrollWidth - window.innerWidth);
      const span = section.offsetHeight - window.innerHeight;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const cur = Math.max(0, Math.min(1, (window.scrollY - top) / span)) * dist;
      const stops = items.map((it) => Math.max(0, Math.min(dist, it.offsetLeft - pad)));
      const target = dir > 0 ? (stops.find((x) => x > cur + 8) ?? dist) : ([...stops].reverse().find((x) => x < cur - 8) ?? 0);
      const y = top + (target / dist) * span + 1;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      const stops = items.map((it) => it.offsetLeft - pad - track.offsetLeft);
      const cur = track.scrollLeft;
      const target = dir > 0 ? (stops.find((x) => x > cur + 8) ?? track.scrollWidth) : ([...stops].reverse().find((x) => x < cur - 8) ?? 0);
      track.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  return (
    <div ref={ref} className={`harrows harrows--${tone}`}>
      <span className="harrows__hint" aria-hidden>
        {pinned ? "Scroll" : "Swipe"} <i>→</i>
      </span>
      <button type="button" className="circle-btn" aria-label="Previous" disabled={edge.start} onClick={() => go(-1)}>
        <svg viewBox="0 0 16 16" aria-hidden>
          <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button type="button" className="circle-btn" aria-label="Next" disabled={edge.end} onClick={() => go(1)}>
        <svg viewBox="0 0 16 16" aria-hidden>
          <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}
