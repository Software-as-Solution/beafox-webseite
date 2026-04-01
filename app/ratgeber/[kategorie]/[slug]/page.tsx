"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Zap,
  BookOpen,
  Target,
  ArrowRight,
  Tag,
  PawPrint,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getPostByCategoryAndSlug,
  getBlogPostBySlug,
  getGuidePostPath,
  getRatgeberCategoryPath,
} from "@/lib/blog";
import {
  fetchSanityGuide,
  type SanityGuide,
} from "@/lib/sanity-fetch";
import PortableText from "@/components/PortableText";

// Difficulty helper
function getDifficulty(
  categorySlug: string,
  sanityDifficulty?: string
): { label: string; color: string; bg: string } {
  if (sanityDifficulty === "fortgeschritten") {
    return {
      label: "Fortgeschritten",
      color: "text-primaryOrange",
      bg: "bg-primaryOrange/10",
    };
  }
  if (sanityDifficulty === "einsteiger") {
    return {
      label: "Einsteiger",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    };
  }
  // Fallback based on category
  const easy = [
    "finanzen-fuer-schueler",
    "finanzen-fuer-azubis",
    "finanzen-fuer-studenten",
  ];
  return easy.includes(categorySlug)
    ? { label: "Einsteiger", color: "text-emerald-600", bg: "bg-emerald-50" }
    : {
        label: "Fortgeschritten",
        color: "text-primaryOrange",
        bg: "bg-primaryOrange/10",
      };
}

// Fallback steps when no Sanity steps available
function buildFallbackSteps(): { title: string; description: string }[] {
  return [
    {
      title: "Ausgangspunkt verstehen",
      description:
        "Sammle alle nötigen Infos und verstehe deinen aktuellen Stand.",
    },
    {
      title: "Werkzeuge einrichten",
      description:
        "Richte deine Konten und Tools ein — dauert meist 10–15 Minuten.",
    },
    {
      title: "Ersten Schritt umsetzen",
      description:
        "Setze den ersten konkreten Schritt mit Bea als Begleiter um.",
    },
    {
      title: "Ergebnis überprüfen",
      description: "Überprüfe dein Ergebnis anhand der Checkliste.",
    },
    {
      title: "Automatisieren",
      description: "Einmal aufgesetzt, läuft es — vergiss es und profitiere.",
    },
  ];
}

