// =====================================================
// SHOP PRODUCT CATALOG — BeAFox Print-on-Demand (Gelato)
// =====================================================

// TYPES
export type ProductCategory =
  | "clothing"
  | "drinkware"
  | "stickers"
  | "accessories"
  | "art";

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  gelatoVariantId: string;
  priceOverride?: number; // in Cent, falls abweichend
}

export interface ShopProduct {
  id: string;
  slug: string;
  nameKey: string; // Translation key (shop.products.<key>.name)
  descriptionKey: string; // Translation key (shop.products.<key>.description)
  price: number; // in Cent (EUR)
  compareAtPrice?: number; // Streichpreis in Cent
  images: string[]; // Pfade zu Produktbildern
  category: ProductCategory;
  variants: ProductVariant[];
  gelatoCatalogId: string; // Gelato Katalog-ID
  gelatoProductUid: string; // Gelato Produkt-UID
  designUrl: string; // URL zum Design-File (Gelato)
  featured?: boolean; // Auf Startseite anzeigen
  active: boolean; // Im Shop sichtbar
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  updatedAt: number;
}

// CONSTANTS
const DESIGN_BASE = "https://beafox.app/assets/Shop";
const IMG_BASE = "/assets/Shop";

// Gelato UID Helpers — baut die vollständige productUid pro Variante
const APPAREL_BASE_TSHIRT =
  "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic";
const APPAREL_BASE_HOODIE =
  "apparel_product_gca_hoodie_gsc_pullover_gcu_unisex_gqa_classic";

function apparelUid(base: string, size: string, color: string): string {
  return `${base}_gsi_${size}_gco_${color}_gpr_4-4`;
}

