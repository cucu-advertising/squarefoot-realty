/** Motion + navigation checks. BASE_URL=http://localhost:3000 node scripts/motion-test.mjs */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require(execSync("npm root -g").toString().trim() + "/playwright"); }
const { chromium, devices } = pw;
const BASE = process.env.BASE_URL || "http://localhost:3000";
const results = [];
const ok = (n, c, d = "") => { results.push(!!c); console.log(`${c ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`); };
const browser = await chromium.launch();

/* Desktop */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  ok("single Lenis instance on desktop", await page.evaluate(() => !!window.__lenis && document.documentElement.classList.contains("lenis")));
  ok("no CSS smooth-scroll competing", (await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)) === "auto");

  // wheel → eased movement over several frames, settling near the target
  await page.mouse.move(700, 450);
  const samples = await page.evaluate(async () => {
    const out = [];
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 600, bubbles: true, cancelable: true }));
    for (let i = 0; i < 90; i++) { await new Promise((r) => requestAnimationFrame(r)); out.push(Math.round(window.scrollY)); }
    return out;
  });
  const distinct = new Set(samples).size;
  const monotonic = samples.every((v, i) => i === 0 || v >= samples[i - 1]);
  ok("wheel scroll is interpolated (no jump)", distinct > 12 && monotonic, `${distinct} intermediate positions, ends at ${samples.at(-1)}px`);
  ok("wheel scroll settles at target (no overshoot/jacking)", Math.abs(samples.at(-1) - 600) < 12);

  // headings: split into masked lines, hidden before, revealed after scrolling to them
  const total = await page.locator("[data-split]").count();
  const split = await page.evaluate(() => [...document.querySelectorAll("[data-split]")].filter((e) => e.querySelector(".split-line")).length);
  ok("all headings split into masked lines", split === total && total >= 9, `${split}/${total}`);
  const before = await page.evaluate(() => { const l = document.querySelector("#gal-title .split-line"); return new DOMMatrix(getComputedStyle(l).transform).m42; });
  ok("off-screen heading waits below its mask", before > 20, `translateY ${Math.round(before)}px`);
  await page.evaluate(() => window.__lenis.scrollTo("#gallery", { immediate: true, offset: -84 }));
  await page.waitForTimeout(1700);
  const after = await page.evaluate(() => [...document.querySelectorAll("#gal-title .split-line")].map((l) => Math.round(new DOMMatrix(getComputedStyle(l).transform).m42)));
  ok("heading lines revealed after scroll", after.length >= 1 && after.every((v) => v === 0), `lines=${after.length}`);
  ok("heading text preserved for assistive tech", (await page.locator("#gal-title").getAttribute("aria-label"))?.includes("Squarely in the lap"));

  // parallax moves with scroll
  const p1 = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector(".intro__wide .px")).transform).m42);
  await page.evaluate(() => window.__lenis.scrollTo(".intro__wide", { immediate: true }));
  await page.waitForTimeout(400);
  const p2 = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector(".intro__wide .px")).transform).m42);
  ok("image parallax is scrubbed to scroll", Math.abs(p1 - p2) > 5, `${Math.round(p1)} → ${Math.round(p2)}px`);

  // anchor navigation from the navbar
  await page.evaluate(() => window.__lenis.scrollTo(0, { immediate: true }));
  await page.waitForTimeout(300);
  await page.locator(".header__nav a", { hasText: "Location" }).click();
  await page.waitForTimeout(2400);
  const top = await page.evaluate(() => Math.round(document.getElementById("location").getBoundingClientRect().top));
  ok("anchor nav lands below the header", top >= 60 && top <= 110, `section top at ${top}px`);
  ok("anchor nav updates URL hash", page.url().endsWith("/#location"));
  ok("active nav state follows section", (await page.locator(".header__nav a.is-active").innerText()).toLowerCase() === "location");
  const headBox = await page.locator("#loc-title").boundingBox();
  const hdrH = await page.evaluate(() => { const h = document.querySelector("header"); return h.classList.contains("header--hidden") ? 0 : h.getBoundingClientRect().bottom; });
  ok("header does not cover the section heading", headBox.y > hdrH, `heading y=${Math.round(headBox.y)} header bottom=${Math.round(hdrH)}`);

  await page.locator(".header__nav a", { hasText: "Residences" }).click();
  await page.waitForTimeout(2400);
  ok("second anchor", page.url().endsWith("/#residences"));
  await page.goBack();
  await page.waitForTimeout(2400);
  const backTop = await page.evaluate(() => Math.round(document.getElementById("location").getBoundingClientRect().top));
  ok("browser Back returns to previous section", page.url().endsWith("/#location") && Math.abs(backTop - 84) < 60, `top=${backTop}`);
  await page.goForward();
  await page.waitForTimeout(2400);
  ok("browser Forward works", page.url().endsWith("/#residences"));

  // cross-page: route change resets to top, Back restores position
  await page.evaluate(() => window.__lenis.scrollTo(document.body.scrollHeight, { immediate: true }));
  await page.waitForTimeout(900);
  const yBefore = await page.evaluate(() => Math.round(window.scrollY));
  await page.locator('.footer a[href="/about"]').click();
  await page.waitForURL("**/about");
  await page.waitForTimeout(1200);
  ok("new page starts at top", (await page.evaluate(() => window.scrollY)) < 5);
  ok("still one Lenis after route change", await page.evaluate(() => !!window.__lenis && document.querySelectorAll("html.lenis").length === 1));
  ok("about heading split + visible", await page.evaluate(() => { const h = document.querySelector("h1[data-split]"); return !!h.querySelector(".split-line") && getComputedStyle(h).visibility === "visible"; }));
  await page.goBack();
  await page.waitForURL(BASE + "/**");
  await page.waitForTimeout(1500);
  const yAfter = await page.evaluate(() => Math.round(window.scrollY));
  ok("Back restores scroll position", Math.abs(yAfter - yBefore) < 150, `${yBefore} → ${yAfter}`);
  ok("ScrollTriggers cleaned up and rebuilt (no leak)", await page.evaluate(() => document.querySelectorAll("#gal-title .split-line-mask").length > 0 && document.querySelectorAll("#gal-title .split-line-mask .split-line-mask").length === 0));

  // from another page to a home anchor
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.locator('.header__nav a[href="/#amenities"]').click();
  await page.waitForURL("**/#amenities");
  await page.waitForTimeout(2500);
  const at = await page.evaluate(() => Math.round(document.getElementById("amenities").getBoundingClientRect().top));
  ok("cross-page anchor lands on the section", at > -40 && at < 140, `top=${at}`);

  // scroll lock while modal open; inner modal can still scroll
  await page.evaluate(() => window.__lenis.scrollTo(0, { immediate: true }));
  await page.waitForTimeout(300);
  await page.locator(".hero .btn--brochure").click();
  await page.locator("dialog.modal[open]").waitFor();
  const y0 = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(600);
  ok("page does not scroll behind an open modal", (await page.evaluate(() => window.scrollY)) === y0);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1200);
  ok("scrolling resumes after modal closes", (await page.evaluate(() => window.scrollY)) > 200);

  // sticky amenity nav holds while its section scrolls
  await page.evaluate(() => window.__lenis.scrollTo("#amenities", { immediate: true, offset: 500 }));
  await page.waitForTimeout(600);
  const navTop = await page.evaluate(() => Math.round(document.querySelector(".amen__nav ol").getBoundingClientRect().top));
  ok("sticky amenity navigation holds position", Math.abs(navTop - 100) <= 2, `top=${navTop}`);

  // jank probe: frame pacing during a long programmatic glide
  const frames = await page.evaluate(async () => {
    window.__lenis.scrollTo(0, { immediate: true });
    await new Promise((r) => setTimeout(r, 200));
    window.__lenis.scrollTo(9000, { duration: 3 });
    const gaps = []; let last = performance.now(); const end = last + 3000;
    while (performance.now() < end) { await new Promise((r) => requestAnimationFrame(r)); const n = performance.now(); gaps.push(n - last); last = n; }
    gaps.sort((a, b) => a - b);
    return { n: gaps.length, p95: gaps[Math.floor(gaps.length * 0.95)], max: gaps.at(-1) };
  });
  ok("frame pacing during long scroll", frames.p95 < 34, `${frames.n} frames, p95 ${frames.p95.toFixed(1)}ms, worst ${frames.max.toFixed(1)}ms`);
  ok("no console/page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

/* Touch device: native scrolling, text reveals still work */
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  ok("mobile keeps native touch scrolling (no Lenis)", await page.evaluate(() => !window.__lenis));
  ok("mobile headings still reveal by line", await page.evaluate(() => !!document.querySelector("#intro-title .split-line")));
  ok("mobile: no parallax transforms", await page.evaluate(() => getComputedStyle(document.querySelector(".intro__wide .px")).transform === "none"));
  await page.locator(".header__toggle").click();
  await page.locator("#mobile-menu a", { hasText: "Gallery" }).click();
  await page.waitForTimeout(1800);
  const t = await page.evaluate(() => Math.round(document.getElementById("gallery").getBoundingClientRect().top));
  ok("mobile menu anchor lands on section", t > 30 && t < 130 && !(await page.locator("#mobile-menu").isVisible()), `top=${t}`);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  ok("mobile: nothing left hidden at page end", await page.evaluate(() => getComputedStyle(document.querySelector(".footer__tagline")).visibility === "visible"));
  ok("mobile: no horizontal overflow after animations", await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  await ctx.close();
}

/* Reduced motion */
{
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  ok("reduced motion: no smooth-scroll engine", await page.evaluate(() => !window.__lenis));
  ok("reduced motion: headings visible, unsplit", await page.evaluate(() => [...document.querySelectorAll("[data-split]")].every((h) => getComputedStyle(h).visibility === "visible" && !h.querySelector(".split-line"))));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} motion checks passed`);
process.exit(failed ? 1 : 0);
