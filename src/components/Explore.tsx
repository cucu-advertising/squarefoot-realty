"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ExploreView } from "@/lib/projects";
import { useSeqIndex, scrollToStep, isPinned } from "./useSeqIndex";

/**
 * 2D architectural exploration built from real renders (no invented 3D or floor data).
 * Desktop: pinned; each scroll step cross-fades to the next view with a slow push-in, while the
 * rail, number, caption and progress bar follow. Touch: tap the rail, swipe, or use arrows.
 */
export default function Explore({ title, views }: { title: string; views: ExploreView[] }) {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useSeqIndex(ref);
  const n = views.length;
  const touchX = useRef<number | null>(null);
  const go = (k: number) => {
    const next = (k + n) % n;
    if (isPinned() && ref.current) scrollToStep(ref.current, next, n);
    else setI(next);
  };
  // Static mode keeps the progress bar honest.
  useEffect(() => {
    if (!isPinned()) ref.current?.querySelector<HTMLElement>(".exp__bar")?.style.setProperty("--p", String(n > 1 ? i / (n - 1) : 1));
  }, [i, n]);
  const v = views[i];
  return (
    <section ref={ref} className="explore pin" data-seq="explore" style={{ ["--len" as string]: `${n * 100 + 40}vh` }} data-head="dark" aria-roledescription="carousel" aria-labelledby="explore-title">
      <div className="pin__stage exp__stage">
        {views.map((view, k) => (
          <div key={view.image.src} className={`exp__layer ${k === i ? "is-on" : ""}`} aria-hidden={k !== i}>
            <Image src={view.image.src} alt={view.image.alt} fill sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" quality={80} />
          </div>
        ))}
        <div className="exp__shade" />
        <div
          className="exp__swipe"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
        />
        <div className="exp__head on-image">
          <div className="container">
            <span className="label label--dot">{title}</span>
          </div>
        </div>
        <div className="exp__rail" role="tablist" aria-label="Views">
          {views.map((view, k) => (
            <button key={view.title} type="button" role="tab" aria-selected={k === i} aria-current={k === i} aria-label={`${String(k + 1).padStart(2, "0")} ${view.title}`} onClick={() => go(k)}>
              <i />
            </button>
          ))}
        </div>
        <div className="exp__ui on-image">
          <div className="container">
            <div className="exp__row">
              <div aria-live="polite">
                <p id="explore-title" className="t-h2 exp__title">
                  {v.title}
                </p>
                <p className="exp__cap">{v.caption}</p>
              </div>
              <p className="exp__num">
                {String(i + 1).padStart(2, "0")}
                <small>of {String(n).padStart(2, "0")}</small>
              </p>
            </div>
            <div className="exp__bar" aria-hidden>
              <i />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
