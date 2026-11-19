# Squarefoot Realty — website

Next.js 16 (App Router, TypeScript) · GSAP + ScrollTrigger + SplitText · Lenis · server-side enquiry handling and gated brochures.

## Run it

```bash
npm install
cp .env.example .env.local      # then fill in values
npm run dev                     # http://localhost:3000
```

Production:

```bash
npm run build
BROCHURE_TOKEN_SECRET=$(openssl rand -hex 32) npm start
```

Tests (against a running server):

```bash
BASE=http://localhost:3000 node tests/e2e.mjs          # 88 functional, security and device checks
node tests/screens.mjs http://localhost:3000            # full-page screenshots → tests/screens
```

**Hosting.** This needs a Node.js host (Vercel, Render, or a VPS running `next start`), not static hosting, because the enquiry API and brochure gating run on the server. On serverless hosts the local leads file does not persist, so configure the webhook or SMTP destination.

## Where things live

| What | Where |
|---|---|
| Project facts, highlights, images, exploration views, plans, brochure keys | `src/lib/projects.ts` (single source of truth) |
| Company copy, nav, contact details (from env) | `src/lib/site.ts` |
| Design tokens (colour, type scale, spacing, radius, motion) | top of `src/app/globals.css` |
| Motion system (Lenis, reveals, pinned sequences) | `src/components/Motion.tsx` |
| Brochure slug → PDF mapping | `src/lib/brochures.ts` |
| Gated PDFs (never public) | `private/brochures/` |
| Web images | `public/images/<project>/` |
| Original Drive downloads (not deployed) | `source-assets/drive/` (The Square), `source-assets/origin/` (Squarefoot Origin) |
| Lead delivery (webhook / email / file) | `src/lib/leads.ts` |

## Design system (v3, benchmarked against stillform.homes)

- **Canvas:** warm sand `#EFE9DF` and ink `#1A1A18` (the logo wordmark colour). Brand red, brick and yellow are used for accents, progress and states only.
- **Type:** one scale (`--f-hero`, `--f-display`, `--f-h2`, `--f-h3`, `--f-statement`, `--f-lead`, `--f-body`, `--f-label`, `--f-link`). Large headlines are light (300) with tight tracking. Labels are 11px uppercase, spaced 0.2em. Montserrat stands in for Gotham.
- **Space:** `--sp-1`…`--sp-7`, `--section-y`, `--gutter`, `--gap`, one container (max 1680px) and one radius (`--radius`).
- **Components:** sticky hero with a fog edge on the section that slides over it; text links with an underline and arrow; pill buttons; nav labels that roll over on hover; rounded image cards.

## Motion inventory

| Where | What it does |
|---|---|
| First visit | Preloader: brand, a 00→100 counter tied to real image loading, then a wipe up (once per session) |
| Hero | Image unmasks from an inset rounded frame and settles from 1.25× scale; headline rises line by line; links, meta and caption follow. While the next section slides over, the image slowly scales |
| Headlines | Masked line-by-line reveal (SplitText), staggered |
| Statements | Words brighten in sync with scroll (reversible) |
| Images | Wipe-up reveal with scale settle; parallax on selected media |
| Philosophy collage | Scattered images converge, grow to near full screen, then peel away one by one. Caption, counter and prev/next buttons included |
| Project discovery | Giant brand marquee; the first project grows from a card to full screen; later projects wipe up over it; index rail jumps between them |
| Explore The Square | Pinned 6-view exploration of real renders: directional wipes, push-in, dot rail, big number and progress bar |
| Signature details | Statement → image rises → full-bleed with overlay → split composition, with each detail taking its turn |
| Delivered reel | Horizontal reel driven by vertical scroll, with a progress line |
| Closing | Frame grows from a card to full screen, then the invitation appears |
| Project features | Paired cards slide up over each other (where every feature has its own render) |
| Gallery | Focus image with Ken Burns, next-image preview, counter, swipe, keyboard and lightbox |
| Header | Hides on scroll down and returns on scroll up; colour follows whatever is under it |

