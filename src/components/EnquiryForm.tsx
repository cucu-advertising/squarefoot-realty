"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { enquiryOptions } from "@/lib/projects";
import { validateEnquiry, type EnquiryKind, type FieldErrors } from "@/lib/validation";

export interface EnquirySuccess {
  ok: true;
  id: string;
  downloadUrl?: string;
  projectName?: string;
}

interface Props {
  kind: EnquiryKind;
  project?: string;
  lockProject?: boolean;
  showMessage?: boolean;
  showVisitTime?: boolean;
  source: string;
  submitLabel: string;
  dark?: boolean;
  onSuccess: (r: EnquirySuccess) => void;
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function EnquiryForm({
  kind,
  project = "",
  lockProject,
  showMessage,
  showVisitTime,
  source,
  submitLabel,
  dark,
  onSuccess,
}: Props) {
  const uid = useId();
  const [values, setValues] = useState({ name: "", email: "", phone: "", project, message: "", visitTime: "", consent: false, company: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(Date.now());
  const submissionId = useRef(newId());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => setValues((v) => ({ ...v, project })), [project]);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setValues((v) => ({ ...v, [k]: value }));
    if (errors[k as keyof FieldErrors]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const check = validateEnquiry({ ...values, kind });
    if (!check.ok) {
      setErrors(check.errors);
      const first = Object.keys(check.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          kind,
          source,
          page: window.location.pathname,
          startedAt: startedAt.current,
          submissionId: submissionId.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.fields) setErrors(data.fields);
        setServerError(data.error ?? "Something went wrong. Please try again or call us directly.");
        setStatus("error");
        submissionId.current = newId();
        return;
      }
      setStatus("idle");
      onSuccess(data as EnquirySuccess);
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
      submissionId.current = newId();
    }
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <span className="field__error" id={`${uid}-${k}-err`} role="alert">
        {errors[k]}
      </span>
    ) : null;
  const a11y = (k: keyof FieldErrors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });

  const sending = status === "sending";

  return (
    <form ref={formRef} className={`form ${dark ? "on-dark" : ""}`} onSubmit={submit} noValidate aria-busy={sending}>
      <div className={`field ${errors.name ? "has-error" : ""}`}>
        <label htmlFor={`${uid}-name`}>
          Full name <span className="req" aria-hidden>*</span>
        </label>
        <input id={`${uid}-name`} name="name" autoComplete="name" placeholder="Your name" required value={values.name} onChange={set("name")} {...a11y("name")} />
        {err("name")}
      </div>
      <div className="form__row">
        <div className={`field ${errors.phone ? "has-error" : ""}`}>
          <label htmlFor={`${uid}-phone`}>
            Mobile number <span className="req" aria-hidden>*</span>
          </label>
          <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="We will call or WhatsApp you" required value={values.phone} onChange={set("phone")} {...a11y("phone")} />
          {err("phone")}
        </div>
        <div className={`field ${errors.email ? "has-error" : ""}`}>
          <label htmlFor={`${uid}-email`}>
            Email <span className="req" aria-hidden>*</span>
          </label>
          <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required value={values.email} onChange={set("email")} {...a11y("email")} />
          {err("email")}
        </div>
      </div>
      {!lockProject && (
        <div className={`field ${errors.project ? "has-error" : ""}`}>
          <label htmlFor={`${uid}-project`}>
            I am interested in <span className="req" aria-hidden>*</span>
          </label>
          <select id={`${uid}-project`} name="project" required value={values.project} onChange={set("project")} {...a11y("project")}>
            <option value="" disabled>
              Choose one
            </option>
            {enquiryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err("project")}
        </div>
      )}
      {showVisitTime && (
        <div className="field">
          <label htmlFor={`${uid}-visit`}>Preferred visit time</label>
          <input id={`${uid}-visit`} name="visitTime" placeholder="Weekday or weekend, morning or evening" value={values.visitTime} onChange={set("visitTime")} />
        </div>
      )}
      {showMessage && (
        <div className="field">
          <label htmlFor={`${uid}-message`}>Message</label>
          <textarea id={`${uid}-message`} name="message" placeholder="Tell us what you have in mind" value={values.message} onChange={set("message")} maxLength={1500} />
        </div>
      )}
      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
      </div>
      <div className={`field ${errors.consent ? "has-error" : ""}`}>
        <label className="check" htmlFor={`${uid}-consent`}>
          <input id={`${uid}-consent`} name="consent" type="checkbox" checked={values.consent} onChange={set("consent")} {...a11y("consent")} />
          <span className="check__box" aria-hidden>
            <svg viewBox="0 0 12 10">
              <path d="M1 5l3.5 3.5L11 1" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <span>
            I agree to be contacted by Squarefoot Realty about my enquiry, and I have read the{" "}
            <Link href="/privacy" target="_blank">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {err("consent")}
      </div>
      {status === "error" && serverError && (
        <p className="form__status" role="alert">
          {serverError}
        </p>
      )}
      <div>
        <button type="submit" className={`pill pill--block ${dark ? "pill--light" : ""}`} disabled={sending}>
          {sending ? (
            <>
              <span className="spinner" aria-hidden /> Sending…
            </>
          ) : (
            <>
              {submitLabel} <span className="arr" aria-hidden>{kind === "brochure" ? "↓" : "↗"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
