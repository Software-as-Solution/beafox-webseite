"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import StepHeading from "../shared/StepHeading";
import BeaPresence from "../shared/BeaPresence";
import {
  AGE_MIN,
  AGE_MAX,
  AGE_DEFAULT,
  getMascotForAge,
} from "@/lib/bea-ai/onboarding";

interface Step2Props {
  onSelect: (age: number) => void;
}

/**
 * STEP 2 — Age
 *
 * Pattern: Draggable slider with live-updating giant number.
 * The mascot changes based on the age range, creating a "Bea reacts to you" feel.
 *
 * Uses native pointer events for drag instead of Framer Motion drag,
 * which avoids constraint drift issues.
 */
export default function Step2({ onSelect }: Step2Props) {
  const [age, setAge] = useState(AGE_DEFAULT);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const mascotInfo = getMascotForAge(age);

  const handleConfirm = useCallback(() => {
    if (isConfirming) return;
    setIsConfirming(true);
    setTimeout(() => onSelect(age), 400);
  }, [age, isConfirming, onSelect]);

  // Progress as percentage
  const progress = ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100;

  // Convert a clientX position to an age value
  const clientXToAge = useCallback((clientX: number): number => {
    if (!trackRef.current) return age;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    return Math.round(AGE_MIN + pct * (AGE_MAX - AGE_MIN));
  }, [age]);

  // Direct clicks on the track
  const handleTrackClick = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't handle if we just finished dragging
    if (isDragging) return;
    setAge(clientXToAge(e.clientX));
  };

  // Pointer-based dragging (works for mouse + touch)
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

  // Keyboard support for accessibility
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
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 2 — Dein Alter"
        title={
          <>
            Wie alt <span className="text-primaryOrange">bist du?</span>
          </>
        }
        subtitle="Das hilft mir zu verstehen welche Themen gerade wichtig für dich sind."
      />

      {/* Big reacting mascot */}
      <div className="mt-8 md:mt-10">
        <BeaPresence
          mascotSrc={mascotInfo.src}
          label={mascotInfo.mood}
          size="lg"
        />
      </div>

      {/* Giant age number */}
      <div className="relative mt-8 md:mt-10 flex items-baseline justify-center gap-2">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={age}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[100px] md:text-[140px] font-black leading-none tabular-nums"
            style={{
              background:
                "linear-gradient(135deg, #E87720 0%, #F08A3C 50%, #F5A155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {age}
          </motion.span>
        </AnimatePresence>
        <span className="text-lg md:text-xl font-bold text-lightGray pb-4 md:pb-6">
          Jahre
        </span>
      </div>

      {/* Slider track */}
      <div className="w-full max-w-xl mt-6 md:mt-8">
        <div
          ref={trackRef}
          role="slider"
          aria-valuemin={AGE_MIN}
          aria-valuemax={AGE_MAX}
          aria-valuenow={age}
          aria-label="Alter auswählen"
          tabIndex={0}
          onPointerDown={(e) => {
            // If clicking on the track (not the handle), jump to that position
            setAge(clientXToAge(e.clientX));
          }}
          className="relative h-3 rounded-full bg-orange-100 cursor-pointer touch-none select-none"
        >
          {/* Filled portion */}
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: isDragging ? 0.05 : 0.2, ease: "linear" }}
            className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #E87720, #F08A3C, #F5A155)",
              boxShadow: "0 2px 12px rgba(232,119,32,0.4)",
            }}
          />

          {/* Handle — uses pointer events for dragging */}
          <motion.div
            animate={{ left: `${progress}%` }}
            transition={{ duration: isDragging ? 0.05 : 0.2, ease: "linear" }}
            onPointerDown={handlePointerDown}
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white z-10 ${
              isDragging ? "cursor-grabbing scale-110" : "cursor-grab"
            }`}
            style={{
              border: "3px solid #E87720",
              boxShadow: isDragging
                ? "0 6px 20px rgba(232,119,32,0.5)"
                : "0 4px 16px rgba(232,119,32,0.35)",
              transition: isDragging
                ? "box-shadow 0.15s ease"
                : "box-shadow 0.3s ease",
            }}
          />

          {/* Tick marks at key ages */}
          <div className="absolute inset-x-0 -bottom-6 flex justify-between text-[10px] text-lightGray font-medium pointer-events-none">
            <span>{AGE_MIN}</span>
            <span>20</span>
            <span>25</span>
            <span>30</span>
            <span>{AGE_MAX}+</span>
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <motion.button
        type="button"
        onClick={handleConfirm}
        disabled={isConfirming}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-16 inline-flex items-center gap-2 rounded-full px-8 py-4 text-white font-black text-base md:text-lg disabled:opacity-70"
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
    </div>
  );
}
