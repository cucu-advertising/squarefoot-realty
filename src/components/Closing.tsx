import Image from "next/image";
import type { Img } from "@/lib/projects";

/** Closing frame: grows from a card to full screen on desktop, then the invitation appears. */
export default function Closing({ image, children }: { image: Img; children: React.ReactNode }) {
  return (
    <section className="closing pin" data-seq="closing" style={{ ["--len" as string]: "240vh" }} data-head="light" aria-label="Get in touch">
      <div className="pin__stage">
        <div className="closing__frame" data-head="dark">
          <Image src={image.src} alt={image.alt} fill sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" quality={80} />
          <div className="closing__text on-image">
            <div className="container">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
