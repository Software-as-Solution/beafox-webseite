"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import Image from "next/image";
import { PawPrint, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BlogPage() {
  const t = useTranslations("blog");

  type BlogPost = {
    id: number;
    title: string;
    description: string;
    image: string;
    date?: string;
    category?: string;
  };

  const specialMoments = (t.raw("specialMoments") as BlogPost[]) ?? [];
  const allArticles = (t.raw("articles") as BlogPost[]) ?? [];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6">
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">{t("hero.badge")}</span>
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-6"
          >
            {t("hero.title.pre")}{" "}
            <span className="text-primaryOrange">{t("hero.title.highlight")}</span>{" "}
            {t("hero.title.post")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </Section>

      {/* Unsere besonderen Momente Section */}
      <Section className="bg-white py-2 md:py-4 lg:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              {t("specialMomentsSection.title.pre")}{" "}
              <span className="text-primaryOrange">
                {t("specialMomentsSection.title.highlight")}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto">
              {t("specialMomentsSection.subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {specialMoments.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-2 border-primaryOrange rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-primaryOrange bg-primaryOrange/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-lightGray text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-darkerGray mb-3">
                    {post.title}
                  </h3>
                  <p className="text-lightGray text-sm leading-relaxed flex-1 mb-4">
                    {post.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Alle unsere Artikel Section */}
      <Section className="bg-primaryWhite py-2 md:py-4 lg:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4">
              {t("allArticlesSection.title.pre")}{" "}
              <span className="text-primaryOrange">
                {t("allArticlesSection.title.highlight")}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto">
              {t("allArticlesSection.subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-2 border-primaryOrange rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={
                      article.title ||
                      t("allArticlesSection.imageAltFallback", { id: article.id })
                    }
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {(article.category || article.date) && (
                    <div className="flex items-center gap-3 mb-3">
                      {article.category && (
                        <span className="text-xs font-semibold text-primaryOrange bg-primaryOrange/10 px-3 py-1 rounded-full">
                          {article.category}
                        </span>
                      )}
                      {article.date && (
                        <div className="flex items-center gap-1 text-lightGray text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {article.title && (
                    <h3 className="text-xl font-bold text-darkerGray mb-3">
                      {article.title}
                    </h3>
                  )}
                  {article.description && (
                    <p className="text-lightGray text-sm leading-relaxed flex-1 mb-4">
                      {article.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
