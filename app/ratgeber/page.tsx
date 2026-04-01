"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  Zap,
  PawPrint,
  TrendingUp,
  CheckCircle2,
  Smartphone,
  BookOpen,
} from "lucide-react";
import { BLOG_CATEGORIES, getPostsByCategory } from "@/lib/blog";
import { fetchAllSanityGuides, type SanityGuide } from "@/lib/sanity-fetch";

// Value props shown on the hub
const HUB_VALUE_PROPS = [
  {
    icon: Target,
    title: "Handlungsorientiert",
    desc: "Kein \"Was ist eine Aktie\" — sondern \"Wie kaufe ich meine erste Aktie in 15 Minuten\"",
  },
  {
    icon: Zap,
    title: "Schritt-für-Schritt",
    desc: "Jeder Guide ist in klare Schritte aufgeteilt. Du weißt immer, was als nächstes kommt.",
  },
  {
    icon: TrendingUp,
    title: "Level-System",
    desc: "Guides für Einsteiger bis Fortgeschrittene — du findest genau das Richtige für dich.",
  },
];

export default function RatgeberHubPage() {
  // Fetch Sanity guides to get accurate counts and enriched data
  const [sanityGuides, setSanityGuides] = useState<SanityGuide[]>([]);
  useEffect(() => {
    fetchAllSanityGuides().then(setSanityGuides).catch(() => {});
  }, []);

  // Count Sanity-only guides per category (not in blog.ts)
  const sanityCountByCategory = new Map<string, number>();
  for (const g of sanityGuides) {
    const staticPosts = getPostsByCategory(g.category);
    const existsInBlog = staticPosts.some((p) => p.slug === g.slug);
    if (!existsInBlog) {
      sanityCountByCategory.set(
        g.category,
        (sanityCountByCategory.get(g.category) ?? 0) + 1
      );
    }
  }

  return (
    <>
      {/* ── FULL DARK HERO ────────────────────────────────────────── */}
      <section
        className="pt-24 md:pt-32 pb-14 md:pb-20 overflow-hidden relative"
        style={{ background: "linear-gradient(160deg, #161616 0%, #1D1B1B 100%)" }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primaryOrange/30 bg-primaryOrange/10 mb-8"
          >
            <PawPrint className="w-4 h-4 text-primaryOrange" />
            <span className="text-primaryOrange font-bold text-sm">
              BeAFox Ratgeber
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: headline */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5"
              >
                Finanzwissen das dich{" "}
                <span className="text-primaryOrange">handlungsfähig</span>{" "}
                macht
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-primaryGray text-base md:text-lg leading-relaxed mb-8"
              >
                Keine langen Artikel ohne Ende. Klare Guides für klare Situationen —
                für Schüler, Azubis, Studenten und alle, die ihr Geld endlich in
                den Griff kriegen wollen.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.22 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                {[
                  { value: "45+", label: "Guides" },
                  { value: "6", label: "Kategorien" },
                  { value: "∅ 6 Min.", label: "pro Guide" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="px-4 py-3 rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-primaryGray mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href="#kategorien"
                  className="inline-flex items-center gap-2 bg-primaryOrange hover:bg-darkOrange text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Guides entdecken
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://beafox.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  App öffnen
                </a>
              </motion.div>
            </div>

            {/* Right: value props */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {HUB_VALUE_PROPS.map((prop, i) => {
                const Icon = prop.icon;
                return (
                  <motion.div
                    key={prop.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 + i * 0.08 }}
                    className="flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primaryOrange/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primaryOrange" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1">
                        {prop.title}
                      </h3>
                      <p className="text-primaryGray text-xs leading-relaxed">
                        {prop.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ───────────────────────────────────────── */}
      <section id="kategorien" className="bg-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-darkerGray mb-3">
              Wähle deine{" "}
              <span className="text-primaryOrange">Lebenssituation</span>
            </h2>
            <p className="text-lightGray max-w-xl mx-auto text-base leading-relaxed">
              Jede Kategorie ist auf eine konkrete Phase in deinem Leben zugeschnitten.
              Kein generisches Finanzwissen — sondern das, was du jetzt brauchst.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {BLOG_CATEGORIES.map((category, i) => {
              const posts = getPostsByCategory(category.slug);
              const totalGuides = posts.length + (sanityCountByCategory.get(category.slug) ?? 0);
              const isHighlighted = category.slug === "finanzen-bei-lebensereignissen";
              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={isHighlighted ? "sm:col-span-2 lg:col-span-1" : ""}
                >
                  <Link
                    href={`/ratgeber/${category.slug}`}
                    className="group relative flex flex-col h-full rounded-2xl overflow-hidden border border-gray-100 hover:border-primaryOrange/40 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Card header — dark */}
                    <div
                      className="p-5 md:p-6"
                      style={{ background: "#161616" }}
                    >
                      {isHighlighted && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primaryOrange text-white mb-3">
                          ⭐ Beliebt
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-4xl">{category.emoji}</span>
                        <div className="text-right">
                          <div className="text-primaryOrange font-bold text-2xl">
                            {totalGuides}
                          </div>
                          <div className="text-primaryGray text-xs">Guides</div>
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg md:text-xl leading-tight group-hover:text-primaryOrange transition-colors">
                        {category.title}
                      </h3>
                    </div>

                    {/* Card body — light */}
                    <div className="p-5 bg-white flex-1 flex flex-col">
                      <p className="text-sm text-lightGray leading-relaxed mb-4 flex-1">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {posts.slice(0, 2).map((p) => (
                            <span
                              key={p.slug}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-lightGray truncate max-w-[100px]"
                            >
                              {p.navTitle ?? p.title}
                            </span>
                          ))}
                        </div>
                        <span className="flex items-center gap-1 text-primaryOrange text-sm font-bold group-hover:gap-2 transition-all flex-shrink-0">
                          Ansehen
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BEA COMPANION BANNER ─────────────────────────────────── */}
      <section
        className="py-12 md:py-16"
        style={{ background: "#1D1B1B" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              {
                icon: BookOpen,
                title: "Guides lesen",
                desc: "Alle Ratgeber kostenlos verfügbar — kein Abo, kein Paywall.",
              },
              {
                icon: CheckCircle2,
                title: "Umsetzen",
                desc: "Mit Bea in der App direkt ins Handeln kommen. Schritt für Schritt.",
              },
              {
                icon: TrendingUp,
                title: "Wachsen",
                desc: "XP sammeln, Level aufsteigen, finanziell freier werden.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-5"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primaryOrange/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primaryOrange" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-primaryGray text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center mt-8"
          >
            <a
              href="https://beafox.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primaryOrange hover:bg-darkOrange text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              <PawPrint className="w-5 h-5" />
              Mit Bea starten — kostenlos
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
