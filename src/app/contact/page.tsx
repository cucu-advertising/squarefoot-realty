import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import { contact, location, rera } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact & Enquiry",
  description:
    "Enquire about The Square luxury villas at Kongara Kalan Road, Adibatla, Hyderabad, and download the project brochure. Call +91 9121 777 777 or email info@irarealty.in.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ brochure?: string }> }) {
  const { brochure } = await searchParams;
  const wantsBrochure = brochure === "1";
  return (
    <div className="page page--contact">
      <section className="page-hero page-hero--contact">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h1 className="display-1" data-split>
            Let’s find <em>your place.</em>
          </h1>
          <p className="page-hero__text">
            Whether you are buying, investing or just starting to look, we would like to hear from you. Share a few details and our team will get back
            to you shortly. Better still, come see The Square for yourself.
          </p>
        </div>
      </section>

      <section className="contact section" aria-label="Enquiry form and contact details">
        <div className="wrap contact__grid">
          <div className="contact__form" id="enquire">
            <h2 className="display-3">{wantsBrochure ? "Download the brochure" : "Send an enquiry"}</h2>
            <p className="contact__lede">
              {wantsBrochure
                ? "The brochure is shared with visitors who leave their contact details. Submit the form and your download will be ready immediately."
                : "Fields marked * are required. After submitting, you can download the project brochure straight away."}
            </p>
            <EnquiryForm source={wantsBrochure ? "Brochure Request" : "Contact Page"} intent={wantsBrochure ? "brochure" : "enquiry"} idPrefix="contact" />
          </div>

          <aside className="contact__card" aria-label="Contact details">
            <div className="contact__block">
              <h2 className="contact__h">Call</h2>
              <a href={contact.phoneHref} className="contact__big">{contact.phoneDisplay}</a>
            </div>
            <div className="contact__block">
              <h2 className="contact__h">Email</h2>
              <a href={`mailto:${contact.email}`} className="contact__big">{contact.email}</a>
            </div>
            <div className="contact__block">
              <h2 className="contact__h">Office</h2>
              <address>
                <strong>{contact.promoter}</strong>
                {contact.addressLines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
            </div>
            <div className="contact__block">
              <h2 className="contact__h">Project site</h2>
              <address>
                <strong>The Square</strong>
                <span>{location.full}</span>
              </address>
              <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-btn">
                Get directions ↗
              </a>
            </div>
            <p className="contact__rera">TS RERA No. {rera.number}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
