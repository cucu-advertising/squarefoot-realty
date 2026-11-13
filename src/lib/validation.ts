import { configurationOptions } from "@/content/site";

/** Shared between the browser (instant feedback) and the API route (authoritative). */

export const ENQUIRY_SOURCES = [
  "Contact Page",
  "Brochure Request",
  "Residences",
  "Home Page",
] as const;
export type EnquirySource = (typeof ENQUIRY_SOURCES)[number];

export interface EnquiryInput {
  name: string;
  email: string;
  phone: string;
  configuration: string;
  visitTime: string;
  message: string;
  consent: boolean;
  source: EnquirySource;
}

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

export function normalisePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return (plus ? "+" : "") + digits;
}

export function isValidPhone(raw: string): boolean {
  const p = normalisePhone(raw);
  // Indian mobile: 10 digits starting 6–9, optionally prefixed +91 / 91 / 0
  if (/^(\+?91|0)?[6-9]\d{9}$/.test(p)) return true;
  // International: + followed by 8–15 digits
  return /^\+[1-9]\d{7,14}$/.test(p);
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max) : "";

export function parseEnquiry(body: Record<string, unknown>): { data: EnquiryInput; errors: FieldErrors } {
  const data: EnquiryInput = {
    name: clean(body.name, 80),
    email: clean(body.email, 120).toLowerCase(),
    phone: clean(body.phone, 24),
    configuration: clean(body.configuration, 60),
    visitTime: clean(body.visitTime, 80),
    message: clean(body.message, 1200),
    consent: body.consent === true || body.consent === "true" || body.consent === "on",
    source: (ENQUIRY_SOURCES as readonly string[]).includes(body.source as string)
      ? (body.source as EnquirySource)
      : "Contact Page",
  };
  return { data, errors: validateEnquiry(data) };
}

export function validateEnquiry(d: EnquiryInput): FieldErrors {
  const e: FieldErrors = {};
  if (d.name.length < 2) e.name = "Please enter your full name.";
  else if (!/^[\p{L}\p{M}.'\- ]+$/u.test(d.name)) e.name = "Please use letters only in your name.";
  if (!d.email) e.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(d.email)) e.email = "Please enter a valid email address, e.g. name@example.com.";
  if (!d.phone) e.phone = "Please enter your mobile number.";
  else if (!isValidPhone(d.phone)) e.phone = "Please enter a valid 10-digit mobile number (or include your country code).";
  if (d.configuration && !(configurationOptions as readonly string[]).includes(d.configuration))
    e.configuration = "Please choose an option from the list.";
  if (d.message.length > 1000) e.message = "Please keep your message under 1,000 characters.";
  if (!d.consent) e.consent = "Please confirm that we may contact you about your enquiry.";
  return e;
}
