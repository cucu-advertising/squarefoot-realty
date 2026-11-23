"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ExploreView } from "@/lib/projects";
import { useSeqIndex, goToStop, isPinned, onAutoNext } from "./useSeqIndex";
import SeqNav from "./SeqNav";

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
    if (isPinned() && ref.current) goToStop(ref.current, Math.max(0, Math.min(n - 1, k)));
    else setI((k + n) % n);
  };
  // Autoplay on touch (pinned sequences advance through their stops in AutoAdvance).
  useEffect(() => onAutoNext(ref.current, () => (isPinned() ? false : (setI((x) => (x + 1) % n), true))), [n, setI]);
  // Static mode keeps the progress bar honest.
  useEffect(() => {
    if (!isPinned()) ref.current?.querySelector<HTMLElement>(".exp__bar")?.style.setProperty("--p", String(n > 1 ? i / (n - 1) : 1));
  }, [i, n]);
  const v = views[i];
  const [isPinnedNow, setPinnedNow] = useState(false);
  useEffect(() => setPinnedNow(isPinned()), []);
  return (
    <section ref={ref} className="explore pin" data-seq="explore" data-autoplay style={{ ["--len" as string]: `${n * 100 + 40}vh` }} data-head="dark" aria-roledescription="carousel" aria-labelledby="explore-title">
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
        <div className="exp__rail">
          <SeqNav n={n} current={i} onGo={go} vertical arrows={false} label="Views" />
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
              <SeqNav n={n} current={i} onGo={go} loop={!isPinnedNow} label="Previous or next view" />
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
