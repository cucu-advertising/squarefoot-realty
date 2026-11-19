import "server-only";
import crypto from "node:crypto";

/**
 * HMAC-signed, expiring tokens for brochure access.
 *  - Download token: one project, short-lived (15 min), returned after a successful enquiry.
 *  - Access cookie: list of unlocked projects for the visitor's session (12 h), httpOnly.
 */
export const DOWNLOAD_TTL_S = 15 * 60;
export const ACCESS_TTL_S = 12 * 60 * 60;
export const ACCESS_COOKIE = "sf_brochure_access";

let warned = false;
function secret() {
  const s = process.env.BROCHURE_TOKEN_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("BROCHURE_TOKEN_SECRET must be set (16+ chars) in production.");
  }
  if (!warned) {
    console.warn("[brochure] BROCHURE_TOKEN_SECRET not set; using an insecure development secret.");
    warned = true;
  }
  return "dev-only-insecure-secret-change-me";
}

const b64 = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const sign = (data: string) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");

export function createToken(payload: Record<string, unknown>, ttlSeconds: number) {
  const body = b64(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  return `${body}.${sign(body)}`;
}

export function verifyToken<T extends Record<string, unknown>>(token: string | undefined | null): (T & { exp: number }) | null {
  if (!token || typeof token !== "string") return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

export function unlockedFromCookie(cookie: string | undefined): string[] {
  const data = verifyToken<{ projects: string[] }>(cookie);
  return Array.isArray(data?.projects) ? data!.projects : [];
}
