/**
 * Single source of truth for every project fact shown on the site.
 *
 * Every value below is transcribed from the supplied source documents:
 *   [B]  The_Square_Brochure.pdf (page numbers refer to the PDF)
 *   [C]  Squarefoot Realty – Website Copy (Revised 1).docx
 *   [G]  Squarefoot Realty Branding Final.pdf
 *
 * Do not add figures that are not in an approved document. Items the client
 * still needs to supply are marked `null` and are hidden by the UI.
 */

export const site = {
  name: "The Square",
  developer: "Squarefoot Realty",
  tagline: "Everything and Beyond.", // [C] hero headline, [G] tagline
  description:
    "The Square by Squarefoot Realty: 131 East & West facing 4-BHK luxury duplex villas with 3,700 sft built-up area on 13.5 acres, Kongara Kalan Road, Adibatla, near ORR Exit 13, Hyderabad. TS RERA P02400005775.",
  url: process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  locale: "en_IN",
} as const;

/** [B p.26] Back cover — the only contact block in the brochure. */
export const contact = {
  promoter: "IRA Realty Tech Pvt. Ltd.",
  addressLines: [
    "# 4-49/2, Besides Anvaya Conventions Road",
    "Financial District, Vattinagulapally",
    "Hyderabad – 500 032, Telangana",
  ],
  phoneDisplay: "+91 9121 777 777",
  phoneHref: "tel:+919121777777",
  email: "info@irarealty.in",
  website: "https://www.irarealty.in/",
  // Not present in any supplied document — hidden until provided.
  whatsapp: null as string | null,
  officeHours: null as string | null,
  siteOfficeAddress: null as string | null,
} as const;

export const rera = {
  number: "P02400005775", // [B p.26] "TS RERA NO: P02400005775"
  authority: "Telangana State Real Estate Regulatory Authority (TS RERA)",
  portal: "https://rerait.telangana.gov.in/",
  approvals: "HMDA & RERA Approved Luxury Villa Project", // [B p.11]
} as const;

/** [B p.26] verbatim disclaimer */
export const brochureDisclaimer =
  "This brochure is purely a conceptual presentation and not a legal offering. The promoters reserve the right to make changes in elevation, specifications, and plans as deemed fit. The proposed project mentioned in the brochure will be constructed as per the application to RERA. Artist's impressions and stock images are used to illustrate the products and features of this project. Furnishing, fixtures, fittings, etc., if any, are shown for reference only and are not part of the standard units. All our projects being marketed are in the process of being registered under RERA of Telangana State Government. All Rights Reserved.";

export const location = {
  // [B p.3] "Luxury villas at Adibatla"; [B p.23] "a few steps away from ORR on Kongara Kalan Road";
  // [B p.4 map] ORR Exit No. 13 (Raviryal); [C] "Kongara Kalan (ORR Exit-13)".
  short: "Kongara Kalan Road, Adibatla",
  full: "Kongara Kalan Road, Adibatla, near ORR Exit 13 (Raviryal), Hyderabad, Telangana",
  locality: "Adibatla",
  region: "Telangana",
  city: "Hyderabad",
  // [B p.24] "Scan for Google Maps location" QR code decodes to this URL.
  mapsUrl: "https://goo.gl/maps/NThYCLgJ6HSQfnaM7",
  /**
   * Exact coordinates were not available in text form. When the client confirms
   * them, set { lat, lng } here and an interactive map is embedded automatically.
   */
  coordinates: null as { lat: number; lng: number } | null,
};

