/**
 * Company facts (from the approved website copy and brand book) and public
 * contact details. Contact details are read from environment variables so that
 * nothing unverified is ever hard-coded; any block whose value is empty is hidden.
 */
const env = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export const site = {
  name: "Squarefoot Realty",
  tagline: "Everything and Beyond.",
  formerly: "Formerly Sai Teja Developers. Three decades of building in Hyderabad.",
  url: (env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Squarefoot Realty, formerly Sai Teja Developers, builds villas, apartments and layouts in Hyderabad. Three decades of experience. Explore our projects.",
  contact: {
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    whatsapp: env(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP),
    office: env(process.env.NEXT_PUBLIC_OFFICE_ADDRESS),
    siteOffice: env(process.env.NEXT_PUBLIC_SITE_OFFICE_ADDRESS),
    hours: env(process.env.NEXT_PUBLIC_OFFICE_HOURS),
  },
  social: [
    { label: "Instagram", href: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL) },
    { label: "Facebook", href: env(process.env.NEXT_PUBLIC_FACEBOOK_URL) },
    { label: "LinkedIn", href: env(process.env.NEXT_PUBLIC_LINKEDIN_URL) },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href)),
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
  ],
};

export const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;
export const waHref = (n: string) => `https://wa.me/${n.replace(/\D/g, "")}`;
