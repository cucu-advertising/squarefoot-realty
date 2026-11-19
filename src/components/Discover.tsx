"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/lib/projects";
import { EnquireButton } from "./Enquiry";
import { Mark } from "./Logo";
import { useSeqIndex, scrollToStep } from "./useSeqIndex";

export interface DiscoverItem {
  project: Project;
  image?: { src: string; alt: string };
  tone: "image" | "red" | "ink";
  big?: { value: string; unit: string };
}

/**
 * Project discovery. Desktop: a giant brand marquee, then the first project grows from a card in the
 * middle of the marquee to full screen and the next projects wipe up over it (Motion.tsx › discover),
 * with an index rail. Touch / reduced motion: full-height rounded project panels in a column.
 */
export default function Discover({ items, marquee }: { items: DiscoverItem[]; marquee: string }) {
  const ref = useRef<HTMLElement>(null);
  const [k] = useSeqIndex(ref);
  const n = items.length;
  const goto = (i: number) => ref.current && scrollToStep(ref.current, i, n, (s) => (s === 0 ? 1.1 : 1.5 + s) / (n + 0.9));
  const active = items[k];
  return (
    <section ref={ref} className="discover pin" data-seq="discover" style={{ ["--len" as string]: `${(n + 2) * 100}vh` }} data-head="dark" aria-labelledby="discover-title">
      <div className="pin__stage">
        <div className="container discover__intro">
          <span className="label label--dot">Now unfolding</span>
          <h2 id="discover-title" className="t-display" style={{ marginTop: "var(--sp-3)" }} data-split>
            Spaces we are building.
          </h2>
        </div>
        <div className="mq" aria-hidden>
          <div className="mq__row">
            {[0, 1, 2, 3].map((i) => (
              <span key={i}>{marquee}</span>
            ))}
          </div>
        </div>
        <div className="disc__panels">
          {items.map((it, i) => (
            <article key={it.project.slug} className={`disc__panel ${it.tone === "red" ? "disc__panel--red" : it.tone === "ink" ? "disc__panel--ink" : ""}`} data-head={it.tone === "red" ? "red" : "dark"} aria-labelledby={`disc-${it.project.slug}`}>
              {it.tone === "image" && it.image ? (
                <div className="disc__media">
                  <Image src={it.image.src} alt={it.image.alt} fill sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" quality={80} />
                </div>
              ) : (
                <div className="disc__brand" aria-hidden>
                  {it.tone === "red" ? <Mark onRed /> : <span className="disc__sun" />}
                  {it.big && (
                    <span className="disc__big">
                      {it.big.value}
                      <small>{it.big.unit}</small>
                    </span>
                  )}
                </div>
              )}
              <div className="disc__content">
                <div className="container disc__row">
                  <div>
                    <span className="label">
                      0{i + 1} · {it.project.statusLabel} · {it.project.locationShort}
                    </span>
                    <h3 id={`disc-${it.project.slug}`} className="t-hero disc__name">
                      {it.project.name}
                    </h3>
                    <p className="t-lead disc__pitch">{it.project.pitch}</p>
                    {it.project.facts.length > 1 && (
                      <ul role="list" className="facts">
                        {it.project.facts.slice(0, 4).map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="btn-row">
                    <Link href={`/projects/${it.project.slug}`} className={`pill ${it.tone === "red" ? "" : "pill--light"}`}>
                      Explore project <span className="arr" aria-hidden>↗</span>
                    </Link>
                    {it.project.brochure ? (
                      <EnquireButton className="pill pill--ghost" mode="brochure" project={it.project.slug} source="home-discover">
                        Brochure
                      </EnquireButton>
                    ) : (
                      <EnquireButton className="pill pill--ghost" project={it.project.slug} source="home-discover">
                        {it.project.status === "upcoming" ? "Register interest" : "Enquire"}
                      </EnquireButton>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <nav className={`disc__ui ${active?.tone === "red" ? "on-red" : ""}`} aria-label="Projects in this sequence">
          {items.map((it, i) => (
            <button key={it.project.slug} type="button" aria-current={i === k} onClick={() => goto(i)}>
              {it.project.name}
              <i />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