export const nav = [
  { label: "About", href: "/about" },
  { label: "The Square", href: "/#project" },
  { label: "Residences", href: "/#residences" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Location", href: "/#location" },
  { label: "Urban Ranch", href: "/urban-ranch" },
  { label: "Contact", href: "/contact" },
] as const;

/* ───────────────────────── The Square: home ───────────────────────── */

export const intro = {
  eyebrow: "The Square",
  title: "A new dimension of luxury.", // [B p.1]
  // [B p.3] — one sentence, verbatim
  body: "A world of luxury and greenery awaits you, where your dreams become a reality. Let us welcome you to The Square, an address of refinement beyond compare.",
};

/** [B p.7, p.11] Verified headline figures. */
export const highlights = [
  { value: "13.5", unit: "Acres", label: "of land" },
  { value: "131", unit: "Villas", label: "East & West facing duplex" },
  { value: "3,700", unit: "Sft", label: "Built-up area, every villa" },
  { value: "25,000", unit: "Sft+", label: "4-level exclusive clubhouse" },
] as const;

/**
 * The three signature features. Wording follows the brochure:
 *  01 [B p.7 "Provision for Home Automation (Lights, Fans & A/C's)"; p.10 "The magic of smart living
 *     and home automation" + "*Provision of Automation Technology Solutions is optional."]
 *  02 [B p.22 WINDOWS: "High-end anodized Aluminum sections for frames & shutters with clear glass";
 *     FRENCH DOORS: same]
 *  03 [B p.7 / p.16 "4-Level Exclusive Clubhouse with 25,000 Sft + area"]
 */
export const signature = [
  {
    no: "01",
    title: "Smart living & home automation",
    text: "Provision for home automation — lights, fans and A/Cs, controlled from a mobile app.",
    note: "*Provision of automation technology solutions is optional.",
    image: { src: "/images/project/living-room.jpg", w: 880, h: 881, alt: "Living room with full-height glazing — artist's impression" },
    fit: "contained" as const,
  },
  {
    no: "02",
    title: "High-end aluminium windows",
    text: "Anodised aluminium frames and shutters with clear glass, for windows and French doors alike.",
    note: null,
    image: { src: "/images/the-square-hd/east-villa-aerial.jpg", w: 2560, h: 1440, alt: "East facing villa with glazed balconies and terrace pergola — artist's impression" },
    fit: "wide" as const,
  },
  {
    no: "03",
    title: "25,000 sft+ clubhouse",
    text: "A 4-level exclusive clubhouse — swimming pool, gym, banquet hall, badminton and more.",
    note: null,
    image: { src: "/images/the-square-hd/club-house.jpg", w: 2560, h: 1440, alt: "The clubhouse at The Square — artist's impression" },
    fit: "wide" as const,
  },
];

export type FloorKey = "ground" | "first" | "terrace";

export interface Residence {
  id: string;
  type: string;
  name: string;
  facing: "East" | "West";
  plotSizes: string;
  builtUp: string;
  floors: string;
  areas: { label: string; value: string }[];
  rooms: string[];
  plans: { key: FloorKey; label: string; src: string; width: number; height: number }[];
  sheet: { src: string; width: number; height: number };
  render: { src: string; alt: string };
  download: string;
}

export const residences: Residence[] = [
  {
    // [B p.20]
    id: "type-01",
    type: "Type 01",
    name: "East Facing Villa",
    facing: "East",
    plotSizes: "267, 300 & 330 Sq. Yds",
    builtUp: "3,700 Sft",
    floors: "G+1",
    areas: [
      { label: "Ground floor", value: "1,595 Sft" },
      { label: "First floor", value: "1,671 Sft" },
      { label: "Terrace", value: "434 Sft" },
    ],
    rooms: ["4 bedrooms incl. ground-floor suite", "Multipurpose hall & pooja", "Lift provision", "Terrace with MS pergola"],
    plans: [
      { key: "ground", label: "Ground floor", src: "/images/plans/type-01-east-ground.png", width: 1550, height: 2215 },
      { key: "first", label: "First floor", src: "/images/plans/type-01-east-first.png", width: 1225, height: 1890 },
      { key: "terrace", label: "Terrace floor", src: "/images/plans/type-01-east-terrace.png", width: 1260, height: 1890 },
    ],
    sheet: { src: "/images/plans/type-01-east-sheet.jpg", width: 4475, height: 2600 },
    render: { src: "/images/project/villa-east-facing.jpg", alt: "Artist's impression of the Type 01 east facing villa" },
    download: "/downloads/floor-plans/the-square-type-01-east-facing-villa.pdf",
  },
  {
    // [B p.21]
    id: "type-02",
    type: "Type 02",
    name: "West Facing Villa",
    facing: "West",
    plotSizes: "267, 300 & 330 Sq. Yds",
    builtUp: "3,700 Sft",
    floors: "G+1",
    areas: [
      { label: "Ground floor", value: "1,564 Sft" },
      { label: "First floor", value: "1,605 Sft" },
      { label: "Terrace", value: "531 Sft" },
    ],
    rooms: ["4 bedrooms incl. ground-floor suite", "Multipurpose hall & pooja", "Lift provision", "Terrace with MS pergola"],
    plans: [
      { key: "ground", label: "Ground floor", src: "/images/plans/type-02-west-ground.png", width: 1550, height: 2300 },
      { key: "first", label: "First floor", src: "/images/plans/type-02-west-first.png", width: 1195, height: 1840 },
      { key: "terrace", label: "Terrace floor", src: "/images/plans/type-02-west-terrace.png", width: 1260, height: 1780 },
    ],
    sheet: { src: "/images/plans/type-02-west-sheet.jpg", width: 4440, height: 2600 },
    render: { src: "/images/project/villa-west-facing.jpg", alt: "Artist's impression of the Type 02 west facing villa" },
    download: "/downloads/floor-plans/the-square-type-02-west-facing-villa.pdf",
  },
];

/** Options for the enquiry form's configuration field. */
export const configurationOptions = [
  "Type 01 – East Facing Villa",
  "Type 02 – West Facing Villa",
  "Not sure yet",
] as const;
/** Every accepted value of the form's "interested in" field, across projects. */
export const allConfigurationOptions = [
  "Type 01 – East Facing Villa",
  "Type 02 – West Facing Villa",
  "Urban Ranch – Type 1 (292 Sq. Yds)",
  "Urban Ranch – Type 2 (301 Sq. Yds)",
  "Urban Ranch – Type 3 (351 Sq. Yds)",
  "Not sure yet",
] as const;

/* ───────────────────────── Amenities [B p.12–17] ───────────────────────── */

export interface AmenityGroup {
  id: string;
  label: string;
  title: string;
  text: string;
  items: string[];
  images: { src: string; alt: string; w: number; h: number }[];
}

export const amenityGroups: AmenityGroup[] = [
  {
    id: "club",
    label: "Clubhouse",
    title: "Club The Square",
    text: "A 4-level clubhouse of 25,000 sft and more — the centre of the community.", // [B p.16–17]
    items: ["Semi-covered swimming pool", "Fully loaded gymnasium", "Banquet hall", "Badminton court", "Indoor games enclave", "Yoga & meditation hall"],
    images: [
      { src: "/images/the-square-hd/club-pool-view.jpg", alt: "Clubhouse swimming pool and deck — artist's impression", w: 2560, h: 1440 },
      { src: "/images/project/swimming-pool.jpg", alt: "Semi-covered swimming pool — artist's impression", w: 880, h: 495 },
      { src: "/images/project/gymnasium.jpg", alt: "Fully loaded gymnasium — artist's impression", w: 881, h: 361 },
    ],
  },
  {
    id: "outdoors",
    label: "Outdoors",
    title: "Green, open and unhurried.",
    text: "Designer landscapes, pathways and plantation, wherever you step.", // [B p.12]
    items: ["Amphitheatre", "Party lawn", "Yoga pavilion", "Senior citizens’ plaza", "Pet-walking zone", "Jogging track"],
    images: [
      { src: "/images/project/outdoor-spaces.jpg", alt: "Landscaped outdoor spaces and avenue palms — artist's impression", w: 1573, h: 881 },
      { src: "/images/project/senior-citizens-plaza.jpg", alt: "Senior citizens' seating plaza — artist's impression", w: 424, h: 270 },
      { src: "/images/project/pergola-seating.jpg", alt: "Seating under pergola — artist's impression", w: 423, h: 272 },
    ],
  },
  {
    id: "active",
    label: "Play & fitness",
    title: "Reclaim your freedom.", // [B p.14]
    text: "Space for every age to play, train and unwind.",
    items: ["Skating rink", "Cricket net", "Half basketball court", "Outdoor gym", "Rock climbing", "Children’s play area"],
    images: [
      { src: "/images/the-square-hd/skating-rink.jpg", alt: "Skating rink with cricket net beyond — artist's impression", w: 2560, h: 1440 },
      { src: "/images/project/children-play-area.jpg", alt: "Children's play area — artist's impression", w: 423, h: 271 },
      { src: "/images/project/wide-internal-roads.jpg", alt: "Tree-lined internal road — artist's impression", w: 354, h: 270 },
    ],
  },
];

/* ───────────────────────── Gallery ───────────────────────── */

export type GalleryCategory = "Exterior" | "Interiors" | "Amenities" | "Landscape";

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  w: number;
  h: number;
}

