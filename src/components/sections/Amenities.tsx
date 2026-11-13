"use client";

import Image from "next/image";
import { useState } from "react";
import { amenityGroups, smartHomeNote } from "@/content/site";

export default function Amenities() {
  const [gi, setGi] = useState(0);
  const g = amenityGroups[gi];

  const choose = (i: number) => {
    setGi(i);
  };

  return (
    <section id="amenities" className="amenities section section--dark" aria-labelledby="amen-title">
      <div className="wrap">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow eyebrow--light" data-reveal>
              <span className="eyebrow__num">04</span> Amenities &amp; lifestyle
            </p>
            <h2 id="amen-title" className="display-2" data-split>
              Where every moment is excitement <em>&amp; everyday feels like a vacation.</em>
            </h2>
          </div>
          <p className="section-head__text" data-reveal>
            You don’t need to travel to reach a holiday destination when you live in The Square. Club The Square has all the trappings of a top class
            clubhouse to entertain.
          </p>
        </div>

        <div className="amen">
          <nav className="amen__nav" aria-label="Amenity categories">
            <ol>
              {amenityGroups.map((x, i) => (
                <li key={x.id}>
                  <button type="button" aria-pressed={i === gi} onClick={() => choose(i)} aria-controls="amen-panel">
                    <span className="amen__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="amen__label">{x.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="amen__panel" id="amen-panel" aria-live="polite" key={g.id}>
            <div className={`amen__media amen__media--${g.images.length}`}>
              {g.images.map((img, i) => (
                <figure key={img.src} className={`amen__tile amen__tile--${i}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={i === 0 ? "(max-width: 860px) 100vw, 40vw" : "(max-width: 860px) 50vw, 24vw"}
                  />
                </figure>
              ))}
              <span className="amen__tag">Artist&rsquo;s impressions</span>
            </div>
            <div className="amen__copy">
              <h3 className="amen__title">{g.title}</h3>
              <p className="amen__text">{g.text}</p>
              <ul className="amen__list">
                {g.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              {g.id === "smart" && <p className="amen__note">{smartHomeNote}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
