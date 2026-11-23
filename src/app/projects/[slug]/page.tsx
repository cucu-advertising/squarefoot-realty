import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EnquireButton } from "@/components/Enquiry";
import { TLink } from "@/components/ui";
import Hero from "@/components/Hero";
import Slides from "@/components/Slides";
import Explore from "@/components/Explore";
import FocusGallery from "@/components/FocusGallery";
import FloorPlans from "@/components/FloorPlans";
import MapEmbed from "@/components/MapEmbed";
import Closing from "@/components/Closing";
import { getProject, pageProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return pageProjects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || !p.hasPage) return {};
  return {
    title: p.seo.title,
    description: p.seo.description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      title: p.seo.title,
      description: p.seo.description,
      url: `/projects/${p.slug}`,
      ...(p.hero ? { images: [{ url: p.hero.src, width: p.hero.width, height: p.hero.height, alt: p.hero.alt }] } : {}),
    },
  };
}

/** "Wonderla · 6 mins" or "10 mins: Airport, Fab City" become large figures; anything else stays a note. */
function splitLocation(notes: string[] = []) {
  const figures: { n: string; place: string }[] = [];
  const rest: string[] = [];
  for (const note of notes) {
    const a = note.match(/^(.*) · (\d+) mins?$/);
    const b = note.match(/^(\d+) mins?: (.*)$/);
    if (a) figures.push({ n: a[2], place: a[1] });
    else if (b) figures.push({ n: b[1], place: b[2] });
    else rest.push(note);
  }
  return { figures, rest };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || !p.hasPage) notFound();

  const isUpcoming = p.status === "upcoming";
  const loc = splitLocation(p.locationNotes);
  const tone = p.hero ? "image" : isUpcoming ? "ink" : "red";
  const closingImage = p.ctaImage ?? p.cover ?? p.hero;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: p.name,
    description: p.overview?.[0] ?? p.pitch,
    url: `${site.url}/projects/${p.slug}`,
    address: { "@type": "PostalAddress", addressLocality: p.location, addressRegion: "Telangana", addressCountry: "IN" },
    ...(p.hero ? { image: `${site.url}${p.hero.src}` } : {}),
  };

  const reraLabel = p.reraLabel ?? "TS RERA";
  const enquireCta = (cls: string) => (
    <EnquireButton className={cls} project={p.slug} source="project-cta">
      {isUpcoming ? "Register interest" : "Enquire now"}
    </EnquireButton>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 01 — Hero */}
      <Hero
        image={p.hero}
        tone={tone}
        big={tone === "red" && p.stats ? { value: p.stats[0].value, unit: "Villas" } : undefined}
        label={
          <>
            <Link href="/projects">Projects</Link> / {p.statusLabel}
          </>
        }
        title={p.name}
        links={
          <>
            <EnquireButton className="tlink" project={p.slug} source="project-hero" icon="">
              <span className="tlink__t">{isUpcoming ? "Register interest" : "Enquire now"}</span>
              <span className="tlink__a" aria-hidden>
                →
              </span>
            </EnquireButton>
          </>
        }
        meta={[p.type, p.locationShort, p.rera ? `${reraLabel} ${p.rera}` : p.statusLabel, <a key="s" href="#intro">Scroll ↓</a>]}
        caption={p.pitch}
      />

      {/* 02 — Short introduction + key figures */}
      <section id="intro" className="section s-sand curtain" data-head="light" aria-labelledby="intro-title">
        <div className="container intro">
          <span className="label label--dot" data-reveal="fade">
            {p.name} · {p.locationShort}
          </span>
          <h2 id="intro-title" className="t-statement" data-scrub>
            {p.overview?.[0] ?? (isUpcoming ? "The next Squarefoot community is taking shape at Kongara Kalan, near ORR Exit-13. Be the first to know." : p.pitch)}
          </h2>
          {p.stats && (
            <dl className="figs" style={{ ["--cols" as string]: p.stats.length }}>
              {p.stats.map((s) => (
                <div key={s.label} className="fig" data-reveal="fade">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="fig__n">
                    <span data-count={s.value}>{s.value}</span>
                    {s.unit && <small>{s.unit}</small>}
                  </dd>
                  <dd className="fig__l">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
          {(p.rera || p.partner) && (
            <p className="meta-line" data-reveal="fade">
              {p.rera && (
                <span>
                  {reraLabel} No. <strong>{p.rera}</strong>
                </span>
              )}
              {p.partner && <span>{p.partner}</span>}
            </p>
          )}
          {isUpcoming && (
            <div className="btn-row" style={{ justifyContent: "center", marginTop: "var(--sp-5)" }}>
              {enquireCta("pill")}
            </div>
          )}
        </div>
      </section>

      {/* 03 — Two or three standout features */}
      {p.highlights && p.highlights.length > 0 && p.highlights.every((h) => h.image) ? (
        <Slides items={p.highlights} />
      ) : p.highlights && p.highlights.length > 0 ? (
        <section className="s-sand" data-head="light" style={{ paddingBottom: "var(--section-y)" }} aria-label="Standout features">
          <div className="container">
            <ol role="list" className="fcards" style={{ ["--n" as string]: p.highlights.length }}>
              {p.highlights.map((h, i) => (
                <li key={h.title} className="fcard" data-reveal="fade" data-delay={i * 0.08}>
                  <span className="fcard__n">
                    0{i + 1} / 0{p.highlights!.length}
                  </span>
                  <div>
                    <h3 className="t-h2">{h.title}</h3>
                    <p className="t-lead">{h.line}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* 04 — Architectural exploration (where real renders exist) */}
      {p.explore && p.explore.length > 1 && <Explore title={`Explore ${p.name}`} views={p.explore} />}

      {/* 05 — Gallery */}
      {p.gallery && p.gallery.length > 1 && (
        <section className="section s-sand" data-head="light" aria-labelledby="gallery-title">
          <div className="container">
            <div className="head-row">
              <div className="stack">
                <span className="label label--dot" data-reveal="fade">
                  Gallery
                </span>
                <h2 id="gallery-title" className="t-display" data-split>
                  A closer look.
                </h2>
              </div>
              <p className="head-row__side muted t-small" data-reveal="fade">
                Swipe, use the arrows or tap to expand. Artist&apos;s impressions.
              </p>
            </div>
            <FocusGallery images={p.gallery} credit={p.name} />
          </div>
        </section>
      )}

      {/* 06 — Amenities */}
      {p.amenities && p.amenities.length > 0 && (
        <section className="section s-ink" data-head="dark" aria-labelledby="amen-title">
          <div className="container">
            <div className="head-row">
              <div className="stack">
                <span className="label label--dot" data-reveal="fade">
                  Amenities
                </span>
                <h2 id="amen-title" className="t-display" data-split>
                  {p.slug === "squarefoot-origin" ? "A 10,500 sft clubhouse." : "Room to play, rest and gather."}
                </h2>
              </div>
            </div>
            <div className="amen">
              {p.amenities.map((a) => (
                <div key={a.title} className={`amen__block ${a.image ? "" : "amen__block--text"}`}>
                  {a.image && (
                    <div className="amen__media" data-reveal="mask">
                      <Image src={a.image.src} alt={a.image.alt} fill sizes="(max-width: 899px) 100vw, 58vw" quality={80} />
                    </div>
                  )}
                  <div className="amen__body">
                    <h3 className="t-h2">{a.title}</h3>
                    <ul role="list" className="amen__list" data-reveal="fade">
                      {a.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 07 — East or West facing (where a project offers both) */}
      {p.facings && p.facings.length > 0 && (
        <section className="section s-sand" data-head="light" aria-labelledby="facing-title">
          <div className="container">
            <div className="head-row">
              <div className="stack">
                <span className="label label--dot" data-reveal="fade">
                  Villa types
                </span>
                <h2 id="facing-title" className="t-display" data-split>
                  East or West facing.
                </h2>
              </div>
              <p className="head-row__side muted t-small" data-reveal="fade">
                Both are G+2, four-bedroom villas. Choose the orientation that suits you.
              </p>
            </div>
            <div className="facings">
              {p.facings.map((f) => (
                <article key={f.title} className="facing" data-reveal="fade" aria-labelledby={`facing-${f.title}`}>
                  <div className="facing__img">
                    <Image src={f.image.src} alt={f.image.alt} fill sizes="(max-width: 767px) 100vw, 46vw" quality={80} />
                  </div>
                  <div className="facing__body">
                    <h3 id={`facing-${f.title}`} className="t-h2">
                      {f.title}
                    </h3>
                    <ul role="list" className="facts facing__facts">
                      {f.facts.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <p className="muted">{f.line}</p>
                    {f.plans ? (
                      <a href="#plans" className="pill pill--ghost pill--down">
                        See floor plans <span className="arr" aria-hidden>↓</span>
                      </a>
                    ) : (
                      <EnquireButton className="pill" project={p.slug} source="project-facing">
                        Ask for {f.title} plans
                      </EnquireButton>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 08 — Floor plans */}
      {p.plans && p.plans.length > 0 && (
        <section id="plans" className="section s-sand" data-head="light" aria-labelledby="plans-title" style={p.facings ? { paddingTop: 0 } : undefined}>
          <div className="container">
            <div className="head-row">
              <div className="stack">
                <span className="label label--dot" data-reveal="fade">
                  Residences
                </span>
                <h2 id="plans-title" className="t-display" data-split>
                  {p.slug === "the-square" ? "Planned to the square foot." : p.slug === "squarefoot-origin" ? "Three floors, four bedrooms." : p.slug === "the-urban-ranch" ? "Three villa types, East or West facing." : "Typical floor plan."}
                </h2>
              </div>
              <p className="head-row__side muted t-small" data-reveal="fade">
                {p.slug === "squarefoot-origin" ? "East facing villa plans. Tap a plan to expand and zoom." : "Tap a plan to expand and zoom."}
              </p>
            </div>
            <FloorPlans plans={p.plans} />
          </div>
        </section>
      )}

      {/* 08 — Location */}
      {p.mapQuery && (
        <section className="section s-sand" data-head="light" aria-labelledby="loc-title" style={p.plans ? { paddingTop: 0 } : undefined}>
          <div className="container loc">
            <div className="loc__text stack">
              <span className="label label--dot" data-reveal="fade">
                Location
              </span>
              <h2 id="loc-title" className="t-display" data-split>
                {p.locationShort.split(" · ")[0]}
              </h2>
              <p className="t-lead muted" data-reveal="fade">
                {p.location}
              </p>
              {loc.figures.length > 0 && (
                <ul role="list" className="dist" data-reveal="fade">
                  {loc.figures.map((f) => (
                    <li key={f.place}>
                      <b>
                        <span data-count={f.n}>{f.n}</span>
                        <small>mins</small>
                      </b>
                      <span>{f.place}</span>
                    </li>
                  ))}
                </ul>
              )}
              {loc.rest.length > 0 && (
                <ul role="list" className="notes" data-reveal="fade">
                  {loc.rest.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="loc__map" data-reveal="fade">
              <MapEmbed query={p.mapQuery} label={p.location} />
            </div>
          </div>
        </section>
      )}

      {/* 09 — Enquire */}
      {closingImage ? (
        <Closing image={closingImage}>
          <span className="label">{isUpcoming ? "Register interest" : "Visit"}</span>
          <div className="closing__row" style={{ marginTop: "var(--sp-2)" }}>
            <div>
              <h2 className="t-hero">{isUpcoming ? "Be the first to know." : "See it for yourself."}</h2>
              <p className="t-lead" style={{ marginTop: "var(--sp-2)", maxWidth: "40ch", opacity: 0.88 }}>
                {isUpcoming ? "Leave your details and our team will share plans, pricing and launch news first." : "Picture calling it home. Book a visit and our team will take it from there."}
              </p>
              {p.rera && (
                <p className="t-small" style={{ marginTop: "var(--sp-2)", opacity: 0.7 }}>
                  {reraLabel} No. {p.rera}
                </p>
              )}
            </div>
            <div className="btn-row">{enquireCta("pill pill--red")}</div>
          </div>
        </Closing>
      ) : (
        <section className="section s-ink" data-head="dark" aria-labelledby="cta-title">
          <div className="container">
            <span className="label label--dot">{isUpcoming ? "Register interest" : "Visit"}</span>
            <div className="closing__row" style={{ marginTop: "var(--sp-3)" }}>
              <div>
                <h2 id="cta-title" className="t-hero" data-split>
                  {isUpcoming ? "Be the first to know." : "See it for yourself."}
                </h2>
                <p className="t-lead muted" style={{ marginTop: "var(--sp-2)", maxWidth: "40ch" }}>
                  {isUpcoming ? "Leave your details and our team will share plans, pricing and launch news first." : "Picture calling it home. Book a visit and our team will take it from there."}
                </p>
              </div>
              <div className="btn-row">{enquireCta("pill pill--red")}</div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
