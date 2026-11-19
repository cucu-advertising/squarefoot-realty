/**
 * Single source of truth for every project on the site.
 *
 * Every fact here is traceable to a supplied source:
 *  - COPY   = "Squarefoot Realty – Website Copy (Revised 2)" .docx
 *  - SQ-BR  = "The Square" brochure PDF (27 pp.)
 *  - CE-BR  = "Challa Elite" brochure PDF (2 pp.)
 *  - TE-BR  = Trans Elite brochure spreads (supplied as images)
 *  - DRIVE  = Google Drive render folder "Jpeg" (The Square renders)
 *  - OR-DRIVE = Google Drive folder of Squarefoot Origin renders and East facing floor plans
 *
 * Do not add figures, approvals, prices or distances that are not in a source.
 */

export type ProjectStatus = "now-unfolding" | "upcoming" | "delivered";

export interface Img {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

export interface Highlight {
  title: string;
  line: string;
  image?: Img;
}

export interface FloorPlan {
  label: string;
  facts?: string[];
  image: Img;
}

export interface Stat {
  /** Display value. Purely numeric values (e.g. "131", "13.5") count up on scroll. */
  value: string;
  unit?: string;
  label: string;
}

/** One state in the 2D architectural exploration (real renders only). */
export interface ExploreView {
  title: string;
  caption: string;
  image: Img;
}

export interface Project {
  slug: string;
  name: string;
  /** Has a dedicated detail page. Projects with no supplied material are listed only. */
  hasPage: boolean;
  status: ProjectStatus;
  statusLabel: string;
  type: string;
  location: string;
  locationShort: string;
  pitch: string;
  /** Short facts strip: 3–5 items. */
  facts: string[];
  overview?: string[];
  highlights?: Highlight[];
  hero?: Img;
  /** Listing image (projects overview, home rows, nav). Falls back to hero. */
  cover?: Img;
  overviewImage?: Img;
  /** "type" = brand panel for projects without supplied renders. */
  heroTreatment?: "full" | "type";
  stats?: Stat[];
  /** Background for the brochure/enquiry band. */
  ctaImage?: Img;
  gallery?: Img[];
  explore?: ExploreView[];
  amenities?: { title: string; items: string[]; image?: Img }[];
  plans?: FloorPlan[];
  locationNotes?: string[];
  mapQuery?: string;
  rera?: string;
  partner?: string;
  /** Key into the private brochure map (src/lib/brochures.ts). Undefined = no brochure supplied. */
  brochure?: string;
  seo: { title: string; description: string };
}

const og = (name: string, width: number, height: number, alt: string, caption?: string): Img => ({
  src: `/images/squarefoot-origin/${name}.jpg`,
  width,
  height,
  alt,
  caption,
});

const sq = (name: string, width: number, height: number, alt: string, caption?: string): Img => ({
  src: `/images/the-square/${name}.jpg`,
  width,
  height,
  alt,
  caption,
});

export const projects: Project[] = [
  {
    slug: "squarefoot-origin",
    name: "Squarefoot Origin",
    hasPage: true,
    status: "now-unfolding",
    statusLabel: "Now unfolding",
    type: "Boutique villa community",
    location: "Manneguda, near ORR Exit-12, Hyderabad",
    locationShort: "Manneguda · ORR Exit-12",
    pitch: "Where a home becomes a community.",
    facts: ["27 villas", "2.8 acres", "G+2", "4 bedrooms", "East or West facing"],
    overview: [
      "A boutique villa community of just 27 residences, small enough that neighbours become friends and friends become family.",
    ],
    highlights: [
      {
        title: "Home theatre provision",
        line: "A dedicated space on the top floor for movie nights, with parking for two cars below.",
        image: og("east-villa", 3000, 3000, "East facing G+2 villa at Squarefoot Origin with a two-car porch"),
      },
      {
        title: "Vaastu compliant",
        line: "East or West facing, functionally planned so tradition and everyday ease sit side by side.",
        image: og("west-corner", 3840, 2160, "West facing villas at Squarefoot Origin"),
      },
      {
        title: "8,500 sft clubhouse",
        line: "Pool, gym, badminton court, banquet hall and guest rooms for the community.",
        image: og("entrance", 3840, 2160, "Squarefoot Origin entrance with the clubhouse behind"),
      },
    ],
    heroTreatment: "full",
    hero: og("east-row", 3840, 2160, "Row of East facing G+2 villas at Squarefoot Origin"),
    cover: og("west-row", 3840, 2160, "Row of West facing villas at Squarefoot Origin"),
    overviewImage: og("west-garden", 3840, 2160, "West facing villas framed by trees at Squarefoot Origin"),
    ctaImage: og("site-aerial", 3840, 2160, "Aerial view of the Squarefoot Origin community"),
    stats: [
      { value: "27", label: "Villas in a boutique community" },
      { value: "2.8", unit: "acres", label: "Of land, near ORR Exit-12" },
      { value: "G+2", label: "Four-bedroom villas, East or West facing" },
      { value: "8,500", unit: "sft", label: "Clubhouse for the community" },
    ],
    explore: [
      { title: "The community", caption: "27 villas · 2.8 acres", image: og("site-aerial", 3840, 2160, "Aerial view of the Squarefoot Origin layout") },
      { title: "The entrance", caption: "Gated entrance · Clubhouse beyond", image: og("entrance", 3840, 2160, "Entrance gate at Squarefoot Origin with the clubhouse behind") },
      { title: "East facing villas", caption: "G+2 · Four bedrooms · Two-car porch", image: og("east-row", 3840, 2160, "Row of East facing villas") },
      { title: "West facing villas", caption: "G+2 · Four bedrooms · Vaastu compliant", image: og("west-row", 3840, 2160, "Row of West facing villas") },
      { title: "The clubhouse", caption: "8,500 sft · Pool, gym, banquet hall", image: og("clubhouse", 3840, 2160, "Squarefoot Origin clubhouse") },
    ],
    gallery: [
      og("east-street", 3840, 2160, "East facing villas along the street", "East facing villas"),
      og("entrance", 3840, 2160, "Entrance gate with the clubhouse behind", "The entrance"),
      og("west-villa", 3000, 3000, "Front elevation of a West facing villa", "West facing villa"),
      og("west-garden", 3840, 2160, "West facing villas framed by trees", "West facing villas"),
      og("east-villa-corner", 3000, 3000, "Corner view of an East facing villa", "East facing villa"),
      og("clubhouse", 3840, 2160, "Clubhouse elevation", "The clubhouse"),
      og("west-street", 3840, 2160, "Row of West facing villas", "Along the street"),
      og("site-aerial", 3840, 2160, "Aerial view of the community", "27 villas · 2.8 acres"),
    ],
    amenities: [
      {
        title: "The clubhouse",
        items: ["Swimming pool", "Gym", "Badminton court", "Banquet hall", "Indoor games", "Guest rooms"],
        image: og("clubhouse", 3840, 2160, "Squarefoot Origin clubhouse elevation"),
      },
    ],
    plans: [
      {
        label: "Ground floor",
        facts: ["Living & drawing", "Kitchen / dining", "Parent's room", "Two-car porch"],
        image: og("plan-east-ground", 2480, 3507, "Ground floor plan of the East facing villa at Squarefoot Origin"),
      },
      {
        label: "First floor",
        facts: ["Master bedroom with walk-in wardrobe", "Children's bedroom", "Family lounge", "Puja"],
        image: og("plan-east-first", 2480, 3507, "First floor plan of the East facing villa at Squarefoot Origin"),
      },
      {
        label: "Second floor",
        facts: ["Bedroom with walk-in wardrobe", "Home theatre provision", "Pantry", "Terrace"],
        image: og("plan-east-second", 2480, 3507, "Second floor plan of the East facing villa at Squarefoot Origin"),
      },
    ],
    locationNotes: [
      "5-minute drive from ORR Exit-12 (Bonguluru)",
      "About 20 minutes from LB Nagar",
    ],
    mapQuery: "Manneguda, Telangana",
    seo: {
      title: "Squarefoot Origin | 27 Villas near ORR Exit-12, Hyderabad",
      description:
        "A boutique community of 27 G+2 villas on 2.8 acres with an 8,500 sft clubhouse, 5 minutes from ORR Exit-12. Book a site visit.",
    },
  },
  {
    slug: "the-square",
    name: "The Square",
    hasPage: true,
    status: "now-unfolding",
    statusLabel: "Now unfolding",
    type: "Luxury villa community",
    location: "Kongara Kalan Road, near ORR Exit-13, Adibatla, Hyderabad",
    locationShort: "Kongara Kalan · ORR Exit-13",
    pitch: "A new dimension of luxury.",
    facts: ["131 villas", "13.5 acres", "3,700 sft villas", "267 – 330 sq. yd plots"],
    overview: [
      "East and west facing 4-BHK duplex villas with terrace gardens, a few steps from the ORR on Kongara Kalan Road.",
    ],
    stats: [
      { value: "131", label: "East & west facing duplex villas" },
      { value: "13.5", unit: "acres", label: "Gated community near ORR Exit-13" },
      { value: "3,700", unit: "sft", label: "Built-up area, every villa" },
      { value: "25,000", unit: "sft+", label: "Four-level clubhouse" },
    ],
    highlights: [
      {
        title: "Automation-ready homes",
        line: "Provision for smart control of lights, fans and air-conditioning.",
        image: sq("east-villa", 3840, 3840, "East facing duplex villa at The Square"),
      },
      {
        title: "Aluminium windows",
        line: "High-end anodised aluminium windows and French doors.",
        image: sq("east-villa-glazing", 2176, 1237, "Close-up of a villa's aluminium windows and French doors"),
      },
      {
        title: "25,000 sft+ clubhouse",
        line: "Four levels of pool, gym, banquet hall and more.",
        image: sq("club-pool", 4000, 2250, "Semi-covered pool at the clubhouse"),
      },
    ],
    hero: sq("aerial-night", 4000, 2250, "Aerial view of The Square villa community at dusk"),
    cover: sq("west-villa-aerial", 3840, 2160, "West facing villa at The Square"),
    overviewImage: sq("terrace-view", 3840, 2160, "Landscaped gardens seen from a villa terrace"),
    ctaImage: sq("aerial-close", 3840, 2160, "Aerial view of villas and parks at The Square"),
    heroTreatment: "full",
    gallery: [
      sq("avenue", 3840, 2160, "Tree-lined avenue between duplex villas", "Avenue plantation"),
      sq("clubhouse", 4000, 2250, "Clubhouse facade", "The clubhouse"),
      sq("entrance", 3840, 3109, "Grand entrance gate", "The grand entrance"),
      sq("west-villa-aerial", 3840, 2160, "West facing villa with terrace garden", "West facing villa"),
      sq("terrace-view", 3840, 2160, "Landscaped gardens seen from a villa terrace", "Terrace view"),
      sq("skating-rink", 4000, 2250, "Skating rink and cricket net in the landscaped park", "Skating rink & cricket net"),
      sq("villas-dusk", 2178, 1099, "Row of duplex villas at dusk", "Villas at dusk"),
      sq("aerial-close", 3840, 2160, "Aerial view of villas around a landscaped park", "Parks & play areas"),
    ],
    explore: [
      { title: "The master plan", caption: "131 villas · 13.5 acres · ORR Exit-13", image: sq("masterplan-aerial", 3840, 2160, "Aerial of The Square master plan beside the ORR") },
      { title: "The grand entrance", caption: "Majestic entrance gate · Round-the-clock security", image: sq("entrance", 3840, 3109, "The Square's grand entrance gate") },
      { title: "East facing villa", caption: "Type 01 · 3,700 sft · Terrace garden provision", image: sq("east-villa-aerial", 3840, 2160, "East facing villa with terrace garden") },
      { title: "West facing villa", caption: "Type 02 · 3,700 sft · Two-car parking", image: sq("west-villa-aerial", 3840, 2160, "West facing villa with terrace garden") },
      { title: "Club The Square", caption: "Four levels · 25,000 sft+", image: sq("clubhouse", 4000, 2250, "The Square clubhouse") },
      { title: "After dusk", caption: "Street lighting · Avenue plantation", image: sq("aerial-night", 4000, 2250, "The Square at dusk") },
    ],
    amenities: [
      {
        title: "Club The Square",
        items: [
          "Semi-covered swimming pool",
          "Gymnasium",
          "Banquet hall",
          "Badminton court",
          "Indoor games",
          "Yoga & meditation hall",
          "Creche",
          "Guest rooms",
        ],
        image: sq("club-pool", 4000, 2250, "Club pool"),
      },
      {
        title: "Outdoors",
        items: [
          "Amphitheatre",
          "Skating rink",
          "Cricket net",
          "Half basketball court",
          "Jogging track",
          "Outdoor gym",
          "Pet-walking zone",
          "Children's play area",
        ],
        image: sq("skating-rink", 4000, 2250, "Skating rink"),
      },
    ],
    plans: [
      {
        label: "Master plan",
        facts: ["131 villas", "40' & 30' internal roads"],
        image: sq("plan-masterplan", 3200, 1800, "Master landscape plan of The Square"),
      },
      {
        label: "Type 01 · East facing",
        facts: ["Ground 1,595 sft", "First 1,671 sft", "Terrace 434 sft"],
        image: sq("plan-type-01-east", 2560, 1280, "Type 01 east facing villa floor plans"),
      },
      {
        label: "Type 02 · West facing",
        facts: ["Ground 1,564 sft", "First 1,605 sft", "Terrace 531 sft"],
        image: sq("plan-type-02-west", 2560, 1280, "Type 02 west facing villa floor plans"),
      },
    ],
    locationNotes: [
      "A few steps from ORR Exit-13 on Kongara Kalan Road",
      "Sri Gayatri Jr College · 4 mins",
      "Wonderla Amusement Park · 6 mins",
      "Proposed World Trade Centre · 6 mins",
      "Narayana Jr College · 8 mins",
    ],
    mapQuery: "Kongara Kalan, Telangana",
    rera: "P02400005775",
    partner: "Promoted with IRA Realty Tech Pvt. Ltd.",
    brochure: "the-square",
    seo: {
      title: "The Square | 131 Luxury Villas near ORR Exit-13, Hyderabad",
      description:
        "131 east and west facing 3,700 sft duplex villas on 13.5 acres with a 25,000 sft+ clubhouse, near ORR Exit-13. TS RERA P02400005775.",
    },
  },
  {
    slug: "the-urban-ranch",
    name: "The Urban Ranch",
    hasPage: true,
    status: "upcoming",
    statusLabel: "Upcoming",
    type: "Upcoming community",
    location: "Kongara Kalan, near ORR Exit-13, Hyderabad",
    locationShort: "Kongara Kalan · ORR Exit-13",
    pitch: "The next chapter on the ORR corridor.",
    facts: ["Kongara Kalan", "ORR Exit-13"],
    heroTreatment: "type",
    mapQuery: "Kongara Kalan, Telangana",
    seo: {
      title: "The Urban Ranch | Upcoming at Kongara Kalan | Squarefoot Realty",
      description:
        "The Urban Ranch is an upcoming Squarefoot Realty community at Kongara Kalan, near ORR Exit-13. Register your interest to hear first.",
    },
  },
  {
    slug: "trans-elite",
    name: "Trans Elite",
    hasPage: true,
    status: "delivered",
    statusLabel: "Delivered · OC received",
    type: "Apartments",
    location: "Beside TCS Campus, Adibatla, ORR Exit-12",
    locationShort: "Adibatla · ORR Exit-12",
    pitch: "Exclusivity and elegance, beside the TCS campus.",
    facts: ["2 & 3 BHK", "1,245 – 1,830 sft", "HMDA approved"],
    overview: [
      "Super deluxe 2 and 3 bedroom apartments beside the TCS campus at Adibatla. Delivered, and home to families today.",
    ],
    highlights: [
      { title: "Beside TCS Adibatla", line: "Next to the area's biggest landmarks." },
      { title: "Pool, gym & party hall", line: "With a shuttle court and children's play area." },
      { title: "Two-level car parking", line: "No common walls. Vaastu compliant." },
    ],
    hero: {
      src: "/images/trans-elite/exterior.jpg",
      width: 2000,
      height: 1440,
      alt: "Trans Elite apartments exterior",
    },
    heroTreatment: "full",
    stats: [
      { value: "2 & 3", unit: "BHK", label: "Super deluxe apartments" },
      { value: "1,245–1,830", unit: "sft", label: "Home sizes" },
      { value: "HMDA", label: "Approved" },
      { value: "OC", label: "Occupancy certificate received" },
    ],
    gallery: [
      { src: "/images/trans-elite/exterior.jpg", width: 2000, height: 1440, alt: "Trans Elite exterior", caption: "Trans Elite" },
    ],
    plans: [
      {
        label: "Typical floor",
        facts: ["2 & 3 BHK", "1,245 – 1,830 sft"],
        image: {
          src: "/images/trans-elite/plan-typical-floor.jpg",
          width: 2000,
          height: 1388,
          alt: "Trans Elite typical floor plan",
        },
      },
    ],
    locationNotes: ["Sy. No. 96, beside TCS Campus, Adibatla, R.R. Dist."],
    mapQuery: "TCS Adibatla, Telangana",
    brochure: "trans-elite",
    seo: {
      title: "Trans Elite, Adibatla | Delivered Apartments | Squarefoot Realty",
      description:
        "Trans Elite: 2 & 3 BHK super deluxe apartments beside the TCS campus, Adibatla. Delivered with occupancy certificate.",
    },
  },
  {
    slug: "challa-elite",
    name: "Challa Elite",
    hasPage: true,
    status: "delivered",
    statusLabel: "Delivered · OC received",
    type: "Apartments",
    location: "Old Challa Gardens, Tukkuguda, ORR Exit-14",
    locationShort: "Tukkuguda · ORR Exit-14",
    pitch: "For those looking for the perfect home.",
    facts: ["2 & 3 BHK", "1,150 – 1,895 sft", "HMDA approved"],
    overview: [
      "Super deluxe 2 and 3 bedroom apartments at Tukkuguda, inside the ORR. Delivered, and home to families today.",
    ],
    highlights: [
      { title: "Inside the ORR", line: "About 10 minutes to the airport, Fab City and Wonderla." },
      { title: "East, west & north facing", line: "With no common walls between homes." },
      { title: "Banquet hall & gardens", line: "Plus a grand gateway and two-level parking." },
    ],
    hero: {
      src: "/images/challa-elite/elevation-corner.jpg",
      width: 1997,
      height: 1091,
      alt: "Challa Elite apartments, corner elevation",
    },
    heroTreatment: "full",
    overviewImage: { src: "/images/challa-elite/elevation-front.jpg", width: 1959, height: 917, alt: "Challa Elite front elevation" },
    stats: [
      { value: "2 & 3", unit: "BHK", label: "Super deluxe apartments" },
      { value: "1,150–1,895", unit: "sft", label: "Home sizes" },
      { value: "HMDA", label: "Approved" },
      { value: "OC", label: "Occupancy certificate received" },
    ],
    gallery: [
      { src: "/images/challa-elite/elevation-corner.jpg", width: 1997, height: 1091, alt: "Challa Elite corner elevation", caption: "Corner elevation" },
      { src: "/images/challa-elite/elevation-front.jpg", width: 1959, height: 917, alt: "Challa Elite front elevation", caption: "Front elevation" },
    ],
    plans: [
      {
        label: "Typical floor",
        facts: ["2 & 3 BHK", "1,150 – 1,895 sft"],
        image: {
          src: "/images/challa-elite/plan-typical-floor.jpg",
          width: 1418,
          height: 1678,
          alt: "Challa Elite typical floor plan",
        },
      },
    ],
    locationNotes: [
      "Sy. No. 198, Old Challa Gardens, Tukkuguda, R.R. Dist.",
      "10 mins: Shamshabad Airport, Fab City, Wonderla",
      "20 mins: TCS Adibatla, Aero City, Pharma City",
      "30 mins: Gachibowli, Financial District",
    ],
    mapQuery: "Tukkuguda, Telangana",
    brochure: "challa-elite",
    seo: {
      title: "Challa Elite, Tukkuguda | Delivered Apartments | Squarefoot Realty",
      description:
        "Challa Elite: 2 & 3 BHK super deluxe apartments at Tukkuguda, inside the ORR. Delivered with occupancy certificate.",
    },
  },
  {
    slug: "trans-arcade",
    name: "Trans Arcade",
    hasPage: false,
    status: "delivered",
    statusLabel: "Delivered · OC received",
    type: "Commercial",
    location: "Adibatla, ORR Exit-12",
    locationShort: "Adibatla · ORR Exit-12",
    pitch: "A commercial address at Adibatla.",
    facts: ["Commercial"],
    hero: {
      src: "/images/trans-arcade/exterior.jpg",
      width: 1280,
      height: 720,
      alt: "Commercial building at Adibatla",
    },
    seo: { title: "", description: "" },
  },
  {
    slug: "lokeshwari-residency",
    name: "Lokeshwari Residency",
    hasPage: false,
    status: "delivered",
    statusLabel: "Delivered · OC received",
    type: "Residential",
    location: "Habsiguda, Hyderabad",
    locationShort: "Habsiguda",
    pitch: "",
    facts: [],
    seo: { title: "", description: "" },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const pageProjects = projects.filter((p) => p.hasPage);
export const activeProjects = projects.filter((p) => p.status !== "delivered");
export const deliveredProjects = projects.filter((p) => p.status === "delivered");

/** Options for enquiry forms. Mirrors the dropdown in the approved copy. */
export const enquiryOptions = [
  { value: "squarefoot-origin", label: "Squarefoot Origin villas" },
  { value: "the-square", label: "The Square" },
  { value: "the-urban-ranch", label: "The Urban Ranch" },
  { value: "trans-elite", label: "Trans Elite" },
  { value: "challa-elite", label: "Challa Elite" },
  { value: "layouts-plots", label: "Layouts and plots" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

export const enquiryOptionValues = new Set(enquiryOptions.map((o) => o.value));
