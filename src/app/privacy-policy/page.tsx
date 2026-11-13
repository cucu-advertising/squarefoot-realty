import type { Metadata } from "next";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Square website collects and uses the details you share through the enquiry and brochure forms.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <div className="page legal">
      <section className="page-hero page-hero--legal">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="display-1" data-split>Privacy policy</h1>
          <p className="page-hero__text">Last updated: 13 November 2026</p>
        </div>
      </section>
      <article className="wrap legal__body">
        <p>
          This policy explains how personal information shared through this website for <strong>The Square</strong> (the “Project”), promoted by{" "}
          {contact.promoter} and Squarefoot Realty (together, “we”), is collected and used. It is written to reflect the Digital Personal Data
          Protection Act, 2023.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Details you enter in the enquiry or brochure form: name, email address, mobile number, residence type of interest, preferred visit time and message.</li>
          <li>The page you submitted from, the date and time of submission and your browser type, recorded with your enquiry.</li>
          <li>Your IP address, used briefly and in memory only to prevent spam and abuse of the form.</li>
        </ul>

        <h2>Why we use it</h2>
        <ul>
          <li>To respond to your enquiry by phone, WhatsApp or email, share project information and arrange site visits.</li>
          <li>To give you access to the project brochure.</li>
        </ul>
        <p>We rely on the consent you give by ticking the consent box. We do not sell your information.</p>

        <h2>Who receives it</h2>
        <p>
          Your enquiry is delivered by email to the Project’s sales team and, if configured, to the Project’s customer-relationship system. Our email
          and hosting service providers process it on our behalf.
        </p>

        <h2>Cookies</h2>
        <p>
          After you submit the form, we set one strictly necessary cookie (<code>tsq_brochure</code>) for up to 7 days so you can download the brochure
          without filling in the form again. It holds no personal information. The website does not use advertising or analytics cookies.
        </p>

        <h2>How long we keep it</h2>
        <p>We keep enquiry details only as long as needed to respond to you and for related follow-up, unless the law requires longer retention.</p>

        <h2>Your rights</h2>
        <p>
          You may ask to access, correct or erase your information, or withdraw consent to being contacted, by writing to{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> or calling <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.
        </p>

        <h2>Contact</h2>
        <address>
          {contact.promoter}
          <br />
          {contact.addressLines.join(", ")}
        </address>

        <p className="legal__note">This policy should be reviewed by the promoters’ legal counsel before launch.</p>
      </article>
    </div>
  );
}
