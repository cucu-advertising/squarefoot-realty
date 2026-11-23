import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site, telHref, waHref } from "@/lib/site";
import { enquiryOptionValues } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact Squarefoot Realty | Hyderabad",
  description: "Enquire about Squarefoot Realty projects or book a site visit. Our team replies promptly.",
  alternates: { canonical: "/contact" },
};

export default async function Contact({ searchParams }: { searchParams: Promise<{ project?: string | string[] }> }) {
  const c = site.contact;
  const q = (await searchParams).project;
  const project = typeof q === "string" && enquiryOptionValues.has(q) ? q : "";
  return (
    <>
      <section id="form" className="section s-sand contact-page" data-head="light" aria-labelledby="contact-title">
        <div className="container contact__head">
          <span className="label label--dot">Contact us</span>
          <h1 id="contact-title" className="t-display" style={{ marginTop: "var(--sp-2)" }}>
            Let&apos;s talk.
          </h1>
          <p className="t-lead muted measure" style={{ marginTop: "var(--sp-2)" }}>
            Share a few details and our team will get back to you shortly.
          </p>
        </div>
        <div className="container contact">
          <div className="contact__form" data-reveal="fade">
            <ContactForm project={project} />
          </div>
          <aside className="contact__aside" aria-label="Contact details" data-reveal="fade" data-delay="0.1">
            <dl>
              <div>
                <dt>Office</dt>
                <dd style={{ whiteSpace: "pre-line" }}>{c.office ?? "Hyderabad, Telangana"}</dd>
              </div>
              {c.siteOffice && (
                <div>
                  <dt>Site office · Squarefoot Origin</dt>
                  <dd style={{ whiteSpace: "pre-line" }}>{c.siteOffice}</dd>
                </div>
              )}
              {c.phone && (
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={telHref(c.phone)}>{c.phone}</a>
                  </dd>
                </div>
              )}
              {c.email && (
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </dd>
                </div>
              )}
              {c.hours && (
                <div>
                  <dt>Hours</dt>
                  <dd>{c.hours}</dd>
                </div>
              )}
            </dl>
            {c.whatsapp && (
              <a className="pill pill--ghost" href={waHref(c.whatsapp)} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp <span className="arr" aria-hidden>↗</span>
              </a>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
