import Image from "next/image";
import type { Img } from "@/lib/projects";
import { Mark } from "./Logo";

/**
 * Sticky full-viewport hero. The section that follows (class "curtain") slides over it.
 * Entrance is choreographed in Motion.tsx (image unmasks, title rises line by line, then details).
 */
export default function Hero({
  image,
  tone = "image",
  title,
  links,
  meta,
  caption,
  big,
  label,
  position,
  mobilePosition,
  priority = true,
}: {
  image?: Img;
  tone?: "image" | "red" | "ink";
  title: React.ReactNode;
  links?: React.ReactNode;
  meta?: React.ReactNode[];
  caption?: React.ReactNode;
  big?: { value: string; unit: string };
  label?: React.ReactNode;
  position?: string;
  mobilePosition?: string;
  priority?: boolean;
}) {
  return (
    <section className={`hero ${tone === "red" ? "hero--red" : tone === "ink" ? "hero--ink" : ""}`} data-hero data-head={tone === "red" ? "red" : "dark"}>
      {image && tone === "image" ? (
        <div className="hero__media" data-hero-media>
          <div style={{ position: "absolute", inset: 0 }} data-hero-drift>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"
              quality={80}
              className="hero__img"
              style={{ ["--pos" as string]: position ?? "50% 50%", ["--mpos" as string]: mobilePosition ?? position ?? "50% 50%" }}
            />
          </div>
        </div>
      ) : (
        <div className="hero__media" data-hero-media>
          {tone === "ink" && <span className="hero__sun" aria-hidden />}
          {(big || tone === "red") && (
            <div className="hero__brand" aria-hidden>
              {tone === "red" && <Mark onRed />}
              {big && (
                <span className="hero__big">
                  {big.value}
                  <span className="label" style={{ display: "block", textAlign: "right", fontSize: "var(--f-label)", letterSpacing: "0.22em", marginTop: 10 }}>
                    {big.unit}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      )}
      <div className="hero__shade" />
      <div className="hero__top">
        <div className="container">
          {label && (
            <span className="label" data-hero-in style={{ marginBottom: "var(--sp-3)", display: "inline-flex" }}>
              {label}
            </span>
          )}
          <h1 className="t-hero hero__title" data-hero-title>
            {title}
          </h1>
          {links && (
            <div className="hero__links" data-hero-in>
              {links}
            </div>
          )}
        </div>
      </div>
      {(meta || caption) && (
        <div className="hero__bottom">
          <div className="container">
            {meta && (
              <div className="hero__meta" data-hero-in>
                {meta.map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </div>
            )}
            {caption && (
              <p className="hero__caption" data-hero-in>
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
