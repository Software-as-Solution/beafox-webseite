import type { Metadata } from "next";
import {
  getProductBySlug,
  getAllProductSlugs,
  getVariantPrice,
  formatPrice,
} from "@/lib/shop-products";

// Statische Params für Build-Optimierung
export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

// Dynamische Metadaten pro Produkt
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produkt nicht gefunden — BeAFox Shop",
      description: "Das gesuchte Produkt wurde nicht gefunden.",
    };
  }

  // Translations are not available in server components outside next-intl setup,
  // so we use the nameKey as fallback and construct SEO-friendly defaults
  const productNames: Record<string, { de: string; en: string }> = {
    tshirt: { de: "BeAFox Classic T-Shirt", en: "BeAFox Classic T-Shirt" },
    hoodie: { de: "BeAFox Classic Hoodie", en: "BeAFox Classic Hoodie" },
    mug: { de: "BeAFox Tasse", en: "BeAFox Mug" },
    stickers: { de: "BeAFox Sticker Pack", en: "BeAFox Sticker Pack" },
    totebag: { de: "BeAFox Jutebeutel", en: "BeAFox Tote Bag" },
    phonecase: { de: "BeAFox Handyhülle", en: "BeAFox Phone Case" },
    poster: { de: "BeAFox Poster", en: "BeAFox Poster" },
  };

  const name = productNames[product.nameKey]?.de || product.nameKey;
  const price = formatPrice(product.price);
  const title = `${name} — BeAFox Shop`;
  const description = `${name} für ${price} — Exklusives BeAFox Merchandise. Print-on-Demand, nachhaltig produziert. Versand nach DE, AT, CH.`;

  return {
    title,
    description,
    keywords: [
      name,
      "BeAFox Merch",
      "BeAFox Shop",
      "Finanzbildung Merchandise",
      product.category,
    ],
    openGraph: {
      title,
      description,
      url: `https://beafox.app/shop/${slug}`,
      type: "website",
      images: product.images[0]
        ? [
            {
              url: `https://beafox.app${product.images[0]}`,
              width: 800,
              height: 800,
              alt: name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://beafox.app/shop/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
