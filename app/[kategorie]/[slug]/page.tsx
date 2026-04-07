"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Zap,
  BookOpen,
  Target,
  Tag,
  PawPrint,
  Star,
  TrendingUp,
  Link2,
  Share2,
} from "lucide-react";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getPostByCategoryAndSlug,
  getBlogPostBySlug,
  getGuidePostPath,
  getRatgeberCategoryPath,
} from "@/lib/blog";
import { fetchSanityGuide, type SanityGuide } from "@/lib/sanity-fetch";
import PortableText from "@/components/PortableText";
import GuideTOC, { type TOCItem } from "@/components/guide/GuideTOC";
import GuideChecklist from "@/components/guide/GuideChecklist";
import GuideQuiz from "@/components/guide/GuideQuiz";
import GuideCalculator from "@/components/guide/GuideCalculator";
import { getGuideInteractive } from "@/lib/guide-interactive";

// ─── Helpers ──────────────────────────────────────────────────
function getDifficulty(categorySlug: string, sanityDifficulty?: string) {
  if (sanityDifficulty === "fortgeschritten")
    return { label: "Fortgeschritten", color: "text-blue-400", bg: "bg-blue-500/15" };
  if (sanityDifficulty === "einsteiger")
    return { label: "Einsteiger", color: "text-green-400", bg: "bg-green-500/15" };
  const easy = ["finanzen-fuer-schueler", "finanzen-fuer-azubis", "finanzen-fuer-studenten", "investieren-fuer-anfaenger"];
  return easy.includes(categorySlug)
    ? { label: "Einsteiger", color: "text-green-400", bg: "bg-green-500/15" }
    : { label: "Fortgeschritten", color: "text-blue-400", bg: "bg-blue-500/15" };
}

function buildFallbackSteps() {
  return [
    { title: "Ausgangspunkt verstehen", description: "Sammle alle nötigen Infos und verstehe deinen aktuellen Stand." },
    { title: "Werkzeuge einrichten", description: "Richte deine Konten und Tools ein — dauert meist 10–15 Minuten." },
    { title: "Ersten Schritt umsetzen", description: "Setze den ersten konkreten Schritt mit Bea als Begleiter um." },
    { title: "Ergebnis überprüfen", description: "Überprüfe dein Ergebnis anhand der Checkliste." },
    { title: "Automatisieren", description: "Einmal aufgesetzt, läuft es — vergiss es und profitiere." },
  ];
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return progress;
}

