"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

declare global {
  interface Window {
    __lenis?: Lenis;
    __motionReady?: boolean;
    __sfReady?: boolean;
  }
}

/** Pinned, scroll-choreographed sequences only where they belong: fine pointers, ≥1024px, motion allowed. */
export const PIN_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/* One timing language (observed on the reference: soft ease-out, ~0.3s UI, 1–1.4s reveals). */
const EASE = "expo.out";
const D = { line: 1.3, fade: 1.1, mask: 1.5 };

const vw = () => window.innerWidth / 100;
const vh = () => window.innerHeight / 100;

/** Tell a component which step a pinned sequence is on (components listen for "sf:index"). */
function emitIndex(el: Element, i: number) {
  const prev = (el as HTMLElement).dataset.idx;
  if (prev === String(i)) return;
  (el as HTMLElement).dataset.idx = String(i);
  el.dispatchEvent(new CustomEvent("sf:index", { detail: i }));
}

/** Hero entrance — waits for the preloader to finish (or runs at once when it is skipped). */
function heroEntrance() {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (!hero) return () => {};
  const media = hero.querySelector<HTMLElement>("[data-hero-media]");
  const title = hero.querySelector<HTMLElement>("[data-hero-title]");
  const items = hero.querySelectorAll<HTMLElement>("[data-hero-in]");
  let split: SplitText | null = null;
  let tl: gsap.core.Timeline | null = null;
  const run = () => {
    tl = gsap.timeline();
    if (media) tl.fromTo(media, { clipPath: "inset(14% 10% 14% 10% round 18px)", scale: 1.25 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, duration: 1.9, ease: "expo.inOut" }, 0);
    if (title) {
      split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line" });
      gsap.set(title, { visibility: "visible" });
      tl.from(split.lines, { yPercent: 130, duration: D.line, stagger: 0.1, ease: EASE }, 0.75);
    }
    if (items.length) tl.fromTo(items, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: EASE }, 1.05);
  };
  if (window.__sfReady) run();
  else window.addEventListener("sf:ready", run, { once: true });
  return () => {
    window.removeEventListener("sf:ready", run);
    tl?.kill();
    split?.revert();
  };
}

/* ---------- Pinned sequences (desktop) ---------- */

function collage(root: HTMLElement) {
  const items = gsap.utils.toArray<HTMLElement>(".collage__item", root);
  const head = root.querySelector(".collage__head");
  const desk = root.querySelector(".collage__desk");
  if (!items.length) return;
  // Scattered starting composition around the title (offsets in vw/vh, rotation, scale).
  const scatter = [
    { x: -33, y: -24, r: -5, s: 0.9 },
    { x: 31, y: -27, r: 4, s: 0.78 },
    { x: -35, y: 22, r: 3, s: 0.84 },
    { x: 33, y: 23, r: -4, s: 1 },
    { x: 1, y: 33, r: 1, s: 0.7 },
  ];
  items.forEach((el, i) => {
    const p = scatter[i % scatter.length];
    gsap.set(el, { x: () => p.x * vw(), y: () => p.y * vh(), rotation: p.r, scale: p.s, zIndex: i + 1 });
  });
  const n = items.length;
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root, start: "top top", end: "bottom bottom", scrub: 0.9, invalidateOnRefresh: true,
      onUpdate(self) {
        const t = self.progress * tl.duration();
        const k = t < 1.6 ? 0 : Math.min(n - 1, Math.floor((t - 1.6) / 0.6 + 0.5));
        emitIndex(root, k);
        desk?.classList.toggle("is-on", t > 1.45);
      },
    },
  });
  tl.to(items, { x: 0, y: 0, rotation: 0, scale: 1, duration: 1, stagger: 0.04 }, 0)
    .to(head, { opacity: 0, y: -40, duration: 0.5 }, 0.45)
    .to(items, { width: () => 88 * vw(), height: () => 80 * vh(), marginLeft: () => -44 * vw(), marginTop: () => -40 * vh(), duration: 0.6 }, 1)
    .to(desk, { opacity: 1, duration: 0.2 }, 1.45);
  // Peel the stack from the top: each wipe reveals the image beneath.
  for (let i = n - 1, k = 0; i > 0; i--, k++) {
    tl.to(items[i], { clipPath: "inset(0% 0% 100% 0%)", duration: 0.5 }, 1.6 + k * 0.6);
    tl.fromTo(items[i - 1].querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 0.6 }, 1.6 + k * 0.6);
  }
  tl.to({}, { duration: 0.4 });
}

