import { GLYPHS, WORDMARK } from "./logoGlyphs";

const RED = "#EA556F";
const SUN = "#FECC00";
const BRICK = "#A2412F";

/** Square + sun mark. Geometry taken from the brand book vector artwork. */
export function Mark({ className, title, mono, anim, onRed }: { className?: string; title?: string; mono?: boolean; anim?: boolean; onRed?: boolean }) {
  return (
    <svg
      className={`logo-mark ${className ?? ""}`}
      viewBox="0 0 269.85 269.85"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      data-mark-anim={anim ? "" : undefined}
    >
      <rect data-part="square" x="0" y="89.95" width="179.9" height="179.9" fill={mono ? "currentColor" : onRed ? "#F5F2EC" : RED} />
      <circle data-part="sun" cx="179.9" cy="89.95" r="89.95" fill={mono ? "currentColor" : SUN} />
      <path
        data-part="overlap"
        d="M89.95 89.95H179.9V179.9A89.95 89.95 0 0 1 89.95 89.95Z"
        fill={mono ? "currentColor" : BRICK}
      />
    </svg>
  );
}

function Wordmark({ transform, alignLeft }: { transform?: string; alignLeft?: boolean }) {
  return (
    <g fill="currentColor" transform={transform}>
      {WORDMARK.map((u, i) => (
        <path key={i} d={GLYPHS[u.g]} transform={`translate(${alignLeft && u.y > 700 ? u.x - 193.58 : u.x} ${u.y})`} />
      ))}
    </g>
  );
}

/** Horizontal lock-up ("logo in left side" variant in the brand book). Wordmark inherits currentColor. */
export function LogoHorizontal({ className, onRed }: { className?: string; onRed?: boolean }) {
  // Wordmark source block spans x 668–1252, cap-top 580 → baseline 2 at 743.6.
  const s = 0.8;
  const tx = 300 - 668.14 * s;
  const ty = 96 - 580 * s;
  return (
    <svg className={className} viewBox="0 0 780 270" role="img" aria-label="Squarefoot Realty">
      <rect x="0" y="89.95" width="179.9" height="179.9" fill={onRed ? "#F5F2EC" : RED} style={{ transition: "fill 0.3s" }} />
      <circle cx="179.9" cy="89.95" r="89.95" fill={SUN} />
      <path d="M89.95 89.95H179.9V179.9A89.95 89.95 0 0 1 89.95 89.95Z" fill={BRICK} />
      <Wordmark alignLeft transform={`translate(${tx} ${ty}) scale(${s})`} />
    </svg>
  );
}

/** Stacked, centred lock-up exactly as drawn in the brand book. */
export function LogoStacked({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="655 245 612 525" role="img" aria-label="Squarefoot Realty">
      <rect x="869.57" y="343" width="179.9" height="179.9" fill={RED} />
      <circle cx="1049.47" cy="343" r="89.95" fill={SUN} />
      <path d="M959.52 343H1049.47V432.95A89.95 89.95 0 0 1 959.52 343Z" fill={BRICK} />
      <Wordmark />
    </svg>
  );
}

/** First line of the wordmark ("squarefoot") alone, for the oversized footer watermark. */
export function WordmarkLine({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="662 572 596 108" aria-hidden>
      <g fill="currentColor">
        {WORDMARK.filter((u) => u.y < 700).map((u, i) => (
          <path key={i} d={GLYPHS[u.g]} transform={`translate(${u.x} ${u.y})`} />
        ))}
      </g>
    </svg>
  );
}
