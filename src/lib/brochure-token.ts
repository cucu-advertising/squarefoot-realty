import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Signed, HttpOnly cookie that proves the visitor submitted a valid enquiry.
 * The brochure route only streams the PDF when this cookie verifies, so the
 * file cannot be fetched without going through the enquiry flow.
 */
export const BROCHURE_COOKIE = "tsq_brochure";
export const BROCHURE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

let devSecret: string | undefined;
function secret(): string {
  const s = process.env.BROCHURE_TOKEN_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("BROCHURE_TOKEN_SECRET must be set (32+ characters) in production.");
  }
  devSecret ??= randomBytes(32).toString("hex");
  return devSecret;
}

/** Throws if the signing secret is missing in production. Call before side effects. */
export function assertTokenConfigured() {
  secret();
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function issueToken(): string {
  const payload = `${Math.floor(Date.now() / 1000) + BROCHURE_TTL_SECONDS}.${randomBytes(8).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = Buffer.from(token.slice(i + 1));
  let expected: Buffer;
  try {
    expected = Buffer.from(sign(payload));
  } catch {
    return false;
  }
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return false;
  const exp = Number(payload.split(".")[0]);
  return Number.isFinite(exp) && exp > Date.now() / 1000;
}
