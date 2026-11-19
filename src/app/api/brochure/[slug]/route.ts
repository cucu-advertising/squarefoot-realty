import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs";
import { getBrochure } from "@/lib/brochures";
import { verifyToken, unlockedFromCookie, ACCESS_COOKIE } from "@/lib/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Streams a gated brochure. Access requires EITHER a valid short-lived download token
 * for this exact project OR the signed session cookie that lists this project.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const brochure = getBrochure(slug);
  if (!brochure) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const token = verifyToken<{ p: string }>(req.nextUrl.searchParams.get("token"));
  const byToken = token?.p === slug;
  const byCookie = unlockedFromCookie(req.cookies.get(ACCESS_COOKIE)?.value).includes(slug);

  if (!byToken && !byCookie) {
    // Not authorised: send people back to the project page where the form lives.
    const accept = req.headers.get("accept") ?? "";
    if (accept.includes("text/html")) {
      return NextResponse.redirect(new URL(`/projects/${slug}?brochure=1#brochure`, req.url), 303);
    }
    return NextResponse.json({ error: "Please submit the enquiry form to download this brochure." }, { status: 403 });
  }

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(brochure.path);
  } catch {
    return NextResponse.json({ error: "Brochure file missing." }, { status: 404 });
  }
  // Pull-based stream with backpressure; tolerates the client aborting mid-download.
  const file = fs.createReadStream(brochure.path, { highWaterMark: 256 * 1024 });
  let closed = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      file.on("data", (chunk) => {
        if (closed) return;
        controller.enqueue(new Uint8Array(chunk as Buffer));
        if ((controller.desiredSize ?? 1) <= 0) file.pause();
      });
      file.on("end", () => {
        if (closed) return;
        closed = true;
        controller.close();
      });
      file.on("error", (err) => {
        if (closed) return;
        closed = true;
        controller.error(err);
      });
    },
    pull() {
      file.resume();
    },
    cancel() {
      closed = true;
      file.destroy();
    },
  });
  return new NextResponse(stream, {
    headers: {
      "content-type": "application/pdf",
      "content-length": String(stat.size),
      "content-disposition": `attachment; filename="${brochure.downloadName}"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}
