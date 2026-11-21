// End-to-end functional checks against a running server.
// Usage: BASE=http://localhost:3100 node tests/e2e.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import crypto from "node:crypto";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");

const BASE = process.env.BASE ?? "http://localhost:3100";
const LEADS = process.env.LEADS_FILE ?? "data/leads.jsonl";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};
const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const leadCount = () => (fs.existsSync(LEADS) ? fs.readFileSync(LEADS, "utf8").trim().split("\n").filter(Boolean).length : 0);

const valid = (over = {}) => ({
  kind: "brochure",
  name: "Test Visitor",
  email: "test.visitor@example.com",
  phone: "9876543210",
  project: "the-square",
  consent: true,
  source: "e2e",
  startedAt: Date.now() - 10_000,
  submissionId: crypto.randomUUID(),
  ...over,
});
const post = (body, headers = {}) =>
  fetch(`${BASE}/api/enquiry`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: BASE, "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}`, ...headers },
    body: JSON.stringify(body),
  });

// ---------- Routes ----------
for (const p of ["/", "/about", "/projects", "/contact", "/privacy", "/sitemap.xml", "/robots.txt",
  "/projects/squarefoot-origin", "/projects/the-square", "/projects/the-urban-ranch", "/projects/trans-elite", "/projects/challa-elite"]) {
  const r = await fetch(BASE + p);
  check(`GET ${p}`, r.status === 200, String(r.status));
}
check("Unknown project 404", (await fetch(`${BASE}/projects/nope`)).status === 404);

// ---------- Brochure files are not public ----------
for (const p of ["/the-square.pdf", "/brochures/the-square.pdf", "/private/brochures/the-square.pdf", "/api/brochure/the-square"]) {
  const r = await fetch(BASE + p, { redirect: "manual", headers: { accept: "application/json" } });
  check(`No public access ${p}`, r.status === 403 || r.status === 404, String(r.status));
}
{
  const r = await fetch(`${BASE}/api/brochure/the-square`, { redirect: "manual", headers: { accept: "text/html" } });
  check("Ungated browser hit redirects to project form", r.status === 303 && r.headers.get("location")?.includes("/projects/the-square"), `${r.status} ${r.headers.get("location")}`);
}

// ---------- Validation & spam ----------
{
  const r = await post(valid({ name: "", email: "bad", phone: "123", consent: false }));
  const j = await r.json();
  check("Server rejects invalid fields (422)", r.status === 422 && j.fields?.name && j.fields?.email && j.fields?.phone && j.fields?.consent, JSON.stringify(j.fields));
}
check("Honeypot rejected", (await post(valid({ company: "spam inc" }))).status === 400);
check("Too-fast submission rejected", (await post(valid({ startedAt: Date.now() }))).status === 400);
check("Cross-origin POST rejected", (await post(valid(), { origin: "https://evil.example" })).status === 403);
check("Unknown project rejected", (await post(valid({ project: "made-up" }))).status === 422);
{
  const r = await post(valid({ project: "squarefoot-origin" }));
  check("Brochure request for project without brochure → 404 state", r.status === 404, String(r.status));
}

