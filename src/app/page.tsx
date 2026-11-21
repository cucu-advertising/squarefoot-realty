import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EnquireButton } from "@/components/Enquiry";
import { Mark } from "@/components/Logo";
import { TLink } from "@/components/ui";
import Hero from "@/components/Hero";
import Collage from "@/components/Collage";
import Discover, { type DiscoverItem } from "@/components/Discover";
import Explore from "@/components/Explore";
import HighlightSeq from "@/components/HighlightSeq";
import Reel, { type ReelCard } from "@/components/Reel";
import Closing from "@/components/Closing";
import { getProject, type Img } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Squarefoot Realty | Everything and Beyond",
  description:
    "Squarefoot Realty, formerly Sai Teja Developers, builds villas, apartments and layouts in Hyderabad. Three decades of experience. Explore our projects.",
  alternates: { canonical: "/" },
};

const SQ = "/images/the-square";
const img = (name: string, width: number, height: number, alt: string, caption?: string): Img => ({ src: `${SQ}/${name}.jpg`, width, height, alt, caption });

export default function Home() {
  const origin = getProject("squarefoot-origin")!;
  const square = getProject("the-square")!;
  const ranch = getProject("the-urban-ranch")!;
  const transElite = getProject("trans-elite")!;
  const challa = getProject("challa-elite")!;
  const arcade = getProject("trans-arcade")!;
  const lokeshwari = getProject("lokeshwari-residency")!;

  // Collage: the last image sits on top of the stack and is revealed first.
  const collage: Img[] = [
    img("orr-corridor", 1960, 880, "Aerial view along the Outer Ring Road in Hyderabad's south", "Hyderabad's South"),
    img("villas-dusk", 2178, 1099, "Duplex villas at The Square at dusk", "Villas at dusk"),
    img("skating-rink", 4000, 2250, "Skating rink and cricket net in the park at The Square", "Room to play"),
    img("terrace-view", 3840, 2160, "Landscaped gardens seen from a villa terrace at The Square", "Open to the green"),
  ];

  const discover: DiscoverItem[] = [
    { project: origin, tone: "image", image: { src: "/images/squarefoot-origin/east-row.jpg", alt: "Row of East facing villas at Squarefoot Origin" } },
    { project: square, tone: "image", image: { src: `${SQ}/west-villa-aerial.jpg`, alt: "West facing villa with terrace garden at The Square" } },
    { project: ranch, tone: "ink" },
  ];

  const reel: ReelCard[] = [
    { project: transElite, size: "a", image: { src: "/images/trans-elite/exterior.jpg", alt: "Trans Elite apartments, Adibatla" }, caption: "Adibatla · Apartments" },
    { project: challa, size: "b", image: { src: "/images/challa-elite/elevation-corner.jpg", alt: "Challa Elite apartments, Tukkuguda" }, caption: "Tukkuguda · Apartments" },
    { project: arcade, size: "c", image: { src: "/images/trans-arcade/exterior.jpg", alt: "Commercial building at Adibatla" }, caption: "Adibatla · Commercial" },
    { project: challa, size: "c", image: { src: "/images/challa-elite/elevation-front.jpg", alt: "Challa Elite front elevation" }, caption: "Front elevation" },
    { project: lokeshwari, size: "t", caption: "Habsiguda · Residential" },
  ];

  return (
    <>
      {/* 01 — Immersive hero */}
      <Hero
        image={img("avenue", 3840, 2160, "Tree-lined avenue of duplex villas at The Square")}
        position="50% 42%"
        mobilePosition="58% 50%"
        title={<>Everything and beyond.</>}
        links={
          <>
            <TLink href="/projects">Explore projects</TLink>
            <EnquireButton className="tlink" source="home-hero" icon="">
              <span className="tlink__t">Enquire now</span>
              <span className="tlink__a" aria-hidden>
                →
              </span>
            </EnquireButton>
          </>
        }
        meta={["Squarefoot Realty", "Formerly Sai Teja Developers", "Three decades · Hyderabad", <a key="s" href="#philosophy">Scroll ↓</a>]}
        caption="Living environments that hold everything you need within your walls, and open out to the sky and the green beyond."
      />

      {/* 02 — Brand philosophy */}
      <div id="philosophy">
        <Collage
          label="Our philosophy"
          title="A great home looks beyond its walls."
          line="Open skies, green landscapes and the possibilities of each new morning. That is Everything and Beyond."
          images={collage}
        />
      </div>

      <section className="section s-sand" data-head="light" aria-labelledby="who-title" style={{ paddingTop: "var(--sp-6)" }}>
        <div className="container statement">
          <span className="label label--dot statement__label" data-reveal="fade">
            Who we are
          </span>
          <div className="statement__body">
            <h2 id="who-title" className="t-statement" data-scrub>
              <span className="inline-img" aria-hidden>
                <Image src={`${SQ}/entrance.jpg`} alt="" width={160} height={70} sizes="160px" />
              </span>
              Three decades. One conviction: a building should be as intelligent as it is beautiful.
            </h2>
            <div className="statement__foot" data-reveal="fade">
              <p className="t-lead muted measure">Partners from IIT, ISB and CBIT bring engineering precision and business sense to every home we build.</p>
              <TLink href="/about">About us</TLink>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Project discovery */}
      <Discover items={discover} marquee="Squarefoot Realty — Everything and beyond —" />

      {/* 04 — Architectural exploration (real renders, no invented 3D) */}
      <Explore title="Explore The Square" views={square.explore!} />

      {/* 05 — Signature highlights */}
      <HighlightSeq label="The Square · Signature details" statement="Where every square foot exudes luxury." overline="The Square · 01" items={square.highlights!}>
        <EnquireButton className="pill" mode="brochure" project="the-square" source="home-highlights">
          Download complete brochure
        </EnquireButton>
      </HighlightSeq>

      {/* 06 — Architectural reel: delivered work */}
      <Reel
        intro={
          <>
            <span className="label label--dot">Track record</span>
            <h2 className="t-display" data-split>
              Delivered. Occupied. Trusted.
            </h2>
            <p className="t-lead muted measure">Projects that have received their occupancy certificates, and a series of layout and plotting ventures.</p>
            <TLink href="/projects">All projects</TLink>
          </>
        }
        cards={reel}
      />

      {/* 07 — The developer */}
      <section className="section s-sand" data-head="light" aria-labelledby="dev-title">
        <div className="container brand">
          <div className="brand__mark">
            <Mark title="The Squarefoot square and sun" anim />
          </div>
          <div className="brand__text">
            <span className="label label--dot" data-reveal="fade">
              The developer
            </span>
            <h2 id="dev-title" className="t-display" data-split>
              A square. A sun. A bigger idea of home.
            </h2>
            <p className="t-lead muted measure" data-reveal="fade">
              The square stands for stability, the sun for warmth and optimism. The same discipline and standards, under a new name.
            </p>
            <div className="evo" data-reveal="fade">
              <span>
                <small>We began as</small>Sai Teja Developers
              </span>
              <i aria-hidden />
              <span>
                <small>Today we are</small>Squarefoot Realty
              </span>
            </div>
            <ul role="list" className="chips" data-reveal="fade">
              <li>IIT</li>
              <li>ISB</li>
              <li>CBIT</li>
              <li>OC-certified delivery</li>
            </ul>
            <span data-reveal="fade">
              <TLink href="/about">Our story</TLink>
            </span>
          </div>
        </div>
      </section>

      {/* 08 — Closing */}
      <Closing image={img("aerial-close", 3840, 2160, "Aerial view of villas and landscaped parks at The Square")}>
        <span className="label">Get in touch</span>
        <div className="closing__row" style={{ marginTop: "var(--sp-2)" }}>
          <div>
            <h2 className="t-hero">Ready to find your place?</h2>
            <p className="t-lead" style={{ marginTop: "var(--sp-2)", maxWidth: "40ch", opacity: 0.88 }}>
              Come see it for yourself, and picture calling it home.
            </p>
          </div>
          <div className="btn-row">
            <Link href="/projects" className="pill pill--light">
              Explore projects <span className="arr" aria-hidden>↗</span>
            </Link>
            <EnquireButton className="pill pill--ghost" mode="brochure" source="home-closing">
              Download brochure
            </EnquireButton>
          </div>
        </div>
      </Closing>
    </>
  );
}
