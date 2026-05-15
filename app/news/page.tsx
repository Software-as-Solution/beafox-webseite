"use client";

import { useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import {
  getAllNewsPosts,
  getNewsCategory,
  formatNewsDate,
  type NewsPost,
} from "@/lib/news-posts";

const DemoBookingCtaSection = dynamic(
  () => import("@/components/DemoBookingCtaSection"),
);

const BOTTOM_CTA_STYLE = {
  boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
  border: "1px solid rgba(232,119,32,0.15)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
} as const;

function getRotationClass(rotation?: NewsPost["imageRotation"]): string {
  switch (rotation) {
    case "cw90":
      return "rotate-90";
    case "ccw90":
      return "-rotate-90";
    case "rotate180":
      return "rotate-180";
    default:
      return "";
  }
}

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
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          loading={index < 3 ? "eager" : "lazy"}
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            getRotationClass(post.imageRotation)
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3">
          <span
            className="inline-flex items-center rounded-full border border-white/20 bg-primaryOrange px-3 py-1.5 text-[11px] font-bold text-white shadow-sm"
          >
            {cat.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-center gap-3 text-[11px] text-lightGray">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatNewsDate(post.publishedAt)}
          </span>
        </div>

        <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-darkerGray transition-colors group-hover:text-primaryOrange md:text-xl">
          {post.title}
        </h3>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-lightGray">
          {post.excerpt}
        </p>

      </div>
    </motion.article>
  );
}

function FeaturedCard({
  post,
  latestBadgeLabel,
}: {
  post: NewsPost;
  latestBadgeLabel: string;
}) {
  const cat = getNewsCategory(post.category);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative mb-12 grid overflow-hidden rounded-3xl border border-gray-200 bg-white md:mb-16 md:grid-cols-2"
    >
      <div className="relative aspect-[16/10] w-full md:aspect-auto md:min-h-[420px]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          loading="eager"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            getRotationClass(post.imageRotation)
          }`}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primaryOrange px-3 py-1.5 text-xs font-bold text-white shadow-md">
            {latestBadgeLabel}
          </span>
          <span
            className="inline-flex items-center rounded-full border border-white/20 bg-primaryOrange px-3 py-1.5 text-xs font-bold text-white shadow-sm"
          >
            {cat.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-lightGray">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNewsDate(post.publishedAt)}
          </span>
        </div>

        <h2 className="mb-4 text-2xl font-bold leading-tight text-darkerGray transition-colors group-hover:text-primaryOrange md:text-3xl lg:text-4xl">
          {post.title}
        </h2>

        <p className="mb-6 text-base leading-relaxed text-lightGray md:text-lg">
          {post.excerpt}
        </p>

      </div>
    </motion.article>
  );
}

export default function NewsPage() {
  const t = useTranslations("news");

  const allPosts = useMemo(() => getAllNewsPosts(), []);

  const featured = allPosts[0];
  const restPosts = allPosts.slice(1);

  return (
    <>
      <LandingHero
        badge={t("hero.badge")}
        mascotAlt={t("hero.badge")}
        mascotSrc="/Maskottchen/Maskottchen-News.webp"
        contentClassName="md:left-[10%]"
        mascotClassName="relative right-[12%] sm:right-[16%] md:top-8"
        description={t("hero.description")}
        title={
          <>
            {t("hero.titlePre")}{" "}
            <span className="text-primaryOrange">{t("hero.titleHighlight")}</span>
          </>
        }
      />

      <Section
        id="news-list"
        className="bg-gray-50 py-8 md:py-12 lg:py-16"
      >
        {featured && (
          <FeaturedCard
            post={featured}
            latestBadgeLabel={t("list.latestBadge")}
          />
        )}

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
              {t("list.moreNews")}
            </h2>
          </motion.div>
        )}

        {restPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restPosts.map((post, i) => (
              <NewsCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : allPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-sm text-lightGray">{t("emptyCategory")}</p>
          </div>
        ) : null}
      </Section>

      <Section className="bg-gray-50 py-10 md:py-14">
        <motion.div
          style={BOTTOM_CTA_STYLE}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 md:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <div className="min-w-0 flex-1">
              <h3 className="mb-2 text-xl font-bold text-darkerGray md:text-2xl">
                {t("bottomCta.title")}
              </h3>
              <p className="text-sm leading-relaxed text-lightGray md:text-base">
                {t("bottomCta.text")}
              </p>
            </div>
            <div className="flex shrink-0 justify-center md:justify-end">
              <Image
                alt={t("bottomCta.mascotAlt")}
                width={200}
                height={200}
                src="/Maskottchen/Maskottchen-Hero.webp"
                className="h-32 w-32 object-contain md:h-36 md:w-36"
                style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.08))" }}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
            <Button
              href="/magazin"
              variant="primary"
              className="inline-flex items-center justify-center gap-2 !px-6 !py-2.5 md:!px-8 md:!py-3"
            >
              {t("bottomCta.magazin")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              href="/updates"
              variant="outline"
              className="inline-flex items-center justify-center gap-2 !px-6 !py-2.5 md:!px-8 md:!py-3"
            >
              {t("bottomCta.updates")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
      </Section>

      <DemoBookingCtaSection />
    </>
  );
}
