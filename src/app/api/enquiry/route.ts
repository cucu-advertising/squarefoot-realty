import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { validateEnquiry } from "@/lib/validation";
import { deliverLead, CONSENT_TEXT, type Lead } from "@/lib/leads";
import { getProject } from "@/lib/projects";
import { getBrochure } from "@/lib/brochures";
import { rateLimited, previousSubmission, rememberSubmission } from "@/lib/rateLimit";
import {
  createToken,
  unlockedFromCookie,
  ACCESS_COOKIE,
  ACCESS_TTL_S,
  DOWNLOAD_TTL_S,
} from "@/lib/tokens";

export const runtime = "nodejs";

const MIN_FILL_MS = 2500;

function clientIp(req: NextRequest) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}

export async function POST(req: NextRequest) {
  // Same-origin check: browsers always send Origin on POST fetches.
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return NextResponse.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Duplicate submission (double click, retry): return the original outcome.
  const submissionId = typeof body.submissionId === "string" ? body.submissionId.slice(0, 64) : "";
  if (submissionId) {
    const prev = previousSubmission(submissionId);
    if (prev) return NextResponse.json(prev);
  }

  // Spam protection: honeypot + minimum time to fill + rate limit.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: false, error: "Your enquiry could not be sent." }, { status: 400 });
  }
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, error: "That was quick! Please check your details and try again." }, { status: 400 });
  }
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  const parsed = validateEnquiry(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields: parsed.errors }, { status: 422 });
  }
  const data = parsed.data;

  const brochure = data.kind === "brochure" ? getBrochure(data.project) : undefined;
  if (data.kind === "brochure" && !brochure) {
    return NextResponse.json({ ok: false, error: "A brochure is not available for this project yet." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const lead: Lead = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: now,
    consentText: CONSENT_TEXT,
    consentAt: now,
    ip,
    userAgent: req.headers.get("user-agent")?.slice(0, 200) ?? undefined,
    page: typeof body.page === "string" ? body.page.slice(0, 200) : undefined,
  };

  const delivery = await deliverLead(lead);
  if (!delivery.accepted) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or call us directly." },
      { status: 502 },
    );
  }

  const payload: Record<string, unknown> = { ok: true, id: lead.id };
  const res = NextResponse.json(payload);

  if (brochure) {
    const token = createToken({ p: data.project }, DOWNLOAD_TTL_S);
    payload.downloadUrl = `/api/brochure/${data.project}?token=${encodeURIComponent(token)}`;
    payload.projectName = getProject(data.project)?.name;
    const unlocked = new Set(unlockedFromCookie(req.cookies.get(ACCESS_COOKIE)?.value));
    unlocked.add(data.project);
    const cookieRes = NextResponse.json(payload);
    cookieRes.cookies.set(ACCESS_COOKIE, createToken({ projects: [...unlocked] }, ACCESS_TTL_S), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api",
      maxAge: ACCESS_TTL_S,
    });
    if (submissionId) rememberSubmission(submissionId, payload);
    return cookieRes;
  }

  if (submissionId) rememberSubmission(submissionId, payload);
  return res;
}
