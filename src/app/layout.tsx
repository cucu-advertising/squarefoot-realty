import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { site, contact, rera, location, residences } from "@/content/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import Motion from "@/components/Motion";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "The Square | Luxury Villas at Adibatla, Hyderabad | Squarefoot Realty",
    template: "%s | The Square by Squarefoot Realty",
  },
  description: site.description,
  applicationName: "The Square",
  authors: [{ name: "Squarefoot Realty" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: "The Square by Squarefoot Realty",
    title: "The Square | Luxury Villas at Adibatla, Hyderabad",
    description: site.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Duplex villas at The Square, artist's impression" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
  icons: { icon: "/icon.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1c2418",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: "Squarefoot Realty",
      alternateName: "Sai Teja Developers",
      slogan: "Everything and Beyond",
      url: site.url,
      logo: `${site.url}/images/brand/squarefoot-realty-logo.png`,
    },
    {
      "@type": "Residence",
      "@id": `${site.url}/#the-square`,
      name: "The Square",
      description: site.description,
      url: site.url,
      image: `${site.url}/og-image.jpg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kongara Kalan Road",
        addressLocality: location.locality,
        addressRegion: location.region,
        addressCountry: "IN",
      },
      hasMap: location.mapsUrl,
      amenityFeature: ["Clubhouse", "Swimming pool", "Gymnasium", "Badminton court", "Jogging track", "Children's play area"].map(
        (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
      ),
      containsPlace: residences.map((r) => ({
        "@type": "SingleFamilyResidence",
        name: `${r.type} – ${r.name}`,
        numberOfRooms: 4,
        floorSize: { "@type": "QuantitativeValue", value: 3700, unitCode: "FTK" },
      })),
      identifier: { "@type": "PropertyValue", propertyID: "TS RERA", value: rera.number },
    },
    {
      "@type": "RealEstateAgent",
      name: contact.promoter,
      telephone: contact.phoneDisplay.replace(/\s/g, ""),
      email: contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${contact.addressLines[0]}, ${contact.addressLines[1]}`,
        addressLocality: "Hyderabad",
        postalCode: "500032",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "var h=document.documentElement;h.classList.add('js');setTimeout(function(){if(!h.classList.contains('motion-ready'))h.classList.add('motion-fallback')},4000)" }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <EnquiryProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Motion />
        </EnquiryProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
