import Image from "next/image";

/**
 * Brand marks — every logo here is the official artwork, extracted from the supplied
 * source files (never redrawn):
 *  • The Square ............ The_Square_Brochure.pdf
 *  • Squarefoot Realty ..... Squarefoot Realty Branding Final.pdf (logo page: mark,
 *                            stacked, "logo in left side"; reversed version from the
 *                            black-background page) and the brochure back cover.
 */

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

type SfVariant = "mark" | "horizontal" | "stacked" | "reversed";
const SF: Record<SfVariant, { src: string; w: number; h: number }> = {
  mark: { src: "/images/brand/squarefoot-mark.png", w: 1201, h: 1201 },
  horizontal: { src: "/images/brand/squarefoot-logo-horizontal.png", w: 1400, h: 421 },
  stacked: { src: "/images/brand/squarefoot-logo-stacked.png", w: 1000, h: 882 },
  reversed: { src: "/images/brand/squarefoot-logo-reversed.png", w: 1400, h: 1235 },
};

/** Official Squarefoot Realty logo. `reversed` is the white-type version for dark grounds. */
export function SquarefootLogo({
  variant = "stacked",
  className = "",
  sizes = "200px",
  decorative = false,
}: {
  variant?: SfVariant;
  className?: string;
  sizes?: string;
  decorative?: boolean;
}) {
  const v = SF[variant];
  return (
    <Image
      src={v.src}
      alt={decorative ? "" : "Squarefoot Realty"}
      width={v.w}
      height={v.h}
      sizes={sizes}
      className={`sf-logo sf-logo--${variant} ${className}`}
    />
  );
}
