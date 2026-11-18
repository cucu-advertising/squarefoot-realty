"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contact, rera, nav, developer, brochureDisclaimer, urbanRanch } from "@/content/site";
import { TheSquareLogo, SquarefootLogo } from "./Brand";
import { BrochureButton, EnquireButton } from "./EnquiryProvider";

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isUR = pathname.startsWith("/urban-ranch");
  const project = isUR ? "urban-ranch" : "the-square";

  return (
    <footer className="footer" aria-labelledby="footer-title">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <SquarefootLogo variant="reversed" sizes="140px" className="footer__sf" />
            <h2 id="footer-title" className="h2 footer__tagline" data-split>
              Everything <em>and Beyond.</em>
            </h2>
            <div className="cta-row">
              <EnquireButton className="btn btn--light" source="Home Page" project={project} />
              <BrochureButton className="btn btn--outline-light" project={project} />
            </div>
          </div>

          <div className="footer__cols">
            <div>
              <h3 className="label footer__h">Explore</h3>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label footer__h">Projects</h3>
              <ul>
                {developer.unfolding.map((p) => (
                  <li key={p.name}>
                    {p.href ? <Link href={p.href}>{p.name}</Link> : <span>{p.name}</span>}
                    <small>{p.place.replace("-", "\u2011")}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label footer__h">Get in touch</h3>
              <address>
                <strong>{contact.promoter}</strong>
                {contact.addressLines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
              <p className="footer__contact">
                <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            </div>
          </div>
        </div>

        <div className="footer__marks">
          <TheSquareLogo tone="light" className="footer__square" />
          <p className="meta">
            The Square · TS RERA {rera.number} &nbsp;|&nbsp; Urban Ranch · TG RERA {urbanRanch.rera}
          </p>
        </div>

        <div className="footer__legal">
          <p className="small">
            <strong>Disclaimer.</strong> {brochureDisclaimer} Drive times are approximate and as stated in the project brochures. RERA details:{" "}
            <a href={rera.portal} target="_blank" rel="noopener noreferrer">
              rerait.telangana.gov.in
            </a>
            .
          </p>
          <div className="footer__bottom">
            <p>© {year} Squarefoot Realty. All rights reserved.</p>
            <ul>
              <li>
                <Link href="/privacy-policy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/disclaimer">Terms &amp; disclaimer</Link>
              </li>
              <li>
                <Link href="/sitemap.xml">Sitemap</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
