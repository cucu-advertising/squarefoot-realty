import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EnquireButton } from "@/components/Enquiry";
import { Mark } from "@/components/Logo";
import { TLink } from "@/components/ui";
import Hero from "@/components/Hero";
import Collage from "@/components/Collage";
import OurProjects from "@/components/OurProjects";
import DeliveredReel from "@/components/DeliveredReel";
import Closing from "@/components/Closing";
import type { Img } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Squarefoot Realty | Everything and Beyond",
  description:
    "Squarefoot Realty, formerly Sai Teja Developers, builds villas, apartments and layouts in Hyderabad. Three decades of experience. Explore our projects.",
  alternates: { canonical: "/" },
};

const SQ = "/images/the-square";
const img = (name: string, width: number, height: number, alt: string, caption?: string): Img => ({ src: `${SQ}/${name}.jpg`, width, height, alt, caption });

export default function Home() {
  // Collage: images from our current communities, shown in project order (The Square, The Urban
  // Ranch, Squarefoot Origin). The last item sits on top and is revealed first.
  const collage: Img[] = [
    { src: "/images/the-urban-ranch/aerial-dusk.jpg", width: 3840, height: 2143, alt: "The Urban Ranch from above at dusk", caption: "The Urban Ranch · At dusk" },
    { src: "/images/squarefoot-origin/west-garden.jpg", width: 3840, height: 2160, alt: "West facing villas framed by trees at Squarefoot Origin", caption: "Squarefoot Origin · Manneguda" },
    { src: "/images/the-urban-ranch/lake-street.jpg", width: 3840, height: 2580, alt: "Villas beside a landscaped water feature at The Urban Ranch", caption: "The Urban Ranch · Kongara Kalan" },
    img("terrace-view", 3840, 2160, "Landscaped gardens seen from a villa terrace at The Square", "The Square · Kongara Kalan"),
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
        meta={["Villas · Apartments · Commercial", "Hyderabad's ORR corridor", <a key="s" href="#philosophy">Scroll ↓</a>]}
        caption="Living environments that hold everything you need within your walls, and open out to the sky and the green beyond."
      />

      {/* 02 — Brand philosophy */}
      <div id="philosophy">
        <Collage
          label="Our philosophy"
          title="A great home looks beyond its walls."
          line="Open skies, green landscapes and the possibilities of each new morning, in every community we build."
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

      {/* 03 — Our projects, side by side */}
      <OurProjects label="Our projects" title="Spaces we are building." />

      {/* 06 — Architectural reel: delivered work */}
      <DeliveredReel
        intro={
          <>
            <span className="label label--dot">Track record</span>
            <h2 className="t-display" data-split>
              Delivered. Occupied. Trusted.
            </h2>
            <p className="t-lead muted measure">Homes and workplaces with occupancy certificates, plus a series of layout and plotting ventures.</p>
            <TLink href="/projects">All projects</TLink>
          </>
        }
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
            <EnquireButton className="pill pill--red" source="home-closing">
              Enquire now
            </EnquireButton>
            <Link href="/projects" className="pill pill--ghost">
              Explore projects <span className="arr" aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </Closing>
    </>
  );
}
