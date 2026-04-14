"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
// LIBS
import { EINKOMMENS_OPTIONS } from "@/lib/bea-ai/onboarding";

// TYPES
interface Step4Props {
  onSelect: (id: string) => void;
}
// CONSTANTS
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const ROW_UNSELECTED_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 4px 12px rgba(232,119,32,0.05)",
} as const;
const ROW_SELECTED_STYLE = {
  border: "1.5px solid #E87720",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.3)",
} as const;
const ROW_HOVER_STYLE = {
  background: "#FFFCF8",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow:
    "0 6px 20px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.15)",
} as const;
const SKIP_UNSELECTED_STYLE = {
  boxShadow: "none",
  background: "#FAFAFA",
  border: "1.5px dashed #D1D5DB",
} as const;
const SKIP_HOVER_STYLE = {
  background: "#F9FAFB",
  border: "1.5px dashed #9CA3AF",
  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
} as const;
const BADGE_DEFAULT_STYLE = {
  color: "#E87720",
  background: "#FFF8F3",
  border: "1px solid #FED4B0",
} as const;
const BADGE_SELECTED_STYLE = {
  color: "#FFFFFF",
  border: "1px solid transparent",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;
const BADGE_SKIP_STYLE = {
  color: "#6B7280",
  background: "#F3F4F6",
  border: "1px solid #E5E7EB",
} as const;
const CHECK_BADGE_STYLE = {
  boxShadow: "0 6px 16px rgba(232,119,32,0.45)",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;

/**
 * STEP 4 — Einkommens-Range
 *
 * Conversational pattern matching Steps 1-3:
 * Bea asks about income gently (acknowledging it's sensitive),
 * user picks a range or skips entirely. The "no answer" option
 * is visually distinct (dashed border) so it doesn't feel like
 * a hidden default.
 */
export default function Step4Einkommen({ onSelect }: Step4Props) {
  // STATES
  const t = useTranslations("onboarding.beaAi.step4");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // FUNCTIONS
  const handleSelect = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    setTimeout(() => onSelect(id), 550);
  };
  const getRowStyle = (id: string, isSkip: boolean) => {
    if (selectedId === id) return ROW_SELECTED_STYLE;
    if (hoveredId === id && !selectedId) {
      return isSkip ? SKIP_HOVER_STYLE : ROW_HOVER_STYLE;
    }
    return isSkip ? SKIP_UNSELECTED_STYLE : ROW_UNSELECTED_STYLE;
  };
  const getBadgeStyle = (id: string, isSkip: boolean) => {
    if (selectedId === id) return BADGE_SELECTED_STYLE;
    if (isSkip) return BADGE_SKIP_STYLE;
    return BADGE_DEFAULT_STYLE;
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex items-start gap-3 md:gap-4"
      >
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex-shrink-0"
          initial={{ scale: 0.7, opacity: 0 }}
          transition={{
            delay: 0.1,
            damping: 18,
            type: "spring",
            stiffness: 200,
          }}
        >
          <div className="relative h-14 w-14 overflow-hidden md:h-16 md:w-16">
            <Image
              fill
              priority
              alt="Bea"
              className="object-contain"
              src="/Maskottchen/Maskottchen-Right.png"
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 flex h-3.5 w-3.5"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
          </span>
        </motion.div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primaryOrange">
              {t("speaker.bea")}
            </span>
          </div>
          <motion.div
            style={BUBBLE_STYLE}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            className="relative inline-block max-w-2xl rounded-2xl rounded-tl-md px-5 py-4 md:px-6 md:py-5"
            transition={{
              delay: 0.25,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="text-base font-semibold leading-relaxed text-darkerGray md:text-lg">
              {t("bubble.titlePrefix")}{" "}
              <span className="text-primaryOrange">{t("bubble.titleHighlight")}</span>{" "}
              {t("bubble.titleSuffix")}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-lightGray md:text-[15px]">
              {t("bubble.description")}
            </p>
          </motion.div>
        </div>
      </motion.div>
      <div className="flex flex-col items-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-3 flex items-center gap-1.5"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-darkerGray/60">
            {t("speaker.you")}
          </span>
        </motion.div>
        <div className="w-full max-w-2xl space-y-2.5">
          {EINKOMMENS_OPTIONS.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const isDimmed = selectedId !== null && !isSelected;
            const isSkipOption = option.id === "keine-angabe";

            return (
              <motion.button
                type="button"
                key={option.id}
                disabled={!!selectedId}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                whileHover={{ x: selectedId ? 0 : 4 }}
                onClick={() => handleSelect(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                onMouseEnter={() => setHoveredId(option.id)}
                style={getRowStyle(option.id, isSkipOption)}
                className="group relative flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 disabled:cursor-default md:p-5"
                animate={{
                  x: 0,
                  opacity: isDimmed ? 0.35 : 1,
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.55 + idx * 0.05,
                }}
              >
                <div
                  style={getBadgeStyle(option.id, isSkipOption)}
                  className="flex w-44 shrink-0 flex-col justify-center rounded-xl px-2 py-2 text-center transition-all duration-300 md:w-48"
                >
                  <div className="text-xs font-black leading-tight tabular-nums md:text-sm">
                    {isSkipOption ? "—" : option.label}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-semibold leading-snug md:text-base ${
                      isSkipOption ? "text-darkerGray/80" : "text-darkerGray"
                    }`}
                  >
                    {isSkipOption ? option.label : option.description}
                  </span>
                  {isSkipOption && (
                    <p className="mt-0.5 text-[11px] text-lightGray">
                      {option.description}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <motion.div
                    style={CHECK_BADGE_STYLE}
                    animate={{ scale: 1, rotate: 0 }}
                    initial={{ scale: 0, rotate: -30 }}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white"
                    transition={{
                      damping: 18,
                      type: "spring",
                      stiffness: 300,
                    }}
                  >
                    <svg
                      fill="none"
                      strokeWidth={3.5}
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      stroke="currentColor"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          className="mt-4 text-xs text-gray-400"
          animate={{ opacity: selectedId ? 0 : 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          {t("hint")}
        </motion.p>
      </div>
    </div>
  );
}
