import Link from "next/link";
import { LogoHorizontal } from "./Logo";
import { site, telHref } from "@/lib/site";
import { projects, pageProjects } from "@/lib/projects";

/** Footer as a bordered card on sand (reference pattern), with Squarefoot's own content and legal lines. */
export default function Footer() {
  const c = site.contact;
  const rera = projects.filter((p) => p.rera);
  const hasContact = c.phone || c.email || c.office;
  return (
    <footer className="footer" data-head="light">
      <div className="footer__card">
        <div className="footer__top">
          <LogoHorizontal />
          <span className="label">Everything and beyond</span>
        </div>
        <div className="footer__mid">
          <div>
            <p className="t-display footer__tag">Everything and beyond.</p>
            <p className="muted t-small" style={{ marginTop: "var(--sp-2)", maxWidth: "36ch" }}>
              Squarefoot Realty, formerly Sai Teja Developers. Three decades of building in Hyderabad.
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul role="list" className="footer__list">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Projects</h2>
            <ul role="list" className="footer__list">
              {pageProjects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Contact</h2>
            <ul role="list" className="footer__list">
              {c.office && <li style={{ whiteSpace: "pre-line" }}>{c.office}</li>}
              {c.phone && (
                <li>
                  <a href={telHref(c.phone)}>{c.phone}</a>
                </li>
              )}
              {c.email && (
                <li>
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </li>
              )}
              {!hasContact && <li className="muted">Hyderabad, Telangana</li>}
              <li>
                <Link href="/contact">Send an enquiry</Link>
              </li>
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer__legal">
          {rera.length > 0 && <p>{rera.map((p) => `${p.name}: TS RERA No. ${p.rera}.`).join(" ")}</p>}
          <p>
            Images are artist&apos;s impressions and brochures are conceptual presentations, not a legal offering. Specifications, plans and
            elevations may change at the promoters&apos; discretion. Please verify details with our team and the relevant RERA registration.
          </p>
          <div className="footer__legal-row">
            <span>© {new Date().getFullYear()} Squarefoot Realty. All rights reserved.</span>
            <span style={{ display: "flex", gap: 20 }}>
              <Link href="/privacy">Privacy Policy</Link>
              <a href="#main">Back to top ↑</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
