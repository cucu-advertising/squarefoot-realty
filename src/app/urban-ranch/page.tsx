import type { Metadata } from "next";
import Image from "next/image";
import { urbanRanch as ur, contact } from "@/content/site";
import { SquarefootLogo } from "@/components/Brand";
import { BrochureButton, EnquireButton } from "@/components/EnquiryProvider";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: { absolute: "Urban Ranch | 163 Villas at Kongara Kalan, Adibatla | Squarefoot Realty" },
  description:
    "Urban Ranch: 163 G+2 villas on 19.5 acres at Kongara Kalan, 3 minutes from ORR Exit 13. Plots of 292–351 sq. yds, 3,807–4,927 sft built-up, ~30,000 sft clubhouse. TG RERA P02400009631.",
  alternates: { canonical: "/urban-ranch" },
  openGraph: { images: [{ url: "/images/urban-ranch/villa-cover.jpg", width: 1345, height: 670, alt: "Urban Ranch villa — artist's impression" }] },
};

export default async function UrbanRanchPage({ searchParams }: { searchParams: Promise<{ brochure?: string }> }) {
  const { brochure } = await searchParams;
  const wantsBrochure = brochure === "1";

  return (
    <div className="page ur">
      {/* Hero — contained: the brochure renders are ~1,350–1,850 px, so they are not stretched full-bleed */}
      <section className="ur-hero" aria-labelledby="ur-title">
        <div className="wrap ur-hero__grid">
          <div className="ur-hero__copy">
            <div className="ur-hero__brand">
              <SquarefootLogo variant="horizontal" sizes="170px" className="ur-hero__sf" />
              <span className="meta">presents</span>
            </div>
            <Image src="/images/urban-ranch/logo.png" alt="Urban Ranch" width={900} height={350} className="ur-hero__logo" priority />
            <h1 id="ur-title" className="h1" data-split>
              Live fresh. <em>Live futuristic.</em>
            </h1>
            <p className="lead">163 villas on 19.5 acres at Kongara Kalan, a short distance from ORR Exit 13.</p>
            <div className="cta-row">
              <BrochureButton className="btn btn--solid btn--lg" project="urban-ranch" />
              <EnquireButton className="btn btn--ghost btn--lg" project="urban-ranch" source="Home Page" />
            </div>
            <p className="meta">TG RERA {ur.rera}</p>
          </div>
          <figure className="ur-hero__media">
            <Image src="/images/urban-ranch/villa-cover.jpg" alt="Urban Ranch villa elevation at dusk — artist's impression" fill priority sizes="(max-width: 960px) 100vw, 55vw" />
          </figure>
        </div>
      </section>

      {/* Introduction + figures */}
      <section className="section" aria-labelledby="ur-intro">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow" data-reveal>
                <span className="eyebrow__num">01</span> The community
              </p>
              <h2 id="ur-intro" className="h2" data-split>
                Vibe of the rural. <em>Vivacity of the urban.</em>
              </h2>
            </div>
            <p className="lead" data-reveal>
              {ur.intro.body}
            </p>
          </div>
          <ul className="stats" data-reveal>
            {ur.facts.map((f) => (
              <li key={f.label} className="stat">
                <span className="stat__value">
                  <span>{f.value}</span>
                  <span className="stat__unit">{f.unit}</span>
                </span>
                <span className="stat__label">{f.label}</span>
              </li>
            ))}
          </ul>
          <figure className="contained" data-reveal="mask">
            <div>
              <Image src="/images/urban-ranch/aerial.jpg" alt="Aerial view of the Urban Ranch villa community — artist's impression" width={1847} height={1306} sizes="(max-width: 1440px) 100vw, 1360px" />
            </div>
            <figcaption className="caption">
              <span>Villas that give you the choice of space</span>
              <span>Artist&rsquo;s impression</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Villas */}
      <section className="section section--stone" aria-labelledby="ur-villas">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow" data-reveal>
                <span className="eyebrow__num">02</span> The villas
              </p>
              <h2 id="ur-villas" className="h2" data-split>
                It’s a residence. <em>Inside a ranch.</em>
              </h2>
            </div>
            <dl className="spec-list" data-reveal>
              {ur.specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="ur-types">
            <figure className="ur-types__img" data-reveal="mask">
              <div>
                <Image src="/images/urban-ranch/villa-street.jpg" alt="Urban Ranch villas along an internal road — artist's impression" fill sizes="(max-width: 960px) 100vw, 40vw" />
              </div>
            </figure>
            <div className="table-wrap" data-reveal>
              <table className="types">
                <caption className="sr-only">Urban Ranch villa types: plot area and built-up area</caption>
                <thead>
                  <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Plot</th>
                    <th scope="col">Built-up (sft)</th>
                  </tr>
                </thead>
                <tbody>
                  {ur.types.map((t) => (
                    <tr key={t.type}>
                      <th scope="row">
                        {t.type}
                        <small>{t.features}</small>
                      </th>
                      <td>{t.plot}</td>
                      <td>
                        <span>East {t.east}</span>
                        <span>West {t.west}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="meta">All types: 11.5 ft ceilings. Floor plans for every type are in the brochure.</p>
              <div className="cta-row">
                <BrochureButton className="btn btn--ghost" project="urban-ranch" icon="ne">
                  View Floor Plans
                </BrochureButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clubhouse & community */}
      <section className="section section--dark" aria-labelledby="ur-club">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow eyebrow--light" data-reveal>
                <span className="eyebrow__num">03</span> Lifestyle
              </p>
              <h2 id="ur-club" className="h2" data-split>
                Savour good life. <em>Nurture great lifestyle.</em>
              </h2>
            </div>
            <p className="lead" data-reveal>
              A clubhouse spread of ~30,000 sft, and a community planned green where you want it.
            </p>
          </div>

          <ul className="ur-gallery">
            {ur.gallery.map((g, i) => (
              <li key={g.src} data-reveal style={{ ["--d" as string]: `${(i % 3) * 80}ms` }}>
                <figure>
                  <div className="ur-gallery__img">
                    <Image src={g.src} alt={g.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                  </div>
                  <figcaption className="meta">{g.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <div className="ur-lists" data-reveal>
            <div>
              <h3 className="label">Clubhouse</h3>
              <ul className="ticks ticks--light">
                {ur.clubhouse.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label">Community</h3>
              <ul className="ticks ticks--light">
                {ur.community.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section" aria-labelledby="ur-loc">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow" data-reveal>
                <span className="eyebrow__num">04</span> Kongara Kalan
              </p>
              <h2 id="ur-loc" className="h2" data-split>
                Not about distances. <em>All about delights.</em>
              </h2>
            </div>
            <ul className="dist__list dist__list--plain" data-reveal>
              {ur.distances.map(([n, t]) => (
                <li key={n}>
                  <span>{n}</span>
                  <span className="dist__min">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="contained contained--map" data-reveal="mask">
            <div>
              <Image src="/images/urban-ranch/location-map.png" alt="Urban Ranch location map, Kongara Kalan — not to scale" width={1965} height={1158} sizes="(max-width: 1440px) 100vw, 1360px" />
            </div>
            <figcaption className="caption">
              <span>Location map from the project brochure · not to scale</span>
              <a href={ur.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-btn">
                Get directions ↗
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Enquire + brochure */}
      <section className="section section--stone" aria-labelledby="ur-enq">
        <div className="wrap contact__grid">
          <div className="contact__form" id="enquire">
            <p className="eyebrow">{wantsBrochure ? "Brochure" : "Enquire"}</p>
            <h2 id="ur-enq" className="h2" data-split>
              {wantsBrochure ? "Download the brochure" : "Visit Urban Ranch"}
            </h2>
            <p className="contact__lede">
              {wantsBrochure
                ? "The brochure is shared with visitors who leave their contact details. Submit the form and your download is ready immediately."
                : "Share a few details. After you submit, the full Urban Ranch brochure is ready to download."}
            </p>
            <EnquiryForm project="urban-ranch" source={wantsBrochure ? "Brochure Request" : "Contact Page"} intent={wantsBrochure ? "brochure" : "enquiry"} idPrefix="ur" />
          </div>
          <aside className="contact__card" aria-label="Urban Ranch contact details">
            <div>
              <h3 className="label">Call</h3>
              <a href="tel:+918001345345" className="contact__big">
                +91 8001 345 345
              </a>
            </div>
            <div>
              <h3 className="label">Email</h3>
              <a href={`mailto:${contact.email}`} className="contact__big">
                {contact.email}
              </a>
            </div>
            <div>
              <h3 className="label">Project</h3>
              <address>
                <strong>Urban Ranch</strong>
                <span>{ur.place}, Hyderabad</span>
              </address>
            </div>
            <p className="meta">
              TG RERA {ur.rera}. Promoter logos shown in the Urban Ranch brochure: {ur.promoters}.
            </p>
            <p className="meta">{ur.disclaimer}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