export const gallery: GalleryImage[] = [
  { src: "/images/the-square-hd/aerial-day.jpg", caption: "Squarely in the lap of abundance", alt: "Aerial view of the villa community, clubhouse and ORR — artist's impression", category: "Exterior", w: 2560, h: 1440 },
  { src: "/images/project/villas-dusk.jpg", caption: "Where luxury villas match your stature", alt: "Row of duplex villas at dusk — artist's impression", category: "Exterior", w: 2178, h: 1099 },
  { src: "/images/the-square-hd/west-villa-aerial.jpg", caption: "West facing villa", alt: "West facing villa with terrace garden — artist's impression", category: "Exterior", w: 2560, h: 1440 },
  { src: "/images/project/living-room.jpg", caption: "The warmth of indoors", alt: "Living room with large glazed doors — artist's impression", category: "Interiors", w: 880, h: 881 },
  { src: "/images/the-square-hd/club-house.jpg", caption: "The clubhouse", alt: "Clubhouse façade — artist's impression", category: "Amenities", w: 2560, h: 1440 },
  { src: "/images/project/master-bedroom.jpg", caption: "Master bedroom", alt: "Master bedroom — artist's impression", category: "Interiors", w: 881, h: 571 },
  { src: "/images/the-square-hd/club-pool-view.jpg", caption: "Pool deck", alt: "Swimming pool and deck beside the clubhouse — artist's impression", category: "Amenities", w: 2560, h: 1440 },
  { src: "/images/project/avenue-palms.jpg", caption: "Where every square foot exudes luxury", alt: "Palm-lined avenue between villas — artist's impression", category: "Landscape", w: 2178, h: 1099 },
  { src: "/images/project/entrance-gate.jpg", caption: "The grand entrance gate", alt: "Grand entrance gate — artist's impression", category: "Exterior", w: 881, h: 464 },
  { src: "/images/the-square-hd/skating-rink.jpg", caption: "Skating rink & cricket net", alt: "Skating rink and cricket net — artist's impression", category: "Landscape", w: 2560, h: 1440 },
  { src: "/images/project/interior-lounge.jpg", caption: "Interiors", alt: "Lounge with teal armchairs — artist's impression", category: "Interiors", w: 603, h: 855 },
  { src: "/images/the-square-hd/aerial-night.jpg", caption: "The community by night", alt: "Aerial night view of the illuminated community — artist's impression", category: "Exterior", w: 2560, h: 1440 },
];

