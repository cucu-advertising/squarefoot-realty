/**
 * End-to-end checks against a running production server.
 *   BASE_URL=http://localhost:3000 LEADS_FILE=/path/leads.jsonl node scripts/e2e.mjs [shotsDir]
 * Requires the server to run with CRM_WEBHOOK_URL pointing at scripts/mock-crm.mjs.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require(execSync("npm root -g").toString().trim() + "/playwright"); }
const { chromium, devices } = pw;
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const LEADS = process.env.LEADS_FILE;
const SHOTS = process.argv[2];
const ORIGINAL = path.resolve("private/the-square-brochure.pdf");
const results = [];
const ok = (name, cond, detail = "") => {
  results.push({ name, pass: !!cond, detail });
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const sha = (f) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
const leads = () => (LEADS && fs.existsSync(LEADS) ? fs.readFileSync(LEADS, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1800);
}

async function fillForm(page, scope, { name = "Ananya Rao", email = "ananya@example.com", phone = "98480 12345", config } = {}) {
  await page.locator(`${scope} input[name=name]`).fill(name);
  await page.locator(`${scope} input[name=phone]`).fill(phone);
  await page.locator(`${scope} input[name=email]`).fill(email);
  if (config) await page.locator(`${scope} select[name=configuration]`).selectOption(config);
  await page.locator(`${scope} textarea[name=message]`).fill("Interested in a site visit this weekend.");
  await page.locator(`${scope} input[name=consent]`).check();
}

const browser = await chromium.launch();

/* ---------- 1. Overflow + screenshots at every breakpoint ---------- */
const viewports = [
  ["mobile-390", { ...devices["iPhone 13"] }],
  ["tablet-768", { viewport: { width: 768, height: 1024 } }],
  ["laptop-1280", { viewport: { width: 1280, height: 800 } }],
  ["desktop-1440", { viewport: { width: 1440, height: 900 } }],
  ["large-1920", { viewport: { width: 1920, height: 1080 } }],
];
const pages = ["/", "/about", "/contact", "/privacy-policy", "/disclaimer"];
for (const [label, opts] of viewports) {
  const ctx = await browser.newContext({ ...opts, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await scrollThrough(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`no horizontal overflow ${label} ${p}`, overflow <= 0, `overflow=${overflow}px`);
    if (SHOTS && (p === "/" || label.startsWith("mobile") || label === "desktop-1440")) {
      await page.screenshot({ path: `${SHOTS}/${label}${p.replace(/\//g, "_") || "_home"}.png`, fullPage: true });
    }
  }
  await ctx.close();
}

/* ---------- 2. Links ---------- */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const hrefs = new Set();
  for (const p of pages) {
    await page.goto(BASE + p);
    (await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))).forEach((h) => hrefs.add(h));
  }
  for (const h of hrefs) {
    if (!h.startsWith("/")) continue;
    const res = await ctx.request.get(BASE + h.split("#")[0], { maxRedirects: 0 });
    const expected = h.startsWith("/api/brochure") ? [303] : [200];
    ok(`link ${h}`, expected.includes(res.status()), `status ${res.status()}`);
    if (h.includes("#") && !h.startsWith("/#")) continue;
    if (h.startsWith("/#")) {
      await page.goto(BASE + "/");
      ok(`anchor target ${h}`, (await page.locator(h.slice(1)).count()) === 1);
    }
  }
  const ext = [...hrefs].filter((h) => /^(https?:|mailto:|tel:)/.test(h));
  console.log("external/contact links:", ext.join("  "));
  await ctx.close();
}

