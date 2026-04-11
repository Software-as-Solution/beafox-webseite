"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import StepHeading from "../shared/StepHeading";
import BeaPresence from "../shared/BeaPresence";
import { getKnowledgeLevelMessage } from "@/lib/bea-ai/onboarding";

interface Step4Props {
  onSelect: (level: number) => void;
}

/**
 * STEP 4 — Self-Rate Knowledge (1-10)
 *
 * Pattern: Custom numerical scale with focus-ring effect.
 * User clicks a number — active number becomes huge, neighbors stay small.
 * Bea's response text updates live as they rate themselves.
 */
export default function Step4SelfRating({ onSelect }: Step4Props) {
  const [level, setLevel] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const displayLevel = level ?? hoveredLevel ?? 5;
  const message = getKnowledgeLevelMessage(displayLevel);

  const handleSelect = (value: number) => {
    setLevel(value);
  };

  const handleConfirm = () => {
    if (level === null || isConfirming) return;
    setIsConfirming(true);
    setTimeout(() => onSelect(level), 400);
  };

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 4 — Dein Wissensstand"
        title={
          <>
            Wie fit bist du bei{" "}
            <span className="text-primaryOrange">Finanzen?</span>
          </>
        }
        subtitle="Sei ehrlich — hier gibt es keine falsche Antwort. Ich passe mich an."
      />

      {/* Bea's reactive message */}
      <div className="mt-8 md:mt-10">
        <BeaPresence mascotSrc={message.mascot} size="md" />
      </div>

      <div className="mt-6 text-center max-w-lg min-h-[80px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayLevel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xs font-bold text-primaryOrange uppercase tracking-widest mb-2">
              {message.title}
            </div>
            <p className="text-sm md:text-base text-darkerGray leading-relaxed">
              {message.message}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 1-10 number scale */}
      <div className="mt-8 md:mt-10 w-full max-w-2xl">
        <div className="flex items-end justify-between gap-1 md:gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
            const isSelected = level === num;
            const isHovered = hoveredLevel === num;
            const isFocused = isSelected || isHovered;

            return (
              <motion.button
                key={num}
                type="button"
                onClick={() => handleSelect(num)}
                onMouseEnter={() => setHoveredLevel(num)}
                onMouseLeave={() => setHoveredLevel(null)}
                whileTap={{ scale: 0.94 }}
                animate={{
                  scale: isFocused ? 1.15 : 1,
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex-1 flex flex-col items-center justify-end"
              >
                <div
                  className="w-full flex items-center justify-center rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{
                    height: isFocused ? "72px" : "56px",
                    background: isSelected
                      ? "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)"
                      : isFocused
                        ? "#FFF8F3"
                        : "#FFFFFF",
                    border: `2px solid ${isSelected ? "#E87720" : "#F0E5D8"}`,
                    boxShadow: isFocused
                      ? "0 12px 32px rgba(232,119,32,0.18)"
                      : "0 2px 8px rgba(232,119,32,0.06)",
                  }}
                >
                  <span
                    className="font-black tabular-nums transition-all duration-300"
                    style={{
                      fontSize: isFocused ? "24px" : "18px",
                      color: isSelected ? "#FFFFFF" : "#161616",
                    }}
                  >
                    {num}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Scale labels */}
        <div className="mt-3 flex justify-between text-[10px] md:text-xs text-lightGray font-semibold">
          <span>Totaler Anfänger</span>
          <span>Finanz-Nerd</span>
        </div>
      </div>

      {/* Confirm button */}
      <motion.button
        type="button"
        onClick={handleConfirm}
        disabled={level === null || isConfirming}
        animate={{
          opacity: level === null ? 0.4 : 1,
          y: level === null ? 10 : 0,
        }}
        whileHover={level !== null ? { scale: 1.04 } : {}}
        whileTap={level !== null ? { scale: 0.97 } : {}}
        className="mt-12 inline-flex items-center gap-2 rounded-full px-8 py-4 text-white font-black text-base md:text-lg disabled:cursor-not-allowed"
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
