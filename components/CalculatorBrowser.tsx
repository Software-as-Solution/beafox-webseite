"use client";

// STANDARD COMPONENTS
import Link from "next/link";
// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useMemo, useCallback, useRef } from "react";
// ICONS
import { Search, X, ArrowRight, Calculator } from "lucide-react";
// DATA
import { CALCULATORS, CALCULATOR_CATEGORIES } from "@/lib/calculators";

// CONSTANTS
const STAGGER_DELAY_CAP = 0.3;
const ALL_CATEGORY_EMOJI = "✨";
const ALL_CATEGORY_LABEL = "Alle";

export default function CalculatorBrowser() {
  // HOOKS
  const t = useTranslations("finanzrechner");
  // STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_LABEL);
  // REFS
  const searchRef = useRef<HTMLInputElement>(null);
  // FUNCTIONS
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    searchRef.current?.focus();
  }, []);
  const selectCategory = useCallback((label: string) => {
    setSelectedCategory(label);
  }, []);
  const resetAll = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(ALL_CATEGORY_LABEL);
  }, []);
  // CONSTANTS
  const categoriesWithCount = useMemo(
    () => [
      {
        label: ALL_CATEGORY_LABEL,
        emoji: ALL_CATEGORY_EMOJI,
        count: CALCULATORS.length,
      },
      ...CALCULATOR_CATEGORIES.map((cat) => ({
        ...cat,
        count: CALCULATORS.filter((c) => c.category === cat.label).length,
      })),
    ],
    [],
  );
  const filteredCalculators = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return CALCULATORS.filter((calc) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORY_LABEL ||
        calc.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        calc.title.toLowerCase().includes(query) ||
        calc.excerpt.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedCategory]);
  const firstRowCategories = categoriesWithCount.slice(0, 4);
  const secondRowCategories = categoriesWithCount.slice(4);

  return (
    <>
      {/* ─── SEARCH ─── */}
      <div className="relative max-w-xl mx-auto mb-6">
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lightGray pointer-events-none"
        />
        <input
          type="search"
          name="search"
          ref={searchRef}
          value={searchQuery}
          onChange={handleSearch}
          aria-label={t("search.placeholder")}
          placeholder={t("search.placeholder")}
          className="w-full pl-12 pr-10 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-darkerGray placeholder-lightGray focus:outline-none focus:border-primaryOrange focus:ring-2 focus:ring-primaryOrange/20 transition-all text-sm md:text-base"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label={t("search.clearAria")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-lightGray hover:text-darkerGray hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {/* ─── CATEGORY PILLS ─── */}
      <div
        role="tablist"
        className="mb-8 md:mb-10 space-y-2"
        aria-label={t("search.categoriesLabel")}
      >
        <div className="flex flex-wrap gap-2 justify-center">
          {firstRowCategories.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <button
                role="tab"
                type="button"
                key={cat.label}
                aria-selected={isActive}
                onClick={() => selectCategory(cat.label)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primaryOrange text-white shadow-md shadow-primaryOrange/20"
                    : "bg-white text-darkerGray hover:bg-primaryOrange/5 hover:text-primaryOrange border border-gray-200"
                }`}
              >
                <span aria-hidden="true">{cat.emoji}</span>
                {cat.label}
                <span
                  className={`ml-0.5 text-xs font-bold ${isActive ? "text-white/80" : "text-lightGray"}`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {secondRowCategories.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <button
                role="tab"
                type="button"
                key={cat.label}
                aria-selected={isActive}
                onClick={() => selectCategory(cat.label)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primaryOrange text-white shadow-md shadow-primaryOrange/20"
                    : "bg-white text-darkerGray hover:bg-primaryOrange/5 hover:text-primaryOrange border border-gray-200"
                }`}
              >
                <span aria-hidden="true">{cat.emoji}</span>
                {cat.label}
                <span
                  className={`ml-0.5 text-xs font-bold ${isActive ? "text-white/80" : "text-lightGray"}`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* ─── GRID / EMPTY STATE ─── */}
      {filteredCalculators.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Calculator className="w-7 h-7 text-lightGray" aria-hidden="true" />
          </div>
          <p className="text-sm text-lightGray max-w-sm">
            {t("grid.emptyState")}
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="text-sm font-semibold text-primaryOrange hover:underline"
          >
            {t("grid.resetFilters")}
          </button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredCalculators.map((calc, index) => (
            <motion.div
              key={calc.slug}
              viewport={{ once: true }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.04, STAGGER_DELAY_CAP),
              }}
            >
              <Link
                href={`/finanzrechner/${calc.slug}`}
                className="flex flex-col h-full rounded-2xl bg-white border border-gray-200 hover:border-primaryOrange/30 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <div className="p-5 md:p-6 flex items-start justify-between gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(232,119,32,0.08)",
                      border: "1px solid rgba(232,119,32,0.12)",
                    }}
                  >
                    <span
                      className="text-2xl md:text-[1.75rem] leading-none"
                      aria-hidden="true"
                    >
                      {calc.categoryEmoji}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-lightGray bg-gray-100 rounded-full px-2.5 py-1 flex-shrink-0">
                    {calc.category}
                  </span>
                </div>
                <div className="px-5 md:px-6 pb-4 md:pb-5 flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-darkerGray mb-2 group-hover:text-primaryOrange transition-colors leading-snug">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-lightGray leading-relaxed flex-1 line-clamp-3">
                    {calc.excerpt}
                  </p>
                </div>
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-primaryOrange">
                      {t("grid.openCalculator")}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primaryOrange/10 flex items-center justify-center group-hover:bg-primaryOrange transition-colors">
                      <ArrowRight
                        className="w-4 h-4 text-primaryOrange group-hover:text-white transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