// ─── Page ─────────────────────────────────────────────────────
export default function GuideArticlePage() {
  const params = useParams<{ kategorie: string; slug: string }>();
  const { kategorie, slug } = params;
  const post = getPostByCategoryAndSlug(kategorie, slug);
  const category = getCategoryBySlug(kategorie);

  const [sanityGuide, setSanityGuide] = useState<SanityGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const readingProgress = useReadingProgress();

  useEffect(() => {
    let cancelled = false;
    fetchSanityGuide(kategorie, slug)
      .then((g) => { if (!cancelled) setSanityGuide(g); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [kategorie, slug]);

  if (!post && !loading && !sanityGuide) notFound();

  if (!post && loading) {
    return (
      <section className="pt-24 md:pt-32 pb-20 min-h-screen flex items-center justify-center bg-primaryWhite">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primaryOrange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lightGray text-sm">Guide wird geladen...</p>
        </div>
      </section>
    );
  }

  const title = sanityGuide?.title ?? post?.title ?? "Guide";
  const excerpt = sanityGuide?.excerpt ?? post?.excerpt ?? "";
  const readingTime = sanityGuide?.readingTime ?? post?.readingTime ?? 5;
  const tags = sanityGuide?.tags?.length ? sanityGuide.tags : post?.tags ?? [];
  const difficulty = getDifficulty(kategorie, sanityGuide?.difficulty);
  const steps = sanityGuide?.steps?.length ? sanityGuide.steps : buildFallbackSteps();
  const hasSanityBody = sanityGuide?.body && sanityGuide.body.length > 0;
  const interactive = getGuideInteractive(slug, steps);

  const relatedPosts = (post?.related ?? [])
    .map((rs) => getBlogPostBySlug(rs))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);
  const otherCategories = BLOG_CATEGORIES.filter((c) => c.slug !== kategorie);

  // Build TOC items
  const tocItems: TOCItem[] = useMemo(() => {
    const items: TOCItem[] = [];
    if (hasSanityBody && sanityGuide?.body) {
      for (const block of sanityGuide.body) {
        if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
          const text = block.children?.map((c) => c.text).join("") ?? "";
          if (text) items.push({ id: `section-${block._key}`, label: text, level: block.style === "h3" ? 3 : 2 });
        }
      }
    }
    // Always add static sections
    items.push({ id: "section-action-plan", label: "Dein Action-Plan" });
    if (interactive.checklist) items.push({ id: "section-checklist", label: interactive.checklist.title ?? "Checkliste" });
    if (interactive.quiz) items.push({ id: "section-quiz", label: interactive.quiz.title ?? "Wissens-Check" });
    if (interactive.calculator) items.push({ id: "section-calculator", label: interactive.calculator.title ?? "Rechner" });
    items.push({ id: "section-app-cta", label: "Mit Bea umsetzen" });
    return items;
  }, [hasSanityBody, sanityGuide, interactive]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // BreadcrumbList structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: "https://beafox.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ratgeber",
        item: "https://beafox.app/ratgeber",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category?.navLabel ?? kategorie,
        item: `https://beafox.app${getRatgeberCategoryPath(kategorie)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: title,
        item: `https://beafox.app${getRatgeberCategoryPath(kategorie)}/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* ── BREADCRUMB STRUCTURED DATA ───────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── READING PROGRESS BAR ─────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5">
        <motion.div
          className="h-full bg-primaryOrange"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="pt-24 md:pt-32 pb-10 md:pb-14 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 text-sm mb-6 flex-wrap"
          >
            <Link href="/ratgeber" className="text-lightGray hover:text-primaryOrange transition-colors">
              Ratgeber
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <Link href={getRatgeberCategoryPath(kategorie)} className="text-lightGray hover:text-primaryOrange transition-colors">
              {category?.navLabel ?? kategorie}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-primaryOrange font-medium truncate max-w-[200px]">
              {post?.navTitle ?? title}
            </span>
          </motion.div>

          {/* Badges row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primaryOrange text-white">
              <Target className="w-3 h-3" />
              Guide
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${difficulty.bg} ${difficulty.color}`}>
              <TrendingUp className="w-3 h-3" />
              {difficulty.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-lightGray">
              <Clock className="w-3 h-3" />
              {readingTime} Min.
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-darkerGray leading-tight mb-5 max-w-4xl"
          >
            {title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-base md:text-lg text-lightGray leading-relaxed max-w-3xl mb-6"
          >
            {excerpt}
          </motion.p>

          {/* Author + Share row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="flex flex-wrap items-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primaryOrange/20 flex items-center justify-center text-primaryOrange font-bold text-xs">
                BF
              </div>
              <div>
                <span className="text-darkerGray text-xs font-medium">BeAFox Redaktion</span>
                <span className="text-gray-300 mx-2">·</span>
                <span className="text-lightGray text-xs">
                  {post?.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
                    : "2026"}
                </span>
              </div>
            </div>
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 text-xs text-lightGray hover:text-primaryOrange transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
              {copied ? "Kopiert!" : "Link kopieren"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT + SIDEBAR TOC ────────────────────── */}
      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">

            {/* ── LEFT SIDEBAR (TOC) ─── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <GuideTOC items={tocItems} />

                {/* Quick info card */}
                <div className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm">
                  <h4 className="text-xs font-bold text-lightGray uppercase tracking-wide mb-3">
                    Guide-Info
                  </h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-lightGray">Lesezeit</span>
                      <span className="font-semibold text-darkerGray">{readingTime} Min.</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-lightGray">Schritte</span>
                      <span className="font-semibold text-darkerGray">{steps.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-lightGray">Level</span>
                      <span className={`font-semibold ${difficulty.color}`}>{difficulty.label}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-lightGray">Kategorie</span>
                      <Link href={getRatgeberCategoryPath(kategorie)} className="font-semibold text-primaryOrange hover:underline">
                        {category?.navLabel}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* App CTA */}
                <div className="rounded-2xl p-5 text-center border border-primaryOrange/20 bg-primaryOrange/5">
                  <div className="w-12 h-12 rounded-xl bg-primaryOrange/20 flex items-center justify-center mx-auto mb-3">
                    <PawPrint className="w-6 h-6 text-primaryOrange" />
                  </div>
                  <h4 className="text-darkerGray font-bold text-sm mb-2">Direkt umsetzen</h4>
                  <p className="text-lightGray text-xs mb-4 leading-relaxed">
                    Guides, Challenges & KI-Coaching in der App
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
              </div>
            </aside>

            {/* ── MAIN ARTICLE CONTENT ─── */}
            <div className="min-w-0">
              {/* Summary cards row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-primaryOrange" />
                    <span className="text-xs font-bold text-lightGray uppercase tracking-wide">Was du lernst</span>
                  </div>
                  <p className="text-sm text-lightGray leading-relaxed">{excerpt}</p>
                </div>
                <div className="rounded-2xl border border-primaryOrange/15 p-5 bg-primaryOrange/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-primaryOrange" />
                    <span className="text-xs font-bold text-lightGray uppercase tracking-wide">Was du danach kannst</span>
                  </div>
                  <ul className="space-y-1.5">
                    {steps.slice(0, 3).map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-darkerGray">
                        <CheckCircle2 className="w-4 h-4 text-primaryOrange mt-0.5 flex-shrink-0" />
                        {step.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sanity body content (if available) */}
              {hasSanityBody && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="mb-10 portable-text-light"
                >
                  <PortableText blocks={sanityGuide!.body!} />
                </motion.div>
              )}

              {/* Fallback content when no Sanity body */}
              {!hasSanityBody && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="mb-10"
                >
                  <p className="text-base text-lightGray leading-relaxed">
                    {post?.content ?? excerpt}
                  </p>
                </motion.div>
              )}

              {/* ── INTERACTIVE: CALCULATOR ──────────── */}
              {interactive.calculator && (
                <div id="section-calculator">
                  <GuideCalculator
                    title={interactive.calculator.title}
                    description={interactive.calculator.description}
                    fields={interactive.calculator.fields}
                    results={interactive.calculator.results}
                  />
                </div>
              )}

              {/* ── ACTION PLAN (Steps) ──────────────── */}
              <div id="section-action-plan" className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold text-darkerGray mb-6 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primaryOrange/15">
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
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primaryOrange/15 border-2 border-primaryOrange/20 group-hover:border-primaryOrange group-hover:bg-primaryOrange group-hover:text-white text-primaryOrange font-bold text-base flex items-center justify-center transition-all duration-200">
                          {i + 1}
                        </div>
                        {i < steps.length - 1 && (
                          <div className="w-0.5 bg-gray-200 h-full ml-[19px] mt-2" />
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 group-hover:border-primaryOrange/30 transition-all duration-200">
                          <h3 className="font-bold text-darkerGray text-sm md:text-base mb-1">
                            {step.title}
                          </h3>
                          <p className="text-sm text-lightGray leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── INTERACTIVE: CHECKLIST ────────────── */}
              {interactive.checklist && (
                <div id="section-checklist">
                  <GuideChecklist
                    title={interactive.checklist.title}
                    items={interactive.checklist.items}
                  />
                </div>
              )}

              {/* ── INTERACTIVE: QUIZ ────────────────── */}
              {interactive.quiz && (
                <div id="section-quiz">
                  <GuideQuiz
                    title={interactive.quiz.title}
                    questions={interactive.quiz.questions}
                  />
                </div>
              )}

              {/* ── APP CTA (inline) ─────────────────── */}
              <div id="section-app-cta">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="my-10 rounded-2xl overflow-hidden border border-primaryOrange/20 bg-primaryOrange/5"
                >
                  <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primaryOrange/20 flex items-center justify-center">
                      <PawPrint className="w-7 h-7 text-primaryOrange" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-darkerGray font-bold text-lg mb-1">
                        Mit Bea geht&apos;s schneller
                      </h3>
                      <p className="text-lightGray text-sm leading-relaxed">
                        Bea ist dein KI-Begleiter in der BeAFox App — sie führt dich Schritt für Schritt durch diesen Guide, erinnert dich und macht dich handlungsfähig.
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

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-10">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs text-lightGray px-2.5 py-1 rounded-full border border-gray-200 bg-gray-100">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED GUIDES ────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="py-10 md:py-14 bg-primaryWhite">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-darkerGray mb-2">
              Nächste <span className="text-primaryOrange">Missionen</span>
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
                      href={getGuidePostPath(related.categorySlug, related.slug)}
                      className="group flex flex-col h-full rounded-2xl border border-gray-200 p-5 bg-white shadow-sm hover:border-primaryOrange/40 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-primaryOrange bg-primaryOrange/15 px-2.5 py-1 rounded-full">
                          {relCat?.navLabel ?? related.categorySlug}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${relDiff.bg} ${relDiff.color}`}>
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
                        <span className="text-xs text-lightGray flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {related.readingTime} Min.
                        </span>
                        <span className="inline-flex items-center gap-1 text-primaryOrange text-xs font-bold group-hover:gap-2 transition-all">
                          Guide starten <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── ALL CATEGORIES ────────────────────────────────── */}
      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-darkerGray">Alle Guide-Kategorien</h2>
            <Link href="/ratgeber" className="text-primaryOrange text-sm font-semibold hover:underline">
              Alle Ratgeber →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={getRatgeberCategoryPath(c.slug)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-lightGray hover:border-primaryOrange hover:text-primaryOrange text-sm font-medium transition-all duration-200 bg-white"
              >
                <span>{c.emoji}</span>
                {c.navLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
