"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { contact, projectOptions, type ProjectId } from "@/content/site";
import { validateEnquiry, type EnquiryInput, type EnquirySource, type FieldErrors } from "@/lib/validation";
import { brochureHref, useEnquiry } from "./EnquiryProvider";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  project?: ProjectId;
  source: EnquirySource;
  intent?: "enquiry" | "brochure";
  defaultConfiguration?: string;
  compact?: boolean;
  idPrefix?: string;
}

export default function EnquiryForm({ project = "the-square", source, intent = "enquiry", defaultConfiguration = "", compact = false, idPrefix = "f" }: Props) {
  const { markUnlocked } = useEnquiry();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    configuration: defaultConfiguration,
    visitTime: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const id = (n: string) => `${idPrefix}-${n}`;

  const data = (): EnquiryInput => ({ ...values, source, project });
  const meta = projectOptions[project];

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
  };

  // Re-validate touched fields as the user types
  useEffect(() => {
    const all = validateEnquiry(data());
    setErrors((prev) => {
      const next: FieldErrors = {};
      for (const k of Object.keys(all) as (keyof FieldErrors)[]) if (touched[k]) next[k] = all[k];
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, touched]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const all = validateEnquiry(data());
    setTouched({ name: true, email: true, phone: true, configuration: true, message: true, consent: true });
    setErrors(all);
    if (Object.keys(all).length) {
      const first = Object.keys(all)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    setServerError("");
    try {
      const fd = new FormData(formRef.current!);
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          ...data(),
          website: fd.get("website") ?? "",
          startedAt: startedAt.current,
          page: window.location.pathname + window.location.hash,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        setServerError(json.error || "Something went wrong. Please try again or call us directly.");
        setStatus("error");
        return;
      }
      markUnlocked();
      setStatus("success");
    } catch {
      setServerError("We couldn’t reach the server. Please check your connection and try again, or call us directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status" aria-live="polite">
        <div className="form-success__check" aria-hidden="true">
          <svg viewBox="0 0 52 52">
            <rect x="2" y="2" width="48" height="48" />
            <path d="M15 27l8 8 15-17" />
          </svg>
        </div>
        <h3 className="form-success__title">Thank you for your interest.</h3>
        <p className="form-success__text">
          We have received your enquiry and will be in touch soon. Explore the project in more detail through our brochure.
        </p>
        <div className="brochure-card">
          <div className="brochure-card__cover">
            <Image
              src={project === "urban-ranch" ? "/images/urban-ranch/villa-cover.jpg" : "/images/brand/brochure-cover.jpg"}
              alt={`Cover of the ${meta.label} brochure`}
              width={project === "urban-ranch" ? 1345 : 864}
              height={project === "urban-ranch" ? 670 : 864}
              sizes="120px"
            />
          </div>
          <div className="brochure-card__meta">
            <p className="brochure-card__name">{meta.label} — Project Brochure</p>
            <p className="brochure-card__info">PDF · {meta.brochure.pages} pages · {meta.brochure.size}</p>
            <a
              href={brochureHref(project)}
              className={`btn btn--solid btn--brochure ${downloaded ? "is-done" : ""}`}
              rel="nofollow"
              onClick={() => setDownloaded(true)}
            >
              <span>{downloaded ? "Download started" : "Download Brochure"}</span>
              <span className="btn__icon btn__icon--down" aria-hidden="true">
                <span>↓</span>
              </span>
            </a>
          </div>
        </div>
        {downloaded && <p className="form-success__hint">If the download didn’t begin, select the button again. Large file — it may take a moment on mobile data.</p>}
      </div>
    );
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p className="field__error" id={id(`${k}-err`)}>
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof FieldErrors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? id(`${k}-err`) : undefined,
  });

  return (
    <form ref={formRef} className={`form ${compact ? "form--compact" : ""}`} onSubmit={onSubmit} noValidate aria-busy={status === "submitting"}>
      <div className="form__grid">
        <div className={`field ${errors.name ? "has-error" : ""}`}>
          <label htmlFor={id("name")}>Full name<span aria-hidden="true">*</span></label>
          <input id={id("name")} name="name" type="text" autoComplete="name" placeholder="Your name" required value={values.name} onChange={set("name")} onBlur={blur("name")} {...aria("name")} />
          {err("name")}
        </div>
        <div className={`field ${errors.phone ? "has-error" : ""}`}>
          <label htmlFor={id("phone")}>Mobile number<span aria-hidden="true">*</span></label>
          <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="We will call or WhatsApp you" required value={values.phone} onChange={set("phone")} onBlur={blur("phone")} {...aria("phone")} />
          {err("phone")}
        </div>
        <div className={`field ${errors.email ? "has-error" : ""}`}>
          <label htmlFor={id("email")}>Email address<span aria-hidden="true">*</span></label>
          <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required value={values.email} onChange={set("email")} onBlur={blur("email")} {...aria("email")} />
          {err("email")}
        </div>
        <div className={`field ${errors.configuration ? "has-error" : ""}`}>
          <label htmlFor={id("configuration")}>Interested in</label>
          <div className="select">
            <select id={id("configuration")} name="configuration" value={values.configuration} onChange={set("configuration")} onBlur={blur("configuration")} {...aria("configuration")}>
              <option value="">Select a residence type</option>
              {meta.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          {err("configuration")}
        </div>
        {!compact && (
          <div className="field field--full">
            <label htmlFor={id("visitTime")}>
              Preferred visit time <span className="field__opt">(optional)</span>
            </label>
            <input id={id("visitTime")} name="visitTime" type="text" placeholder="Weekday or weekend, morning or evening" value={values.visitTime} onChange={set("visitTime")} maxLength={80} />
          </div>
        )}
        <div className={`field field--full ${errors.message ? "has-error" : ""}`}>
          <label htmlFor={id("message")}>
            Message <span className="field__opt">(optional)</span>
          </label>
          <textarea id={id("message")} name="message" rows={compact ? 2 : 4} placeholder="Tell us what you have in mind" value={values.message} onChange={set("message")} onBlur={blur("message")} maxLength={1000} {...aria("message")} />
          {err("message")}
        </div>
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`consent ${errors.consent ? "has-error" : ""}`}>
        <input id={id("consent")} name="consent" type="checkbox" checked={values.consent} onChange={set("consent")} onBlur={blur("consent")} {...aria("consent")} />
        <label htmlFor={id("consent")}>
          I agree to be contacted about my enquiry by phone, WhatsApp or email, and I have read the{" "}
          <Link href="/privacy-policy" target="_blank">
            privacy policy
          </Link>
          .
        </label>
        {err("consent")}
      </div>

      {status === "error" && serverError && (
        <div className="form__alert" role="alert">
          <p>{serverError}</p>
          <p>
            Call <a href={contact.phoneHref}>{contact.phoneDisplay}</a> or email <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </div>
      )}

      <div className="form__actions">
        <button type="submit" className="btn btn--solid btn--lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span>Sending…</span>
            </>
          ) : (
            <>
              <span>{intent === "brochure" ? "Submit & Get Brochure" : "Submit Enquiry"}</span>
              <span className="btn__icon btn__icon--ne" aria-hidden="true"><span>↗</span></span>
            </>
          )}
        </button>
        <p className="form__note">
          {intent === "brochure"
            ? "Your brochure download appears as soon as your details are received."
            : "After you submit, you can download the project brochure."}
        </p>
      </div>
    </form>
  );
}