// ---------- Successful gated flow ----------
const before = leadCount();
const sub = valid();
const r1 = await post(sub);
const j1 = await r1.json();
check("Valid brochure enquiry accepted", r1.status === 200 && j1.ok && j1.downloadUrl?.startsWith("/api/brochure/the-square?token="), JSON.stringify(j1).slice(0, 120));
const cookie = r1.headers.get("set-cookie")?.split(";")[0];
check("Access cookie issued (httpOnly)", Boolean(cookie) && /HttpOnly/i.test(r1.headers.get("set-cookie") ?? ""));
check("Lead recorded once", leadCount() === before + 1, `${before} → ${leadCount()}`);
{
  const lead = JSON.parse(fs.readFileSync(LEADS, "utf8").trim().split("\n").pop());
  const fields = ["name", "email", "phone", "project", "source", "timestamp", "consent", "consentText", "consentAt", "kind"];
  check("Lead has name/email/phone/project/source/timestamp/consent", fields.every((f) => lead[f] !== undefined) && lead.phone === "+919876543210", fields.filter((f) => lead[f] === undefined).join(","));
}
{
  const dup = await post(sub);
  const jd = await dup.json();
  check("Duplicate submission is idempotent", jd.id === j1.id && leadCount() === before + 1);
}
{
  const r = await fetch(BASE + j1.downloadUrl);
  const buf = Buffer.from(await r.arrayBuffer());
  const expected = fs.readFileSync("private/brochures/the-square.pdf");
  check("Token downloads the correct PDF", r.status === 200 && r.headers.get("content-type") === "application/pdf" && sha(buf) === sha(expected), `${r.status} ${buf.length}B`);
  check("Download is an attachment, not cached publicly", /attachment/.test(r.headers.get("content-disposition") ?? "") && /no-store/.test(r.headers.get("cache-control") ?? ""));
}
{
  const token = new URL(BASE + j1.downloadUrl).searchParams.get("token");
  const r = await fetch(`${BASE}/api/brochure/challa-elite?token=${encodeURIComponent(token)}`, { headers: { accept: "application/json" } });
  check("Token for one project cannot unlock another", r.status === 403, String(r.status));
  const tampered = token.slice(0, -3) + (token.endsWith("AAA") ? "BBB" : "AAA");
  const r2 = await fetch(`${BASE}/api/brochure/the-square?token=${encodeURIComponent(tampered)}`, { headers: { accept: "application/json" } });
  check("Tampered token rejected", r2.status === 403, String(r2.status));
}
{
  const s = await (await fetch(`${BASE}/api/brochure-status?project=the-square`, { headers: { cookie } })).json();
  check("Session cookie marks brochure unlocked", s.unlocked === true);
  const r = await fetch(`${BASE}/api/brochure/the-square`, { headers: { cookie, accept: "application/json" } });
  check("Session cookie re-download works without re-entering details", r.status === 200);
  const r2 = await fetch(`${BASE}/api/brochure/challa-elite`, { headers: { cookie, accept: "application/json" } });
  check("Session cookie does not unlock other projects", r2.status === 403);
}
for (const slug of ["challa-elite", "trans-elite"]) {
  const r = await post(valid({ project: slug }));
  const j = await r.json();
  const d = await fetch(BASE + j.downloadUrl);
  const buf = Buffer.from(await d.arrayBuffer());
  check(`Correct brochure for ${slug}`, sha(buf) === sha(fs.readFileSync(`private/brochures/${slug}.pdf`)), `${buf.length}B`);
}
{
  const r = await post(valid({ kind: "contact", project: "squarefoot-origin", message: "Site visit please" }));
  const j = await r.json();
  check("Contact enquiry accepted (no download link)", r.status === 200 && j.ok && !j.downloadUrl);
}

// ---------- Browser flows ----------
const browser = await chromium.launch();
const consoleErrors = [];
// Wait for the first-visit preloader and the hero entrance to finish.
const ready = async (page) => {
  await page.waitForFunction(() => window.__sfReady === true, null, { timeout: 15000 });
  await sleep(1800);
};
const heroBrochure = (page) => page.locator(".hero").getByRole("button", { name: /Download brochure/ });

