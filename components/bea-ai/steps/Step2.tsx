"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
// LIBS
import {
  AGE_MIN,
  AGE_MAX,
  AGE_DEFAULT,
  getMascotForAge,
} from "@/lib/bea-ai/onboarding";

// TYPES
interface Step2Props {
  onSelect: (age: number) => void;
}
// CONSTANTS
const BUBBLE_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow:
    "0 12px 32px rgba(232,119,32,0.12), 0 0 0 1px rgba(232,119,32,0.05)",
} as const;
const NUMBER_GRADIENT_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 50%, #F5A155 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
} as const;
const TRACK_FILL_STYLE = {
  background: "linear-gradient(to right, #E87720, #F08A3C, #F5A155)",
  boxShadow: "0 2px 12px rgba(232,119,32,0.4)",
} as const;
const HANDLE_BASE_STYLE = {
  border: "3px solid #E87720",
} as const;
const CONFIRM_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 12px 32px rgba(232,119,32,0.35)",
} as const;
const CARD_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 8px 24px rgba(232,119,32,0.06)",
} as const;

/**
 * STEP 2 — Age
 *
 * Conversational pattern matching Step 1:
 * Bea asks in a speech bubble, user responds with a slider "card"
 * that contains the reacting mascot, giant age number, and track.
 */
export default function Step2({ onSelect }: Step2Props) {
  // STATES
  const t = useTranslations("onboarding.beaAi.step2");
  const [age, setAge] = useState(AGE_DEFAULT);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // REF
  const trackRef = useRef<HTMLDivElement>(null);
  // CONSTANTS
  const mascotInfo = getMascotForAge(age);
  const progress = ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100;
  // FUNCTIONS
  const handleConfirm = useCallback(() => {
    if (isConfirming) return;
    setIsConfirming(true);
    setTimeout(() => onSelect(age), 400);
  }, [age, isConfirming, onSelect]);
  const clientXToAge = useCallback((clientX: number): number => {
    if (!trackRef.current) return AGE_DEFAULT;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    return Math.round(AGE_MIN + pct * (AGE_MAX - AGE_MIN));
  }, []);
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      setIsDragging(true);

      const onMove = (ev: PointerEvent) => {
        setAge(clientXToAge(ev.clientX));
      };
      const onUp = () => {
        target.releasePointerCapture(e.pointerId);
        setIsDragging(false);
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointercancel", onUp);
      };

      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onUp);
    },
    [clientXToAge],
  );
  // EFFECTS
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setAge((a) => Math.max(AGE_MIN, a - 1));
      if (e.key === "ArrowRight") setAge((a) => Math.min(AGE_MAX, a + 1));
      if (e.key === "Enter") handleConfirm();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleConfirm]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-8 pt-5 md:px-8 md:pb-16 md:pt-12">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        className="mb-4 flex items-start gap-3 md:mb-6 md:gap-4"
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Bea Avatar */}
        <motion.div
          className="relative flex-shrink-0"
          animate={{ scale: 1, opacity: 1 }}
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
              <span className="text-primaryOrange">{t("bubble.titleHighlight")}</span>{" "}
              {t("bubble.titleSuffix")}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-lightGray sm:text-sm md:text-[15px]">
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
        <motion.div
          style={CARD_STYLE}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl rounded-tr-md px-5 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10"
          transition={{
            delay: 0.55,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center top, rgba(232,119,32,0.05) 0%, transparent 60%)",
            }}
          />
          <div className="relative flex flex-col items-center">
            <div className="relative h-28 w-28 md:h-32 md:w-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mascotInfo.src}
                  className="absolute inset-0"
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    fill
                    alt="Bea"
                    sizes="134px"
                    src={mascotInfo.src}
                    className="object-contain"
                    style={{
                      filter: "drop-shadow(0 12px 24px rgba(232,119,32,0.2))",
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={mascotInfo.mood}
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primaryOrange/10 px-3 py-1"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-primaryOrange">
                  {mascotInfo.mood}
                </span>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={age}
                  style={NUMBER_GRADIENT_STYLE}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.85 }}
                  initial={{ opacity: 0, y: 18, scale: 0.85 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[72px] font-black leading-none tabular-nums sm:text-[88px] md:text-[100px]"
                >
                  {age}
                </motion.span>
              </AnimatePresence>
              <span className="pb-3 text-base font-bold text-lightGray md:pb-5 md:text-lg">
                {t("ageUnit")}
              </span>
            </div>
            <div className="mt-6 w-full max-w-md md:mt-8">
              <div
                tabIndex={0}
                role="slider"
                ref={trackRef}
                aria-valuenow={age}
                aria-valuemin={AGE_MIN}
                aria-valuemax={AGE_MAX}
                aria-label={t("sliderAriaLabel")}
                className="relative h-3 cursor-pointer touch-none select-none rounded-full bg-orange-100"
                onPointerDown={(e) => {
                  if (isDragging) return;
                  setAge(clientXToAge(e.clientX));
                }}
              >
                <motion.div
                  style={TRACK_FILL_STYLE}
                  animate={{ width: `${progress}%` }}
                  className="pointer-events-none absolute left-0 top-0 h-full rounded-full"
                  transition={{
                    ease: "linear",
                    duration: isDragging ? 0.05 : 0.2,
                  }}
                />
                <motion.div
                  onPointerDown={handlePointerDown}
                  animate={{ left: `${progress}%` }}
                  transition={{
                    ease: "linear",
                    duration: isDragging ? 0.05 : 0.2,
                  }}
                  className={`absolute top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ${
                    isDragging ? "scale-110 cursor-grabbing" : "cursor-grab"
                  }`}
                  style={{
                    ...HANDLE_BASE_STYLE,
                    boxShadow: isDragging
                      ? "0 6px 20px rgba(232,119,32,0.5)"
                      : "0 4px 16px rgba(232,119,32,0.35)",
                    transition: isDragging
                      ? "box-shadow 0.15s ease"
                      : "box-shadow 0.3s ease",
                  }}
                />
                <div className="pointer-events-none absolute inset-x-0 -bottom-6 flex justify-between text-[10px] font-medium text-lightGray">
                  <span>{AGE_MIN}</span>
                  <span>22</span>
                  <span>26</span>
                  <span>30</span>
                  <span>{AGE_MAX}+</span>
                </div>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={handleConfirm}
              disabled={isConfirming}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.04 }}
              style={CONFIRM_BUTTON_STYLE}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="mt-14 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-black text-white disabled:opacity-70 md:text-lg"
            >
              {t("confirm")}
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
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          className="mt-4 text-xs text-gray-400"
          transition={{ delay: 1.2, duration: 0.4 }}
          animate={{ opacity: isConfirming ? 0 : 1 }}
        >
          {t("hint")}
        </motion.p>
      </div>
    </div>
  );
}
