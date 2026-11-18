import Image from "next/image";
import Link from "next/link";
import { rera, highlights } from "@/content/site";
import { BrochureButton } from "../EnquiryProvider";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media" data-hero-media>
        <Image
          src="/images/project/villas-dusk.jpg"
          alt="Contemporary duplex villas along a landscaped avenue at dusk — artist's impression of The Square"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="hero__img"
        />
        <div className="hero__shade" />
      </div>

      <div className="hero__content wrap" data-hero-content>
        <p className="hero__eyebrow">
          <span>Squarefoot Realty presents <strong>The Square</strong></span>
          <span className="hero__sep" aria-hidden="true" />
          <span>Luxury villas at Adibatla</span>
        </p>
        <h1 id="hero-title" className="hero__title">
          <span className="line"><span>Everything</span></span>
          <span className="line"><span>and <em>Beyond.</em></span></span>
        </h1>
        <p className="hero__sub">131 East &amp; West facing luxury duplex villas on 13.5 acres, a few steps from the ORR.</p>
        <div className="hero__ctas">
          <Link href="/#project" className="btn btn--light btn--lg">
            <span>Explore Project</span>
            <span className="btn__icon btn__icon--se" aria-hidden="true"><span>↘</span></span>
          </Link>
          <BrochureButton className="btn btn--outline-light btn--lg" />
        </div>
      </div>

      <div className="hero__strip">
        <div className="wrap hero__strip-inner">
          <ul className="hero__facts">
            {highlights.slice(1, 3).map((h) => (
              <li key={h.label}>
                <strong>{h.value} {h.unit}</strong>
                <span>{h.label}</span>
              </li>
            ))}
            <li>
              <strong>ORR Exit 13</strong>
              <span>Kongara Kalan Road, Adibatla</span>
            </li>
          </ul>
          <p className="hero__rera">
            TS RERA No. {rera.number}
            <span>HMDA &amp; RERA approved</span>
          </p>
        </div>
      </div>
      <a href="#project" className="hero__scroll" aria-label="Scroll to project introduction">
        <span />
      </a>
    </section>
  );
}
