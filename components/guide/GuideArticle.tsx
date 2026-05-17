"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import Section from "@/components/Section";
import PortableText from "@/components/PortableText";
import RatgeberSection from "@/components/RatGeber";
import GuideChecklist from "@/components/guide/GuideChecklist";
import GuideTOC, { type TOCItem } from "@/components/guide/GuideTOC";
// IMPORTS
import { motion } from "framer-motion";
import { Fragment, useMemo, useState, useEffect, useCallback } from "react";
import { getCategoryBySlug, getRatgeberCategoryPath } from "@/lib/blog";
import {
  type GuideFull,
  type GuideSource,
  type GuideVisual,
  type GuideInteractive,
  type GuideSummary,
  type GuideComparisonTable,
} from "@/lib/sanity-fetch";
// ICONS
import {
  Zap,
  Info,
  Clock,
  Link2,
  Calendar,
  ChevronUp,
  Sparkles,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  GripVertical,
  MessageCircle,
  Check,
} from "lucide-react";

// TYPES
interface GuideArticleProps {
  guide: GuideFull;
  kategorie: string;
  slug: string;
}

// CONSTANTS
const APP_STORE_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.beafox";

const CATEGORY_MASCOTS: Record<string, string> = {
  "schueler": "/Maskottchen/Maskottchen-Freude.webp",
  "azubis": "/Maskottchen/Maskottchen-Azubi.webp",
  "studenten": "/Maskottchen/Maskottchen-Studenten.webp",
  "berufseinsteiger":
    "/Maskottchen/Maskottchen-Berufseinsteiger.webp",
  "lebenssituationen":
    "/Maskottchen/Maskottchen-Lebenssituationen.webp",
  "investieren": "/Maskottchen/Maskottchen-Investieren.webp",
};

const GUIDE_CARD_CLASS =
  "relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_10px_34px_-22px_rgba(17,24,39,0.28)]";
const GUIDE_CARD_INNER_CLASS =
  "px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10";
const GUIDE_EYEBROW_CLASS =
  "text-[11px] font-bold uppercase tracking-[0.12em] text-primaryOrange";
const GUIDE_ACCENT_BAR_CLASS =
  "pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primaryOrange via-primaryOrange/65 to-primaryOrange/10";

const GUIDE_CALLOUT_CONFIG = {
  info: {
    Icon: Info,
    label: "Hinweis",
    card: "border-[#BFDBFE] bg-[#EFF6FF]",
    iconColor: "text-[#2563EB]",
    labelColor: "text-[#1D4ED8]",
  },
  tip: {
    Icon: Lightbulb,
    label: "Tipp",
    card: "border-primaryOrange/30 bg-primaryOrange/5",
    iconColor: "text-primaryOrange",
    labelColor: "text-darkOrange",
  },
} as const;

// STYLE CONSTANTS
const ORANGE_GRADIENT = "linear-gradient(135deg, #F5944B 0%, #E87720 100%)";
const HERO_BG_BLOB_STYLE = {
  background: "radial-gradient(circle, #E87720, transparent 70%)",
} as const;
const HERO_MASCOT_GLOW_STYLE = {
  background:
    "radial-gradient(ellipse 80% 70% at 50% 30%, rgba(232,119,32,0.12), transparent 65%)",
} as const;
const QUICK_ANSWER_STYLE = {
  background:
    "radial-gradient(circle at 0% 0%, rgba(232,119,32,0.10), transparent 55%), #FFFDFB",
} as const;
const BEA_BLOCK_STYLE = {
  background:
    "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.16), transparent 55%), " +
    ORANGE_GRADIENT,
} as const;
const APP_CTA_STYLE = {
  background:
    "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.18), transparent 55%), " +
    ORANGE_GRADIENT,
} as const;
const STORE_BUTTON_STYLE = {
  boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.4)",
} as const;

// HELPERS FUNCTIONS
function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Opens Bea AI in a new tab, pre-filled with the given context prompt. */
function openBeaWithContext(context: string) {
  const ctx = encodeURIComponent(context);
  window.open(`/bea-ai?context=${ctx}`, "_blank", "noopener,noreferrer");
}

// SUBCOMPONENTS
interface StoreButtonProps {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
}
function StoreButton({ href, label, imageSrc, imageAlt }: StoreButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={STORE_BUTTON_STYLE}
      className="group flex flex-1 items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 transition-all duration-300 hover:scale-[1.04]"
    >
      <Image
        width={160}
        height={52}
        src={imageSrc}
        alt={imageAlt}
        className="h-auto w-[36px] shrink-0 object-contain"
      />
      <span className="text-left text-sm font-black leading-tight text-darkerGray md:text-base">
        {label}
      </span>
    </a>
  );
}

interface FragBeaButtonProps {
  label: string;
  context: string;
  variant?: "solid" | "ghost";
}
function FragBeaButton({ label, context, variant = "solid" }: FragBeaButtonProps) {
  const isSolid = variant === "solid";
  return (
    <button
      type="button"
      onClick={() => openBeaWithContext(context)}
      className={
        isSolid
          ? "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primaryOrange to-[#E87720] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_-4px_rgba(232,119,32,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-4px_rgba(232,119,32,0.55)] active:translate-y-0"
          : "group inline-flex items-center gap-2 rounded-full border border-primaryOrange/30 bg-primaryOrange/5 px-4 py-2.5 text-[14px] font-semibold text-darkOrange transition-all duration-200 hover:border-primaryOrange/50 hover:bg-primaryOrange/10"
      }
    >
      <Sparkles
        className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-12"
        aria-hidden="true"
      />
      <span className="text-left">{label}</span>
      <ArrowRight
        className="h-3.5 w-3.5 shrink-0 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        aria-hidden="true"
      />
    </button>
  );
}

