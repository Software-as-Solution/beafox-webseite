"use client";

import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

/**
 * Minimal step indicator shown in the top bar.
 * Uses a thin horizontal bar with dots for completed/active/upcoming states.
 */
export default function ProgressIndicator({
  current,
  total,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, idx) => {
          const isDone = idx < current;
          const isActive = idx === current;
          return (
            <motion.div
              key={idx}
              animate={{
                width: isActive ? 24 : 6,
                backgroundColor: isDone
                  ? "#E87720"
                  : isActive
                    ? "#E87720"
                    : "#FED4B0",
                opacity: isDone || isActive ? 1 : 0.5,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-1.5 rounded-full"
            />
          );
        })}
      </div>
      <span className="text-[11px] font-semibold text-lightGray tabular-nums ml-1">
        {current + 1}/{total}
      </span>
    </div>
  );
}
