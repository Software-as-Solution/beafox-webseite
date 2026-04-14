"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
// LIBS
import { LIFE_SITUATION_OPTIONS } from "@/lib/bea-ai/onboarding";

// TYPES
interface Step1Props {
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

/**
 * STEP 1 — Life Situation
 *
 * Conversational pattern: Bea sits on the left as the speaker,
 * her question appears in a speech bubble, and the user responds
 * via cards that feel like chat replies, not form inputs.
 */
export default function Step1({ onSelect }: Step1Props) {
  // STATES
  const t = useTranslations("onboarding.beaAi.step1");
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
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-8 pt-5 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 flex items-start gap-3 md:mb-14 md:gap-4"
      >
        <motion.div
          className="relative flex-shrink-0"
          animate={{ scale: 1, opacity: 1 }}
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
            className="relative inline-block max-w-2xl rounded-2xl rounded-tl-md px-4 py-3 md:px-6 md:py-5"
            transition={{
              delay: 0.25,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="text-[15px] font-semibold leading-relaxed text-darkerGray sm:text-base md:text-lg">
              {t("bubble.titlePrefix")}{" "}
              <span className="text-primaryOrange">
                {t("bubble.titleHighlight")}
              </span>{" "}
              {t("bubble.titleSuffix")}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-lightGray sm:text-sm md:text-[15px]">
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
        <div className="grid w-full grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {LIFE_SITUATION_OPTIONS.map((option, idx) => {
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
                whileHover={{ y: selectedId ? 0 : -6 }}
                onClick={() => handleSelect(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                onMouseEnter={() => setHoveredId(option.id)}
                className="group relative flex flex-col items-center overflow-hidden rounded-3xl p-4 transition-all duration-300 disabled:cursor-default md:p-5"
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
                <div className="relative mb-2 h-24 w-24 md:h-32 md:w-32 lg:h-36 lg:w-36">
                  <motion.div
                    className="relative h-full w-full"
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    animate={{
                      y: hoveredId === option.id || isSelected ? -4 : 0,
                      scale: hoveredId === option.id || isSelected ? 1.06 : 1,
                    }}
                  >
                    <Image
                      fill
                      sizes="160px"
                      alt={option.label}
                      src={option.mascot}
                      className="object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 12px 20px rgba(232,119,32,0.18))",
                      }}
                    />
                  </motion.div>
                </div>
                <h3 className="text-center text-sm font-black leading-tight text-darkerGray md:text-base">
                  {option.label}
                </h3>
                <p className="mt-1 text-center text-[11px] leading-snug text-lightGray md:text-xs">
                  {option.sub}
                </p>
                {isSelected && (
                  <motion.div
                    animate={{ scale: 1, rotate: 0 }}
                    initial={{ scale: 0, rotate: -30 }}
                    style={{ boxShadow: "0 6px 16px rgba(232,119,32,0.45)" }}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primaryOrange"
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
                      stroke="currentColor"
                      className="h-4 w-4 text-white"
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
