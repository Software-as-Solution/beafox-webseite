"use client";

// STANDARD
import Link from "next/link";
import Image from "next/image";
// IMPORTS
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// ICONS
import { Clock, ArrowRight, BookOpen } from "lucide-react";

// TYPES
interface MagazinArticle {
  _id: string;
  title: string;
  slug: string;
  cluster: { title: string; slug: string; icon: string; color: string };
  articleType: string;
  author?: { name: string; slug: string };
  excerpt: string;
  heroImage?: { asset: { _ref: string; url?: string }; alt?: string };
  publishedAt: string;
  readingTime: number;
  featured: boolean;
}

// ─── Component ───
export default function MagazinPreview() {
  const [articles, setArticles] = useState<MagazinArticle[]>([]);

  useEffect(() => {
    fetch("/api/magazin-preview")
      .then((r) => r.json())
      .then((data) => setArticles(data.articles || []))
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-primaryOrange font-semibold text-sm tracking-wide uppercase mb-2 block">
              Beas Magazin
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-darkerGray">
              Insights für{" "}
              <span className="text-primaryOrange">Praxis-Profis</span>
            </h2>
          </div>
          <Link
            href="/magazin"
            className="hidden sm:flex items-center gap-2 text-primaryOrange font-semibold hover:text-primaryOrange/80 transition-colors"
          >
            Alle Artikel
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article, index) => {
            const href = `/magazin/${article.cluster?.slug || "artikel"}/${article.slug}`;
            const date = new Date(article.publishedAt).toLocaleDateString(
              "de-DE",
              { day: "2-digit", month: "long", year: "numeric" }
            );

            return (
              <motion.div
                key={article._id}
                viewport={{ once: true }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={href} className="group block h-full">
                  <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-full flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    {/* Image Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                      <div className="w-16 h-16 rounded-full bg-primaryOrange/10 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-primaryOrange/50" />
                      </div>
                      {/* Cluster Badge */}
                      <span className="absolute top-3 right-3 bg-primaryOrange/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {article.cluster?.title}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-darkerGray mb-2 group-hover:text-primaryOrange transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-lightGray mb-4 flex-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-lightGray">
                        <span className="font-medium text-darkerGray">
                          BeAFox Redaktion
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readingTime} Min
                        </div>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{date}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/magazin"
            className="inline-flex items-center gap-2 text-primaryOrange font-semibold"
          >
            Alle Artikel anzeigen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
