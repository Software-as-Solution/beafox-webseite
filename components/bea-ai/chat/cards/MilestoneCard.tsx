"use client";

// ─── MilestoneCard ────────────────────────────────────────
// Celebrative card for milestone moments. Sparkles + warm copy.

import Image from "next/image";
import { motion } from "framer-motion";

// STYLES
const CARD_STYLE = {
  background:
    "linear-gradient(135deg, #FFFAF0 0%, #FFEFD9 50%, #FFFAF0 100%)",
  border: "1.5px solid rgba(232,119,32,0.35)",
  boxShadow: "0 6px 20px rgba(232,119,32,0.15)",
} as const;

interface Props {
  milestone: string;
  description: string;
}

export default function MilestoneCard({ milestone, description }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
      }}
      style={CARD_STYLE}
      className="relative mx-auto w-full max-w-[85%] overflow-hidden rounded-3xl rounded-bl-md p-5 md:max-w-[68%] md:p-6"
    >
      {/* Floating sparkles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {[
          { top: "12%", left: "8%", delay: 0 },
          { top: "20%", right: "12%", delay: 0.4 },
          { bottom: "18%", left: "15%", delay: 0.8 },
          { bottom: "22%", right: "8%", delay: 1.2 },
        ].map((s, i) => (
          <motion.span
            key={i}
            className="absolute text-base"
            style={{ ...s }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8],
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: s.delay,
            }}
          >
            ✨
          </motion.span>
        ))}
      </div>

      <div className="relative flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 md:h-14 md:w-14">
          <Image
            src="/Maskottchen/Maskottchen-Freude.webp"
            alt="Bea freut sich"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primaryOrange">
            Meilenstein
          </span>
          <h3 className="mt-0.5 text-base font-black leading-tight text-darkerGray md:text-lg">
            {milestone}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-darkerGray/80 md:text-sm">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
