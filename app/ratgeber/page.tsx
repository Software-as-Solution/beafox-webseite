"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Search,
  Clock,
  PawPrint,
  Smartphone,
  Zap,
  Target,
  CheckCircle2,
  TrendingUp,
  X,
  Flame,
  Star,
} from "lucide-react";
import {
  BLOG_CATEGORIES,
  getPostsByCategory,
  getGuidePostPath,
  getRatgeberCategoryPath,
  type BlogPost,
} from "@/lib/blog";
import { fetchAllSanityGuides, type SanityGuide } from "@/lib/sanity-fetch";

// ─── Constants ─────────────────────────────────────────────
const GUIDES_PER_PAGE = 9;

// Difficulty by category
const CATEGORY_DIFFICULTY: Record<string, "Einsteiger" | "Fortgeschritten"> = {
  "finanzen-fuer-schueler": "Einsteiger",
  "finanzen-fuer-azubis": "Einsteiger",
  "finanzen-fuer-studenten": "Einsteiger",
  "finanzen-fuer-berufseinsteiger": "Fortgeschritten",
  "finanzen-bei-lebensereignissen": "Fortgeschritten",
  "investieren-fuer-anfaenger": "Einsteiger",
};

// Merge static blog posts with Sanity enrichment
function useAllPosts() {
  const [sanityGuides, setSanityGuides] = useState<SanityGuide[]>([]);
  useEffect(() => {
    fetchAllSanityGuides().then(setSanityGuides).catch(() => {});
  }, []);

  const allPosts = useMemo(() => {
    const sanityMap = new Map(sanityGuides.map((g) => [g.slug, g]));
    const posts: (BlogPost & {
      categoryTitle: string;
      categoryEmoji: string;
      difficulty: "Einsteiger" | "Fortgeschritten";
    })[] = [];

    for (const cat of BLOG_CATEGORIES) {
      const catPosts = getPostsByCategory(cat.slug);
      for (const post of catPosts) {
        const sg = sanityMap.get(post.slug);
        posts.push({
          ...post,
          title: sg?.title ?? post.title,
          excerpt: sg?.excerpt ?? post.excerpt,
          readingTime: sg?.readingTime ?? post.readingTime,
          tags: sg?.tags ?? post.tags,
          categoryTitle: cat.navLabel,
          categoryEmoji: cat.emoji,
          difficulty: CATEGORY_DIFFICULTY[cat.slug] ?? "Einsteiger",
        });
      }
    }

    posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return posts;
  }, [sanityGuides]);

  return allPosts;
}

function useCategoryCounts(allPosts: ReturnType<typeof useAllPosts>) {
  return useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of allPosts) {
      counts.set(post.categorySlug, (counts.get(post.categorySlug) ?? 0) + 1);
    }
    return counts;
  }, [allPosts]);
}

