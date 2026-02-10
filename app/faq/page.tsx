"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  MessageCircle,
  Search,
  Sparkles,
  HelpCircle,
  Tag,
  School,
  Briefcase,
  Smartphone,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Infinity,
  Mail,
} from "lucide-react";

const CATEGORY_IDS = ["all", "general", "pricing", "schoolsBusiness", "tech", "support"] as const;

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  categoryId: string;
  popular?: boolean;
}

export default function FAQPage() {
  const t = useTranslations("faq");
  const [openId, setOpenId] = useState<number | null>(null);
  const [openPopularId, setOpenPopularId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqs: FAQItem[] = (t.raw("items") as FAQItem[]) ?? [];
  const quickLinks = (t.raw("quickLinks.links") as { title: string; description: string; href: string }[]) ?? [];
  const quickLinkIcons = [Briefcase, Infinity, School, Mail];

  const categories = CATEGORY_IDS.map((id) => ({
    id,
    label: t(`categories.${id}`),
  }));

  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.categoryId === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [faqs, selectedCategory, searchQuery]);

  const popularFAQs = faqs.filter((faq) => faq.popular);

  return (
    <>
      {/* Hero */}
      <Section className="bg-primaryWhite pt-14 md:pt-16 lg:pt-20 mt-12">
        <div className="text-center mb-6 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-darkerGray">
              {t("hero.tag")}
            </h1>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkerGray mb-4"
          >
            {t("hero.title")} <span className="text-primaryOrange">{t("hero.brand")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-lightGray max-w-3xl mx-auto"
          >
            {t("hero.description")}
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lightGray" />
            <input
              type="text"
              placeholder={t("hero.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-primaryOrange/20 focus:border-primaryOrange focus:outline-none text-darkerGray placeholder-lightGray"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-primaryOrange text-primaryWhite border-2 border-primaryOrange"
                    : "bg-white text-darkerGray border-2 border-primaryOrange/20 hover:border-primaryOrange/40"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Popular FAQs */}
      {selectedCategory === "all" && searchQuery === "" && (
        <Section className="bg-white py-0 md:py-2 lg:py-2 relative bottom-2 pt-0 md:pt-6 lg:pt-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-darkerGray mb-2">
                {t("popular.title")}
              </h3>
              <p className="text-lightGray">
                {t("popular.subtitle")}
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {popularFAQs.slice(0, 4).map((faq, index) => {
                const isOpen = openPopularId === faq.id;
                const handleToggle = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isOpen) {
                    setOpenPopularId(null);
                  } else {
                    setOpenPopularId(faq.id);
                  }
                };
                return (
                  <motion.div
                    key={`popular-${faq.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-primaryOrange/10 to-primaryOrange/5 rounded-xl p-5 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all"
                  >
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="w-full text-left cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-primaryOrange" />
                            <span className="text-xs font-semibold text-primaryOrange">
                              {t("popular.badge")}
                            </span>
                          </div>
                          <h4 className="font-semibold text-darkerGray mb-2">
                            {faq.question}
                          </h4>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm text-lightGray mt-2 overflow-hidden"
                              >
                                {faq.answer}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-primaryOrange flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* FAQ Items */}
      <Section className="bg-primaryWhite py-4 md:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => {
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-xl overflow-hidden border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-sm"
                  >
                    <button
                      onClick={() =>
                        setOpenId(openId === faq.id ? null : faq.id)
                      }
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primaryOrange/5 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <HelpCircle className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-darkerGray pr-4 text-left">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-primaryOrange flex-shrink-0 transition-transform ${
                          openId === faq.id ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 text-lightGray border-t border-primaryOrange/20 bg-primaryOrange/5">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="w-16 h-16 text-primaryOrange/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-darkerGray mb-2">
                {t("noResults.title")}
              </h3>
              <p className="text-lightGray mb-6">
                {t("noResults.text")}
              </p>
              <Button href="/kontakt" variant="primary">
                {t("noResults.cta")}
              </Button>
            </motion.div>
          )}
        </div>
      </Section>

      {/* Quick Links */}
      <Section className="bg-white py-8 md:py-12 lg:py-16 pt-6 md:pt-0 lg:pt-0">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-darkerGray mb-0 lg:mb-4">
              {t("quickLinks.title")}
            </h3>
            <p className="text-lightGray">
              {t("quickLinks.subtitle")}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = quickLinkIcons[index];
              return (
                <motion.a
                  key={index}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl p-6 border-2 border-primaryOrange/20 hover:border-primaryOrange/40 transition-all shadow-sm group h-full flex flex-col"
                >
                  <div className="bg-primaryOrange/10 text-primaryOrange rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h4 className="text-lg font-bold text-darkerGray mb-2">
                    {link.title}
                  </h4>
                  <p className="text-sm text-lightGray mb-3 flex-1">
                    {link.description}
                  </p>
                  <div className="flex items-center gap-2 text-primaryOrange text-sm font-semibold mt-auto">
                    {t("quickLinks.learnMore")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-gradient-to-br from-primaryOrange via-primaryOrange to-primaryOrange/90 py-8 md:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <MessageCircle className="w-16 h-16 text-primaryWhite mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primaryWhite"
          >
            {t("contactCta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl mb-8 text-primaryWhite/90"
          >
            {t("contactCta.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          >
            <Button
              href="/kontakt"
              variant="secondary"
              className="flex items-center justify-center gap-2 !px-6 !py-3 md:!px-8 md:!py-4 !bg-primaryWhite hover:!bg-primaryWhite/90 !text-primaryOrange !border-primaryWhite"
            >
              {t("contactCta.cta")}
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
