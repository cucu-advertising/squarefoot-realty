import Image from "next/image";
import Link from "next/link";
import type { Project, Img } from "@/lib/projects";
import { EnquireButton } from "./Enquiry";
import HArrows from "./HArrows";
import RailPager from "./RailPager";

export interface RailItem {
  project: Project;
  image: Img;
}

/**
 * Our projects, side by side. Desktop: pinned, and scrolling down moves the row sideways
 * (Motion.tsx › hscroll). Touch: a native swipe row with snap. Arrows and a hint on both.
 */
export default function ProjectRail({ label, title, items, id, curtain }: { label: string; title: string; items: RailItem[]; id?: string; curtain?: boolean }) {
  return (
    <section id={id} className={`prail pin ${curtain ? "curtain" : ""}`} data-seq="hscroll" data-head="light" aria-labelledby="prail-title">
      <div className="pin__stage prail__stage">
        <div className="container prail__head">
          <div>
            <span className="label label--dot">{label}</span>
            <h2 id="prail-title" className="t-display" style={{ marginTop: "var(--sp-2)" }} data-split>
              {title}
            </h2>
          </div>
          <HArrows tone="light" />
        </div>
        <div className="prail__track" data-track>
          {items.map(({ project: p, image }, i) => (
            <article key={p.slug} className="prail__card" aria-labelledby={`pr-${p.slug}`}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 88vw, 76vw" quality={80} />
              <span className="prail__shade" aria-hidden />
              <div className="prail__top">
                <span className="tag">{p.statusLabel}</span>
                <RailPager names={items.map((it) => it.project.name)} current={i} />
              </div>
              <div className="prail__body">
                <div>
                  <span className="label">
                    {p.type} · {p.locationShort}
                  </span>
                  <h3 id={`pr-${p.slug}`} className="t-hero prail__name">
                    <Link href={`/projects/${p.slug}`}>{p.name}</Link>
                  </h3>
                  <p className="t-lead prail__pitch">{p.pitch}</p>
                  {p.facts.length > 1 && (
                    <ul role="list" className="facts">
                      {p.facts.slice(0, 4).map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="btn-row">
                  <Link href={`/projects/${p.slug}`} className="pill pill--light">
                    Explore project <span className="arr" aria-hidden>↗</span>
                  </Link>
                  <EnquireButton className="pill pill--ghost" project={p.slug} source="home-projects">
                    {p.status === "upcoming" ? "Register interest" : "Enquire now"}
                  </EnquireButton>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="prail__progress" data-progress aria-hidden>
          <i />
        </div>
      </div>
    </section>
  );
}
