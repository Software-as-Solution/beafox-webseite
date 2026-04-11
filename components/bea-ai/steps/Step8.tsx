"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import StepHeading from "../shared/StepHeading";
import BeaPresence from "../shared/BeaPresence";
import { getSavingLevelMessage } from "@/lib/bea-ai/onboarding";

interface Step8Props {
  onSelect: (percent: number) => void;
}

// Preset buttons — cleaner than a slider for this question
const PRESETS = [0, 5, 10, 15, 20, 30];

/**
 * STEP 8 — Saving Behavior
 *
 * Pattern: Circular progress visualization with preset buttons.
 * User picks a % and the circle fills up live.
 * Below the circle: "Du legst X€ von jeden 100€ weg" makes it concrete.
 */
export default function Step8Saving({ onSelect }: Step8Props) {
  const [percent, setPercent] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const displayPercent = percent ?? 0;
  const levelInfo = getSavingLevelMessage(displayPercent);

  const handleSelect = (value: number) => {
    setPercent(value);
  };

  const handleConfirm = () => {
    if (percent === null || isConfirming) return;
    setIsConfirming(true);
    setTimeout(() => onSelect(percent), 400);
  };

  // Circle math
  const CIRCLE_SIZE = 220;
  const STROKE_WIDTH = 16;
  const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset =
    CIRCUMFERENCE - (displayPercent / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 8 — Deine Sparrate"
        title={
          <>
            Wie viel <span className="text-primaryOrange">sparst</span> du
            aktuell?
          </>
        }
        subtitle="Ungefähre Einschätzung reicht — ich frage nicht nach Euro-Beträgen."
      />

      {/* Reacting mascot */}
      {percent !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 md:mt-8"
        >
          <BeaPresence mascotSrc={levelInfo.mascot} size="md" />
        </motion.div>
      )}

      {/* Circular progress */}
      <div className="mt-8 md:mt-10 relative flex items-center justify-center">
        <svg
          width={CIRCLE_SIZE}
          height={CIRCLE_SIZE}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#FFF8F3"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="saveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E87720" />
              <stop offset="50%" stopColor="#F08A3C" />
              <stop offset="100%" stopColor="#F5A155" />
            </linearGradient>
          </defs>
          {/* Progress circle */}
          <motion.circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="url(#saveGradient)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              filter: "drop-shadow(0 0 12px rgba(232,119,32,0.4))",
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={displayPercent}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-1"
            >
              <span
                className="text-6xl md:text-7xl font-black tabular-nums leading-none"
                style={{
                  background:
                    "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {displayPercent}
              </span>
              <span className="text-2xl md:text-3xl font-bold text-primaryOrange">
                %
              </span>
            </motion.div>
          </AnimatePresence>
          <div className="mt-1 text-xs md:text-sm text-lightGray font-semibold">
            vom Einkommen
          </div>
        </div>
      </div>

      {/* Concrete example */}
      <div className="mt-4 text-center min-h-[24px]">
        <AnimatePresence mode="wait">
          {percent !== null && (
            <motion.div
              key={percent}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-xs md:text-sm text-darkerGray font-medium"
            >
              Du legst <span className="font-black">{percent} €</span> von jeden{" "}
              <span className="font-black">100 €</span> weg
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preset buttons */}
      <div className="mt-8 w-full max-w-2xl">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
          {PRESETS.map((preset) => {
            const isSelected = percent === preset;
            return (
              <motion.button
                key={preset}
                type="button"
                onClick={() => handleSelect(preset)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative py-3 md:py-4 rounded-2xl font-black text-base md:text-lg transition-all duration-300"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)"
                    : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#161616",
                  border: `2px solid ${isSelected ? "#E87720" : "#F0E5D8"}`,
                  boxShadow: isSelected
                    ? "0 8px 24px rgba(232,119,32,0.3)"
                    : "0 4px 12px rgba(232,119,32,0.06)",
                }}
              >
                {preset === 30 ? "30%+" : `${preset}%`}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Level message */}
      <AnimatePresence mode="wait">
        {percent !== null && (
          <motion.div
            key={levelInfo.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center max-w-md"
          >
            <div className="text-xs font-bold text-primaryOrange uppercase tracking-widest mb-1">
              {levelInfo.title}
            </div>
            <p className="text-sm text-darkerGray leading-relaxed">
              {levelInfo.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm */}
      <motion.button
        type="button"
        onClick={handleConfirm}
        disabled={percent === null || isConfirming}
        animate={{
          opacity: percent === null ? 0.4 : 1,
          y: percent === null ? 10 : 0,
        }}
        whileHover={percent !== null ? { scale: 1.04 } : {}}
        whileTap={percent !== null ? { scale: 0.97 } : {}}
        className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-white font-black text-base md:text-lg disabled:cursor-not-allowed"
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
