"use client";

// IMPORTS
import Image from "next/image";
// IMPORTS
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, type CSSProperties } from "react";
// LIBS
import { SCHULDEN_OPTIONS, type DebtSeverity } from "@/lib/bea-ai/onboarding";

// TYPES
interface Step5Props {
  onSelect: (debtId: string) => void;
}
type SeverityStyleSet = {
  shadowColor: string;
  hover: CSSProperties;
  selected: CSSProperties;
  checkBadge: CSSProperties;
};
// CONSTANTS
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const CARD_BASE_STYLE = {
  border: "1.5px solid #F0E5D8",
  boxShadow: "0 4px 16px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
} as const;
const SEVERITY_STYLES: Record<DebtSeverity, SeverityStyleSet> = {
  none: {
    hover: {
      border: "1.5px solid rgba(34,197,94,0.45)",
      boxShadow:
        "0 16px 40px rgba(34,197,94,0.16), 0 0 0 1px rgba(34,197,94,0.18)",
    },
    selected: {
      border: "1.5px solid #22c55e",
      boxShadow:
        "0 20px 48px rgba(34,197,94,0.22), 0 0 0 2px rgba(34,197,94,0.4)",
    },
    checkBadge: {
      boxShadow: "0 6px 16px rgba(34,197,94,0.45)",
      background: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
    },
    shadowColor: "rgba(34,197,94,0.25)",
  },
  manageable: {
    hover: {
      border: "1.5px solid rgba(245,158,11,0.45)",
      boxShadow:
        "0 16px 40px rgba(245,158,11,0.16), 0 0 0 1px rgba(245,158,11,0.18)",
    },
    selected: {
      border: "1.5px solid #f59e0b",
      boxShadow:
        "0 20px 48px rgba(245,158,11,0.22), 0 0 0 2px rgba(245,158,11,0.4)",
    },
    checkBadge: {
      background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
      boxShadow: "0 6px 16px rgba(245,158,11,0.45)",
    },
    shadowColor: "rgba(245,158,11,0.25)",
  },
  significant: {
    hover: {
      border: "1.5px solid rgba(232,119,32,0.45)",
      boxShadow:
        "0 16px 40px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.2)",
    },
    selected: {
      border: "1.5px solid #E87720",
      boxShadow:
        "0 20px 48px rgba(232,119,32,0.25), 0 0 0 2px rgba(232,119,32,0.4)",
    },
    checkBadge: {
      background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
      boxShadow: "0 6px 16px rgba(232,119,32,0.45)",
    },
    shadowColor: "rgba(232,119,32,0.25)",
  },
};

/**
 * STEP 5 — Schulden-Status (3-stage severity)
 *
 * Conversational pattern matching Steps 1-4:
 * Bea asks the sensitive debt question with explicit reassurance.
 * User picks one of three nuanced cards — none / manageable / significant.
 * Each severity has its own color tone (green / amber / orange) without
 * being alarming. No red — never red for debt questions.
 */
export default function Step5Schulden({ onSelect }: Step5Props) {
  // STATES
  const t = useTranslations("onboarding.beaAi.step5");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // FUNCTIONS
  const handleSelect = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    setTimeout(() => onSelect(id), 550);
  };
  const getCardStyle = (id: string, severity: DebtSeverity): CSSProperties => {
    const styles = SEVERITY_STYLES[severity];
    if (selectedId === id) return styles.selected;
    if (hoveredId === id && !selectedId) return styles.hover;
    return CARD_BASE_STYLE;
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-8 pt-5 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
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
              alt={t("speaker.beaAlt")}
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
              </span>
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
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {SCHULDEN_OPTIONS.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const isDimmed = selectedId !== null && !isSelected;
            const severityStyles = SEVERITY_STYLES[option.severity];

            return (
              <motion.button
                type="button"
                key={option.id}
                disabled={!!selectedId}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                onClick={() => handleSelect(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: selectedId ? 0 : -6 }}
                onMouseEnter={() => setHoveredId(option.id)}
                className="group relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-3xl rounded-tr-md p-6 text-center transition-all duration-300 disabled:cursor-default md:min-h-[300px] md:p-8"
                style={{
                  ...getCardStyle(option.id, option.severity),
                  background: option.gradient,
                }}
                animate={{
                  y: 0,
                  opacity: isDimmed ? 0.3 : 1,
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.55 + idx * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.div
                  className="relative mb-3 h-20 w-20 md:h-28 md:w-28"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  animate={{
                    y: hoveredId === option.id || isSelected ? -6 : 0,
                    scale: hoveredId === option.id || isSelected ? 1.08 : 1,
                  }}
                >
                  <Image
                    fill
                    sizes="112px"
                    alt={option.label}
                    src={option.mascot}
                    className="object-contain"
                    style={{
                      filter: `drop-shadow(0 12px 24px ${severityStyles.shadowColor})`,
                    }}
                  />
                </motion.div>
                <div className="relative mb-1 text-2xl md:text-3xl">
                  {option.emoji}
                </div>
                <h3 className="relative mb-2 px-2 text-lg font-black leading-tight tracking-tight text-darkerGray md:text-xl">
                  {option.label}
                </h3>
                <p className="relative max-w-xs px-2 text-xs font-medium leading-snug text-darkerGray/70 md:text-sm">
                  {option.description}
                </p>
                {isSelected && (
                  <motion.div
                    animate={{ scale: 1, rotate: 0 }}
                    style={severityStyles.checkBadge}
                    initial={{ scale: 0, rotate: -30 }}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white"
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
          className="mt-4 text-sm text-gray-400"
          animate={{ opacity: selectedId ? 0 : 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          {t("hint")}
        </motion.p>
      </div>
    </div>
  );
}