/* ───────────────────────── Location [B p.4, p.23–24] ───────────────────────── */

export const locationStory = {
  title: "The world’s happening at Hyderabad’s South.", // [B p.23]
  // [B p.23] — final sentence, verbatim
  text: "The Square rises a few steps away from ORR on Kongara Kalan Road to let a community of high fliers explore the joys of living in the lap of nature.",
};

/** [B p.24] Four headline drive times, drawn from the full table below. */
export const keyDistances: [string, number][] = [
  ["Bonguluru ORR Exit No. 12", 10],
  ["Adibatla Aerospace SEZ", 8],
  ["Rajiv Gandhi Intl. Airport", 25],
  ["Gachibowli / Financial District", 50],
];

export const distances: { title: string; items: [string, number][] }[] = [
  {
    title: "Connectivity",
    items: [
      ["Bonguluru ORR Exit No. 12", 10],
      ["ORR Exit No. 14", 11],
      ["Tukkuguda", 12],
      ["Ibrahimpatnam", 18],
      ["Srisailam Highway", 19],
      ["LB Nagar Circle", 30],
      ["DRDO Apollo Hospital", 35],
      ["Gachibowli / Financial District", 50],
    ],
  },
  {
    title: "Work places",
    items: [
      ["Adibatla Aerospace SEZ", 8],
      ["Foxconn Facility, Kongara Kalan", 8],
      ["TCS Campus, Adibatla", 10],
      ["Tata Aerospace", 10],
      ["Tata Sikorsky", 13],
      ["Fab City", 15],
      ["RCI / ARCI", 20],
      ["Hardware Park", 20],
      ["Rajiv Gandhi Intl. Airport", 25],
      ["Proposed Pharma City", 35],
      ["Kokapet SEZ", 40],
    ],
  },
  {
    title: "Education",
    items: [
      ["Sri Gayatri Jr College", 4],
      ["Narayana Jr College", 8],
      ["Sloka Intl. School", 11],
      ["TISS University", 15],
      ["Delhi Public School, Nadergul", 17],
      ["Aga Khan Academy", 20],
      ["20 Engg. Colleges nearby", 20],
      ["Manchester Global School", 25],
      ["GMR School of Business", 27],
      ["GMR Chinmaya Vidyalaya", 30],
    ],
  },
  {
    title: "Shopping & recreation",
    items: [
      ["Wonderla Amusement Park", 6],
      ["Proposed World Trade Centre", 6],
      ["Rangareddy Collectorate", 8],
      ["North Star Airport Boulevard", 15],
      ["Novotel Hotel, Airport", 20],
      ["TNR Jagdamba Mallplex", 20],
      ["Ramoji Film City", 25],
      ["Statue of Equality, Muchintal", 30],
      ["GMR Aerocity Retail Hub", 40],
    ],
  },
];

