import Image from "next/image";
import { BrochureButton, EnquireButton } from "../EnquiryProvider";

export default function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="px" data-parallax="6">
        <Image src="/images/the-square-hd/aerial-night.jpg" alt="" fill sizes="100vw" quality={75} className="cta-band__img" />
      </div>
      <div className="cta-band__shade" />
      <div className="wrap cta-band__inner">
        <p className="eyebrow eyebrow--light" data-reveal>
          At last, an address that meets your stature
        </p>
        <h2 id="cta-title" className="h1" data-split>
          Ready to find <em>your place?</em>
        </h2>
        <p className="lead cta-band__text" data-reveal style={{ ["--d" as string]: "200ms" }}>
          Come see it for yourself, and picture calling it home.
        </p>
        <div className="cta-row cta-row--center" data-reveal style={{ ["--d" as string]: "320ms" }}>
          <EnquireButton className="btn btn--light btn--lg" source="Home Page">
            Book a Site Visit
          </EnquireButton>
          <BrochureButton className="btn btn--outline-light btn--lg" />
        </div>
      </div>
    </section>
  );
}
