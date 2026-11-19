import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { EnquiryInput } from "./validation";
import { enquiryOptions } from "./projects";

export interface Lead extends EnquiryInput {
  id: string;
  timestamp: string;
  consentText: string;
  consentAt: string;
  ip?: string;
  userAgent?: string;
  page?: string;
}

export const CONSENT_TEXT =
  "I agree to be contacted by Squarefoot Realty about my enquiry, and I have read the Privacy Policy.";

type Result = { destination: string; ok: boolean; error?: string };

/** Which destinations are configured. A submission is accepted only if at least one of them succeeds. */
export function configuredDestinations() {
  return {
    webhook: Boolean(process.env.LEADS_WEBHOOK_URL),
    email: Boolean(process.env.SMTP_HOST && process.env.LEADS_EMAIL_TO),
    file: (process.env.LEADS_FILE_STORE ?? "on") !== "off",
  };
}

async function toWebhook(lead: Lead): Promise<Result> {
  const url = process.env.LEADS_WEBHOOK_URL!;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.LEADS_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.LEADS_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    return { destination: "webhook", ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { destination: "webhook", ok: false, error: (e as Error).message };
  }
}

async function toEmail(lead: Lead): Promise<Result> {
  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    const projectLabel = enquiryOptions.find((o) => o.value === lead.project)?.label ?? lead.project;
    const kind = lead.kind === "brochure" ? "Brochure download" : lead.kind === "interest" ? "Register interest" : "Enquiry";
    const lines = [
      `Type: ${kind}`,
      `Project: ${projectLabel}`,
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Mobile: ${lead.phone}`,
      lead.visitTime ? `Preferred visit: ${lead.visitTime}` : "",
      lead.message ? `Message: ${lead.message}` : "",
      `Source: ${lead.source}${lead.page ? ` (${lead.page})` : ""}`,
      `Time: ${lead.timestamp}`,
      `Consent: yes — "${lead.consentText}" at ${lead.consentAt}`,
      `Lead ID: ${lead.id}`,
    ].filter(Boolean);
    await transport.sendMail({
      from: process.env.LEADS_EMAIL_FROM ?? process.env.SMTP_USER,
      to: process.env.LEADS_EMAIL_TO,
      replyTo: lead.email,
      subject: `${kind}: ${projectLabel} — ${lead.name}`,
      text: lines.join("\n"),
    });
    return { destination: "email", ok: true };
  } catch (e) {
    return { destination: "email", ok: false, error: (e as Error).message };
  }
}

async function toFile(lead: Lead): Promise<Result> {
  try {
    const file = path.resolve(/*turbopackIgnore: true*/ process.env.LEADS_FILE ?? "./data/leads.jsonl");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.appendFile(file, JSON.stringify(lead) + "\n", "utf8");
    return { destination: "file", ok: true };
  } catch (e) {
    return { destination: "file", ok: false, error: (e as Error).message };
  }
}

export async function deliverLead(lead: Lead) {
  const c = configuredDestinations();
  const jobs: Promise<Result>[] = [];
  if (c.webhook) jobs.push(toWebhook(lead));
  if (c.email) jobs.push(toEmail(lead));
  if (c.file) jobs.push(toFile(lead));
  const results = await Promise.all(jobs);
  for (const r of results) if (!r.ok) console.error(`[leads] ${r.destination} failed for ${lead.id}: ${r.error}`);
  return { accepted: results.some((r) => r.ok), results };
}
