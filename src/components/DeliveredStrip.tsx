import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

/** Expanding image panels on desktop; swipeable snap row on touch. */
export default function DeliveredStrip({ items }: { items: Project[] }) {
  return (
    <div className="dstrip" data-reveal="fade">
      {items.map((p) => {
        const img = p.cover ?? p.hero;
        const body = (
          <>
            {img ? <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1023px) 72vw, 40vw" quality={75} /> : <span className="dtile__big" aria-hidden>{p.name}</span>}
            <div className="dtile__body">
              <span className="dtile__meta">{p.locationShort}</span>
              <span className="dtile__name">{p.name}</span>
              <span className="dtile__meta">{p.type} · OC received</span>
              {p.hasPage && <span className="dtile__go link-line">View project</span>}
            </div>
          </>
        );
        return p.hasPage ? (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="dtile" data-cursor="View">
            {body}
          </Link>
        ) : (
          <div key={p.slug} className={`dtile ${img ? "" : "dtile--text"}`}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
