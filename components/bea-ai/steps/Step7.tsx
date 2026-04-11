"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import StepHeading from "../shared/StepHeading";
import BeaPresence from "../shared/BeaPresence";
import {
  SCENARIO_SETUP,
  SCENARIO_OPTIONS,
  type ScenarioOption,
} from "@/lib/bea-ai/onboarding";

interface Step7Props {
  onSelect: (insight: string) => void;
}

/**
 * STEP 7 — Scenario
 *
 * Pattern: Storybook card with a hypothetical situation.
 * User sees a "What would you do?" scenario, picks an answer,
 * and Bea reacts with insight about their bias.
 * This reveals real-world behavior better than "How do you think about money?".
 */
export default function Step7Scenario({ onSelect }: Step7Props) {
  const [selected, setSelected] = useState<ScenarioOption | null>(null);
  const [showReaction, setShowReaction] = useState(false);

  const handleSelect = (option: ScenarioOption) => {
    if (selected) return;
    setSelected(option);
    setTimeout(() => setShowReaction(true), 400);
  };

  const handleContinue = () => {
    if (!selected) return;
    onSelect(selected.insight);
  };

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 7 — Dein Bauchgefühl-Check"
        title={
          <>
            Stell dir mal <span className="text-primaryOrange">Folgendes</span>{" "}
            vor
          </>
        }
        subtitle="Eine hypothetische Situation — du antwortest einfach aus dem Bauch heraus."
      />

      {/* Scenario card — storybook style */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 md:mt-10 w-full max-w-2xl"
      >
        <div
          className="relative rounded-3xl p-6 md:p-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 50%, #FFEEDB 100%)",
            border: "2px solid rgba(232,119,32,0.2)",
            boxShadow: "0 24px 60px rgba(232,119,32,0.15)",
          }}
        >
          {/* Decorative corner blob */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-[280px] h-[280px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(232,119,32,0.15) 0%, transparent 60%)",
            }}
          />

          {/* Money emoji */}
          <div className="relative flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-5xl md:text-6xl"
              style={{
                background: "linear-gradient(135deg, #FFF8F3 0%, #FED4B0 100%)",
                border: "2px solid rgba(232,119,32,0.3)",
                boxShadow: "0 12px 32px rgba(232,119,32,0.25)",
              }}
            >
              💸
            </motion.div>
          </div>

          <div className="relative text-center">
            <div className="text-[10px] md:text-[11px] font-bold text-primaryOrange uppercase tracking-widest mb-3">
              Die Situation
            </div>
            <p className="text-base md:text-xl font-bold text-darkerGray leading-relaxed max-w-lg mx-auto">
              {SCENARIO_SETUP}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Answer options */}
      {!showReaction && (
        <div className="mt-6 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCENARIO_OPTIONS.map((option, idx) => {
            const isSelected = selected?.id === option.id;
            const isDimmed = selected !== null && !isSelected;

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: isDimmed ? 0.4 : 1,
                  y: 0,
                  scale: isSelected ? 1.03 : 1,
                }}
                transition={{
                  delay: 0.5 + idx * 0.08,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={!selected ? { y: -4, scale: 1.02 } : {}}
                whileTap={!selected ? { scale: 0.97 } : {}}
                className="relative rounded-2xl p-4 md:p-5 text-left transition-all duration-300"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)"
                    : "#FFFFFF",
                  border: `2px solid ${isSelected ? "#E87720" : "#F0E5D8"}`,
                  boxShadow: isSelected
                    ? "0 12px 32px rgba(232,119,32,0.18)"
                    : "0 4px 12px rgba(232,119,32,0.06)",
                  cursor: selected ? "default" : "pointer",
                }}
              >
                <h3 className="text-sm md:text-base font-black text-darkerGray leading-tight mb-1">
                  {option.label}
                </h3>
                <p className="text-[11px] md:text-xs text-lightGray leading-snug">
                  {option.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Bea's reaction */}
      <AnimatePresence>
        {showReaction && selected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 w-full max-w-2xl flex flex-col items-center gap-6"
          >
            <BeaPresence
              mascotSrc="/Maskottchen/Maskottchen-Beratung.webp"
              size="md"
            />

            <div
              className="rounded-2xl p-5 md:p-6 text-center max-w-xl"
              style={{
                background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
                border: "2px solid rgba(232,119,32,0.2)",
                boxShadow: "0 12px 32px rgba(232,119,32,0.12)",
              }}
            >
              <div className="text-[10px] font-bold text-primaryOrange uppercase tracking-widest mb-2">
                Bea denkt dazu
              </div>
              <p className="text-sm md:text-base text-darkerGray leading-relaxed font-medium">
                {selected.beaReaction}
              </p>
            </div>

            <motion.button
              type="button"
              onClick={handleContinue}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-white font-black text-base md:text-lg"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
