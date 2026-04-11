"use client";

import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useState } from "react";
import StepHeading from "../shared/StepHeading";
import { PERSONALITY_STATEMENTS } from "@/lib/bea-ai/onboarding";

interface Step9Props {
  onSelect: (answers: Record<string, boolean>) => void;
}

const SWIPE_THRESHOLD = 80;

/**
 * STEP 9 — Personality (Swipe Cards)
 *
 * Pattern: Tinder-style swipe cards.
 * 5 statements — user swipes right (yes) or left (no).
 * On desktop, they can also click the Yes/No buttons.
 * Each card shows a mascot in the background that matches the statement.
 */
export default function Step9Personality({ onSelect }: Step9Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );

  const currentStatement = PERSONALITY_STATEMENTS[currentIdx];
  const isComplete = currentIdx >= PERSONALITY_STATEMENTS.length;
  const progress = (currentIdx / PERSONALITY_STATEMENTS.length) * 100;

  const handleAnswer = (agreed: boolean) => {
    if (!currentStatement) return;
    setExitDirection(agreed ? "right" : "left");

    const newAnswers = { ...answers, [currentStatement.id]: agreed };
    setAnswers(newAnswers);

    setTimeout(() => {
      setExitDirection(null);
      if (currentIdx + 1 >= PERSONALITY_STATEMENTS.length) {
        onSelect(newAnswers);
      } else {
        setCurrentIdx(currentIdx + 1);
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
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 9 — Deine Gewohnheiten"
        title={
          <>
            Kurze Frage:{" "}
            <span className="text-primaryOrange">Wer bist du wirklich?</span>
          </>
        }
        subtitle="Swipe oder klicke — Ja wenn es auf dich zutrifft, Nein wenn nicht."
      />

      {/* Progress indicator (substeps) */}
      <div className="mt-6 md:mt-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-2">
          {PERSONALITY_STATEMENTS.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ background: "#FED4B0" }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: idx < currentIdx ? "100%" : "0%",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
                style={{
                  background: "linear-gradient(to right, #E87720, #F08A3C)",
                }}
              />
            </div>
          ))}
        </div>
        <div className="text-[11px] font-semibold text-lightGray text-center">
          {Math.min(currentIdx + 1, PERSONALITY_STATEMENTS.length)} von{" "}
          {PERSONALITY_STATEMENTS.length}
        </div>
      </div>

      {/* Card stack area */}
      <div className="relative mt-8 md:mt-10 w-full max-w-md h-[360px] md:h-[400px]">
        <AnimatePresence mode="wait">
          {currentStatement && !isComplete && (
            <motion.div
              key={currentStatement.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
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
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={handleDragEnd}
              whileDrag={{ rotate: 0, cursor: "grabbing" }}
              className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
                border: "2px solid #F0E5D8",
                boxShadow: "0 24px 60px rgba(232,119,32,0.18)",
              }}
            >
              {/* Background mascot */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
              >
                <div className="relative w-56 h-56">
                  <Image
                    src={currentStatement.mascot}
                    alt=""
                    fill
                    sizes="224px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Card content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-10 text-center">
                <div className="text-[10px] md:text-[11px] font-bold text-primaryOrange uppercase tracking-widest mb-4">
                  Frage {currentIdx + 1}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-darkerGray leading-tight max-w-sm">
                  {currentStatement.statement}
                </h3>
                <div className="mt-auto flex items-center gap-2 text-[10px] md:text-xs text-lightGray font-semibold">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7l4-4m0 0l4 4m-4-4v18"
                    />
                  </svg>
                  Swipe oder klicke
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Yes / No buttons */}
      {currentStatement && !isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8 flex items-center gap-4"
        >
          {/* No */}
          <motion.button
            type="button"
            onClick={() => handleAnswer(false)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-sm md:text-base bg-white"
            style={{
              border: "2px solid #F0E5D8",
              color: "#161616",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {currentStatement.negativeLabel}
          </motion.button>

          {/* Yes */}
          <motion.button
            type="button"
            onClick={() => handleAnswer(true)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-sm md:text-base text-white"
            style={{
              background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
              boxShadow: "0 12px 32px rgba(232,119,32,0.35)",
            }}
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {currentStatement.positiveLabel}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
