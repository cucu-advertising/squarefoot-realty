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
    <section id={id} className="reel pin" data-seq="reel" data-autoplay data-head="light" aria-label="Delivered projects">
      <div className="pin__stage">
        <div className="reel__track" data-track>
          <div className="reel__intro" data-track-skip>
            {intro}
          </div>
          {cards.map((c, i) => {
            const body =
              c.size === "x" ? (
                <div className="reel__info">
                  <div className="reel__meta">
                    <span className="reel__idx">{String(i + 1).padStart(2, "0")}</span>
                    {c.project.hasPage && (
                      <svg className="reel__go" viewBox="0 0 16 16" aria-hidden>
                        <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    )}
                  </div>
                  <div className="reel__body">
                    <h3>{c.project.name}</h3>
                    <p className="reel__loc">{c.caption}</p>
                    {c.info && c.info.length > 0 && <p className="reel__facts">{c.info.join("  ·  ")}</p>}
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
              <Link key={i} href={`/projects/${c.project.slug}`} className={`reel__card reel__card--${c.size}`} data-cursor={c.size === "x" ? undefined : "View project"}>
                {body}
              </Link>
            ) : (
              <div key={i} className={`reel__card reel__card--${c.size}`}>
                {body}
              </div>
            );
          })}
        </div>
        <HArrows tone="light" numbers />
        <div className="reel__progress" aria-hidden>
          <i />
        </div>
      </div>
    </section>
  );
}
