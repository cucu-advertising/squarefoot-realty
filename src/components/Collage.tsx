"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Img } from "@/lib/projects";
import { useSeqIndex, goToStop } from "./useSeqIndex";
import HArrows from "./HArrows";
import SeqNav from "./SeqNav";

/**
 * Desktop: scattered architectural collage around the statement; on scroll the images converge,
 * grow to near full screen, then peel away one by one (Motion.tsx › collage).
 * Touch / reduced motion: the same images as a swipeable row.
 */
export default function Collage({ label, title, line, images }: { label: string; title: React.ReactNode; line?: string; images: Img[] }) {
  const ref = useRef<HTMLElement>(null);
  const [k] = useSeqIndex(ref);
  const n = images.length;
  // Stack order: the last image sits on top and is shown first.
  const shown = n - 1 - k;
  const go = (j: number) => ref.current && goToStop(ref.current, j);
  return (
    <section ref={ref} className="collage pin curtain" data-seq="collage" data-autoplay style={{ ["--len" as string]: `${360 + n * 50}vh` }} data-head="light" aria-labelledby="collage-title">
      <div className="pin__stage">
        <div className="collage__head">
          <span className="label label--dot" data-reveal="fade" style={{ justifySelf: "center" }}>
            {label}
          </span>
          <h2 id="collage-title" className="t-display" data-split>
            {title}
          </h2>
          {line && (
            <p className="t-lead muted" data-reveal="fade">
              {line}
            </p>
          )}
        </div>
        <div className="collage__items" data-track>
          {images.map((img) => (
            <figure key={img.src} className="collage__item">
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 88vw, 80vw" quality={78} />
              <figcaption>{img.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="collage__swipe">
          <HArrows tone="light" numbers />
        </div>
        <div className="collage__desk on-image" aria-live="polite">
          <div className="container">
            <span className="collage__cap">
              {String(n - shown).padStart(2, "0")} / {String(n).padStart(2, "0")} · {images[shown]?.caption}
            </span>
            <span className="collage__btns">
              <span className="harrows__hint" aria-hidden>
                Scroll <i>→</i>
              </span>
              <SeqNav n={n} current={k} onGo={go} tone="dark" label="Images" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
