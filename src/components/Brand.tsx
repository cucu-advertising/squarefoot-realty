import Image from "next/image";

export function TheSquareLogo({ tone = "color", className = "", priority = false }: { tone?: "color" | "light"; className?: string; priority?: boolean }) {
  return (
    <Image
      src="/images/brand/the-square-logo.png"
      alt="The Square"
      width={1201}
      height={641}
      priority={priority}
      sizes="160px"
      className={`logo-square ${tone === "light" ? "logo-square--light" : ""} ${className}`}
    />
  );
}

/** Squarefoot Realty symbol: the square (stability) and the sun (optimism). [G] */
export function SquarefootMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg className={`sf-mark ${className}`} viewBox="0 0 32 32" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <clipPath id="sfclip">
          <rect x="3" y="10" width="17" height="17" />
        </clipPath>
      </defs>
      <rect x="3" y="10" width="17" height="17" fill="#EA556F" />
      <circle cx="21" cy="10" r="8" fill="#FECC00" />
      <circle cx="21" cy="10" r="8" fill="#A2412F" clipPath="url(#sfclip)" />
    </svg>
  );
}

export function SquarefootLogo({ className = "", tone = "color" }: { className?: string; tone?: "color" | "light" }) {
  return (
    <span className={`sf-logo ${tone === "light" ? "sf-logo--light" : ""} ${className}`}>
      <SquarefootMark />
      <span className="sf-logo__word" aria-label="Squarefoot Realty">
        <span>squarefoot</span>
        <span>realty</span>
      </span>
    </span>
  );
}

/** Animated brand symbol: the sun rises beside the square on reveal. */
export function Sunrise({ large = false }: { large?: boolean }) {
  const id = large ? "sr-lg" : "sr";
  return (
    <svg className={`sunrise ${large ? "sunrise--lg" : ""}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="6" y="34" width="56" height="56" />
        </clipPath>
      </defs>
      <rect className="sunrise__square" x="6" y="34" width="56" height="56" fill="#EA556F" />
      <circle className="sunrise__sun" cx="64" cy="34" r="26" fill="#FECC00" />
      <g clipPath={`url(#${id})`}>
        <circle className="sunrise__sun" cx="64" cy="34" r="26" fill="#A2412F" />
      </g>
    </svg>
  );
}
