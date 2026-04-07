"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Target,
  PawPrint,
  TrendingUp,
  Search,
  Zap,
  CheckCircle2,
} from "lucide-react";
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  getCategoryBySlug,
  getGuidePostPath,
} from "@/lib/blog";
import {
  fetchAllSanityGuides,
  type SanityGuide,
} from "@/lib/sanity-fetch";

// Difficulty helper
function getDifficulty(categorySlug: string): {
  label: string;
  color: string;
} {
  const easy = [
    "finanzen-fuer-schueler",
    "finanzen-fuer-azubis",
    "finanzen-fuer-studenten",
  ];
  return easy.includes(categorySlug)
    ? { label: "Einsteiger", color: "text-emerald-600" }
    : { label: "Fortgeschritten", color: "text-primaryOrange" };
}

// Latest posts sorted by date (newest first)
const LATEST_POSTS = [...BLOG_POSTS]
  .sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  .slice(0, 6);

export default function NewsHubPage() {
  // Fetch Sanity guides to enrich display
  const [sanityGuides, setSanityGuides] = useState<SanityGuide[]>([]);
  useEffect(() => {
    fetchAllSanityGuides().then(setSanityGuides).catch(() => {});
  }, []);
  const sanityMap = new Map(
    sanityGuides.map((g) => [`${g.category}/${g.slug}`, g])
  );

  // Enrich LATEST_POSTS with Sanity data
  const enrichedLatest = LATEST_POSTS.map((post) => {
    const sg = sanityMap.get(`${post.categorySlug}/${post.slug}`);
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
        className="pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden relative"
        style={{ background: "linear-gradient(160deg, #161616 0%, #1D1B1B 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primaryOrange/30 bg-primaryOrange/10 mb-8"
          >
            <PawPrint className="w-4 h-4 text-primaryOrange" />
            <span className="text-primaryOrange font-bold text-sm">
              BeAFox Guides
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 max-w-3xl"
          >
            Guides die dich ins{" "}
            <span className="text-primaryOrange">Tun</span> bringen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-primaryGray text-base md:text-lg leading-relaxed max-w-2xl mb-10"
          >
            {BLOG_POSTS.length} Guides für{" "}
            {BLOG_CATEGORIES.length} Lebenssituationen. Kein generisches
            Finanzwissen — sondern klare Schritte, die du heute noch umsetzen
            kannst.
          </motion.p>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="flex flex-wrap gap-3"
          >
            {BLOG_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: 0.25 + i * 0.04 }}
              >
                <Link
                  href={`/${cat.slug}`}
                  className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/5 hover:border-primaryOrange hover:bg-primaryOrange/15 text-primaryGray hover:text-white text-sm font-medium transition-all duration-200"
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.navLabel}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED GUIDES ───────────────────────────────────────── */}
      <section className="bg-white py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-1 h-8 rounded-full bg-primaryOrange" />
            <h2 className="text-xl md:text-2xl font-bold text-darkerGray">
              Neueste Guides
            </h2>
          </motion.div>

          {/* Featured first post */}
          {enrichedLatest[0] && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <Link
                href={getGuidePostPath(
                  enrichedLatest[0].categorySlug,
                  enrichedLatest[0].slug
                )}
                className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden border border-gray-100 hover:border-primaryOrange/40 hover:shadow-xl transition-all duration-300"
              >
                {/* Number + Dark side */}
                <div
                  className="sm:w-72 md:w-80 p-6 md:p-8 flex flex-col justify-between flex-shrink-0"
                  style={{ background: "#161616" }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primaryOrange text-white">
                        <Target className="w-2.5 h-2.5" />
                        Neu
                      </span>
                      <span className="text-primaryGray/60 text-[10px]">
                        {getCategoryBySlug(enrichedLatest[0].categorySlug)?.navLabel}
                      </span>
                    </div>
                    <div className="text-primaryOrange font-black text-6xl md:text-8xl opacity-20 leading-none mb-2">
                      01
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primaryGray/60">
                    <Clock className="w-3 h-3" />
                    {enrichedLatest[0].readingTime} Min.
                  </div>
                </div>
                {/* Light side */}
                <div className="p-6 md:p-8 bg-gray-50 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-darkerGray group-hover:text-primaryOrange transition-colors mb-3 leading-tight">
                      {enrichedLatest[0].title}
                    </h3>
                    <p className="text-lightGray text-base leading-relaxed mb-4">
                      {enrichedLatest[0].excerpt}
                    </p>
                    {enrichedLatest[0].tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {enrichedLatest[0].tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-white border border-gray-200 text-lightGray"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-primaryOrange font-bold text-sm group-hover:gap-3 transition-all">
                    Guide starten
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Rest of posts — grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrichedLatest.slice(1).map((post, i) => {
              const cat = getCategoryBySlug(post.categorySlug);
              const diff = getDifficulty(post.categorySlug);
              return (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                >
                  <Link
                    href={getGuidePostPath(post.categorySlug, post.slug)}
                    className="group flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 hover:border-primaryOrange/40 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    <div className="h-0.5 bg-gray-100 group-hover:bg-primaryOrange transition-colors duration-300" />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-primaryOrange bg-primaryOrange/10 px-2.5 py-1 rounded-full">
                          {cat?.navLabel ?? post.categorySlug}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${diff.color}`}
                        >
                          {diff.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-darkerGray group-hover:text-primaryOrange transition-colors leading-snug text-sm md:text-base mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-lightGray leading-relaxed flex-1 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1 text-xs text-lightGray">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} Min.
                        </span>
                        <span className="flex items-center gap-1 text-primaryOrange text-xs font-bold group-hover:gap-2 transition-all">
                          Starten <ArrowRight className="w-3.5 h-3.5" />
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

      {/* ── ALL CATEGORIES BOARD ──────────────────────────────────── */}
      <section
        className="py-10 md:py-14"
        style={{ background: "#fafafa" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-darkerGray">
                Alle{" "}
                <span className="text-primaryOrange">Kategorien</span>
              </h2>
              <p className="text-lightGray text-sm mt-1">
                Wähle deine Lebenssituation
              </p>
            </div>
            <Link
              href="/ratgeber"
              className="text-primaryOrange font-semibold text-sm hover:underline hidden sm:block"
            >
              Ratgeber-Übersicht →
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {BLOG_CATEGORIES.map((cat, i) => {
              const posts = BLOG_POSTS.filter(
                (p) => p.categorySlug === cat.slug
              );
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.28, delay: i * 0.05 }}
                >
                  <Link
                    href={`/${cat.slug}`}
                    className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-white hover:border-primaryOrange/40 hover:shadow-md p-4 text-center transition-all duration-200"
                  >
                    <span className="text-3xl">{cat.emoji}</span>
                    <span className="text-xs font-bold text-darkerGray group-hover:text-primaryOrange transition-colors leading-tight">
                      {cat.navLabel}
                    </span>
                    <span className="text-[10px] text-lightGray">
                      {posts.length} Guides
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RATGEBER CTA ─────────────────────────────────────────── */}
      <section
        className="py-10 md:py-14"
        style={{ background: "#161616" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primaryOrange/20 flex items-center justify-center">
              <Zap className="w-7 h-7 text-primaryOrange" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl mb-2">
                Lieber Übersichten statt einzelner Guides?
              </h3>
              <p className="text-primaryGray text-sm leading-relaxed">
                Die Ratgeber-Seiten geben dir den kompletten Kontext zu jeder
                Lebenssituation — mit allen Guides der Kategorie auf einen Blick.
              </p>
            </div>
            <Link
              href="/ratgeber"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-primaryOrange hover:bg-darkOrange text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
            >
              Zu den Ratgebern
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