/* ───────────────────────── Developer [C] ───────────────────────── */

export const developer = {
  name: "Squarefoot Realty",
  formerly: "Formerly Sai Teja Developers. Three decades of building in Hyderabad.",
  headline: "A square. A sun. A bigger idea of home.",
  intro:
    "Three decades. One conviction: a building should be as intelligent as it is beautiful. Squarefoot Realty is a Hyderabad developer shaped by partners who have spent a generation turning land into landmarks, across apartments, villas, commercial addresses and master-planned layouts.",
  evolution:
    "We began as Sai Teja Developers. Today we are Squarefoot Realty, a new name carrying the same discipline, the same standards and a long record of promises kept.",
  minds: [
    "Our partners are alumni of IIT, ISB, CBIT and other leading institutions. Engineering precision meets business acumen and decades of ground-level experience, so every project is designed with purpose and built with rigour.",
    "They also bring varied professional experience from IT, government service and consulting. That range helps us bring the good practices of those fields into real estate, and apply them to the way we plan, build and deal with our customers.",
  ],
  brandStory: [
    "Our logo says who we are. The square stands for stability: a solid foundation, clear boundaries and a promise that holds. The sun rises beside it, bringing warmth, energy and optimism.",
    "Together they describe how we think about real estate. A good home gives you everything within its walls. A great one lets you look beyond them, to open skies, green landscapes and the possibilities that come with each new morning.",
    "That is what “Everything and Beyond” means to us. It is the vision our partners bring to every living environment we build.",
  ],
  vision: "To create living environments where every possibility is within reach.",
  values: [
    ["Stability", "We build on firm foundations, in construction and in the way we do business."],
    ["Warmth", "We design for people first, with light, comfort and community in mind."],
    ["Optimism", "We plan for the future, and for the families who will grow into it."],
    ["Passion", "We care about the details because the result is someone’s home."],
  ] as [string, string][],
  pillars: [
    ["Three decades of craft", "Apartments, villas, commercial addresses and planned layouts, built by people who have done this for a generation."],
    ["Engineering meets business sense", "Our partners come from IIT, ISB, CBIT and other leading institutions, with experience in IT, government service and consulting."],
    ["Finished, not just promised", "Our completed projects have received their occupancy certificates, and families live in them today."],
  ] as [string, string][],
  standard: [
    "Thirty years of accumulated craft",
    "A diverse portfolio of residences, commercial spaces and thoughtfully planned layouts",
    "Finished, delivered and certified, not just promised",
    "Design that earns its place, and function that lasts",
  ],
  approach: [
    ["Listen", "We start with what you need, not what we have to sell."],
    ["Plan", "We lay out the options, the numbers and the paperwork in plain language."],
    ["Build", "We deliver quality and keep you informed along the way."],
    ["Stay", "We remain available long after the keys change hands."],
  ] as [string, string][],
  unfolding: [
    { name: "The Square", place: "Kongara Kalan, ORR Exit-13", note: "131 luxury duplex villas · 13.5 acres", href: "/#project", image: "/images/project/villas-dusk.jpg" },
    { name: "Urban Ranch", place: "Kongara Kalan, ORR Exit-13", note: "163 villas · 19.5 acres", href: "/urban-ranch", image: "/images/urban-ranch/villa-cover.jpg" },
    { name: "Squarefoot Origin", place: "Manneguda, ORR Exit-12", note: "27 villas · 2.8 acres", href: null, image: null },
  ] as { name: string; place: string; note: string; href: string | null; image: string | null }[],
  /**
   * [C] delivered list. Images: Challa Elite — supplied render matching the Challa Elite brochure;
   * Trans Elite — render from the Challa Elite brochure's "Our previous projects" panel, matching the
   * Trans Elite brochure. No verified imagery for Lokeshwari Residency or Trans Arcade.
   */
  delivered: [
    { name: "Challa Elite", place: "Tukkuguda", note: "2 & 3 BHK apartments", image: "/images/portfolio/challa-elite.jpg", w: 1997, h: 1091 },
    { name: "Trans Elite", place: "Adibatla", note: "2 & 3 BHK apartments", image: "/images/portfolio/trans-elite.jpg", w: 1658, h: 928 },
    { name: "Trans Arcade", place: "Adibatla", note: null, image: null, w: 0, h: 0 },
    { name: "Lokeshwari Residency", place: "Habsiguda", note: null, image: null, w: 0, h: 0 },
  ] as { name: string; place: string; note: string | null; image: string | null; w: number; h: number }[],
  // Placeholders in the copy deck — intentionally not rendered until supplied.
  leadership: null,
  testimonials: null,
};

