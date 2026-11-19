import "server-only";
import path from "node:path";

/**
 * Project slug -> brochure file inside /private/brochures (never served statically).
 * Keep this map in sync with `brochure` keys in projects.ts.
 */
const BROCHURES: Record<string, { file: string; downloadName: string }> = {
  "the-square": { file: "the-square.pdf", downloadName: "The-Square-Brochure-Squarefoot-Realty.pdf" },
  "challa-elite": { file: "challa-elite.pdf", downloadName: "Challa-Elite-Brochure-Squarefoot-Realty.pdf" },
  "trans-elite": { file: "trans-elite.pdf", downloadName: "Trans-Elite-Brochure-Squarefoot-Realty.pdf" },
};

export const BROCHURE_DIR = path.join(process.cwd(), "private", "brochures");

export function getBrochure(slug: string) {
  const entry = BROCHURES[slug];
  if (!entry) return undefined;
  return { ...entry, path: path.join(BROCHURE_DIR, entry.file) };
}
