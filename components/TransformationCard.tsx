"use client";

// IMPORTS
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useInView, animate } from "framer-motion";
// ICONS
import { ArrowDown, TrendingUp } from "lucide-react";

// CONSTANTS
const TIMELINE = {
  cardIn: 0,
  bigNumber: 0.4,
  arrowSpin: 1.4,
  glowPulse: 1.8,
  afterFade: 1.7,
  arrowFade: 1.25,
  metricDrop: 2.7,
  beforeText: 0.55,
  counterStart: 2.95,
  strikethrough: 1.0,
  sparkleBurst: 1.75,
  typewriterStart: 1.95,
} as const;
const COUNTER_DURATION = 2.5;
const TYPEWRITER_CHAR_MS = 50;
const SPARKLE_ANGLES = [0, 60, 120, 180, 240, 300] as const;
const IN_VIEW_OPTIONS = { once: true, amount: 0.4 } as const;
const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CARD_STYLE = {
  background: "#FFFFFF",
  border: "1px solid #F0E5D8",
  boxShadow:
    "0 1px 3px rgba(232,119,32,0.04), 0 12px 32px rgba(232,119,32,0.08)",
  willChange: "transform, opacity",
} as const;
const HOVER_OVERLAY_STYLE = {
  background:
    "radial-gradient(circle at top right, rgba(232,119,32,0.06) 0%, transparent 50%)",
} as const;
const BIG_NUMBER_STYLE = {
  color: "rgba(232,119,32,0.08)",
  willChange: "transform, opacity",
} as const;
const ARROW_BUTTON_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 4px 14px rgba(232,119,32,0.4)",
  willChange: "transform",
} as const;
const ARROW_GLOW_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.5) 0%, transparent 70%)",
  willChange: "transform, opacity",
} as const;
const SPARKLE_STYLE = {
  background: "#F08A3C",
  boxShadow: "0 0 6px rgba(232,119,32,0.8)",
  marginTop: "-2px",
  marginLeft: "-2px",
  willChange: "transform, opacity",
} as const;
const METRIC_BADGE_STYLE = {
  background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
  border: "1px solid rgba(232,119,32,0.25)",
  boxShadow: "0 4px 12px rgba(232,119,32,0.08)",
} as const;
const METRIC_GLOW_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.4) 0%, transparent 70%)",
  willChange: "transform, opacity",
} as const;

// TYPES
interface TransformationCardProps {
  after: string;
  index: number;
  number: string;
  before: string;
  metric: string;
  metricLabel: string;
}
interface ParsedMetric {
  prefix: string;
  suffix: string;
  target: number | null;
}
// HELPER FUNCTIONS
function parseMetric(metric: string): ParsedMetric {
  const match = metric.match(/\d+/);
  if (!match || match.index === undefined) {
    return { prefix: metric, suffix: "", target: null };
  }
  return {
    prefix: metric.substring(0, match.index),
    suffix: metric.substring(match.index + match[0].length),
    target: parseInt(match[0], 10),
  };
}

