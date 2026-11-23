"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { onAutoNext } from "./useSeqIndex";
import type { Img } from "@/lib/projects";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

/** One large image at a time with the next one queued beside it; swipe, arrows, keyboard and a full-screen viewer. */
export default function FocusGallery({ images, credit }: { images: Img[]; credit?: string }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = images.length;
  const go = (k: number) => setI(((k % n) + n) % n);
  const next = images[(i + 1) % n];
  const root = useRef<HTMLDivElement>(null);
  // Autoplay: the next image after a few seconds of inactivity (AutoAdvance).
  useEffect(() => onAutoNext(root.current, () => (open ? false : (setI((x) => (x + 1) % n), true))), [n, open]);
  return (
    <div ref={root} className="focus" data-autoplay onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }}>
      <div
        className="focus__main"
        data-reveal="mask"
        data-cursor="Expand"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {images.map((img, k) => (
          <div key={img.src} className={`focus__layer ${k === i ? "is-on" : ""}`} aria-hidden={k !== i}>
            <Image src={img.src} alt={img.alt} fill sizes="(max-width: 899px) 100vw, 72vw" quality={80} priority={false} />
          </div>
        ))}
        <button type="button" className="focus__open" aria-label={`View larger: ${images[i].caption ?? images[i].alt}`} onClick={() => setOpen(true)} />
      </div>
      <div className="focus__side">
        <button type="button" className="focus__next" onClick={() => go(i + 1)} aria-label={`Next image: ${next.caption ?? next.alt}`}>
          <Image src={next.src} alt="" fill sizes="22vw" quality={70} />
          <span>Next</span>
        </button>
        <div>
          <p className="focus__count" aria-live="polite">
            {String(i + 1).padStart(2, "0")}
            <small> / {String(n).padStart(2, "0")}</small>
          </p>
          <p className="focus__cap">
            {images[i].caption ?? images[i].alt}
            {credit && <span className="muted"> · {credit}</span>}
          </p>
        </div>
        <div className="focus__bar" aria-hidden>
          <i style={{ width: `${((i + 1) / n) * 100}%` }} />
        </div>
        <div className="btn-row" style={{ gap: 8 }}>
          <button type="button" className="circle-btn" aria-label="Previous image" onClick={() => go(i - 1)}>
            <svg viewBox="0 0 16 16" aria-hidden><path d="M11 2L5 8l6 6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
          <button type="button" className="circle-btn js-autonext" aria-label="Next image" onClick={() => go(i + 1)}>
            <svg viewBox="0 0 16 16" aria-hidden><path d="M5 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
      </div>
      {open && <Lightbox images={images} index={i} onClose={() => setOpen(false)} label="Gallery" />}
    </div>
  );
}
