import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat/index.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Squarefoot Realty | Everything and Beyond", template: "%s" },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/images/the-square/avenue.jpg", width: 3840, height: 2160, alt: "Squarefoot Realty" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1a1a18",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint:
//  - "motion": reveal states are only applied when JS runs and motion is allowed (failsafe after 5s).
//  - "pin": pinned scroll sequences only for fine pointers ≥1024px (must match PIN_QUERY in Motion.tsx).
//  - "no-preload": the preloader plays once per session.
const motionBoot = `(function(){try{var d=document.documentElement,m=function(q){return matchMedia(q).matches};if(m('(prefers-reduced-motion: reduce)')){d.classList.add('no-motion','no-preload');return}d.classList.add('motion');if(m('(min-width: 1024px) and (hover: hover) and (pointer: fine)'))d.classList.add('pin');try{if(sessionStorage.getItem('sf-loaded'))d.classList.add('no-preload')}catch(e){}setTimeout(function(){if(!window.__motionReady){d.classList.remove('motion','pin');d.classList.add('no-preload')}},5000)}catch(e){}})();`;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Squarefoot Realty",
  alternateName: "Sai Teja Developers",
  url: site.url,
  logo: `${site.url}/icon.svg`,
  slogan: "Everything and Beyond",
  areaServed: { "@type": "City", name: "Hyderabad" },
  ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
  ...(site.contact.email ? { email: site.contact.email } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Preloader />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
        <Cursor />
      </body>
    </html>
  );
}
