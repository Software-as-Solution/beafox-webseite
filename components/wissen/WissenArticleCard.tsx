"use client";

import Link from "next/link";
import { ARTICLE_TYPE_LABELS, CLUSTER_COLORS } from "@/lib/wissen";

export interface WissenArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  clusterTitle: string;
  clusterSlug: string;
  clusterIcon: string;
  clusterColor: string;
  articleType: string;
  authorName?: string;
  readingTime: number;
  publishedAt: string;
  featured?: boolean;
  size?: "default" | "large";
}

export default function WissenArticleCard({
  title,
  slug,
  excerpt,
  clusterTitle,
  clusterSlug,
  clusterIcon,
  clusterColor,
  articleType,
  authorName,
  readingTime,
  publishedAt,
  featured = false,
  size = "default",
}: WissenArticleCardProps) {
  // Get article type label and icon
  const typeConfig = ARTICLE_TYPE_LABELS[articleType] ?? { label: articleType, icon: "📄" };

  // Get cluster color classes
  const colorConfig = CLUSTER_COLORS[clusterColor] ?? CLUSTER_COLORS.blue;

  // Format date to German locale
  const formattedDate = new Date(publishedAt).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Determine layout classes based on size
  const isLarge = size === "large";
  const imageHeight = isLarge ? "h-56" : "h-40";
  const excerptClamp = isLarge ? "line-clamp-3" : "line-clamp-2";

  return (
    <Link href={`/wissen/${slug}`}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col">
        {/* Image placeholder */}
        <div className={`${imageHeight} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden`}>
          {/* TODO: Replace with actual image when available */}
          <span className="text-4xl">{clusterIcon}</span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {/* Cluster badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorConfig.bgLight} ${colorConfig.text}`}
            >
              <span>{clusterIcon}</span>
              <span>{clusterTitle}</span>
            </span>

            {/* Article type badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <span>{typeConfig.icon}</span>
              <span>{typeConfig.label}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-darkerGray line-clamp-2 mb-2">
            {title}
          </h3>

          {/* Excerpt */}
          <p className={`text-sm text-lightGray ${excerptClamp} mb-3 flex-1`}>
            {excerpt}
          </p>

          {/* Footer: metadata */}
          <div className="flex items-center gap-1.5 text-xs text-lightGray pt-3 border-t border-gray-100">
            {authorName && (
              <>
                <span>{authorName}</span>
                <span>·</span>
              </>
            )}
            <span>{readingTime} Min.</span>
            <span>·</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