// ─── Component ─────────────────────────────────────────────
export default function RatgeberHubPage() {
  const allPosts = useAllPosts();
  const categoryCounts = useCategoryCounts(allPosts);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState<"Einsteiger" | "Fortgeschritten" | null>(null);
  const [visibleCount, setVisibleCount] = useState(GUIDES_PER_PAGE);

  useEffect(() => {
    setVisibleCount(GUIDES_PER_PAGE);
  }, [activeCategory, searchQuery, activeDifficulty]);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    if (activeCategory) posts = posts.filter((p) => p.categorySlug === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeDifficulty) posts = posts.filter((p) => p.difficulty === activeDifficulty);
    return posts;
  }, [allPosts, activeCategory, searchQuery, activeDifficulty]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);
  const visiblePosts = remainingPosts.slice(0, visibleCount);
  const hasMore = visibleCount < remainingPosts.length;

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className="pt-24 md:pt-32 pb-10 md:pb-14 overflow-hidden relative bg-primaryWhite"
        style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkerGray leading-tight mb-4"
          >
            Deine Finanzen.{" "}
            <span className="text-primaryOrange">Einfach durchgespielt</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-lightGray text-base md:text-lg leading-relaxed mb-8 max-w-2xl"
          >
            Keine Theorie-Texte. Echte Schritt-für-Schritt Anleitungen für{" "}
            <span className="text-darkerGray font-semibold">Schüler</span>,{" "}
            <span className="text-darkerGray font-semibold">Azubis</span>,{" "}
            <span className="text-darkerGray font-semibold">Studenten</span> und{" "}
            <span className="text-darkerGray font-semibold">Berufseinsteiger</span>.
          </motion.p>

          {/* ── SEARCH ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="relative max-w-xl mb-8"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Suche nach Guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white border border-gray-200 text-darkerGray placeholder-gray-400 focus:border-primaryOrange focus:outline-none focus:ring-2 focus:ring-primaryOrange/20 transition-all text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lightGray hover:text-darkerGray transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* ── CATEGORY FILTERS ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                !activeCategory
                  ? "bg-primaryOrange text-white shadow-lg shadow-primaryOrange/20"
                  : "bg-gray-100 text-darkerGray border border-gray-200 hover:bg-gray-200"
              }`}
            >
              Alle
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  !activeCategory ? "bg-white/20" : "bg-gray-200 text-darkGray"
                }`}
              >
                {allPosts.length}
              </span>
            </button>
            {BLOG_CATEGORIES.map((cat) => {
              const count = categoryCounts.get(cat.slug) ?? 0;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(isActive ? null : cat.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-primaryOrange text-white shadow-lg shadow-primaryOrange/20"
                      : "bg-gray-100 text-darkerGray border border-gray-200 hover:border-primaryOrange/30 hover:bg-primaryOrange/5"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.navLabel}
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20" : "bg-gray-200 text-darkerGray"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED + GRID ────────────────────────────────────── */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-darkerGray mb-2">
                Keine Guides gefunden
              </h2>
              <p className="text-lightGray mb-6">
                Versuch einen anderen Suchbegriff oder wähle eine andere Kategorie.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
                className="inline-flex items-center gap-2 bg-primaryOrange text-white font-bold px-6 py-3 rounded-xl hover:bg-darkOrange transition-colors"
              >
                Alle Guides anzeigen
              </button>
            </div>
          ) : (
            <>
              {/* ── FEATURED GUIDE ──────────────────────── */}
              {featuredPost && (
                <motion.div
                  key={featuredPost.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-10"
                >
                  <Link
                    href={getGuidePostPath(featuredPost.categorySlug, featuredPost.slug)}
                    className="group grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-200 hover:border-primaryOrange/30 hover:shadow-lg transition-all duration-300 bg-white shadow-md"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] md:aspect-auto bg-gray-100 overflow-hidden">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.imageAlt}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primaryOrange text-white text-xs font-bold">
                          <Flame className="w-3 h-3" />
                          NEU
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold text-primaryOrange bg-primaryOrange/10 border border-primaryOrange/15 px-2.5 py-1 rounded-full">
                          {featuredPost.categoryEmoji} {featuredPost.categoryTitle}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          featuredPost.difficulty === "Einsteiger"
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-blue-50 text-blue-600 border border-blue-200"
                        }`}>
                          {featuredPost.difficulty}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-darkerGray group-hover:text-primaryOrange transition-colors mb-3 leading-tight">
                        {featuredPost.title}
                      </h2>

                      <p className="text-lightGray text-base leading-relaxed mb-5 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-2 bg-primaryOrange text-white font-bold text-sm px-5 py-2.5 rounded-xl group-hover:bg-darkOrange transition-colors">
                          Handlung starten
                          <ArrowRight className="w-4 h-4" />
                        </span>
                        <span className="text-xs text-lightGray flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {featuredPost.readingTime} Min.
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* ── GRID HEADING + DIFFICULTY FILTER ──────── */}
              {remainingPosts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-darkerGray">
                    Weitere Guides
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200">
                      <button
                        onClick={() => setActiveDifficulty(null)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                          !activeDifficulty
                            ? "bg-white shadow-sm text-darkerGray"
                            : "text-lightGray hover:text-darkerGray"
                        }`}
                      >
                        Alle
                      </button>
                      <button
                        onClick={() => setActiveDifficulty(activeDifficulty === "Einsteiger" ? null : "Einsteiger")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                          activeDifficulty === "Einsteiger"
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "text-lightGray hover:text-darkerGray"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        Einsteiger
                      </button>
                      <button
                        onClick={() => setActiveDifficulty(activeDifficulty === "Fortgeschritten" ? null : "Fortgeschritten")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                          activeDifficulty === "Fortgeschritten"
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "text-lightGray hover:text-darkerGray"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Fortgeschritten
                      </button>
                    </div>
                    <span className="text-sm text-lightGray ml-1">
                      {filteredPosts.length} Guides
                    </span>
                  </div>
                </div>
              )}

              {/* ── GUIDE GRID ─────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {visiblePosts.map((post, i) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      layout
                    >
                      <Link
                        href={getGuidePostPath(post.categorySlug, post.slug)}
                        className="group flex flex-col h-full rounded-2xl overflow-hidden border border-gray-200 hover:border-primaryOrange/30 hover:shadow-md transition-all duration-300 bg-white shadow-sm"
                      >
                        {/* Card Image */}
                        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.imageAlt}
                            fill
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Difficulty badge on image */}
                          <div className="absolute top-2.5 right-2.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
                              post.difficulty === "Einsteiger"
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : "bg-blue-50 text-blue-600 border border-blue-200"
                            }`}>
                              {post.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-2.5">
                            <span className="text-xs font-bold text-primaryOrange bg-primaryOrange/10 border border-primaryOrange/15 px-2 py-0.5 rounded-full">
                              {post.categoryEmoji} {post.categoryTitle}
                            </span>
                          </div>

                          <h3 className="font-bold text-darkerGray text-base leading-snug mb-2 group-hover:text-primaryOrange transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-sm text-lightGray leading-relaxed line-clamp-2 mb-4 flex-1">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                            <span className="text-xs text-lightGray flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readingTime} Min.
                            </span>
                            <span className="text-xs font-bold text-primaryOrange flex items-center gap-1 group-hover:gap-2 transition-all">
                              Starten
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* ── LOAD MORE ──────────────────────────── */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-center mt-10"
                >
                  <button
                    onClick={() => setVisibleCount((v) => v + GUIDES_PER_PAGE)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-gray-200 text-darkerGray font-bold hover:border-primaryOrange hover:text-primaryOrange transition-all"
                  >
                    Mehr Guides laden
                    <span className="text-sm font-normal text-lightGray">
                      ({remainingPosts.length - visibleCount} weitere)
                    </span>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── CATEGORY OVERVIEW ──────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-primaryWhite">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-2">
              Wähle deine <span className="text-primaryOrange">Situation</span>
            </h2>
            <p className="text-lightGray text-sm max-w-lg mx-auto">
              Jede Kategorie ist auf eine konkrete Phase in deinem Leben zugeschnitten
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {BLOG_CATEGORIES.map((cat, i) => {
              const count = categoryCounts.get(cat.slug) ?? 0;
              const diff = CATEGORY_DIFFICULTY[cat.slug] ?? "Einsteiger";
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Link
                    href={getRatgeberCategoryPath(cat.slug)}
                    className="group flex flex-col rounded-2xl border border-gray-200 hover:border-primaryOrange/30 hover:shadow-md p-5 transition-all duration-200 bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{cat.emoji}</span>
                      <span className="text-primaryOrange font-bold text-lg">{count}</span>
                    </div>
                    <h3 className="text-darkerGray font-bold text-sm mb-1 group-hover:text-primaryOrange transition-colors">
                      {cat.navLabel}
                    </h3>
                    <p className="text-lightGray text-xs leading-relaxed mb-3 line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        diff === "Einsteiger"
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}>
                        {diff}
                      </span>
                      <span className="text-xs text-primaryOrange font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Erkunden
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── APP CTA ────────────────────────────────────────────── */}
      <section
        className="py-12 md:py-16"
        style={{ background: "linear-gradient(135deg, #eb8a26 0%, #b16518 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <PawPrint className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Nicht nur lesen — umsetzen.
              </h2>
              <p className="text-white/80 text-base leading-relaxed max-w-xl">
                In der BeAFox App wird jeder Guide zur Mission. KI-Coaching,
                Challenges und XP-System inklusive. Finanzwissen das bleibt.
              </p>
            </div>
            <a
              href="https://beafox.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-primaryOrange font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-base"
            >
              <Smartphone className="w-5 h-5" />
              Jetzt starten
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── WHY DIFFERENT ──────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-2">
              Kein Blog. <span className="text-primaryOrange">Handlungsfähigkeit.</span>
            </h2>
            <p className="text-lightGray text-sm max-w-lg mx-auto">
              Was uns von generischen Finanzseiten unterscheidet
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: "Klares Ergebnis",
                desc: "Jeder Guide hat ein konkretes Ziel. Am Ende hast du etwas erledigt — nicht nur gelesen.",
              },
              {
                icon: Zap,
                title: "Für dein Level",
                desc: "Schüler? Azubi? Berufseinsteiger? Unsere Guides sind auf deine Situation zugeschnitten.",
              },
              {
                icon: Star,
                title: "App + Guide = Ergebnis",
                desc: "Guide lesen, in der App umsetzen, XP sammeln. Finanzwissen wird zur Gewohnheit.",
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
                  className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-primaryOrange/10 border border-primaryOrange/15 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <h3 className="text-darkerGray font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-lightGray text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
