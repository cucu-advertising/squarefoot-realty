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
  { label: "Project", href: "/#project" },
  { label: "Residences", href: "/#residences" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Location", href: "/#location" },
  { label: "Contact", href: "/contact" },
] as const;

/* ───────────────────────── Project ───────────────────────── */

export const intro = {
  eyebrow: "A new dimension of luxury",
  // [B p.2]
  lead:
    "It’s an intriguing invitation to explore a new dimension of luxury living, where boundaries are pushed and expectations exceeded, all within the confines of “The Square.”",
  // [B p.3]
  body: [
    "A world of luxury and greenery awaits you, where your dreams become a reality. Let us welcome you to The Square, an address of refinement beyond compare.",
    "Step into east and west facing duplex villas that display the finest space planning, where a symphony of indoors and outdoors charms you with thoughtful additions and meticulous craftsmanship.",
  ],
  // [C] brand story
  brandLine:
    "A good home gives you everything within its walls. A great one lets you look beyond them, to open skies, green landscapes and the possibilities that come with each new morning.",
};

/** [B p.7, p.11] Verified headline figures. */
export const highlights = [
  { value: "13.5", unit: "Acres", label: "of land" },
  { value: "131", unit: "Villas", label: "East & West facing duplex" },
  { value: "3,700", unit: "Sft", label: "Built-up area, every villa" },
  { value: "25,000", unit: "Sft+", label: "4-level exclusive clubhouse" },
] as const;

export const highlightFacts = [
  ["Property type", "4-BHK luxury duplex villas (G+1) with terrace"],
  ["Plot sizes", "267, 300 & 330 Sq. Yds"],
  ["Facing", "East & West"],
  ["Internal roads", "40' & 30' wide BT roads"],
  ["Parking", "Two car parking spaces for each villa"],
  ["Vastu", "100% Vastu compliant"],
  ["Approvals", "HMDA & RERA approved · TS RERA P02400005775"],
] as const;

/** [B p.7, p.11] */
export const projectHighlights = [
  "HMDA & RERA approved luxury villa project",
  "13.5 acres of land",
  "Majestic entrance gate",
  "131 East & West facing duplex villas",
  "267, 300 & 330 Sq. Yd plots",
  "All villas with 3,700 sft built-up area",
  "Provision for home automation",
  "Provision for elevator",
  "Provision for home theatre",
  "Provision for terrace garden",
  "Two car parking spaces for each villa",
  "40' & 30' wide internal BT roads",
  "100% Vastu compliant",
  "Avenue plantation & wide tree-lined avenues",
  "Courtyard with sunken seating and lush foliage",
  "Street lighting & pedestrian path",
  "Jogging track",
  "Parks, play areas & designer landscaping",
  "24-hr water supply",
  "24×7 power back-up",
] as const;

/* ───────────────────────── Residences ───────────────────────── */

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
    rooms: [
      "Ground-floor bedroom with dress & toilet",
      "Drawing, living & dining",
      "Kitchen with utility",
      "Sit-out",
      "Master bedroom with dress & toilet",
      "Two further bedrooms",
      "Multipurpose hall & pooja",
      "Study / dress",
      "Lift provision",
      "Open & covered terrace with MS pergola",
      "Two-car parking",
    ],
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
    rooms: [
      "Ground-floor bedroom with toilet",
      "Living / dining & drawing",
      "Kitchen with wash area",
      "Sit-out & 8' wide corridor",
      "Master bedroom with balcony",
      "Two further bedrooms",
      "Multipurpose hall & pooja",
      "Lift provision",
      "Open & covered terrace with MS pergola",
      "Two-car parking",
    ],
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

/* ───────────────────────── Specifications [B p.22] ───────────────────────── */

