"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import StepHeading from "../shared/StepHeading";
import BeaPresence from "../shared/BeaPresence";
import { KNOWLEDGE_QUIZ, type QuizAnswer } from "@/lib/bea-ai/onboarding";

interface Step5Props {
  onSelect: (answerId: string, correct: boolean) => void;
}

/**
 * STEP 5 — Knowledge Quiz
 *
 * Pattern: Multiple choice with instant feedback.
 * User picks an answer → correct one lights up green, incorrect stays neutral.
 * Bea reacts with a personalized response depending on the choice.
 * This is the only step where we actually TEST the user instead of asking.
 */
export default function Step5KnowledgeQuiz({ onSelect }: Step5Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswer | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (answer: QuizAnswer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setTimeout(() => setShowFeedback(true), 400);
  };

  const handleContinue = () => {
    if (!selectedAnswer) return;
    onSelect(selectedAnswer.id, selectedAnswer.correct);
  };

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 5 — Kleiner Check"
        title={
          <>
            Eine <span className="text-primaryOrange">kleine Frage</span> an
            dich
          </>
        }
        subtitle="Kein Druck — ich will nur sehen wo wir wirklich stehen."
      />

      {/* Big mascot */}
      {!showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 md:mt-10"
        >
          <BeaPresence
            mascotSrc="/Maskottchen/Maskottchen-Beratung.webp"
            size="md"
          />
        </motion.div>
      )}

      {/* Feedback mascot */}
      {showFeedback && selectedAnswer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 md:mt-10"
        >
          <BeaPresence
            mascotSrc={
              selectedAnswer.correct
                ? "/Maskottchen/Maskottchen-Freude.webp"
                : "/Maskottchen/Maskottchen-Beratung.webp"
            }
            size="md"
          />
        </motion.div>
      )}

      {/* Quiz question */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 md:mt-10 w-full max-w-2xl"
      >
        <div
          className="relative rounded-3xl p-6 md:p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
            border: "2px solid rgba(232,119,32,0.2)",
          }}
        >
          <div className="text-[10px] md:text-[11px] font-bold text-primaryOrange uppercase tracking-widest mb-3">
            Finanz-Quiz
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-darkerGray leading-tight">
            {KNOWLEDGE_QUIZ.question}
          </h3>
        </div>
      </motion.div>

      {/* Answer options */}
      <div className="mt-6 w-full max-w-2xl space-y-3">
        {KNOWLEDGE_QUIZ.answers.map((answer, idx) => {
          const isSelected = selectedAnswer?.id === answer.id;
          const isRevealed = selectedAnswer !== null;
          const isCorrect = answer.correct;
          const showAsCorrect = isRevealed && isCorrect;
          const showAsWrong = isSelected && !isCorrect;

          return (
            <motion.button
              key={answer.id}
              type="button"
              onClick={() => handleSelect(answer)}
              disabled={isRevealed}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isRevealed && !isSelected && !isCorrect ? 0.5 : 1,
                x: 0,
              }}
              transition={{
                delay: 0.4 + idx * 0.08,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={!isRevealed ? { scale: 1.02, x: 4 } : {}}
              whileTap={!isRevealed ? { scale: 0.98 } : {}}
              className="w-full relative flex items-center gap-4 rounded-2xl p-4 md:p-5 text-left transition-all duration-300"
              style={{
                background: showAsCorrect
                  ? "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
                  : showAsWrong
                    ? "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)"
                    : "#FFFFFF",
                border: `2px solid ${
                  showAsCorrect
                    ? "#10B981"
                    : showAsWrong
                      ? "#EF4444"
                      : "#F0E5D8"
                }`,
                boxShadow: showAsCorrect
                  ? "0 8px 24px rgba(16,185,129,0.2)"
                  : showAsWrong
                    ? "0 8px 24px rgba(239,68,68,0.15)"
                    : "0 4px 12px rgba(232,119,32,0.06)",
                cursor: isRevealed ? "default" : "pointer",
              }}
            >
              {/* Letter badge */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                style={{
                  background: showAsCorrect
                    ? "#10B981"
                    : showAsWrong
                      ? "#EF4444"
                      : "#FFF8F3",
                  color: showAsCorrect || showAsWrong ? "#FFFFFF" : "#E87720",
                  border: `2px solid ${
                    showAsCorrect
                      ? "#10B981"
                      : showAsWrong
                        ? "#EF4444"
                        : "#FED4B0"
                  }`,
                }}
              >
                {answer.id.toUpperCase()}
              </div>

              <span className="flex-1 text-sm md:text-base text-darkerGray font-semibold leading-snug">
                {answer.text}
              </span>

              {showAsCorrect && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-white"
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
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback + Continue */}
      <AnimatePresence>
        {showFeedback && selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 w-full max-w-2xl flex flex-col items-center gap-6"
          >
            <div
              className="rounded-2xl p-5 md:p-6 text-center max-w-xl"
              style={{
                background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
                border: "2px solid rgba(232,119,32,0.2)",
              }}
            >
              <p className="text-sm md:text-base text-darkerGray leading-relaxed font-medium">
                {selectedAnswer.feedback}
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