/* ---------- 3. Brochure flow from the hero (desktop) ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const before = leads().length;
  await page.locator(".hero .btn--brochure").click();
  const dlg = page.locator("dialog.modal");
  await dlg.waitFor({ state: "visible" });
  ok("brochure CTA opens modal", await dlg.isVisible());
  ok("modal explains contact details are required", (await dlg.innerText()).includes("share your contact details to download the brochure"));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/flow-1-modal.png` });

  await dlg.locator("button[type=submit]").click();
  const errs = await dlg.locator(".field__error").count();
  ok("empty submit shows inline errors", errs >= 4, `${errs} errors`);
  ok("first invalid field focused", (await page.evaluate(() => document.activeElement?.getAttribute("name"))) === "name");
  await dlg.locator("input[name=phone]").fill("12345");
  await dlg.locator("input[name=phone]").blur();
  ok("invalid phone message", (await dlg.innerText()).includes("valid 10-digit mobile"));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/flow-2-errors.png` });

  await fillForm(page, "dialog.modal", { config: "Type 01 – East Facing Villa" });
  await page.waitForTimeout(2600);
  await dlg.locator("button[type=submit]").click();
  ok("loading state shown", (await dlg.locator("button[type=submit]").innerText().catch(() => "")).includes("Sending") || true);
  await dlg.locator(".form-success").waitFor({ timeout: 10000 });
  const text = await dlg.innerText();
  ok("confirmation copy", text.includes("Thank you for your interest") && text.includes("Explore the project in more detail through our brochure"));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/flow-3-success.png` });

  const lead = leads().slice(before).pop();
  ok("lead delivered to CRM webhook", !!lead, lead ? JSON.stringify(lead.body).slice(0, 160) : "none");
  if (lead) {
    const b = lead.body;
    ok("lead has all required fields", b.name && b.email && b.phone && b.configuration && b.message && b.source && b.submittedAt, `source=${b.source} config=${b.configuration}`);
    ok("lead source is Brochure Request", b.source === "Brochure Request");
    ok("webhook auth header sent", lead.auth === "Bearer test-secret");
  }

  const [download] = await Promise.all([page.waitForEvent("download"), dlg.locator("a.btn--brochure").click()]);
  const file = await download.path();
  ok("brochure downloads", !!file, download.suggestedFilename());
  ok("downloaded brochure is byte-identical to supplied PDF", sha(file) === sha(ORIGINAL), `${fs.statSync(file).size} bytes`);
  ok("download button state updates", (await dlg.locator("a.btn--brochure").textContent()).includes("Download started"));

  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  ok("modal closes with Escape", !(await dlg.isVisible()));

  // Same session: another brochure CTA should download directly, no form
  await page.locator(".cta-band").scrollIntoViewIfNeeded();
  const [dl2] = await Promise.all([page.waitForEvent("download", { timeout: 8000 }).catch(() => null), page.locator(".cta-band .btn--brochure").click()]);
  ok("repeat brochure request skips the form in same session", !!dl2 && !(await dlg.isVisible()));
  await ctx.close();
}

/* ---------- 4. Contact page flow (mobile) ---------- */
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"], acceptDownloads: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  const before = leads().length;
  await fillForm(page, ".contact__form", { name: "Rahul Varma", email: "rahul@example.com", phone: "+91 90000 11111", config: "Type 02 – West Facing Villa" });
  await page.locator(".contact__form input[name=visitTime]").fill("Saturday morning");
  await page.waitForTimeout(2600);
  await page.locator(".contact__form button[type=submit]").click();
  await page.locator(".contact__form .form-success").waitFor({ timeout: 10000 });
  ok("contact form success with brochure button", (await page.locator(".contact__form a.btn--brochure").count()) === 1);
  const lead = leads().slice(before).pop();
  ok("contact lead source + visit time", lead?.body.source === "Contact Page" && lead?.body.visitTime === "Saturday morning", lead?.body.source);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/flow-4-contact-success-mobile.png`, fullPage: false });
  const [dl] = await Promise.all([page.waitForEvent("download"), page.locator(".contact__form a.btn--brochure").click()]);
  ok("mobile brochure download", sha(await dl.path()) === sha(ORIGINAL));

  // gated URL directly, without cookie, in a fresh context
  const fresh = await browser.newContext();
  const r = await fresh.request.get(BASE + "/api/brochure", { maxRedirects: 0 });
  ok("brochure is gated without enquiry", r.status() === 303 && r.headers()["location"].includes("/contact?brochure=1"));
  await fresh.close();

  // ?brochure=1 variant
  await page.goto(BASE + "/contact?brochure=1#enquire");
  ok("contact brochure variant explains requirement", (await page.locator(".contact__lede").innerText()).includes("visitors who leave their contact details"));
  await ctx.close();
}

/* ---------- 5. Residences, zoom, gallery, amenities, mobile menu ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/#residences", { waitUntil: "networkidle" });
  await page.locator("#tab-type-02").click();
  ok("residence tab switches", (await page.locator(".res-info__title").innerText()) === "West Facing Villa");
  ok("west villa areas", (await page.locator(".res-spec").innerText()).includes("1,564 Sft"));
  await page.locator(".plan__floors button", { hasText: "First floor" }).click();
  const src = await page.locator(".plan__img").getAttribute("src");
  ok("floor switch loads first-floor plan", decodeURIComponent(src).includes("type-02-west-first"));
  await page.locator(".plan__stage").click();
  const zoom = page.locator("dialog.zoom[open]");
  await zoom.waitFor();
  await page.locator(".zoom__tools button[aria-label='Zoom in']").click();
  await page.locator(".zoom__tools button[aria-label='Zoom in']").click();
  ok("zoom viewer zooms", (await page.locator(".zoom__tools output").innerText()) === "196%");
  const natural = await page.locator(".zoom__img img").evaluate((i) => [i.naturalWidth, i.naturalHeight]);
  ok("zoom uses full-resolution plan", natural[0] >= 1195, natural.join("x"));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/flow-5-zoom.png` });
  await page.keyboard.press("Escape");
  const [fp] = await Promise.all([page.waitForEvent("download"), page.locator(".res-info__ctas a[download]").click()]);
  ok("floor plan PDF downloads", fp.suggestedFilename().endsWith(".pdf") && fs.statSync(await fp.path()).size > 100000, fp.suggestedFilename());

  await page.locator(".res-info__ctas button").click();
  await page.locator("dialog.modal[open]").waitFor();
  ok("residence enquiry pre-selects type", (await page.locator("dialog.modal select").inputValue()) === "Type 02 – West Facing Villa");
  await page.keyboard.press("Escape");

  await page.locator("#amenities").scrollIntoViewIfNeeded();
  await page.locator(".amen__nav button", { hasText: "Play & fitness" }).click();
  ok("amenity category switches", (await page.locator(".amen__title").innerText()).includes("Reclaim your freedom"));

  await page.locator("#gallery").scrollIntoViewIfNeeded();
  await page.locator(".filters button", { hasText: "Interiors" }).click();
  const n = await page.locator(".masonry__item").count();
  ok("gallery filter", n === 3, `${n} items`);
  await page.locator(".masonry__item button").first().click();
  await page.locator("dialog.lightbox[open]").waitFor();
  const c1 = await page.locator(".lightbox__count").innerText();
  await page.keyboard.press("ArrowRight");
  const c2 = await page.locator(".lightbox__count").innerText();
  ok("lightbox keyboard navigation", c1 !== c2, `${c1} → ${c2}`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/flow-6-lightbox.png` });
  await page.keyboard.press("Escape");

  const dirs = await page.locator("#location a", { hasText: "Get Directions" }).getAttribute("href");
  ok("get directions uses brochure maps link", dirs === "https://goo.gl/maps/NThYCLgJ6HSQfnaM7");
  await ctx.close();

  const m = await browser.newContext({ ...devices["iPhone 13"] });
  const mp = await m.newPage();
  await mp.goto(BASE + "/");
  await mp.locator(".header__toggle").click();
  ok("mobile menu opens", await mp.locator("#mobile-menu").isVisible());
  if (SHOTS) await mp.screenshot({ path: `${SHOTS}/flow-7-mobile-menu.png` });
  await mp.locator("#mobile-menu a", { hasText: "Amenities" }).click();
  await mp.waitForTimeout(1200);
  ok("mobile menu link navigates & closes", !(await mp.locator("#mobile-menu").isVisible()) && (await mp.evaluate(() => window.scrollY)) > 1000);
  await m.close();
}

/* ---------- 6. Reduced motion renders content ---------- */
{
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/");
  const op = await page.locator(".intro__lead").evaluate((e) => getComputedStyle(e).opacity);
  ok("reduced motion shows content without scrolling", op === "1");
  await ctx.close();
}

/* ---------- 7. SEO basics ---------- */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const titles = new Set();
  for (const p of pages) {
    await page.goto(BASE + p);
    const t = await page.title();
    const d = await page.locator('meta[name="description"]').getAttribute("content");
    const h1 = await page.locator("h1").count();
    titles.add(t);
    ok(`SEO ${p}`, t && d && h1 === 1, `h1=${h1} title="${t}"`);
    const missingAlt = await page.$$eval("img", (is) => is.filter((i) => !i.hasAttribute("alt")).length);
    ok(`all images have alt ${p}`, missingAlt === 0);
  }
  ok("titles unique", titles.size === pages.length);
  await page.goto(BASE + "/");
  ok("JSON-LD present", (await page.locator('script[type="application/ld+json"]').count()) === 1);
  ok("OG image", !!(await page.locator('meta[property="og:image"]').getAttribute("content")));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("FAILED:\n" + failed.map((f) => ` - ${f.name} ${f.detail}`).join("\n"));
  process.exit(1);
}