export default function NewsPostPage() {
  const params = useParams<{ kategorie: string; slug: string }>();
  const { kategorie, slug } = params;

  // Static data from blog.ts (may be null for Sanity-only guides)
  const post = getPostByCategoryAndSlug(kategorie, slug);
  const category = getCategoryBySlug(kategorie);

  // Sanity data (fetched client-side, enriches or replaces blog.ts)
  const [sanityGuide, setSanityGuide] = useState<SanityGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSanityGuide(kategorie, slug)
      .then((guide) => {
        if (!cancelled) setSanityGuide(guide);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [kategorie, slug]);

  // If neither blog.ts nor Sanity has this guide, show 404
  // (wait for Sanity to load before deciding)
  if (!post && !loading && !sanityGuide) notFound();

  // Show loading state while waiting for Sanity (only for Sanity-only guides)
  if (!post && loading) {
    return (
      <section
        className="pt-24 md:pt-32 pb-20 min-h-screen flex items-center justify-center"
        style={{ background: "#161616" }}
      >
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primaryOrange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primaryGray text-sm">Guide wird geladen...</p>
        </div>
      </section>
    );
  }

  const relatedPosts = (post?.related ?? [])
    .map((relatedSlug) => getBlogPostBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);
  const otherCategories = BLOG_CATEGORIES.filter(
    (c) => c.slug !== kategorie
  );

  // Merge: prefer Sanity data when available, fallback to blog.ts
  const title = sanityGuide?.title ?? post?.title ?? "Guide";
  const excerpt = sanityGuide?.excerpt ?? post?.excerpt ?? "";
  const readingTime = sanityGuide?.readingTime ?? post?.readingTime ?? 5;
  const tags = sanityGuide?.tags?.length
    ? sanityGuide.tags
    : post?.tags ?? [];
  const difficulty = getDifficulty(
    kategorie,
    sanityGuide?.difficulty
  );
  const steps = sanityGuide?.steps?.length
    ? sanityGuide.steps
    : buildFallbackSteps();
  const hasSanityBody =
    sanityGuide?.body && sanityGuide.body.length > 0;

  return (
    <>
      {/* ── DARK HERO ─────────────────────────────────────────────── */}
      <section
        className="pt-24 md:pt-32 pb-10 md:pb-14"
        style={{
          background: "linear-gradient(160deg, #161616 0%, #1D1B1B 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 text-sm mb-6 flex-wrap"
          >
            <Link
              href="/ratgeber"
              className="text-primaryGray hover:text-primaryOrange transition-colors"
            >
              Ratgeber
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-primaryGray/50 flex-shrink-0" />
            <Link
              href={getRatgeberCategoryPath(kategorie)}
              className="text-primaryGray hover:text-primaryOrange transition-colors"
            >
              {category?.navLabel ?? kategorie}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-primaryGray/50 flex-shrink-0" />
            <span className="text-primaryOrange font-medium truncate max-w-[200px]">
              {post?.navTitle ?? title}
            </span>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primaryOrange text-white">
              <Target className="w-3 h-3" />
              Guide
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${difficulty.bg} ${difficulty.color}`}
            >
              <TrendingUp className="w-3 h-3" />
              {difficulty.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-primaryGray">
              <Clock className="w-3 h-3" />
              {readingTime} Min.
            </span>
            {sanityGuide && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Vollständiger Guide
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 max-w-4xl"
          >
            {title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-base md:text-lg text-primaryGray leading-relaxed max-w-3xl mb-8"
          >
            {excerpt}
          </motion.p>

          {/* Tags */}
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="flex flex-wrap gap-2"
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs text-primaryGray/70 px-2.5 py-1 rounded-full border border-white/10"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── GUIDE SUMMARY CARD ─────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Was du lernst */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primaryOrange" />
                <span className="text-xs font-bold text-darkerGray uppercase tracking-wide">
                  Was du lernst
                </span>
              </div>
              <p className="text-sm text-lightGray leading-relaxed">
                {excerpt}
              </p>
            </div>

            {/* Was du danach kannst */}
            <div className="rounded-2xl border border-primaryOrange/20 bg-primaryOrange/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-primaryOrange" />
                <span className="text-xs font-bold text-darkerGray uppercase tracking-wide">
                  Was du danach kannst
                </span>
              </div>
              <ul className="space-y-1.5">
                {steps.slice(0, 3).map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-darkerGray"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primaryOrange mt-0.5 flex-shrink-0" />
                    {step.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick info */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-primaryOrange" />
                <span className="text-xs font-bold text-darkerGray uppercase tracking-wide">
                  Guide-Info
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-lightGray">Dauer</span>
                  <span className="font-semibold text-darkerGray">
                    {readingTime} Min.
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-lightGray">Schritte</span>
                  <span className="font-semibold text-darkerGray">
                    {steps.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-lightGray">Level</span>
                  <span className={`font-semibold ${difficulty.color}`}>
                    {difficulty.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-lightGray">Kategorie</span>
                  <Link
                    href={getRatgeberCategoryPath(kategorie)}
                    className="font-semibold text-primaryOrange hover:underline text-right max-w-[120px] truncate"
                  >
                    {category?.navLabel}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GUIDE CONTENT + SIDEBAR ───────────────────────────────── */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">
            {/* Main content */}
            <div>
              {/* SANITY BODY CONTENT */}
              {hasSanityBody ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="mb-12"
                >
                  <PortableText blocks={sanityGuide!.body!} />
                </motion.div>
              ) : (
                /* Fallback: show steps as content when no Sanity body */
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="mb-10"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-4">
                    So gehst du vor
                  </h2>
                  <p className="text-base text-lightGray leading-relaxed">
                    {post?.content ?? excerpt}
                  </p>
                </motion.div>
              )}

              {/* STEPS — always show */}
              <div className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold text-darkerGray mb-6 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primaryOrange/10">
                    <Target className="w-4 h-4 text-primaryOrange" />
                  </span>
                  Dein Action-Plan
                </h2>
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.07 }}
                      className="flex gap-4 group"
                    >
                      {/* Step number */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primaryOrange/10 border-2 border-primaryOrange/20 group-hover:border-primaryOrange group-hover:bg-primaryOrange group-hover:text-white text-primaryOrange font-bold text-base flex items-center justify-center transition-all duration-200">
                          {i + 1}
                        </div>
                        {i < steps.length - 1 && (
                          <div className="w-0.5 bg-gray-100 h-full ml-[19px] mt-2" />
                        )}
                      </div>
                      {/* Step content */}
                      <div className="pb-4 flex-1">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 group-hover:border-primaryOrange/25 group-hover:bg-primaryOrange/5 transition-all duration-200">
                          <h3 className="font-bold text-darkerGray text-sm md:text-base mb-1">
                            {step.title}
                          </h3>
                          <p className="text-sm text-lightGray leading-relaxed">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primaryGray/50" />
                            <span className="text-xs text-primaryGray/60">
                              Schritt {i + 1} von {steps.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bea action CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #1D1B1B 0%, #2a2828 100%)",
                }}
              >
                <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primaryOrange/20 flex items-center justify-center">
                    <PawPrint className="w-7 h-7 text-primaryOrange" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">
                      Mit Bea geht&apos;s schneller
                    </h3>
                    <p className="text-primaryGray text-sm leading-relaxed">
                      Bea ist dein KI-Begleiter in der BeAFox App — sie führt
                      dich Schritt für Schritt durch diesen Guide, erinnert
                      dich und macht dich handlungsfähig.
                    </p>
                  </div>
                  <a
                    href="https://beafox.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-2 bg-primaryOrange hover:bg-darkOrange text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <Smartphone className="w-4 h-4" />
                    App öffnen
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                {/* Step navigator */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <h4 className="text-xs font-bold text-darkerGray uppercase tracking-wide mb-4">
                    Guide-Schritte
                  </h4>
                  <ol className="space-y-3">
                    {steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primaryOrange/10 text-primaryOrange text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-xs text-lightGray leading-relaxed line-clamp-2">
                          {step.title}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* App CTA */}
                <div
                  className="rounded-2xl p-5 text-center"
                  style={{ background: "#161616" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primaryOrange/20 flex items-center justify-center mx-auto mb-3">
                    <PawPrint className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">
                    Direkt umsetzen mit Bea
                  </h4>
                  <p className="text-primaryGray text-xs mb-4 leading-relaxed">
                    Guides, Challenges & KI-Begleitung in der App
                  </p>
                  <a
                    href="https://beafox.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full justify-center bg-primaryOrange hover:bg-darkOrange text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <Smartphone className="w-4 h-4" />
                    Kostenlos starten
                  </a>
                </div>

                {/* Category link */}
                <div className="rounded-2xl border border-primaryOrange/20 p-5">
                  <h4 className="text-xs font-bold text-darkerGray uppercase tracking-wide mb-3">
                    Kategorie-Übersicht
                  </h4>
                  <Link
                    href={getRatgeberCategoryPath(kategorie)}
                    className="flex items-center gap-2 text-primaryOrange font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {category?.emoji} {category?.title}
                    <ArrowRight className="w-4 h-4 ml-auto flex-shrink-0" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── RELATED GUIDES ────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-10 md:py-14">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-2">
                Nächste{" "}
                <span className="text-primaryOrange">Missionen</span>
              </h2>
              <p className="text-lightGray text-sm mb-6">
                Diese Guides passen gut zu dem, was du gerade gemacht hast.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedPosts.map((related, i) => {
                  const relCat = getCategoryBySlug(related.categorySlug);
                  const relDiff = getDifficulty(related.categorySlug);
                  return (
                    <motion.div
                      key={related.slug}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                    >
                      <Link
                        href={getGuidePostPath(
                          related.categorySlug,
                          related.slug
                        )}
                        className="group flex flex-col h-full rounded-2xl border border-gray-200 bg-white p-5 hover:border-primaryOrange/40 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold text-primaryOrange bg-primaryOrange/10 px-2.5 py-1 rounded-full">
                            {relCat?.navLabel ?? related.categorySlug}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${relDiff.bg} ${relDiff.color}`}
                          >
                            {relDiff.label}
                          </span>
                        </div>
                        <h3 className="font-bold text-darkerGray mb-2 group-hover:text-primaryOrange transition-colors leading-snug">
                          {related.title}
                        </h3>
                        <p className="text-xs text-lightGray leading-relaxed flex-1 mb-3">
                          {related.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-primaryGray flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {related.readingTime} Min.
                          </span>
                          <span className="inline-flex items-center gap-1 text-primaryOrange text-xs font-semibold group-hover:gap-2 transition-all">
                            Guide starten
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── ALL CATEGORIES ────────────────────────────────────────── */}
      <section className="py-10 md:py-14" style={{ background: "#161616" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Alle Guide-Kategorien
            </h2>
            <Link
              href="/ratgeber"
              className="text-primaryOrange text-sm font-semibold hover:underline"
            >
              Alle Ratgeber →
            </Link>
          </motion.div>
          <div className="flex flex-wrap gap-2.5">
            {otherCategories.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Link
                  href={getRatgeberCategoryPath(c.slug)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-primaryGray hover:border-primaryOrange hover:text-primaryOrange text-sm font-medium transition-all duration-200"
                >
                  <span>{c.emoji}</span>
                  {c.navLabel}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