interface MatchBlockProps {
  title: string;
  instruction?: string;
  pairs: { left: string; right: string }[];
}
function MatchBlock({ title, instruction, pairs }: MatchBlockProps) {
  // STATES
  // Server- und erster Client-Render zeigen die unsortierte Reihenfolge —
  // gemischt wird erst nach dem Mount, sonst gibt es einen Hydration-Mismatch.
  const [shuffledRight, setShuffledRight] = useState(() =>
    pairs.map((p) => p.right),
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [correctPairs, setCorrectPairs] = useState<Map<number, number>>(
    new Map(),
  );
  const [wrongLeft, setWrongLeft] = useState<number | null>(null);
  // FUNCTIONS
  useEffect(() => {
    setShuffledRight(shuffleArray(pairs.map((p) => p.right)));
  }, [pairs]);
  // CONSTANTS
  const completed = correctPairs.size === pairs.length;
  // FUNCTIONS
  const handleLeft = (i: number) => {
    if (correctPairs.has(i)) return;
    setSelectedLeft(i === selectedLeft ? null : i);
    setWrongLeft(null);
  };
  const handleRight = (rightIdx: number) => {
    if (selectedLeft === null) return;
    const alreadyMatched = [...correctPairs.values()].includes(rightIdx);
    if (alreadyMatched) return;
    if (shuffledRight[rightIdx] === pairs[selectedLeft].right) {
      setCorrectPairs((prev) => new Map(prev).set(selectedLeft, rightIdx));
      setSelectedLeft(null);
    } else {
      setWrongLeft(selectedLeft);
      setTimeout(() => {
        setWrongLeft(null);
        setSelectedLeft(null);
      }, 700);
    }
  };
  const leftStyle = (i: number) => {
    if (correctPairs.has(i))
      return "border-green-300 bg-green-50 text-green-800 cursor-default";
    if (wrongLeft === i) return "border-red-300 bg-red-50 text-red-700";
    if (selectedLeft === i)
      return "border-primaryOrange bg-primaryOrange/8 text-darkerGray ring-2 ring-primaryOrange/25";
    return "border-gray-200 bg-white text-darkerGray hover:border-primaryOrange/50 cursor-pointer";
  };
  const rightStyle = (idx: number) => {
    const matched = [...correctPairs.values()].includes(idx);
    if (matched)
      return "border-green-300 bg-green-50 text-green-800 opacity-70 cursor-default";
    if (selectedLeft !== null && !matched)
      return "border-gray-200 bg-white text-darkerGray hover:border-primaryOrange/60 hover:bg-primaryOrange/5 cursor-pointer";
    return "border-gray-200 bg-white/70 text-gray-400 cursor-default";
  };

  return (
    <div className="my-3 rounded-[22px] border border-primaryOrange/20 bg-gradient-to-br from-[#FFF8EF] to-white p-4 sm:p-6 shadow-[0_8px_26px_-20px_rgba(232,119,32,0.35)]">
      <div className="mb-5">
        <span className="inline-block rounded-full bg-primaryOrange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primaryOrange">
          Zuordnungsübung
        </span>
        <p className="mt-2 text-[17px] font-bold leading-snug text-darkerGray">
          {title}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-lightGray">
          {instruction ??
            "Klick erst einen Begriff links an, dann die passende Erklärung rechts."}
        </p>
      </div>
      {completed ? (
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 px-5 py-4">
          <span className="text-xl" aria-hidden="true">
            🎉
          </span>
          <span className="text-[15px] font-semibold text-green-800">
            Perfekt! Du hast alle Begriffe richtig zugeordnet.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2.5">
            {pairs.map((pair, i) => (
              <button
                key={i}
                onClick={() => handleLeft(i)}
                disabled={correctPairs.has(i)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-[14px] font-semibold leading-snug transition-all duration-150 ${leftStyle(i)}`}
              >
                {correctPairs.has(i) && <span className="mr-1">✓ </span>}
                {pair.left}
              </button>
            ))}
          </div>
          <div className="space-y-2.5">
            {shuffledRight.map((item, idx) => {
              const matched = [...correctPairs.values()].includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleRight(idx)}
                  disabled={matched || selectedLeft === null}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-[14px] font-medium leading-snug transition-all duration-150 ${rightStyle(idx)}`}
                >
                  {matched && <span className="mr-1">✓ </span>}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface InlineQuizBlockProps {
  question: string;
  explanation: string;
  options: { label: string; correct?: boolean }[];
}
function InlineQuizBlock({ question, explanation, options }: InlineQuizBlockProps) {
  // STATES
  const [selected, setSelected] = useState<number | null>(null);
  // CONSTANTS
  const isCorrect = selected !== null && !!options[selected].correct;
  // FUNCTIONS
  const optStyle = (i: number) => {
    if (selected === null)
      return "border-blue-100 bg-white text-darkerGray hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer";
    if (options[i].correct)
      return "border-green-300 bg-green-50 text-green-800 font-semibold";
    if (i === selected) return "border-red-300 bg-red-50 text-red-700";
    return "border-gray-100 bg-white text-gray-400 opacity-60";
  };

  return (
    <div className="my-3 rounded-[22px] border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-4 sm:p-6 shadow-[0_8px_26px_-20px_rgba(37,99,235,0.28)]">
      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">
        Kurze Frage
      </span>
      <p className="mt-2 mb-4 text-[17px] font-bold leading-snug text-darkerGray">
        {question}
      </p>
      <div className="space-y-2.5">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selected === null && setSelected(i)}
            className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] leading-snug transition-all duration-150 ${optStyle(i)}`}
          >
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-bold">
              {selected === null
                ? String.fromCharCode(65 + i)
                : options[i].correct
                  ? "✓"
                  : i === selected
                    ? "✗"
                    : String.fromCharCode(65 + i)}
            </span>
            {opt.label}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div
          className={`mt-4 rounded-2xl px-5 py-4 text-[15px] leading-relaxed ${isCorrect ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}
        >
          <span className="font-semibold">
            {isCorrect ? "✓ Richtig! " : "Nicht ganz. "}
          </span>
          {explanation}
        </div>
      )}
    </div>
  );
}

interface InputCalcBlockProps {
  question: string;
  hint?: string;
  answer: number;
  suffix?: string;
  tolerance?: number;
}
function InputCalcBlock({
  question,
  hint,
  answer,
  suffix = "€",
  tolerance = 50,
}: InputCalcBlockProps) {
  // STATES
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // CONSTANTS
  const parsed = parseFloat(value.replace(/\./g, "").replace(",", "."));
  const isCorrect =
    submitted && !isNaN(parsed) && Math.abs(parsed - answer) <= tolerance;
  // FUNCTIONS
  const handleSubmit = () => {
    if (value.trim()) setSubmitted(true);
  };

  return (
    <div className="my-3 rounded-[22px] border border-violet-100 bg-gradient-to-br from-violet-50/50 to-white p-4 sm:p-6 shadow-[0_8px_26px_-20px_rgba(124,58,237,0.28)]">
      <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-violet-600">
        Rechne selbst
      </span>
      <p className="mt-2 mb-1 text-[17px] font-bold leading-snug text-darkerGray">
        {question}
      </p>
      {hint && (
        <p className="mb-4 text-[14px] leading-relaxed text-lightGray">{hint}</p>
      )}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSubmitted(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={`Dein Ergebnis in ${suffix}`}
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-darkerGray placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <button
          onClick={handleSubmit}
          className="rounded-2xl bg-violet-500 px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-violet-600 active:scale-95"
        >
          Prüfen
        </button>
      </div>
      {submitted && (
        <div
          className={`mt-4 rounded-2xl px-5 py-4 text-[15px] leading-relaxed ${isCorrect ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}
        >
          {isCorrect ? (
            <>
              <span className="font-semibold">✓ Korrekt!</span>{" "}
              {answer.toLocaleString("de-DE")} {suffix}. Gut gerechnet.
            </>
          ) : (
            <>
              <span className="font-semibold">Nicht ganz.</span> Die richtige
              Antwort ist{" "}
              <span className="font-bold">
                {answer.toLocaleString("de-DE")} {suffix}
              </span>
              . Schau nochmal auf die Zahlen im Text.
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface EstimateSliderBlockProps {
  question: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  explanation: string;
  correctValue: number;
}
function EstimateSliderBlock({
  question,
  min,
  max,
  step = 1,
  unit,
  explanation,
  correctValue,
}: EstimateSliderBlockProps) {
  // STATES
  const [value, setValue] = useState(() => Math.round((min + max) / 2));
  const [revealed, setRevealed] = useState(false);
  // CONSTANTS
  const span = max - min || 1;
  const off = Math.abs(value - correctValue);
  const accuracy = Math.max(0, Math.round((1 - off / span) * 100));
  const unitLabel = unit ? ` ${unit}` : "";

  return (
    <div className="my-3 rounded-[22px] border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-4 sm:p-6 shadow-[0_8px_26px_-20px_rgba(13,148,136,0.3)]">
      <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-teal-700">
        Schätz-Slider
      </span>
      <p className="mb-4 mt-2 text-[17px] font-bold leading-snug text-darkerGray">
        {question}
      </p>
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
        <p className="mb-3 text-center">
          <span className="text-[28px] font-bold text-teal-700">
            {value.toLocaleString("de-DE")}
          </span>
          <span className="text-[16px] font-semibold text-teal-700">
            {unitLabel}
          </span>
        </p>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={revealed}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Deine Schätzung"
          className="w-full accent-teal-600"
        />
        <div className="mt-1 flex justify-between text-[12px] text-gray-400">
          <span>
            {min.toLocaleString("de-DE")}
            {unitLabel}
          </span>
          <span>
            {max.toLocaleString("de-DE")}
            {unitLabel}
          </span>
        </div>
      </div>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-4 w-full rounded-2xl bg-teal-600 px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-teal-700 active:scale-95"
        >
          Auflösen
        </button>
      ) : (
        <div className="mt-4 rounded-2xl bg-teal-50 px-5 py-4 text-[15px] leading-relaxed text-teal-900">
          <span className="font-semibold">
            Tatsächlich: {correctValue.toLocaleString("de-DE")}
            {unitLabel}.
          </span>{" "}
          Deine Schätzung lag {off.toLocaleString("de-DE")}
          {unitLabel} daneben ({accuracy}% Treffer).
          <span className="mt-2 block text-teal-800">{explanation}</span>
        </div>
      )}
    </div>
  );
}

interface RankingBlockProps {
  title: string;
  instruction?: string;
  explanation?: string;
  items: { label: string }[];
}
function RankingBlock({
  title,
  instruction,
  explanation,
  items,
}: RankingBlockProps) {
  // STATES
  // Initial unsortiert (SSR-stabil) — gemischt wird erst nach dem Mount.
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  // CONSTANTS
  const allCorrect = checked && order.every((itemIdx, pos) => itemIdx === pos);
  // FUNCTIONS
  useEffect(() => {
    setOrder(shuffleArray(items.map((_, i) => i)));
  }, [items]);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setChecked(false);
  };
  const handleDrop = (to: number) => {
    if (dragIndex !== null) move(dragIndex, to);
    setDragIndex(null);
  };

  return (
    <div className="my-3 rounded-[22px] border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-4 sm:p-6 shadow-[0_8px_26px_-20px_rgba(79,70,229,0.28)]">
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-600">
        Reihenfolge
      </span>
      <p className="mt-2 text-[17px] font-bold leading-snug text-darkerGray">
        {title}
      </p>
      <p className="mb-4 mt-1 text-[14px] leading-relaxed text-lightGray">
        {instruction ?? "Zieh die Einträge in die richtige Reihenfolge."}
      </p>
      <div className="space-y-2.5">
        {order.map((itemIdx, pos) => {
          const correctHere = checked && itemIdx === pos;
          const wrongHere = checked && itemIdx !== pos;
          return (
            <div
              key={itemIdx}
              draggable={!checked}
              onDragStart={() => setDragIndex(pos)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(pos)}
              onDragEnd={() => setDragIndex(null)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-150 ${
                correctHere
                  ? "border-green-300 bg-green-50"
                  : wrongHere
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white"
              } ${checked ? "" : "cursor-grab active:cursor-grabbing"} ${
                dragIndex === pos ? "opacity-50" : ""
              }`}
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[12px] font-bold text-indigo-700">
                {pos + 1}
              </span>
              <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-darkerGray">
                {items[itemIdx].label}
              </span>
              {!checked && (
                <span className="flex flex-shrink-0 flex-col">
                  <button
                    type="button"
                    aria-label="Nach oben"
                    onClick={() => move(pos, pos - 1)}
                    className="text-gray-300 transition-colors hover:text-indigo-600"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Nach unten"
                    onClick={() => move(pos, pos + 1)}
                    className="text-gray-300 transition-colors hover:text-indigo-600"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              )}
              {!checked && (
                <GripVertical
                  className="h-4 w-4 flex-shrink-0 text-gray-300"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <button
          onClick={() => setChecked(true)}
          className="mt-4 w-full rounded-2xl bg-indigo-600 px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
        >
          Reihenfolge prüfen
        </button>
      ) : (
        <div
          className={`mt-4 rounded-2xl px-5 py-4 text-[15px] leading-relaxed ${
            allCorrect
              ? "bg-green-50 text-green-800"
              : "bg-amber-50 text-amber-900"
          }`}
        >
          <span className="font-semibold">
            {allCorrect ? "✓ Perfekt sortiert! " : "Noch nicht ganz. "}
          </span>
          {!allCorrect && (
            <button
              onClick={() => setChecked(false)}
              className="font-semibold text-indigo-700 underline"
            >
              Nochmal versuchen
            </button>
          )}
          {explanation && <span className="mt-2 block">{explanation}</span>}
        </div>
      )}
    </div>
  );
}

interface ThisOrThatBlockProps {
  question: string;
  correct: "a" | "b";
  explanation: string;
  optionA: { label: string; description?: string };
  optionB: { label: string; description?: string };
}
function ThisOrThatBlock({
  question,
  correct,
  explanation,
  optionA,
  optionB,
}: ThisOrThatBlockProps) {
  // STATES
  const [picked, setPicked] = useState<"a" | "b" | null>(null);
  // CONSTANTS
  const isCorrect = picked !== null && picked === correct;
  // FUNCTIONS
  const cardStyle = (cardKey: "a" | "b") => {
    if (picked === null)
      return "border-gray-200 bg-white hover:border-rose-300 hover:bg-rose-50/40 cursor-pointer";
    if (cardKey === correct) return "border-green-300 bg-green-50 cursor-default";
    if (cardKey === picked) return "border-red-300 bg-red-50 cursor-default";
    return "border-gray-100 bg-white opacity-60 cursor-default";
  };

  return (
    <div className="my-3 rounded-[22px] border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white p-4 sm:p-6 shadow-[0_8px_26px_-20px_rgba(225,29,72,0.25)]">
      <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-rose-600">
        Das oder das?
      </span>
      <p className="mb-4 mt-2 text-[17px] font-bold leading-snug text-darkerGray">
        {question}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(
          [
            ["a", optionA],
            ["b", optionB],
          ] as const
        ).map(([cardKey, opt]) => (
          <button
            key={cardKey}
            disabled={picked !== null}
            onClick={() => picked === null && setPicked(cardKey)}
            className={`rounded-2xl border px-4 py-4 text-left transition-all duration-150 ${cardStyle(cardKey)}`}
          >
            <span className="block text-[15px] font-bold leading-snug text-darkerGray">
              {opt.label}
            </span>
            {opt.description && (
              <span className="mt-1 block text-[13px] leading-snug text-lightGray">
                {opt.description}
              </span>
            )}
            {picked !== null && cardKey === correct && (
              <span className="mt-2 inline-block text-[12px] font-bold text-green-700">
                ✓ Richtig
              </span>
            )}
            {picked === cardKey && cardKey !== correct && (
              <span className="mt-2 inline-block text-[12px] font-bold text-red-600">
                ✗ Deine Wahl
              </span>
            )}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div
          className={`mt-4 rounded-2xl px-5 py-4 text-[15px] leading-relaxed ${
            isCorrect ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"
          }`}
        >
          <span className="font-semibold">
            {isCorrect ? "✓ Richtig! " : "Nicht ganz. "}
          </span>
          {explanation}
        </div>
      )}
    </div>
  );
}

interface DidYouKnowBlockProps {
  teaser: string;
  fact: string;
}
function DidYouKnowBlock({ teaser, fact }: DidYouKnowBlockProps) {
  // STATES
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="my-3 rounded-[22px] border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-4 sm:p-6 shadow-[0_8px_26px_-20px_rgba(217,119,6,0.3)]">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
        <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
        Wusstest du schon?
      </span>
      <p className="mt-3 text-[17px] font-bold leading-snug text-darkerGray">
        {teaser}
      </p>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-4 w-full rounded-2xl border border-amber-300 bg-white px-6 py-3 text-[14px] font-bold text-amber-700 transition-all hover:bg-amber-50 active:scale-95"
        >
          Aufdecken
        </button>
      ) : (
        <div className="mt-4 rounded-2xl bg-amber-100/70 px-5 py-4 text-[15px] leading-relaxed text-amber-900">
          {fact}
        </div>
      )}
    </div>
  );
}

interface CostBarChartProps {
  heading: string;
  bars: {
    label: string;
    value: number;
    suffix?: string;
    highlight?: boolean;
  }[];
}
function CostBarChart({ heading, bars }: CostBarChartProps) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div className="rounded-[22px] border border-gray-200/80 bg-white p-4 sm:p-5 md:p-6">
      <p className="mb-4 text-[15px] font-bold text-darkerGray">{heading}</p>
      <div className="space-y-3.5">
        {bars.map((bar, i) => {
          const pct = Math.max(4, Math.round((bar.value / max) * 100));
          return (
            <div key={i}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
                <span className="font-medium text-darkerGray">
                  {bar.label}
                </span>
                <span
                  className={`tabular-nums font-bold ${
                    bar.highlight ? "text-primaryOrange" : "text-lightGray"
                  }`}
                >
                  {bar.value.toLocaleString("de-DE")}
                  {bar.suffix ? ` ${bar.suffix}` : ""}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-full rounded-full ${
                    bar.highlight
                      ? "bg-gradient-to-r from-primaryOrange to-[#E87720]"
                      : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TimelineBlockProps {
  heading?: string;
  steps: { label: string; detail?: string }[];
}
function TimelineBlock({ heading, steps }: TimelineBlockProps) {
  return (
    <div className="rounded-[22px] border border-gray-200/80 bg-white p-4 sm:p-5 md:p-6">
      {heading && (
        <p className="mb-4 text-[15px] font-bold text-darkerGray">{heading}</p>
      )}
      <ol className="space-y-1">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={i} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primaryOrange text-[12px] font-bold text-white">
                  {i + 1}
                </span>
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="my-1 w-[2px] flex-1 rounded-full bg-primaryOrange/20"
                  />
                )}
              </div>
              <div className={isLast ? "" : "pb-3"}>
                <p className="text-[14px] font-semibold leading-snug text-darkerGray">
                  {step.label}
                </p>
                {step.detail && (
                  <p className="mt-0.5 text-[13px] leading-snug text-lightGray">
                    {step.detail}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface StatHighlightProps {
  heading?: string;
  stats: { value: string; label: string }[];
}
function StatHighlight({ heading, stats }: StatHighlightProps) {
  const gridClass =
    stats.length === 1
      ? "grid-cols-1"
      : stats.length >= 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2";
  return (
    <div className="rounded-[22px] border border-primaryOrange/20 bg-gradient-to-br from-[#FFF8EF] to-white p-4 sm:p-5 md:p-6">
      {heading && (
        <p className="mb-4 text-[15px] font-bold text-darkerGray">{heading}</p>
      )}
      <div className={`grid gap-4 ${gridClass}`}>
        {stats.map((stat, i) => (
          <div key={i}>
            <p className="text-[26px] font-bold leading-none text-primaryOrange md:text-[30px]">
              {stat.value}
            </p>
            <p className="mt-1.5 text-[13px] leading-snug text-lightGray">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FigureImageProps {
  src: string;
  alt: string;
  caption?: string;
}
function FigureImage({ src, alt, caption }: FigureImageProps) {
  return (
    <figure className="overflow-hidden rounded-[22px] border border-gray-200/80 bg-white">
      <div className="relative aspect-[16/9] w-full">
        <Image
          fill
          src={src}
          alt={alt}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 680px"
        />
      </div>
      {caption && (
        <figcaption className="px-5 py-3 text-[13px] text-lightGray">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ChapterVisual({ visual }: { visual: GuideVisual }) {
  if (visual._type === "costBarChart") {
    return <CostBarChart heading={visual.heading} bars={visual.bars} />;
  }
  if (visual._type === "timeline") {
    return <TimelineBlock heading={visual.heading} steps={visual.steps} />;
  }
  if (visual._type === "statHighlight") {
    return <StatHighlight heading={visual.heading} stats={visual.stats} />;
  }
  if (visual._type === "figureImage") {
    return (
      <FigureImage
        src={visual.src}
        alt={visual.alt}
        caption={visual.caption}
      />
    );
  }
  return null;
}

function ChapterInteractive({ interactive }: { interactive: GuideInteractive }) {
  if (interactive._type === "matchPairs") {
    return (
      <MatchBlock
        title={interactive.title}
        instruction={interactive.instruction}
        pairs={interactive.pairs}
      />
    );
  }
  if (interactive._type === "inlineQuiz") {
    return (
      <InlineQuizBlock
        question={interactive.question}
        options={interactive.options}
        explanation={interactive.explanation}
      />
    );
  }
  if (interactive._type === "inputCalc") {
    return (
      <InputCalcBlock
        question={interactive.question}
        hint={interactive.hint}
        answer={interactive.answer}
        suffix={interactive.suffix}
        tolerance={interactive.tolerance}
      />
    );
  }
  if (interactive._type === "miniChecklist") {
    return (
      <div className="my-3">
        <GuideChecklist
          title={interactive.title}
          items={interactive.items.map((item, i) => ({
            id: `check-${i}`,
            label: item.label,
            hint: item.hint,
          }))}
        />
      </div>
    );
  }
  if (interactive._type === "estimateSlider") {
    return (
      <EstimateSliderBlock
        question={interactive.question}
        min={interactive.min}
        max={interactive.max}
        step={interactive.step}
        unit={interactive.unit}
        explanation={interactive.explanation}
        correctValue={interactive.correctValue}
      />
    );
  }
  if (interactive._type === "rankingExercise") {
    return (
      <RankingBlock
        title={interactive.title}
        instruction={interactive.instruction}
        explanation={interactive.explanation}
        items={interactive.items}
      />
    );
  }
  if (interactive._type === "thisOrThat") {
    return (
      <ThisOrThatBlock
        question={interactive.question}
        correct={interactive.correct}
        explanation={interactive.explanation}
        optionA={interactive.optionA}
        optionB={interactive.optionB}
      />
    );
  }
  if (interactive._type === "didYouKnow") {
    return (
      <DidYouKnowBlock teaser={interactive.teaser} fact={interactive.fact} />
    );
  }
  return null;
}


interface FaqAccordionProps {
  items: { question: string; answer: string }[];
}
function FaqAccordion({ items }: FaqAccordionProps) {
  // STATES
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-[16px] font-semibold leading-snug text-darkerGray">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-primaryOrange transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-[15px] leading-[1.8] text-[#374151]">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface GuideCalloutProps {
  kind: "info" | "tip";
  text: string;
}
function GuideCallout({ kind, text }: GuideCalloutProps) {
  // CONSTANTS
  const cfg = GUIDE_CALLOUT_CONFIG[kind];
  const { Icon } = cfg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className={`rounded-[20px] border p-4 sm:p-5 md:p-6 ${cfg.card}`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <p
          className={`text-xs font-bold uppercase leading-none tracking-wide ${cfg.labelColor}`}
        >
          {cfg.label}
        </p>
        <span className={`inline-flex shrink-0 items-center ${cfg.iconColor}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="text-[16px] leading-[1.8] text-[#374151] md:text-[17px]">
        {text}
      </p>
    </motion.div>
  );
}

interface ComparisonTableBlockProps {
  table: GuideComparisonTable;
}
function ComparisonTableBlock({ table }: ComparisonTableBlockProps) {
  return (
    <motion.section
      id="vergleich"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`${GUIDE_CARD_CLASS} mt-8 scroll-mt-28 md:mt-10`}
    >
      <div aria-hidden="true" className={GUIDE_ACCENT_BAR_CLASS} />
      <div className={GUIDE_CARD_INNER_CLASS}>
        <p className={GUIDE_EYEBROW_CLASS}>Direktvergleich</p>
        <h2 className="mb-5 mt-2 text-[24px] font-bold leading-[1.18] tracking-[-0.02em] text-darkerGray md:text-[30px]">
          {table.heading}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr>
                {table.columns.map((col, i) => (
                  <th
                    key={i}
                    className={`border-b-2 border-primaryOrange/30 px-3 py-2.5 font-bold text-darkerGray ${
                      i === 0 ? "" : "text-center"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-gray-100 last:border-0"
                >
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-3 py-2.5 align-top ${
                        ci === 0
                          ? "font-semibold text-darkerGray"
                          : "text-center text-lightGray"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}

interface SummaryBoxBlockProps {
  heading: string;
  points: string[];
}
function SummaryBoxBlock({ heading, points }: SummaryBoxBlockProps) {
  return (
    <motion.section
      id="fazit"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`${GUIDE_CARD_CLASS} mt-8 scroll-mt-28 md:mt-10`}
    >
      <div aria-hidden="true" className={GUIDE_ACCENT_BAR_CLASS} />
      <div className={GUIDE_CARD_INNER_CLASS}>
        <p className={GUIDE_EYEBROW_CLASS}>Auf einen Blick</p>
        <h2 className="mb-5 mt-2 text-[24px] font-bold leading-[1.18] tracking-[-0.02em] text-darkerGray md:text-[30px]">
          {heading}
        </h2>
        <ul className="space-y-3">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primaryOrange/15 ring-1 ring-primaryOrange/25">
                <Check
                  className="h-3.5 w-3.5 text-primaryOrange"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>
              <span className="text-[15px] leading-[1.7] text-[#374151]">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

function GuideSummaryBlock({ summary }: { summary: GuideSummary }) {
  if (summary._type === "comparisonTable") {
    return <ComparisonTableBlock table={summary} />;
  }
  return <SummaryBoxBlock heading={summary.heading} points={summary.points} />;
}

interface SourcesListProps {
  sources: GuideSource[];
}
function SourcesList({ sources }: SourcesListProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-gray-400">
        Quellen
      </h2>
      <ol className="space-y-1.5">
        {sources.map((source, i) => (
          <li key={i} className="text-[13px] leading-snug text-lightGray">
            <span className="text-gray-400">{i + 1}.</span>{" "}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-primaryOrange underline decoration-primaryOrange/30 underline-offset-2 hover:decoration-primaryOrange"
            >
              {source.label}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

// GUIDE_ARTICLE
export default function GuideArticle({
  guide,
  kategorie,
  slug,
}: GuideArticleProps) {
  // CONSTANTS
  const category = getCategoryBySlug(kategorie);
  // STATES
  const [copied, setCopied] = useState(false);
  // FUNCTIONS
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // ─── DERIVED + SEO ────────────────────────────────────────────────────────
  const heroMascotSrc =
    CATEGORY_MASCOTS[kategorie] ?? "/Maskottchen/Maskottchen-Hero.webp";

  const tocItems = useMemo<TOCItem[]>(() => {
    return guide.chapters.map((chapter, index) => ({
      id: `kapitel-${index + 1}`,
      label: chapter.heading,
      level: 2,
    }));
  }, [guide]);

  const { breadcrumbSchema, articleSchema, faqSchema } = useMemo(() => {
    const articleUrl = `https://beafox.app${getRatgeberCategoryPath(kategorie)}/${slug}`;
    return {
      breadcrumbSchema: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Startseite",
            item: "https://beafox.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Ratgeber",
            item: "https://beafox.app/ratgeber",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category?.navLabel ?? kategorie,
            item: `https://beafox.app${getRatgeberCategoryPath(kategorie)}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: guide.title,
            item: articleUrl,
          },
        ],
      },
      articleSchema: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.metaDescription ?? guide.excerpt,
        url: articleUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        image: "https://beafox.app/assets/og-image.webp",
        datePublished: guide.publishedAt,
        dateModified: guide.publishedAt,
        wordCount: guide.readingTime * 200,
        author: guide.author
          ? {
              "@type": "Person",
              name: guide.author.name,
              jobTitle: guide.author.role,
              description: guide.author.bio,
            }
          : {
              "@type": "Organization",
              name: "BeAFox Redaktion",
              url: "https://beafox.app/ueber-uns",
            },
        publisher: {
          "@type": "Organization",
          name: "BeAFox",
          url: "https://beafox.app",
          logo: {
            "@type": "ImageObject",
            url: "https://beafox.app/assets/Logos/Logo.webp",
          },
        },
        inLanguage: "de-DE",
        isAccessibleForFree: true,
        keywords: guide.tags.join(", "),
      },
      faqSchema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    };
  }, [guide, kategorie, slug, category?.navLabel]);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* STRUCTURED DATA */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ─── 1. HERO ──────────────────────────────────────────────────────── */}
      <Section
        defaultPadding={false}
        noContainer
        ariaLabelledBy="guide-hero-title"
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#fafafa] to-white pt-28 pb-6 md:pt-32 md:pb-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full opacity-[0.05] blur-3xl"
          style={HERO_BG_BLOB_STYLE}
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-5 pl-1">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-gray-500">
              <li>
                <Link href="/" className="transition-colors hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                <Link
                  href="/ratgeber"
                  className="transition-colors hover:text-gray-900"
                >
                  Ratgeber
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                <Link
                  href={getRatgeberCategoryPath(kategorie)}
                  className="transition-colors hover:text-gray-900"
                >
                  {category?.navLabel ?? kategorie}
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li
                className="max-w-[min(420px,50vw)] truncate font-semibold text-primaryOrange"
                title={guide.title}
              >
                {guide.title}
              </li>
            </ol>
          </nav>

          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(17,24,39,0.08),0_1px_2px_rgba(17,24,39,0.04)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(420px,36vw)]">
              {/* Text column */}
              <div className="flex flex-col justify-center p-5 sm:p-7 md:p-8 lg:p-10 lg:pr-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <div className="flex items-center justify-center gap-1.5 rounded-full bg-primaryOrange/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-primaryOrange ring-1 ring-primaryOrange/15">
                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primaryOrange" />
                    <span>{category?.navLabel ?? kategorie}</span>
                  </div>
                </div>

                <h1
                  id="guide-hero-title"
                  className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#0F172A] sm:text-[2rem] md:text-[2.25rem] xl:text-[2.5rem]"
                >
                  {guide.title}
                </h1>

                <div className="mt-5 h-[3px] w-12 rounded-full bg-primaryOrange/70" />

                <div className="mt-5 flex items-center gap-3">
                  <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden">
                    <Image
                      src="/assets/Logos/Logo.webp"
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-contain p-1"
                    />
                  </span>
                  <div className="flex flex-col leading-tight">
                    <a
                      href="/ueber-uns"
                      className="text-[14px] font-bold text-gray-900 transition-colors hover:text-primaryOrange"
                      rel="author"
                    >
                      {guide.author?.name ?? "BeAFox Redaktion"}
                    </a>
                    <span className="mt-0.5 text-[12px] text-gray-600">
                      {guide.author?.role ??
                        "Geprüft von unserer Finanzredaktion"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px] text-gray-600">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1 ring-1 ring-gray-200/70">
                    <Calendar
                      className="h-3.5 w-3.5 text-gray-400"
                      aria-hidden="true"
                    />
                    <time dateTime={guide.publishedAt}>
                      {formatDate(guide.publishedAt)}
                    </time>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1 ring-1 ring-gray-200/70">
                    <Clock
                      className="h-3.5 w-3.5 text-gray-400"
                      aria-hidden="true"
                    />
                    {guide.readingTime} Min. Lesezeit
                  </span>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1 ring-1 ring-gray-200/70 transition-all hover:text-primaryOrange hover:ring-primaryOrange/40"
                  >
                    <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {copied ? "Link kopiert!" : "Link kopieren"}
                  </button>
                </div>
              </div>

              {/* Mascot column */}
              <div className="relative flex flex-col items-center justify-end gap-4 overflow-hidden border-t border-gray-100 bg-gradient-to-br from-[#FEF6EF] via-[#FFFDFB] to-[#FEF6EF] px-6 pt-6 pb-5 lg:border-l lg:border-t-0">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={HERO_MASCOT_GLOW_STYLE}
                />
                <div className="relative z-[1] flex w-full flex-1 items-end justify-center">
                  <div className="relative h-[200px] w-full max-w-[300px] lg:h-[240px] lg:max-w-[340px]">
                    <Image
                      src={heroMascotSrc}
                      alt=""
                      fill
                      priority
                      className="scale-125 object-contain object-bottom drop-shadow-[0_12px_32px_rgba(232,119,32,0.18)]"
                      sizes="(max-width: 1024px) 300px, 340px"
                    />
                  </div>
                </div>

                <div className="relative bottom-2 z-[1] w-full max-w-[300px]">
                  <FragBeaButton
                    label="Frag Bea zu diesem Thema"
                    context={`Ich lese gerade den Ratgeber "${guide.title}". Hilf mir, das Thema zu verstehen und für meine Situation umzusetzen.`}
                  />
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </Section>

      {/* ─── 2. INHALT ────────────────────────────────────────────────────── */}
      <Section
        width="wide"
        defaultPadding={false}
        className="bg-white pt-2 pb-12 md:pb-16"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* ── INHALTSVERZEICHNIS (Sidebar, Desktop) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 z-10">
              <GuideTOC items={tocItems} title="Inhaltsverzeichnis" />
            </div>
          </aside>

          <article className="min-w-0">
            {/* ── INHALTSVERZEICHNIS (Mobil) ── */}
            <div className="mb-6 lg:hidden">
              <GuideTOC items={tocItems} />
            </div>

            {/* ── SCHNELLANTWORT ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={GUIDE_CARD_CLASS}
              style={QUICK_ANSWER_STYLE}
            >
              <div aria-hidden="true" className={GUIDE_ACCENT_BAR_CLASS} />
              <div className={GUIDE_CARD_INNER_CLASS}>
                <div className="flex items-center gap-2.5">
                  <p className={GUIDE_EYEBROW_CLASS}>Darum geht’s</p>
                  <Zap
                    className="h-4 w-4 flex-shrink-0 text-primaryOrange"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-4 text-[19px] leading-[1.7] text-darkerGray md:text-[21px]">
                  {guide.quickAnswer}
                </p>
              </div>
            </motion.section>

            {/* ── KAPITEL ── */}
            <div className="mt-8 space-y-8 md:mt-10 md:space-y-10">
              {guide.chapters.map((chapter, index) => (
                <Fragment key={index}>
                  <motion.section
                    id={`kapitel-${index + 1}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className={`${GUIDE_CARD_CLASS} scroll-mt-28`}
                  >
                    <div aria-hidden="true" className={GUIDE_ACCENT_BAR_CLASS} />
                    <div className={GUIDE_CARD_INNER_CLASS}>
                      <div className="mb-1.5">
                        <p className={GUIDE_EYEBROW_CLASS}>
                          Kapitel {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-2 text-[24px] font-bold leading-[1.18] tracking-[-0.02em] text-darkerGray md:text-[30px]">
                          {chapter.heading}
                        </h2>
                      </div>

                      <div>
                        <PortableText blocks={chapter.body} variant="guide" />
                      </div>

                      {chapter.visual && (
                        <div className="mt-6">
                          <ChapterVisual visual={chapter.visual} />
                        </div>
                      )}

                      {chapter.interactive && (
                        <div className="mt-6">
                          <ChapterInteractive interactive={chapter.interactive} />
                        </div>
                      )}

                      {chapter.beaPrompt && (
                        <button
                          type="button"
                          style={BEA_BLOCK_STYLE}
                          onClick={() =>
                            openBeaWithContext(
                              `Ratgeber "${guide.title}", Kapitel "${chapter.heading}": ${chapter.beaPrompt}`,
                            )
                          }
                          className="group mt-6 flex w-full items-center gap-3.5 overflow-hidden rounded-2xl p-4 text-left shadow-[0_14px_36px_-16px_rgba(232,119,32,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-16px_rgba(232,119,32,0.7)] sm:gap-4 sm:p-5"
                        >
                          <span
                            aria-hidden="true"
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-105"
                          >
                            <span className="relative h-7 w-7">
                              <Image
                                fill
                                src="/assets/Logos/Logo.webp"
                                alt=""
                                sizes="28px"
                                className="object-contain"
                              />
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-white/85">
                              Genau dein Fall? Frag Bea
                            </span>
                            <span className="mt-1 block text-[15px] font-semibold leading-snug text-white">
                              {chapter.beaPrompt}
                            </span>
                          </span>
                          <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[13px] font-bold text-primaryOrange transition-transform group-hover:scale-105 sm:px-4">
                            <span className="hidden sm:inline">Bea fragen</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        </button>
                      )}
                    </div>
                  </motion.section>

                  {chapter.callout &&
                    index < guide.chapters.length - 1 && (
                      <GuideCallout
                        kind={chapter.callout.kind}
                        text={chapter.callout.text}
                      />
                    )}
                </Fragment>
              ))}
            </div>

            {/* ── ABSCHLUSS: VERGLEICH ODER ZUSAMMENFASSUNG ── */}
            {guide.summary && <GuideSummaryBlock summary={guide.summary} />}

            {/* ── FRAG-BEA-BLOCK ── */}
            <motion.section
              id="frag-bea"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative mt-10 overflow-hidden rounded-[28px] shadow-[0_20px_50px_-15px_rgba(232,119,32,0.35)]"
              style={BEA_BLOCK_STYLE}
            >
              <div className="relative px-5 py-7 sm:px-7 sm:py-9 md:px-9 md:py-11">
                {/* Bea-Persona — macht sichtbar, dass hier ein Chat wartet */}
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_8px_22px_-8px_rgba(0,0,0,0.35)]"
                  >
                    <span className="relative h-8 w-8">
                      <Image
                        fill
                        src="/assets/Logos/Logo.webp"
                        alt=""
                        sizes="32px"
                        className="object-contain"
                      />
                    </span>
                  </span>
                  <p className="flex items-center gap-1.5 text-[15px] font-bold text-white">
                    Deine beste Freundin für Finanzen
                    <span
                      aria-hidden="true"
                      className="inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"
                    />
                  </p>
                </div>

                <h2 className="mt-5 text-[26px] font-bold leading-[1.15] tracking-tight text-white md:text-[34px]">
                  Mach aus diesem Ratgeber eine Entscheidung
                </h2>
                <p className="mt-3 text-[16px] leading-[1.7] text-white/90">
                  {guide.beaBlock.intro}
                </p>

                <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.1em] text-white/80">
                  Stell Bea direkt eine dieser Fragen
                </p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {guide.beaBlock.questions.map((question, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        openBeaWithContext(
                          `Ratgeber "${guide.title}": ${question}`,
                        )
                      }
                      className="group flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3.5 text-left transition-all duration-200 hover:bg-white hover:shadow-lg"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primaryOrange/10"
                      >
                        <MessageCircle className="h-[18px] w-[18px] text-primaryOrange" />
                      </span>
                      <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-darkerGray">
                        {question}
                      </span>
                      <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-primaryOrange px-3 py-1.5 text-[12px] font-bold text-white transition-transform group-hover:scale-105">
                        <span className="hidden sm:inline">Im Chat öffnen</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ── FAQ ── */}
            <motion.section
              id="faq"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primaryOrange/15 ring-1 ring-primaryOrange/25">
                  <HelpCircle
                    className="h-5 w-5 text-primaryOrange"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className={GUIDE_EYEBROW_CLASS}>Häufige Fragen</p>
                  <h2 className="mt-1 text-[24px] font-bold leading-[1.16] tracking-[-0.02em] text-darkerGray md:text-[30px]">
                    Das fragen andere oft
                  </h2>
                </div>
              </div>
              <FaqAccordion items={guide.faq} />
            </motion.section>

            {/* ── APP CTA ── */}
            <motion.section
              id="app-cta"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative my-12 overflow-hidden rounded-[28px] shadow-[0_20px_50px_-15px_rgba(232,119,32,0.35)]"
              style={APP_CTA_STYLE}
            >
              <div className="relative grid grid-cols-1 items-center gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:gap-10 md:p-12 lg:p-14">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Mit Bea umsetzen
                  </span>
                  <h2 className="mt-4 text-[28px] font-bold leading-[1.1] tracking-tight text-white md:text-[36px] lg:text-[44px]">
                    Aus diesem Ratgeber
                    <br className="hidden sm:block" /> wird dein Plan.
                  </h2>
                  <p className="mt-3 max-w-md text-[16px] leading-[1.6] text-white/90">
                    Lade dir die App und setze alles direkt in der App mit Bea
                    um. Schritt für Schritt, genau auf deine Situation.
                  </p>
                  <div className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                    <StoreButton
                      href={APP_STORE_URL}
                      imageSrc="/assets/Apple.webp"
                      label="App Store"
                      imageAlt="Im App Store laden"
                    />
                    <StoreButton
                      href={PLAY_STORE_URL}
                      imageSrc="/assets/Android.webp"
                      label="Google Play"
                      imageAlt="Bei Google Play laden"
                    />
                  </div>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="relative h-48 w-48 md:h-56 md:w-56 lg:h-64 lg:w-64">
                    <Image
                      fill
                      src="/Maskottchen/Maskottchen-Handy.png"
                      alt=""
                      className="scale-125 object-contain"
                      sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ── QUELLEN ── */}
            {guide.sources && guide.sources.length > 0 && (
              <SourcesList sources={guide.sources} />
            )}
          </article>
        </div>
      </Section>

      {/* ─── 3. WEITERE RATGEBER ──────────────────────────────────────────── */}
      <Section
        id="section-ratgeber-themen"
        defaultPadding={false}
        noContainer
        className="w-full border-t border-gray-200/80 bg-[#fafafa] py-10 md:py-16"
        ariaLabelledBy="weitere-ratgeber-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <header className="relative mb-10 text-center md:mb-14">
            <div className="mx-auto mb-4 flex justify-center">
              <span className="inline-flex items-center rounded-full bg-primaryOrange/[0.08] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-primaryOrange ring-1 ring-primaryOrange/15">
                Mehr entdecken
              </span>
            </div>
            <h2
              id="weitere-ratgeber-heading"
              className="mx-auto max-w-[22rem] text-balance text-[28px] font-bold leading-[1.12] tracking-tight text-darkerGray sm:max-w-2xl md:text-[36px] lg:text-[40px]"
            >
              Weitere <span className="text-primaryOrange">Ratgeber</span>
            </h2>
            <div
              aria-hidden="true"
              className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-primaryOrange/50 to-transparent md:mt-6 md:w-20"
            />
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.65] text-lightGray md:mt-6 md:text-[16px]">
              Hier findest du weitere Ratgeber für deine Lebenssituation.
            </p>
          </header>
          <RatgeberSection guidesOuterClassName="w-full" />
        </div>
      </Section>
    </>
  );
}
