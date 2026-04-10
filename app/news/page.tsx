"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Filter,
} from "lucide-react";
import {
  NEWS_CATEGORIES,
  getAllNewsPosts,
  getNewsCategory,
  formatNewsDate,
  type NewsCategory,
  type NewsPost,
} from "@/lib/news-posts";

// ─── Filter Bar ────────────────────────────────────────────────
function CategoryPill({
  active,
  label,
  icon,
  onClick,
  count,
}: {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
        active
          ? "border-primaryOrange bg-primaryOrange text-white shadow-md"
          : "border-gray-200 bg-white text-darkerGray hover:border-primaryOrange/40 hover:text-primaryOrange"
      }`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
      <span
        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
          active ? "bg-white/20 text-white" : "bg-gray-100 text-lightGray"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ─── News Card ─────────────────────────────────────────────────
function NewsCard({ post, index }: { post: NewsPost; index: number }) {
  const cat = getNewsCategory(post.category);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primaryOrange/40 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category badge overlay */}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold shadow-sm backdrop-blur ${cat.textColor}`}
          >
            <span aria-hidden="true">{cat.icon}</span>
            {cat.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Meta */}
        <div className="mb-3 flex items-center gap-3 text-[11px] text-lightGray">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatNewsDate(post.publishedAt)}
          </span>
          {post.location && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {post.location}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-darkerGray transition-colors group-hover:text-primaryOrange md:text-xl">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-lightGray">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-lightGray">
          <span className="font-medium text-darkerGray">{post.author}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readingTime} Min.
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Featured (hero) card ──────────────────────────────────────
function FeaturedCard({ post }: { post: NewsPost }) {
  const cat = getNewsCategory(post.category);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative mb-12 grid overflow-hidden rounded-3xl border border-gray-200 bg-white md:grid-cols-2 md:mb-16"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full md:aspect-auto md:min-h-[420px]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primaryOrange px-3 py-1.5 text-xs font-bold text-white shadow-md">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Neueste News
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur ${cat.textColor}`}
          >
            <span aria-hidden="true">{cat.icon}</span>
            {cat.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
        <div className="mb-4 flex items-center gap-3 text-xs text-lightGray">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNewsDate(post.publishedAt)}
          </span>
          {post.location && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {post.location}
              </span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readingTime} Min. Lesezeit
          </span>
        </div>

        <h2 className="mb-4 text-2xl font-bold leading-tight text-darkerGray transition-colors group-hover:text-primaryOrange md:text-3xl lg:text-4xl">
          {post.title}
        </h2>

        <p className="mb-6 text-base leading-relaxed text-lightGray md:text-lg">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primaryOrange/10 px-4 py-2 text-sm font-bold text-primaryOrange">
            {post.author}
          </div>
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-lightGray"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page ──────────────────────────────────────────────────────
type FilterValue = "all" | NewsCategory;

export default function NewsPage() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const allPosts = useMemo(() => getAllNewsPosts(), []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: allPosts.length };
    NEWS_CATEGORIES.forEach((cat) => {
      c[cat.slug] = allPosts.filter((p) => p.category === cat.slug).length;
    });
    return c;
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (filter === "all") return allPosts;
    return allPosts.filter((p) => p.category === filter);
  }, [allPosts, filter]);

  const featured = filter === "all" ? allPosts[0] : null;
  const restPosts =
    filter === "all" && featured
      ? allPosts.slice(1)
      : filteredPosts;

  return (
    <>
      {/* ── DARK HERO ────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16"
        style={{
          background: "linear-gradient(160deg, #161616 0%, #1D1B1B 100%)",
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primaryOrange/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primaryOrange/30 bg-primaryOrange/10 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-primaryOrange" />
            <span className="text-sm font-bold text-primaryOrange">
              Behind the Scenes
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mb-5 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          >
            BeAFox <span className="text-primaryOrange">News</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-10 max-w-2xl text-base leading-relaxed text-primaryGray md:text-lg"
          >
            Was gerade bei BeAFox passiert — Events, Auszeichnungen,
            Presse­berichte und alles, was unser Team bewegt. Kein klassischer
            Blog, sondern ein ehrlicher Blick hinter die Kulissen.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap gap-6 text-sm text-primaryGray"
          >
            <div className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                {allPosts.length}
              </span>
              <span>News-Beiträge</span>
            </div>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <div className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                {NEWS_CATEGORIES.length}
              </span>
              <span>Kategorien</span>
            </div>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <div className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold text-white">2025</span>
              <span>— heute</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────────────────── */}
      <section className="sticky top-[72px] z-20 border-b border-gray-100 bg-white/95 py-4 backdrop-blur md:top-[80px]">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <div className="hidden shrink-0 items-center gap-2 text-xs font-semibold text-lightGray sm:inline-flex">
              <Filter className="h-3.5 w-3.5" />
              Filtern:
            </div>
            <CategoryPill
              active={filter === "all"}
              label="Alle"
              icon="📌"
              count={counts.all}
              onClick={() => setFilter("all")}
            />
            {NEWS_CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat.slug}
                active={filter === cat.slug}
                label={cat.label}
                icon={cat.icon}
                count={counts[cat.slug] ?? 0}
                onClick={() => setFilter(cat.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── POSTS ────────────────────────────────────────────── */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* Featured — only on "all" filter */}
          {featured && <FeaturedCard post={featured} />}

          {/* Section heading for remaining */}
          {restPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="h-8 w-1 rounded-full bg-primaryOrange" />
              <h2 className="text-xl font-bold text-darkerGray md:text-2xl">
                {filter === "all"
                  ? "Weitere News"
                  : `${getNewsCategory(filter as NewsCategory).label} (${
                      restPosts.length
                    })`}
              </h2>
            </motion.div>
          )}

          {/* Grid */}
          {restPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restPosts.map((post, i) => (
                <NewsCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-sm text-lightGray">
                In dieser Kategorie gibt es aktuell keine News.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ background: "#161616" }}>
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:p-8"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primaryOrange/20">
              <Sparkles className="h-7 w-7 text-primaryOrange" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold text-white">
                Du willst mehr über BeAFox lesen?
              </h3>
              <p className="text-sm leading-relaxed text-primaryGray">
                Im Magazin findest du tiefe Artikel und Guides rund um
                Finanzbildung. Oder schau, was es Neues in der App gibt.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/magazin"
                className="inline-flex items-center gap-2 rounded-xl bg-primaryOrange px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-darkOrange"
              >
                Zum Magazin
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/updates"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                App-Updates
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
