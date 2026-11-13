import type { Metadata } from "next";
import { brochureDisclaimer, rera, contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Disclaimer",
  description: "RERA registration, project disclaimer and website terms for The Square by Squarefoot Realty.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="page legal">
      <section className="page-hero page-hero--legal">
        <div className="wrap">
          <p className="eyebrow">Legal</p>
          <h1 className="display-1" data-split>Terms &amp; disclaimer</h1>
        </div>
      </section>
      <article className="wrap legal__body">
        <h2>RERA registration</h2>
        <p>
          <strong>TS RERA No. {rera.number}</strong>. The project brochure describes The Square as an “{rera.approvals}”. Registration details can be
          verified on the {rera.authority} portal at{" "}
          <a href={rera.portal} target="_blank" rel="noopener noreferrer">
            rerait.telangana.gov.in
          </a>
          .
        </p>

        <h2>Promoters</h2>
        <p>
          As stated in the project brochure, The Square is promoted by {contact.promoter} and Squarefoot Realty.
        </p>

        <h2>Project disclaimer (from the project brochure)</h2>
        <p>{brochureDisclaimer}</p>

        <h2>Website terms</h2>
        <ul>
          <li>The contents of this website are for information only and do not form an offer, contract or agreement of any kind.</li>
          <li>All images, renders, plans and maps are artist’s impressions or illustrations taken from the project brochure. Plans and maps are not to scale.</li>
          <li>Drive times are approximate, depend on traffic and route, and are reproduced as stated in the project brochure.</li>
          <li>Specifications, amenities and layouts are subject to change by the promoters and to approvals by the competent authorities.</li>
          <li>Prospective buyers should rely only on the sale agreement and the details registered with TS RERA before making a decision.</li>
        </ul>
      </article>
    </div>
  );
}
