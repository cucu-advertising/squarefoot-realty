"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gallery, type GalleryCategory } from "@/content/site";

const CATS: ("All" | GalleryCategory)[] = ["All", "Exterior", "Interiors", "Amenities", "Landscape"];

export default function Gallery() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(() => (cat === "All" ? gallery : gallery.filter((g) => g.category === cat)), [cat]);

  return (
    <section id="gallery" className="gallery section" aria-labelledby="gal-title">
      <div className="wrap">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__num">05</span> Gallery
            </p>
            <h2 id="gal-title" className="display-2" data-split>
              Squarely in the lap <em>of abundance.</em>
            </h2>
          </div>
          <div className="filters" role="group" aria-label="Filter gallery">
            {CATS.map((c) => (
              <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>
                {c}
                <sup>{c === "All" ? gallery.length : gallery.filter((g) => g.category === c).length}</sup>
              </button>
            ))}
          </div>
        </div>

        <ul className="masonry" key={cat}>
          {items.map((g, i) => (
            <li key={g.src} className="masonry__item" style={{ ["--i" as string]: i }}>
              <button type="button" onClick={() => setOpen(i)} aria-label={`Open image: ${g.caption}`}>
                <Image src={g.src} alt={g.alt} width={g.w} height={g.h} sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                <span className="masonry__cap">
                  <span>{g.caption}</span>
                  <span className="masonry__cat">{g.category}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="gallery__note">All images are artist&rsquo;s impressions from the project brochure, for illustration only.</p>
      </div>
      <Lightbox items={items} index={open} setIndex={setOpen} />
    </section>
  );
}

function Lightbox({ items, index, setIndex }: { items: typeof gallery; index: number | null; setIndex: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  const n = items.length;
  const go = useCallback((d: number) => setIndex(index === null ? null : (index + d + n) % n), [index, n, setIndex]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.showModal();
      document.documentElement.classList.add("is-locked");
    }
    if (index === null && d.open) d.close();
  }, [index]);

  useEffect(() => {
    const d = ref.current!;
    const c = () => {
      document.documentElement.classList.remove("is-locked");
      setIndex(null);
    };
    d.addEventListener("close", c);
    return () => d.removeEventListener("close", c);
  }, [setIndex]);

  const g = index !== null ? items[index] : null;

  return (
    <dialog
      ref={ref}
      className="lightbox"
      data-lenis-prevent
      aria-label="Image viewer"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {g && (
        <>
          <div className="lightbox__bar">
            <span className="lightbox__count">
              {String(index! + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <button type="button" className="zoom__close" onClick={() => ref.current?.close()} aria-label="Close">
              <span aria-hidden="true" />
            </button>
          </div>
          <figure
            className="lightbox__fig"
            onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touch.current === null) return;
              const dx = e.changedTouches[0].clientX - touch.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              touch.current = null;
            }}
          >
            <div className="lightbox__img" key={g.src}>
              <Image src={g.src} alt={g.alt} width={g.w} height={g.h} sizes="92vw" quality={90} />
            </div>
            <figcaption>
              <span>{g.caption}</span>
              <span>{g.category} · Artist&rsquo;s impression</span>
            </figcaption>
          </figure>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous image">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next image">
            <span aria-hidden="true">→</span>
          </button>
        </>
      )}
    </dialog>
  );
}
