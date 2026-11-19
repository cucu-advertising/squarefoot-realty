import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Reel, { type ReelCard } from "@/components/Reel";
import { EnquireButton } from "@/components/Enquiry";
import { Mark } from "@/components/Logo";
import { TLink } from "@/components/ui";
import { projects, getProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects in Hyderabad | Squarefoot Realty",
  description: "Explore Squarefoot Origin, The Square and The Urban Ranch near the Outer Ring Road, plus our delivered projects.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const active = projects.filter((p) => p.status !== "delivered" && p.hasPage);
  const covers: Record<string, string> = { "the-square": "/images/the-square/west-villa-aerial.jpg" };
  const reel: ReelCard[] = [
    { project: getProject("trans-elite")!, size: "a", image: { src: "/images/trans-elite/exterior.jpg", alt: "Trans Elite apartments, Adibatla" }, caption: "Adibatla · Apartments" },
    { project: getProject("challa-elite")!, size: "b", image: { src: "/images/challa-elite/elevation-corner.jpg", alt: "Challa Elite apartments, Tukkuguda" }, caption: "Tukkuguda · Apartments" },
    { project: getProject("trans-arcade")!, size: "c", image: { src: "/images/trans-arcade/exterior.jpg", alt: "Commercial building at Adibatla" }, caption: "Adibatla · Commercial" },
    { project: getProject("lokeshwari-residency")!, size: "t", caption: "Habsiguda · Residential" },
  ];
  return (
    <>
      <Hero
        image={{ src: "/images/the-square/masterplan-aerial.jpg", width: 3840, height: 2160, alt: "Aerial view of The Square beside the Outer Ring Road" }}
        position="50% 55%"
        mobilePosition="40% 55%"
        label="Projects · Hyderabad"
        title="Places designed to be lived in."
        meta={["03 now unfolding", "04 delivered with OC", "ORR corridor", <a key="s" href="#list">Scroll ↓</a>]}
        caption="Each project begins with one question: how will people live here?"
      />

      <section id="list" className="s-sand curtain" data-head="light" style={{ paddingTop: "var(--section-y)" }} aria-labelledby="active-title">
        <div className="container head-row">
          <div className="stack">
            <span className="label label--dot" data-reveal="fade">
              Now unfolding
            </span>
            <h2 id="active-title" className="t-display" data-split>
              Three communities on the ORR corridor.
            </h2>
          </div>
        </div>
        <div className="stackc">
          {active.map((p, i) => {
            const src = covers[p.slug] ?? p.cover?.src ?? p.hero?.src;
            const red = !src && p.status !== "upcoming";
            return (
              <article key={p.slug} className={`stackc__card ${red ? "stackc__card--red" : ""}`} style={{ ["--i" as string]: i }} data-head={red ? "red" : "dark"} aria-labelledby={`sc-${p.slug}`}>
                {src ? (
                  <>
                    <Image src={src} alt={`${p.name}, ${p.location}`} fill sizes="100vw" quality={80} />
                    <span className="stackc__shade" />
                  </>
                ) : red ? (
                  <span className="stackc__big disc__big" aria-hidden>
                    27<small>Villas</small>
                  </span>
                ) : (
                  <span className="disc__sun" aria-hidden />
                )}
                <div className="stackc__top">
                  <span className="tag">{p.statusLabel}</span>
                  {red ? <Mark onRed className="stackc__mark" /> : <span className="label">0{i + 1} / 0{active.length}</span>}
                </div>
                <div className="stackc__body">
                  <div>
                    <span className="label">{p.type} · {p.locationShort}</span>
                    <h3 id={`sc-${p.slug}`} className="t-hero" style={{ marginTop: "var(--sp-2)" }}>
                      <Link href={`/projects/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <p className="t-lead" style={{ marginTop: "var(--sp-2)", opacity: 0.9 }}>
                      {p.pitch}
                    </p>
                    {p.facts.length > 1 && (
                      <ul role="list" className="facts">
                        {p.facts.slice(0, 4).map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="btn-row">
                    <Link href={`/projects/${p.slug}`} className={`pill ${red ? "" : "pill--light"}`}>
                      Explore project <span className="arr" aria-hidden>↗</span>
                    </Link>
                    {p.brochure ? (
                      <EnquireButton className="pill pill--ghost" mode="brochure" project={p.slug} source="projects-card">
                        Brochure
                      </EnquireButton>
                    ) : (
                      <EnquireButton className="pill pill--ghost" project={p.slug} source="projects-card">
                        {p.status === "upcoming" ? "Register interest" : "Enquire"}
                      </EnquireButton>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Reel
        intro={
          <>
            <span className="label label--dot">Delivered · OC received</span>
            <h2 className="t-display" data-split>
              Finished, not just promised.
            </h2>
            <p className="t-lead muted measure">Families live in these homes today. A series of layout and plotting ventures completes the record.</p>
            <TLink href="/contact">Talk to us</TLink>
          </>
        }
        cards={reel}
      />
    </>
  );
}
