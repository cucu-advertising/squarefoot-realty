"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Highlight } from "@/lib/projects";
import { useSeqIndex, goToStop } from "./useSeqIndex";
import SeqNav from "./SeqNav";

/**
 * Signature details as one directed sequence (desktop): a statement, the first image rising from
 * below, expanding to full screen, then settling into a split composition while each detail
 * takes its turn. Touch / reduced motion: alternating image + text rows.
 */
export default function HighlightSeq({ label, statement, overline, items, children }: { label: string; statement: React.ReactNode; overline: string; items: Highlight[]; children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [k] = useSeqIndex(ref);
  const go = (j: number) => ref.current && goToStop(ref.current, j);
  return (
    <section ref={ref} className="hseq pin" data-seq="hseq" data-autoplay style={{ ["--len" as string]: `${300 + items.length * 100}vh` }} data-head="light" aria-labelledby="hseq-title">
      <div className="pin__stage">
        <div className="hseq__intro">
          <span className="label label--dot" style={{ justifySelf: "center" }}>
            {label}
          </span>
          <h2 id="hseq-title" className="t-display" data-split>
            {statement}
          </h2>
        </div>
        <ol role="list" className="hseq__list">
          {items.map((h, i) => (
            <li key={h.title} className="hseq__item">
              {h.image && (
                <div className="hseq__media" data-head="dark">
                  <Image src={h.image.src} alt={h.image.alt} fill sizes="(min-width: 1024px) 100vw, 100vw" quality={80} />
                </div>
              )}
              <div className="hseq__text">
                <span className="hseq__n">
                  0{i + 1} / 0{items.length}
                </span>
                <h3 className="t-h2 hseq__title">{h.title}</h3>
                <p className="t-lead hseq__line">{h.line}</p>
                {i === items.length - 1 && children && <div style={{ marginTop: "var(--sp-4)" }}>{children}</div>}
              </div>
            </li>
          ))}
        </ol>
        <div className="hseq__over" aria-hidden>
          <div className="container">
            <span className="label">{overline}</span>
            <p className="t-hero" style={{ marginTop: "var(--sp-2)", maxWidth: "11ch" }}>
              {items[0]?.title}
            </p>
          </div>
        </div>
        <div className="hseq__count">
          <SeqNav n={items.length} current={k} onGo={go} tone="light" label="Signature details" />
        </div>
      </div>
    </section>
  );
}
