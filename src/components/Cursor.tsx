"use client";

import { useEffect, useRef, useState } from "react";

/** A small label that follows the pointer over elements marked data-cursor="Label" (fine pointers only). */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const pos = { x: 0, y: 0, cx: 0, cy: 0 };
    let raf = 0;
    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(t ? t.dataset.cursor ?? null : null);
    };
    const tick = () => {
      pos.cx += (pos.x - pos.cx) * 0.18;
      pos.cy += (pos.y - pos.cy) * 0.18;
      if (ref.current) ref.current.style.translate = `${pos.cx}px ${pos.cy}px`;
      raf = requestAnimationFrame(tick);
    };
    // Content can scroll under a still pointer: re-check what is beneath it.
    let seen = false;
    const onScroll = () => {
      if (!seen) return;
      const t = (document.elementFromPoint(pos.x, pos.y) as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(t ? t.dataset.cursor ?? null : null);
    };
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
      {label}
    </div>
  );
}