export const specifications: { title: string; items: string[] }[] = [
  { title: "Structure", items: ["R.C.C. framed structure to withstand wind & seismic loads."] },
  {
    title: "Super structure",
    items: ["9\" thick external walls & 4.5\" internal walls with fly ash bricks or red bricks, joined with 1:6 cement mortar."],
  },
  {
    title: "Plastering",
    items: [
      "External: 20 mm (total) thick, 2 coats of external plastering with cement mortar.",
      "Internal: 12 mm thick single coat plastering with cement mortar.",
    ],
  },
  {
    title: "Doors",
    items: [
      "Main door: 8 ft teak wood door frame and engineered/solid wood door shutters, veneered on both sides, with hardware of Yale/Dorset or equivalent.",
      "Internal doors: 8 ft height hardwood frame and engineered/solid wood door shutters, veneered on both sides, with hardware of Yale/Dorset or equivalent.",
      "French doors: high-end anodised aluminium sections for frames & shutters with clear glass of reputed make.",
    ],
  },
  {
    title: "Windows",
    items: ["High-end anodised aluminium sections for frames & shutters with clear glass of reputed make. Provision for mosquito mesh."],
  },
  {
    title: "Painting & cladding",
    items: [
      "External: combination of micro-concrete / lime plasters / textured finish with two top coats of external emulsion paint of reputed make.",
      "Internal: smooth putty / lappum finish with two top coats of premium acrylic emulsion of reputed make over a coat of primer.",
    ],
  },
  {
    title: "Flooring & dado",
    items: [
      "Drawing, dining, living, bedrooms, multipurpose hall & kitchen: 800 mm × 800 mm or higher glazed vitrified / double-charged vitrified tiles of reputed make.",
      "Bathrooms: 600 mm × 300 mm or higher premium vitrified tiles of reputed make on walls & floor.",
      "Staircase: combination of granite / marble; SS & glass combination railing.",
      "Car parking: VDF / Tandur stone flooring.",
    ],
  },
  {
    title: "Kitchen",
    items: [
      "Provision for designer modular kitchen with adequate electrical points for home appliances.",
      "Provision for municipal & softener water.",
      "Provision for fixing of water purifier, exhaust fan & chimney.",
    ],
  },
  { title: "Utilities / wash area", items: ["Provision for dish washer & washing machine in the utility area."] },
  {
    title: "Bathrooms",
    items: [
      "Washbasin with countertop; wall-hung EWC of Duravit/Kohler or equivalent with concealed flush tank.",
      "Single-lever wall mixer with shower & spout, and single-lever basin mixer, of Grohe/Kohler or equivalent.",
      "All CP fittings of Grohe/Kohler or equivalent make.",
      "Provision for water heaters / geysers in all bathrooms.",
    ],
  },
  {
    title: "Electrical",
    items: [
      "3-phase power supply for each villa with individual meter boards.",
      "Miniature circuit breakers (MCBs) of reputed make for each distribution board.",
      "Concealed copper wiring of Finolex / Polycab or equivalent make.",
      "Power outlets for air-conditioners in all rooms; power plugs for kitchen appliances, washing machine & dishwasher.",
      "Elegant designer modular switches of Legrand / Schneider or equivalent make.",
    ],
  },
  { title: "EV charging", items: ["Provision for an EV charging point for each villa."] },
  {
    title: "Communication",
    items: [
      "Intercom to all units connecting with Security & FM office.",
      "Provision for internet with OFC to villa & CAT-6 cable wiring internally on ground & first floor.",
      "Provision for cable network in drawing, living, multipurpose hall & all bedrooms.",
    ],
  },
  {
    title: "Elevator",
    items: ["Provision for elevator/lift in the designated area with adequate shaft dimensions for any reputed make such as Schindler / Kone."],
  },
  {
    title: "WTP & STP",
    items: [
      "WTP: domestic water through an exclusive water softening plant with water meters for each villa (not an RO plant).",
      "STP: sewage treatment plant of adequate capacity as per norms; treated water used for landscaping.",
      "Rain-water harvesting pits as per norms.",
    ],
  },
  { title: "Generator", items: ["100% DG back-up for the entire villa community with acoustic enclosure & A.M.F."] },
  {
    title: "Security",
    items: [
      "Round-the-clock security / surveillance system.",
      "Barbed wire fencing all around the community, above the boundary wall.",
      "CCTV cameras in identified common areas & clubhouse areas, monitored and recorded at the FM office.",
    ],
  },
  {
    title: "Centralised water supply",
    items: ["Centralised underground sump for the entire community, supplied to individual villas by hydro-pneumatic pump (HNS)."],
  },
  {
    title: "Landscaping",
    items: ["Beautifully designed landscaping with lighting, activity areas and children's play area for the community, as per design."],
  },
];

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
    label: "Club The Square",
    title: "A 4-level clubhouse of 25,000 sft and more.",
    text:
      "“Club The Square” is virtually the center of the community — the haven where residents entertain and connect over a variety of avocations, whether it’s weekdays or weekends.",
    items: [
      "Entrance lobby",
      "Banquet hall",
      "Semi-covered swimming pool",
      "Badminton court",
      "Fully loaded gymnasium",
      "Indoor games enclave",
      "Multi-purpose hall",
      "Yoga & meditation hall",
      "Creche",
      "Guest rooms",
      "Provision for grocery store",
    ],
    images: [
      { src: "/images/project/clubhouse.jpg", alt: "Club The Square, the 4-level clubhouse, artist's impression", w: 1573, h: 881 },
      { src: "/images/project/swimming-pool.jpg", alt: "Semi-covered swimming pool at the clubhouse", w: 880, h: 495 },
      { src: "/images/project/gymnasium.jpg", alt: "Fully loaded gymnasium", w: 881, h: 361 },
    ],
  },
  {
    id: "outdoors",
    label: "Outdoor living",
    title: "More square yards and freedom than you can imagine.",
    text:
      "The outdoor views are an attractive blend of designer landscapes, pathways and plantation — a place to watch children play and community connect in the open.",
    items: [
      "Amphitheatre",
      "Open stage with lawn",
      "Party lawn",
      "Yoga pavilion & yoga deck",
      "Stepping stones",
      "Senior citizens’ seating plaza",
      "Seating under trees & pergolas",
      "Street-end seating under pergola",
      "Courtyard with sunken seating",
      "Pet-walking zone",
    ],
    images: [
      { src: "/images/project/outdoor-spaces.jpg", alt: "Landscaped outdoor spaces and avenue palms", w: 1573, h: 881 },
      { src: "/images/project/senior-citizens-plaza.jpg", alt: "Senior citizens' seating plaza under the trees", w: 424, h: 270 },
      { src: "/images/project/pergola-seating.jpg", alt: "Street-end seating under pergola", w: 423, h: 272 },
    ],
  },
  {
    id: "active",
    label: "Play & fitness",
    title: "Reclaim your freedom.",
    text:
      "When it comes to relaxation and rejuvenation, you’ll find everything you aspire for in the pampering environment of The Square.",
    items: [
      "Half basketball court & fitness station",
      "Outdoor gym",
      "Skating rink & covered pavilion",
      "Cricket net",
      "Rock climbing",
      "Children’s play area",
      "Jogging track",
      "Parks & play areas",
    ],
    images: [
      { src: "/images/project/children-play-area.jpg", alt: "Children's play area", w: 423, h: 271 },
      { src: "/images/project/wide-internal-roads.jpg", alt: "Wide internal roads lined with trees", w: 354, h: 270 },
      { src: "/images/project/avenue-plantation.jpg", alt: "Aerial view of villas and avenue plantation", w: 355, h: 272 },
    ],
  },
  {
    id: "smart",
    label: "Smart living",
    title: "The magic of smart living and home automation.",
    text:
      "Control lighting, climate, and electronics effortlessly. Create the perfect ambience with automatic illumination and enjoy seamless living at your fingertips.",
    items: [
      "Smart lighting",
      "Fans",
      "Air conditioner",
      "Mobile app enabled",
      "Motion sensor for bathrooms",
      "Mesh network",
      "Light dimmer",
      "Universal IR blaster",
      "Smart door lock system",
    ],
    images: [
      { src: "/images/project/multipurpose-hall.jpg", alt: "Multipurpose hall, artist's impression", w: 424, h: 277 },
      { src: "/images/project/kitchen.jpg", alt: "Kitchen, artist's impression", w: 423, h: 278 },
      { src: "/images/project/master-bedroom.jpg", alt: "Master bedroom, artist's impression", w: 881, h: 571 },
    ],
  },
];

