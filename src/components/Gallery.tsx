"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { Img } from "@/lib/projects";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

const PATTERN = ["g-a", "g-b", "g-c", "g-d", "g-e", "g-f"];

/** Editorial, asymmetric gallery. Layout adapts to how many images a project actually has. */
export default function Gallery({ images, credit }: { images: (Img & { project?: string })[]; credit?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const layout = (i: number) => {
    if (images.length === 1) return "g-full";
    if (images.length === 2) return "g-half";
    return PATTERN[i % PATTERN.length];
  };
  const sizes = (cls: string) =>
    cls === "g-full" ? "100vw" : ["g-a", "g-d", "g-e"].includes(cls) ? "(max-width: 767px) 100vw, 66vw" : "(max-width: 767px) 50vw, 33vw";
  return (
    <>
      <div className="gallery">
        {images.map((img, i) => {
          const cls = layout(i);
          return (
            <button key={img.src + i} type="button" className={`gallery__item ${cls}`} onClick={() => setOpen(i)} aria-label={`View larger: ${img.caption ?? img.alt}`} data-reveal="mask">
              <Image src={img.src} alt={img.alt} fill sizes={sizes(cls)} quality={80} />
              <span className="gallery__cap">
                <span>{img.caption ?? img.alt}</span>
                {(img.project ?? credit) && <span>{img.project ?? credit}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {open !== null && <Lightbox images={images} index={open} onClose={() => setOpen(null)} label="Gallery" />}
    </>
  );
}
