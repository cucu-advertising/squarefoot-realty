"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Img } from "@/lib/projects";

/** Accessible full-screen viewer: arrows / swipe / Esc, zoom toggle for plans, focus returned on close. */
export default function Lightbox({
  images,
  index,
  onClose,
  label = "Image viewer",
  zoomable,
}: {
  images: Img[];
  index: number;
  onClose: () => void;
  label?: string;
  zoomable?: boolean;
}) {
  const [i, setI] = useState(index);
  const [zoom, setZoom] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const n = images.length;

  const go = useCallback((d: number) => {
    setZoom(false);
    setI((v) => (v + d + n) % n);
  }, [n]);

  useEffect(() => {
    prevFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && n > 1) go(1);
      if (e.key === "ArrowLeft" && n > 1) go(-1);
      if (e.key === "Tab") {
        const root = document.querySelector(".lightbox");
        const f = root ? [...root.querySelectorAll<HTMLElement>("button")] : [];
        if (f.length) {
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
      prevFocus.current?.focus?.();
    };
  }, [onClose, go, n]);

  const img = images[i];
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={label}>
      <div className="lightbox__top">
        <span className="lightbox__counter" aria-live="polite">
          {n > 1 ? `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}` : ""}
        </span>
        <div className="lightbox__nav">
          {zoomable && (
            <button type="button" className="lightbox__btn" onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? "Zoom out" : "Zoom in"}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M15 15l6 6M7 10h6" stroke="currentColor" strokeWidth="1.5" />
                {!zoom && <path d="M10 7v6" stroke="currentColor" strokeWidth="1.5" />}
              </svg>
            </button>
          )}
          <button ref={closeRef} type="button" className="lightbox__btn" onClick={onClose} aria-label="Close viewer">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`lightbox__stage ${zoom ? "is-zoom" : ""}`}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (zoom || touchX.current === null || n < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        onClick={() => zoom && setZoom(false)}
        data-lenis-prevent
      >
        <div className="lightbox__img">
          <Image key={img.src} src={img.src} alt={img.alt} fill={!zoom} width={zoom ? img.width : undefined} height={zoom ? img.height : undefined} sizes="100vw" quality={80} />
        </div>
      </div>
      <div className="lightbox__bottom">
        <span>{img.caption ?? img.alt}</span>
        {n > 1 && (
          <div className="lightbox__nav">
            <button type="button" className="lightbox__btn" onClick={() => go(-1)} aria-label="Previous image">
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button type="button" className="lightbox__btn" onClick={() => go(1)} aria-label="Next image">
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
