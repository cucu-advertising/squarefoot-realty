# The Square — Squarefoot Realty

Production website for **The Square**: 131 East & West facing 4-BHK luxury duplex villas on 13.5 acres, Kongara Kalan Road, Adibatla, Hyderabad (TS RERA P02400005775).

Built with **Next.js 15 (App Router) + React 19 + TypeScript**, plain CSS (one design-system stylesheet), no UI framework. Four runtime dependencies besides Next/React: two self-hosted font packages, `nodemailer` (SMTP option) and `server-only`.

---

## Quick start

```bash
npm install
cp .env.example .env.local      # EMAIL_PROVIDER=console is fine for local development
npm run dev                     # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Where things live

| What | Where |
|---|---|
| **Every project fact** (areas, amenities, distances, RERA, contact details, copy) | `src/content/site.ts` — edit here only; each value is tagged with its source document |
| Pages | `src/app/` — `/`, `/about`, `/contact`, `/privacy-policy`, `/disclaimer`, `sitemap.xml`, `robots.txt` |
| Home sections | `src/components/sections/*` |
| Enquiry modal, brochure buttons | `src/components/EnquiryProvider.tsx`, `EnquiryForm.tsx` |
| Floor-plan / map zoom viewer | `src/components/ZoomViewer.tsx` |
| Enquiry API | `src/app/api/enquiry/route.ts` |
| Gated brochure download | `src/app/api/brochure/route.ts` → streams `private/the-square-brochure.pdf` |
| Email / CRM delivery | `src/lib/deliver.ts` |
| Validation (shared client + server) | `src/lib/validation.ts` |
| Design tokens & styles | `src/app/globals.css` |
| Images | `public/images/project` (renders), `public/images/plans` (floor plans, site plan, map), `public/images/brand` |
| Floor-plan PDFs | `public/downloads/floor-plans/` (vector pages extracted from the brochure) |

## How enquiries and the brochure work

1. A visitor clicks any **Download Brochure** button (hero, header, footer, CTA band) or **Enquire Now**. A modal opens with a short form. The brochure version says clearly that contact details are needed.
2. `POST /api/enquiry` checks the request origin, rate-limits (5 per 10 minutes per IP), checks the honeypot and minimum fill time, and validates every field on the server.
3. The lead goes to **every configured channel** (email and/or CRM webhook). The API answers `ok: true` **only after the provider has accepted it**. If nothing is configured, or delivery fails, the visitor sees an error with the phone number and email. It never shows a false success.
4. On success the server sets a signed, HttpOnly cookie (`tsq_brochure`, 7 days). The confirmation reads *"Thank you for your interest. Explore the project in more detail through our brochure."* and shows **Download Brochure ↓**.
5. `GET /api/brochure` streams the **original, unmodified PDF** (byte-identical, 17.9 MB) as an attachment. Anyone without the cookie is redirected to `/contact?brochure=1`.
6. Later brochure clicks in the same session download straight away, without the form again.

Each lead contains: name, email, mobile, residence type, preferred visit time, message, **source** (`Contact Page`, `Brochure Request`, `Residences`, `Home Page`), timestamp (ISO + IST), page and user agent. Emails set **Reply-To** to the visitor.

## Environment variables

See `.env.example`. Nothing here is exposed to the browser.

| Variable | Required | Notes |
|---|---|---|
| `SITE_URL` | yes | Canonical domain, used for sitemap, OG and canonical tags |
| `BROCHURE_TOKEN_SECRET` | **yes in production** | 32+ random chars. Without it, enquiries return 503 *before* anything is sent |
| `EMAIL_PROVIDER` | yes* | `resend`, `smtp`, or `console` (development only; refused in production) |
| `ENQUIRY_TO` | no | Defaults to `info@irarealty.in`, the address on the brochure's back cover |
| `ENQUIRY_CC` | no | e.g. a Squarefoot Realty inbox |
| `ENQUIRY_FROM` | yes for email | Sender on a **verified** domain, e.g. `The Square <enquiries@yourdomain.com>` |
| `RESEND_API_KEY` | if `resend` | https://resend.com → API Keys; verify the sending domain first |
| `SMTP_HOST/PORT/SECURE/USER/PASS` | if `smtp` | Google Workspace, Zoho, Amazon SES SMTP, etc. |
| `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` | no | Every lead is also POSTed as JSON (Zapier, Make, Google Apps Script, CRM). Sent as `Authorization: Bearer <secret>` |

\* At least one of an email provider or `CRM_WEBHOOK_URL` must be configured, or the form shows its error state.

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Motion system

All scrolling and animation lives in `src/components/Motion.tsx` (mounted once in the layout):

- **Smooth scrolling:** one Lenis instance (`lerp: 0.1`), driven by GSAP's ticker and synced to ScrollTrigger. Desktop/fine-pointer only; phones and tablets keep native touch scrolling. Paused while a dialog or the mobile menu is open.
- **Heading reveals:** add `data-split` to a heading and it reveals line by line from behind a mask (GSAP SplitText, `expo.out`, 85 ms stagger, triggers at 88% of the viewport, re-splits on resize and font load).
- **Supporting content:** `data-reveal` fades up; `data-reveal="mask"` and `"wipe"` reveal images; `data-count` counts up.
- **Parallax:** wrap an image in `<div class="px" data-parallax="7">` for a scrubbed drift (desktop only).
- **Navigation:** same-page anchors glide and land below the header (offset comes from `scroll-padding-top` in `globals.css`); Back/Forward/reload restore the exact scroll position per history entry.
- `prefers-reduced-motion` disables Lenis, splitting, parallax and transitions.

`scripts/motion-test.mjs` runs 35 checks on this (`BASE_URL=http://localhost:3000 node scripts/motion-test.mjs`).

## Deployment

**Vercel (recommended).** Either:

1. Push this folder to a GitHub repository, then at vercel.com choose *Add New → Project*, import the repository and add the environment variables above; or
2. From this folder run `npx vercel` (log in when prompted), then `npx vercel --prod`.

Set at least `SITE_URL`, `BROCHURE_TOKEN_SECRET`, and an email provider (`EMAIL_PROVIDER` + its keys + `ENQUIRY_FROM`) in *Project → Settings → Environment Variables*, then redeploy. Until an email provider is set, the live form shows its error state rather than a false success. After the first deploy, submit one real enquiry and download the brochure on the live URL to confirm both. `next.config.mjs` already includes `private/the-square-brochure.pdf` in the brochure function bundle.

**Any Node 20+ host:** `npm ci && npm run build && npm start` behind HTTPS (Nginx, Caddy, Render, Railway, a VM). Pass the client IP in `X-Forwarded-For` so rate limiting works.

The rate limiter is in memory. That suits a single server. For multi-instance or serverless scale, swap `src/lib/rate-limit.ts` for a shared store such as Upstash Redis.

## Testing

`scripts/e2e.mjs` runs 90 Playwright checks against a running production server: brochure flow (byte-identical download), contact flow, lead contents, gating, residences, zoom, gallery, mobile menu, horizontal overflow at 390/768/1280/1440/1920 px, every internal link, SEO tags, alt text and reduced motion.

```bash
node scripts/mock-crm.mjs /tmp/leads.jsonl 4010 &
npm run build
CRM_WEBHOOK_URL=http://127.0.0.1:4010/lead CRM_WEBHOOK_SECRET=test-secret \
  BROCHURE_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") \
  EMAIL_PROVIDER= npm start &
BASE_URL=http://localhost:3000 LEADS_FILE=/tmp/leads.jsonl node scripts/e2e.mjs
```

## Updating content

- **Text, figures, contact details, RERA:** `src/content/site.ts`.
- **Interactive Google map:** set `location.coordinates = { lat, lng }` in `site.ts`. An embedded map then replaces the brochure map image. Until then, "Get Directions" uses the brochure's own Google Maps link.
- **New brochure:** replace `private/the-square-brochure.pdf` and update the page count and size line in `EnquiryForm.tsx`.
- **WhatsApp, office hours, site-office address:** fields exist in `contact` and stay hidden while `null`.

See `docs/PROJECT-REPORT.md` for the content audit, decisions and open items.
