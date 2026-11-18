"use client";

import Image from "next/image";
import { useState } from "react";
import { amenityGroups } from "@/content/site";

export default function Amenities() {
  const [gi, setGi] = useState(0);
  const g = amenityGroups[gi];

  return (
    <section id="amenities" className="amenities section section--stone" aria-labelledby="amen-title">
      <div className="wrap">
        <div className="split">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__num">04</span> Amenities
            </p>
            <h2 id="amen-title" className="h2" data-split>
              Everyday feels <em>like a vacation.</em>
            </h2>
          </div>
          <div className="amen__tabs" role="group" aria-label="Amenity categories" data-reveal>
            {amenityGroups.map((x, i) => (
              <button key={x.id} type="button" aria-pressed={i === gi} onClick={() => setGi(i)} aria-controls="amen-panel">
                {x.label}
              </button>
            ))}
          </div>
        </div>

        <div className="amen" id="amen-panel" aria-live="polite" key={g.id}>
          <div className="amen__media">
            {g.images.map((img, i) => (
              <figure key={img.src} className={`amen__tile amen__tile--${i}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  quality={80}
                  sizes={i === 0 ? "(max-width: 860px) 100vw, 58vw" : "(max-width: 860px) 50vw, 22vw"}
                />
              </figure>
            ))}
            <span className="meta amen__tag">Artist&rsquo;s impressions</span>
          </div>
          <div className="amen__copy">
            <h3 className="h3">{g.title}</h3>
            <p className="amen__text">{g.text}</p>
            <ul className="ticks">
              {g.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
