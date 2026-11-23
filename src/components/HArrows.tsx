"use client";

import { useEffect, useRef, useState } from "react";
import { isPinned, onAutoNext } from "./useSeqIndex";

const items = (track: HTMLElement) => [...track.children].filter((el) => !(el as HTMLElement).hasAttribute("data-track-skip")) as HTMLElement[];

/** Where each item of a horizontal [data-track] sits, and where the row is now (pinned: page scroll; touch: track scroll). */
function geometry(section: HTMLElement, track: HTMLElement) {
  const pad = parseFloat(getComputedStyle(track).paddingLeft || "0");
  const list = items(track);
  if (isPinned()) {
    const dist = Math.max(1, track.scrollWidth - window.innerWidth);
    const span = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const cur = Math.max(0, Math.min(1, (window.scrollY - top) / span)) * dist;
    const stops = list.map((it) => Math.max(0, Math.min(dist, it.offsetLeft - pad)));
    const to = (x: number) => {
      const y = top + (x / dist) * span + 1;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    };
    return { stops, cur, end: dist, to };
  }
  const stops = list.map((it) => Math.max(0, it.offsetLeft - track.offsetLeft - pad));
  const end = Math.max(0, track.scrollWidth - track.clientWidth);
  return { stops, cur: track.scrollLeft, end, to: (x: number) => track.scrollTo({ left: Math.min(end, x), behavior: "smooth" }) };
}

/** Bring item j of a horizontal [data-track] into place. */
export function scrollToTrackItem(from: HTMLElement, j: number) {
  const section = from.closest<HTMLElement>("section");
  const track = section?.querySelector<HTMLElement>("[data-track]");
  if (!section || !track) return;
  const g = geometry(section, track);
  if (g.stops[j] !== undefined) g.to(g.stops[j]);
}

/**
 * Prev / next arrows (optionally 01 / 02 / 03 numbers) and a "Scroll →" / "Swipe →" hint for
 * horizontal rows. Also answers the autoplay "next" request for its section.
 */
export default function HArrows({ tone = "dark", numbers = false }: { tone?: "dark" | "light"; numbers?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [pinned, setPinned] = useState(false);
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);

  const parts = () => {
    const section = ref.current?.closest<HTMLElement>("section");
    const track = section?.querySelector<HTMLElement>("[data-track]");
    return { section, track };
  };

  const go = (dir: 1 | -1) => {
    const { section, track } = parts();
    if (!section || !track) return false;
    const g = geometry(section, track);
    if (dir > 0 && g.cur >= g.end - 4) return false;
    const target = dir > 0 ? (g.stops.find((x) => x > g.cur + 8) ?? g.end) : ([...g.stops].reverse().find((x) => x < g.cur - 8) ?? 0);
    g.to(target);
    return true;
  };

  useEffect(() => {
    setPinned(isPinned());
    const { section, track } = parts();
    if (!section || !track) return;
    setCount(items(track).length);
    const update = () => {
      const g = geometry(section, track);
      setEdge({ start: g.cur <= 4, end: g.cur >= g.end - 4 });
      let best = 0;
      g.stops.forEach((x, k) => {
        if (Math.abs(x - g.cur) < Math.abs(g.stops[best] - g.cur)) best = k;
      });
      setCurrent(g.cur >= g.end - 4 ? g.stops.length - 1 : best);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Autoplay: step to the next card; on touch, return to the first after the last.
    const off = onAutoNext(section, () => {
      if (!ref.current?.offsetParent) return false;
      if (go(1)) return true;
      if (isPinned()) return false;
      track.scrollTo({ left: 0, behavior: "smooth" });
      return true;
    });
    return () => {
      window.removeEventListener("scroll", update);
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={`harrows harrows--${tone}`}>
      <span className="harrows__hint" aria-hidden>
        {pinned ? "Scroll" : "Swipe"} <i>→</i>
      </span>
      <nav className={`seqnav seqnav--${tone}`} aria-label="Slide">
        <button type="button" className="seqnav__arrow" aria-label="Previous" disabled={edge.start} onClick={() => go(-1)}>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        {numbers &&
          Array.from({ length: count }, (_, k) => (
            <button key={k} type="button" className="seqnav__n" aria-current={k === current} aria-label={`Go to ${String(k + 1).padStart(2, "0")}`} onClick={(e) => scrollToTrackItem(e.currentTarget, k)}>
              <span>{String(k + 1).padStart(2, "0")}</span>
            </button>
          ))}
        <button type="button" className="seqnav__arrow js-autonext" aria-label="Next" disabled={edge.end} onClick={() => go(1)}>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
