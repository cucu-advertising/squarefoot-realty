import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Squarefoot Realty",
  description: "How Squarefoot Realty collects and uses the details you share through this website.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <section className="section s-sand" data-head="light" style={{ paddingTop: "calc(var(--header-h) + var(--section-y))" }}>
      <div className="container">
        <span className="label label--dot">Legal</span>
        <h1 className="t-display" style={{ margin: "var(--sp-3) 0 var(--sp-6)" }}>
          Privacy policy.
        </h1>
        <div className="prose">
          <p>
            This notice explains how Squarefoot Realty (&quot;we&quot;) handles the personal details you share through this website. It should be
            reviewed by the company&apos;s legal advisor before publication.
          </p>
          <h2>What we collect</h2>
          <ul>
            <li>Your name, email address and mobile number, and the project you are interested in.</li>
            <li>Anything you choose to write in a message, and a preferred visit time if you give one.</li>
            <li>Technical details needed to protect the form from abuse: IP address, browser type and the time of submission.</li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To respond to your enquiry, share project details and arrange site visits.</li>
            <li>To contact you by phone, WhatsApp or email about the project you enquired about.</li>
          </ul>
          <p>We do not sell your details. We share them only with staff and service providers who help us respond to you.</p>
          <h2>Your choices</h2>
          <p>
            You can ask us to update or delete your details, or to stop contacting you, at any time
            {site.contact.email ? (
              <>
                {" "}by writing to <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </>
            ) : (
              " through the contact page"
            )}
            .
          </p>
          <h2>Cookies</h2>
          <p>
            We do not use tracking or advertising cookies. Maps load from Google only when you choose to load them.
          </p>
        </div>
      </div>
    </section>
  );
}
