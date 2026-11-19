import Image from "next/image";
import type { Highlight } from "@/lib/projects";

/**
 * Editorial feature rows: a sticky image on one side cross-fades as each feature reaches
 * the viewport centre (IntersectionObserver in Motion.tsx). On small screens each feature
 * carries its own image instead.
 */
export default function FeatureSwap({ items, credit }: { items: Highlight[]; credit?: string }) {
  return (
    <div className="feat" data-feat>
      <div className="feat__visual" aria-hidden>
        {items.map((h, i) =>
          h.image ? (
            <div key={h.title} className={`feat__img ${i === 0 ? "is-on" : ""}`} data-feat-img>
              <Image src={h.image.src} alt="" fill sizes="(max-width: 899px) 100vw, 50vw" quality={80} />
              {credit && <span className="feat__badge">{credit}</span>}
            </div>
          ) : null,
        )}
      </div>
      <ol role="list" className="feat__list">
        {items.map((h, i) => (
          <li key={h.title} className="feat__item" data-feat-item>
            {h.image && (
              <div className="feat__mimg" data-reveal="mask">
                <Image src={h.image.src} alt={h.image.alt} fill sizes="100vw" quality={75} />
              </div>
            )}
            <span className="feat__n">0{i + 1} / 0{items.length}</span>
            <h3 className="d-h3 feat__title" data-split>
              {h.title}
            </h3>
            <p className="lead feat__line">{h.line}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
