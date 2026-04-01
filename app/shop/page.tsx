"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import Section from "@/components/Section";
import { useCart } from "@/components/ShopCartProvider";
// IMPORTS
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  getActiveProducts,
  getProductCategories,
  formatPrice,
  type ProductCategory,
} from "@/lib/shop-products";
// ICONS
import {
  ShoppingBag,
  ShoppingCart,
  Shirt,
  Coffee,
  Sticker,
  Backpack,
  Frame,
  type LucideIcon,
} from "lucide-react";

// CONSTANTS
const CATEGORY_ICONS: Record<ProductCategory, LucideIcon> = {
  clothing: Shirt,
  drinkware: Coffee,
  stickers: Sticker,
  accessories: Backpack,
  art: Frame,
};

export default function ShopPage() {
  // HOOKS
  const t = useTranslations("shop");
  const locale = useLocale();
  const { addItem } = useCart();
  // STATES
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ProductCategory
  >("all");
  // DATA
  const allProducts = useMemo(() => getActiveProducts(), []);
  const categories = useMemo(() => getProductCategories(), []);
  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? allProducts
        : allProducts.filter((p) => p.category === selectedCategory),
    [allProducts, selectedCategory],
  );

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-primaryOrange/10 via-primaryWhite to-primaryOrange/5 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primaryOrange/10 px-4 py-2 rounded-full mb-6">
              <ShoppingBag
                className="w-5 h-5 text-primaryOrange"
                aria-hidden="true"
              />
              <span className="text-primaryOrange font-semibold text-sm md:text-base">
                {t("hero.badge")}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-darkerGray mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-darkerGray/80 max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Kategorien Filter */}
      <Section className="py-8 bg-primaryWhite border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-primaryOrange text-primaryWhite shadow-lg"
                  : "bg-gray-100 text-darkerGray hover:bg-gray-200"
              }`}
            >
              {t("categories.all")}
            </button>
            {categories.map(({ key }) => {
              const Icon = CATEGORY_ICONS[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === key
                      ? "bg-primaryOrange text-primaryWhite shadow-lg"
                      : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {t(`categories.${key}`)}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Produkte Grid */}
      <Section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-darkerGray text-lg">{t("empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Produktbild */}
                  <Link
                    href={`/shop/${product.slug}`}
                    className="block relative h-64 bg-gray-100 overflow-hidden"
                  >
                    <Image
                      src={product.images[0]}
                      alt={t(`products.${product.nameKey}.name`)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.compareAtPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {t("sale")}
                      </div>
                    )}
                  </Link>

                  {/* Produktinfo */}
                  <div className="p-6">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="text-xl font-bold text-darkerGray mb-1 hover:text-primaryOrange transition-colors">
                        {t(`products.${product.nameKey}.name`)}
                      </h3>
                    </Link>
                    <p className="text-darkerGray/70 text-sm mb-4 min-h-[40px] line-clamp-2">
                      {t(`products.${product.nameKey}.description`)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primaryOrange">
                          {formatPrice(product.price, locale)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.compareAtPrice, locale)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          addItem(product.id, product.variants[0].id)
                        }
                        aria-label={t("addToCart")}
                        className="flex items-center gap-2 bg-primaryOrange text-primaryWhite px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primaryOrange/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                        {t("addToCart")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Info Section */}
      <Section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-6">
              {t("faq.title")}
            </h2>
            <div className="space-y-6 text-left">
              {(t.raw("faq.items") as { q: string; a: string }[]).map(
                (item, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-darkerGray mb-2">
                      {item.q}
                    </h3>
                    <p className="text-darkerGray/70">{item.a}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
