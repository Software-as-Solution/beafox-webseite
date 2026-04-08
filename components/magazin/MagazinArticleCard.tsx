"use client";

// IMPORTS
import Link from "next/link";
import Image from "next/image";
// ICONS
import { Clock, ArrowRight } from "lucide-react";

// CONSTANTS
const MASCOT_BASE = "/Maskottchen";
const FALLBACK_MASCOT = "Maskottchen-Hero.webp";

// Article type → label + icon mapping
const ARTICLE_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  guide: { label: "Leitfaden", icon: "📖" },
  article: { label: "Artikel", icon: "📄" },
  caseStudy: { label: "Case Study", icon: "📊" },
  whitepaper: { label: "Whitepaper", icon: "📑" },
  template: { label: "Vorlage", icon: "📋" },
};

// TYPES
interface Author {
  name: string;
  slug: string;
}

interface Cluster {
  title: string;
  slug: string;
  icon: string;
  color: string;
}

interface HeroImage {
  asset: { _ref: string; url?: string };
  alt?: string;
}

interface MagazinArticleCardProps {
  article: {
    title: string;
    slug: string;
    cluster: Cluster;
    articleType: string;
    author?: Author;
    excerpt: string;
    heroImage?: HeroImage;
    publishedAt: string;
    readingTime: number;
  };
  href: string;
}

export default function MagazinArticleCard({
  article,
  href,
}: MagazinArticleCardProps) {
  const typeLabel = ARTICLE_TYPE_LABELS[article.articleType];
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "de-DE",
    { day: "2-digit", month: "short", year: "numeric" },
  );

  return (
    <Link
      href={href}
      className="group flex flex-col h-full rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-primaryOrange/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* ─── IMAGE BLOCK ─── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/40">
        {article.heroImage?.asset?.url ? (
          <Image
            src={article.heroImage.asset.url}
            alt={article.heroImage.alt || article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-3/5 h-4/5 group-hover:scale-105 transition-transform duration-500 ease-out">
              <Image
                src={`${MASCOT_BASE}/${FALLBACK_MASCOT}`}
                alt={article.title}
                fill
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 12px 28px rgba(232,119,32,0.25))",
                }}
                sizes="(max-width: 768px) 60vw, (max-width: 1200px) 30vw, 20vw"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── BODY BLOCK ─── */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        {/* Meta Row: Cluster (indigo) + Type (neutral) */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)",
              color: "#6366F1",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#6366F1" }}
            />
            {article.cluster.title}
          </span>

          {typeLabel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-darkerGray border border-gray-200">
              <span aria-hidden="true">{typeLabel.icon}</span>
              {typeLabel.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-3 group-hover:text-primaryOrange transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-lightGray leading-relaxed line-clamp-2 mb-5 flex-1">
          {article.excerpt}
        </p>

        {/* Footer: Reading time + Date + Read more */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-lightGray">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {article.readingTime} Min. Lesezeit
            </span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-primaryOrange opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
            Lesen
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  );
}