Pinned sequences run only for fine pointers at 1024px and wider (`html.pin`). Phones, tablets and iPads keep native scrolling, and each sequence falls back to a deliberate static layout (swipe rows, stacked cards, tap-to-switch exploration). Reduced-motion visitors get the static layouts with no reveals.

## How the brochure gating works

1. **Download brochure** opens the enquiry drawer: name, email, mobile and consent. The project is pre-selected, or a picker appears for general CTAs.
2. The form is validated in the browser **and** on the server (`/api/enquiry`). Spam protection is a honeypot, a minimum fill time, a per-IP rate limit and a same-origin check. Duplicate submissions are idempotent.
3. The lead is delivered to every configured destination. The visitor sees success **only if at least one destination confirms**; otherwise they get HTTP 502 and a real error.
4. The server returns a signed, 15-minute download token for that one project and sets an httpOnly 12-hour session cookie, so the same visitor isn't asked again.
5. `/api/brochure/[slug]` streams the PDF only with a valid token or cookie for **that** slug. PDFs live outside `/public`, so no public URL exists.

## Lead destinations (set at least one in production)

- `LEADS_WEBHOOK_URL` (+ optional `LEADS_WEBHOOK_TOKEN`): a JSON POST to a CRM, Zapier, Make or Google Apps Script.
- SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `LEADS_EMAIL_TO`, `LEADS_EMAIL_FROM`): one email per lead, with reply-to set to the visitor.
- `LEADS_FILE_STORE=on` (default): appends to `data/leads.jsonl`. Works on a VPS.

All three were verified locally against a test webhook receiver and a local SMTP sink, and so was the all-destinations-down failure path. They have **not** been tested against the client's real CRM or mailbox, because none was supplied.

## Content and asset inventory

| Item | Source | Status |
|---|---|---|
| Brand (logo vector, colours, Gotham, "Everything and Beyond") | Branding PDF | Used |
| Company copy | Website copy .docx | Used, condensed |
| The Square: facts, RERA P02400005775, highlights, amenities, plans, distances | The Square brochure | Used. Brochure gated |
| The Square renders | **Google Drive folder: all 13 files** (12 renders at 4000px + master-plan PDF) | Used. Originals in `source-assets/drive/`, web exports in `public/images/the-square/` |
| Squarefoot Origin: 27 villas, 2.8 acres, G+2, 8,500 sft clubhouse | Website copy | Used |
| Squarefoot Origin renders and plans | **Google Drive folder: all 15 files** (site aerial, entrance, clubhouse, 9 villa renders, East facing ground/first/second floor plans) | Used: hero, highlights, 5-view exploration, gallery, amenities, floor plans, closing, plus the cards on the home and projects pages and the menus. Originals in `source-assets/origin/`, web exports in `public/images/squarefoot-origin/`. The white margins on the entrance and clubhouse sheets were trimmed; nothing else was altered. Room names on the plan tabs are read directly off the plans |
| The Urban Ranch | Copy + The Square location map | Name, location and "upcoming" only |
| Trans Elite, Challa Elite | Brochures (Challa Elite PDF; Trans Elite spreads supplied as images) | Used. Brochures gated |
| Trans Arcade, Lokeshwari Residency | Copy | Listed as delivered; no detail pages |

## Needs client confirmation

1. **Signature highlights** (automation, aluminium windows, 25,000 sft+ clubhouse) are from **The Square** brochure, not Urban Ranch; nothing has been supplied for Urban Ranch.
2. The brochure says "**provision** for home automation (optional)", so the site says "Automation-ready homes".
3. **Commercial render**: the render signed "Trans Elite" is attributed to **Trans Arcade**. Please confirm.
4. The "Aluminium windows" image is a **crop of the real east-facing villa render**, not a separate render.
5. Footer disclaimer and Privacy Policy need legal review.

## Missing

- **Verified contact details** (office address, phone, email, WhatsApp, hours). The blocks stay hidden until these are set in env vars.
- **Real lead destination** (CRM webhook or SMTP credentials).
- Squarefoot Origin West facing floor plans, RERA number and brochure; Urban Ranch details.
- Exact site map pins (maps currently search by locality).
- Gotham webfont licence.
