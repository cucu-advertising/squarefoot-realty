"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hover label for elements marked data-cursor="Label" (fine pointers only): a frosted pill with a
 * yellow dot and an arrow that follows the pointer with a little lag.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [shown, setShown] = useState<string>("");
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const pos = { x: 0, y: 0, cx: 0, cy: 0 };
    let raf = 0;
    const pick = (el: Element | null) => {
      const t = (el as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      // Buttons and links inside a card keep their own hover; the label steps aside.
      const own = (el as HTMLElement | null)?.closest("button, a:not([data-cursor])");
      const l = t && !(own && t.contains(own)) ? (t.dataset.cursor ?? null) : null;
      setLabel(l);
      if (l) setShown(l);
    };
    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      pick(e.target as Element);
    };
    const tick = () => {
      pos.cx += (pos.x - pos.cx) * 0.2;
      pos.cy += (pos.y - pos.cy) * 0.2;
      if (ref.current) ref.current.style.translate = `${pos.cx}px ${pos.cy}px`;
      raf = requestAnimationFrame(tick);
    };
    // Content can scroll under a still pointer: re-check what is beneath it.
    let seen = false;
    const onScroll = () => seen && pick(document.elementFromPoint(pos.x, pos.y));
    const markSeen = () => (seen = true);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointermove", markSeen, { passive: true, once: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className={`cursor ${label ? "is-on" : ""}`} aria-hidden>
      <span className="cursor__pill">
        <i className="cursor__dot" />
        {shown}
        <svg className="cursor__arr" viewBox="0 0 16 16">
          <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
    </div>
  );
}
