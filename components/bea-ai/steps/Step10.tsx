"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import StepHeading from "../shared/StepHeading";
import BeaPresence from "../shared/BeaPresence";
import { GOAL_PLACEHOLDERS, GOAL_MAX_LENGTH } from "@/lib/bea-ai/onboarding";

interface Step10Props {
  onSelect: (goal: string) => void;
}

const PLACEHOLDER_ROTATION_MS = 2600;

/**
 * STEP 10 — Personal Goal (Free Text)
 *
 * Pattern: Single large text input with rotating placeholders.
 * After 9 button interactions, this gives the user room for their own words.
 * Placeholder cycles through real example goals every ~2.6s when empty.
 * "Skip" option — user doesn't have to write anything.
 */
export default function Step10Goal({ onSelect }: Step10Props) {
  const [value, setValue] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Rotate placeholder while empty and unfocused
  useEffect(() => {
    if (value.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % GOAL_PLACEHOLDERS.length);
    }, PLACEHOLDER_ROTATION_MS);
    return () => clearInterval(interval);
  }, [value]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  const handleSubmit = (skipped = false) => {
    if (isConfirming) return;
    setIsConfirming(true);
    setTimeout(() => onSelect(skipped ? "" : value.trim()), 400);
  };

  const canSubmit = value.trim().length > 0;

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 10 — Dein Ziel"
        title={
          <>
            Was willst du als{" "}
            <span className="text-primaryOrange">erstes ändern?</span>
          </>
        }
        subtitle="In deinen eigenen Worten. Ein Satz reicht. Überspringen ist okay."
      />

      {/* Big Bea mascot */}
      <div className="mt-8 md:mt-10">
        <BeaPresence
          mascotSrc="/Maskottchen/Maskottchen-Hero.webp"
          label="Ich höre zu"
          size="lg"
        />
      </div>

      {/* Text input area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 md:mt-10 w-full max-w-2xl"
      >
        <div
          className="relative rounded-3xl overflow-hidden transition-all duration-300"
          style={{
            background: "#FFFFFF",
            border: `2px solid ${isFocused ? "#E87720" : "#F0E5D8"}`,
            boxShadow: isFocused
              ? "0 20px 48px rgba(232,119,32,0.18), 0 0 0 4px rgba(232,119,32,0.08)"
              : "0 12px 32px rgba(232,119,32,0.08)",
          }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              if (v.length <= GOAL_MAX_LENGTH) setValue(v);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={3}
            className="w-full resize-none bg-transparent p-5 md:p-6 text-base md:text-lg text-darkerGray font-medium leading-relaxed outline-none placeholder:text-transparent"
            style={{ maxHeight: 200 }}
          />

          {/* Rotating placeholder overlay */}
          {value.length === 0 && (
            <div className="absolute inset-0 pointer-events-none p-5 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={placeholderIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-base md:text-lg text-gray-400 font-medium leading-relaxed"
                >
                  {GOAL_PLACEHOLDERS[placeholderIdx]}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Character count */}
          {value.length > 0 && (
            <div className="flex items-center justify-between px-5 md:px-6 py-2 border-t border-gray-100">
              <div className="text-[11px] text-lightGray font-medium">
                Deine Worte
              </div>
              <div
                className="text-[11px] font-semibold tabular-nums"
                style={{
                  color:
                    value.length > GOAL_MAX_LENGTH * 0.9
                      ? "#E87720"
                      : "#9ca3af",
                }}
              >
                {value.length}/{GOAL_MAX_LENGTH}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-3"
      >
        {/* Skip button */}
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={isConfirming}
          className="text-sm text-lightGray hover:text-darkerGray font-semibold underline underline-offset-4 transition-colors"
        >
          Überspringen
        </button>

        {/* Submit button */}
        <motion.button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={!canSubmit || isConfirming}
          animate={{
            opacity: canSubmit ? 1 : 0.4,
          }}
          whileHover={canSubmit ? { scale: 1.04 } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-white font-black text-base md:text-lg disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
            boxShadow: "0 12px 32px rgba(232,119,32,0.35)",
          }}
        >
          Abschließen
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}
