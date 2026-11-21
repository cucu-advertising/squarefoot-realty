"use client";

import { useState } from "react";
import EnquiryForm from "./EnquiryForm";
import { Mark } from "./Logo";

export default function ContactForm() {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div className="success" role="status">
        <Mark className="success__mark" />
        <h2 className="modal__title">Thank you.</h2>
        <p className="t-lead muted">We have received your enquiry and will be in touch soon.</p>
        <button type="button" className="pill pill--ghost" onClick={() => setDone(false)}>
          Send another enquiry
        </button>
      </div>
    );
  }
  return (
    <>
      <h2 className="modal__title" style={{ marginBottom: "var(--sp-4)" }}>
        Send an enquiry
      </h2>
      <EnquiryForm kind="contact" showMessage showVisitTime source="contact-page" submitLabel="Send enquiry" onSuccess={() => setDone(true)} />
    </>
  );
}
