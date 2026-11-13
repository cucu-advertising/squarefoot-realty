import type { Metadata } from "next";
import Image from "next/image";
import { developer, contact } from "@/content/site";
import { SquarefootLogo, Sunrise } from "@/components/Brand";
import { EnquireButton } from "@/components/EnquiryProvider";

export const metadata: Metadata = {
  title: { absolute: "About Squarefoot Realty | Three Decades of Building" },
  description:
    "Meet the partners behind Squarefoot Realty: engineering precision, business acumen and three decades of craft in Hyderabad. Formerly Sai Teja Developers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="page page--about">
      <section className="page-hero page-hero--about">
        <div className="wrap page-hero__grid">
          <div>
            <p className="eyebrow">About Squarefoot Realty</p>
            <h1 className="display-1" data-split>
              A square. A sun. <em>A bigger idea of home.</em>
            </h1>
          </div>
          <p className="page-hero__text">{developer.intro} Everything a space should be, and then some.</p>
        </div>
      </section>

      <section className="about-story section" aria-labelledby="evo-title">
        <div className="wrap about-story__grid">
          <div className="about-story__logo" data-reveal>
            <SquarefootLogo />
          </div>
          <div>
            <h2 id="evo-title" className="display-3" data-reveal>Our evolution</h2>
            <p className="about-lead" data-reveal>{developer.evolution}</p>
            <h2 className="display-3" data-reveal>The minds behind it</h2>
            {developer.minds.map((p) => (
              <p key={p} data-reveal>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-story section section--dark" aria-labelledby="brand-title">
        <div className="wrap brand-story__grid">
          <div className="brand-story__visual" data-reveal aria-hidden="true">
            <Sunrise large />
            <ul className="brand-story__legend">
              <li><i className="sw sw--coral" />Square — stability</li>
              <li><i className="sw sw--sun" />Sun — warmth &amp; optimism</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow eyebrow--light" data-reveal>Brand story</p>
            <h2 id="brand-title" className="display-2" data-split>
              Everything <em>and Beyond.</em>
            </h2>
            {developer.brandStory.map((p) => (
              <p key={p} data-reveal>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="vision section" aria-labelledby="vision-title">
        <div className="wrap">
          <p className="eyebrow" data-reveal>Our vision</p>
          <h2 id="vision-title" className="display-1 vision__line" data-split>
            To create living environments where <em>every possibility</em> is within reach.
          </h2>
          <ul className="values">
            {developer.values.map(([t, d], i) => (
              <li key={t} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="approach section section--stone" aria-labelledby="approach-title">
        <div className="wrap approach__grid">
          <div>
            <p className="eyebrow" data-reveal>What we do</p>
            <h2 id="approach-title" className="display-2" data-split>
              From the first plan <em>to the last handover.</em>
            </h2>
            <p data-reveal>
              For three decades we have developed apartments, villas, commercial addresses and planned layouts in Hyderabad. One team looks after every
              stage, so buyers and landowners deal with people they can trust.
            </p>
            <ul className="standard" data-reveal>
              {developer.standard.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <ol className="steps">
            {developer.approach.map(([t, d], i) => (
              <li key={t} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
                <span className="steps__num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{t}.</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="portfolio section" aria-labelledby="portfolio-title">
        <div className="wrap">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>Projects</p>
              <h2 id="portfolio-title" className="display-2" data-split>
                Spaces we are <em>building.</em>
              </h2>
            </div>
            <p className="section-head__text" data-reveal>Three communities taking shape on the Outer Ring Road corridor.</p>
          </div>
          <ul className="unfolding">
            {developer.unfolding.map((p, i) => (
              <li key={p.name} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }} className={p.name === "The Square" ? "is-current" : ""}>
                {p.name === "The Square" && (
                  <div className="unfolding__img">
                    <Image src="/images/project/villas-dusk.jpg" alt="The Square villas, artist's impression" fill sizes="(max-width: 860px) 100vw, 33vw" />
                  </div>
                )}
                <span className="unfolding__status">Now unfolding</span>
                <h3>{p.name}</h3>
                <p className="unfolding__place">{p.place}</p>
                <p className="unfolding__note">{p.note}</p>
                {p.name === "The Square" && (
                  <a href="/#project" className="link-btn">Explore The Square ↗</a>
                )}
              </li>
            ))}
          </ul>

          <div className="delivered delivered--light" data-reveal>
            <div className="delivered__head">
              <div>
                <h3>Delivered. Occupied. Trusted.</h3>
                <p>Projects that have received their occupancy certificates (OC).</p>
              </div>
            </div>
            <ul className="delivered__list">
              {developer.delivered.map(([n, p]) => (
                <li key={n}>
                  <strong>{n}</strong>
                  <span>{p}</span>
                </li>
              ))}
              <li className="delivered__more">
                <strong>+ Layouts</strong>
                <span>A series of layout and plotting ventures</span>
              </li>
            </ul>
          </div>

          <p className="promoter-note" data-reveal>
            The Square is promoted by {contact.promoter} and Squarefoot Realty, as stated in the project brochure.
          </p>
        </div>
      </section>

      <section className="cta-plain section section--dark">
        <div className="wrap cta-plain__inner">
          <h2 className="display-2" data-split>
            Whatever you are building, <em>we will help you build it well.</em>
          </h2>
          <EnquireButton className="btn btn--light btn--lg" source="Home Page">Get in Touch</EnquireButton>
        </div>
      </section>
    </div>
  );
}
