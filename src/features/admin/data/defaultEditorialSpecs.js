/**
 * Default architectural streetwear editorial specifications.
 * Used for pre-filling new products in Admin and providing smart fallbacks on customer ProductDetail.
 */

export const DEFAULT_TECH_FEATURES = [
  { heading: "240 GSM KNIT", desc: "100% combed compact cotton with zero-lint exterior finish." },
  { heading: "DROP SHOULDER", desc: "Calibrated architectural cut providing dramatic shoulder overhang." },
  { heading: "32MM RIB COLLAR", desc: "Reinforced twin-needle rib-knit. Guaranteed zero stretch or wrinkle." },
  { heading: "ZERO-FADE DYE", desc: "Pigment reactive vat-dyed yarn. Guaranteed color depth through 50+ washes." }
];

export const DEFAULT_MACRO_TILES = [
  {
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&auto=format&fit=crop",
    tag: "240 GSM COMBED COMPACT COTTON",
    title: "High-density yarn-spun 40s/2-ply",
    desc: "Interlock compact weaving prevents surface fuzzing and delivers deep drape memory."
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop",
    tag: "REINFORCED 32MM RIB COLLAR",
    title: "Twin-needle construction",
    desc: "Anti-sag collar interior taped with herringbone binding to sit flush against the collarbone."
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&auto=format&fit=crop",
    tag: "DROPPED SHOULDER ARCHITECTURE",
    title: "Calibrated pattern block",
    desc: "Engineered 4.5cm armhole drop creates clean geometric fall without underarm bunching."
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=700&auto=format&fit=crop",
    tag: "STYLING DIRECTION",
    title: "Paired with TYPE-01 Denim",
    desc: "Works seamlessly tucked or floating freely over heavyweight bottoms."
  }
];

export const DEFAULT_ACCORDIONS = {
  silhouette: [
    "Constructed in Mumbai using heavyweight Indian long-staple cotton.",
    "Formulated with an intentional 4.5cm dropped armhole and wide boxy chest proportion that eliminates underarm tension while maintaining high drape memory.",
    "Blind-stitched sleeve openings and bottom hem for an unencumbered monolithic edge.",
    "Twelve stitch-per-inch garment construction for reinforced tensile endurance.",
    "High mock rib sitting flush against the collarbone without choking.",
    "Woven monolithic OSMAKI store label discreetly stitched at lower hip."
  ],
  logistics: "Orders are carefully packed in protective matte security foil and dispatched via Bluedart / Delhivery Express Air from our central fulfillment studio within 24 hours. Full automated tracking updates dispatched via SMS and WhatsApp.",
  care: "Machine wash cold (30°C) inside out with mild detergent. Line dry in shaded ambient air. Do not tumble dry to protect fiber cohesion. Warm iron on reverse side."
};

export const DEFAULT_SIZE_GUIDE = [
  { size: "S", chest: '38"', length: '28.5"', shoulder: '21.0"', sleeve: '8.0"' },
  { size: "M", chest: '41"', length: '29.5"', shoulder: '22.0"', sleeve: '8.5"' },
  { size: "L", chest: '44"', length: '30.5"', shoulder: '23.0"', sleeve: '9.0"' },
  { size: "XL", chest: '47"', length: '31.5"', shoulder: '24.0"', sleeve: '9.5"' },
  { size: "XXL", chest: '50"', length: '32.5"', shoulder: '25.0"', sleeve: '10.0"' }
];