// Desktop: gated brochure via modal
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => consoleErrors.push(e.message));
  await page.goto(`${BASE}/projects/the-square`, { waitUntil: "networkidle" });
  await ready(page);
  await heroBrochure(page).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(/Full name/).waitFor();
  check("Brochure modal opens with form", await dialog.getByText("Download The Square brochure").isVisible());
  await dialog.getByRole("button", { name: /Unlock brochure/ }).click();
  check("Client-side validation shows errors", (await dialog.locator(".field__error").count()) >= 3);
  await sleep(2600);
  await dialog.getByLabel(/Full name/).fill("Browser Tester");
  await dialog.getByLabel(/Mobile number/).fill("+91 98765 43210");
  await dialog.getByLabel(/^Email/).fill("browser@example.com");
  await dialog.locator("label.check").click();
  await dialog.getByRole("button", { name: /Unlock brochure/ }).click();
  await dialog.getByText("Thank you for your interest.").waitFor({ timeout: 10000 });
  check("Success state shows after server confirms", true);
  const [download] = await Promise.all([page.waitForEvent("download"), dialog.getByRole("link", { name: /Download brochure/ }).click()]);
  const path = await download.path();
  check("Browser downloads the correct brochure", download.suggestedFilename().startsWith("The-Square") && sha(fs.readFileSync(path)) === sha(fs.readFileSync("private/brochures/the-square.pdf")), download.suggestedFilename());
  await page.keyboard.press("Escape");
  await sleep(500);
  // Re-open: should skip the form in the same session
  await heroBrochure(page).click();
  await dialog.getByText("Thank you for your interest.").waitFor({ timeout: 5000 });
  check("Same session: brochure available without re-entering details", true);
  await page.keyboard.press("Escape");

  // Floor plan tabs + lightbox
  await page.getByRole("tab", { name: /Type 02/ }).click();
  check("Floor-plan tab switches", (await page.locator("#plan-panel img").getAttribute("alt"))?.includes("Type 02"));
  await page.getByRole("button", { name: /Expand plan/ }).click();
  const lb = page.getByRole("dialog", { name: "Floor plan viewer" });
  await lb.waitFor();
  await lb.getByRole("button", { name: "Zoom in" }).click();
  check("Plan viewer zoom toggles", (await lb.getByRole("button", { name: "Zoom out" }).count()) === 1);
  await page.keyboard.press("Escape");
  check("Plan viewer closes on Escape", (await page.getByRole("dialog", { name: "Floor plan viewer" }).count()) === 0);

  // Gallery lightbox w/ arrows
  await page.locator(".focus__open").first().click();
  const gl = page.getByRole("dialog", { name: "Gallery" });
  await gl.waitFor();
  const c1 = await gl.locator(".lightbox__counter").innerText();
  await page.keyboard.press("ArrowRight");
  const c2 = await gl.locator(".lightbox__counter").innerText();
  check("Gallery lightbox navigates", c1 !== c2, `${c1} → ${c2}`);
  await page.keyboard.press("Escape");

  // Map click-to-load
  await page.getByRole("button", { name: "Load map" }).click();
  check("Map loads on request", (await page.locator(".map iframe").count()) === 1);

  // Desktop nav + dropdown + active state + back/forward
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Show projects" }).click();
  await page.locator("#nav-projects").getByRole("link", { name: /Challa Elite/ }).click();
  await page.waitForURL("**/projects/challa-elite");
  check("Nav dropdown navigates to project", page.url().endsWith("/projects/challa-elite"));
  check("Active nav indicator", (await page.locator(".nav a[aria-current='page']").first().innerText()).toUpperCase().includes("PROJECTS"));
  await page.goBack();
  await page.waitForURL(BASE + "/");
  await page.goForward();
  await page.waitForURL("**/challa-elite");
  check("Browser back/forward works", page.url().endsWith("/challa-elite"));

  // Projects overview: every verified project is presented
  await page.goto(`${BASE}/projects`, { waitUntil: "networkidle" });
  const active = (await page.locator(".stackc__card h3").allTextContents()).map((t) => t.trim());
  const delivered = (await page.locator(".reel__card .reel__cap b").allTextContents()).map((t) => t.trim());
  check("Projects page lists the 3 active projects", active.join("|") === "Squarefoot Origin|The Square|The Urban Ranch", active.join(", "));
  check("Projects page lists the 4 delivered projects", ["Trans Elite", "Challa Elite", "Trans Arcade", "Lokeshwari Residency"].every((n) => delivered.includes(n)), delivered.join(", "));
  check("Projects page: Origin card uses a supplied render", (await page.locator(".stackc__card").first().locator("img").getAttribute("src"))?.includes("squarefoot-origin"));
  {
    const btn = page.locator(".stackc__card .pill--light").last(); // earlier cards sit under later ones
    await btn.scrollIntoViewIfNeeded();
    await sleep(900);
    const before = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
    await btn.hover();
    await sleep(600);
    const after = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
    check("Light buttons turn black on hover", after === "rgb(26, 26, 24)" && before !== after, `${before} → ${after}`);
  }

  // Squarefoot Origin: supplied renders and plans are wired in, and every image on the page serves
  await page.goto(`${BASE}/projects/squarefoot-origin`, { waitUntil: "networkidle" });
  await ready(page);
  check("Origin hero uses a supplied render", (await page.locator(".hero img").first().getAttribute("src"))?.includes("squarefoot-origin"));
  const planTabs = (await page.locator(".plans__tabs [role='tab']").allTextContents()).map((t) => t.trim());
  check("Origin shows ground, first and second floor plans", planTabs.join("|") === "Ground floor|First floor|Second floor", planTabs.join(", "));
  await page.locator(".plans__tabs [role='tab']").nth(2).click();
  check("Origin plan tab switches", (await page.locator("#plan-panel img").getAttribute("alt"))?.includes("Second floor"));
  check("Origin exploration has 5 real views", (await page.locator(".exp__layer").count()) === 5);
  const srcs = [...new Set(await page.locator("img").evaluateAll((els) => els.map((e) => e.getAttribute("src")).filter(Boolean)))];
  const bad = [];
  for (const s of srcs) {
    const r = await fetch(new URL(s, BASE));
    if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("image/")) bad.push(`${r.status} ${s}`);
  }
  check(`Every Origin page image serves (${srcs.length})`, srcs.length >= 15 && bad.length === 0, bad.slice(0, 3).join(" | "));
  // The header hides while scrolling down; return to the top so it is back in view.
  await page.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0)));
  await sleep(1000);
  await page.getByRole("button", { name: "Show projects" }).click();
  check("Nav dropdown: every project has a thumbnail", (await page.locator("#nav-projects .nav__thumb").evaluateAll((els) => els.every((e) => e.querySelector("img, svg")))) === true);
  await page.keyboard.press("Escape");

  // Pinned exploration: rail jumps to a view (desktop)
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await ready(page);
  check("Desktop uses pinned sequences", await page.evaluate(() => document.documentElement.classList.contains("pin")));

  // Project discovery: the first card grows evenly from the centre, and the header stays light over the sand stage.
  const discTop = await page.evaluate(() => document.querySelector(".discover").getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y)), discTop + 4);
  await sleep(1600);
  check("Discovery stage at rest: header is not dark", !(await page.locator(".header").getAttribute("class")).includes("on-dark"));
  await page.evaluate((y) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y)), discTop + 0.35 * 900);
  await sleep(2200);
  const clip = await page.locator(".disc__panel").first().evaluate((el) => getComputedStyle(el).clipPath);
  const edges = (clip.match(/inset\(([^)]*?)(?: round|\))/)?.[1] ?? "").trim().split(/\s+/).map(parseFloat);
  const [t = 0, r = t, b = t, l = r] = edges;
  check("Discovery card grows evenly from the centre", edges.length > 0 && Math.abs(l - r) < 1.5 && t > 0 && b > 0 && Math.abs(t - b) < 6, clip);

  const rail = page.locator(".exp__rail button");
  await page.locator(".explore").scrollIntoViewIfNeeded();
  await sleep(800);
  await rail.nth(2).click();
  await sleep(2600);
  check("Exploration rail scrolls to the chosen view", (await page.locator(".exp__title").innerText()).trim() === "East facing villa", await page.locator(".exp__title").innerText());

  // Brochure picker from a general CTA (no project preselected)
  await page.evaluate(() => {
    const c = document.querySelector(".closing");
    window.scrollTo(0, c.getBoundingClientRect().top + window.scrollY + c.offsetHeight - window.innerHeight - 4);
  });
  await sleep(2200);
  await page.locator(".closing").getByRole("button", { name: /Download brochure/ }).click();
  const pick = page.getByRole("dialog");
  await pick.getByText("Which brochure?").waitFor();
  const choices = (await pick.locator(".pick button strong").allTextContents()).map((t) => t.trim());
  check("Brochure picker lists only projects with brochures", choices.length === 3 && choices.includes("Challa Elite") && !choices.includes("Squarefoot Origin"), choices.join(", "));
  await pick.locator(".pick button", { hasText: "Challa Elite" }).click();
  await pick.getByLabel(/Full name/).waitFor();
  check("Picker leads to the gated form for the chosen project", await pick.getByText("Download the Challa Elite brochure").isVisible());
  await page.keyboard.press("Escape");

  // Contact form
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
  const main = page.locator("main");
  await sleep(2600);
  await main.getByLabel(/Full name/).fill("Contact Tester");
  await main.getByLabel(/Mobile number/).fill("9123456780");
  await main.getByLabel(/^Email/).fill("contact@example.com");
  await main.getByLabel(/I am interested in/).selectOption("the-square");
  await main.getByLabel(/Message/).fill("Please call me.");
  await main.locator("label.check").click();
  await main.getByRole("button", { name: /Send enquiry/ }).click();
  await main.getByText("We have received your enquiry").waitFor({ timeout: 10000 });
  check("Contact form submits with genuine success", true);

  // Every internal link on every page resolves
  const seen = new Set();
  for (const p of ["/", "/about", "/projects", "/contact", "/projects/the-square", "/projects/trans-elite"]) {
    await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
    for (const href of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")))) seen.add(href.split("#")[0].split("?")[0]);
  }
  const broken = [];
  for (const href of seen) {
    const r = await fetch(BASE + href, { redirect: "manual" });
    if (r.status >= 400) broken.push(`${href} ${r.status}`);
  }
  check(`All ${seen.size} internal links resolve`, broken.length === 0, broken.join(", "));
  await ctx.close();
}

