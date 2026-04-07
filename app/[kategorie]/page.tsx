"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Target,
  TrendingUp,
  PawPrint,
  Zap,
  BookOpen,
} from "lucide-react";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getPostsByCategory,
  getGuidePostPath,
  getRatgeberCategoryPath,
} from "@/lib/blog";
import {
  fetchSanityGuidesByCategory,
  type SanityGuide,
} from "@/lib/sanity-fetch";

// Difficulty helper
function getDifficulty(categorySlug: string): string {
  const easy = [
    "finanzen-fuer-schueler",
    "finanzen-fuer-azubis",
    "finanzen-fuer-studenten",
  ];
  return easy.includes(categorySlug) ? "Einsteiger" : "Fortgeschritten";
}

// Category value propositions
const CATEGORY_PROMISES: Record<string, string[]> = {
  "finanzen-fuer-schueler": [
    "Taschengeld smart einteilen",
    "Erstes Konto einrichten",
    "Abo-Fallen erkennen & vermeiden",
  ],
  "finanzen-fuer-azubis": [
    "Gehaltsabrechnung verstehen",
    "Steuererklärung als Azubi",
    "Notgroschen in 6 Monaten",
  ],
  "finanzen-fuer-studenten": [
    "BAföG optimal nutzen",
    "Als Werkstudent Steuern sparen",
    "Stipendien finden & beantragen",
  ],
  "finanzen-fuer-berufseinsteiger": [
    "Vermögen in den 20ern aufbauen",
    "3-Konten-Modell einrichten",
    "Erste Wohnung finanzieren",
  ],
  "finanzen-bei-lebensereignissen": [
    "Umzug ohne finanzielle Schocks",
    "Auto kaufen vs. leasen",
    "Mietvertrag richtig lesen",
  ],
  "investieren-fuer-anfaenger": [
    "Ersten ETF kaufen in 20 Min.",
    "Mit 20€ im Monat starten",
    "Altersvorsorge jetzt angehen",
  ],
};

export default function RatgeberCategoryPage() {
  const params = useParams<{ kategorie: string }>();
  const { kategorie } = params;

  const category = getCategoryBySlug(kategorie);
  if (!category) notFound();

  const staticPosts = getPostsByCategory(category.slug);
  const otherCategories = BLOG_CATEGORIES.filter((c) => c.slug !== category.slug);
  const promises = CATEGORY_PROMISES[category.slug] ?? [];
  const difficulty = getDifficulty(category.slug);

  // Fetch Sanity guides for richer data
  const [sanityGuides, setSanityGuides] = useState<SanityGuide[]>([]);
  useEffect(() => {
    fetchSanityGuidesByCategory(category.slug)
      .then(setSanityGuides)
      .catch(() => {});
  }, [category.slug]);

  const sanityMap = new Map(sanityGuides.map((g) => [g.slug, g]));

  // Merge: prefer Sanity data for excerpt, tags, readingTime
  const posts = staticPosts.map((post) => {
    const sg = sanityMap.get(post.slug);
    if (!sg) return post;
    return {
      ...post,
      title: sg.title,
      excerpt: sg.excerpt,
      readingTime: sg.readingTime,
      tags: sg.tags ?? post.tags,
    };
  });

  return (
    <>
      {/* ── DARK HERO ─────────────────────────────────────────────── */}
      <section
        className="pt-24 md:pt-32 pb-12 md:pb-16"
        style={{ background: "linear-gradient(160deg, #161616 0%, #1a1818 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm mb-6"
          >
            <Link
              href="/ratgeber"
              className="text-primaryGray hover:text-primaryOrange transition-colors"
            >
              Ratgeber
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-primaryGray/40" />
            <span className="text-primaryOrange font-medium">{category.navLabel}</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex-1">
              {/* Emoji + Category badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="text-5xl">{category.emoji}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-primaryOrange text-white">
                  <Target className="w-3 h-3" />
                  Ratgeber-Kategorie
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4"
              >
                {category.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="text-base md:text-lg text-primaryGray leading-relaxed max-w-2xl"
              >
                {category.description}
              </motion.p>
            </div>

            {/* Stats box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 min-w-[180px]"
            >
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-primaryGray">Guides</span>
                  <span className="font-bold text-white">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-primaryGray">Level</span>
                  <span className="font-bold text-primaryOrange">{difficulty}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-primaryGray">Format</span>
                  <span className="font-bold text-white">Schritt-für-Schritt</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Value promises */}
          {promises.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              {promises.map((promise, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-primaryOrange/25 bg-primaryOrange/10 text-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primaryOrange flex-shrink-0" />
                  <span className="text-white font-medium">{promise}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── GUIDE MISSION BOARD ────────────────────────────────────── */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-darkerGray">
                Deine{" "}
                <span className="text-primaryOrange">Missionen</span>
              </h2>
              <p className="text-lightGray text-sm mt-1">
                {posts.length} Guides — handlungsorientiert, nicht nur Theorie
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-lightGray">
              <TrendingUp className="w-4 h-4 text-primaryOrange" />
              <span>{difficulty}</span>
            </div>
          </motion.div>

          {/* Mission list */}
          <div className="space-y-4">
            {posts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <Link
                  href={getGuidePostPath(category.slug, post.slug)}
                  className="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-primaryOrange/40 hover:bg-primaryOrange/5 hover:shadow-md p-5 transition-all duration-200"
                >
                  {/* Number badge */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-white border-2 border-gray-200 group-hover:border-primaryOrange group-hover:bg-primaryOrange group-hover:text-white text-darkerGray font-bold text-base flex items-center justify-center transition-all duration-200 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-primaryOrange bg-primaryOrange/10 px-2.5 py-0.5 rounded-full">
                        Guide
                      </span>
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-lightGray bg-gray-100 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-darkerGray mb-1.5 group-hover:text-primaryOrange transition-colors leading-snug text-base md:text-lg">
                      {post.title}
                    </h3>
                    <p className="text-sm text-lightGray leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Meta + CTA */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-3 ml-2">
                    <span className="flex items-center gap-1 text-xs text-lightGray whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} Min.
                    </span>
                    <span className="inline-flex items-center gap-1 text-primaryOrange text-xs font-bold group-hover:gap-2 transition-all whitespace-nowrap">
                      Starten
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEA APP BANNER ─────────────────────────────────────────── */}
      <section
        className="py-10 md:py-14"
        style={{ background: "linear-gradient(135deg, #eb8a26 0%, #b16518 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Bea macht dich handlungsfähig
              </h2>
              <p className="text-white/80 text-base leading-relaxed max-w-xl">
                Alle Guides in dieser Kategorie — plus KI-Coaching, Challenges und
                Fortschrittsverfolgung. Kostenlos in der App.
              </p>
            </div>
            <a
              href="https://beafox.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-primaryOrange font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-base"
            >
              <Smartphone className="w-5 h-5" />
              App öffnen
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── OTHER CATEGORIES ─────────────────────────────────────── */}
      <section
        className="py-10 md:py-12"
        style={{ background: "#161616" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="text-white font-bold text-lg mb-5">
              Weitere Ratgeber-Kategorien
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {otherCategories.map((c, i) => (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <Link
                    href={`/${c.slug}`}
                    className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:border-primaryOrange/40 hover:bg-primaryOrange/10 p-4 text-center transition-all duration-200"
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-xs font-semibold text-primaryGray group-hover:text-primaryOrange transition-colors leading-tight">
                      {c.navLabel}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