/* ───────────────────────── Urban Ranch [UR = Digital_UR_Mini_Brochure.pdf] ───────────────────────── */

export const urbanRanch = {
  name: "Urban Ranch",
  tagline: "Live Fresh. Live Futuristic.", // [UR p.1]
  place: "Kongara Kalan, Adibatla",
  rera: "P02400009631", // [UR p.1, p.10] "TG RERA: P02400009631"
  promoters: "IRA Realty and Ironhorse", // logos on [UR p.1, p.10]
  mapsUrl: "https://maps.app.goo.gl/gM6wyi6L1kfPmX558", // decoded from the "Scan to locate" QR [UR p.10]
  intro: {
    title: "Vibe of the rural. Vivacity of the urban.", // [UR p.2]
    body: "A villa community designed across 19.5 acres in Kongarakalan, a short distance from ORR Exit 13 — sophisticated for the modern dweller, with plentiful nature around.", // condensed from [UR p.2]
  },
  facts: [
    { value: "163", unit: "Villas", label: "Total villas" },
    { value: "19.5", unit: "Acres", label: "Total area" },
    { value: "~30,000", unit: "Sft", label: "Clubhouse" },
    { value: "11.5", unit: "Feet", label: "Ceiling height" },
  ],
  specs: [
    ["Plot sizes", "292, 301 & 351 Sq. Yds"],
    ["Built-up area", "3,807 to 4,927 Sft"],
    ["Structure", "RCC Mivan · G+2"],
    ["Facing", "East & West"],
  ] as [string, string][],
  // [UR p.7–9]
  types: [
    { type: "Type 1", plot: "292 Sq. Yds", east: "3,931.12", west: "3,807.55", features: "4 bedrooms + home theatre + lift + private decks" },
    { type: "Type 2", plot: "301 Sq. Yds", east: "4,121.54", west: "4,110.93", features: "Servant room + lift + covered terraces + VRV-ready infrastructure" },
    { type: "Type 3", plot: "351 Sq. Yds", east: "4,927.97", west: "4,903.16", features: "4 bedrooms + home theatre + lift + dry & wet kitchens + private decks" },
  ],
  // [UR p.4]
  community: ["12m & 9m wide internal roads", "Covered 2–3 car parkings per unit", "Cycling tracks & walking paths", "Skating rink & play lawns", "Landscaped green buffers", "Boom-barrier security at entry/exit"],
  // [UR p.4–5]
  clubhouse: ["Infinity pool with deck", "Reception, lounge & party hall", "Private home theatre", "Indoor badminton court", "Gym", "Yoga & meditation zones", "Creche & daycare", "Guest suites", "Covered cafeteria"],
  // [UR p.10] — selected from the full list
  distances: [
    ["Nearest ORR Exit No. 13", "3 mins"],
    ["TCS Adibatla", "3 mins"],
    ["Foxconn", "5 mins"],
    ["Adibatla Aerospace SEZ", "5 mins"],
    ["Narayana High School", "2 mins"],
    ["Rajiv Gandhi International Airport", "15 mins"],
    ["LB Nagar", "30 mins"],
    ["Gachibowli", "35 mins"],
  ] as [string, string][],
  gallery: [
    { src: "/images/urban-ranch/clubhouse.jpg", w: 901, h: 601, alt: "Urban Ranch clubhouse — artist's impression", caption: "Clubhouse" },
    { src: "/images/urban-ranch/reception.jpg", w: 968, h: 646, alt: "Clubhouse reception — artist's impression", caption: "Reception" },
    { src: "/images/urban-ranch/party-hall.jpg", w: 936, h: 624, alt: "Party hall — artist's impression", caption: "Party hall" },
    { src: "/images/urban-ranch/home-theatre.jpg", w: 949, h: 632, alt: "Private home theatre — artist's impression", caption: "Private home theatre" },
    { src: "/images/urban-ranch/gym.jpg", w: 948, h: 632, alt: "Gym — artist's impression", caption: "Gym" },
    { src: "/images/urban-ranch/play-area.jpg", w: 898, h: 539, alt: "Children's play area — artist's impression", caption: "Play area" },
  ],
  disclaimer:
    "This brochure is purely a conceptual presentation and not a legal offering. The promoters reserve the right to make changes in elevations, specifications and plans as deemed fit.", // [UR p.10]
};

/* ───────────────────────── Enquiry configuration ───────────────────────── */

export type ProjectId = "the-square" | "urban-ranch";

export const projectOptions: Record<ProjectId, { label: string; options: string[]; brochure: { pages: number; size: string } }> = {
  "the-square": {
    label: "The Square",
    options: ["Type 01 – East Facing Villa", "Type 02 – West Facing Villa", "Not sure yet"],
    brochure: { pages: 27, size: "17.9 MB" },
  },
  "urban-ranch": {
    label: "Urban Ranch",
    options: ["Urban Ranch – Type 1 (292 Sq. Yds)", "Urban Ranch – Type 2 (301 Sq. Yds)", "Urban Ranch – Type 3 (351 Sq. Yds)", "Not sure yet"],
    brochure: { pages: 10, size: "6.1 MB" },
  },
};
