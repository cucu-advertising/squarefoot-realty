import Link from "next/link";
import { contact, rera, nav, developer, brochureDisclaimer } from "@/content/site";
import { TheSquareLogo, SquarefootLogo } from "./Brand";
import { BrochureButton, EnquireButton } from "./EnquiryProvider";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" aria-labelledby="footer-title">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <h2 id="footer-title" className="footer__tagline" data-split>
              Everything <em>and Beyond.</em>
            </h2>
            <p className="footer__line">Squarefoot Realty, formerly Sai Teja Developers. Three decades of building in Hyderabad.</p>
            <div className="footer__ctas">
              <EnquireButton className="btn btn--light" source="Home Page" />
              <BrochureButton className="btn btn--outline-light" />
            </div>
          </div>

          <div className="footer__cols">
            <div>
              <h3 className="footer__h">Explore</h3>
              <ul>
                <li><Link href="/">Home</Link></li>
                {nav.map((n) => (
                  <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="footer__h">Projects</h3>
              <ul>
                {developer.unfolding.map((p) => (
                  <li key={p.name}>
                    {p.name === "The Square" ? <Link href="/#project">{p.name}</Link> : <span>{p.name}</span>}
                    <small>{p.place}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="footer__h">Get in touch</h3>
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
          <div className="footer__promoters">
            <span className="footer__promoters-label">Promoters</span>
            <span className="footer__ira">{contact.promoter}</span>
            <SquarefootLogo tone="light" />
          </div>
        </div>

        <div className="footer__legal">
          <p className="footer__rera">
            <strong>TS RERA No. {rera.number}</strong> · {rera.approvals} · Details available at{" "}
            <a href={rera.portal} target="_blank" rel="noopener noreferrer">
              rerait.telangana.gov.in
            </a>
          </p>
          <p className="footer__disclaimer">
            <strong>Disclaimer:</strong> {brochureDisclaimer} Drive times are approximate and as stated in the project brochure.
          </p>
          <div className="footer__bottom">
            <p>© {year} Squarefoot Realty. All rights reserved.</p>
            <ul>
              <li><Link href="/privacy-policy">Privacy policy</Link></li>
              <li><Link href="/disclaimer">Terms & disclaimer</Link></li>
              <li><Link href="/sitemap.xml">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
