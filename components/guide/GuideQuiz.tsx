"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";

export interface QuizOption {
  label: string;
  correct?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

interface GuideQuizProps {
  title?: string;
  questions: QuizQuestion[];
}

export default function GuideQuiz({
  title = "Wissens-Check",
  questions,
}: GuideQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ];
  if (!q) return null;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (q.options[idx]?.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="my-8 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h4 className="text-darkerGray font-bold text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primaryOrange" />
          {title}
        </h4>
        {!finished && (
          <span className="text-xs text-lightGray">
            Frage {currentQ + 1}/{questions.length}
          </span>
        )}
      </div>

      {/* Progress dots */}
      {!finished && (
        <div className="px-5 pb-3 flex items-center gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-colors duration-300 ${
                i < currentQ
                  ? "bg-primaryOrange"
                  : i === currentQ
                  ? "bg-primaryOrange/50"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      )}

      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          {finished ? (
            /* ── Score screen ── */
            <motion.div
              key="score"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <div className="text-4xl mb-3">
                {score === questions.length ? "🎉" : score >= questions.length / 2 ? "💪" : "📚"}
              </div>
              <p className="text-darkerGray font-bold text-lg mb-1">
                {score}/{questions.length} richtig
              </p>
              <p className="text-lightGray text-sm mb-4">
                {score === questions.length
                  ? "Perfekt! Du hast alles verstanden."
                  : score >= questions.length / 2
                  ? "Gut gemacht! Lies die Abschnitte nochmal durch."
                  : "Kein Problem — lies den Guide nochmal und versuch es erneut!"}
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primaryOrange text-white text-sm font-bold hover:bg-darkOrange transition-colors"
              >
                Nochmal versuchen
              </button>
            </motion.div>
          ) : (
            /* ── Question ── */
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-darkerGray font-medium text-base mb-4 leading-relaxed">
                {q.question}
              </p>

              <div className="space-y-2 mb-4">
                {q.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = opt.correct;

                  let style = "border-gray-200 bg-gray-50 hover:border-primaryOrange/30";
                  if (showResult && isSelected && isCorrect) {
                    style = "border-green-200 bg-green-50";
                  } else if (showResult && isSelected && !isCorrect) {
                    style = "border-red-200 bg-red-50";
                  } else if (showResult && isCorrect) {
                    style = "border-green-200 bg-green-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={showResult}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${style} ${
                        !showResult ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold text-lightGray">
                        {showResult ? (
                          isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </span>
                      <span
                        className={`text-sm ${
                          showResult && isCorrect
                            ? "text-green-700 font-medium"
                            : showResult && isSelected && !isCorrect
                            ? "text-red-700"
                            : "text-darkerGray"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2.5 px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 mb-4">
                      <Lightbulb className="w-4 h-4 text-primaryOrange flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-lightGray leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full px-4 py-2.5 rounded-xl bg-primaryOrange text-white text-sm font-bold hover:bg-darkOrange transition-colors"
                    >
                      {currentQ < questions.length - 1 ? "Nächste Frage" : "Ergebnis anzeigen"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
