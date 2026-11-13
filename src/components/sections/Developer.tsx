import Link from "next/link";
import { developer } from "@/content/site";
import { SquarefootMark, Sunrise } from "../Brand";

export default function Developer() {
  return (
    <section id="developer" className="developer section" aria-labelledby="dev-title">
      <div className="wrap">
        <div className="developer__grid">
          <div className="developer__mark" data-reveal aria-hidden="true">
            <Sunrise />
          </div>

          <div className="developer__copy">
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__num">07</span> The developer
            </p>
            <h2 id="dev-title" className="display-2" data-split>
              A square. A sun. <em>A bigger idea of home.</em>
            </h2>
            <p className="developer__lead" data-reveal>{developer.intro}</p>
            <p data-reveal>{developer.evolution}</p>
            <Link href="/about" className="btn btn--ghost" data-reveal>
              <span>Our story</span>
              <span className="btn__icon btn__icon--ne" aria-hidden="true"><span>↗</span></span>
            </Link>
          </div>
        </div>

        <ol className="pillars">
          {developer.pillars.map(([t, d], i) => (
            <li key={t} data-reveal style={{ ["--d" as string]: `${i * 100}ms` }}>
              <span className="pillars__num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t}.</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>

        <div className="delivered" data-reveal>
          <div className="delivered__head">
            <SquarefootMark />
            <div>
              <h3>Delivered. Occupied. Trusted.</h3>
              <p>Projects that have received their occupancy certificates (OC).</p>
            </div>
          </div>
          <ul className="delivered__list">
            {developer.delivered.map(([n, p]) => (
              <li key={n}>
                <strong>{n}</strong>
                <span>{p}</span>
              </li>
            ))}
            <li className="delivered__more">
              <strong>+ Layouts</strong>
              <span>A series of layout and plotting ventures</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
