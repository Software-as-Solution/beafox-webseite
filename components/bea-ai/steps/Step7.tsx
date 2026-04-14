"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
// LIBS
import { PRIORITY_OPTIONS, PRIORITY_RANK_COUNT } from "@/lib/bea-ai/onboarding";

// TYPES
interface Step7Props {
  onSelect: (priorities: string[]) => void;
}
// CONSTANTS
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
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
  border: "1.5px solid #E87720",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.3)",
} as const;
const SLOT_FILLED_STYLE = {
  border: "2px dashed #E87720",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
} as const;
const SLOT_EMPTY_STYLE = {
  border: "2px dashed #FED4B0",
  background: "rgba(255,248,243,0.5)",
} as const;
const RANK_BADGE_FILLED_STYLE = {
  color: "#FFFFFF",
  boxShadow: "0 4px 12px rgba(232,119,32,0.4)",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;
const RANK_BADGE_EMPTY_STYLE = {
  color: "#E87720",
  boxShadow: "none",
  background: "#FED4B0",
} as const;
const CARD_RANK_BADGE_STYLE = {
  boxShadow: "0 6px 16px rgba(232,119,32,0.45)",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;
const CONFIRM_BUTTON_STYLE = {
  boxShadow: "0 12px 32px rgba(232,119,32,0.35)",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;

/**
 * STEP 7 — Priority Ranking
 *
 * Conversational pattern matching Steps 1-6, but with multi-select:
 * Bea asks for the user's top 3 priorities in ranking order.
 * User clicks cards in order — first click = rank 1, etc.
 * Clicking a ranked card removes it. Once 3 are picked, Weiter activates.
 *
 * The slot preview at the top shows the live ranking state,
 * making the order explicit and undo-friendly.
 */
export default function Step7Priorities({ onSelect }: Step7Props) {
  // STATES
  const t = useTranslations("onboarding.beaAi.step7");
  const [ranking, setRanking] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // CONSTANTS
  const isFull = ranking.length === PRIORITY_RANK_COUNT;
  // FUNCTIONS
  const handleCardClick = (id: string) => {
    if (isConfirming) return;
    const currentRank = ranking.indexOf(id);
    if (currentRank !== -1) {
      setRanking(ranking.filter((r) => r !== id));
    } else if (ranking.length < PRIORITY_RANK_COUNT) {
      setRanking([...ranking, id]);
    }
  };
  const handleConfirm = () => {
    if (ranking.length !== PRIORITY_RANK_COUNT || isConfirming) return;
    setIsConfirming(true);
    setTimeout(() => onSelect(ranking), 400);
  };
  const getRank = (id: string): number | null => {
    const idx = ranking.indexOf(id);
    return idx === -1 ? null : idx + 1;
  };
  const getCardStyle = (id: string) => {
    if (getRank(id) !== null) return CARD_SELECTED_STYLE;
    return CARD_UNSELECTED_STYLE;
  };
  const getCounterText = () => {
    if (ranking.length === 0) return t("counter.zero");
    if (ranking.length === 1) return t("counter.one");
    if (ranking.length === 2) return t("counter.two");
    return t("counter.full");
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        className="mb-2 flex items-start gap-3 md:gap-4"
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              <span className="text-primaryOrange">
                {t("bubble.titleHighlight")}
              </span>{" "}
              {t("bubble.titleSuffix")}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-lightGray md:text-[15px]">
              {t("bubble.description", { count: PRIORITY_RANK_COUNT })}
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
        <div className="w-full">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mb-5 grid grid-cols-3 gap-3 md:gap-4"
          >
            {Array.from({ length: PRIORITY_RANK_COUNT }).map((_, slotIdx) => {
              const filledId = ranking[slotIdx];
              const filledOption = filledId
                ? PRIORITY_OPTIONS.find((p) => p.id === filledId)
                : null;

              return (
                <motion.div
                  key={slotIdx}
                  animate={{ scale: filledOption ? 1 : 0.97 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={filledOption ? SLOT_FILLED_STYLE : SLOT_EMPTY_STYLE}
                  className="relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl p-3 md:p-4"
                >
                  <div
                    style={
                      filledOption
                        ? RANK_BADGE_FILLED_STYLE
                        : RANK_BADGE_EMPTY_STYLE
                    }
                    className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black md:h-8 md:w-8 md:text-sm"
                  >
                    {slotIdx + 1}
                  </div>
                  <AnimatePresence mode="wait">
                    {filledOption ? (
                      <motion.div
                        key={filledOption.id}
                        transition={{ duration: 0.3 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="mb-1 text-3xl md:text-4xl">
                          {filledOption.icon}
                        </div>
                        <div className="line-clamp-2 text-[10px] font-bold leading-tight text-darkerGray md:text-xs">
                          {filledOption.label}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.45 }}
                        className="text-center text-[10px] font-medium text-lightGray md:text-xs"
                      >
                        {t("slotEmpty")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
          <div className="mb-6 flex items-center justify-center gap-2.5">
            <div className="relative h-9 w-9 flex-shrink-0 md:h-10 md:w-10">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                <Image
                  src="/Maskottchen/Maskottchen-Right.png"
                  alt="Bea"
                  fill
                  className="object-contain"
                />
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 flex h-2.5 w-2.5"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
              </span>
            </div>
            <div className="flex-1 pt-0.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ranking.length}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: isFull
                      ? "linear-gradient(180deg, #FFF8F3 0%, #FFEEDB 100%)"
                      : "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
                    border: isFull
                      ? "1.5px solid rgba(232,119,32,0.4)"
                      : "1.5px solid rgba(232,119,32,0.18)",
                    boxShadow: isFull
                      ? "0 8px 24px rgba(232,119,32,0.15), 0 0 0 1px rgba(232,119,32,0.1)"
                      : "0 4px 16px rgba(232,119,32,0.08)",
                  }}
                  className="inline-block rounded-2xl rounded-tl-md px-4 py-2.5 text-xs font-semibold leading-snug text-darkerGray md:text-sm"
                >
                  {getCounterText()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
            {PRIORITY_OPTIONS.map((option, idx) => {
              const rank = getRank(option.id);
              const isSelected = rank !== null;
              const isDimmed = !isSelected && isFull;

              return (
                <motion.button
                  type="button"
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  style={getCardStyle(option.id)}
                  disabled={isDimmed || isConfirming}
                  onMouseLeave={() => setHoveredId(null)}
                  whileTap={{ scale: isDimmed ? 1 : 0.98 }}
                  onClick={() => handleCardClick(option.id)}
                  onMouseEnter={() => setHoveredId(option.id)}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 disabled:cursor-not-allowed md:gap-4 md:p-5"
                  animate={{
                    y: 0,
                    scale: isSelected ? 1.02 : 1,
                    opacity: isDimmed ? 0.35 : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.65 + idx * 0.06,
                  }}
                  whileHover={{
                    y: isDimmed || isSelected ? 0 : -4,
                  }}
                >
                  <motion.div
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-3xl md:text-4xl"
                    animate={{
                      scale:
                        hoveredId === option.id && !isSelected && !isDimmed
                          ? 1.1
                          : 1,
                    }}
                    style={{
                      filter: isSelected
                        ? "drop-shadow(0 8px 16px rgba(232,119,32,0.25))"
                        : "drop-shadow(0 4px 8px rgba(232,119,32,0.1))",
                    }}
                  >
                    {option.icon}
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-sm font-black leading-tight text-darkerGray md:text-base">
                      {option.label}
                    </h3>
                    <p className="text-[11px] leading-snug text-lightGray md:text-xs">
                      {option.description}
                    </p>
                  </div>
                  <AnimatePresence>
                    {rank !== null && (
                      <motion.div
                        style={CARD_RANK_BADGE_STYLE}
                        exit={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0 }}
                        initial={{ scale: 0, rotate: -30 }}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base font-black text-white md:h-10 md:w-10 md:text-lg"
                        transition={{
                          damping: 18,
                          type: "spring",
                          stiffness: 300,
                        }}
                      >
                        {rank}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col items-center">
            <motion.button
              type="button"
              onClick={handleConfirm}
              style={CONFIRM_BUTTON_STYLE}
              disabled={!isFull || isConfirming}
              whileTap={isFull ? { scale: 0.97 } : {}}
              whileHover={isFull ? { scale: 1.04 } : {}}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-black text-white disabled:cursor-not-allowed md:text-lg"
              animate={{
                y: isFull ? 0 : 8,
                scale: isFull ? 1 : 0.97,
                opacity: isFull ? 1 : 0.4,
              }}
            >
              {t("confirm")}
              <svg
                fill="none"
                strokeWidth={3}
                className="h-5 w-5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isFull ? 0 : 1 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="mt-6 text-center text-sm text-gray-400"
          >
            {t("hint")}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
