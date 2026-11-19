import { NextResponse, type NextRequest } from "next/server";
import { getBrochure } from "@/lib/brochures";
import { unlockedFromCookie, ACCESS_COOKIE } from "@/lib/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lets the modal skip the form when this visitor already unlocked the brochure this session. */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("project") ?? "";
  const available = Boolean(getBrochure(slug));
  const unlocked = available && unlockedFromCookie(req.cookies.get(ACCESS_COOKIE)?.value).includes(slug);
  return NextResponse.json(
    { available, unlocked, downloadUrl: unlocked ? `/api/brochure/${slug}` : undefined },
    { headers: { "cache-control": "private, no-store" } },
  );
}