export default function TransformationCard({
  after,
  index,
  metric,
  number,
  before,
  metricLabel,
}: TransformationCardProps) {
  // HOOKS
  const shouldReduceMotion = useReducedMotion();
  // STATES
  const parsed = useMemo(() => parseMetric(metric), [metric]);
  const [displayMetric, setDisplayMetric] = useState(
    shouldReduceMotion
      ? metric
      : parsed.target === null
        ? metric
        : `${parsed.prefix}0${parsed.suffix}`,
  );
  const [typedChars, setTypedChars] = useState(
    shouldReduceMotion ? after.length : 0,
  );
  // REFS
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, IN_VIEW_OPTIONS);
  // CONSTANTS
  const isEven = index % 2 === 0;
  const cardInitial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, x: isEven ? -42 : 42, y: 20, scale: 0.97 };
  const cardAnimate = { opacity: 1, x: 0, y: 0, scale: 1 };
  const strikethroughStyle = {
    textDecorationLine: "line-through" as const,
    textDecorationThickness: "2px",
    textDecorationSkipInk: "none" as const,
    textDecorationColor:
      isInView && !shouldReduceMotion ? "#E87720" : "transparent",
    transition: "text-decoration-color 0.85s cubic-bezier(0.65, 0, 0.35, 1)",
    transitionDelay: `${TIMELINE.strikethrough}s`,
  };
  // USE EFFECTS
  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion || parsed.target === null) {
      setDisplayMetric(metric);
      return;
    }

    const controls = animate(0, parsed.target, {
      duration: COUNTER_DURATION,
      delay: TIMELINE.counterStart,
      ease: SMOOTH_EASE,
      onUpdate: (latest) => {
        setDisplayMetric(
          `${parsed.prefix}${Math.round(latest)}${parsed.suffix}`,
        );
      },
    });

    return () => controls.stop();
  }, [isInView, metric, parsed, shouldReduceMotion]);
  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      if (shouldReduceMotion) setTypedChars(after.length);
      return;
    }

    let currentChar = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        currentChar++;
        setTypedChars(currentChar);
        if (currentChar >= after.length && intervalId) {
          clearInterval(intervalId);
        }
      }, TYPEWRITER_CHAR_MS);
    }, TIMELINE.typewriterStart * 1000);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isInView, after, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      style={CARD_STYLE}
      initial={cardInitial}
      animate={isInView ? cardAnimate : cardInitial}
      className="group relative rounded-3xl p-6 md:p-8 overflow-hidden hover:-translate-y-1 transition-all duration-500"
      transition={{
        duration: 1.05,
        ease: SMOOTH_EASE,
        delay: TIMELINE.cardIn,
      }}
    >
      <div
        aria-hidden="true"
        style={HOVER_OVERLAY_STYLE}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />
      <motion.div
        style={BIG_NUMBER_STYLE}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        className="absolute top-4 right-6 text-6xl md:text-8xl font-black leading-none pointer-events-none select-none"
        transition={{
          duration: 1.1,
          ease: SMOOTH_EASE,
          delay: TIMELINE.bigNumber,
        }}
      >
        {number}
      </motion.div>
      <motion.div
        className="relative mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{
          duration: 0.75,
          ease: SMOOTH_EASE,
          delay: TIMELINE.beforeText,
        }}
      >
        <div className="text-[10px] font-bold text-lightGray uppercase tracking-widest mb-1.5">
          Vorher
        </div>
        <div
          style={strikethroughStyle}
          className="relative text-sm md:text-base text-gray-500 leading-snug"
        >
          {before}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        className="relative flex items-center gap-2 my-3"
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.6,
          ease: SMOOTH_EASE,
          delay: TIMELINE.arrowFade,
        }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          className="flex-1 h-px origin-right bg-gradient-to-r from-transparent via-primaryOrange/30 to-transparent"
          transition={{
            duration: 0.75,
            ease: SMOOTH_EASE,
            delay: TIMELINE.arrowFade + 0.1,
          }}
        />
        <div className="relative">
          {!shouldReduceMotion &&
            isInView &&
            SPARKLE_ANGLES.map((angle, i) => (
              <motion.div
                key={angle}
                aria-hidden="true"
                style={SPARKLE_STYLE}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full pointer-events-none"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: Math.cos((angle * Math.PI) / 180) * 22,
                  y: Math.sin((angle * Math.PI) / 180) * 22,
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                  delay: TIMELINE.sparkleBurst + i * 0.025,
                }}
              />
            ))}
          <motion.div
            style={ARROW_BUTTON_STYLE}
            initial={{ scale: 0, rotate: 0 }}
            className="relative flex items-center justify-center w-9 h-9 rounded-full"
            animate={
              isInView ? { scale: 1, rotate: 360 } : { scale: 0, rotate: 0 }
            }
            transition={{
              duration: 1.2,
              ease: SMOOTH_EASE,
              delay: TIMELINE.arrowSpin,
            }}
          >
            <ArrowDown
              strokeWidth={3}
              aria-hidden="true"
              className="w-4 h-4 text-white"
            />
          </motion.div>
          {!shouldReduceMotion && isInView && (
            <motion.div
              aria-hidden="true"
              style={ARROW_GLOW_STYLE}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 2.2], opacity: [0.6, 0] }}
              className="absolute inset-0 rounded-full pointer-events-none"
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: TIMELINE.glowPulse,
              }}
            />
          )}
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          className="flex-1 h-px origin-left bg-gradient-to-r from-transparent via-primaryOrange/30 to-transparent"
          transition={{
            duration: 0.75,
            ease: SMOOTH_EASE,
            delay: TIMELINE.arrowFade + 0.1,
          }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        className="relative mb-5"
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.65,
          ease: SMOOTH_EASE,
          delay: TIMELINE.afterFade,
        }}
      >
        <div className="text-[10px] font-bold text-primaryOrange uppercase tracking-widest mb-1.5">
          Mit BeAFox
        </div>
        <div className="relative text-base md:text-xl font-bold leading-snug">
          <span aria-hidden="true" className="invisible block">
            {after}
          </span>
          <span aria-live="polite" className="absolute inset-0 text-darkerGray">
            {after.substring(0, typedChars)}
            {!shouldReduceMotion && typedChars < after.length && isInView && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                className="inline-block w-[2px] h-[0.9em] bg-primaryOrange ml-0.5 align-middle rounded-sm"
                transition={{
                  duration: 0.9,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            )}
          </span>
        </div>
      </motion.div>
      <motion.div
        className="relative inline-block"
        initial={{ opacity: 0, y: -16, scale: 0.85 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: -16, scale: 0.85 }
        }
        transition={{
          mass: 0.9,
          damping: 22,
          type: "spring",
          stiffness: 180,
          delay: TIMELINE.metricDrop,
        }}
      >
        {!shouldReduceMotion && isInView && (
          <motion.div
            aria-hidden="true"
            style={METRIC_GLOW_STYLE}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [0.9, 1.4], opacity: [0.7, 0] }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            transition={{
              duration: 1.2,
              ease: "easeOut",
              delay: TIMELINE.metricDrop + 0.15,
            }}
          />
        )}
        <div
          style={METRIC_BADGE_STYLE}
          className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl"
        >
          <TrendingUp
            strokeWidth={2.5}
            aria-hidden="true"
            className="w-4 h-4 text-primaryOrange flex-shrink-0"
          />
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-base md:text-lg font-black text-darkerGray tabular-nums">
              {displayMetric}
            </span>
            <span className="text-xs text-lightGray font-medium truncate">
              {metricLabel}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
