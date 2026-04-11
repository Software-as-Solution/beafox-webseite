"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import StepHeading from "../shared/StepHeading";
import { LIFE_SITUATION_OPTIONS } from "@/lib/bea-ai/onboarding";

interface Step1Props {
  onSelect: (id: string) => void;
}

/**
 * STEP 1 — Life Situation
 *
 * Pattern: Hero Cards
 * Each life situation gets a large card with its own dedicated mascot.
 * Cards are arranged in a responsive grid — 2 cols on mobile, 5 on desktop.
 * On hover/tap: card lifts, glows, and its mascot subtly animates.
 */
export default function Step1({ onSelect }: Step1Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    // Delay lets the selection animation play before advancing
    setTimeout(() => onSelect(id), 500);
  };

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
      <StepHeading
        eyebrow="Schritt 1 — Wo stehst du gerade?"
        title={
          <>
            Erzähl mir, <span className="text-primaryOrange">wer du bist</span>
          </>
        }
        subtitle="Damit ich weiß, aus welcher Perspektive du auf Finanzen schaust."
      />

      {/* Card grid */}
      <div className="mt-10 md:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 w-full max-w-5xl">
        {LIFE_SITUATION_OPTIONS.map((option, idx) => {
          const isHovered = hoveredId === option.id;
          const isSelected = selectedId === option.id;
          const isDimmed = selectedId !== null && !isSelected;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isDimmed ? 0.3 : 1,
                y: 0,
                scale: isSelected ? 1.05 : 1,
              }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-center rounded-3xl overflow-hidden transition-all duration-300 p-4 md:p-5"
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)"
                  : "#FFFFFF",
                border: `2px solid ${isSelected ? "#E87720" : "#F0E5D8"}`,
                boxShadow: isHovered
                  ? "0 24px 60px rgba(232,119,32,0.18), 0 0 0 1px rgba(232,119,32,0.2)"
                  : "0 4px 16px rgba(232,119,32,0.08)",
              }}
            >
              {/* Ambient glow on hover */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                  isHovered || isSelected ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "radial-gradient(circle at center top, rgba(232,119,32,0.08) 0%, transparent 60%)",
                }}
              />

              {/* Mascot */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 mb-2">
                <motion.div
                  animate={{
                    y: isHovered || isSelected ? -4 : 0,
                    scale: isHovered || isSelected ? 1.05 : 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={option.mascot}
                    alt={option.label}
                    fill
                    sizes="160px"
                    className="object-contain"
                    style={{
                      filter: "drop-shadow(0 12px 24px rgba(232,119,32,0.15))",
                    }}
                  />
                </motion.div>
              </div>

              {/* Label */}
              <h3 className="relative text-base md:text-lg font-black text-darkerGray text-center leading-tight mb-1">
                {option.label}
              </h3>
              <p className="relative text-[11px] md:text-xs text-lightGray text-center leading-snug">
                {option.sub}
              </p>

              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primaryOrange flex items-center justify-center"
                  style={{
                    boxShadow: "0 4px 12px rgba(232,119,32,0.4)",
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5 text-white"
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
    </div>
  );
}
