"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import Section from "@/components/Section";
import StructuredData from "@/components/StructuredData";
import { useCart } from "@/components/ShopCartProvider";
// IMPORTS
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  getProductBySlug,
  getActiveProducts,
  getVariantPrice,
  formatPrice,
} from "@/lib/shop-products";
// ICONS
import {
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Check,
} from "lucide-react";

export default function ProductDetailPage() {
  // HOOKS
  const params = useParams();
  const t = useTranslations("shop");
  const locale = useLocale();
  const { addItem } = useCart();
  // DATA
  const slug = params.slug as string;
  const product = useMemo(() => getProductBySlug(slug), [slug]);
  // STATES
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <Section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-darkerGray mb-4">
            {t("productNotFound")}
          </h1>
          <Link
            href="/shop"
            className="text-primaryOrange font-semibold hover:underline"
          >
            {t("backToShop")}
          </Link>
        </div>
      </Section>
    );
  }

  const variant = product.variants[selectedVariant];
  const price = getVariantPrice(product, variant.id);

  // Unique sizes & colors
  const sizes = [
    ...new Set(product.variants.map((v) => v.size).filter(Boolean)),
  ];
  const colors = [
    ...new Set(
      product.variants.map((v) => v.color).filter(Boolean),
    ),
  ];
  const colorHexMap = new Map(
    product.variants
      .filter((v) => v.color && v.colorHex)
      .map((v) => [v.color!, v.colorHex!]),
  );

  // Related products
  const relatedProducts = useMemo(
    () =>
      getActiveProducts()
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 3),
    [product],
  );

  function handleAddToCart() {
    addItem(product!.id, variant.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function findVariantIndex(size?: string, color?: string): number {
    return product!.variants.findIndex(
      (v) =>
        (!size || v.size === size) &&
        (!color || v.color === color),
    );
  }

  return (
    <>
      <Section className="py-8 md:py-12 bg-primaryWhite">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-primaryOrange font-semibold mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t("backToShop")}
          </Link>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Produktbild */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={product.images[0]}
                  alt={t(`products.${product.nameKey}.name`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Produktinfo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <p className="text-sm text-primaryOrange font-semibold uppercase tracking-wide mb-2">
                {t(`categories.${product.category}`)}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-darkerGray mb-3">
                {t(`products.${product.nameKey}.name`)}
              </h1>
              <p className="text-darkerGray/70 text-base leading-relaxed mb-6">
                {t(`products.${product.nameKey}.description`)}
              </p>

              {/* Preis */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-primaryOrange">
                  {formatPrice(price, locale)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice, locale)}
                  </span>
                )}
              </div>

              {/* Farb-Auswahl */}
              {colors.length > 1 && (
                <div className="mb-5">
                  <p className="text-sm font-semibold text-darkerGray mb-2">
                    {t("detail.color")}:{" "}
                    <span className="font-normal text-lightGray">
                      {variant.color}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    {colors.map((color) => {
                      const hex = colorHexMap.get(color!) || "#ccc";
                      const isSelected = variant.color === color;
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            const idx = findVariantIndex(
                              variant.size,
                              color!,
                            );
                            if (idx >= 0) setSelectedVariant(idx);
                          }}
                          aria-label={color!}
                          className={`w-9 h-9 rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-primaryOrange scale-110"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Größen-Auswahl */}
              {sizes.length > 1 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-darkerGray mb-2">
                    {t("detail.size")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const isSelected = variant.size === size;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            const idx = findVariantIndex(
                              size!,
                              variant.color,
                            );
                            if (idx >= 0) setSelectedVariant(idx);
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            isSelected
                              ? "bg-primaryOrange text-white"
                              : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Varianten ohne Farbe/Größe (z.B. Handy-Hüllen) */}
              {sizes.length <= 1 && colors.length <= 1 && product.variants.length > 1 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-darkerGray mb-2">
                    {t("detail.variant")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, idx) => {
                      const label = v.size || v.color || v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(idx)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            selectedVariant === idx
                              ? "bg-primaryOrange text-white"
                              : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Menge + In den Warenkorb */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label={t("cart.decrease")}
                    className="p-1.5 hover:text-primaryOrange transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-darkerGray">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label={t("cart.increase")}
                    className="p-1.5 hover:text-primaryOrange transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-lg ${
                    addedToCart
                      ? "bg-green-500 text-white"
                      : "bg-primaryOrange text-white hover:bg-primaryOrange/90"
                  }`}
                  style={{
                    boxShadow: addedToCart
                      ? "0 4px 14px rgba(34,197,94,0.25)"
                      : "0 4px 14px rgba(232,119,32,0.25)",
                  }}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" aria-hidden="true" />
                      {t("addedToCart")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                      {t("addToCart")}
                    </>
                  )}
                </button>
              </div>

              {/* Vorteile */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Truck
                    className="w-5 h-5 text-primaryOrange"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] text-darkerGray/70 font-medium">
                    {t("detail.shipping")}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Shield
                    className="w-5 h-5 text-primaryOrange"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] text-darkerGray/70 font-medium">
                    {t("detail.secure")}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <RotateCcw
                    className="w-5 h-5 text-primaryOrange"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] text-darkerGray/70 font-medium">
                    {t("detail.returns")}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Ähnliche Produkte */}
      {relatedProducts.length > 0 && (
        <Section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-darkerGray mb-6">
              {t("detail.related")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/shop/${rp.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow group"
                >
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={rp.images[0]}
                      alt={t(`products.${rp.nameKey}.name`)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-darkerGray text-sm">
                      {t(`products.${rp.nameKey}.name`)}
                    </h3>
                    <p className="text-primaryOrange font-bold mt-1">
                      {formatPrice(rp.price, locale)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Structured Data — Product */}
      <StructuredData
        id={`product-${product.id}`}
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: t(`products.${product.nameKey}.name`),
          description: t(`products.${product.nameKey}.description`),
          image: `https://beafox.app${product.images[0]}`,
          url: `https://beafox.app/shop/${product.slug}`,
          brand: {
            "@type": "Brand",
            name: "BeAFox",
          },
          offers: {
            "@type": "AggregateOffer",
            lowPrice: (Math.min(product.price, ...product.variants.map((v) => v.priceOverride ?? product.price)) / 100).toFixed(2),
            highPrice: (Math.max(product.price, ...product.variants.map((v) => v.priceOverride ?? product.price)) / 100).toFixed(2),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            offerCount: product.variants.length,
            seller: {
              "@type": "Organization",
              name: "BeAFox",
            },
          },
          category: product.category,
        }}
      />
    </>
  );
}
