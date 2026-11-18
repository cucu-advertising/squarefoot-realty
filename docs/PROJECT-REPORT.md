# The Square — Project Report

Content audit, design decisions, completed work and open items.

## 1. Source documents reviewed

| Code | Document | Used for |
|---|---|---|
| **B** | `The_Square_Brochure.pdf` (27 pages, 17.9 MB) | Every project fact, imagery, floor plans, site plan, location map and distances, contact details, RERA, disclaimer. **Source of truth.** |
| **C** | `Squarefoot Realty – Website Copy (Revised 1).docx` | Hero headline, developer story, values, delivered projects, contact page copy, form microcopy, meta titles |
| **G** | `Squarefoot Realty Branding Final.pdf` (21 pages) | Logo construction, colours (Pantone/hex), typography (Gotham), tagline |

## 2. Verified content inventory

| # | Item | Value | Source |
|---|---|---|---|
| 1 | Project / developer | **The Square** by **Squarefoot Realty** (formerly Sai Teja Developers) | B p.1, p.26; C |
| | Promoters (as printed) | **IRA Realty Tech Pvt. Ltd.** and Squarefoot Realty, both logos under "PROMOTERS" | B p.26 |
| 2 | Logos & identity | The Square mark (green, corner brackets, sun); Squarefoot square + sun; Light Red #EA556F, Brick #A2412F, Yellow #FECC00; Gotham | B, G |
| 3 | Location | "Luxury villas at Adibatla"; "a few steps away from ORR on Kongara Kalan Road"; ORR Exit No. 13 (Raviryal) | B p.3, p.23, p.4 map |
| | Map link | `https://goo.gl/maps/NThYCLgJ6HSQfnaM7` (decoded from the brochure's QR code) | B p.24 |
| 4 | Configuration | 4-BHK luxury duplex villas (G+1) + terrace; Type 01 East facing, Type 02 West facing | B p.7, p.20–21 |
| 5 | Sizes | Plots 267, 300 & 330 Sq. Yds · built-up 3,700 sft for all villas · Type 01: G 1,595 / F 1,671 / T 434 sft · Type 02: G 1,564 / F 1,605 / T 531 sft | B p.7, p.11, p.20–21 |
| | Scale | 13.5 acres · 131 villas · 4-level clubhouse, 25,000 sft+ · 40′ & 30′ BT roads | B p.11, p.16 |
| | Specifications | Full schedule (structure → landscaping) | B p.22 |
| 6 | Amenities | Clubhouse (11 items), outdoor (26-item site legend), smart home (9 items, optional provision) | B p.10, p.13–17, p.19 |
| 7 | Location advantages | 38 destinations with drive times in 4 groups | B p.24 (verified against a high-res render) |
| 8 | Floor plans | Type 01 and Type 02: ground, first and terrace; site layout plan | B p.19–21 |
| 9 | Highlights | 18-point "Project Highlights" list plus the p.7 feature icons | B p.7, p.11 |
| 10 | Telephone | **+91 9121 777 777** | B p.26 |
| 11 | Email | **info@irarealty.in** | B p.26 |
| 12 | Office | IRA Realty Tech Pvt. Ltd., # 4-49/2, Besides Anvaya Conventions Road, Financial District, Vattinagulapally, Hyderabad – 500 032, Telangana | B p.26 |
| 13 | RERA | **TS RERA No. P02400005775**; "HMDA & RERA Approved Luxury Villa Project" | B p.11, p.26 |
| 14 | Disclaimer | Reproduced verbatim | B p.26 |
| 15 | Visual assets | 26 renders extracted at native resolution; plans re-rendered at 250 dpi from vector | B |
| 16 | Brochure | Original PDF served byte-for-byte (checksum verified in tests) | B |

### Deliberately excluded

- **Amitha Designs** (branding agency) contact details, which appear in both PDFs.
- **CUCU Advertising**: does not appear in any supplied file and is not used anywhere.
- The **IRA portfolio photographs** on the brochure's back page (Moonglade, Gateway Towers, etc.). They show other projects and could mislead visitors.
- Small brochure thumbnails under ~350 px, which would look blurry on screen.

## 3. Information not supplied, so not invented

| Missing | How the site handles it |
|---|---|
| Prices, payment plans, possession date | Not shown anywhere |
| Exact GPS coordinates | Shows the brochure's location map in a zoom viewer. "Get Directions" uses the verified Maps link. Set `location.coordinates` to embed a live map |
| Squarefoot Realty's own phone, email, office; site-office address; WhatsApp number; office hours | The brochure's contact block is used. Empty fields stay hidden |
| Partner names, photos, bios; testimonials; families housed; total sft delivered | Sections omitted (the copy deck marks these as placeholders) |
| Squarefoot Origin and The Urban Ranch details | Listed by name and location only, from the copy deck |
| High-resolution original renders | Brochure images are 90 ppi (max 2,179 px). Supplying the original renders would sharpen the hero and amenity images |

## 4. Items for the client to confirm

1. **Enquiry recipient.** The brochure's only contact block belongs to the promoter **IRA Realty Tech Pvt. Ltd.** (`info@irarealty.in`), so enquiries go there by default. If Squarefoot Realty should also receive leads, set `ENQUIRY_CC`.
2. **RERA wording conflict in the brochure.** It shows a registration number and says "HMDA & RERA Approved", but its disclaimer also says "All our projects being marketed are in the process of being registered under RERA". The site shows both as printed. Legal should confirm the final statement.
3. **Location naming.** Brochure: "Adibatla" and "Kongara Kalan Road"; copy deck: "Kongara Kalan (ORR Exit-13)". The site uses "Kongara Kalan Road, Adibatla, near ORR Exit 13".
4. **"CAD-6"** in the communication spec is shown as **CAT-6** (an evident typo).
5. **Site layout plan.** The brochure artwork itself contains yellow highlight marks (an arrow and circles). They are reproduced as printed. Supply a clean plan if available.
6. **Privacy policy.** Written to match how the site actually handles data, but needs legal review before launch.
7. **Fonts.** Gotham is commercial. Montserrat, its closest free match, is self-hosted. Add a Gotham web licence if exact brand fidelity is required.

## 5. Design direction

- **Palette:** warm limestone paper (#F5F3EC), deep forest (#1A2216) for dark sections, The Square's greens (leaf #52701C, adjusted for AA contrast; lime #B4CC3A), and Squarefoot's coral, sun and brick reserved for the developer story.
- **Type:** Montserrat at light weights for large editorial headings, with Instrument Serif italic accents ("Everything *and Beyond.*"). Small caps-style labels at 0.15–0.2em tracking.
- **Motifs taken from the brands, not decoration:** square-cornered buttons; numbered square eyebrow badges; corner-bracket frames lifted from The Square logo; and the *sunrise* developer interaction, where the sun rises beside the square and the brick overlap grows exactly as in the logo.
- **Motion:** masked image reveals, line-by-line hero title, count-up stats, animated distance bars, a diagonal arrow loop on buttons, and a tray-line "download" micro-interaction. All of it is disabled under `prefers-reduced-motion`.
- No gold gradients, glassmorphism, floating shapes or stock imagery.

## 6. Completed

- Pages: Home (hero, project intro, highlights, residences, specifications, site plan, amenities, gallery, location, developer, CTA), About, Contact, Privacy policy, Terms & disclaimer, 404, sitemap, robots.
- Residences: type tabs (keyboard accessible), floor switcher, full-resolution zoom/pan viewer (wheel, pinch, double-tap, keyboard), vector floor-plan PDF downloads, "Enquire about Type 0X" with the type pre-selected.
- Enquiry and brochure: accessible form, inline validation, loading and error states, honest server responses, gated original PDF, no repeat form within a session, lead source tracking.
- Backend: server validation, origin check, honeypot, minimum fill time, rate limiting, Resend / SMTP / CRM webhook, Reply-To set to the visitor, HTML and text email.
- SEO: unique titles and descriptions per page, one H1 per page, canonical URLs, Open Graph and Twitter cards, JSON-LD (Organization, Residence with RERA identifier, promoter contact), sitemap, robots (API disallowed), descriptive alt text on every image.
- Performance: next/image (AVIF/WebP, responsive sizes, lazy loading, priority hero), self-hosted fonts, 128 kB first-load JS on the home page, long-lived caching of images.
- Security headers: nosniff, frame options, referrer policy, permissions policy. No secrets in client code.

## 7. Test results

- `scripts/e2e.mjs`: **90 / 90 checks pass** against a production build.
- API probes: honeypot → 400; submission under 2.5 s → 400; foreign origin → 403; GET → 405; 6th request in 10 minutes → 429 with `Retry-After`; production with no provider → 503 (no false success); brochure without cookie → 303 to the contact form.

## 8. Needed before launch

1. Domain and `SITE_URL`.
2. Email provider credentials (Resend API key with a verified domain, or SMTP), plus `ENQUIRY_FROM`.
3. `BROCHURE_TOKEN_SECRET`.
4. Confirmation of the items in section 4.
5. Optional: exact coordinates for a live map, WhatsApp number, partner bios, and original high-resolution renders.

## 9. Refinement pass: scrolling, motion, navigation

**Benchmark note.** The CUCU Advertising codebase, URL and reference video were not available in this workspace, so nothing here is claimed as a replica of CUCU. The implementation uses Lenis + GSAP ScrollTrigger + SplitText with conservative settings; share the CUCU repository or link and the easing, durations and trigger points can be matched exactly in `src/components/Motion.tsx`.

**Added**
- Lenis smooth scrolling (single instance, desktop only) synced with GSAP ScrollTrigger; CSS `scroll-behavior` removed so nothing competes.
- Line-by-line masked reveals on all 9 home headings, page titles, the CTA and the footer tagline.
- Scrubbed parallax on the hero, the wide avenue image and the closing CTA image; images fade in once decoded.
- Anchor navigation that lands exactly below the header, updates the URL, and supports Back/Forward.
- Per-history-entry scroll restoration across pages and reloads.
- Duplicate-enquiry guard (same details within 60 s are acknowledged without a second email).

**Fixed during testing**
- Anchor offset applied twice (Lenis already honours `scroll-padding-top`).
- `ScrollTrigger.refresh()` interrupting in-flight scrolls; it now waits until scrolling is idle.
- Back button landing at the wrong position because the browser restored scroll before the page rendered.

**Deliberately not done**
- No pinned or scroll-jacked sections, and no cross-section background colour blending: with light text on dark sections it makes copy unreadable mid-transition.
- Body paragraphs keep a simple fade; only headings split.

**Tests**
- `scripts/motion-test.mjs`: 35 / 35. `scripts/e2e.mjs`: 90 / 90.
- SMTP path tested against a local mail server: correct To, CC, From and Reply-To; one email for a duplicated submission; 502 when the mail server is down. **Not tested against a real provider** (no credentials supplied).
- Frame pacing in headless Chromium during a 9,000 px glide: p95 19 ms. Real-device performance should be confirmed on the deployed site.

**Deployment status:** not deployed. A Vercel token was not provided to this session; see README → Deployment.

## 10. Refinement pass: typography, spacing, content, renders, Urban Ranch

**Typography.** One scale replaces 49 ad-hoc font sizes: hero display, `.h1`–`.h4`, `.lead`, body, `.small`, `.label` (eyebrows, navigation, buttons, tabs, form labels) and `.meta` (captions, units). Every section heading uses `.h2`; every eyebrow, button and tab shares one 12 px / 600 / 0.16em label style.

**Spacing.** An 8-pt scale plus three rhythm tokens: section padding (80–132 px), heading-to-content (40–64 px) and block gap (48–88 px). Every section opens with the same heading block (title left, one supporting line right). Container is 1,360 px; mobile margins are 20 px throughout.

**Content reduced.** The home page is 21% shorter on desktop (16,209 → 12,738 px) and 32% shorter on mobile (21,155 → 14,442 px).
- Introduction and key figures merged into one section; the highlights section, its 20-item list and the 7-row facts table were removed.
- The 19-group specification accordion was replaced by three signature features plus an "Explore Complete Specifications" CTA to the brochure.
- Residences: room lists cut from 11 items to 4; the site plan moved behind a link to the zoom viewer.
- Amenities: 4 groups of 8–11 items became 3 groups of 6 essentials.
- Location: 4 headline drive times shown; all 38 sit behind "All drive times".
- About page roughly halved.

**Signature features — wording checked against the brochure.**
1. **Smart living & home automation.** "Fully Automated Homes" was *not* used: the brochure says "Provision for Home Automation (Lights, Fans & A/C's)" and "*Provision of Automation Technology Solutions is optional". The site keeps the optional-provision note.
2. **High-end aluminium windows** (p.22: anodised aluminium frames and shutters for windows and French doors).
3. **25,000 sft+ clubhouse** (p.7 / p.16: "4-Level Exclusive Clubhouse with 25,000 Sft + area").

**Google Drive renders.** In folder "Jpeg" (14 files), 7 were downloaded at 4000×2250 and are used at 2560 px: Aerial cam, Aerial Night Hires, Club house, Club Pool View, East villa_Aerial, West Villa Aerial, Skating rink (1).jpg.

Not retrieved, because they exceed the Drive connector's 10 MB limit and direct Drive downloads are blocked by this environment's network policy:
- Entrance_Hi Res.jpg (22 MB)
- Aerial view_Hi Res.jpg (14.9 MB)
- Cam 28_Rowhouse_Hi Res.jpg (13.9 MB) — likely a higher-resolution version of the current hero
- Club Cam-05_Hi Res.jpg (13.4 MB)
- East villa.jpg (11.6 MB)
- Skating rink (1).tif (36 MB) — duplicate of the JPEG
- MLP Top down.pdf (31 MB)

Drop them into `public/images/the-square-hd/` to use them.

Check with the client: the Drive clubhouse render is signed "IRA SQUARE CLUBHOUSE", and its angular design matches both brochure aerials. The brochure also contains a different, timber-fronted "Club The Square" render. The Drive version is now used; confirm which design is current.

**Urban Ranch** (new page `/urban-ranch`, from Digital_UR_Mini_Brochure.pdf).
- Facts: 163 villas, 19.5 acres, plots of 292/301/351 sq. yds, 3,807–4,927 sft built-up, RCC Mivan G+2, 11.5 ft ceilings, ~30,000 sft clubhouse.
- Also shown: the three villa types with East/West built-up areas, the clubhouse and community features, 8 drive times, and TG RERA P02400009631.
- The directions link is decoded from the brochure's QR code. The page's phone number (+91 8001 345 345) and email come from that brochure.
- Images are 900–1,850 px, so they are shown in contained layouts rather than full-bleed.
- Brochure: `private/urban-ranch-brochure-squarefoot-revised.pdf` adds the official Squarefoot logo, with a divider, beside the IRA and Ironhorse logos on the cover and back page. It is otherwise unchanged. The untouched original is kept at `private/urban-ranch-brochure-original.pdf`; switch between them in `src/app/api/brochure/route.ts`.
- Check with the client: the brochure itself shows only IRA and Ironhorse as promoters. The site adds the Squarefoot logo as instructed and states the brochure's promoters factually.

**Official Squarefoot logo everywhere.** The hand-drawn SVG mark, the typeset wordmark and the animated "sunrise" mark were removed. The logo now comes from the brand guide in four variants: mark, stacked, horizontal, and reversed (white type, for dark backgrounds). The favicon is made from the official mark. Logos from white backgrounds are cut out as opaque shapes, so their colours stay true on dark backgrounds.

**Portfolio imagery.**
- Challa Elite: the supplied render, which matches the Challa Elite brochure.
- Trans Elite: the render from Challa Elite's "previous projects" panel, which matches the Trans Elite brochure. The architect's watermark was cropped out.
- The commercial render (signage reads "TRANS ELITE") was *not* used: no source names it, so it isn't labelled Trans Arcade.
- Trans Arcade and Lokeshwari Residency are text-only cards, because there is no verified imagery for them.

**Fixes found during testing.**
- Images at quality 75/82 returned HTTP 400 because those values were missing from `images.qualities`.
- Logo colours were wrong on dark backgrounds.
- The footer wrapped "ORR Exit-13" at the hyphen.

**Tests.**
- `scripts/e2e.mjs`: 104/104, now covering the Urban Ranch page, lead tagging, the revised-PDF checksum and brochure gating.
- `scripts/motion-test.mjs`: 34/34; frame pacing p95 18.5 ms.
