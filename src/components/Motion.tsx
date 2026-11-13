"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * The site's single motion controller.
 *
 *  • Smooth scrolling — ONE Lenis instance, desktop (fine pointer) only, driven by
 *    GSAP's ticker so Lenis and ScrollTrigger share a frame. Touch devices keep
 *    native scrolling. Nothing is pinned or scroll-jacked.
 *  • Typography — headings marked [data-split] reveal line by line from behind a mask.
 *  • Imagery — [data-parallax] wrappers drift a few percent on scroll (scrubbed).
 *  • Supporting content — [data-reveal] fades up via one IntersectionObserver;
 *    [data-count] numbers count up once.
 *
 * Everything is skipped under prefers-reduced-motion, and torn down on route change.
 */

const HEADER_OFFSET = 84; // keep equal to html { scroll-padding-top } in globals.css

/* ── Scroll restoration ──────────────────────────────────────────────────────
   Each history entry gets an id; its scroll position is saved while scrolling and
   restored on Back/Forward/reload once the destination page has rendered. The
   browser's own restoration runs too early for client-rendered routes. */
const SCROLL_KEY = "tsq_scroll:";
const nav = { restoring: false, lastScroll: 0, path: "" };
const entryId = (): string | undefined => (history.state as { __tsq?: string } | null)?.__tsq;
function tagEntry() {
  if (entryId()) return;
  try {
    history.replaceState({ ...(history.state || {}), __tsq: Math.random().toString(36).slice(2, 10) }, "");
  } catch {}
}
function savePosition() {
  const id = entryId();
  if (nav.restoring || !id) return;
  try {
    sessionStorage.setItem(SCROLL_KEY + id, String(Math.round(window.scrollY)));
  } catch {}
}
function jumpTo(y: number) {
  if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}
function restorePosition() {
  const id = entryId();
  let saved: string | null = null;
  try {
    saved = id ? sessionStorage.getItem(SCROLL_KEY + id) : null;
  } catch {}
  const hashEl = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  if (saved !== null) jumpTo(Number(saved));
  else if (hashEl) scrollToTarget(hashEl, true);
  else jumpTo(0);
  setTimeout(() => {
    nav.restoring = false;
    tagEntry();
  }, 120);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function scrollToTarget(el: Element, immediate = false) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = window.__lenis;
  if (lenis) {
    // Lenis already subtracts the CSS scroll-padding-top, so no extra offset here
    lenis.scrollTo(el as HTMLElement, { immediate: immediate || reduce, duration: 1.4, force: true });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: immediate || reduce ? "auto" : "smooth" });
  }
}

