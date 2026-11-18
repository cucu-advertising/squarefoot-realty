import Image from "next/image";
import { intro, highlights } from "@/content/site";

/** Concise project introduction + the four headline figures (one section, not two). */
export default function Intro() {
  return (
    <section id="project" className="intro section" aria-labelledby="intro-title">
      <div className="wrap">
        <div className="split">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__num">01</span> {intro.eyebrow}
            </p>
            <h2 id="intro-title" className="h2" data-split>
              A new dimension <em>of luxury.</em>
            </h2>
          </div>
          <p className="lead intro__text" data-reveal>
            {intro.body}
          </p>
        </div>

        <ul className="stats" data-reveal>
          {highlights.map((h) => (
            <li key={h.label} className="stat">
              <span className="stat__value">
                <span data-count={h.value}>{h.value}</span>
                <span className="stat__unit">{h.unit}</span>
              </span>
              <span className="stat__label">{h.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <figure className="bleed" data-reveal="wipe">
        <div className="bleed__clip">
          <div className="px" data-parallax="6">
            <Image
              src="/images/the-square-hd/aerial-day.jpg"
              alt="Aerial view of The Square — 131 villas, the clubhouse and landscaped spine beside the ORR — artist's impression"
              fill
              sizes="100vw"
              quality={80}
            />
          </div>
        </div>
        <figcaption className="wrap caption">
          <span>13.5 acres beside the Outer Ring Road</span>
          <span>Artist&rsquo;s impression</span>
        </figcaption>
      </figure>
    </section>
  );
}
