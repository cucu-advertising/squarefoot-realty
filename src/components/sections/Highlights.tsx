import { highlights, highlightFacts, projectHighlights } from "@/content/site";

export default function Highlights() {
  return (
    <section className="highlights section section--dark" aria-labelledby="highlights-title">
      <div className="wrap">
        <div className="highlights__head">
          <p className="eyebrow eyebrow--light" data-reveal>
            <span className="eyebrow__num">02</span> Project highlights
          </p>
          <h2 id="highlights-title" className="display-2" data-split>
            When luxury is lavish, amenities abundant <em>&amp; spaces prolific.</em>
          </h2>
        </div>

        <ul className="stats" data-reveal>
          {highlights.map((h) => (
            <li key={h.label} className="stat">
              <span className="stat__value">
                <span data-count={h.value}>{h.value}</span>
                <span className="stat__unit">{h.unit}</span>
              </span>
              <span className="stat__label">{h.label}</span>
            </li>
          ))}
        </ul>

        <div className="highlights__body">
          <dl className="facts" data-reveal>
            {highlightFacts.map(([k, v]) => (
              <div key={k} className="facts__row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <details className="all-highlights" data-reveal>
            <summary>
              <span>All {projectHighlights.length} project highlights</span>
              <span className="plus" aria-hidden="true" />
            </summary>
            <ul>
              {projectHighlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}
