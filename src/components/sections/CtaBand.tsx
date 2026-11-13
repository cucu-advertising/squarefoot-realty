import Image from "next/image";
import { BrochureButton, EnquireButton } from "../EnquiryProvider";

export default function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="px" data-parallax="7">
        <Image src="/images/project/aerial-masterplan.jpg" alt="" fill sizes="100vw" className="cta-band__img" />
      </div>
      <div className="cta-band__shade" />
      <div className="wrap cta-band__inner">
        <p className="eyebrow eyebrow--light" data-reveal>At last, an address that meets your stature</p>
        <h2 id="cta-title" className="display-1" data-split>
          Ready to find <em>your place?</em>
        </h2>
        <p className="cta-band__text" data-reveal style={{ ["--d" as string]: "250ms" }}>
          Come see it for yourself, and picture calling it home. Tell us what you are looking for and our team will take it from there.
        </p>
        <div className="cta-band__ctas" data-reveal style={{ ["--d" as string]: "380ms" }}>
          <EnquireButton className="btn btn--light btn--lg" source="Home Page">Get in Touch</EnquireButton>
          <BrochureButton className="btn btn--outline-light btn--lg" />
        </div>
      </div>
    </section>
  );
}
