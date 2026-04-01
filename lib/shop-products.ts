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
const PLACEHOLDER_IMG = "/assets/Blogs/Blog1.jpeg";

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
    images: [PLACEHOLDER_IMG],
    category: "clothing",
    featured: true,
    active: true,
    gelatoCatalogId: "",
    gelatoProductUid: "",
    designUrl: "",
    variants: [
      {
        id: "s-black",
        size: "S",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
      },
      {
        id: "m-black",
        size: "M",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
      },
      {
        id: "l-black",
        size: "L",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
      },
      {
        id: "xl-black",
        size: "XL",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
      },
      {
        id: "s-white",
        size: "S",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: "",
      },
      {
        id: "m-white",
        size: "M",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: "",
      },
      {
        id: "l-white",
        size: "L",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: "",
      },
      {
        id: "xl-white",
        size: "XL",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: "",
      },
    ],
  },
  {
    id: "beafox-hoodie-classic",
    slug: "beafox-classic-hoodie",
    nameKey: "hoodie",
    descriptionKey: "hoodie",
    price: 4999,
    images: [PLACEHOLDER_IMG],
    category: "clothing",
    featured: true,
    active: true,
    gelatoCatalogId: "",
    gelatoProductUid: "",
    designUrl: "",
    variants: [
      {
        id: "s-black",
        size: "S",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
      },
      {
        id: "m-black",
        size: "M",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
      },
      {
        id: "l-black",
        size: "L",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
      },
      {
        id: "xl-black",
        size: "XL",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
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
    images: [PLACEHOLDER_IMG],
    category: "drinkware",
    featured: true,
    active: true,
    gelatoCatalogId: "",
    gelatoProductUid: "",
    designUrl: "",
    variants: [
      {
        id: "white-325ml",
        color: "Weiß",
        colorHex: "#ffffff",
        gelatoVariantId: "",
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
    images: [PLACEHOLDER_IMG],
    category: "stickers",
    featured: false,
    active: true,
    gelatoCatalogId: "",
    gelatoProductUid: "",
    designUrl: "",
    variants: [
      { id: "default", gelatoVariantId: "" },
    ],
  },
  // ----- ACCESSOIRES -----
  {
    id: "beafox-tote-bag",
    slug: "beafox-jutebeutel",
    nameKey: "totebag",
    descriptionKey: "totebag",
    price: 1999,
    images: [PLACEHOLDER_IMG],
    category: "accessories",
    featured: false,
    active: true,
    gelatoCatalogId: "",
    gelatoProductUid: "",
    designUrl: "",
    variants: [
      {
        id: "natural",
        color: "Natur",
        colorHex: "#f5f0e8",
        gelatoVariantId: "",
      },
      {
        id: "black",
        color: "Schwarz",
        colorHex: "#1a1a1a",
        gelatoVariantId: "",
      },
    ],
  },
  {
    id: "beafox-phone-case",
    slug: "beafox-handy-huelle",
    nameKey: "phonecase",
    descriptionKey: "phonecase",
    price: 1999,
    images: [PLACEHOLDER_IMG],
    category: "accessories",
    featured: false,
    active: true,
    gelatoCatalogId: "",
    gelatoProductUid: "",
    designUrl: "",
    variants: [
      { id: "iphone-15", size: "iPhone 15", gelatoVariantId: "" },
      { id: "iphone-15-pro", size: "iPhone 15 Pro", gelatoVariantId: "" },
      { id: "iphone-16", size: "iPhone 16", gelatoVariantId: "" },
      { id: "iphone-16-pro", size: "iPhone 16 Pro", gelatoVariantId: "" },
      { id: "samsung-s24", size: "Samsung S24", gelatoVariantId: "" },
    ],
  },
  // ----- WANDKUNST -----
  {
    id: "beafox-poster-a3",
    slug: "beafox-poster-a3",
    nameKey: "poster",
    descriptionKey: "poster",
    price: 1499,
    images: [PLACEHOLDER_IMG],
    category: "art",
    featured: false,
    active: true,
    gelatoCatalogId: "",
    gelatoProductUid: "",
    designUrl: "",
    variants: [
      { id: "a3", size: "A3 (29,7 × 42 cm)", gelatoVariantId: "" },
      { id: "a2", size: "A2 (42 × 59,4 cm)", gelatoVariantId: "", priceOverride: 1999 },
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
