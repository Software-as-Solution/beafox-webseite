"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import Section from "@/components/Section";
import LandingHero from "@/components/LandingHero";
import RatgeberSection from "@/components/RatGeber";
import TrustSignalBar from "@/components/TrustSignalBar";
import StructuredData from "@/components/StructuredData";
import DemoBookingCtaSection from "@/components/DemoBookingCtaSection";
import ContentShowcaseSection from "@/components/ContentShowcaseSection";
import FaqAccordion, { type FaqAccordionItem } from "@/components/FaqAccordion";
// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useMemo, useCallback } from "react";
// ICONS
import { Search, CheckCircle2, MessageCircle } from "lucide-react";

// TYPES
interface FAQItem extends FaqAccordionItem {
  popular?: boolean;
  categoryId: string;
}
// CONSTANTS
const CATEGORY_IDS = [
  "all",
  "general",
  "pricing",
  "schoolsBusiness",
  "tech",
  "support",
] as const;
const CONTACT_CTA_STYLE = {
  boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
  border: "1px solid rgba(232,119,32,0.15)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 60%, #FFF2E8 100%)",
} as const;
export default function FAQPage() {
  // HOOKS
  const t = useTranslations("faq");
  // STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  // FUNCTIONS
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [],
  );
  const handleCategoryClick = useCallback(
    (id: string) => setSelectedCategory(id),
    [],
  );
  const scrollToFaqList = useCallback(() => {
    document
      .getElementById("faq-search")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  // CONSTANTS
  const faqs: FAQItem[] = useMemo(
    () => (t.raw("items") as FAQItem[]) ?? [],
    [t],
  );
  const categories = useMemo(
    () => CATEGORY_IDS.map((id) => ({ id, label: t(`categories.${id}`) })),
    [t],
  );
  const filteredFAQs: FaqAccordionItem[] = useMemo(() => {
    let filtered: FAQItem[] = faqs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.categoryId === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [faqs, selectedCategory, searchQuery]);
  const faqStructuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.slice(0, 10).map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }),
    [faqs],
  );

  return (
    <>
      {/* ─── 1. HERO ─── */}
      <LandingHero
        badge={t("hero.tag")}
        cardIcon={CheckCircle2}
        mascotAlt={t("hero.tag")}
        mascotClassName="scale-90 md:top-2"
        cardTitle={t("popular.title")}
        cardText={t("popular.subtitle")}
        mascotSrc="/Maskottchen/Maskottchen-Herzen.png"
        title={
          <>
            {t("hero.title")}{" "}
            <span className="text-primaryOrange">{t("hero.brand")}</span>
          </>
        }
        actions={
          <>
            <Button
              onClick={scrollToFaqList}
              variant="primary"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Search
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("hero.searchPlaceholder")}
            </Button>
            <Button
              href="/kontakt"
              variant="outline"
              className="flex items-center justify-center gap-1.5 md:gap-2 w-full sm:w-auto !px-5 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <MessageCircle
                aria-hidden="true"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              {t("contactCta.cta")}
            </Button>
          </>
        }
      />
      {/* ─── 2. TRUST SIGNAL ─── */}
      <TrustSignalBar />
      {/* ─── 3. SEARCH + FILTER + FAQ LIST ─── */}
      <Section
        id="faq-search"
        className="bg-primaryWhite py-8 md:py-12 lg:py-16"
      >
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <motion.div
            className="mb-6"
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lightGray"
              />
              <input
                type="search"
                value={searchQuery}
                aria-label="FAQ durchsuchen"
                onChange={handleSearchChange}
                placeholder={t("hero.searchPlaceholder")}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-primaryOrange/20 focus:border-primaryOrange focus:outline-none text-darkerGray placeholder-lightGray bg-white transition-colors"
              />
            </div>
          </motion.div>
          {/* Category Filter */}
          <motion.div
            className="mb-8"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              role="tablist"
              aria-label="FAQ Kategorien"
              className="flex flex-wrap gap-2 justify-center"
            >
              {categories.map((category) => (
                <button
                  role="tab"
                  key={category.id}
                  aria-selected={selectedCategory === category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category.id
                      ? "bg-primaryOrange text-primaryWhite"
                      : "bg-white text-darkerGray border border-gray-200 hover:border-primaryOrange/30"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
          {/* FAQ List */}
          {filteredFAQs.length > 0 ? (
            <FaqAccordion items={filteredFAQs} className="max-w-4xl" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Image
                alt=""
                width={120}
                height={120}
                aria-hidden="true"
                src="/Maskottchen/Maskottchen-Hero.png"
                className="object-contain w-24 h-24 mx-auto mb-4"
                style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))" }}
              />
              <h3 className="text-xl font-bold text-darkerGray mb-2">
                {t("noResults.title")}
              </h3>
              <p className="text-lightGray mb-6 text-sm">
                {t("noResults.text")}
              </p>
              <Button
                href="/kontakt"
                variant="primary"
                className="flex items-center justify-center gap-2 mx-auto !px-6 !py-2.5"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                {t("noResults.cta")}
              </Button>
            </motion.div>
          )}
        </div>
      </Section>
      {/* ─── 4. QUICK LINKS ─── */}
      <ContentShowcaseSection
        sectionClassName="bg-gray-50"
        innerClassName="max-w-6xl mx-auto"
        sectionHeaderProps={{
          preTitle: t("quickLinks.title"),
        }}
      >
        <RatgeberSection variant="faqProducts" />
      </ContentShowcaseSection>
      {/* ─── 5. NOCH FRAGEN ─── */}
      <Section className="bg-primaryWhite py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-1 sm:px-0">
          <motion.div
            style={CONTACT_CTA_STYLE}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl p-6 md:p-10"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 lg:gap-10">
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-xl md:text-2xl font-bold text-darkerGray mb-2 md:mb-3">
                  {t("contactCta.title")}
                </h3>
                <p className="text-sm md:text-base text-lightGray leading-relaxed">
                  {t("contactCta.text")}
                </p>
              </div>
              <div className="flex justify-center md:justify-end shrink-0">
                <Image
                  alt=""
                  width={260}
                  height={260}
                  loading="lazy"
                  aria-hidden="true"
                  src="/Maskottchen/Maskottchen-Hero.png"
                  className="object-contain w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 scale-150"
                  style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.08))" }}
                />
              </div>
            </div>
            <div className="flex justify-center mt-8 md:mt-10">
              <Button
                href="/kontakt"
                variant="primary"
                className="flex items-center justify-center gap-2 !px-6 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                {t("contactCta.cta")}
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
      {/* ─── 6. CTA ─── */}
      <DemoBookingCtaSection />
      {/* STRUCTURED DATA */}
      <StructuredData id="faq" data={faqStructuredData} />
    </>
  );
}
