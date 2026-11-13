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
