"use client";

// IMPORTS
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useMemo, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
// ICONS
import { ChevronDown, RotateCcw, Star } from "lucide-react";
// DATA
import { getCalculatorBySlug } from "@/lib/calculators";

// TYPES
interface CalculatorWidgetProps {
  slug: string;
}
type ResultItem = {
  label: string;
  value: string;
  highlight: boolean;
};
type ResultSection = {
  title?: string;
  items: ResultItem[];
};
// CONSTANTS
const APP_DOWNLOAD_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PERCENT_PATTERN = /in\s*%|anteil|effektivzins|p\.a\.|sparquote/i;
const RESULTS_GRADIENT =
  "linear-gradient(165deg, #FFFFFF 0%, #FFFAF5 50%, #FFF4EB 100%)";
const BG_TEXTURE =
  "radial-gradient(circle at 20% 50%, rgba(232,119,32,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,119,32,0.03) 0%, transparent 50%)";
const DECORATIVE_GLOW =
  "radial-gradient(circle, rgba(232,119,32,0.08) 0%, transparent 70%)";
const HERO_EASING = [0.16, 1, 0.3, 1] as const;
// HELPER FUNCTIONS
/** Deterministic German number formatter — safe for SSR hydration */
function formatDE(n: number): string {
  const fixed = Math.abs(n).toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 ? "-" : "") + withDots + "," + decPart;
}
function fmtDE(v: unknown): string {
  if (typeof v === "string") {
    const num = parseFloat(v);
    return isNaN(num) ? v : formatDE(num);
  }
  if (typeof v === "number") return isNaN(v) ? "–" : formatDE(v);
  return String(v);
}
/** Parse a user-typed string supporting both German (comma) and English (dot) decimal separators */
function parseUserNumber(raw: string, fallback: number): number {
  if (!raw) return fallback;
  const normalized = raw.replace(",", ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? fallback : parsed;
}
/** Build the suffix for a result value based on its label */
function getResultSuffix(label: string, isText: boolean): string {
  if (isText) return "";
  return PERCENT_PATTERN.test(label) ? " %" : " €";
}

export default function CalculatorWidget({ slug }: CalculatorWidgetProps) {
  // HOOKS
  const reducedMotion = useReducedMotion();
  const t = useTranslations("finanzrechner");
  // QUERIES
  const calculator = getCalculatorBySlug(slug);
  // STATES
  const initialRawValues = useMemo(() => {
    const initial: Record<string, string> = {};
    calculator?.fields.forEach((f) => {
      initial[f.id] = String(f.defaultValue);
    });
    return initial;
  }, [calculator]);
  const [rawValues, setRawValues] =
    useState<Record<string, string>>(initialRawValues);
  // CONSTANTS
  const numericValues = useMemo(() => {
    const result: Record<string, number> = {};
    if (!calculator) return result;
    for (const field of calculator.fields) {
      result[field.id] = parseUserNumber(
        rawValues[field.id] ?? "",
        field.defaultValue,
      );
    }
    return result;
  }, [rawValues, calculator]);
  const resultSections = useMemo<ResultSection[]>(() => {
    if (!calculator) return [];

    let computed: Record<string, unknown> | null = null;
    try {
      computed = calculator.computeAll
        ? calculator.computeAll(numericValues)
        : null;
    } catch (error) {
      console.error(
        `[CalculatorWidget] computeAll failed for "${slug}":`,
        error,
      );
    }

    const sections: ResultSection[] = [];
    let current: ResultSection = { items: [] };

    for (const result of calculator.results) {
      if (result.isSectionHeader) {
        if (current.items.length > 0 || current.title) sections.push(current);
        current = { title: result.label, items: [] };
        continue;
      }

      let value = "–";
      if (computed && result.key) {
        const raw = computed[result.key];
        const isText = typeof raw === "string" && isNaN(parseFloat(raw));
        const suffix = getResultSuffix(result.label, isText);
        value = isText ? (raw as string) : fmtDE(raw) + suffix;
      }

      current.items.push({
        label: result.label,
        value,
        highlight: result.highlight ?? false,
      });
    }

    if (current.items.length > 0 || current.title) sections.push(current);
    return sections;
  }, [numericValues, calculator, slug]);
  const { heroResult, sectionsWithoutHero } = useMemo(() => {
    let hero: ResultItem | null = null;
    for (const section of resultSections) {
      const found = section.items.find((item) => item.highlight);
      if (found) {
        hero = found;
        break;
      }
    }
    if (!hero) hero = resultSections[0]?.items[0] ?? null;

    const filtered = resultSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item !== hero),
      }))
      .filter((section) => section.items.length > 0);

    return { heroResult: hero, sectionsWithoutHero: filtered };
  }, [resultSections]);
  const cardAnimation = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: HERO_EASING },
      };
  // FUNCTIONS
  const updateValue = useCallback((id: string, raw: string) => {
    setRawValues((prev) => ({ ...prev, [id]: raw }));
  }, []);
  const resetValues = useCallback(() => {
    setRawValues(initialRawValues);
  }, [initialRawValues]);
  // EARLY RETURN
  if (!calculator) return null;

  return (
    <section
      aria-label={t("detail.inputsTitle")}
      className="bg-gray-50 py-10 md:py-16 lg:py-20 relative"
    >
      {/* Background texture */}
      <div
        aria-hidden="true"
        style={{ backgroundImage: BG_TEXTURE }}
        className="absolute inset-0 pointer-events-none opacity-30"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          {...cardAnimation}
          className="rounded-3xl bg-white shadow-xl shadow-black/[0.04] border border-gray-100 overflow-hidden"
        >
          <div className="grid lg:grid-cols-[5fr_6fr]">
            {/* ─── INPUTS ─── */}
            <div className="p-6 md:p-8 lg:border-r lg:border-gray-100">
              <header className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-darkerGray">
                  {t("detail.inputsTitle")}
                </h2>
                <button
                  type="button"
                  onClick={resetValues}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-lightGray hover:text-primaryOrange hover:bg-primaryOrange/5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  {t("detail.resetButton")}
                </button>
              </header>
              <div className="space-y-6">
                {calculator.fields.map((field) => (
                  <CalculatorField
                    field={field}
                    key={field.id}
                    onChange={updateValue}
                    rawValue={rawValues[field.id] ?? ""}
                    numericValue={numericValues[field.id] ?? field.defaultValue}
                  />
                ))}
              </div>
            </div>
            {/* ─── RESULTS ─── */}
            <div
              className="p-6 md:p-8 relative"
              style={{ background: RESULTS_GRADIENT }}
            >
              <div
                aria-hidden="true"
                style={{ background: DECORATIVE_GLOW }}
                className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
              />
              <div className="relative" aria-live="polite" aria-atomic="false">
                {/* HERO RESULT */}
                {heroResult && (
                  <motion.div
                    className="mb-10"
                    key={heroResult.value}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: HERO_EASING }}
                    initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        aria-hidden="true"
                        className="w-1 h-5 rounded-full bg-primaryOrange"
                      />
                      <p className="text-xs font-bold text-primaryOrange uppercase tracking-widest">
                        {heroResult.label}
                      </p>
                    </div>
                    <p className="text-5xl md:text-6xl lg:text-7xl font-black text-darkerGray tabular-nums leading-none">
                      {heroResult.value}
                    </p>
                  </motion.div>
                )}
                {/* DETAIL SECTIONS */}
                <div className="space-y-6">
                  {sectionsWithoutHero.map((section, sIdx) => (
                    <ResultSectionGroup key={sIdx} section={section} />
                  ))}
                </div>
                {/* INLINE CTA — App Store Card Style */}
                <div className="mt-8 pt-6 border-t border-primaryOrange/15">
                  <p className="text-sm text-darkerGray mb-4 leading-relaxed">
                    <span className="font-bold block mb-0.5">
                      {t("detail.resultCta.title")}
                    </span>
                    {t("detail.resultCta.description")}
                  </p>
                  <a
                    target="_blank"
                    href={APP_DOWNLOAD_URL}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-2xl bg-white/70 hover:bg-white border border-primaryOrange/15 hover:border-primaryOrange/30 transition-all focus:outline-none focus:ring-2 focus:ring-primaryOrange/40 focus:ring-offset-2"
                  >
                    {/* App Icon */}
                    <div className="w-14 h-14 rounded-xl bg-white border border-primaryOrange/15 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image
                        width={56}
                        height={56}
                        aria-hidden="true"
                        alt="BeAFox App Icon"
                        src="/assets/Logos/Logo.png"
                        className="object-contain w-10 h-10"
                      />
                    </div>
                    {/* Title + Rating */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-darkerGray truncate">
                        BeAFox: Finanzen durchgespielt
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div
                          className="flex items-center gap-0.5"
                          aria-hidden="true"
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-primaryOrange text-primaryOrange"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-lightGray">
                          5.0
                        </span>
                      </div>
                    </div>
                    {/* CTA Button */}
                    <span className="px-5 py-2 bg-primaryOrange text-white rounded-full font-bold text-sm group-hover:bg-primaryOrange/90 transition-colors flex-shrink-0">
                      Laden
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// SUBCOMPONENTS
interface CalculatorFieldProps {
  rawValue: string;
  numericValue: number;
  onChange: (id: string, raw: string) => void;
  field: NonNullable<ReturnType<typeof getCalculatorBySlug>>["fields"][number];
}
function CalculatorField({
  field,
  rawValue,
  numericValue,
  onChange,
}: CalculatorFieldProps) {
  // SELECT
  if (field.type === "select" && field.options) {
    return (
      <div>
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-darkerGray mb-2"
        >
          {field.label}
        </label>
        <div className="relative">
          <select
            id={field.id}
            value={rawValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-darkerGray font-medium focus:outline-none focus:border-primaryOrange focus:bg-white focus:ring-2 focus:ring-primaryOrange/10 transition-all text-sm appearance-none cursor-pointer hover:border-gray-300"
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lightGray pointer-events-none"
          />
        </div>
      </div>
    );
  }
  // CONSTANTS
  const hasRange = field.min !== undefined && field.max !== undefined;
  const pct = hasRange
    ? Math.max(
        0,
        Math.min(
          100,
          ((numericValue - (field.min as number)) /
            ((field.max as number) - (field.min as number))) *
            100,
        ),
      )
    : null;

  return (
    <div>
      <label
        htmlFor={field.id}
        className="block text-sm font-medium text-darkerGray mb-2"
      >
        {field.label}
      </label>

      <div className="relative">
        <input
          type="text"
          id={field.id}
          value={rawValue}
          inputMode="decimal"
          onChange={(e) => onChange(field.id, e.target.value)}
          className="w-full px-4 py-3 pr-14 rounded-xl border border-gray-200 bg-gray-50/50 text-darkerGray font-medium focus:outline-none focus:border-primaryOrange focus:bg-white focus:ring-2 focus:ring-primaryOrange/10 transition-all text-sm tabular-nums hover:border-gray-300"
        />
        {field.suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-lightGray pointer-events-none">
            {field.suffix}
          </span>
        )}
      </div>

      {pct !== null && (
        <div
          className="mt-2 h-0.5 rounded-full bg-gray-100 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-primaryOrange/60 transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface ResultSectionGroupProps {
  section: ResultSection;
}
function ResultSectionGroup({ section }: ResultSectionGroupProps) {
  return (
    <div>
      {section.title && (
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-bold text-darkerGray">{section.title}</h3>
          <div className="flex-1 h-px bg-primaryOrange/15" aria-hidden="true" />
        </div>
      )}
      <div className="rounded-xl bg-white/60 border border-primaryOrange/10 overflow-hidden">
        {section.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-baseline justify-between gap-4 px-4 py-3 border-b border-primaryOrange/8 last:border-b-0"
          >
            <p className="text-sm text-darkerGray flex-1 min-w-0">
              {item.label}
            </p>
            <p
              className={`font-semibold tabular-nums whitespace-nowrap text-sm ${
                item.highlight ? "text-primaryOrange" : "text-darkerGray"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
