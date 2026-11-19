"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

/** Large typographic list of delivered projects with a cursor-following image preview on desktop. */
export default function DeliveredList({ items }: { items: Project[] }) {
  const [hover, setHover] = useState<Project | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  useEffect(() => {
    let raf = 0;
    const move = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };
    const tick = () => {
      const p = pos.current;
      p.cx += (p.x - p.cx) * 0.14;
      p.cy += (p.y - p.cy) * 0.14;
      if (preview.current) preview.current.style.translate = `${p.cx + 24}px ${p.cy - 120}px`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="delivered" onPointerLeave={() => setHover(null)}>
      {items.map((p) => (
        <div
          key={p.slug}
          className={`delivered__row ${p.hero ? "has-thumb" : ""}`}
          onPointerEnter={() => setHover(p.hero ? p : null)}
          data-reveal="fade"
        >
          {p.hero && (
            <div className="delivered__thumb">
              <Image src={p.hero.src} alt="" fill sizes="88px" />
            </div>
          )}
          <h3 className="delivered__name">
            {p.hasPage ? <Link href={`/projects/${p.slug}`}>{p.name}</Link> : p.name}
          </h3>
          <span className="delivered__loc">{p.locationShort}</span>
        </div>
      ))}
      <div ref={preview} className={`delivered__preview ${hover ? "is-on" : ""}`} aria-hidden>
        {items
          .filter((p) => p.hero)
          .map((p) => (
            <Image key={p.slug} src={p.hero!.src} alt="" fill sizes="420px" style={{ opacity: hover?.slug === p.slug ? 1 : 0, transition: "opacity .3s" }} />
          ))}
      </div>
    </div>
  );
}
