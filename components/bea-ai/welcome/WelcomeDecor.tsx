"use client";

// ─── WelcomeDecor ─────────────────────────────────────────
// Ambient sparkle overlay for the welcome phase. Pure decoration.

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// CONSTANTS
const SPARKLE_POSITIONS = [
  { top: "15%", left: "10%", delay: 0 },
  { top: "25%", right: "12%", delay: 0.8 },
  { bottom: "20%", left: "15%", delay: 1.4 },
  { bottom: "28%", right: "18%", delay: 0.4 },
  { top: "45%", left: "8%", delay: 1.8 },
  { top: "55%", right: "6%", delay: 1.1 },
] as const;

export default function WelcomeDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,119,32,0.08) 0%, rgba(232,119,32,0.02) 40%, transparent 70%)",
        }}
      />
      {SPARKLE_POSITIONS.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={pos}
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-4 w-4 text-primaryOrange/40" />
        </motion.div>
      ))}
    </div>
  );
}
