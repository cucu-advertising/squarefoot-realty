"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { distances, location, locationStory } from "@/content/site";
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
  const [zoom, setZoom] = useState<ZoomImage | null>(null);
  const close = useCallback(() => setZoom(null), []);
  const max = Math.max(...distances.flatMap((d) => d.items.map((i) => i[1])));
  const coords = location.coordinates;

  return (
    <section id="location" className="location section" aria-labelledby="loc-title">
      <div className="wrap">
        <div className="location__grid">
          <div className="location__copy">
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__num">06</span> Location &amp; connectivity
            </p>
            <h2 id="loc-title" className="display-2" data-split>
              The world’s happening at <em>Hyderabad’s South.</em>
            </h2>
            <p className="location__text" data-reveal>{locationStory.text}</p>
            <address className="location__addr" data-reveal>
              <span className="location__pin" aria-hidden="true" />
              <span>
                <strong>The Square</strong>
                {location.full}
              </span>
            </address>
            <div className="location__ctas" data-reveal>
              <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
                <span>Get Directions</span>
                <span className="btn__icon btn__icon--ne" aria-hidden="true"><span>↗</span></span>
              </a>
              <button type="button" className="btn btn--ghost" onClick={() => setZoom(MAP)}>
                <span>View location map</span>
                <span className="btn__icon btn__icon--ne" aria-hidden="true"><span>↗</span></span>
              </button>
            </div>
          </div>

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
                <Image src={MAP.src} alt={MAP.alt} width={MAP.width} height={MAP.height} sizes="(max-width: 960px) 100vw, 55vw" />
                <span className="plan__zoom" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" /></svg>
                  Zoom map
                </span>
              </button>
            )}
            <p className="location__mapnote">Location map from the project brochure · not to scale</p>
          </div>
        </div>

        <div className="dist" data-reveal>
          <div className="dist__head">
            <h3 className="display-3">Distance from the site</h3>
            <p>Approximate drive times, as stated in the project brochure.</p>
          </div>
          <div className="dist__tabs" role="group" aria-label="Show distances for">
            {distances.map((d, i) => (
              <button key={d.title} aria-pressed={i === tab} aria-controls={`dp-${i}`} onClick={() => setTab(i)} type="button">
                {d.title}
              </button>
            ))}
          </div>
          <div className="dist__cols">
            {distances.map((d, i) => (
              <div key={d.title} className={`dist__col ${i === tab ? "is-active" : ""}`} id={`dp-${i}`}>
                <h4 className="dist__title">{d.title}</h4>
                <ul>
                  {d.items.map(([name, mins]) => (
                    <li key={name}>
                      <span className="dist__name">{name}</span>
                      <span className="dist__bar" aria-hidden="true">
                        <span style={{ ["--w" as string]: `${(mins / max) * 100}%` }} />
                      </span>
                      <span className="dist__min">
                        {mins} <small>min</small>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ZoomViewer image={zoom} onClose={close} />
    </section>
  );
}
