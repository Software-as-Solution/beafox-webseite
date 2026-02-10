"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  ShoppingBag,
  Shirt,
  Coffee,
  Sticker,
  BookOpen,
  ShoppingCart,
} from "lucide-react";

// Produkt-Datenstruktur
interface Product {
  id: string;
  nameKey: string;
  descriptionKey: string;
  price: number;
  image: string;
  categoryKey: "clothing" | "accessories";
  icon: React.ReactNode;
}

// Beispiel-Produkte (diese sollten später durch echte Produktdaten ersetzt werden)
const products: Product[] = [
  {
    id: "tshirt-beafox-001",
    nameKey: "products.tshirt.name",
    descriptionKey: "products.tshirt.description",
    price: 29.99,
    image: "/merch/tshirt.jpg", // Platzhalter - echte Bilder hinzufügen
    categoryKey: "clothing",
    icon: <Shirt className="w-6 h-6" />,
  },
  {
    id: "hoodie-beafox-001",
    nameKey: "products.hoodie.name",
    descriptionKey: "products.hoodie.description",
    price: 49.99,
    image: "/merch/hoodie.jpg",
    categoryKey: "clothing",
    icon: <Shirt className="w-6 h-6" />,
  },
  {
    id: "mug-beafox-001",
    nameKey: "products.mug.name",
    descriptionKey: "products.mug.description",
    price: 14.99,
    image: "/merch/mug.jpg",
    categoryKey: "accessories",
    icon: <Coffee className="w-6 h-6" />,
  },
  {
    id: "sticker-beafox-001",
    nameKey: "products.stickers.name",
    descriptionKey: "products.stickers.description",
    price: 4.99,
    image: "/merch/stickers.jpg",
    categoryKey: "accessories",
    icon: <Sticker className="w-6 h-6" />,
  },
  {
    id: "notebook-beafox-001",
    nameKey: "products.notebook.name",
    descriptionKey: "products.notebook.description",
    price: 12.99,
    image: "/merch/notebook.jpg",
    categoryKey: "accessories",
    icon: <BookOpen className="w-6 h-6" />,
  },
];

export default function ShopPage() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "clothing" | "accessories"
  >("all");

  const categories: { key: "all" | "clothing" | "accessories"; label: string }[] =
    [
      { key: "all", label: t("categories.all") },
      { key: "clothing", label: t("categories.clothing") },
      { key: "accessories", label: t("categories.accessories") },
    ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.categoryKey === selectedCategory);

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
              <ShoppingBag className="w-5 h-5 text-primaryOrange" />
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
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.key
                    ? "bg-primaryOrange text-primaryWhite shadow-lg"
                    : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Produkte Grid */}
      <Section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-darkerGray text-lg">
                {t("empty")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Produktbild */}
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5">
                      {product.icon && (
                        <div className="text-primaryOrange opacity-50 group-hover:opacity-100 transition-opacity">
                          {product.icon}
                        </div>
                      )}
                    </div>
                    {/* Platzhalter für echte Bilder - später durch Image-Komponente ersetzen */}
                    {/* <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    /> */}
                  </div>

                  {/* Produktinfo */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-darkerGray mb-2">
                      {t(product.nameKey)}
                    </h3>
                    <p className="text-darkerGray/70 text-sm mb-4 min-h-[40px]">
                      {t(product.descriptionKey)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primaryOrange">
                        {product.price.toLocaleString(locale, {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </span>
                      <button
                        className="snipcart-add-item flex items-center gap-2 bg-primaryOrange text-primaryWhite px-6 py-3 rounded-full font-semibold hover:bg-primaryOrange/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                        data-item-id={product.id || ""}
                        data-item-price={
                          product.price ? product.price.toFixed(2) : "0.00"
                        }
                        data-item-description={t(product.descriptionKey) || ""}
                        data-item-image={product.image || ""}
                        data-item-name={t(product.nameKey) || ""}
                        // data-item-url ist optional seit Snipcart 3.2.2
                        // Wenn nicht gesetzt, wird automatisch window.location.href verwendet
                      >
                        <ShoppingCart className="w-4 h-4" />
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
                )
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
