export type LotStatus = 'available' | 'reserved' | 'sold';

export interface Lot {
  id: string;
  num: number;
  label: string;
  status: LotStatus;
  size: number;        // m²
  price: string;       // display
  priceRaw: number;    // for sorting
  description: string;
  photos: string[];
  featured: boolean;
  points: string;      // SVG polygon points
  cx: number;          // label centroid x
  cy: number;          // label centroid y
}

const IMGS = {
  a: "https://images.unsplash.com/photo-1764223531702-1614efb82e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  b: "https://images.unsplash.com/photo-1695959085986-f1370e18bc95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  c: "https://images.unsplash.com/photo-1595709915817-38e68573934d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  d: "https://images.unsplash.com/photo-1671769194944-47293018a9d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
};

/*
 * SVG viewBox: 0 0 880 580
 * Layout:
 *   Left margin: 28 | Left block: x 28–418 | V-road: 418–436 | Right block: 436–852 | Right margin: 28
 *   Top margin: 28  | Top block: y 28–288   | H-road: 288–306 | Bot block: 306–552   | Bot margin: 28
 *   Internal sub-roads within each block at y 148–158 and y 426–436
 */

export const lots: Lot[] = [
  // ── TL Block · Row 1 (y 28–148) ─────────────────────────────────────
  {
    id: "lot-01", num: 1, label: "LOT 01",
    status: "available", size: 523, price: "R985,000", priceRaw: 985000,
    description: "Accessible interior lot with a flat building envelope and western exposure. Established road frontage with full municipal service connections ready for construction commencement.",
    photos: [], featured: false,
    points: "28,28 162,30 160,146 28,148", cx: 95, cy: 88,
  },
  {
    id: "lot-02", num: 2, label: "LOT 02",
    status: "available", size: 481, price: "R920,000", priceRaw: 920000,
    description: "Central block position with level terrain and service access from both sides. Ideal for a compact family dwelling or a solid investment property with strong rental appeal in this precinct.",
    photos: [], featured: false,
    points: "162,30 294,32 292,144 160,146", cx: 227, cy: 88,
  },
  {
    id: "lot-03", num: 3, label: "LOT 03",
    status: "reserved", size: 556, price: "R1,050,000", priceRaw: 1050000,
    description: "Slightly elevated corner position with open outlook to the east. Generous plot dimensions provide ample room for a full-footprint dwelling with a wraparound garden and additional parking.",
    photos: [], featured: false,
    points: "294,32 418,28 418,148 292,144", cx: 356, cy: 88,
  },
  // ── TL Block · Row 2 (y 158–288) ─────────────────────────────────────
  {
    id: "lot-04", num: 4, label: "LOT 04",
    status: "available", size: 386, price: "R750,000", priceRaw: 750000,
    description: "Compact and well-priced lot in the southern row of the western block. All services installed, access road in place. Entry-level pricing in a quality, fully serviced development.",
    photos: [], featured: false,
    points: "28,158 132,158 130,285 28,288", cx: 80, cy: 222,
  },
  {
    id: "lot-05", num: 5, label: "LOT 05",
    status: "available", size: 412, price: "R820,000", priceRaw: 820000,
    description: "A sought-after interior lot in the western block offering a level building envelope and excellent solar orientation. Serviced boundaries, established access road, and close proximity to the development's parkway corridor.",
    photos: [IMGS.a, IMGS.b], featured: true,
    points: "132,158 224,160 222,285 130,285", cx: 177, cy: 222,
  },
  {
    id: "lot-06", num: 6, label: "LOT 06",
    status: "sold", size: 398, price: "R760,000", priceRaw: 760000,
    description: "Compact interior lot — sold. This plot typifies the development's interior offering: level, well-serviced, and efficiently sized for a modern single-storey dwelling.",
    photos: [], featured: false,
    points: "224,160 316,158 314,284 222,285", cx: 269, cy: 222,
  },
  {
    id: "lot-07", num: 7, label: "LOT 07",
    status: "reserved", size: 362, price: "R680,000", priceRaw: 680000,
    description: "Corner lot at the eastern boundary of the western block with two street frontages. Currently under reservation. An efficient plot with great street presence for a corner-design home.",
    photos: [], featured: false,
    points: "316,158 418,158 418,286 314,284", cx: 367, cy: 222,
  },
  // ── TR Block · Row 1 (y 28–148) ─────────────────────────────────────
  {
    id: "lot-08", num: 8, label: "LOT 08",
    status: "available", size: 578, price: "R1,100,000", priceRaw: 1100000,
    description: "Corner entry lot to the eastern block with excellent visibility and dual road access. Large plot with generous side setbacks — suitable for a prominent family home with strong street appeal.",
    photos: [], featured: false,
    points: "436,30 570,28 568,146 436,148", cx: 503, cy: 88,
  },
  {
    id: "lot-09", num: 9, label: "LOT 09",
    status: "available", size: 602, price: "R1,150,000", priceRaw: 1150000,
    description: "One of the development's prime lots, situated on the northern-facing row with sweeping views across the valley. Generous dimensions accommodate a range of architectural orientations and building footprints.",
    photos: [IMGS.c, IMGS.d], featured: true,
    points: "570,28 710,32 708,144 568,146", cx: 639, cy: 88,
  },
  {
    id: "lot-10", num: 10, label: "LOT 10",
    status: "reserved", size: 545, price: "R1,050,000", priceRaw: 1050000,
    description: "Corner lot at the north-eastern boundary with wide frontage and an elevated position. Currently reserved. Commanding placement within the eastern block with open northern views.",
    photos: [], featured: false,
    points: "710,32 852,28 852,148 708,144", cx: 781, cy: 88,
  },
  // ── TR Block · Row 2 (y 158–288) ─────────────────────────────────────
  {
    id: "lot-11", num: 11, label: "LOT 11",
    status: "available", size: 652, price: "R1,250,000", priceRaw: 1250000,
    description: "Largest lot in the eastern block's southern row, offering exceptional width and depth. A premium plot for a large family home with room for a pool and garden. Full services and tarred road access.",
    photos: [IMGS.b, IMGS.c], featured: false,
    points: "436,158 592,158 590,286 436,284", cx: 514, cy: 222,
  },
  {
    id: "lot-12", num: 12, label: "LOT 12",
    status: "reserved", size: 614, price: "R1,180,000", priceRaw: 1180000,
    description: "Interior premium lot in the eastern block's southern row with a generous building envelope. Reserved. Flat terrain, maximum buildable area, and excellent investment-grade credentials.",
    photos: [], featured: false,
    points: "592,158 724,160 722,286 590,286", cx: 657, cy: 223,
  },
  {
    id: "lot-13", num: 13, label: "LOT 13",
    status: "sold", size: 580, price: "R1,100,000", priceRaw: 1100000,
    description: "Corner lot at the south-eastern boundary — sold. Premium corner positioning with views to the east and an open boundary attracted early interest from buyers wanting a prestige corner position.",
    photos: [], featured: false,
    points: "724,160 852,158 852,286 722,286", cx: 788, cy: 223,
  },
  // ── BL Block · Row 1 (y 306–426) ─────────────────────────────────────
  {
    id: "lot-14", num: 14, label: "LOT 14",
    status: "available", size: 574, price: "R1,080,000", priceRaw: 1080000,
    description: "Corner lot at the intersection of Northern Drive and Main Boulevard, benefiting from two street frontages and additional setback flexibility. A premium position within the southern block offering excellent visibility and a distinctive corner-design opportunity.",
    photos: [IMGS.a, IMGS.d], featured: true,
    points: "28,306 164,306 162,424 28,426", cx: 96, cy: 366,
  },
  {
    id: "lot-15", num: 15, label: "LOT 15",
    status: "available", size: 538, price: "R1,020,000", priceRaw: 1020000,
    description: "Mid-block position in the south-western section with consistent level terrain and good solar access. Serviced and ready to build — a solid investment or self-build opportunity.",
    photos: [], featured: false,
    points: "164,306 292,308 290,424 162,424", cx: 227, cy: 366,
  },
  {
    id: "lot-16", num: 16, label: "LOT 16",
    status: "available", size: 521, price: "R980,000", priceRaw: 980000,
    description: "Eastern boundary lot in the south-western block with generous frontage and open easterly aspect. Efficient rectangular shape makes for straightforward architectural planning.",
    photos: [IMGS.c, IMGS.a], featured: false,
    points: "292,308 418,306 418,426 290,424", cx: 355, cy: 366,
  },
  // ── BL Block · Row 2 (y 436–552) ─────────────────────────────────────
  {
    id: "lot-17", num: 17, label: "LOT 17",
    status: "sold", size: 492, price: "R940,000", priceRaw: 940000,
    description: "South-western corner lot — sold. A compact but well-positioned plot that attracted strong interest for its quiet corner location and relative affordability within the overall development.",
    photos: [], featured: false,
    points: "28,436 156,436 154,550 28,552", cx: 92, cy: 494,
  },
  {
    id: "lot-18", num: 18, label: "LOT 18",
    status: "reserved", size: 468, price: "R880,000", priceRaw: 880000,
    description: "Compact interior lot in the southernmost row of the western block. Reserved. Level site, all services in, close to access road. Ideal for a lock-up-and-go home or investment rental unit.",
    photos: [], featured: false,
    points: "156,436 278,438 276,550 154,550", cx: 216, cy: 494,
  },
  {
    id: "lot-19", num: 19, label: "LOT 19",
    status: "reserved", size: 504, price: "R960,000", priceRaw: 960000,
    description: "Southern perimeter lot with open views to the south and a wide building envelope. Reserved. An ideal plot for a home that maximises outdoor entertainment, taking full advantage of the southerly aspect.",
    photos: [], featured: false,
    points: "278,438 418,436 418,552 276,550", cx: 348, cy: 494,
  },
  // ── BR Block · Row 1 (y 306–426) ─────────────────────────────────────
  {
    id: "lot-20", num: 20, label: "LOT 20",
    status: "available", size: 668, price: "R1,280,000", priceRaw: 1280000,
    description: "The largest available lot in the south-eastern block, offering exceptional depth and width. Elevated position provides commanding outlooks and premium privacy from neighbouring properties — a flagship lot within the development.",
    photos: [IMGS.d, IMGS.b], featured: true,
    points: "436,306 594,306 592,424 436,422", cx: 515, cy: 365,
  },
  {
    id: "lot-21", num: 21, label: "LOT 21",
    status: "reserved", size: 634, price: "R1,220,000", priceRaw: 1220000,
    description: "Generous interior lot in the south-eastern block's northern row. Reserved. Flat level terrain with a wide building envelope and full service connections — premium precinct at a considered price point.",
    photos: [], featured: false,
    points: "594,306 732,308 730,424 592,424", cx: 662, cy: 366,
  },
  {
    id: "lot-22", num: 22, label: "LOT 22",
    status: "available", size: 612, price: "R1,180,000", priceRaw: 1180000,
    description: "Eastern corner lot in the south-eastern block's northern row with open views and dual road frontage. A premium boundary position with extra setback space and significant landscaping potential.",
    photos: [], featured: false,
    points: "732,308 852,306 852,424 730,424", cx: 792, cy: 366,
  },
  // ── BR Block · Row 2 (y 436–552) ─────────────────────────────────────
  {
    id: "lot-23", num: 23, label: "LOT 23",
    status: "available", size: 652, price: "R1,240,000", priceRaw: 1240000,
    description: "Corner lot at the south-western entry of the south-eastern block with a wide front boundary and excellent street presence. Generous land area for a statement home design with significant visual impact.",
    photos: [], featured: false,
    points: "436,436 592,436 590,550 436,552", cx: 514, cy: 494,
  },
  {
    id: "lot-24", num: 24, label: "LOT 24",
    status: "reserved", size: 628, price: "R1,210,000", priceRaw: 1210000,
    description: "Interior lot in the south-eastern block's final row. Reserved. Level, serviced, and ready. The quiet interior position offers maximum privacy and a calm residential setting.",
    photos: [], featured: false,
    points: "592,436 732,438 730,550 590,550", cx: 661, cy: 494,
  },
  {
    id: "lot-25", num: 25, label: "LOT 25",
    status: "available", size: 596, price: "R1,140,000", priceRaw: 1140000,
    description: "South-eastern corner lot at the outer boundary of the development. Open aspect to the east and south, generous plot dimensions, and a premium position offering privacy and views — the final lot of this exceptional precinct.",
    photos: [], featured: false,
    points: "732,438 852,436 852,552 730,550", cx: 792, cy: 494,
  },
];
