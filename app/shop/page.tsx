"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Image from "next/image";
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
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  icon: React.ReactNode;
}

// Beispiel-Produkte (diese sollten später durch echte Produktdaten ersetzt werden)
const products: Product[] = [
  {
    id: "tshirt-beafox-001",
    name: "BeAFox T-Shirt",
    description: "Premium Baumwoll-T-Shirt mit BeAFox-Logo",
    price: 29.99,
    image: "/merch/tshirt.jpg", // Platzhalter - echte Bilder hinzufügen
    category: "Kleidung",
    icon: <Shirt className="w-6 h-6" />,
  },
  {
    id: "hoodie-beafox-001",
    name: "BeAFox Hoodie",
    description: "Warmes Kapuzen-Sweatshirt mit BeAFox-Branding",
    price: 49.99,
    image: "/merch/hoodie.jpg",
    category: "Kleidung",
    icon: <Shirt className="w-6 h-6" />,
  },
  {
    id: "mug-beafox-001",
    name: "BeAFox Tasse",
    description:
      "Keramik-Tasse mit BeAFox-Logo - perfekt für deinen Morgenkaffee",
    price: 14.99,
    image: "/merch/mug.jpg",
    category: "Accessoires",
    icon: <Coffee className="w-6 h-6" />,
  },
  {
    id: "sticker-beafox-001",
    name: "BeAFox Sticker Pack",
    description: "Set mit 5 verschiedenen BeAFox-Stickern",
    price: 4.99,
    image: "/merch/stickers.jpg",
    category: "Accessoires",
    icon: <Sticker className="w-6 h-6" />,
  },
  {
    id: "notebook-beafox-001",
    name: "BeAFox Notizbuch",
    description: "Hochwertiges Notizbuch mit BeAFox-Design",
    price: 12.99,
    image: "/merch/notebook.jpg",
    category: "Accessoires",
    icon: <BookOpen className="w-6 h-6" />,
  },
];

const categories = ["Alle", "Kleidung", "Accessoires"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Alle");

  const filteredProducts =
    selectedCategory === "Alle"
      ? products
      : products.filter((product) => product.category === selectedCategory);

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
                BeAFox Merch Shop
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-darkerGray mb-4">
              BeAFox Merch Shop
            </h1>
            <p className="text-lg md:text-xl text-darkerGray/80 max-w-2xl mx-auto">
              Zeige deine BeAFox-Leidenschaft mit unserem exklusiven Merchandise
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
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primaryOrange text-primaryWhite shadow-lg"
                    : "bg-gray-100 text-darkerGray hover:bg-gray-200"
                }`}
              >
                {category}
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
                Keine Produkte in dieser Kategorie gefunden.
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
                      {product.name}
                    </h3>
                    <p className="text-darkerGray/70 text-sm mb-4 min-h-[40px]">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primaryOrange">
                        {product.price.toFixed(2)} €
                      </span>
                      <button
                        className="snipcart-add-item flex items-center gap-2 bg-primaryOrange text-primaryWhite px-6 py-3 rounded-full font-semibold hover:bg-primaryOrange/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                        data-item-id={product.id || ""}
                        data-item-price={
                          product.price ? product.price.toFixed(2) : "0.00"
                        }
                        data-item-description={product.description || ""}
                        data-item-image={product.image || ""}
                        data-item-name={product.name || ""}
                        // data-item-url ist optional seit Snipcart 3.2.2
                        // Wenn nicht gesetzt, wird automatisch window.location.href verwendet
                      >
                        <ShoppingCart className="w-4 h-4" />
                        In den Warenkorb
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
              Häufig gestellte Fragen
            </h2>
            <div className="space-y-6 text-left">
              <div>
                <h3 className="font-semibold text-darkerGray mb-2">
                  Wie lange dauert der Versand?
                </h3>
                <p className="text-darkerGray/70">
                  Der Versand erfolgt innerhalb von 3-5 Werktagen nach
                  Bestelleingang.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-darkerGray mb-2">
                  Welche Zahlungsmethoden werden akzeptiert?
                </h3>
                <p className="text-darkerGray/70">
                  Wir akzeptieren alle gängigen Zahlungsmethoden wie
                  Kreditkarte, PayPal und SEPA-Lastschrift.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-darkerGray mb-2">
                  Gibt es ein Rückgaberecht?
                </h3>
                <p className="text-darkerGray/70">
                  Ja, innerhalb von 14 Tagen nach Erhalt können Sie Artikel
                  zurückgeben. Weitere Details finden Sie in unseren AGB.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
