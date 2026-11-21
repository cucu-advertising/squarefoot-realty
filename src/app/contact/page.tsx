import Image from "next/image";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";
import { site, telHref, waHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Squarefoot Realty | Hyderabad",
  description: "Get in touch to enquire or book a site visit at Squarefoot Origin. We reply promptly.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const c = site.contact;
  return (
    <>
      <Hero
        image={{ src: "/images/the-square/clubhouse.jpg", width: 4000, height: 2250, alt: "The Square clubhouse" }}
        position="50% 40%"
        mobilePosition="62% 50%"
        label="Contact"
        title="Let's find your place."
        meta={["Buying", "Investing", "Just starting to look", <a key="s" href="#form">Write to us ↓</a>]}
        caption="Share a few details and our team will get back to you shortly."
      />
      <section id="form" className="section s-sand curtain" data-head="light" aria-label="Enquiry form and contact details">
        <div className="container contact">
          <div className="contact__form" data-reveal="fade">
            <ContactForm />
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
            <figure className="contact__img">
              <Image src="/images/the-square/terrace-view.jpg" alt="Gardens seen from a villa terrace at The Square" fill sizes="(max-width: 899px) 100vw, 30vw" quality={75} />
              <figcaption>Come see it for yourself</figcaption>
            </figure>
          </aside>
        </div>
      </section>
    </>
  );
}