function discover(root: HTMLElement) {
  const panels = gsap.utils.toArray<HTMLElement>(".disc__panel", root);
  const row = root.querySelector(".mq__row");
  const ui = root.querySelector(".disc__ui");
  if (!panels.length) return;
  const n = panels.length;
  gsap.set(panels[0], { clipPath: "inset(31% 37% 31% 37% round 18px)" });
  gsap.set(panels[0].querySelector(".disc__content"), { opacity: 0, y: 30 });
  panels.slice(1).forEach((p) => gsap.set(p, { clipPath: "inset(100% 0% 0% 0%)" }));
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root, start: "top top", end: "bottom bottom", scrub: 0.9,
      onUpdate(self) {
        const t = self.progress * tl.duration();
        const k = Math.max(0, Math.min(n - 1, Math.floor(t - 1.5 + 0.5)));
        emitIndex(root, t < 1 ? 0 : k);
      },
    },
  });
  if (row) tl.fromTo(row, { xPercent: 0 }, { xPercent: -22, duration: 1.2 }, 0);
  tl.to(panels[0], { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 }, 0)
    .fromTo(panels[0].querySelector(".disc__media img, .disc__brand"), { scale: 1.3 }, { scale: 1, duration: 1 }, 0)
    .to(panels[0].querySelector(".disc__content"), { opacity: 1, y: 0, duration: 0.3 }, 0.8)
    .to(ui, { opacity: 1, duration: 0.3 }, 0.8);
  panels.slice(1).forEach((p, i) => {
    const at = 1.5 + i;
    tl.to(p, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 }, at)
      .fromTo(p.querySelector(".disc__media img, .disc__brand"), { scale: 1.2 }, { scale: 1, duration: 0.8 }, at)
      .fromTo(p.querySelector(".disc__content"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.5)
      .to(panels[i].querySelector(".disc__content"), { opacity: 0, y: -30, duration: 0.3 }, at);
  });
  tl.to({}, { duration: 0.6 });
}

function explore(root: HTMLElement) {
  const layers = gsap.utils.toArray<HTMLElement>(".exp__layer", root);
  const bar = root.querySelector<HTMLElement>(".exp__bar");
  const n = layers.length;
  if (n < 2) return;
  layers.forEach((l, i) => gsap.set(l, { opacity: 1, zIndex: i + 1, clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" }));
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root, start: "top top", end: "bottom bottom", scrub: 0.8,
      onUpdate(self) {
        emitIndex(root, Math.min(n - 1, Math.round(self.progress * (n - 1))));
        bar?.style.setProperty("--p", String(self.progress));
      },
    },
  });
  tl.fromTo(layers[0].querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
  for (let i = 1; i < n; i++) {
    const at = i - 0.5;
    // Clean architectural wipe from the right; the outgoing view drifts left (no double exposure).
    tl.to(layers[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power2.inOut" }, at)
      .fromTo(layers[i].querySelector("img"), { scale: 1.12, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 1, ease: "power2.out" }, at)
      .to(layers[i - 1].querySelector("img"), { xPercent: -8, duration: 0.7, ease: "power2.inOut" }, at);
  }
}

function hseq(root: HTMLElement) {
  const intro = root.querySelector(".hseq__intro");
  const items = gsap.utils.toArray<HTMLElement>(".hseq__item", root);
  const over = root.querySelector(".hseq__over");
  const count = root.querySelector(".hseq__count");
  if (!items.length) return;
  const n = items.length;
  const medias = items.map((it) => it.querySelector<HTMLElement>(".hseq__media")!);
  const texts = items.map((it) => it.querySelector<HTMLElement>(".hseq__text")!);
  const split = { left: () => 3.2 * vw(), top: () => 11 * vh(), width: () => 54 * vw(), height: () => 78 * vh() };
  // First image starts small below the statement; the others wait in the split frame.
  gsap.set(medias[0], { left: () => 38 * vw(), top: () => 108 * vh(), width: () => 24 * vw(), height: () => 30 * vh(), xPercent: 0, yPercent: 0, x: 0, y: 0, borderRadius: 18 });
  medias.slice(1).forEach((m) => gsap.set(m, { ...split, xPercent: 0, yPercent: 0, x: 0, y: 0, clipPath: "inset(100% 0% 0% 0%)", borderRadius: 18 }));
  gsap.set(texts, { yPercent: -50, opacity: 0, y: 30 });
  gsap.set([over, count], { opacity: 0 });
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root, start: "top top", end: "bottom bottom", scrub: 0.9, invalidateOnRefresh: true,
      onUpdate(self) {
        const t = self.progress * tl.duration();
        emitIndex(root, t < 3.2 ? 0 : Math.min(n - 1, Math.floor((t - 3.2) / 1 + 1)));
      },
    },
  });
  tl.to(medias[0], { top: () => 46 * vh(), duration: 1 }, 0)
    .to(intro, { y: () => -18 * vh(), opacity: 0, duration: 0.8 }, 0.4)
    // Expand to full bleed.
    .to(medias[0], { left: 0, top: 0, width: () => 100 * vw(), height: () => 100 * vh(), borderRadius: 0, duration: 1 }, 1)
    .to(over, { opacity: 1, duration: 0.3 }, 1.7)
    // Settle into the split composition.
    .to(over, { opacity: 0, duration: 0.25 }, 2.3)
    .to(medias[0], { ...split, borderRadius: 18, duration: 0.8 }, 2.4)
    .to(texts[0], { opacity: 1, y: 0, duration: 0.3 }, 2.9)
    .to(count, { opacity: 1, duration: 0.2 }, 2.9);
  for (let i = 1; i < n; i++) {
    const at = 3.2 + (i - 1);
    tl.to(medias[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7 }, at)
      .fromTo(medias[i].querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 0.8 }, at)
      .to(texts[i - 1], { opacity: 0, y: -30, duration: 0.25 }, at)
      .to(texts[i], { opacity: 1, y: 0, duration: 0.3 }, at + 0.4);
  }
  tl.to({}, { duration: 0.5 });
}

