"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useTranslations } from "next-intl";
// LIBS
import { PERSONALITY_STATEMENTS } from "@/lib/bea-ai/onboarding";

// TYPES
interface Step10Props {
  onSelect: (answers: Record<string, boolean>) => void;
}
// CONSTANTS
const SWIPE_THRESHOLD = 80;
const BUBBLE_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const SWIPE_CARD_STYLE = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow:
    "0 24px 60px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const NEGATIVE_BUTTON_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  color: "#161616",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
} as const;
const POSITIVE_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 12px 32px rgba(232,119,32,0.35)",
} as const;
const PROGRESS_TRACK_STYLE = {
  background: "rgba(232,119,32,0.12)",
} as const;
const PROGRESS_FILL_STYLE = {
  background: "linear-gradient(to right, #E87720, #F08A3C)",
} as const;

/**
 * STEP 10 — Personality / Habits (Swipe Cards)
 *
 * Conversational pattern matching Steps 1-9:
 * Bea introduces the swipe quiz, user swipes through 5 statements
 * (or clicks Yes/No buttons). Each statement is a habit the user
 * either has or doesn't — used by Bea to build a maturity profile.
 */
export default function Step10Personality({ onSelect }: Step10Props) {
  // STATE
  const t = useTranslations("onboarding.beaAi.step10");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );
  // CONSTANTS
  const currentStatement = PERSONALITY_STATEMENTS[currentIdx];
  const isComplete = currentIdx >= PERSONALITY_STATEMENTS.length;
  const progress = (currentIdx / PERSONALITY_STATEMENTS.length) * 100;
  // FUNCTIONS
  const handleAnswer = (agreed: boolean) => {
    if (!currentStatement || isAdvancing) return;
    setIsAdvancing(true);
    setExitDirection(agreed ? "right" : "left");

    const newAnswers = { ...answers, [currentStatement.id]: agreed };
    setAnswers(newAnswers);

    setTimeout(() => {
      setExitDirection(null);
      if (currentIdx + 1 >= PERSONALITY_STATEMENTS.length) {
        setTimeout(() => onSelect(newAnswers), 200);
      } else {
        setCurrentIdx(currentIdx + 1);
        setIsAdvancing(false);
      }
    }, 400);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      handleAnswer(true);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      handleAnswer(false);
    }
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
              alt="Bea"
              priority
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
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-darkerGray/50">
          {t("progress.statement", {
            current: Math.min(currentIdx + 1, PERSONALITY_STATEMENTS.length),
            total: PERSONALITY_STATEMENTS.length,
          })}
        </span>
        <div
          style={PROGRESS_TRACK_STYLE}
          className="relative h-1.5 flex-1 overflow-hidden rounded-full"
        >
          <motion.div
            style={PROGRESS_FILL_STYLE}
            className="absolute inset-y-0 left-0 rounded-full"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            animate={{
              width: `${progress + (isAdvancing ? 100 / PERSONALITY_STATEMENTS.length : 0)}%`,
            }}
          />
        </div>
      </div>
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
        <div className="flex w-full flex-col items-center">
          <div className="relative h-[360px] w-full max-w-md md:h-[400px]">
            <AnimatePresence mode="wait">
              {currentStatement && !isComplete && (
                <motion.div
                  drag="x"
                  dragElastic={0.25}
                  style={SWIPE_CARD_STYLE}
                  onDragEnd={handleDragEnd}
                  key={currentStatement.id}
                  dragConstraints={{ left: 0, right: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  whileDrag={{ rotate: 0, cursor: "grabbing" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 cursor-grab overflow-hidden rounded-3xl rounded-tr-md active:cursor-grabbing"
                  exit={{
                    x:
                      exitDirection === "right"
                        ? 400
                        : exitDirection === "left"
                          ? -400
                          : 0,
                    opacity: 0,
                    rotate:
                      exitDirection === "right"
                        ? 20
                        : exitDirection === "left"
                          ? -20
                          : 0,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25"
                  >
                    <div className="relative h-56 w-56">
                      <Image
                        alt=""
                        fill
                        sizes="224px"
                        className="object-contain"
                        src={currentStatement.mascot}
                      />
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-[220px] w-[220px] rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(232,119,32,0.1) 0%, transparent 60%)",
                    }}
                  />
                  <div className="relative flex h-full flex-col items-center justify-center p-8 text-center md:p-10">
                    <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primaryOrange md:text-[11px]">
                      {t("card.statementIndex", { current: currentIdx + 1 })}
                    </div>
                    <h3 className="max-w-sm text-xl font-black leading-tight text-darkerGray md:text-2xl">
                      {currentStatement.statement}
                    </h3>
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-semibold text-lightGray md:text-xs">
                      <svg
                        fill="none"
                        strokeWidth={2}
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                      {t("card.swipeOrClick")}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {currentStatement && !isComplete && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              className="mt-8 flex items-center gap-4"
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <motion.button
                type="button"
                disabled={isAdvancing}
                whileTap={{ scale: 0.95 }}
                style={NEGATIVE_BUTTON_STYLE}
                onClick={() => handleAnswer(false)}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black disabled:opacity-50 md:px-8 md:py-4 md:text-base"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {currentStatement.negativeLabel}
              </motion.button>
              <motion.button
                type="button"
                disabled={isAdvancing}
                whileTap={{ scale: 0.95 }}
                style={POSITIVE_BUTTON_STYLE}
                onClick={() => handleAnswer(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black text-white disabled:opacity-50 md:px-8 md:py-4 md:text-base"
              >
                <svg
                  fill="none"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4 md:h-5 md:w-5"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {currentStatement.positiveLabel}
              </motion.button>
            </motion.div>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="mt-5 text-center text-xs text-gray-400"
          >
            {t("hint")}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
