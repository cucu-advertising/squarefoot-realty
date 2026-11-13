import Image from "next/image";
import { intro } from "@/content/site";

export default function Intro() {
  return (
    <section id="project" className="intro section" aria-labelledby="intro-title">
      <div className="wrap">
        <div className="intro__head">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow__num">01</span> The Project
          </p>
          <h2 id="intro-title" className="intro__lead display-2" data-split>
            An intriguing invitation to explore <em>a new dimension</em> of luxury living — where boundaries are pushed and expectations exceeded, all within the confines of The Square.
          </h2>
        </div>

        <div className="intro__grid">
          <figure className="intro__fig frame" data-reveal="mask">
            <Image
              src="/images/project/villa-elevation.jpg"
              alt="Duplex villa with terrace pergola, glazed balconies and two-car porch — artist's impression"
              width={881}
              height={880}
              sizes="(max-width: 860px) 100vw, 42vw"
            />
            <figcaption>Your villa — artist&rsquo;s impression</figcaption>
          </figure>

          <div className="intro__text">
            {intro.body.map((p, i) => (
              <p key={i} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
                {p}
              </p>
            ))}
            <blockquote className="intro__quote" data-reveal>
              <p>{intro.brandLine}</p>
              <cite>Squarefoot Realty</cite>
            </blockquote>
          </div>
        </div>
      </div>

      <figure className="intro__wide" data-reveal="wipe">
        <div className="intro__wide-clip">
          <div className="px" data-parallax="7">
            <Image
              src="/images/project/avenue-palms.jpg"
              alt="Palm-lined internal avenue between villas — artist's impression"
              fill
              sizes="100vw"
            />
          </div>
        </div>
        <figcaption className="wrap">
          <span>Where every square foot exudes luxury</span>
          <span>Artist&rsquo;s impression</span>
        </figcaption>
      </figure>
    </section>
  );
}
