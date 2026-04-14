"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
// LIBS
import {
  ZIELBILD_STARTERS,
  ZIELBILD_MAX_LENGTH,
  ZIELBILD_PLACEHOLDERS,
  LIFE_VALUES,
} from "@/lib/bea-ai/onboarding";
import type { LifeValue } from "@/lib/bea-ai/onboarding";

// TYPES
interface Step12Props {
  onSelect: (zielbild: string, lebenswerte: LifeValue[]) => void;
}
// CONSTANTS
const PLACEHOLDER_ROTATION_MS = 3500;
const BUBBLE_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.22)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const TEXTAREA_DEFAULT_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 12px 32px rgba(232,119,32,0.08)",
} as const;
const TEXTAREA_FOCUSED_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #E87720",
  boxShadow:
    "0 20px 48px rgba(232,119,32,0.18), 0 0 0 4px rgba(232,119,32,0.08)",
} as const;
const STARTER_CHIP_DEFAULT_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow: "0 2px 8px rgba(232,119,32,0.05)",
} as const;
const STARTER_CHIP_HOVER_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.4)",
  boxShadow: "0 6px 16px rgba(232,119,32,0.15)",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
} as const;
const SUBMIT_BUTTON_STYLE = {
  boxShadow: "0 12px 32px rgba(232,119,32,0.35)",
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
} as const;
const VALUE_CHIP_DEFAULT_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow: "0 2px 8px rgba(232,119,32,0.05)",
} as const;
const VALUE_CHIP_SELECTED_STYLE = {
  border: "1.5px solid rgba(232,119,32,0.6)",
  boxShadow: "0 6px 16px rgba(232,119,32,0.15)",
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
} as const;
// CONSTANTS
const LIFE_VALUES_MAX = 2;

/**
 * STEP 12 — Zielbild (Free Text) — final step
 *
 * Conversational pattern matching Steps 1-11:
 * Bea asks about the user's vision in her warmest tone, the user
 * either writes their own answer OR picks a starter chip that pre-fills
 * the textarea; chips stay visible so another starter can replace the text.
 * Skipping is allowed but framed as "auch okay", not as default.
 *
 * This is the emotional climax of the onboarding — Bea acts as the
 * supportive listener who's been waiting for this moment.
 */
