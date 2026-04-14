"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
// LIBS
import { KNOWLEDGE_QUIZ, type QuizAnswer } from "@/lib/bea-ai/onboarding";

// TYPES
interface Step8Props {
  onSelect: (correctCount: number, answeredIds: string[]) => void;
}
// CONSTANTS
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const QUESTION_CARD_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.25)",
  boxShadow: "0 12px 32px rgba(232,119,32,0.1)",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
} as const;
const ANSWER_DEFAULT_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 4px 12px rgba(232,119,32,0.05)",
} as const;
const ANSWER_HOVER_STYLE = {
  background: "#FFFCF8",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.12)",
} as const;
const ANSWER_CORRECT_STYLE = {
  border: "1.5px solid #10B981",
  boxShadow: "0 8px 24px rgba(16,185,129,0.2)",
  background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
} as const;
const ANSWER_WRONG_STYLE = {
  border: "1.5px solid #F59E0B",
  boxShadow: "0 8px 24px rgba(245,158,11,0.18)",
  background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
} as const;
const BADGE_DEFAULT_STYLE = {
  color: "#E87720",
  background: "#FFF8F3",
  border: "2px solid #FED4B0",
} as const;
const BADGE_CORRECT_STYLE = {
  color: "#FFFFFF",
  background: "#10B981",
  border: "2px solid #10B981",
} as const;
const BADGE_WRONG_STYLE = {
  color: "#FFFFFF",
  background: "#F59E0B",
  border: "2px solid #F59E0B",
} as const;
const FEEDBACK_BUBBLE_STYLE = {
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

/**
 * STEP 8 — Wissens-Check (3 questions)
 *
 * Conversational pattern matching Steps 1-7:
 * Bea introduces the quiz in her bubble, then walks the user through
 * three questions one at a time. Each question gets answered → feedback
 * shown → "weiter" advances. After question 3, the parent is called with
 * the total score. The "Weiß nicht" option is always available and never
 * judgmental — that's the whole point of the entschärft framing.
 */
export default function Step8KnowledgeQuiz({ onSelect }: Step8Props) {
  // STATE
  const t = useTranslations("onboarding.beaAi.step8");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswer | null>(null);
  // CONSTANTS
  const currentQuestion = KNOWLEDGE_QUIZ[currentIdx];
  const isLastQuestion = currentIdx === KNOWLEDGE_QUIZ.length - 1;
  const progress =
    ((currentIdx + (showFeedback ? 1 : 0)) / KNOWLEDGE_QUIZ.length) * 100;
  // FUNCTIONS
  const handleSelect = (answer: QuizAnswer) => {
    if (selectedAnswer || isAdvancing) return;
    setSelectedAnswer(answer);
    setTimeout(() => setShowFeedback(true), 350);
  };
  const handleNext = () => {
    if (!selectedAnswer || isAdvancing) return;

    const newAnsweredIds = [...answeredIds, selectedAnswer.id];
    const newCorrectCount = correctCount + (selectedAnswer.correct ? 1 : 0);

    setAnsweredIds(newAnsweredIds);
    setCorrectCount(newCorrectCount);

    if (isLastQuestion) {
      setIsAdvancing(true);
      setTimeout(() => onSelect(newCorrectCount, newAnsweredIds), 400);
      return;
    }

    // Advance to next question with a brief reset
    setIsAdvancing(true);
    setTimeout(() => {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsAdvancing(false);
    }, 300);
  };
  const getAnswerStyle = (answer: QuizAnswer) => {
    const isThisAnswer = selectedAnswer?.id === answer.id;
    const revealed = selectedAnswer !== null;

    if (revealed && answer.correct) return ANSWER_CORRECT_STYLE;
    if (isThisAnswer && !answer.correct) return ANSWER_WRONG_STYLE;
    if (hoveredId === answer.id && !revealed) return ANSWER_HOVER_STYLE;
    return ANSWER_DEFAULT_STYLE;
  };
  const getBadgeStyle = (answer: QuizAnswer) => {
    const isThisAnswer = selectedAnswer?.id === answer.id;
    const revealed = selectedAnswer !== null;

    if (revealed && answer.correct) return BADGE_CORRECT_STYLE;
    if (isThisAnswer && !answer.correct) return BADGE_WRONG_STYLE;
    return BADGE_DEFAULT_STYLE;
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-8 pt-5 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        className="flex items-start gap-3 mb-5 md:mb-8 md:gap-4"
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
            className="relative inline-block max-w-2xl rounded-2xl rounded-tl-md px-4 py-3 md:px-6 md:py-5"
            transition={{
              delay: 0.25,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="text-[15px] font-semibold leading-relaxed text-darkerGray sm:text-base md:text-lg">
              {t("bubble.titlePrefix")}{" "}
              <span className="text-primaryOrange">
                {t("bubble.titleHighlight")}
              </span>
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-lightGray sm:text-sm md:text-[15px]">
              {t("bubble.description")}
            </p>
          </motion.div>
        </div>
      </motion.div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-darkerGray/50">
          {t("progress.question", {
            current: currentIdx + 1,
            total: KNOWLEDGE_QUIZ.length,
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
          <AnimatePresence mode="wait">
            <motion.div
              className="space-y-4"
              key={currentQuestion.id}
              exit={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={QUESTION_CARD_STYLE}
                className="relative overflow-hidden rounded-3xl rounded-tr-md p-6 md:p-8"
              >
                {currentQuestion.intro && (
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-primaryOrange">
                    {currentQuestion.intro}
                  </p>
                )}
                <h3 className="text-lg font-black leading-tight text-darkerGray md:text-xl">
                  {currentQuestion.question}
                </h3>
              </div>
              <div className="space-y-2.5">
                {currentQuestion.answers.map((answer, idx) => (
                  <motion.button
                    type="button"
                    key={answer.id}
                    whileTap={{ scale: 0.98 }}
                    style={getAnswerStyle(answer)}
                    initial={{ opacity: 0, x: 20 }}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleSelect(answer)}
                    onMouseLeave={() => setHoveredId(null)}
                    whileHover={{ x: selectedAnswer ? 0 : 4 }}
                    onMouseEnter={() => setHoveredId(answer.id)}
                    className="group relative flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 disabled:cursor-default md:p-5"
                    animate={{
                      opacity:
                        selectedAnswer &&
                        selectedAnswer.id !== answer.id &&
                        !answer.correct
                          ? 0.4
                          : 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + idx * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      style={getBadgeStyle(answer)}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-black transition-all duration-300"
                    >
                      {answer.id.toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm font-semibold leading-snug text-darkerGray md:text-base">
                      {answer.text}
                    </span>
                    {selectedAnswer && answer.correct && (
                      <motion.div
                        animate={{ scale: 1, rotate: 0 }}
                        initial={{ scale: 0, rotate: -180 }}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500"
                        transition={{
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <svg
                          fill="none"
                          strokeWidth={3.5}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-4 w-4 text-white"
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
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {showFeedback && selectedAnswer && (
              <motion.div
                className="mt-5"
                exit={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 16 }}
                key={`feedback-${currentQuestion.id}`}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative h-14 w-14 flex-shrink-0">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                      <Image
                        fill
                        alt="Bea"
                        className="object-contain scale-125"
                        src={
                          selectedAnswer.correct
                            ? "/Maskottchen/Maskottchen-Freude.webp"
                            : "/Maskottchen/Maskottchen-Beratung.webp"
                        }
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
                      style={FEEDBACK_BUBBLE_STYLE}
                      className="inline-block rounded-2xl rounded-tl-md px-5 py-3.5 md:px-6 md:py-4"
                    >
                      <p className="text-sm leading-relaxed text-darkerGray md:text-[15px]">
                        {selectedAnswer.feedback}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    disabled={isAdvancing}
                    style={NEXT_BUTTON_STYLE}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black text-white disabled:opacity-70 md:text-base"
                  >
                    {isLastQuestion
                      ? t("actions.finishQuiz")
                      : t("actions.nextQuestion")}
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
            transition={{ delay: 0.8, duration: 0.4 }}
            animate={{ opacity: selectedAnswer ? 0 : 1 }}
            className="mt-6 text-center text-sm text-gray-400"
          >
            {t("hint")}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