export default function Motion() {
  const pathname = usePathname();
  const first = useRef(true);

  /* ───────── Global, once: scroll engine + anchor navigation ───────── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let lenis: Lenis | undefined;
    let tick: ((t: number) => void) | undefined;
    if (!reduce && finePointer) {
      lenis = new Lenis({
        lerp: 0.1, // gentle inertia: responsive, never floaty
        wheelMultiplier: 1,
        smoothWheel: true,
        autoRaf: false,
      });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Pause smoothing while a dialog or the mobile menu owns the screen
    const lockWatch = new MutationObserver(() => {
      const locked = html.classList.contains("is-locked") || html.classList.contains("is-menu-open");
      if (locked) lenis?.stop();
      else lenis?.start();
    });
    lockWatch.observe(html, { attributes: true, attributeFilter: ["class"] });

    // Same-page anchors: glide to the section and keep the URL/hash + history in sync
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      if (window.location.hash !== url.hash) {
        savePosition();
        const { __tsq: _drop, ...rest } = (history.state || {}) as Record<string, unknown>;
        void _drop;
        history.pushState(rest, "", url.hash);
        tagEntry();
      }
      // let an open mobile menu release its scroll lock first
      const wasMenu = html.classList.contains("is-menu-open"); // the menu closes itself on click
      setTimeout(() => scrollToTarget(target), wasMenu ? 80 : 0);
    };
    document.addEventListener("click", onClick, true);

    // Back / Forward: restore the exact position of that history entry
    history.scrollRestoration = "manual";
    nav.path = window.location.pathname;
    const onPop = () => {
      nav.restoring = true;
      const samePage = window.location.pathname === nav.path;
      // same page (hash history): restore now; other pages restore after they render
      if (samePage) setTimeout(restorePosition, 0);
    };
    window.addEventListener("popstate", onPop);
    let saveTimer = 0;
    const onScroll = () => {
      nav.lastScroll = performance.now();
      clearTimeout(saveTimer);
      saveTimer = window.setTimeout(savePosition, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", savePosition);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", savePosition);
      clearTimeout(saveTimer);
      lockWatch.disconnect();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  /* ───────── Per route: reveals, splits, parallax ───────── */
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const lenis = window.__lenis;

    // Arriving on a page: Back/Forward/reload → restore; fresh visit with a hash → land below the header
    const navType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type;
    const isReturn = nav.restoring || (first.current && (navType === "reload" || navType === "back_forward"));
    nav.path = window.location.pathname;
    lenis?.resize();
    if (isReturn) {
      nav.restoring = true;
      requestAnimationFrame(restorePosition);
    } else {
      tagEntry();
      const hashTarget = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (hashTarget) requestAnimationFrame(() => scrollToTarget(hashTarget, true));
    }
    first.current = false;

    /* Fade-up + counters (cheap, CSS-driven) */
    const count = (el: HTMLElement) => {
      const target = el.dataset.count!;
      const n = Number(target.replace(/,/g, ""));
      const dec = target.includes(".") ? target.split(".")[1].length : 0;
      if (reduce || !Number.isFinite(n)) return;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: n,
        duration: 1.8,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = dec ? obj.v.toFixed(dec) : Math.round(obj.v).toLocaleString("en-IN");
        },
        onComplete: () => {
          el.textContent = target;
        },
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    const fade = (img: HTMLImageElement) => {
      img.dataset.fade = "";
      if (img.complete && img.naturalWidth > 0) return img.classList.add("is-loaded");
      const done = () => img.classList.add("is-loaded");
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    };
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
      document.querySelectorAll<HTMLImageElement>("img[data-nimg]:not([data-fade])").forEach(fade);
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    /* GSAP: line reveals + parallax */
    const ctx = gsap.context(() => {
      const heads = gsap.utils.toArray<HTMLElement>("[data-split]");
      if (reduce) {
        gsap.set(heads, { visibility: "visible" });
      } else {
        heads.forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true, // re-splits after fonts load and on resize
            onSplit(self) {
              gsap.set(el, { visibility: "visible" });
              return gsap.from(self.lines, {
                yPercent: 108,
                duration: 1.15,
                ease: "expo.out",
                stagger: 0.085,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              });
            },
          });
        });

        if (finePointer) {
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            const amt = Number(el.dataset.parallax) || 8;
            gsap.fromTo(
              el,
              { yPercent: -amt },
              {
                yPercent: amt,
                ease: "none",
                scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });
          const media = document.querySelector<HTMLElement>("[data-hero-media]");
          const content = document.querySelector<HTMLElement>("[data-hero-content]");
          if (media && content) {
            const st = { trigger: media.parentElement, start: "top top", end: "bottom top", scrub: true };
            gsap.to(media, { yPercent: 14, ease: "none", scrollTrigger: st });
            gsap.to(content, { yPercent: -10, autoAlpha: 0.25, ease: "none", scrollTrigger: st });
          }
        }
      }
    });
    html.classList.add("motion-ready");

    // Layout changes (accordions, tabs, lazy content) → keep trigger positions honest
    // ScrollTrigger.refresh() momentarily resets scroll, so never run it mid-scroll.
    let timer = 0;
    let lastH = document.body.scrollHeight;
    const refreshWhenIdle = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (performance.now() - nav.lastScroll < 250 || nav.restoring) return refreshWhenIdle();
        ScrollTrigger.refresh();
      }, 200);
    };
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      refreshWhenIdle();
    });
    ro.observe(document.body);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
