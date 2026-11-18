import Image from "next/image";
import { signature } from "@/content/site";
import { BrochureButton } from "../EnquiryProvider";

/**
 * The three signature features, editorially: large numeral, short headline, one line.
 * Full specifications live in the brochure (CTA below), not on the page.
 */
export default function Signature() {
  return (
    <section id="highlights" className="signature section section--dark" aria-labelledby="sig-title">
      <div className="wrap">
        <div className="split">
          <div>
            <p className="eyebrow eyebrow--light" data-reveal>
              <span className="eyebrow__num">02</span> Signature features
            </p>
            <h2 id="sig-title" className="h2" data-split>
              Where every square foot <em>exudes luxury.</em>
            </h2>
          </div>
        </div>

        <ol className="sig">
          {signature.map((f, i) => (
            <li key={f.no} className={`sig__item sig__item--${f.fit} ${i % 2 ? "is-flip" : ""}`}>
              <figure className="sig__media" data-reveal="mask">
                <div className="sig__frame">
                  <div className={f.fit === "wide" ? "px" : "sig__still"} data-parallax={f.fit === "wide" ? "5" : undefined}>
                    <Image
                      src={f.image.src}
                      alt={f.image.alt}
                      fill
                      sizes={f.fit === "wide" ? "(max-width: 860px) 100vw, 62vw" : "(max-width: 860px) 100vw, 40vw"}
                      quality={82}
                    />
                  </div>
                </div>
              </figure>
              <div className="sig__copy">
                <span className="sig__no" aria-hidden="true" data-reveal>
                  {f.no}
                </span>
                <h3 className="h3" data-split>
                  {f.title}
                </h3>
                <p className="sig__text" data-reveal>
                  {f.text}
                </p>
                {f.note && (
                  <p className="meta sig__note" data-reveal>
                    {f.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="sig__cta" data-reveal>
          <p className="lead">The complete specifications — structure, finishes, fittings and services — are in the project brochure.</p>
          <div className="cta-row">
            <BrochureButton className="btn btn--light btn--lg" icon="ne">
              Explore Complete Specifications
            </BrochureButton>
          </div>
        </div>
      </div>
    </section>
  );
}
