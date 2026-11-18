import { NextResponse, type NextRequest } from "next/server";
import { createReadStream, statSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { BROCHURE_COOKIE, verifyToken } from "@/lib/brochure-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One official PDF per project, served byte-for-byte (no recompression).
 *  • the-square  — the supplied brochure, unchanged.
 *  • urban-ranch — the supplied brochure with the official Squarefoot Realty logo
 *    added beside the existing promoter logos on the cover and back page. The
 *    untouched original is kept at private/urban-ranch-brochure-original.pdf;
 *    point `file` at it to serve the original instead.
 */
const BROCHURES = {
  "the-square": { file: "the-square-brochure.pdf", name: "The-Square-Brochure-Squarefoot-Realty.pdf" },
  "urban-ranch": { file: "urban-ranch-brochure-squarefoot-revised.pdf", name: "Urban-Ranch-Brochure-Squarefoot-Realty.pdf" },
} as const;
type Project = keyof typeof BROCHURES;

function pick(req: NextRequest): Project {
  const p = req.nextUrl.searchParams.get("project");
  return p && p in BROCHURES ? (p as Project) : "the-square";
}

/**
 * Streams the brochure to visitors holding a valid enquiry cookie.
 * Everyone else is sent to the enquiry form for that project.
 */
export async function GET(req: NextRequest) {
  const project = pick(req);
  if (!verifyToken(req.cookies.get(BROCHURE_COOKIE)?.value)) {
    if (req.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "Please submit the enquiry form to download the brochure." }, { status: 401 });
    }
    const back = project === "urban-ranch" ? "/urban-ranch?brochure=1#enquire" : "/contact?brochure=1#enquire";
    return NextResponse.redirect(new URL(back, req.url), 303);
  }

  const { file, name } = BROCHURES[project];
  const path = join(process.cwd(), "private", file);
  let size: number;
  try {
    size = statSync(path).size;
  } catch {
    console.error("[brochure] file missing at", path);
    return NextResponse.json({ ok: false, error: "Brochure is temporarily unavailable." }, { status: 500 });
  }

  const stream = Readable.toWeb(createReadStream(path)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(size),
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function HEAD(req: NextRequest) {
  const ok = verifyToken(req.cookies.get(BROCHURE_COOKIE)?.value);
  return new Response(null, { status: ok ? 200 : 401 });
}