export const smartHomeNote = "*Provision of automation technology solutions is optional."; // [B p.10]

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
  { src: "/images/project/villas-dusk.jpg", caption: "Where luxury villas match your stature", alt: "Row of contemporary duplex villas at dusk", category: "Exterior", w: 2178, h: 1099 },
  { src: "/images/project/villa-elevation.jpg", caption: "Your villa", alt: "Duplex villa elevation with terrace pergola and two-car porch", category: "Exterior", w: 881, h: 880 },
  { src: "/images/project/entrance-gate.jpg", caption: "The grand entrance gate", alt: "Grand entrance gate of The Square", category: "Exterior", w: 881, h: 464 },
  { src: "/images/project/villa-terrace-garden.jpg", caption: "Provision for terrace garden", alt: "Aerial view of a villa with terrace garden", category: "Exterior", w: 881, h: 881 },
  { src: "/images/project/aerial-masterplan.jpg", caption: "Squarely in the lap of abundance", alt: "Aerial view of the 13.5 acre villa community surrounded by greenery", category: "Exterior", w: 2179, h: 1098 },
  { src: "/images/project/living-room.jpg", caption: "The warmth of indoors & views of outdoors", alt: "Living room with large glazed doors", category: "Interiors", w: 880, h: 881 },
  { src: "/images/project/master-bedroom.jpg", caption: "Master bedroom", alt: "Master bedroom interior", category: "Interiors", w: 881, h: 571 },
  { src: "/images/project/interior-lounge.jpg", caption: "Interiors", alt: "Lounge interior with teal armchairs", category: "Interiors", w: 603, h: 855 },
  { src: "/images/project/clubhouse.jpg", caption: "Club The Square", alt: "Clubhouse exterior with timber façade", category: "Amenities", w: 1573, h: 881 },
  { src: "/images/project/swimming-pool.jpg", caption: "Semi-covered swimming pool", alt: "Semi-covered swimming pool", category: "Amenities", w: 880, h: 495 },
  { src: "/images/project/gymnasium.jpg", caption: "Fully loaded gymnasium", alt: "Gymnasium with cardio and strength equipment", category: "Amenities", w: 881, h: 361 },
  { src: "/images/project/avenue-palms.jpg", caption: "Where every square foot exudes luxury", alt: "Palm-lined avenue between villas", category: "Landscape", w: 2178, h: 1099 },
  { src: "/images/project/outdoor-spaces.jpg", caption: "More outdoor spaces", alt: "Landscaped outdoor spaces seen from a villa balcony", category: "Landscape", w: 1573, h: 881 },
  { src: "/images/project/internal-road.jpg", caption: "Internal road with avenue plantation", alt: "Internal road with avenue plantation", category: "Landscape", w: 880, h: 393 },
];

