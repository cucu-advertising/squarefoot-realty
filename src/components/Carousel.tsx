"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/projects";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

/** Horizontal gallery: native touch scrolling + scroll-snap, mouse drag on desktop, arrows, progress, lightbox. */
export default function Carousel({ images, credit }: { images: Img[]; credit?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 1);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const by = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.7, behavior: "smooth" });

  return (
    <div className="carousel">
      <div
        ref={track}
        className="carousel__track"
        tabIndex={0}
        aria-label="Image gallery, scroll horizontally"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") by(1);
          if (e.key === "ArrowLeft") by(-1);
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { down: true, x: e.clientX, left: track.current!.scrollLeft, moved: 0 };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down) return;
          const dx = e.clientX - d.x;
          d.moved = Math.max(d.moved, Math.abs(dx));
          if (d.moved > 4) track.current!.classList.add("is-drag");
          track.current!.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          drag.current.down = false;
          track.current?.classList.remove("is-drag");
        }}
        onPointerLeave={() => {
          drag.current.down = false;
          track.current?.classList.remove("is-drag");
        }}
      >
        {images.map((img, i) => (
          <figure key={img.src + i} className="carousel__item" style={{ aspectRatio: `${img.width} / ${img.height}` }} data-cursor="Drag">
            <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 767px) 86vw, 70vw" quality={80} draggable={false} />
            <figcaption>
              <span>{img.caption ?? img.alt}</span>
              {credit && <span style={{ opacity: 0.7 }}>{credit}</span>}
            </figcaption>
            <button
              type="button"
              className="carousel__open"
              aria-label={`View larger: ${img.caption ?? img.alt}`}
              onClick={() => {
                if (drag.current.moved > 6) return;
                setOpen(i);
              }}
            />
          </figure>
        ))}
      </div>
      <div className="container carousel__bar">
        <span className="caption">
          {String(Math.min(images.length, Math.round(progress * (images.length - 1)) + 1)).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <div className="carousel__progress" aria-hidden>
          <i style={{ ["--p" as string]: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <div className="carousel__btns">
          <button type="button" className="iconbtn" onClick={() => by(-1)} aria-label="Previous images">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
          <button type="button" className="iconbtn" onClick={() => by(1)} aria-label="Next images">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
      </div>
      {open !== null && <Lightbox images={images} index={open} onClose={() => setOpen(null)} label="Gallery" />}
    </div>
  );
}
