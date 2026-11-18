"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { distances, keyDistances, location, locationStory } from "@/content/site";
import ZoomViewer, { type ZoomImage } from "../ZoomViewer";

const MAP: ZoomImage = {
  src: "/images/plans/location-map.png",
  width: 2850,
  height: 1950,
  alt: "Location map of The Square near ORR, Kongara Kalan — not to scale",
  title: "Location map (not to scale)",
};

export default function Location() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<ZoomImage | null>(null);
  const close = useCallback(() => setZoom(null), []);
  const coords = location.coordinates;
  const d = distances[tab];

  return (
    <section id="location" className="location section" aria-labelledby="loc-title">
      <div className="wrap">
        <div className="split">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__num">06</span> Location
            </p>
            <h2 id="loc-title" className="h2" data-split>
              The world’s happening <em>at Hyderabad’s South.</em>
            </h2>
          </div>
          <p className="lead" data-reveal>
            {locationStory.text}
          </p>
        </div>

        <ul className="key-dist" data-reveal>
          {keyDistances.map(([name, mins]) => (
            <li key={name}>
              <span className="key-dist__min">
                {mins}
                <small>min</small>
              </span>
              <span className="key-dist__name">{name}</span>
            </li>
          ))}
        </ul>

        <div className="location__grid">
          <div className="location__map" data-reveal="mask">
            {coords ? (
              <iframe
                title="Map showing the location of The Square"
                src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=14&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <button type="button" className="location__mapbtn" onClick={() => setZoom(MAP)} aria-label="Open location map in zoom viewer">
                <Image src={MAP.src} alt={MAP.alt} width={MAP.width} height={MAP.height} sizes="(max-width: 960px) 100vw, 58vw" />
                <span className="chip" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" />
                  </svg>
                  Zoom map
                </span>
              </button>
            )}
          </div>

          <div className="location__side">
            <address className="location__addr" data-reveal>
              <strong>The Square</strong>
              {location.full}
            </address>
            <div className="cta-row" data-reveal>
              <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
                <span>Get Directions</span>
                <span className="btn__icon btn__icon--ne" aria-hidden="true">
                  <span>↗</span>
                </span>
              </a>
            </div>

            <div className="dist" data-reveal>
              <button type="button" className="dist__toggle" aria-expanded={open} aria-controls="dist-panel" onClick={() => setOpen((o) => !o)}>
                <span>All drive times</span>
                <span className="plus" aria-hidden="true" />
              </button>
              <div id="dist-panel" className="dist__panel" hidden={!open}>
                <div className="dist__tabs" role="group" aria-label="Show drive times for">
                  {distances.map((x, i) => (
                    <button key={x.title} type="button" aria-pressed={i === tab} onClick={() => setTab(i)}>
                      {x.title}
                    </button>
                  ))}
                </div>
                <ul className="dist__list" key={d.title}>
                  {d.items.map(([name, mins]) => (
                    <li key={name}>
                      <span>{name}</span>
                      <span className="dist__min">{mins} min</span>
                    </li>
                  ))}
                </ul>
                <p className="meta">Approximate drive times, as stated in the project brochure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ZoomViewer image={zoom} onClose={close} />
    </section>
  );
}
