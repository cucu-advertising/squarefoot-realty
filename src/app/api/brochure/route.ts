import { NextResponse, type NextRequest } from "next/server";
import { createReadStream, statSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { BROCHURE_COOKIE, verifyToken } from "@/lib/brochure-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = join(process.cwd(), "private", "the-square-brochure.pdf");
const DOWNLOAD_NAME = "The-Square-Brochure-Squarefoot-Realty.pdf";

/**
 * Streams the original brochure (byte-for-byte, no recompression) to visitors
 * holding a valid enquiry cookie. Everyone else is sent to the enquiry form.
 */
export async function GET(req: NextRequest) {
  if (!verifyToken(req.cookies.get(BROCHURE_COOKIE)?.value)) {
    if (req.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "Please submit the enquiry form to download the brochure." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/contact?brochure=1#enquire", req.url), 303);
  }

  let size: number;
  try {
    size = statSync(FILE).size;
  } catch {
    console.error("[brochure] file missing at", FILE);
    return NextResponse.json({ ok: false, error: "Brochure is temporarily unavailable." }, { status: 500 });
  }

  const stream = Readable.toWeb(createReadStream(FILE)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(size),
      "Content-Disposition": `attachment; filename="${DOWNLOAD_NAME}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function HEAD(req: NextRequest) {
  const ok = verifyToken(req.cookies.get(BROCHURE_COOKIE)?.value);
  return new Response(null, { status: ok ? 200 : 401 });
}
