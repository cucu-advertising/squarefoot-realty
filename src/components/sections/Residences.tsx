"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { residences, specifications, configurationOptions, type FloorKey } from "@/content/site";
import { EnquireButton } from "../EnquiryProvider";
import ZoomViewer, { type ZoomImage } from "../ZoomViewer";

export default function Residences() {
  const [ti, setTi] = useState(0);
  const [floor, setFloor] = useState<FloorKey>("ground");
  const [zoom, setZoom] = useState<{ img: ZoomImage; dl?: string } | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const r = residences[ti];
  const plan = r.plans.find((p) => p.key === floor)!;
  const closeZoom = useCallback(() => setZoom(null), []);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const n = residences.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : null;
    if (next === null) return;
    e.preventDefault();
    setTi(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="residences" className="residences section" aria-labelledby="res-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow__num">03</span> Residences &amp; floor plans
          </p>
          <h2 id="res-title" className="display-2" data-split>
            East &amp; west facing duplex villas, <em>every one 3,700 sft.</em>
          </h2>
          <p className="section-head__text" data-reveal>
            Step into villas that display the finest space planning, where a symphony of indoors and outdoors charms you with thoughtful additions and
            meticulous craftsmanship.
          </p>
        </div>

        <div className="res-tabs" role="tablist" aria-label="Residence type">
          {residences.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={i === ti}
              aria-controls={`panel-${x.id}`}
              tabIndex={i === ti ? 0 : -1}
              className="res-tab"
              onClick={() => setTi(i)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              <span className="res-tab__type">{x.type}</span>
              <span className="res-tab__name">{x.name}</span>
            </button>
          ))}
        </div>

        <div className="res-panel" role="tabpanel" id={`panel-${r.id}`} aria-labelledby={`tab-${r.id}`} key={r.id}>
          <div className="res-info">
            <div className="res-info__head">
              <span className="res-info__num" aria-hidden="true">{r.type.replace("Type ", "")}</span>
              <div>
                <h3 className="res-info__title">{r.name}</h3>
                <p className="res-info__sub">4-BHK luxury duplex villa · {r.floors} + terrace</p>
              </div>
            </div>

            <dl className="res-spec">
              <div>
                <dt>Plot sizes</dt>
                <dd>{r.plotSizes}</dd>
              </div>
              <div>
                <dt>Built-up area</dt>
                <dd>{r.builtUp}</dd>
              </div>
              {r.areas.map((a) => (
                <div key={a.label}>
                  <dt>{a.label}</dt>
                  <dd>{a.value}</dd>
                </div>
              ))}
            </dl>

            <h4 className="res-info__h">Key spaces</h4>
            <ul className="res-rooms">
              {r.rooms.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>

            <div className="res-info__ctas">
              <EnquireButton className="btn btn--solid" source="Residences" configuration={configurationOptions[ti]}>
                Enquire about {r.type}
              </EnquireButton>
              <a href={r.download} className="btn btn--ghost" download>
                <span>Download Floor Plan</span>
                <span className="btn__icon btn__icon--down" aria-hidden="true"><span>↓</span></span>
              </a>
            </div>
          </div>

          <div className="plan">
            <div className="plan__floors" role="group" aria-label="Choose floor">
              {r.plans.map((p) => (
                <button key={p.key} type="button" aria-pressed={p.key === floor} onClick={() => setFloor(p.key)}>
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="plan__stage"
              onClick={() => setZoom({ img: { ...plan, alt: `${r.type} ${r.name} — ${plan.label} plan`, title: `${r.type} · ${r.name} · ${plan.label}` }, dl: r.download })}
              aria-label={`Open ${plan.label.toLowerCase()} plan of ${r.name} in zoom viewer`}
            >
              <Image
                key={plan.src}
                src={plan.src}
                alt={`${r.type} ${r.name} — ${plan.label} plan with room dimensions`}
                width={plan.width}
                height={plan.height}
                sizes="(max-width: 860px) 92vw, 46vw"
                quality={90}
                className="plan__img"
              />
              <span className="plan__zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" /></svg>
                Zoom plan
              </span>
            </button>
            <div className="plan__foot">
              <button
                type="button"
                className="link-btn"
                onClick={() => setZoom({ img: { ...r.sheet, alt: `${r.type} ${r.name} — complete floor plan sheet`, title: `${r.type} · ${r.name} · All floors` }, dl: r.download })}
              >
                View all floors together ↗
              </button>
              <span>Plans from the project brochure. Not to scale.</span>
            </div>
          </div>
        </div>

        <div className="masterplan" data-reveal>
          <div className="masterplan__text">
            <h3 className="display-3">Site layout plan</h3>
            <p>
              131 villas along 40&prime; &amp; 30&prime; wide internal BT roads with avenue plantation, alongside the clubhouse, a commercial space and a
              landscaped strip of 26 activity and seating zones, numbered as in the brochure legend.
            </p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() =>
                setZoom({
                  img: { src: "/images/plans/site-layout.jpg", width: 4800, height: 2120, alt: "The Square site layout plan with villa plot numbers and legend", title: "Site layout plan" },
                })
              }
            >
              <span>Explore the site plan</span>
              <span className="btn__icon btn__icon--ne" aria-hidden="true"><span>↗</span></span>
            </button>
          </div>
          <button
            type="button"
            className="masterplan__img frame"
            onClick={() =>
              setZoom({
                img: { src: "/images/plans/site-layout.jpg", width: 4800, height: 2120, alt: "The Square site layout plan with villa plot numbers and legend", title: "Site layout plan" },
              })
            }
            aria-label="Open site layout plan in zoom viewer"
          >
            <Image src="/images/plans/site-layout.jpg" alt="Site layout plan of The Square" width={4800} height={2120} sizes="(max-width: 860px) 100vw, 60vw" />
          </button>
        </div>

        <div className="specs" data-reveal>
          <div className="specs__head">
            <h3 className="display-3">Specifications</h3>
            <p>As detailed in the project brochure. Makes are indicative: “or equivalent” applies throughout.</p>
          </div>
          <div className="specs__list">
            {specifications.map((s) => (
              <details key={s.title} className="spec">
                <summary>
                  <span>{s.title}</span>
                  <span className="plus" aria-hidden="true" />
                </summary>
                <ul>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </div>

      <ZoomViewer image={zoom?.img ?? null} download={zoom?.dl} onClose={closeZoom} />
    </section>
  );
}