// =====================================================
// PRODUKTE
// =====================================================
export const SHOP_PRODUCTS: ShopProduct[] = [
  // ----- BEKLEIDUNG -----
  {
    id: "beafox-tshirt-classic",
    slug: "beafox-classic-tshirt",
    nameKey: "tshirt",
    descriptionKey: "tshirt",
    price: 2999,
    images: [`${IMG_BASE}/tshirt-design.webp`],
    category: "clothing",
    featured: true,
    active: true,
    gelatoCatalogId: "apparel",
    gelatoProductUid: APPAREL_BASE_TSHIRT,
    designUrl: `${DESIGN_BASE}/tshirt-design.webp`,
    variants: [
      {
        id: "s-black",
        size: "S",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: apparelUid(APPAREL_BASE_TSHIRT, "s", "black"),
      },
      {
        id: "m-black",
        size: "M",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: apparelUid(APPAREL_BASE_TSHIRT, "m", "black"),
      },
      {
        id: "l-black",
        size: "L",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: apparelUid(APPAREL_BASE_TSHIRT, "l", "black"),
      },
      {
        id: "xl-black",
        size: "XL",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: apparelUid(APPAREL_BASE_TSHIRT, "xl", "black"),
      },
      {
        id: "s-white",
        size: "S",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: apparelUid(APPAREL_BASE_TSHIRT, "s", "white"),
      },
      {
        id: "m-white",
        size: "M",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: apparelUid(APPAREL_BASE_TSHIRT, "m", "white"),
      },
      {
        id: "l-white",
        size: "L",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: apparelUid(APPAREL_BASE_TSHIRT, "l", "white"),
      },
      {
        id: "xl-white",
        size: "XL",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: apparelUid(APPAREL_BASE_TSHIRT, "xl", "white"),
      },
    ],
  },
  {
    id: "beafox-hoodie-classic",
    slug: "beafox-classic-hoodie",
    nameKey: "hoodie",
    descriptionKey: "hoodie",
    price: 4999,
    images: [`${IMG_BASE}/hoodie-design.webp`],
    category: "clothing",
    featured: true,
    active: true,
    gelatoCatalogId: "apparel",
    gelatoProductUid: APPAREL_BASE_HOODIE,
    designUrl: `${DESIGN_BASE}/hoodie-design.webp`,
    variants: [
      {
        id: "s-black",
        size: "S",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: apparelUid(APPAREL_BASE_HOODIE, "s", "black"),
      },
      {
        id: "m-black",
        size: "M",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: apparelUid(APPAREL_BASE_HOODIE, "m", "black"),
      },
      {
        id: "l-black",
        size: "L",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: apparelUid(APPAREL_BASE_HOODIE, "l", "black"),
      },
      {
        id: "xl-black",
        size: "XL",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: apparelUid(APPAREL_BASE_HOODIE, "xl", "black"),
      },
    ],
  },
  // ----- TRINKGEFÄSSE -----
  {
    id: "beafox-mug-classic",
    slug: "beafox-classic-tasse",
    nameKey: "mug",
    descriptionKey: "mug",
    price: 1499,
    images: [`${IMG_BASE}/mug-design.webp`],
    category: "drinkware",
    featured: true,
    active: true,
    gelatoCatalogId: "mugs",
    gelatoProductUid: "mug_product_msz_11-oz_mmat_ceramic-white_cl_4-0",
    designUrl: `${DESIGN_BASE}/mug-design.webp`,
    variants: [
      {
        id: "white-325ml",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: "mug_product_msz_11-oz_mmat_ceramic-white_cl_4-0",
      },
    ],
  },
  // ----- STICKER -----
  {
    id: "beafox-sticker-pack",
    slug: "beafox-sticker-pack",
    nameKey: "stickers",
    descriptionKey: "stickers",
    price: 699,
    images: [`${IMG_BASE}/sticker-design.webp`],
    category: "stickers",
    featured: false,
    active: true,
    gelatoCatalogId: "stickers",
    gelatoProductUid: "sticker_product_ss_circle-2x2_smat_white-vinyl_cl_4-0",
    designUrl: `${DESIGN_BASE}/sticker-design.webp`,
    variants: [
      {
        id: "default",
        gelatoVariantId:
          "sticker_product_ss_circle-2x2_smat_white-vinyl_cl_4-0",
      },
    ],
  },
  // ----- ACCESSOIRES -----
  {
    id: "beafox-tote-bag",
    slug: "beafox-jutebeutel",
    nameKey: "totebag",
    descriptionKey: "totebag",
    price: 1999,
    images: [`${IMG_BASE}/totebag-design.webp`],
    category: "accessories",
    featured: false,
    active: true,
    gelatoCatalogId: "apparel",
    gelatoProductUid:
      "apparel_product_gca_tote-bag_gsc_flat_gcu_unisex_gqa_classic",
    designUrl: `${DESIGN_BASE}/totebag-design.webp`,
    variants: [
      {
        id: "natural",
        color: "Natur",
        colorHex: "#f5f0e8",
        gelatoVariantId:
          "apparel_product_gca_tote-bag_gsc_flat_gcu_unisex_gqa_classic_gsi_one-size_gco_natural_gpr_4-0",
      },
      {
        id: "black",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId:
          "apparel_product_gca_tote-bag_gsc_flat_gcu_unisex_gqa_classic_gsi_one-size_gco_black_gpr_4-0",
      },
    ],
  },
  {
    id: "beafox-phone-case",
    slug: "beafox-handy-huelle",
    nameKey: "phonecase",
    descriptionKey: "phonecase",
    price: 1999,
    images: [`${IMG_BASE}/phonecase-design.webp`],
    category: "accessories",
    featured: false,
    active: true,
    gelatoCatalogId: "phone-cases",
    gelatoProductUid: "phonecase_apple",
    designUrl: `${DESIGN_BASE}/phonecase-design.webp`,
    variants: [
      {
        id: "iphone-15",
        size: "iPhone 15",
        gelatoVariantId:
          "phonecase_apple_iphone-15_flexi_transparent_satin",
      },
      {
        id: "iphone-15-pro",
        size: "iPhone 15 Pro",
        gelatoVariantId:
          "phonecase_apple_iphone-15pro_flexi_transparent_satin",
      },
      {
        id: "iphone-16",
        size: "iPhone 16",
        gelatoVariantId:
          "phonecase_apple_iphone-16_flexi_transparent_satin",
      },
      {
        id: "iphone-16-pro",
        size: "iPhone 16 Pro",
        gelatoVariantId:
          "phonecase_apple_iphone-16pro_flexi_transparent_satin",
      },
      {
        id: "samsung-s24",
        size: "Samsung S24",
        gelatoVariantId:
          "phonecase_samsung_galaxy-s24_flexi_transparent_satin",
      },
    ],
  },
  // ----- WANDKUNST -----
  {
    id: "beafox-poster-a3",
    slug: "beafox-poster-a3",
    nameKey: "poster",
    descriptionKey: "poster",
    price: 1499,
    images: [`${IMG_BASE}/poster-design.webp`],
    category: "art",
    featured: false,
    active: true,
    gelatoCatalogId: "posters",
    gelatoProductUid: "flat_product",
    designUrl: `${DESIGN_BASE}/poster-design.webp`,
    variants: [
      {
        id: "a3",
        size: "A3 (29,7 × 42 cm)",
        gelatoVariantId:
          "flat_297x420-mm-a3_170-gsm-65lb-uncoated_4-0_ver",
      },
      {
        id: "a2",
        size: "A2 (42 × 59,4 cm)",
        gelatoVariantId:
          "flat_420x594-mm-a2_170-gsm-65lb-uncoated_4-0_ver",
        priceOverride: 1999,
      },
    ],
  },
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/** Alle aktiven Produkte */
export function getActiveProducts(): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.active);
}

/** Featured Produkte für die Startseite */
export function getFeaturedProducts(): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.active && p.featured);
}

/** Produkt nach Slug finden */
export function getProductBySlug(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug && p.active);
}

/** Produkt nach ID finden */
export function getProductById(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.id === id);
}

/** Produkte nach Kategorie filtern */
export function getProductsByCategory(
  category: ProductCategory,
): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.active && p.category === category);
}

/** Alle verfügbaren Kategorien mit Produktanzahl */
export function getProductCategories(): {
  key: ProductCategory;
  count: number;
}[] {
  const active = getActiveProducts();
  const counts = new Map<ProductCategory, number>();
  for (const p of active) {
    counts.set(p.category, (counts.get(p.category) || 0) + 1);
  }
  return Array.from(counts.entries()).map(([key, count]) => ({ key, count }));
}

/** Preis für eine Variante berechnen (in Cent) */
export function getVariantPrice(
  product: ShopProduct,
  variantId: string,
): number {
  const variant = product.variants.find((v) => v.id === variantId);
  return variant?.priceOverride ?? product.price;
}

/** Preis in Euro formatieren */
export function formatPrice(cents: number, locale = "de-DE"): string {
  return (cents / 100).toLocaleString(locale, {
    style: "currency",
    currency: "EUR",
  });
}

/** Alle Slugs (für generateStaticParams) */
export function getAllProductSlugs(): string[] {
  return getActiveProducts().map((p) => p.slug);
}
