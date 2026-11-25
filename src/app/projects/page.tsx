import type { Metadata } from "next";
import Hero from "@/components/Hero";
import OurProjects from "@/components/OurProjects";
import DeliveredReel from "@/components/DeliveredReel";
import Closing from "@/components/Closing";
import { EnquireButton } from "@/components/Enquiry";
import { TLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Projects in Hyderabad | Squarefoot Realty",
  description: "Explore The Square, The Urban Ranch and Squarefoot Origin near the Outer Ring Road, plus our delivered projects.",
  alternates: { canonical: "/projects" },
};

/** Same structure as the home page: hero → our projects (sideways row) → delivered (reel) → closing. */
export default function ProjectsPage() {
  return (
    <>
      <Hero
        image={{ src: "/images/the-square/masterplan-aerial.jpg", width: 3840, height: 2160, alt: "Aerial view of The Square beside the Outer Ring Road" }}
        position="50% 55%"
        mobilePosition="40% 55%"
        label="Projects · Hyderabad"
        title="Places designed to be lived in."
        links={
          <>
            <TLink href="#list">Now unfolding</TLink>
            <EnquireButton className="tlink" source="projects-hero" icon="">
              <span className="tlink__t">Enquire now</span>
              <span className="tlink__a" aria-hidden>
                →
              </span>
            </EnquireButton>
          </>
        }
        meta={["03 now unfolding", "04 delivered with OC", <a key="s" href="#list">Scroll ↓</a>]}
        caption="Each project begins with one question: how will people live here?"
      />

      {/* 02 — Now unfolding, side by side */}
      <OurProjects id="list" curtain label="Now unfolding" title="Three communities, one corridor." />

      {/* 03 — Delivered */}
      <DeliveredReel
        id="delivered"
        intro={
          <>
            <span className="label label--dot">Delivered · OC received</span>
            <h2 className="t-display" data-split>
              Finished, not just promised.
            </h2>
            <p className="t-lead muted measure">Families live in these homes today. A series of layout and plotting ventures completes the record.</p>
            <TLink href="/about">Our story</TLink>
          </>
        }
      />

      {/* 04 — Closing */}
      <Closing image={{ src: "/images/the-urban-ranch/aerial-dusk.jpg", width: 3840, height: 2143, alt: "The Urban Ranch at dusk" }}>
        <span className="label">Get in touch</span>
        <div className="closing__row" style={{ marginTop: "var(--sp-2)" }}>
          <div>
            <h2 className="t-hero">Find the one that fits.</h2>
            <p className="t-lead" style={{ marginTop: "var(--sp-2)", maxWidth: "40ch", opacity: 0.88 }}>
              Tell us what you are looking for and our team will walk you through the options.
            </p>
          </div>
          <div className="btn-row">
            <EnquireButton className="pill pill--red" source="projects-closing">
              Enquire now
            </EnquireButton>
          </div>
        </div>
      </Closing>
    </>
  );
}
