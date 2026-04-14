"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
// LIBS
import {
  SCENARIOS,
  combineBiases,
  type ScenarioOption,
  BIAS_PATTERN_REACTIONS,
} from "@/lib/bea-ai/onboarding";

// TYPES
interface Step9Props {
  onSelect: (windfallBias: string, crisisBias: string) => void;
}
// CONSTANTS
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const SCENARIO_CARD_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.25)",
  boxShadow: "0 24px 60px rgba(232,119,32,0.15)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 50%, #FFEEDB 100%)",
} as const;
const SCENARIO_BLOB_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.15) 0%, transparent 60%)",
} as const;
const SCENARIO_EMOJI_BG_STYLE = {
  border: "2px solid rgba(232,119,32,0.3)",
  boxShadow: "0 12px 32px rgba(232,119,32,0.25)",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FED4B0 100%)",
} as const;
const OPTION_UNSELECTED_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 4px 16px rgba(232,119,32,0.06)",
} as const;
const OPTION_HOVER_STYLE = {
  background: "#FFFCF8",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.14), 0 0 0 1px rgba(232,119,32,0.15)",
} as const;
const OPTION_SELECTED_STYLE = {
  border: "1.5px solid #E87720",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.3)",
} as const;
const REACTION_BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.12)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const NEXT_BUTTON_STYLE = {
  boxShadow: "0 12px 32px rgba(232,119,32,0.35)",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;
const PROGRESS_TRACK_STYLE = {
  background: "rgba(232,119,32,0.12)",
} as const;
const PROGRESS_FILL_STYLE = {
  background: "linear-gradient(to right, #E87720, #F08A3C)",
} as const;
const CHECK_BADGE_STYLE = {
  boxShadow: "0 6px 16px rgba(232,119,32,0.45)",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;

/**
 * STEP 9 — Verhaltens-Szenarien (2 Situationen)
 *
 * Two scenarios in sequence: positive (windfall) + negative (crisis).
 * After both are answered, Bea gives a COMBINED reflection based on the
 * bias pattern, not individual answers. This catches users whose
 * "balanced" answer in one situation hides instability in the other.
 */
export default function Step9Scenario({ onSelect }: Step9Props) {
  // STATE
  const t = useTranslations("onboarding.beaAi.step9");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showFinalReaction, setShowFinalReaction] = useState(false);
  const [crisisChoice, setCrisisChoice] = useState<ScenarioOption | null>(null);
  const [windfallChoice, setWindfallChoice] = useState<ScenarioOption | null>(
    null,
  );
  // CONSTANTS
  const currentScenario = SCENARIOS[currentIdx];
  const isLastScenario = currentIdx === SCENARIOS.length - 1;
  const currentChoice = currentIdx === 0 ? windfallChoice : crisisChoice;
  const progress =
    ((currentIdx + (currentChoice ? 1 : 0)) / SCENARIOS.length) * 100;
  const biasPattern =
    windfallChoice && crisisChoice
      ? combineBiases(windfallChoice.bias, crisisChoice.bias)
      : null;
  const finalReactionText = biasPattern
    ? BIAS_PATTERN_REACTIONS[biasPattern]
    : "";
  // FUNCTIONS
  const handleSelect = (option: ScenarioOption) => {
    if (currentChoice || isAdvancing) return;

    if (currentIdx === 0) {
      setWindfallChoice(option);
    } else {
      setCrisisChoice(option);
    }

    // Auto-advance after a brief moment to let the selection register
    setTimeout(() => {
      if (isLastScenario) {
        setShowFinalReaction(true);
      } else {
        setCurrentIdx(currentIdx + 1);
        setHoveredId(null);
      }
    }, 600);
  };
  const handleContinue = () => {
    if (!windfallChoice || !crisisChoice || isAdvancing) return;
    setIsAdvancing(true);
    setTimeout(() => onSelect(windfallChoice.bias, crisisChoice.bias), 400);
  };
  const getOptionStyle = (id: string) => {
    if (currentChoice?.id === id) return OPTION_SELECTED_STYLE;
    if (hoveredId === id && !currentChoice) return OPTION_HOVER_STYLE;
    return OPTION_UNSELECTED_STYLE;
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        className="flex items-start gap-3 mb-10 md:gap-4"
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
              {t("bubble.description")}
            </p>
          </motion.div>
        </div>
      </motion.div>
      {!showFinalReaction && (
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-darkerGray/50">
            {t("progress.situation", {
              current: currentIdx + 1,
              total: SCENARIOS.length,
            })}
          </span>
          <div
            style={PROGRESS_TRACK_STYLE}
            className="relative h-1.5 flex-1 overflow-hidden rounded-full"
          >
            <motion.div
              style={PROGRESS_FILL_STYLE}
              animate={{ width: `${progress}%` }}
              className="absolute inset-y-0 left-0 rounded-full"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}
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
          {!showFinalReaction && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScenario.id}
                exit={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  style={SCENARIO_CARD_STYLE}
                  className="relative mb-5 overflow-hidden rounded-3xl rounded-tr-md p-6 md:p-8"
                >
                  <div
                    aria-hidden="true"
                    style={SCENARIO_BLOB_STYLE}
                    className="pointer-events-none absolute -right-24 -top-24 h-[280px] w-[280px] rounded-full"
                  />

                  <div className="relative mb-4 flex justify-center">
                    <motion.div
                      style={SCENARIO_EMOJI_BG_STYLE}
                      animate={{ scale: 1, rotate: 0 }}
                      initial={{ scale: 0, rotate: -10 }}
                      className="relative flex h-20 w-20 items-center justify-center rounded-full text-5xl md:h-24 md:w-24 md:text-6xl"
                      transition={{
                        delay: 0.2,
                        damping: 15,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {currentScenario.emoji}
                    </motion.div>
                  </div>
                  <div className="relative text-center">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primaryOrange md:text-[11px]">
                      {currentScenario.intro}
                    </p>
                    <p className="mx-auto max-w-lg whitespace-pre-line text-base font-bold leading-relaxed text-darkerGray md:text-xl">
                      {currentScenario.setup}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                  {currentScenario.options.map((option, idx) => {
                    const isSelected = currentChoice?.id === option.id;
                    const isDimmed = currentChoice !== null && !isSelected;

                    return (
                      <motion.button
                        type="button"
                        key={option.id}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 16 }}
                        style={getOptionStyle(option.id)}
                        disabled={currentChoice !== null}
                        onClick={() => handleSelect(option)}
                        onMouseLeave={() => setHoveredId(null)}
                        whileHover={{ y: currentChoice ? 0 : -4 }}
                        onMouseEnter={() => setHoveredId(option.id)}
                        className="group relative flex flex-col gap-1 overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 disabled:cursor-default md:p-5"
                        animate={{
                          opacity: isDimmed ? 0.35 : 1,
                          y: 0,
                          scale: isSelected ? 1.02 : 1,
                        }}
                        transition={{
                          delay: 0.3 + idx * 0.06,
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
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
              </motion.div>
            </AnimatePresence>
          )}
          <AnimatePresence>
            {showFinalReaction && windfallChoice && crisisChoice && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: t("summary.windfallLabel"),
                      choice: windfallChoice,
                    },
                    { label: t("summary.crisisLabel"), choice: crisisChoice },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      style={OPTION_SELECTED_STYLE}
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 10 }}
                      className="rounded-2xl p-4 md:p-5"
                      transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                    >
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primaryOrange">
                        {item.label}
                      </p>
                      <p className="text-sm font-black text-darkerGray md:text-base">
                        {item.choice.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 16 }}
                  className="flex items-start gap-3"
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="relative h-14 w-14 flex-shrink-0">
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        fill
                        alt="Bea"
                        className="object-contain scale-125"
                        src="/Maskottchen/Maskottchen-Beratung.webp"
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 right-0 flex h-3 w-3"
                    >
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    </span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primaryOrange">
                        {t("summary.beaThinkingLabel")}
                      </span>
                    </div>
                    <div
                      style={REACTION_BUBBLE_STYLE}
                      className="inline-block rounded-2xl rounded-tl-md px-5 py-4 md:px-6 md:py-4"
                    >
                      <p className="text-sm leading-relaxed text-darkerGray md:text-[15px]">
                        {finalReactionText}
                      </p>
                    </div>
                  </div>
                </motion.div>
                <div className="mt-5 flex justify-end">
                  <motion.button
                    type="button"
                    disabled={isAdvancing}
                    onClick={handleContinue}
                    style={NEXT_BUTTON_STYLE}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black text-white disabled:opacity-70 md:text-base"
                  >
                    {t("actions.understood")}
                    <svg
                      fill="none"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-4 w-4 md:h-5 md:w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.p
            initial={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="mt-6 text-center text-sm text-gray-400"
            animate={{
              opacity: currentChoice || showFinalReaction ? 0 : 1,
            }}
          >
            {t("hint")}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
