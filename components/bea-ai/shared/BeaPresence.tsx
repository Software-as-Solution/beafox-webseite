"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface BeaPresenceProps {
  mascotSrc: string;
  /** Optional label shown near the mascot (mood, title). */
  label?: string;
  /** Responsive size presets. */
  size?: "md" | "lg" | "xl";
  /** Class applied to the outer wrapper. */
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BeaPresenceProps["size"]>, string> = {
  md: "w-32 h-32 md:w-40 md:h-40",
  lg: "w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64",
  xl: "w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80",
};

/**
 * Big prominent mascot display.
 * The mascot crossfades when `mascotSrc` changes.
 * Includes an ambient glow behind it so it feels alive.
 */
export default function BeaPresence({
  mascotSrc,
  label,
  size = "lg",
  className = "",
}: BeaPresenceProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
    >
      {/* Ambient glow behind the mascot */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-[70%] h-[70%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,32,0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Mascot with crossfade on src change */}
      <div className={`relative ${SIZE_CLASSES[size]}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={mascotSrc}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={mascotSrc}
              alt="Bea"
              fill
              priority
              sizes="(max-width: 768px) 176px, 320px"
              className="object-contain"
              style={{
                filter: "drop-shadow(0 16px 40px rgba(232,119,32,0.22))",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Optional label */}
      {label && (
        <AnimatePresence mode="wait">
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-primaryOrange/20 bg-white/80 backdrop-blur-sm px-4 py-1.5"
          >
            <span className="text-xs font-bold text-primaryOrange uppercase tracking-widest">
              {label}
            </span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
