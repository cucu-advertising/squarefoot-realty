"use client";

/**
 * The one step control used across the site: ‹  01  02  03  ›
 * Numbers jump to a step, arrows step through. The next arrow carries the autoplay ring.
 */
export default function SeqNav({
  n,
  current,
  onGo,
  tone = "dark",
  numbers = true,
  arrows = true,
  vertical = false,
  loop = false,
  label = "Steps",
  className = "",
}: {
  n: number;
  current: number;
  onGo: (k: number) => void;
  tone?: "dark" | "light";
  numbers?: boolean;
  arrows?: boolean;
  vertical?: boolean;
  loop?: boolean;
  label?: string;
  className?: string;
}) {
  const prev = () => onGo(current > 0 ? current - 1 : loop ? n - 1 : 0);
  const next = () => onGo(current < n - 1 ? current + 1 : loop ? 0 : n - 1);
  return (
    <nav className={`seqnav seqnav--${tone} ${vertical ? "seqnav--v" : ""} ${className}`} aria-label={label}>
      {arrows && (
        <button type="button" className="seqnav__arrow" aria-label="Previous" disabled={!loop && current <= 0} onClick={prev}>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      )}
      {numbers &&
        Array.from({ length: n }, (_, k) => (
          <button key={k} type="button" className="seqnav__n" aria-current={k === current} aria-label={`Go to ${String(k + 1).padStart(2, "0")}`} onClick={() => onGo(k)}>
            <span>{String(k + 1).padStart(2, "0")}</span>
          </button>
        ))}
      {arrows && (
        <button type="button" className="seqnav__arrow js-autonext" aria-label="Next" disabled={!loop && current >= n - 1} onClick={next}>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      )}
    </nav>
  );
}
