"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ZoomImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
}

/**
 * Full-screen viewer for floor plans and maps. Supports wheel / pinch / double-tap
 * zoom, drag to pan, +/- buttons, keyboard (+, -, 0, arrows, Esc). The image is
 * served at full resolution so dimension text stays legible when zoomed.
 */
export default function ZoomViewer({ image, onClose, download }: { image: ZoomImage | null; onClose: () => void; download?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; s: number } | null>(null);
  const lastTap = useRef(0);
  const MAX = 5;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (image && !d.open) {
      d.showModal();
      document.documentElement.classList.add("is-locked");
      setT({ s: 1, x: 0, y: 0 });
    }
    if (!image && d.open) d.close();
  }, [image]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const c = () => {
      document.documentElement.classList.remove("is-locked");
      onClose();
    };
    d.addEventListener("close", c);
    return () => d.removeEventListener("close", c);
  }, [onClose]);

  const clamp = useCallback((n: { s: number; x: number; y: number }) => {
    const s = Math.min(MAX, Math.max(1, n.s));
    const el = stage.current;
    if (!el) return { ...n, s };
    const w = el.clientWidth;
    const h = el.clientHeight;
    const mx = ((s - 1) * w) / 2;
    const my = ((s - 1) * h) / 2;
    return { s, x: s === 1 ? 0 : Math.max(-mx, Math.min(mx, n.x)), y: s === 1 ? 0 : Math.max(-my, Math.min(my, n.y)) };
  }, []);

  const zoomAt = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      setT((p) => {
        const el = stage.current!;
        const r = el.getBoundingClientRect();
        const px = (cx ?? r.left + r.width / 2) - (r.left + r.width / 2);
        const py = (cy ?? r.top + r.height / 2) - (r.top + r.height / 2);
        const s = Math.min(MAX, Math.max(1, p.s * factor));
        const k = s / p.s;
        return clamp({ s, x: px - (px - p.x) * k, y: py - (py - p.y) * k });
      });
    },
    [clamp],
  );

  const onWheel = (e: React.WheelEvent) => {
    zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), s: t.s };
    }
    if (e.pointerType !== "mouse") {
      const now = Date.now();
      if (now - lastTap.current < 280) zoomAt(t.s > 1.5 ? 1 / t.s : 2.5, e.clientX, e.clientY);
      lastTap.current = now;
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const target = (pinch.current.s * d) / pinch.current.d;
      setT((p) => clamp({ ...p, s: target }));
      return;
    }
    setT((p) => clamp({ ...p, x: p.x + e.clientX - prev.x, y: p.y + e.clientY - prev.y }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = 60;
    if (e.key === "+" || e.key === "=") zoomAt(1.3);
    else if (e.key === "-") zoomAt(1 / 1.3);
    else if (e.key === "0") setT({ s: 1, x: 0, y: 0 });
    else if (e.key === "ArrowLeft") setT((p) => clamp({ ...p, x: p.x + step }));
    else if (e.key === "ArrowRight") setT((p) => clamp({ ...p, x: p.x - step }));
    else if (e.key === "ArrowUp") setT((p) => clamp({ ...p, y: p.y + step }));
    else if (e.key === "ArrowDown") setT((p) => clamp({ ...p, y: p.y - step }));
    else return;
    e.preventDefault();
  };

  return (
    <dialog ref={ref} className="zoom" data-lenis-prevent aria-label={image?.title || image?.alt || "Image viewer"} onKeyDown={onKey}>
      {image && (
        <>
          <div className="zoom__bar">
            <p className="zoom__title">{image.title || image.alt}</p>
            <div className="zoom__tools">
              <button type="button" onClick={() => zoomAt(1 / 1.4)} aria-label="Zoom out" disabled={t.s <= 1}>−</button>
              <output aria-live="polite">{Math.round(t.s * 100)}%</output>
              <button type="button" onClick={() => zoomAt(1.4)} aria-label="Zoom in" disabled={t.s >= MAX}>+</button>
              <button type="button" onClick={() => setT({ s: 1, x: 0, y: 0 })} aria-label="Reset zoom" className="zoom__reset">Fit</button>
              {download && (
                <a href={download} download className="zoom__dl">
                  PDF ↓
                </a>
              )}
              <button type="button" className="zoom__close" onClick={() => ref.current?.close()} aria-label="Close viewer">
                <span aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            ref={stage}
            className={`zoom__stage ${t.s > 1 ? "is-zoomed" : ""}`}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={(e) => zoomAt(t.s > 1.5 ? 1 / t.s : 2.5, e.clientX, e.clientY)}
          >
            <div className="zoom__img" style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.s})` }}>
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="100vw" quality={90} unoptimized draggable={false} />
            </div>
          </div>
          <p className="zoom__hint">Scroll, pinch or double-tap to zoom · drag to pan</p>
        </>
      )}
    </dialog>
  );
}
