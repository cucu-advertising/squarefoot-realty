"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Highlight } from "@/lib/projects";
import { Mark } from "./Logo";
import SeqNav from "./SeqNav";
import { goToStop, isPinned } from "./useSeqIndex";

/**
 * Standout features as paired cards (text card + image card). Desktop: pinned, each new pair
 * slides in from the right over the previous one, which recedes. Touch: stacked pairs.
 * The 01 / 02 / 03 numbers and arrows on each card jump between features.
 */
export default function Slides({ items, fallbackImage, brandRed }: { items: Highlight[]; fallbackImage?: { src: string; alt: string }; brandRed?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const n = items.length;
  const go = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const j = Math.max(0, Math.min(n - 1, k));
    if (isPinned() && goToStop(el, j)) return;
    el.querySelectorAll<HTMLElement>(".slides__item")[j]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <section ref={ref} className="slides pin" data-seq="slides" data-autoplay style={{ ["--len" as string]: `${n * 100 + 30}vh` }} data-head="light" aria-label="Standout features">
      <div className="pin__stage">
        {items.map((h, i) => {
          const img = h.image ?? fallbackImage;
          return (
            <article key={h.title} className="slides__item">
              <div className={`slides__card slides__text ${i % 2 ? "slides__text--light" : ""}`}>
                <SeqNav n={n} current={i} onGo={go} tone={i % 2 ? "light" : "dark"} label="Features" />
                <div>
                  <h3 className="t-h2">{h.title}</h3>
                  <p className="t-lead" style={{ marginTop: "var(--sp-2)", opacity: 0.85, maxWidth: "32ch" }}>
                    {h.line}
                  </p>
                </div>
              </div>
              {img && !brandRed ? (
                <div className="slides__card slides__img" style={{ position: "relative" }}>
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" quality={80} />
                </div>
              ) : (
                <div className="slides__card slides__img slides__img--red" aria-hidden>
                  <Mark onRed />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
