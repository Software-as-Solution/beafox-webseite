"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
// LIBS
import { WOHNSITUATION_OPTIONS } from "@/lib/bea-ai/onboarding";

// TYPES
interface Step3Props {
  onSelect: (id: string) => void;
}
// CONSTANTS
const BUBBLE_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const CARD_UNSELECTED_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 4px 16px rgba(232,119,32,0.06)",
} as const;
const CARD_SELECTED_STYLE = {
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
  border: "1.5px solid #E87720",
  boxShadow: "0 8px 24px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.3)",
} as const;
const CARD_HOVER_STYLE = {
  background: "#FFFCF8",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.14), 0 0 0 1px rgba(232,119,32,0.15)",
} as const;
const CHECK_BADGE_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 6px 16px rgba(232,119,32,0.45)",
} as const;

/**
 * STEP 3 — Wohnsituation
 *
 * Conversational pattern matching Step 1/2:
 * Bea asks about the user's living situation in a speech bubble,
 * the user responds via icon cards arranged as chat reply options.
 */
export default function Step3Wohnsituation({ onSelect }: Step3Props) {
  // STATES
  const t = useTranslations("onboarding.beaAi.step3");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // FUNCTIONS
  const handleSelect = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    setTimeout(() => onSelect(id), 550);
  };
  const getCardStyle = (id: string) => {
    if (selectedId === id) return CARD_SELECTED_STYLE;
    if (hoveredId === id && !selectedId) return CARD_HOVER_STYLE;
    return CARD_UNSELECTED_STYLE;
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex items-start gap-3 md:gap-4"
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
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {WOHNSITUATION_OPTIONS.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const isDimmed = selectedId !== null && !isSelected;

            return (
              <motion.button
                type="button"
                key={option.id}
                disabled={!!selectedId}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                style={getCardStyle(option.id)}
                onClick={() => handleSelect(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: selectedId ? 0 : -6 }}
                onMouseEnter={() => setHoveredId(option.id)}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl p-5 text-center transition-all duration-300 disabled:cursor-default md:p-6"
                animate={{
                  opacity: isDimmed ? 0.35 : 1,
                  y: 0,
                  scale: isSelected ? 1.03 : 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.55 + idx * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.div
                  className="text-4xl md:text-5xl"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  animate={{
                    y: hoveredId === option.id || isSelected ? -3 : 0,
                    scale: hoveredId === option.id || isSelected ? 1.1 : 1,
                  }}
                  style={{
                    filter:
                      hoveredId === option.id || isSelected
                        ? "drop-shadow(0 8px 16px rgba(232,119,32,0.25))"
                        : "drop-shadow(0 4px 8px rgba(232,119,32,0.1))",
                  }}
                >
                  {option.icon}
                </motion.div>
                <h3 className="text-sm font-black leading-tight text-darkerGray md:text-base">
                  {option.label}
                </h3>
                <p className="text-[11px] leading-snug text-lightGray md:text-xs">
                  {option.description}
                </p>
                {isSelected && (
                  <motion.div
                    style={CHECK_BADGE_STYLE}
                    animate={{ scale: 1, rotate: 0 }}
                    initial={{ scale: 0, rotate: -30 }}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-white"
                    transition={{
                      damping: 18,
                      type: "spring",
                      stiffness: 300,
                    }}
                  >
                    <svg
                      fill="none"
                      strokeWidth={3.5}
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
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
          animate={{ opacity: selectedId ? 0 : 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-8 text-sm text-gray-400 self-center"
        >
          {t("hint")}
        </motion.p>
      </div>
    </div>
  );
}
