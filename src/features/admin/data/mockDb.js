// mockDb.js
// Persistent local state helper for admin dashboard operations

const SEED_PRODUCTS = [
  {
    id: "p1",
    name: "Rosewater Hydrating Toner",
    description: "A gentle hydrating formulation enriched with Damascus Rose petals to balance and refresh.",
    price: 950,
    category: "Skincare",
    gender: "Unisex",
    variants: [
      { id: "v1", sku: "OSM-TON-RSE-200", size: "200ml", color: "Clear", stock: 45, price: 950, status: "active" },
      { id: "v2", sku: "OSM-TON-RSE-500", size: "500ml", color: "Clear", stock: 12, price: 1850, status: "active" }
    ]
  },
  {
    id: "p2",
    name: "Parsley Seed Cleanser",
    description: "A clarifying cleanser with antioxidant benefits, ideal for daily facial wash.",
    price: 1250,
    category: "Skincare",
    gender: "Unisex",
    variants: [
      { id: "v3", sku: "OSM-CLN-PAR-100", size: "100ml", color: "Amber", stock: 8, price: 1250, status: "active" },
      { id: "v4", sku: "OSM-CLN-PAR-250", size: "250ml", color: "Amber", stock: 0, price: 2400, status: "active" }
    ]
  },
  {
    id: "p3",
    name: "Bergamot Body Wash",
    description: "An invigorating shower gel infused with citrus bergamot essential oils.",
    price: 850,
    category: "Body Care",
    gender: "Unisex",
    variants: [
      { id: "v5", sku: "OSM-BDY-BRG-500", size: "500ml", color: "Citrus", stock: 60, price: 850, status: "active" }
    ]
  },
  {
    id: "p4",
    name: "Cedarwood Beard Oil",
    description: "Nourishing beard conditioner with cedarwood extracts for healthy facial hair growth.",
    price: 1100,
    category: "Men Grooming",
    gender: "Men",
    variants: [
      { id: "v6", sku: "OSM-BRD-CED-50", size: "50ml", color: "Wood", stock: 2, price: 1100, status: "active" }
    ]
  }
];

const SEED_LOGS = [
  { id: "l1", variantSku: "OSM-TON-RSE-200", type: "in", quantity: 45, reason: "Initial stock allocation", createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: "l2", variantSku: "OSM-TON-RSE-500", type: "in", quantity: 12, reason: "Initial stock allocation", createdAt: new Date(Date.now() - 3600000 * 23).toISOString() },
  { id: "l3", variantSku: "OSM-CLN-PAR-100", type: "in", quantity: 8, reason: "Restock order", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: "l4", variantSku: "OSM-CLN-PAR-250", type: "out", quantity: 5, reason: "Customer purchase order", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "l5", variantSku: "OSM-BDY-BRG-500", type: "adjustment", quantity: -2, reason: "Damaged inventory discard", createdAt: new Date(Date.now() - 1800000).toISOString() }
];

export const getAdminProducts = () => {
  const data = localStorage.getItem("osmaki_admin_products");
  if (!data) {
    localStorage.setItem("osmaki_admin_products", JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  return JSON.parse(data);
};

export const saveAdminProducts = (products) => {
  localStorage.setItem("osmaki_admin_products", JSON.stringify(products));
};

export const getAdminLogs = () => {
  const data = localStorage.getItem("osmaki_admin_logs");
  if (!data) {
    localStorage.setItem("osmaki_admin_logs", JSON.stringify(SEED_LOGS));
    return SEED_LOGS;
  }
  return JSON.parse(data);
};

export const addAdminLog = (log) => {
  const logs = getAdminLogs();
  const newLog = {
    id: "l_" + Date.now(),
    createdAt: new Date().toISOString(),
    ...log
  };
  localStorage.setItem("osmaki_admin_logs", JSON.stringify([newLog, ...logs]));
};
