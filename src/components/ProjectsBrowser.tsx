"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { EnquireButton } from "./Enquiry";
import { Mark } from "./Logo";

type Filter = "all" | "unfolding" | "delivered";

export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const groups = useMemo(
    () => ({
      unfolding: projects.filter((p) => p.status !== "delivered" && p.hasPage),
      delivered: projects.filter((p) => p.status === "delivered"),
    }),
    [projects],
  );
  const chips: [Filter, string, number][] = [
    ["all", "All", groups.unfolding.length + groups.delivered.length],
    ["unfolding", "Now unfolding", groups.unfolding.length],
    ["delivered", "Delivered", groups.delivered.length],
  ];
  const showActive = filter !== "delivered";
  const showDelivered = filter !== "unfolding";

  return (
    <>
      <div className="container" style={{ marginBottom: "var(--sp-5)" }}>
        <div className="filters" role="group" aria-label="Filter projects by status">
          {chips.map(([key, label, n]) => (
            <button key={key} type="button" className="chip" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label} <small>{n}</small>
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {(showActive ? groups.unfolding.length : 0) + (showDelivered ? groups.delivered.length : 0)} projects
        </p>
      </div>

      {showActive && (
        <div>
          {groups.unfolding.map((p, i) => (
            <ActivePanel key={p.slug} p={p} index={i} total={groups.unfolding.length} />
          ))}
        </div>
      )}

      {showDelivered && (
        <div className="container" style={{ marginTop: showActive ? "var(--section-y)" : 0 }}>
          <div className="shead">
            <div className="stack-head">
              <span className="label">Delivered · OC received</span>
              <h2 className="d-h2">
                Finished, <span className="thin">not just promised.</span>
              </h2>
            </div>
            <p className="shead__side muted">Families live in these homes today. A series of layout and plotting ventures completes the record.</p>
          </div>
          <div className="dgrid">
            {groups.delivered.map((p) => (
              <DeliveredCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ActivePanel({ p, index, total }: { p: Project; index: number; total: number }) {
  const img = p.cover ?? p.hero;
  const red = !img && p.status !== "upcoming";
  return (
    <article className={`ppanel ${red ? "ppanel--red" : !img ? "ppanel--dark" : ""}`} aria-labelledby={`pp-${p.slug}`}>
      <Link href={`/projects/${p.slug}`} className="ppanel__media" data-cursor="Explore" aria-label={`Explore ${p.name}`} tabIndex={-1}>
        {img ? (
          <Image src={img.src} alt={img.alt} fill sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" quality={80} />
        ) : red ? (
          <div className="bpanel bpanel--red">
            <Mark className="bpanel__mark" onRed />
          </div>
        ) : (
          <div className="bpanel bpanel--dark">
            <span className="bpanel__sun" aria-hidden />
          </div>
        )}
      </Link>
      <div className="ppanel__top">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="ppanel__status">{p.statusLabel}</span>
          <span className="caption" style={{ color: "inherit", opacity: 0.8 }}>
            0{index + 1} / 0{total}
          </span>
        </div>
      </div>
      <div className="ppanel__body">
        <div className="container">
          <span className="label label--plain" style={{ color: "inherit", opacity: 0.85 }}>
            {p.type} · {p.locationShort}
          </span>
          <div className="ppanel__row" style={{ marginTop: "var(--sp-3)" }}>
            <div>
              <h2 id={`pp-${p.slug}`} className="d-h1">
                <Link href={`/projects/${p.slug}`}>{p.name}</Link>
              </h2>
              <p className="lead" style={{ marginTop: "var(--sp-3)", color: "inherit", opacity: 0.88 }}>
                {p.pitch}
              </p>
              {p.facts.length > 1 && (
                <ul role="list" className="facts">
                  {p.facts.slice(0, 4).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
              {p.rera && (
                <p className="caption" style={{ marginTop: "var(--sp-2)", color: "inherit", opacity: 0.7 }}>
                  TS RERA No. {p.rera}
                </p>
              )}
            </div>
            <div className="btn-row">
              <Link href={`/projects/${p.slug}`} className={`btn ${red ? "" : "btn--light"}`}>
                Explore project <span className="btn__icon" aria-hidden>↗</span>
              </Link>
              {p.brochure ? (
                <EnquireButton className="btn btn--ghost-light" mode="brochure" project={p.slug} source="projects-panel">
                  Brochure
                </EnquireButton>
              ) : (
                <EnquireButton className={`btn ${red ? "btn--outline" : "btn--ghost-light"}`} project={p.slug} source="projects-panel">
                  {p.status === "upcoming" ? "Register interest" : "Enquire"}
                </EnquireButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function DeliveredCard({ p }: { p: Project }) {
  const img = p.cover ?? p.hero;
  const inner = (
    <>
      {img && <Image src={img.src} alt={img.alt} fill sizes="(max-width: 767px) 100vw, 50vw" quality={80} />}
      <div className="dcard__body">
        <span className="label label--plain" style={{ color: "var(--sun)" }}>
          {p.type} · OC received
        </span>
        <span className="dcard__name">{p.name}</span>
        <span className="caption" style={{ color: "rgba(243,239,232,.75)" }}>
          {p.location}
          {p.facts.length > 0 && p.facts[0] !== p.type ? ` · ${p.facts.slice(0, 2).join(" · ")}` : ""}
        </span>
        {p.hasPage && <span className="link-line">View project</span>}
      </div>
    </>
  );
  return p.hasPage ? (
    <Link href={`/projects/${p.slug}`} className="dcard" data-reveal="fade" data-cursor="View">
      {inner}
    </Link>
  ) : (
    <div className={`dcard ${img ? "" : "dcard--text"}`} data-reveal="fade">
      {inner}
    </div>
  );
}
