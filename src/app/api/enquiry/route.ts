import { NextResponse, type NextRequest } from "next/server";
import { parseEnquiry } from "@/lib/validation";
import { createHash } from "node:crypto";
import { clientIp, limit, markDelivered, wasDelivered } from "@/lib/rate-limit";
import { deliverLead, DeliveryNotConfigured } from "@/lib/deliver";
import { BROCHURE_COOKIE, BROCHURE_TTL_SECONDS, assertTokenConfigured, issueToken } from "@/lib/brochure-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500; // humans don't complete the form in under 2.5s

export async function POST(req: NextRequest) {
  // Same-origin only
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  const ip = clientIp(req.headers);
  const rl = limit(`enquiry:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please try again shortly or call us directly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    const len = Number(req.headers.get("content-length") || 0);
    if (len > 20_000) throw new Error("too large");
    body = await req.json();
    if (!body || typeof body !== "object") throw new Error("bad body");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Spam traps: honeypot field + minimum fill time. Respond like a validation
  // failure (no success, no delivery) so bots learn nothing useful.
  const started = Number(body.startedAt);
  if ((typeof body.website === "string" && body.website.trim() !== "") ||
      !Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, error: "We couldn't verify this submission. Please try again." }, { status: 400 });
  }

  const { data, errors } = parseEnquiry(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors: errors }, { status: 422 });
  }

  try {
    assertTokenConfigured();
  } catch (err) {
    console.error("[enquiry]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: "Our enquiry service is temporarily unavailable. Please call or email us directly." },
      { status: 503 },
    );
  }

  const dedupeKey = createHash("sha256")
    .update([data.email, data.phone.replace(/\D/g, ""), data.source, data.configuration, data.message].join("|"))
    .digest("hex");
  const duplicate = wasDelivered(dedupeKey);

  const now = new Date();
  try {
    if (!duplicate) await deliverLead({
      ...data,
      submittedAt: now.toISOString(),
      submittedAtIST: now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }),
      page: typeof body.page === "string" ? body.page.slice(0, 200) : "",
      userAgent: (req.headers.get("user-agent") || "").slice(0, 200),
    });
  } catch (err) {
    console.error("[enquiry] delivery failed:", err instanceof Error ? err.message : err);
    const notConfigured = err instanceof DeliveryNotConfigured;
    return NextResponse.json(
      {
        ok: false,
        error: notConfigured
          ? "Our enquiry service is temporarily unavailable. Please call or email us directly."
          : "Something went wrong. Please try again or call us directly.",
      },
      { status: notConfigured ? 503 : 502 },
    );
  }

  if (!duplicate) markDelivered(dedupeKey);
  const res = NextResponse.json({ ok: true, brochureUrl: "/api/brochure", duplicate: duplicate || undefined });
  res.cookies.set(BROCHURE_COOKIE, issueToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/brochure",
    maxAge: BROCHURE_TTL_SECONDS,
  });
  return res;
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}
