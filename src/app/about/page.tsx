import Image from "next/image";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Closing from "@/components/Closing";
import Link from "next/link";
import { EnquireButton } from "@/components/Enquiry";
import { Mark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "About Squarefoot Realty | Three Decades of Building",
  description:
    "Meet the partners behind Squarefoot Realty: engineering precision, business acumen and three decades of craft in Hyderabad.",
  alternates: { canonical: "/about" },
};

const builds: { t: string; d: string; img?: string }[] = [
  { t: "Apartments", d: "Thoughtfully planned homes close to where Hyderabad works and grows.", img: "/images/challa-elite/elevation-corner.jpg" },
  { t: "Villas & gated communities", d: "Boutique communities planned around how a modern family lives.", img: "/images/the-square/east-villa.jpg" },
  { t: "Commercial addresses", d: "Functional, well-located spaces for businesses.", img: "/images/trans-arcade/exterior.jpg" },
  { t: "Layouts & plotting", d: "Master-planned layouts with clear planning and good access.", img: "/images/the-square/masterplan-aerial.jpg" },
  { t: "Customer care", d: "Clear communication, transparent paperwork and support after move-in." },
];
const steps = [
  ["Listen", "We start with what you need, not what we have to sell."],
  ["Plan", "Options, numbers and paperwork in plain language."],
  ["Build", "Quality delivered, and you kept informed along the way."],
  ["Stay", "Available long after the keys change hands."],
];

export default function About() {
  return (
    <>
      <Hero
        image={{ src: "/images/the-square/east-villa-aerial.jpg", width: 3840, height: 2160, alt: "Villa with terrace garden at The Square" }}
        position="50% 45%"
        mobilePosition="45% 50%"
        label="About Squarefoot Realty"
        title="A square. A sun. A bigger idea of home."
        meta={["Formerly Sai Teja Developers", "Three decades", "Hyderabad", <a key="s" href="#who">Scroll ↓</a>]}
        caption="Everything a space should be, and then some."
      />

      <section id="who" className="section s-sand curtain" data-head="light" aria-labelledby="who-title">
        <div className="container statement">
          <span className="label label--dot statement__label" data-reveal="fade">
            Who we are
          </span>
          <div className="statement__body">
            <h2 id="who-title" className="t-statement" data-scrub>
              <span className="inline-img" aria-hidden>
                <Image src="/images/the-square/terrace-view.jpg" alt="" width={160} height={70} sizes="160px" />
              </span>
              A Hyderabad developer shaped by partners who have spent a generation turning land into landmarks.
            </h2>
            <div className="statement__foot" data-reveal="fade">
              <div className="evo" style={{ border: 0, padding: 0 }}>
                <span>
                  <small>We began as</small>Sai Teja Developers
                </span>
                <i aria-hidden />
                <span>
                  <small>Today we are</small>Squarefoot Realty
                </span>
              </div>
              <p className="t-small muted measure">The same discipline, the same standards and a long record of promises kept.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section s-ink" data-head="dark" aria-labelledby="minds-title">
        <div className="container brand">
          <div className="brand__mark">
            <Mark title="The Squarefoot square and sun" anim />
          </div>
          <div className="brand__text">
            <span className="label label--dot" data-reveal="fade">
              The minds behind it
            </span>
            <h2 id="minds-title" className="t-display" data-split>
              Engineering precision. Business sense.
            </h2>
            <p className="t-lead muted measure" data-reveal="fade">
              Alumni of IIT, ISB, CBIT and other leading institutions, with experience across IT, government service and consulting.
            </p>
            <ul role="list" className="chips" data-reveal="fade">
              <li>Stability</li>
              <li>Warmth</li>
              <li>Optimism</li>
              <li>Passion</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section s-sand" data-head="light" aria-labelledby="build-title">
        <div className="container">
          <div className="head-row">
            <div className="stack">
              <span className="label label--dot" data-reveal="fade">
                What we build
              </span>
              <h2 id="build-title" className="t-display" data-split>
                From the first plan to the last handover.
              </h2>
            </div>
            <p className="head-row__side muted" data-reveal="fade">
              Our team looks after every stage, so buyers and landowners deal with people they can trust.
            </p>
          </div>
          <ol role="list" className="builds">
            {builds.map((b, i) => (
              <li key={b.t} className={`builds__row ${b.img ? "has-img" : ""}`} data-reveal="fade">
                <span className="builds__n">0{i + 1}</span>
                <h3 className="builds__t">{b.t}</h3>
                <p className="builds__d">{b.d}</p>
                {b.img && (
                  <span className="builds__img" aria-hidden>
                    <Image src={b.img} alt="" fill sizes="260px" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section s-sand" data-head="light" aria-labelledby="approach-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="head-row">
            <div className="stack">
              <span className="label label--dot" data-reveal="fade">
                Our approach
              </span>
              <h2 id="approach-title" className="t-display" data-split>
                Four steps. No surprises.
              </h2>
            </div>
          </div>
          <ol role="list" className="steps">
            {steps.map(([t, d], i) => (
              <li key={t} data-reveal="fade" data-delay={i * 0.08}>
                <span className="label muted">0{i + 1}</span>
                <h3>{t}</h3>
                <p className="muted t-small">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Closing image={{ src: "/images/the-square/avenue.jpg", width: 3840, height: 2160, alt: "Tree-lined avenue at The Square" }}>
        <span className="label">Talk to us</span>
        <div className="closing__row" style={{ marginTop: "var(--sp-2)" }}>
          <h2 className="t-hero" style={{ maxWidth: "14ch" }}>
            Whatever you are building, we will help you build it well.
          </h2>
          <div className="btn-row">
            <EnquireButton className="pill pill--light" source="about-closing">
              Talk to us
            </EnquireButton>
            <Link href="/projects" className="pill pill--ghost">
              Explore projects <span className="arr" aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </Closing>
    </>
  );
}