export default function Step12Zielbild({ onSelect }: Step12Props) {
  // STATE
  const t = useTranslations("onboarding.beaAi.step12");
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hoveredStarter, setHoveredStarter] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<LifeValue[]>([]);
  const [hoveredValue, setHoveredValue] = useState<LifeValue | null>(null);
  // CONSTANTS
  const canSubmit = value.trim().length > 0;
  const charCount = value.length;
  const isNearLimit = charCount > ZIELBILD_MAX_LENGTH * 0.85;
  /** Which starter chip matches the current text (prefix), so we can highlight it after edits. */
  const activeStarterId = useMemo(() => {
    const v = value;
    if (!v) return null;
    const match = ZIELBILD_STARTERS.find((s) => v.startsWith(s.starter));
    return match?.id ?? null;
  }, [value]);
  // FUNCTIONS
  const handleStarterClick = (starter: string) => {
    if (isConfirming) return;
    setValue(starter);
    // Focus and place cursor at the end
    setTimeout(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(starter.length, starter.length);
      }
    }, 50);
  };
  const handleValueToggle = (id: LifeValue) => {
    if (isConfirming) return;
    setSelectedValues((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= LIFE_VALUES_MAX) return prev;
      return [...prev, id];
    });
  };
  const handleSubmit = (skipped = false) => {
    if (isConfirming) return;
    setIsConfirming(true);
    setTimeout(
      () => onSelect(skipped ? "" : value.trim(), selectedValues),
      400,
    );
  };
  // USE EFFECTS
  useEffect(() => {
    if (value.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % ZIELBILD_PLACEHOLDERS.length);
    }, PLACEHOLDER_ROTATION_MS);
    return () => clearInterval(interval);
  }, [value]);
  // Auto-resize textarea based on content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 flex items-start gap-3 md:gap-4"
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
              {t("bubble.line1")}
              <br /> {t("bubble.line2Prefix")}{" "}
              <span className="text-primaryOrange">
                {t("bubble.line2Highlight")}
              </span>
              {t("bubble.line2Suffix")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-lightGray md:text-[15px]">
              {t("bubble.description")}
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
        <div className="w-full">
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            style={isFocused ? TEXTAREA_FOCUSED_STYLE : TEXTAREA_DEFAULT_STYLE}
            className="relative overflow-hidden rounded-3xl rounded-tr-md transition-all duration-300"
            transition={{
              delay: 0.55,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <textarea
              rows={3}
              value={value}
              ref={textareaRef}
              disabled={isConfirming}
              style={{ maxHeight: 200 }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full resize-none bg-transparent p-5 text-base font-medium leading-relaxed text-darkerGray outline-none placeholder:text-transparent disabled:opacity-60 md:p-6 md:text-lg"
              onChange={(e) => {
                const v = e.target.value;
                if (v.length <= ZIELBILD_MAX_LENGTH) setValue(v);
              }}
            />
            {value.length === 0 && (
              <div className="pointer-events-none absolute inset-0 p-5 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={placeholderIdx}
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-base font-medium leading-relaxed text-gray-400 md:text-lg"
                  >
                    {ZIELBILD_PLACEHOLDERS[placeholderIdx]}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
            {value.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between border-t border-gray-100 px-5 py-2.5 md:px-6"
              >
                <div className="text-[11px] font-semibold text-lightGray">
                  {t("charCounter.label")}
                </div>
                <div
                  className="text-[11px] font-bold tabular-nums"
                  style={{
                    color: isNearLimit ? "#E87720" : "#9ca3af",
                  }}
                >
                  {charCount} / {ZIELBILD_MAX_LENGTH}
                </div>
              </motion.div>
            )}
          </motion.div>
          {!isConfirming && (
            <motion.div
              className="mt-6"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-darkerGray/50">
                {value.length === 0
                  ? t("starterChooser.empty")
                  : t("starterChooser.filled")}
              </p>
              <div className="flex flex-wrap gap-2">
                {ZIELBILD_STARTERS.map((starter, idx) => {
                  const isActive = activeStarterId === starter.id;
                  const isHovered = hoveredStarter === starter.id;
                  return (
                    <motion.button
                      type="button"
                      key={starter.id}
                      whileHover={{ y: -2 }}
                      disabled={isConfirming}
                      whileTap={{ scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      onMouseLeave={() => setHoveredStarter(null)}
                      onClick={() => handleStarterClick(starter.starter)}
                      onMouseEnter={() => setHoveredStarter(starter.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-darkerGray transition-all duration-300 md:text-sm ${
                        isActive
                          ? "ring-2 ring-primaryOrange/50 ring-offset-2 ring-offset-white"
                          : ""
                      }`}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.95 + idx * 0.05,
                      }}
                      style={
                        isHovered || isActive
                          ? STARTER_CHIP_HOVER_STYLE
                          : STARTER_CHIP_DEFAULT_STYLE
                      }
                    >
                      <span className="text-base">{starter.icon}</span>
                      {starter.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
          {/* Life Values — Mini-Werte-Inventar */}
          {!isConfirming && (
            <motion.div
              className="mt-8"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-darkerGray/50">
                {t("lifeValues.title")}
              </p>
              <p className="mb-3 text-sm text-lightGray">
                {t("lifeValues.subtitle")}
              </p>
              <div className="flex flex-wrap gap-2">
                {LIFE_VALUES.map((lv, idx) => {
                  const isSelected = selectedValues.includes(lv.id);
                  const isHov = hoveredValue === lv.id;
                  const isMaxed =
                    selectedValues.length >= LIFE_VALUES_MAX && !isSelected;
                  return (
                    <motion.button
                      type="button"
                      key={lv.id}
                      disabled={isMaxed || isConfirming}
                      whileHover={!isMaxed ? { y: -2 } : {}}
                      whileTap={!isMaxed ? { scale: 0.96 } : {}}
                      animate={{ opacity: isMaxed ? 0.45 : 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      onClick={() => handleValueToggle(lv.id)}
                      onMouseEnter={() => setHoveredValue(lv.id)}
                      onMouseLeave={() => setHoveredValue(null)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-darkerGray transition-all duration-300 md:text-sm ${
                        isSelected
                          ? "ring-2 ring-primaryOrange/50 ring-offset-2 ring-offset-white"
                          : ""
                      } ${isMaxed ? "cursor-not-allowed" : ""}`}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 1.05 + idx * 0.05,
                      }}
                      style={
                        isSelected || isHov
                          ? VALUE_CHIP_SELECTED_STYLE
                          : VALUE_CHIP_DEFAULT_STYLE
                      }
                    >
                      <span className="text-base">{lv.icon}</span>
                      {lv.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-end"
          >
            <motion.button
              type="button"
              style={SUBMIT_BUTTON_STYLE}
              onClick={() => handleSubmit(false)}
              disabled={!canSubmit || isConfirming}
              whileTap={canSubmit ? { scale: 0.97 } : {}}
              whileHover={canSubmit ? { scale: 1.04 } : {}}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-black text-white disabled:cursor-not-allowed md:text-lg"
              animate={{
                scale: canSubmit ? 1 : 0.97,
                opacity: canSubmit ? 1 : 0.4,
              }}
            >
              {canSubmit ? t("submit.ready") : t("submit.empty")}
              <svg
                fill="none"
                strokeWidth={3}
                className="h-5 w-5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="mt-6 text-center text-sm text-gray-400"
            animate={{ opacity: canSubmit || isConfirming ? 0 : 1 }}
          >
            {t("hint")}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