function reel(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>(".reel__track");
  const prog = root.querySelector<HTMLElement>(".reel__progress");
  if (!track) return;
  const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const setLen = () => root.style.setProperty("--len", `${dist() + window.innerHeight}px`);
  setLen();
  gsap.to(track, {
    x: () => -dist(),
    ease: "none",
    scrollTrigger: {
      trigger: root, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true,
      onRefreshInit: setLen,
      onUpdate: (self) => prog?.style.setProperty("--p", String(self.progress)),
    },
  });
}

function closing(root: HTMLElement) {
  const frame = root.querySelector<HTMLElement>(".closing__frame");
  const text = root.querySelector<HTMLElement>(".closing__text");
  if (!frame) return;
  gsap.set(frame, { xPercent: -50, yPercent: -50 });
  const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true } });
  tl.fromTo(frame, { width: () => 34 * vw(), height: () => 46 * vh(), borderRadius: 18 }, { width: () => 100 * vw(), height: () => 100 * vh(), borderRadius: 0, duration: 1 }, 0)
    .fromTo(frame.querySelector("img"), { scale: 1.3 }, { scale: 1, duration: 1 }, 0)
    .fromTo(text, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.75)
    .to({}, { duration: 0.35 });
}

function slides(root: HTMLElement) {
  const items = gsap.utils.toArray<HTMLElement>(".slides__item", root);
  const n = items.length;
  if (n < 2) return;
  items.slice(1).forEach((it) => gsap.set(it, { yPercent: 105 }));
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root, start: "top top", end: "bottom bottom", scrub: 0.8,
      onUpdate(self) {
        emitIndex(root, Math.min(n - 1, Math.round(self.progress * (n - 1 + 0.3))));
      },
    },
  });
  for (let i = 1; i < n; i++) {
    tl.to(items[i], { yPercent: 0, duration: 1 }, i - 1)
      .to(items[i - 1], { scale: 0.93, opacity: 0.35, duration: 1 }, i - 1);
  }
  tl.to({}, { duration: 0.3 });
}

/* ---------- Component ---------- */

