"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
// LIBS
import {
  type MoneyFeeling,
  FEELING_TRANSITIONS,
  GELDPRAEGUNG_OPTIONS,
  MONEY_FEELING_OPTIONS,
} from "@/lib/bea-ai/onboarding";

// TYPES
interface Step11Props {
  onSelect: (feeling: MoneyFeeling, praegung: string) => void;
}
// CONSTANTS
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const FEELING_BASE_STYLE = {
  border: "1.5px solid #F0E5D8",
  boxShadow: "0 4px 16px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
} as const;
const FEELING_FREEDOM_HOVER_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.45)",
  boxShadow:
    "0 16px 40px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.2)",
} as const;
const FEELING_FREEDOM_SELECTED_STYLE = {
  border: "1.5px solid #E87720",
  boxShadow:
    "0 20px 48px rgba(232,119,32,0.25), 0 0 0 2px rgba(232,119,32,0.4)",
} as const;
const FEELING_STRESS_HOVER_STYLE = {
  border: "1.5px solid rgba(100,100,100,0.45)",
  boxShadow:
    "0 16px 40px rgba(100,100,100,0.16), 0 0 0 1px rgba(100,100,100,0.18)",
} as const;
const FEELING_STRESS_SELECTED_STYLE = {
  border: "1.5px solid #4B5563",
  boxShadow: "0 20px 48px rgba(75,85,99,0.22), 0 0 0 2px rgba(75,85,99,0.4)",
} as const;
const PRAEGUNG_UNSELECTED_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 4px 16px rgba(232,119,32,0.06)",
} as const;
const PRAEGUNG_HOVER_STYLE = {
  background: "#FFFCF8",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.14), 0 0 0 1px rgba(232,119,32,0.15)",
} as const;
const PRAEGUNG_SELECTED_STYLE = {
  border: "1.5px solid #E87720",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.3)",
} as const;
const CHECK_BADGE_FREEDOM_STYLE = {
  boxShadow: "0 6px 16px rgba(232,119,32,0.45)",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;
const CHECK_BADGE_STRESS_STYLE = {
  boxShadow: "0 6px 16px rgba(75,85,99,0.45)",
  background: "linear-gradient(135deg, #4B5563 0%, #6B7280 100%)",
} as const;
const REACTION_BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.12)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;

/**
 * STEP 11 — Geld-Gefühl + Prägung
 *
 * Two phases in one step, both in the chat pattern:
 * Phase 1: Bea asks about the user's feeling about money (Freiheit/Stress).
 * After the answer, Bea reacts in a mini-bubble and asks the follow-up.
 * Phase 2: User picks how money was discussed at home (5 imprint options).
 * Then advances to the next step.
 */
