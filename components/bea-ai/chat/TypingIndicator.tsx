"use client";

// ─── TypingIndicator ──────────────────────────────────────
// Animated three-dot typing indicator. Memoized to avoid re-renders.

import { memo } from "react";
import { motion } from "framer-motion";

// CONSTANTS
const DOT_BASE_STYLE = { backgroundColor: "#E87720" } as const;

const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1" aria-label="Bea schreibt">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={DOT_BASE_STYLE}
          className="block h-[7px] w-[7px] rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{
            duration: 0.75,
            repeat: Infinity,
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  );
});

export default TypingIndicator;
