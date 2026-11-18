import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { developer } from "@/content/site";
import { SquarefootLogo } from "@/components/Brand";
import { EnquireButton } from "@/components/EnquiryProvider";

export const metadata: Metadata = {
  title: { absolute: "About Squarefoot Realty | Three Decades of Building" },
  description:
    "Meet the partners behind Squarefoot Realty: engineering precision, business acumen and three decades of craft in Hyderabad. Formerly Sai Teja Developers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="page">
      <section className="page-hero" aria-labelledby="about-title">
        <div className="wrap split">
          <div>
            <p className="eyebrow">About Squarefoot Realty</p>
            <h1 id="about-title" className="h1" data-split>
              A square. A sun. <em>A bigger idea of home.</em>
            </h1>
          </div>
          <p className="lead">{developer.intro}</p>
        </div>
      </section>

      {/* Story + brand */}
      <section className="section section--stone" aria-labelledby="story-title">
        <div className="wrap about-story">
          <div className="about-story__logo" data-reveal="mask">
            <div className="developer__plate">
              <SquarefootLogo variant="stacked" sizes="280px" />
            </div>
          </div>
          <div className="stack">
            <h2 id="story-title" className="h3" data-split>
              Our evolution
            </h2>
            <p data-reveal>{developer.evolution}</p>
            <p data-reveal>{developer.minds[0]}</p>
            <p data-reveal>{developer.brandStory[0]}</p>
          </div>
        </div>
      </section>

      {/* Vision + values */}
      <section className="section" aria-labelledby="vision-title">
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            Our vision
          </p>
          <h2 id="vision-title" className="h2 measure" data-split>
            To create living environments where <em>every possibility</em> is within reach.
          </h2>
          <ul className="values">
            {developer.values.map(([t, d], i) => (
              <li key={t} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                <h3 className="h4">{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Projects */}
      <section className="section section--stone" aria-labelledby="portfolio-title">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow" data-reveal>
                Projects
              </p>
              <h2 id="portfolio-title" className="h2" data-split>
                Spaces we are <em>building.</em>
              </h2>
            </div>
            <p className="lead" data-reveal>
              Three communities taking shape on the Outer Ring Road corridor.
            </p>
          </div>

          <ul className="unfolding">
            {developer.unfolding.map((p, i) => (
              <li key={p.name} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }} className={p.image ? "has-img" : ""}>
                {p.image && (
                  <div className="unfolding__img">
                    <Image src={p.image} alt={`${p.name} — artist's impression`} fill sizes="(max-width: 860px) 100vw, 33vw" />
                  </div>
                )}
                <span className="label unfolding__status">Now unfolding</span>
                <h3 className="h3">{p.name}</h3>
                <p className="meta">{p.place}</p>
                <p className="small">{p.note}</p>
                {p.href && (
                  <Link href={p.href} className="link-btn">
                    Explore {p.name} ↗
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="portfolio">
            <div className="portfolio__head" data-reveal>
              <h3 className="h3">Delivered. Occupied. Trusted.</h3>
              <p className="meta">Projects that have received their occupancy certificates (OC)</p>
            </div>
            <ul className="portfolio__grid">
              {developer.delivered.map((p, i) => (
                <li key={p.name} className={`pcard ${p.image ? "" : "pcard--text"}`} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                  {p.image && (
                    <div className="pcard__img">
                      <Image src={p.image} alt={`${p.name}, ${p.place} — artist's impression`} fill sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                    </div>
                  )}
                  <div className="pcard__body">
                    <h4 className="h4">{p.name}</h4>
                    <p className="meta">
                      {p.place}
                      {p.note ? ` · ${p.note}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap cta-plain">
          <h2 className="h2" data-split>
            Whatever you are building, <em>we will help you build it well.</em>
          </h2>
          <div className="cta-row" data-reveal>
            <EnquireButton className="btn btn--light btn--lg" source="Home Page">
              Get in Touch
            </EnquireButton>
          </div>
        </div>
      </section>
    </div>
  );
}