export default function Step11GeldGefuehl({ onSelect }: Step11Props) {
  // STATE
  const t = useTranslations("onboarding.beaAi.step11");
  const [showTransition, setShowTransition] = useState(false);
  const [feeling, setFeeling] = useState<MoneyFeeling | null>(null);
  const [phase, setPhase] = useState<"feeling" | "praegung">("feeling");
  const [hoveredPraegung, setHoveredPraegung] = useState<string | null>(null);
  const [selectedPraegung, setSelectedPraegung] = useState<string | null>(null);
  const [hoveredFeeling, setHoveredFeeling] = useState<MoneyFeeling | null>(
    null,
  );
  // FUNCTIONS
  const handleFeelingSelect = (id: MoneyFeeling) => {
    if (feeling) return;
    setFeeling(id);
    // Show Bea's reaction first, then let the user continue manually.
    setTimeout(() => setShowTransition(true), 400);
  };
  const handlePraegungSelect = (id: string) => {
    if (selectedPraegung || !feeling) return;
    setSelectedPraegung(id);
    setTimeout(() => onSelect(feeling, id), 550);
  };
  const getFeelingStyle = (id: MoneyFeeling) => {
    const isFreedom = id === "freedom";
    if (feeling === id) {
      return isFreedom
        ? FEELING_FREEDOM_SELECTED_STYLE
        : FEELING_STRESS_SELECTED_STYLE;
    }
    if (hoveredFeeling === id && !feeling) {
      return isFreedom
        ? FEELING_FREEDOM_HOVER_STYLE
        : FEELING_STRESS_HOVER_STYLE;
    }
    return FEELING_BASE_STYLE;
  };
  const getPraegungStyle = (id: string) => {
    if (selectedPraegung === id) return PRAEGUNG_SELECTED_STYLE;
    if (hoveredPraegung === id && !selectedPraegung)
      return PRAEGUNG_HOVER_STYLE;
    return PRAEGUNG_UNSELECTED_STYLE;
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        className="mb-8 flex items-start gap-3 md:gap-4"
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
              {t("phase1.titlePrefix")}{" "}
              <span className="text-primaryOrange">
                {t("phase1.titleHighlight")}
              </span>{" "}
              {t("phase1.titleSuffix")}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-lightGray md:text-[15px]">
              {t("phase1.description")}
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
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {MONEY_FEELING_OPTIONS.map((option, idx) => {
            const isSelected = feeling === option.id;
            const isDimmed = feeling !== null && !isSelected;

            return (
              <motion.button
                type="button"
                key={option.id}
                whileTap={{ scale: 0.98 }}
                disabled={feeling !== null}
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ y: feeling ? 0 : -6 }}
                onMouseLeave={() => setHoveredFeeling(null)}
                onClick={() => handleFeelingSelect(option.id)}
                onMouseEnter={() => setHoveredFeeling(option.id)}
                className="group relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-3xl rounded-tr-md p-6 text-center transition-all duration-300 disabled:cursor-default md:min-h-[300px] md:p-8"
                animate={{
                  y: 0,
                  opacity: isDimmed ? 0.3 : 1,
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.55 + idx * 0.07,
                }}
                style={{
                  ...getFeelingStyle(option.id),
                  background: option.gradient,
                }}
              >
                <motion.div
                  className="relative mb-3 h-24 w-24 md:h-32 md:w-32"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  animate={{
                    scale:
                      hoveredFeeling === option.id || isSelected ? 1.08 : 1,
                    y: hoveredFeeling === option.id || isSelected ? -6 : 0,
                  }}
                >
                  <Image
                    fill
                    sizes="128px"
                    alt={option.label}
                    src={option.mascot}
                    className="object-contain"
                    style={{
                      filter:
                        option.id === "freedom"
                          ? "drop-shadow(0 12px 24px rgba(232,119,32,0.25))"
                          : "drop-shadow(0 12px 24px rgba(0,0,0,0.2))",
                    }}
                  />
                </motion.div>
                <div className="relative mb-1 text-2xl md:text-3xl">
                  {option.emoji}
                </div>
                <h3 className="relative mb-2 text-2xl font-black leading-none tracking-tight text-darkerGray md:text-3xl">
                  {option.label}
                </h3>
                <p className="relative max-w-xs text-center text-xs font-medium text-darkerGray/70 md:text-sm">
                  {option.description}
                </p>
                {isSelected && (
                  <motion.div
                    animate={{ scale: 1, rotate: 0 }}
                    initial={{ scale: 0, rotate: -30 }}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white"
                    transition={{
                      damping: 18,
                      type: "spring",
                      stiffness: 300,
                    }}
                    style={
                      option.id === "freedom"
                        ? CHECK_BADGE_FREEDOM_STYLE
                        : CHECK_BADGE_STRESS_STYLE
                    }
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
        <AnimatePresence>
          {showTransition && feeling && (
            <motion.div
              className="mt-6 self-start"
              exit={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start gap-2.5">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                    <Image
                      fill
                      alt="Bea"
                      className="object-contain"
                      src="/Maskottchen/Maskottchen-Right.png"
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
                  <div
                    style={REACTION_BUBBLE_STYLE}
                    className="inline-block rounded-2xl rounded-tl-md px-4 py-2.5 text-sm font-semibold leading-snug text-darkerGray md:text-[15px]"
                  >
                    {FEELING_TRANSITIONS[feeling]}
                  </div>
                  {phase === "feeling" && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        setShowTransition(false);
                        setPhase("praegung");
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black text-white md:text-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
                        boxShadow: "0 8px 20px rgba(232,119,32,0.28)",
                      }}
                    >
                      {t("phase1.continueButton")}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {phase === "praegung" && (
            <motion.div
              className="mt-12 w-full"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 flex items-start gap-3 md:gap-4">
                <div className="relative h-12 w-12 flex-shrink-0 md:h-14 md:w-14">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                    <Image
                      fill
                      alt="Bea"
                      className="object-contain"
                      src="/Maskottchen/Maskottchen-Right.png"
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
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primaryOrange">
                      {t("speaker.bea")}
                    </span>
                  </div>
                  <div
                    style={BUBBLE_STYLE}
                    className="relative inline-block max-w-2xl rounded-2xl rounded-tl-md px-5 py-4 md:px-6 md:py-5"
                  >
                    <p className="text-base font-semibold leading-relaxed text-darkerGray md:text-lg">
                      {t("phase2.titlePrefix")}{" "}
                      <span className="text-primaryOrange">
                        {t("phase2.titleHighlight")}
                      </span>{" "}
                      {t("phase2.titleSuffix")}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-lightGray md:text-[15px]">
                      {t("phase2.description")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-3 flex items-center justify-end gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-darkerGray/60">
                  {t("speaker.you")}
                </span>
              </div>
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {GELDPRAEGUNG_OPTIONS.map((option, idx) => {
                  const isSelected = selectedPraegung === option.id;
                  const isDimmed = selectedPraegung !== null && !isSelected;

                  return (
                    <motion.button
                      type="button"
                      key={option.id}
                      whileTap={{ scale: 0.97 }}
                      disabled={!!selectedPraegung}
                      initial={{ opacity: 0, y: 16 }}
                      style={getPraegungStyle(option.id)}
                      whileHover={{ y: selectedPraegung ? 0 : -4 }}
                      onMouseLeave={() => setHoveredPraegung(null)}
                      onClick={() => handlePraegungSelect(option.id)}
                      onMouseEnter={() => setHoveredPraegung(option.id)}
                      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl p-5 text-center transition-all duration-300 disabled:cursor-default md:p-6"
                      animate={{
                        y: 0,
                        opacity: isDimmed ? 0.35 : 1,
                        scale: isSelected ? 1.03 : 1,
                      }}
                      transition={{
                        duration: 0.45,
                        delay: 0.2 + idx * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <motion.div
                        className="text-4xl md:text-5xl"
                        animate={{
                          y:
                            hoveredPraegung === option.id || isSelected
                              ? -3
                              : 0,
                          scale:
                            hoveredPraegung === option.id || isSelected
                              ? 1.1
                              : 1,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          filter:
                            hoveredPraegung === option.id || isSelected
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
                          style={CHECK_BADGE_FREEDOM_STYLE}
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
          )}
        </AnimatePresence>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-4 text-center text-sm text-gray-400"
          animate={{
            opacity:
              feeling && phase === "feeling" ? 0 : selectedPraegung ? 0 : 1,
          }}
        >
          {t("hint")}
        </motion.p>
      </div>
    </div>
  );
}
