"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import StepHeading from "../shared/StepHeading";
import { MONEY_FEELING_OPTIONS } from "@/lib/bea-ai/onboarding";

interface Step3Props {
  onSelect: (id: "freiheit" | "stress") => void;
}

/**
 * STEP 3 — Money Feeling (Binary Choice)
 *
 * Pattern: Split-screen with two sides.
 * Hovering one side makes it grow (70/30), clicking expands it to 100%.
 * Reveals emotional bias in the most dramatic way.
 */
export default function Step3MoneyFeeling({ onSelect }: Step3Props) {
  const [hoveredSide, setHoveredSide] = useState<"freiheit" | "stress" | null>(
    null,
  );
  const [selectedSide, setSelectedSide] = useState<
    "freiheit" | "stress" | null
  >(null);

  const [freiheit, stress] = MONEY_FEELING_OPTIONS;

  const handleSelect = (id: "freiheit" | "stress") => {
    if (selectedSide) return;
    setSelectedSide(id);
    setTimeout(() => onSelect(id), 650);
  };

  // Calculate flex ratios for the two sides
  const getFlex = (id: "freiheit" | "stress") => {
    if (selectedSide === id) return 1.5;
    if (selectedSide && selectedSide !== id) return 0;
    if (hoveredSide === id) return 1.4;
    if (hoveredSide && hoveredSide !== id) return 0.6;
    return 1;
  };

  return (
    <div className="flex flex-col h-full px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 3 — Dein Bauchgefühl"
        title={
          <>
            Wenn du an Geld denkst —{" "}
            <span className="text-primaryOrange">was kommt zuerst?</span>
          </>
        }
        subtitle="Zwei Seiten. Eine Entscheidung. Sei ehrlich."
      />

      {/* Split screen */}
      <div className="mt-10 md:mt-12 flex flex-col md:flex-row gap-4 md:gap-5 flex-1 max-w-5xl w-full mx-auto">
        {/* LEFT — Freiheit */}
        <motion.button
          type="button"
          onClick={() => handleSelect("freiheit")}
          onMouseEnter={() => setHoveredSide("freiheit")}
          onMouseLeave={() => setHoveredSide(null)}
          animate={{
            flex: getFlex("freiheit"),
            opacity: selectedSide && selectedSide !== "freiheit" ? 0 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative group rounded-3xl overflow-hidden min-h-[300px] md:min-h-[420px] flex flex-col items-center justify-center p-6 md:p-10"
          style={{
            background: freiheit.gradient,
            border: "2px solid rgba(232,119,32,0.2)",
            boxShadow: "0 20px 60px rgba(232,119,32,0.15)",
          }}
        >
          {/* Decorative blob */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(232,119,32,0.2) 0%, transparent 60%)",
            }}
          />

          {/* Mascot */}
          <motion.div
            animate={{
              scale: hoveredSide === "freiheit" ? 1.1 : 1,
              y: hoveredSide === "freiheit" ? -8 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-32 h-32 md:w-48 md:h-48 mb-4"
          >
            <Image
              src={freiheit.mascot}
              alt={freiheit.label}
              fill
              sizes="200px"
              className="object-contain"
              style={{
                filter: "drop-shadow(0 16px 32px rgba(232,119,32,0.25))",
              }}
            />
          </motion.div>

          {/* Emoji */}
          <div className="relative text-4xl md:text-5xl mb-3">
            {freiheit.emoji}
          </div>

          {/* Label */}
          <h3 className="relative text-3xl md:text-5xl font-black text-darkerGray leading-none mb-3 tracking-tight">
            {freiheit.label}
          </h3>

          {/* Description */}
          <p className="relative text-sm md:text-base text-darkerGray/70 font-medium text-center max-w-xs">
            {freiheit.description}
          </p>

          {/* Hover hint */}
          <motion.div
            animate={{
              opacity: hoveredSide === "freiheit" ? 1 : 0.5,
              y: hoveredSide === "freiheit" ? 0 : 4,
            }}
            className="relative mt-6 inline-flex items-center gap-2 text-xs font-bold text-primaryOrange uppercase tracking-widest"
          >
            <span>Das bin ich</span>
            <svg
              className="w-4 h-4"
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
          </motion.div>
        </motion.button>

        {/* Divider (Desktop only) */}
        <div className="hidden md:flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-lightGray/40 to-transparent" />
            <span className="text-[10px] font-black text-lightGray uppercase tracking-widest">
              oder
            </span>
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-lightGray/40 to-transparent" />
          </div>
        </div>

        {/* RIGHT — Stress */}
        <motion.button
          type="button"
          onClick={() => handleSelect("stress")}
          onMouseEnter={() => setHoveredSide("stress")}
          onMouseLeave={() => setHoveredSide(null)}
          animate={{
            flex: getFlex("stress"),
            opacity: selectedSide && selectedSide !== "stress" ? 0 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative group rounded-3xl overflow-hidden min-h-[300px] md:min-h-[420px] flex flex-col items-center justify-center p-6 md:p-10"
          style={{
            background: stress.gradient,
            border: "2px solid rgba(100,100,100,0.2)",
            boxShadow: "0 20px 60px rgba(100,100,100,0.15)",
          }}
        >
          {/* Decorative blob */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(100,100,100,0.15) 0%, transparent 60%)",
            }}
          />

          {/* Mascot */}
          <motion.div
            animate={{
              scale: hoveredSide === "stress" ? 1.1 : 1,
              y: hoveredSide === "stress" ? -8 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-32 h-32 md:w-48 md:h-48 mb-4"
          >
            <Image
              src={stress.mascot}
              alt={stress.label}
              fill
              sizes="200px"
              className="object-contain"
              style={{
                filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.2))",
              }}
            />
          </motion.div>

          {/* Emoji */}
          <div className="relative text-4xl md:text-5xl mb-3">
            {stress.emoji}
          </div>

          {/* Label */}
          <h3 className="relative text-3xl md:text-5xl font-black text-darkerGray leading-none mb-3 tracking-tight">
            {stress.label}
          </h3>

          {/* Description */}
          <p className="relative text-sm md:text-base text-darkerGray/70 font-medium text-center max-w-xs">
            {stress.description}
          </p>

          {/* Hover hint */}
          <motion.div
            animate={{
              opacity: hoveredSide === "stress" ? 1 : 0.5,
              y: hoveredSide === "stress" ? 0 : 4,
            }}
            className="relative mt-6 inline-flex items-center gap-2 text-xs font-bold text-darkerGray uppercase tracking-widest"
          >
            <span>Das bin ich</span>
            <svg
              className="w-4 h-4"
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
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
