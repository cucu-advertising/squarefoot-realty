import "server-only";
import type { EnquiryInput } from "./validation";
import { contact, site } from "@/content/site";

export interface Lead extends EnquiryInput {
  submittedAt: string; // ISO
  submittedAtIST: string;
  page: string;
  userAgent: string;
}

export class DeliveryNotConfigured extends Error {}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function rows(lead: Lead): [string, string][] {
  return [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Mobile", lead.phone],
    ["Residence type", lead.configuration || "Not specified"],
    ["Preferred visit time", lead.visitTime || "—"],
    ["Message", lead.message || "—"],
    ["Enquiry source", lead.source],
    ["Submitted", `${lead.submittedAtIST} IST (${lead.submittedAt})`],
    ["Page", lead.page || "—"],
    ["Consent to contact", lead.consent ? "Yes" : "No"],
  ];
}

export function renderEmail(lead: Lead) {
  const subject = `New enquiry — ${site.name} — ${lead.source} — ${lead.name}`;
  const text = rows(lead).map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#f5f3ec;font-family:Arial,Helvetica,sans-serif;color:#171a14">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #e3dfd3">
<tr><td style="background:#1c2418;color:#fff;padding:20px 24px;font-size:13px;letter-spacing:.16em;text-transform:uppercase">${esc(site.name)} · New enquiry</td></tr>
<tr><td style="padding:8px 24px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
${rows(lead)
  .map(
    ([k, v]) =>
      `<tr><td style="padding:10px 12px 10px 0;border-bottom:1px solid #eee;color:#6b6f63;width:170px;vertical-align:top">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`,
  )
  .join("")}
</table>
<p style="font-size:12px;color:#6b6f63;margin:20px 0 0">Reply to this email to respond directly to ${esc(lead.name)}.</p>
</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}

function recipients() {
  const to = (process.env.ENQUIRY_TO || contact.email).split(",").map((s) => s.trim()).filter(Boolean);
  const cc = (process.env.ENQUIRY_CC || "").split(",").map((s) => s.trim()).filter(Boolean);
  return { to, cc };
}

async function sendResend(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  if (!key || !from) throw new DeliveryNotConfigured("RESEND_API_KEY and ENQUIRY_FROM are required.");
  const { subject, text, html } = renderEmail(lead);
  const { to, cc } = recipients();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, cc: cc.length ? cc : undefined, reply_to: lead.email, subject, text, html }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Resend rejected the message: ${res.status} ${await res.text().catch(() => "")}`);
}

async function sendSmtp(lead: Lead) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, ENQUIRY_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ENQUIRY_FROM)
    throw new DeliveryNotConfigured("SMTP_HOST, SMTP_USER, SMTP_PASS and ENQUIRY_FROM are required.");
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: (SMTP_SECURE ?? "true") !== "false",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 15000,
  });
  const { subject, text, html } = renderEmail(lead);
  const { to, cc } = recipients();
  await transport.sendMail({ from: ENQUIRY_FROM, to, cc, replyTo: lead.email, subject, text, html });
}

async function sendWebhook(lead: Lead) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CRM_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_SECRET}` } : {}),
    },
    body: JSON.stringify({ project: site.name, ...lead }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`CRM webhook failed: ${res.status}`);
  return true;
}

/**
 * Delivers a lead. Resolves only when every configured channel has accepted it;
 * throws otherwise so the API never reports a success that did not happen.
 */
export async function deliverLead(lead: Lead): Promise<{ channels: string[] }> {
  const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase();
  const channels: string[] = [];
  const jobs: Promise<unknown>[] = [];

  if (provider === "resend") jobs.push(sendResend(lead).then(() => channels.push("email:resend")));
  else if (provider === "smtp") jobs.push(sendSmtp(lead).then(() => channels.push("email:smtp")));
  else if (provider === "console") {
    if (process.env.NODE_ENV === "production")
      throw new DeliveryNotConfigured("EMAIL_PROVIDER=console is not allowed in production.");
    console.info("[enquiry:console]", JSON.stringify(lead, null, 2));
    channels.push("console");
  }

  if (process.env.CRM_WEBHOOK_URL) jobs.push(sendWebhook(lead).then(() => channels.push("crm")));

  await Promise.all(jobs);
  if (!channels.length) throw new DeliveryNotConfigured("No email provider or CRM webhook is configured.");
  return { channels };
}
