import type { Stat } from "@/lib/projects";

/** Large figures; purely numeric values count up on scroll (see Motion.tsx). */
export default function Stats({ items, className = "stats" }: { items: Stat[]; className?: string }) {
  return (
    <dl className={`${className} ${items.length === 3 ? "stats--3" : ""}`} style={{ ["--cols" as string]: items.length }}>
      {items.map((s) => (
        <div key={s.label} className="stat" data-reveal="fade">
          <dt className="sr-only">{s.label}</dt>
          <dd className="stat__n">
            <span data-count={s.value}>
              {s.value.includes("–") ? (
                <>
                  {s.value.split("–")[0]}–<wbr />
                  {s.value.split("–")[1]}
                </>
              ) : (
                s.value
              )}
            </span>
            {s.unit && <small>{s.unit}</small>}
          </dd>
          <dd className="stat__l">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}
