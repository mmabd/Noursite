export type ProjectStatus = "active" | "completed";

export interface Project {
  num: number;
  id: string;
  label: string;
  name: string;
  type: string;
  location: string;
  status: ProjectStatus;
  hero: string;
  gallery: string[];
  area: string;
  units: string;
  value: string;
  completion: string;
  description: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    num: 1,
    id: "P-001",
    label: "PROJECT ONE",
    name: "مشروع الغروب",
    type: "RESIDENTIAL",
    location: "CAPE TOWN, WC",
    status: "active",
    hero: "https://images.unsplash.com/photo-1759670509449-23a374206521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800",
    gallery: [
      "/assets/sunset-project/gallery-1.jpg",
      "/assets/sunset-project/gallery-2.jpg",
      "/assets/sunset-project/gallery-3.jpg",
      "/assets/sunset-project/gallery-4.jpg",
      "/assets/sunset-project/gallery-5.jpg",
    ],
    area: "12.4 HA",
    units: "320",
    value: "R1.8B",
    completion: "Q4 2026",
    description:
      "Meridian Heights is a landmark residential development perched on the eastern slopes of Cape Town's expanding urban corridor. Designed to maximise natural light and mountain views, the project delivers 320 sectional-title units across six carefully positioned residential blocks — each one oriented to minimise environmental impact and maximise passive solar gain.\n\nThe development integrates community amenities including landscaped parkways, a residents' fitness centre, and a dedicated co-working hub, setting a new benchmark for integrated residential living in the Western Cape.",
    highlights: [
      "SANS 10400-XA compliant energy-efficient design",
      "On-site rainwater harvesting & greywater reuse",
      "Fibre-ready infrastructure throughout",
      "24-hour access-controlled security perimeter",
      "Dedicated EV charging stations in basement parking",
      "Landscaped communal garden & children's play area",
    ],
  },
  {
    num: 2,
    id: "P-002",
    label: "PROJECT TWO",
    name: "NORTHGATE COMMONS",
    type: "MIXED-USE",
    location: "JOHANNESBURG, GP",
    status: "completed",
    hero: "https://images.unsplash.com/photo-1521208298387-0f7532927fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800",
    gallery: [
      "https://images.unsplash.com/photo-1671917057310-88d5fd951ece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1766761562523-92467702928e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1705242056484-213173456790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    area: "8.7 HA",
    units: "180",
    value: "R2.1B",
    completion: "Q2 2024",
    description:
      "Northgate Commons redefines the mixed-use precinct model for Johannesburg's northern suburbs. Completed ahead of schedule in 2024, the development combines 180 residential units with 4,200 m² of ground-floor retail, a boutique hotel, and flexible commercial office space — all centred around an activated public square.\n\nThe precinct was designed with walkability at its core: shaded pedestrian links, active street frontages, and curated local tenants create a genuine neighbourhood destination that draws residents and visitors alike.",
    highlights: [
      "4,200 m² of street-level retail & food & beverage",
      "Boutique hotel — 48 rooms, rooftop terrace",
      "Activated central public square with water feature",
      "2,800 m² A-grade commercial office space",
      "Structured basement parking for 620 vehicles",
      "LEED Gold certification achieved",
    ],
  },
  {
    num: 3,
    id: "P-003",
    label: "PROJECT THREE",
    name: "VANTAGE ESTATE",
    type: "LUXURY RESIDENTIAL",
    location: "STELLENBOSCH, WC",
    status: "active",
    hero: "https://images.unsplash.com/photo-1769207926973-f228026b996b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800",
    gallery: [
      "https://images.unsplash.com/photo-1704037178708-67c415542dea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1721244653652-268631ec049a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1758304480333-90d7735e9f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    area: "28.2 HA",
    units: "64",
    value: "R3.4B",
    completion: "Q3 2027",
    description:
      "Vantage Estate is Unlicensed Land Development's most prestigious residential offering — a limited collection of 64 luxury freehold erven set against the dramatic backdrop of the Stellenbosch mountain range. Each plot is positioned to afford unobstructed vineyard and mountain views, with generous plot sizes ranging from 1,200 to 3,800 m².\n\nThe estate embraces its agricultural heritage: a working olive grove and indigenous fynbos corridors weave through the development, while strict architectural guidelines ensure every home contributes to a cohesive, timeless aesthetic.",
    highlights: [
      "64 freehold erven — 1,200 to 3,800 m² each",
      "Estate architectural design guidelines enforced",
      "Working olive grove & indigenous fynbos corridors",
      "Private borehole & water-wise landscaping",
      "Fibre, solar-ready & backup power provisions",
      "Proximity to top-rated wine estates & schools",
    ],
  },
  {
    num: 4,
    id: "P-004",
    label: "PROJECT FOUR",
    name: "PLAZA CORE",
    type: "COMMERCIAL",
    location: "DURBAN, KZN",
    status: "completed",
    hero: "https://images.unsplash.com/photo-1707301454103-1384f7c535d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800",
    gallery: [
      "https://images.unsplash.com/photo-1771457362601-4818d59107d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1764520406357-aae8ac21af75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1764222233275-87dc016c11dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    area: "5.1 HA",
    units: "—",
    value: "R890M",
    completion: "Q1 2023",
    description:
      "Plaza Core is a premium commercial development in Durban's resurgent CBD fringe, delivering 14,000 m² of P-grade office space across two interconnected towers. The project was conceived as a catalyst for the broader regeneration of the surrounding precinct — and has since attracted a roster of blue-chip tenants.\n\nThe development's ground-level activation includes a curated food hall, conferencing facilities, and open-air terrace spaces, making Plaza Core as much a lifestyle destination as a workplace. It achieved full occupancy within six months of handover.",
    highlights: [
      "14,000 m² of P-grade commercial office space",
      "Two interconnected towers — 12 & 9 storeys",
      "Full occupancy within 6 months of handover",
      "Ground-floor food hall & conferencing centre",
      "4-star Green Star SA rating",
      "Backup generator & UPS for all critical systems",
    ],
  },
];
