import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import HArrows from "./HArrows";

export interface ReelCard {
  project: Project;
  image?: { src: string; alt: string };
  caption: string;
  /** a/b/c = image sizes; t = name-only tile; x = information card (no image). */
  size: "a" | "b" | "c" | "t" | "x";
  /** Lines listed on an information card. */
  info?: string[];
}

/** Horizontal reel. Desktop: pinned and driven by vertical scroll. Touch: native swipe with snap. */
export default function Reel({ intro, cards, id }: { intro: React.ReactNode; cards: ReelCard[]; id?: string }) {
  return (
    <section id={id} className="reel pin" data-seq="reel" data-head="dark" aria-label="Delivered projects">
      <div className="pin__stage">
        <div className="reel__track" data-track>
          <div className="reel__intro">{intro}</div>
          {cards.map((c, i) => {
            const body =
              c.size === "x" ? (
                <div className="reel__info">
                  <span className="reel__num">
                    <b>{String(i + 1).padStart(2, "0")}</b>
                    {c.project.statusLabel}
                  </span>
                  <div>
                    <h3>{c.project.name}</h3>
                    <p>{c.caption}</p>
                    {c.info && c.info.length > 0 && (
                      <ul role="list">
                        {c.info.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="reel__img">
                    {c.image ? <Image src={c.image.src} alt={c.image.alt} fill sizes="(max-width: 767px) 80vw, 40vw" quality={78} /> : <span>{c.project.name}</span>}
                  </div>
                  <div className="reel__cap">
                    <b>{c.project.name}</b>
                    <span className="muted">{c.caption}</span>
                  </div>
                </>
              );
            return c.project.hasPage ? (
              <Link key={i} href={`/projects/${c.project.slug}`} className={`reel__card reel__card--${c.size}`} data-cursor="View">
                {body}
              </Link>
            ) : (
              <div key={i} className={`reel__card reel__card--${c.size}`}>
                {body}
              </div>
            );
          })}
        </div>
        <HArrows tone="dark" />
        <div className="reel__progress" aria-hidden>
          <i />
        </div>
      </div>
    </section>
  );
}