/* ───────────────────────── Location [B p.4, p.23–24] ───────────────────────── */

export const locationStory = {
  title: "The world’s happening at Hyderabad’s South.",
  text:
    "The arrival of an International Airport, Aerospace SEZ at Adibatla on ORR, the proposed Foxconn Facility at Kongara Kalan make Hyderabad's South an eminently desirable place to settle down. The Square rises a few steps away from ORR on Kongara Kalan Road to let a community of high fliers explore the joys of living in the lap of nature.",
};

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
    { name: "Squarefoot Origin", place: "Manneguda, ORR Exit-12", note: "Boutique villa community · 27 villas · 2.8 acres" },
    { name: "The Square", place: "Kongara Kalan, ORR Exit-13", note: "131 luxury duplex villas · 13.5 acres" },
    { name: "The Urban Ranch", place: "Kongara Kalan, ORR Exit-13", note: "Details to be announced" },
  ],
  delivered: [
    ["Lokeshwari Residency", "Habsiguda"],
    ["Trans Elite", "Adibatla"],
    ["Trans Arcade", "Adibatla"],
    ["Challa Elite", "Tukkuguda"],
  ] as [string, string][],
  // Placeholders in the copy deck — intentionally not rendered until supplied.
  leadership: null,
  testimonials: null,
};
