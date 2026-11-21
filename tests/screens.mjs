// Full-page screenshots at device widths. Usage: node tests/screens.mjs [baseUrl] [outDir]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3100";
const out = process.argv[3] ?? "tests/screens";
const pages = (process.env.PAGES ?? "/,/about,/projects,/contact,/projects/the-square,/projects/squarefoot-origin,/projects/the-urban-ranch,/projects/trans-elite,/projects/challa-elite").split(",");
const widths = (process.env.WIDTHS ?? "1440,390").split(",").map(Number);
const motion = process.env.MOTION === "1";
const browser = await chromium.launch();
const errors = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : w < 1100 ? 1024 : 900 }, deviceScaleFactor: 1, reducedMotion: motion ? "no-preference" : "reduce", hasTouch: w < 1100, isMobile: w < 600 });
  for (const p of pages) {
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(`${w} ${p} pageerror ${e.message}`));
    page.on("console", (m) => m.type() === "error" && errors.push(`${w} ${p} console ${m.text()}`));
    await page.goto(base + p, { waitUntil: "networkidle" });
    // Full-page captures: let every section paint its own theme (on screen the theme follows the scroll position).
    if (!motion) await page.evaluate(() => document.documentElement.classList.remove("theme-js"));
    // Scroll through so lazy images / reveals trigger.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(motion ? 250 : 60); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(motion ? 1500 : 400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`${w} ${p} horizontal overflow ${overflow}px`);
    const name = `${out}/${w}${p.replace(/\//g, "_") || "_home"}.png`;
    await page.screenshot({ path: name, fullPage: true });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join("\n") : "no runtime errors / overflow");
