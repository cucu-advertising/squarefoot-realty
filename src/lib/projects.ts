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
 *  - UR-BR  = "Urban Ranch Brochure" PDF (10 pp., revised with the Squarefoot Realty logo)
 *  - UR-DRIVE = Google Drive folder "Lifaang Renders" (The Urban Ranch: same aerial as UR-BR p.3)
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

/** A villa orientation with its own render and facts (shown side by side on the project page). */
export interface Facing {
  title: string;
  line: string;
  facts: string[];
  image: Img;
  /** True when this orientation's floor plans are on the page. */
  plans?: boolean;
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
  facings?: Facing[];
  locationNotes?: string[];
  mapQuery?: string;
  rera?: string;
  /** "TS RERA" (default) or "TG RERA", as printed on the project's own material. */
  reraLabel?: string;
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

const ur = (name: string, width: number, height: number, alt: string, caption?: string): Img => ({
  src: `/images/the-urban-ranch/${name}.jpg`,
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
    type: "Villa community",
    location: "Kongara Kalan, Adibatla, near ORR Exit-13, Hyderabad",
    locationShort: "Kongara Kalan · ORR Exit-13",
    pitch: "Vibe of the rural. Vivacity of the urban.",
    facts: ["163 villas", "19.5 acres", "G+2", "292 – 351 sq. yd plots"],
    overview: [
      "A villa community across 19.5 acres at Kongara Kalan, a short drive from ORR Exit-13: plenty of nature around, with the city's conveniences close at hand.",
    ],
    highlights: [
      {
        title: "30,000 sft clubhouse",
        line: "Infinity pool with deck, indoor badminton, a private home theatre and guest suites.",
        image: ur("clubhouse", 3840, 2715, "The Urban Ranch clubhouse at dusk"),
      },
      {
        title: "A lift in every villa",
        line: "G+2 villas with 11.5 ft ceilings, on plots of 292 to 351 sq. yd.",
        image: ur("villa-front", 3840, 2496, "Villa at The Urban Ranch with covered parking"),
      },
      {
        title: "Green where you want it",
        line: "Cycling tracks, walking paths and landscaped green buffers.",
        image: ur("lake-street", 3840, 2580, "Villas along a landscaped water feature at The Urban Ranch"),
      },
    ],
    hero: ur("aerial-entrance", 3840, 2143, "Aerial view of The Urban Ranch entrance, clubhouse and villas"),
    cover: ur("villas-street", 3840, 2327, "Villas along a tree-lined street at The Urban Ranch"),
    overviewImage: ur("villas-corner", 3840, 2684, "G+2 villas at The Urban Ranch"),
    ctaImage: ur("aerial-dusk", 3840, 2143, "The Urban Ranch at dusk"),
    heroTreatment: "full",
    stats: [
      { value: "163", label: "Villas in a gated community" },
      { value: "19.5", unit: "acres", label: "At Kongara Kalan, near ORR Exit-13" },
      { value: "30,000", unit: "sft", label: "Clubhouse, approximately" },
      { value: "11.5", unit: "ft", label: "Ceiling height in every villa" },
    ],
    explore: [
      { title: "The community", caption: "163 villas · 19.5 acres", image: ur("aerial-dusk", 3840, 2143, "Aerial view of The Urban Ranch at dusk") },
      { title: "The entrance", caption: "Entry and exit with boom barrier security", image: ur("aerial-entrance", 3840, 2143, "The Urban Ranch entrance and clubhouse from above") },
      { title: "The streets", caption: "Cycling tracks · Walking paths", image: ur("lake-street", 3840, 2580, "Street beside a landscaped water feature") },
      { title: "The villas", caption: "RCC Mivan · G+2 · 3,807 – 4,927 sft", image: ur("villas-corner", 3840, 2684, "Villas at The Urban Ranch") },
      { title: "The clubhouse", caption: "About 30,000 sft", image: ur("clubhouse", 3840, 2715, "The Urban Ranch clubhouse") },
    ],
    gallery: [
      ur("villas-street", 3840, 2327, "Villas along a tree-lined street", "Along the street"),
      ur("villas-corner", 3840, 2684, "Corner villas with palms", "The villas"),
      ur("villa-front", 3840, 2496, "Villa with covered parking for two cars", "Covered parking"),
      ur("lake-street", 3840, 2580, "Villas beside a landscaped water feature", "Green where you want it"),
      ur("clubhouse", 3840, 2715, "The clubhouse at dusk", "The clubhouse"),
      ur("aerial-dusk", 3840, 2143, "The community from above at dusk", "163 villas · 19.5 acres"),
      ur("aerial-entrance", 3840, 2143, "The entrance and clubhouse from above", "The entrance"),
    ],
    amenities: [
      {
        title: "The clubhouse",
        items: [
          "Infinity pool with deck",
          "Indoor badminton court",
          "Private home theatre",
          "Reception, lounge & party hall",
          "Guest suites",
          "Yoga & meditation zones",
          "Creche & daycare",
          "Covered cafeteria",
        ],
        image: ur("clubhouse", 3840, 2715, "The Urban Ranch clubhouse"),
      },
      {
        title: "Outdoors",
        items: [
          "Cycling tracks & walking paths",
          "Skating rink & play lawns",
          "Landscaped green buffers",
          "Shade structures & seating",
          "Covered parking for 2–3 cars per villa",
          "Boom barrier security at entry & exit",
        ],
        image: ur("lake-street", 3840, 2580, "Landscaped street at The Urban Ranch"),
      },
    ],
    plans: [
      { label: "Master plan", facts: ["163 villas", "19.5 acres"], image: ur("plan-master", 3200, 2189, "Master plan of The Urban Ranch") },
      { label: "Type 1 · 292 sq. yd", facts: ["East facing 3,931.12 sft", "West facing 3,807.55 sft", "4 bedrooms + home theatre"], image: ur("plan-type-1", 3200, 2189, "Type 1 villa floor plans, East and West facing") },
      { label: "Type 2 · 301 sq. yd", facts: ["East facing 4,121.54 sft", "West facing 4,110.93 sft", "Servant room + covered terraces"], image: ur("plan-type-2", 3200, 2189, "Type 2 villa floor plans, East and West facing") },
      { label: "Type 3 · 351 sq. yd", facts: ["East facing 4,927.97 sft", "West facing 4,903.16 sft", "Dry & wet kitchens"], image: ur("plan-type-3", 3200, 2189, "Type 3 villa floor plans, East and West facing") },
    ],
    locationNotes: [
      "Narayana High School · 2 mins",
      "Wonderla Amusement Park · 8 mins",
      "Proposed World Trade Centre · 8 mins",
      "GMR Aerocity, Airport · 15 mins",
      "A short drive from ORR Exit-13",
    ],
    mapQuery: "Kongara Kalan, Telangana",
    rera: "P02400009631",
    reraLabel: "TG RERA",
    seo: {
      title: "The Urban Ranch | 163 Villas at Kongara Kalan, near ORR Exit-13",
      description:
        "163 G+2 villas on 19.5 acres at Kongara Kalan with a 30,000 sft clubhouse, near ORR Exit-13, Hyderabad. TG RERA P02400009631.",
    },
  },
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
        title: "10,500 sft clubhouse",
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
      { value: "10,500", unit: "sft", label: "Clubhouse for the community" },
    ],
    explore: [
      { title: "The community", caption: "27 villas · 2.8 acres", image: og("site-aerial", 3840, 2160, "Aerial view of the Squarefoot Origin layout") },
      { title: "The entrance", caption: "Gated entrance · Clubhouse beyond", image: og("entrance", 3840, 2160, "Entrance gate at Squarefoot Origin with the clubhouse behind") },
      { title: "East facing villas", caption: "G+2 · Four bedrooms · Two-car porch", image: og("east-row", 3840, 2160, "Row of East facing villas") },
      { title: "West facing villas", caption: "G+2 · Four bedrooms · Vaastu compliant", image: og("west-row", 3840, 2160, "Row of West facing villas") },
      { title: "The clubhouse", caption: "10,500 sft · Pool, gym, banquet hall", image: og("clubhouse", 3840, 2160, "Squarefoot Origin clubhouse") },
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
    facings: [
      {
        title: "East facing",
        line: "Floor plans for all three floors are below.",
        facts: ["G+2", "Four bedrooms", "Two-car porch", "Home theatre provision"],
        image: og("east-villa", 3000, 3000, "East facing villa at Squarefoot Origin"),
        plans: true,
      },
      {
        title: "West facing",
        line: "West facing floor plans are shared on request.",
        facts: ["G+2", "Four bedrooms", "Vaastu compliant"],
        image: og("west-villa", 3000, 3000, "West facing villa at Squarefoot Origin"),
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
        "A boutique community of 27 G+2 villas on 2.8 acres with a 10,500 sft clubhouse, 5 minutes from ORR Exit-12. Book a site visit.",
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
  { value: "the-square", label: "The Square" },
  { value: "the-urban-ranch", label: "The Urban Ranch" },
  { value: "squarefoot-origin", label: "Squarefoot Origin villas" },
  { value: "trans-elite", label: "Trans Elite" },
  { value: "challa-elite", label: "Challa Elite" },
  { value: "layouts-plots", label: "Layouts and plots" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

export const enquiryOptionValues = new Set(enquiryOptions.map((o) => o.value));