// Mobile: menu + touch
for (const dev of ["iPhone 13", "Pixel 7", "iPad Mini", "iPad Pro 11 landscape"]) {
  const ctx = await browser.newContext({ ...devices[dev] });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => consoleErrors.push(`${dev}: ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`${dev}: no horizontal overflow`, overflow <= 0, `${overflow}px`);
  await ready(page);
  check(`${dev}: no pinned scroll sequences on touch`, !(await page.evaluate(() => document.documentElement.classList.contains("pin"))));
  // Exploration works by tapping the rail on touch devices.
  await page.locator(".explore").scrollIntoViewIfNeeded();
  await page.locator(".exp__rail button").nth(4).tap().catch(async () => page.locator(".exp__rail button").nth(4).click());
  await sleep(600);
  check(`${dev}: exploration rail switches view`, (await page.locator(".exp__title").innerText()).trim() === "Club The Square");
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  const burger = page.getByRole("button", { name: /^Menu$/ });
  if (await burger.isVisible()) {
    await burger.click();
    await page.locator("#mobile-menu").getByRole("link", { name: /About/ }).click();
    await page.waitForURL("**/about");
    check(`${dev}: mobile menu navigates`, page.url().endsWith("/about"));
  } else {
    check(`${dev}: desktop nav visible`, await page.locator(".nav").isVisible());
  }
  await page.goto(`${BASE}/projects/challa-elite`, { waitUntil: "networkidle" });
  await ready(page);
  await heroBrochure(page).click();
  await page.getByRole("dialog").getByLabel(/Full name/).waitFor();
  const box = await page.getByRole("dialog").boundingBox();
  const vp = page.viewportSize();
  check(`${dev}: enquiry form fits viewport`, Boolean(box) && box.width <= vp.width + 1, `${box?.width}/${vp.width}`);
  await ctx.close();
}
await browser.close();
check("No uncaught page errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