export default function Motion() {
  const pathname = usePathname();

  // Lenis — once, fine pointers only (touch keeps native scrolling).
  useEffect(() => {
    if (!window.matchMedia(MOTION_QUERY).matches) {
      document.documentElement.classList.remove("motion");
      document.documentElement.classList.add("no-motion");
      return;
    }
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: { offset: -72 } });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // Per-route choreography.
  useEffect(() => {
    window.__lenis?.resize();
    const root = document.documentElement;
    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];
    const scrubbed: { el: HTMLElement; html: string }[] = [];
    let stopHero = () => {};

    mm.add({ pin: PIN_QUERY, motion: MOTION_QUERY }, (ctx) => {
      const { pin, motion } = ctx.conditions as { pin: boolean; motion: boolean };
      root.classList.toggle("pin", pin);
      if (!motion) {
        window.__motionReady = true;
        window.__sfReady = true;
        return;
      }

      stopHero = heroEntrance();

      // Headlines: masked line-by-line reveal.
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        splits.push(
          SplitText.create(el, {
            type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true,
            onSplit(self) {
              gsap.set(el, { visibility: "visible" });
              return gsap.from(self.lines, { yPercent: 130, duration: D.line, stagger: 0.09, ease: EASE, delay: Number(el.dataset.delay ?? 0), scrollTrigger: { trigger: el, start: "top 88%", once: true } });
            },
          }),
        );
      });

      // Statements: words brighten in sync with scroll (reversible).
      gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((el) => {
        scrubbed.push({ el, html: el.innerHTML });
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        while (walker.nextNode()) nodes.push(walker.currentNode as Text);
        nodes.forEach((node) => {
          const frag = document.createDocumentFragment();
          node.textContent!.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else {
              const s = document.createElement("span");
              s.className = "w";
              s.textContent = part;
              frag.appendChild(s);
            }
          });
          node.replaceWith(frag);
        });
        el.classList.add("scrub");
        const words = [...el.querySelectorAll<HTMLElement>(".w")];
        ScrollTrigger.create({
          trigger: el, start: "top 82%", end: "bottom 42%", scrub: true,
          onUpdate(self) {
            const k = Math.round(self.progress * words.length);
            words.forEach((w, i) => w.classList.toggle("on", i < k));
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal='fade']").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: D.fade, ease: EASE, delay: Number(el.dataset.delay ?? 0), scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal='mask']").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ delay: Number(el.dataset.delay ?? 0), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: D.mask, ease: "expo.inOut" });
        if (img) tl.fromTo(img, { scale: 1.22 }, { scale: 1, duration: 2, ease: EASE }, 0.1);
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const a = Number(el.dataset.parallax || 10);
        gsap.fromTo(el, { yPercent: -a / 2 }, { yPercent: a / 2, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // Sticky hero: drifts and dims slightly as the next section slides over it.
      gsap.utils.toArray<HTMLElement>("[data-hero]").forEach((hero) => {
        const media = hero.querySelector("[data-hero-drift]");
        if (media) gsap.to(media, { scale: 1.08, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const raw = el.dataset.count ?? "";
        if (!/^[\d,.]+$/.test(raw)) return;
        const dec = raw.includes(".") ? raw.split(".")[1].length : 0;
        const pad = raw.startsWith("0") && raw.length > 1 ? raw.length : 0;
        const target = Number(raw.replace(/,/g, ""));
        const fmt = (v: number) => (dec ? v.toFixed(dec) : raw.includes(",") ? Math.round(v).toLocaleString("en-US") : String(Math.round(v)).padStart(pad, "0"));
        const o = { v: 0 };
        el.textContent = fmt(0);
        gsap.to(o, { v: target, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", once: true }, onUpdate: () => (el.textContent = fmt(o.v)), onComplete: () => (el.textContent = raw) });
      });

      gsap.utils.toArray<SVGElement>("[data-mark-anim]").forEach((svg) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 85%", once: true } });
        tl.from(svg.querySelector("[data-part='square']"), { yPercent: 30, opacity: 0, duration: 1.2, ease: EASE })
          .from(svg.querySelector("[data-part='sun']"), { y: 80, scale: 0.6, transformOrigin: "50% 50%", opacity: 0, duration: 1.5, ease: EASE }, 0.2)
          .from(svg.querySelector("[data-part='overlap']"), { opacity: 0, duration: 0.6 }, 0.95);
      });

      if (pin) {
        gsap.utils.toArray<HTMLElement>("[data-seq='collage']").forEach(collage);
        gsap.utils.toArray<HTMLElement>("[data-seq='discover']").forEach(discover);
        gsap.utils.toArray<HTMLElement>("[data-seq='explore']").forEach(explore);
        gsap.utils.toArray<HTMLElement>("[data-seq='hseq']").forEach(hseq);
        gsap.utils.toArray<HTMLElement>("[data-seq='reel']").forEach(reel);
        gsap.utils.toArray<HTMLElement>("[data-seq='closing']").forEach(closing);
        gsap.utils.toArray<HTMLElement>("[data-seq='slides']").forEach(slides);
      }

      window.__motionReady = true;
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        root.classList.remove("pin");
        stopHero();
        splits.splice(0).forEach((s) => s.revert());
        scrubbed.splice(0).forEach(({ el, html }) => {
          el.innerHTML = html;
          el.classList.remove("scrub");
        });
        gsap.utils.toArray<HTMLElement>("[data-seq='reel']").forEach((r) => r.style.removeProperty("--len"));
      };
    });

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 600);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
