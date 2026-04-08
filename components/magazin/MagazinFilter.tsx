"use client";

// IMPORTS
import { useState, useMemo } from "react";
// CUSTOM COMPONENTS
import MagazinArticleCard from "./MagazinArticleCard";
// ICONS
import { Search, X } from "lucide-react";

// TYPES
interface Cluster {
  _id: string;
  title: string;
  slug: string;
  icon: string;
  color: string;
  articleCount?: number;
}

interface Author {
  name: string;
  slug: string;
  avatar?: {
    asset: { _ref: string; url?: string };
    alt?: string;
  };
}

interface HeroImage {
  asset: { _ref: string; url?: string };
  alt?: string;
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  cluster: {
    title: string;
    slug: string;
    icon: string;
    color: string;
  };
  articleType: string;
  author?: Author;
  excerpt: string;
  heroImage?: HeroImage;
  publishedAt: string;
  readingTime: number;
  tags?: string[];
  featured: boolean;
}

interface MagazinFilterProps {
  clusters: Cluster[];
  articles: Article[];
}

// CONSTANTS
const ALL_FILTER = "alle";

export default function MagazinFilter({
  clusters,
  articles,
}: MagazinFilterProps) {
  // STATES
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // FILTERED ARTICLES
  const filteredArticles = useMemo(() => {
    let result = articles;

    // Filter by cluster
    if (activeFilter !== ALL_FILTER) {
      result = result.filter(
        (article) => article.cluster?.slug === activeFilter,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q),
      );
    }

    return result;
  }, [articles, activeFilter, searchQuery]);

  // ARTICLE COUNTS PER CLUSTER (for badge numbers on pills)
  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((article) => {
      const slug = article.cluster?.slug;
      if (slug) counts[slug] = (counts[slug] || 0) + 1;
    });
    return counts;
  }, [articles]);

  return (
    <div className="w-full">
      {/* ─── SEARCH + FILTER BAR ─── */}
      <div className="mb-10 space-y-5">
        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray pointer-events-none">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Artikel suchen..."
            aria-label="Artikel suchen"
            className="w-full pl-11 pr-11 py-3 rounded-full bg-white border-2 border-gray-200 focus:outline-none focus:border-primaryOrange transition-colors text-darkerGray placeholder:text-lightGray text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Suche zurücksetzen"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-lightGray hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div
          role="tablist"
          aria-label="Artikelkategorien"
          className="flex justify-start md:justify-center overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0"
        >
          <div className="flex md:flex-wrap gap-2 md:gap-3 md:justify-center pb-2 md:pb-0">
            {/* "Alle Beiträge" pill */}
            <FilterPill
              label="Alle Beiträge"
              count={articles.length}
              active={activeFilter === ALL_FILTER}
              onClick={() => setActiveFilter(ALL_FILTER)}
            />

            {/* Cluster pills */}
            {clusters.map((cluster) => (
              <FilterPill
                key={cluster._id}
                label={cluster.title}
                count={clusterCounts[cluster.slug] || 0}
                active={activeFilter === cluster.slug}
                onClick={() => setActiveFilter(cluster.slug)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── ARTICLE GRID ─── */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredArticles.map((article) => (
            <MagazinArticleCard
              key={article._id}
              article={article}
              href={`/magazin/${article.cluster?.slug || "artikel"}/${article.slug}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          searchQuery={searchQuery}
          onReset={() => {
            setActiveFilter(ALL_FILTER);
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════

interface FilterPillProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function FilterPill({ label, count, active, onClick }: FilterPillProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
        active
          ? "bg-primaryOrange text-white shadow-sm shadow-primaryOrange/25"
          : "bg-white border border-gray-200 text-darkerGray hover:border-primaryOrange/40 hover:text-primaryOrange"
      }`}
    >
      <span>{label}</span>
      <span
        className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold tabular-nums transition-colors ${
          active
            ? "bg-white/25 text-white"
            : "bg-gray-100 text-lightGray group-hover:bg-primaryOrange/10 group-hover:text-primaryOrange"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

interface EmptyStateProps {
  searchQuery: string;
  onReset: () => void;
}

function EmptyState({ searchQuery, onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "rgba(232,119,32,0.08)",
          border: "1px solid rgba(232,119,32,0.18)",
        }}
      >
        <Search className="w-7 h-7 text-primaryOrange" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-darkerGray mb-2">
        Keine Artikel gefunden
      </h3>
      <p className="text-sm text-lightGray max-w-md mb-5">
        {searchQuery
          ? `Wir konnten keine Artikel zu "${searchQuery}" finden. Versuche einen anderen Suchbegriff oder eine andere Kategorie.`
          : "In dieser Kategorie gibt es noch keine Artikel."}
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primaryOrange text-white font-semibold text-sm hover:bg-primaryOrange/90 transition-all"
      >
        Filter zurücksetzen
      </button>
    </div>
  );
}
