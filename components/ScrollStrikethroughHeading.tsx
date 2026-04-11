"use client";

// IMPORTS
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";
import { useRef } from "react";

// TYPES
interface ScrollStrikethroughHeadingProps {
  oldText: string;
  newPrefix: string;
  className?: string;
  newHighlight: string;
}
// CONSTANTS
const STRIKE_RANGE = [0, 0.9] as const;
const NEW_Y_RANGE = [0.2, 0.7] as const;
const OLD_OPACITY_RANGE = [0, 0.6] as const;
const NEW_OPACITY_RANGE = [0.2, 0.5] as const;
const STRIKE_SHADOW = "0 2px 8px rgba(232,119,32,0.3)";
const SCROLL_OFFSET: NonNullable<UseScrollOptions["offset"]> = [
  "start 80%",
  "end 20%",
];
const STRIKE_GRADIENT =
  "linear-gradient(90deg, #E87720 0%, #F08A3C 50%, #E87720 100%)";

// HELPER FUNCTIONS
function useTransformOrStatic(
  source: MotionValue<number>,
  inputRange: readonly number[],
  outputRange: readonly number[],
  staticValue: number,
  prefersReducedMotion: boolean | null,
): MotionValue<number> {
  const animated = useTransform(
    source,
    inputRange as number[],
    outputRange as number[],
  );
  const staticMV = useTransform(source, () => staticValue);
  return prefersReducedMotion ? staticMV : animated;
}

export default function ScrollStrikethroughHeading({
  oldText,
  newPrefix,
  newHighlight,
  className = "",
}: ScrollStrikethroughHeadingProps) {
  // REFS
  const containerRef = useRef<HTMLDivElement>(null);
  // HOOKS
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: SCROLL_OFFSET,
  });
  const prefersReducedMotion = useReducedMotion();
  // ANIMATION VALUES
  const newTextY = useTransformOrStatic(
    scrollYProgress,
    NEW_Y_RANGE,
    [12, 0],
    0,
    prefersReducedMotion,
  );
  const strikeScaleX = useTransformOrStatic(
    scrollYProgress,
    STRIKE_RANGE,
    [0, 1],
    1,
    prefersReducedMotion,
  );
  const oldTextOpacity = useTransformOrStatic(
    scrollYProgress,
    OLD_OPACITY_RANGE,
    [1, 0.5],
    0.5,
    prefersReducedMotion,
  );
  const newTextOpacity = useTransformOrStatic(
    scrollYProgress,
    NEW_OPACITY_RANGE,
    [0.4, 1],
    1,
    prefersReducedMotion,
  );

  return (
    <div
      ref={containerRef}
      className={`text-center max-w-5xl mx-auto mb-10 ${className}`.trim()}
    >
      <h2 className="font-bold text-darkerGray leading-[1.15] tracking-tight">
        <motion.span
          style={{ opacity: oldTextOpacity }}
          className="relative inline-block text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
        >
          {oldText}
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-1/2 h-[3px] md:h-[4px] lg:h-[5px] w-full rounded-full pointer-events-none -translate-y-1/2"
            style={{
              scaleX: strikeScaleX,
              willChange: "transform",
              boxShadow: STRIKE_SHADOW,
              background: STRIKE_GRADIENT,
              transformOrigin: "left center",
            }}
          />
        </motion.span>
        <br />
        <motion.span
          className="inline-block whitespace-pre-line text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
          style={{
            y: newTextY,
            opacity: newTextOpacity,
            willChange: "transform, opacity",
          }}
        >
          {newPrefix}
          <span className="text-primaryOrange whitespace-pre-line">
            {newHighlight}
          </span>
        </motion.span>
      </h2>
    </div>
  );
}
