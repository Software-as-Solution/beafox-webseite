"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StepHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Center-align on mobile, left-align on desktop by default. */
  align?: "center" | "left";
}

/**
 * Standardized heading used at the top of every step.
 * Gives steps a cohesive typographic rhythm.
 */
export default function StepHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: StepHeadingProps) {
  const alignClass =
    align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${alignClass}`}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-primaryOrange/20 px-3 py-1 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primaryOrange" />
          <span className="text-[10px] md:text-[11px] font-bold text-primaryOrange uppercase tracking-widest">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkerGray leading-tight tracking-tight max-w-2xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm md:text-base text-lightGray leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
