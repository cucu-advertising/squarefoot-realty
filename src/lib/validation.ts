import { enquiryOptionValues } from "./projects";

export type EnquiryKind = "brochure" | "contact" | "interest";

export interface EnquiryInput {
  kind: EnquiryKind;
  name: string;
  email: string;
  phone: string;
  project: string;
  message?: string;
  visitTime?: string;
  consent: boolean;
  source: string;
}

export type FieldErrors = Partial<Record<"name" | "email" | "phone" | "project" | "consent" | "message" | "visitTime", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Indian mobile (10 digits starting 6–9, optional +91/0), or international 8–15 digits with leading +. */
export function normalisePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (/^(?:91|0)?[6-9]\d{9}$/.test(digits) && !trimmed.startsWith("+") ) return "+91" + digits.slice(-10);
  if (trimmed.startsWith("+91") && /^91[6-9]\d{9}$/.test(digits)) return "+" + digits;
  if (trimmed.startsWith("+") && !trimmed.startsWith("+91") && digits.length >= 8 && digits.length <= 15) return "+" + digits;
  return null;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

export function validateEnquiry(body: Record<string, unknown>):
  | { ok: true; data: EnquiryInput }
  | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const kind = (["brochure", "contact", "interest"] as const).includes(body.kind as EnquiryKind)
    ? (body.kind as EnquiryKind)
    : "contact";
  const name = clean(body.name, 80);
  const email = clean(body.email, 120).toLowerCase();
  const phoneRaw = clean(body.phone, 24);
  const project = clean(body.project, 40);
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1500) : "";
  const visitTime = clean(body.visitTime, 80);
  const consent = body.consent === true;
  const source = clean(body.source, 120) || "website";

  if (name.length < 2 || !/^[\p{L}][\p{L} .'-]*$/u.test(name)) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  const phone = normalisePhone(phoneRaw);
  if (!phone) errors.phone = "Please enter a valid mobile number.";
  if (!enquiryOptionValues.has(project)) errors.project = "Please choose a project.";
  if (!consent) errors.consent = "Please confirm we may contact you.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { kind, name, email, phone: phone!, project, message: message || undefined, visitTime: visitTime || undefined, consent, source },
  };
}
