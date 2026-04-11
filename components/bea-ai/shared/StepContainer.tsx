"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StepContainerProps {
  children: ReactNode;
  /** Optional background style for step-specific atmospheres. */
  backgroundStyle?: React.CSSProperties;
  /** Optional className override for the outer wrapper. */
  className?: string;
}

/**
 * The outer shell every step lives inside.
 * Gives a consistent page-load animation and responsive padding.
 * Sub-step layouts can use the full width of this container.
 */
export default function StepContainer({
  children,
  backgroundStyle,
  className = "",
}: StepContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex min-h-full w-full flex-col ${className}`}
      style={backgroundStyle}
    >
      {children}
    </motion.div>
  );
}
