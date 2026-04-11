"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import StepHeading from "../shared/StepHeading";
import {
  PRIORITY_OPTIONS,
  PRIORITY_RANK_COUNT,
  type PriorityOption,
} from "@/lib/bea-ai/onboarding";

interface Step6Props {
  onSelect: (priorities: string[]) => void;
}

/**
 * STEP 6 — Priority Ranking
 *
 * Pattern: Click-to-rank (no drag library required).
 * User clicks cards in order — first click = rank 1, second = rank 2, etc.
 * Clicking a ranked card removes it from the ranking.
 * Once all 3 slots are filled, the continue button appears.
 */
export default function Step6Priorities({ onSelect }: Step6Props) {
  const [ranking, setRanking] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleCardClick = (id: string) => {
    if (isConfirming) return;
    const currentRank = ranking.indexOf(id);
    if (currentRank !== -1) {
      // Remove from ranking
      setRanking(ranking.filter((r) => r !== id));
    } else if (ranking.length < PRIORITY_RANK_COUNT) {
      // Add to ranking
      setRanking([...ranking, id]);
    }
  };

  const handleConfirm = () => {
    if (ranking.length !== PRIORITY_RANK_COUNT || isConfirming) return;
    setIsConfirming(true);
    setTimeout(() => onSelect(ranking), 400);
  };

  const getRank = (id: string) => {
    const idx = ranking.indexOf(id);
    return idx === -1 ? null : idx + 1;
  };

  const isFull = ranking.length === PRIORITY_RANK_COUNT;

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 6 — Deine Prioritäten"
        title={
          <>
            Was beschäftigt dich am{" "}
            <span className="text-primaryOrange">meisten?</span>
          </>
        }
        subtitle={`Wähle deine Top ${PRIORITY_RANK_COUNT} in der Reihenfolge, die für dich am wichtigsten ist.`}
      />

      {/* Selected slots preview */}
      <div className="mt-8 md:mt-10 w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 md:gap-4">
          {Array.from({ length: PRIORITY_RANK_COUNT }).map((_, slotIdx) => {
            const filledId = ranking[slotIdx];
            const filledOption = filledId
              ? PRIORITY_OPTIONS.find((p) => p.id === filledId)
              : null;

            return (
              <motion.div
                key={slotIdx}
                animate={{
                  scale: filledOption ? 1 : 0.95,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 relative aspect-square rounded-2xl flex flex-col items-center justify-center p-3 md:p-4 overflow-hidden"
                style={{
                  background: filledOption
                    ? "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)"
                    : "rgba(255,248,243,0.4)",
                  border: `2px dashed ${filledOption ? "#E87720" : "#FED4B0"}`,
                }}
              >
                {/* Rank number */}
                <div
                  className="absolute top-2 left-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-black"
                  style={{
                    background: filledOption
                      ? "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)"
                      : "#FED4B0",
                    color: filledOption ? "#FFFFFF" : "#E87720",
                    boxShadow: filledOption
                      ? "0 4px 12px rgba(232,119,32,0.4)"
                      : "none",
                  }}
                >
                  {slotIdx + 1}
                </div>

                <AnimatePresence mode="wait">
                  {filledOption ? (
                    <motion.div
                      key={filledOption.id}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="text-3xl md:text-4xl mb-1">
                        {filledOption.icon}
                      </div>
                      <div className="text-[10px] md:text-xs font-bold text-darkerGray leading-tight line-clamp-2">
                        {filledOption.label}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-lightGray text-center"
                    >
                      Leer
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Option cards */}
      <div className="mt-10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {PRIORITY_OPTIONS.map((option, idx) => {
          const rank = getRank(option.id);
          const isSelected = rank !== null;
          const isDimmed = !isSelected && isFull;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleCardClick(option.id)}
              disabled={isDimmed}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isDimmed ? 0.35 : 1,
                y: 0,
              }}
              transition={{
                delay: idx * 0.07,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={!isDimmed ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isDimmed ? { scale: 0.98 } : {}}
              className="group relative flex items-center gap-3 md:gap-4 rounded-2xl p-4 md:p-5 text-left transition-all duration-300"
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)"
                  : "#FFFFFF",
                border: `2px solid ${isSelected ? "#E87720" : "#F0E5D8"}`,
                boxShadow: isSelected
                  ? "0 12px 32px rgba(232,119,32,0.18)"
                  : "0 4px 12px rgba(232,119,32,0.06)",
                cursor: isDimmed ? "not-allowed" : "pointer",
              }}
            >
              <div className="text-3xl md:text-4xl flex-shrink-0">
                {option.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-black text-darkerGray leading-tight mb-1">
                  {option.label}
                </h3>
                <p className="text-[11px] md:text-xs text-lightGray leading-snug">
                  {option.description}
                </p>
              </div>

              {/* Rank badge */}
              <AnimatePresence>
                {rank !== null && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                    className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-black text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
                      boxShadow: "0 4px 12px rgba(232,119,32,0.4)",
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

      {/* Helper text */}
      <div className="mt-6 text-xs md:text-sm text-lightGray">
        {ranking.length === 0 && "Klicke auf deine wichtigste Priorität"}
        {ranking.length === 1 && "Noch 2 weitere wählen"}
        {ranking.length === 2 && "Noch eine..."}
        {ranking.length === PRIORITY_RANK_COUNT && "Top-3 ausgewählt"}
      </div>

      {/* Confirm button */}
      <motion.button
        type="button"
        onClick={handleConfirm}
        disabled={!isFull || isConfirming}
        animate={{
          opacity: isFull ? 1 : 0.4,
          y: isFull ? 0 : 10,
        }}
        whileHover={isFull ? { scale: 1.04 } : {}}
        whileTap={isFull ? { scale: 0.97 } : {}}
        className="mt-6 inline-flex items-center gap-2 rounded-full px-8 py-4 text-white font-black text-base md:text-lg disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
          boxShadow: "0 12px 32px rgba(232,119,32,0.35)",
        }}
      >
        Weiter
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </motion.button>
    </div>
  );
}
