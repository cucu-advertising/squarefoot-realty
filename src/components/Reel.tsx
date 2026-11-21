import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export interface ReelCard {
  project: Project;
  image?: { src: string; alt: string };
  caption: string;
  size: "a" | "b" | "c" | "t";
}

/** Horizontal reel. Desktop: pinned and driven by vertical scroll. Touch: native swipe with snap. */
export default function Reel({ intro, cards }: { intro: React.ReactNode; cards: ReelCard[] }) {
  return (
    <section className="reel pin" data-seq="reel" data-head="dark" aria-label="Delivered projects">
      <div className="pin__stage">
        <div className="reel__track">
          <div className="reel__intro">{intro}</div>
          {cards.map((c, i) => {
            const body = (
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
        <div className="reel__progress" aria-hidden>
          <i />
        </div>
      </div>
    </section>
  );
}
