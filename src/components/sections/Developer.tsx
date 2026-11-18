import Image from "next/image";
import Link from "next/link";
import { developer } from "@/content/site";
import { SquarefootLogo } from "../Brand";

/** The developer: official logo, one paragraph, three pillars, and the portfolio. */
export default function Developer() {
  return (
    <section id="developer" className="developer section" aria-labelledby="dev-title">
      <div className="wrap">
        <div className="developer__grid">
          <div className="developer__mark" data-reveal="mask">
            <div className="developer__plate">
              <SquarefootLogo variant="stacked" sizes="(max-width: 860px) 50vw, 260px" />
            </div>
          </div>

          <div className="developer__copy">
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__num">07</span> The developer
            </p>
            <h2 id="dev-title" className="h2" data-split>
              A square. A sun. <em>A bigger idea of home.</em>
            </h2>
            <p className="lead" data-reveal>
              {developer.formerly}
            </p>
            <ol className="pillars" data-reveal>
              {developer.pillars.map(([t, d], i) => (
                <li key={t}>
                  <span className="pillars__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h4">{t}</h3>
                  <p>{d}</p>
                </li>
              ))}
            </ol>
            <div className="cta-row" data-reveal>
              <Link href="/about" className="btn btn--ghost">
                <span>Our story</span>
                <span className="btn__icon btn__icon--ne" aria-hidden="true">
                  <span>↗</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="portfolio">
          <div className="portfolio__head" data-reveal>
            <h3 className="h3">Delivered. Occupied. Trusted.</h3>
            <p className="meta">Projects that have received their occupancy certificates (OC)</p>
          </div>
          <ul className="portfolio__grid">
            {developer.delivered.map((p, i) => (
              <li key={p.name} className={`pcard ${p.image ? "" : "pcard--text"}`} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
                {p.image && (
                  <div className="pcard__img">
                    <Image src={p.image} alt={`${p.name}, ${p.place} — artist's impression`} fill sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                  </div>
                )}
                <div className="pcard__body">
                  <h4 className="h4">{p.name}</h4>
                  <p className="meta">
                    {p.place}
                    {p.note ? ` · ${p.note}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
