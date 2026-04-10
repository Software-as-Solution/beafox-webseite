"use client";

import { ArrowDown, TrendingUp } from "lucide-react";
import { motion, useReducedMotion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// CONSTANTS — single timeline, all delays relative to card-in
const TIMELINE = {
  cardIn: 0,
  bigNumber: 0.4,
  beforeText: 0.55,
  strikethrough: 1.0,
  arrowFade: 1.25,
  arrowSpin: 1.4,
  sparkleBurst: 1.75,
  glowPulse: 1.8,
  afterFade: 1.7,
  typewriterStart: 1.95,
  metricDrop: 2.7,
  counterStart: 2.95,
} as const;

const TYPEWRITER_CHAR_MS = 50;
const COUNTER_DURATION = 2.5;
const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface TransformationCardProps {
  number: string;
  before: string;
  after: string;
  metric: string;
  metricLabel: string;
  index: number;
}

export default function TransformationCard({
  number,
  before,
  after,
  metric,
  metricLabel,
  index,
}: TransformationCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  const [displayMetric, setDisplayMetric] = useState(
    shouldReduceMotion ? metric : "0",
  );
  const [typedChars, setTypedChars] = useState(
    shouldReduceMotion ? after.length : 0,
  );

  // Counter animation
  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setDisplayMetric(metric);
      return;
    }

    const numberMatch = metric.match(/\d+/);
    if (!numberMatch) {
      setDisplayMetric(metric);
      return;
    }

    const targetNumber = parseInt(numberMatch[0], 10);
    const prefix = metric.substring(0, numberMatch.index);
    const suffix = metric.substring(numberMatch.index! + numberMatch[0].length);

    const controls = animate(0, targetNumber, {
      duration: COUNTER_DURATION,
      delay: TIMELINE.counterStart,
      ease: SMOOTH_EASE,
      onUpdate: (latest) => {
        setDisplayMetric(`${prefix}${Math.round(latest)}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, metric, shouldReduceMotion]);

  // Typewriter animation
  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setTypedChars(after.length);
      return;
    }

    let currentChar = 0;
    let intervalId: NodeJS.Timeout | undefined;

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

  const cardInitial = shouldReduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        x: isEven ? -42 : 42,
        y: 20,
        scale: 0.97,
      };

  const cardAnimate = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  };

  return (
    <motion.div
      ref={ref}
      initial={cardInitial}
      animate={isInView ? cardAnimate : cardInitial}
      transition={{
        duration: 1.05,
        ease: SMOOTH_EASE,
        delay: TIMELINE.cardIn,
      }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #F0E5D8",
        boxShadow:
          "0 1px 3px rgba(232,119,32,0.04), 0 12px 32px rgba(232,119,32,0.08)",
        willChange: "transform, opacity",
      }}
      className="group relative rounded-3xl p-6 md:p-8 overflow-hidden hover:-translate-y-1 transition-all duration-500"
    >
      {/* Hover gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(232,119,32,0.06) 0%, transparent 50%)",
        }}
      />

      {/* ─── BIG NUMBER ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 1.1,
          delay: TIMELINE.bigNumber,
          ease: SMOOTH_EASE,
        }}
        style={{
          color: "rgba(232,119,32,0.08)",
          willChange: "transform, opacity",
        }}
        className="absolute top-4 right-6 text-6xl md:text-8xl font-black leading-none pointer-events-none select-none"
      >
        {number}
      </motion.div>

      {/* ─── BEFORE — strikethrough draws on each line ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{
          duration: 0.75,
          delay: TIMELINE.beforeText,
          ease: SMOOTH_EASE,
        }}
        className="relative mb-4"
      >
        <div className="text-[10px] font-bold text-lightGray uppercase tracking-widest mb-1.5">
          Vorher
        </div>
        <div
          className="relative text-sm md:text-base text-gray-500 leading-snug"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E87720, #F08A3C, #E87720)",
            backgroundRepeat: "no-repeat",
            backgroundSize:
              isInView && !shouldReduceMotion ? "100% 2px" : "0% 2px",
            backgroundPosition: "0 55%",
            transition: "background-size 0.85s cubic-bezier(0.65, 0, 0.35, 1)",
            transitionDelay: `${TIMELINE.strikethrough}s`,
          }}
        >
          {before}
        </div>
      </motion.div>

      {/* ─── ARROW DIVIDER ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.6,
          delay: TIMELINE.arrowFade,
          ease: SMOOTH_EASE,
        }}
        className="relative flex items-center gap-2 my-3"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 0.75,
            delay: TIMELINE.arrowFade + 0.1,
            ease: SMOOTH_EASE,
          }}
          style={{ willChange: "transform" }}
          className="flex-1 h-px origin-right bg-gradient-to-r from-transparent via-primaryOrange/30 to-transparent"
        />

        <div className="relative">
          {/* Sparkle particles */}
          {!shouldReduceMotion &&
            isInView &&
            [0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={i}
                aria-hidden="true"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos((angle * Math.PI) / 180) * 22,
                  y: Math.sin((angle * Math.PI) / 180) * 22,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 0.9,
                  delay: TIMELINE.sparkleBurst + i * 0.025,
                  ease: "easeOut",
                }}
                style={{
                  background: "#F08A3C",
                  boxShadow: "0 0 6px rgba(232,119,32,0.8)",
                  marginTop: "-2px",
                  marginLeft: "-2px",
                  willChange: "transform, opacity",
                }}
                className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full pointer-events-none"
              />
            ))}

          {/* Rotating arrow */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={
              isInView ? { scale: 1, rotate: 360 } : { scale: 0, rotate: 0 }
            }
            transition={{
              duration: 1.2,
              delay: TIMELINE.arrowSpin,
              ease: SMOOTH_EASE,
            }}
            style={{
              background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
              boxShadow: "0 4px 14px rgba(232,119,32,0.4)",
              willChange: "transform",
            }}
            className="relative flex items-center justify-center w-9 h-9 rounded-full"
          >
            <ArrowDown
              className="w-4 h-4 text-white"
              strokeWidth={3}
              aria-hidden="true"
            />
          </motion.div>

          {/* Glow pulse ring */}
          {!shouldReduceMotion && isInView && (
            <motion.div
              aria-hidden="true"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 2.2], opacity: [0.6, 0] }}
              transition={{
                duration: 1.2,
                delay: TIMELINE.glowPulse,
                ease: "easeOut",
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(232,119,32,0.5) 0%, transparent 70%)",
                willChange: "transform, opacity",
              }}
              className="absolute inset-0 rounded-full pointer-events-none"
            />
          )}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 0.75,
            delay: TIMELINE.arrowFade + 0.1,
            ease: SMOOTH_EASE,
          }}
          style={{ willChange: "transform" }}
          className="flex-1 h-px origin-left bg-gradient-to-r from-transparent via-primaryOrange/30 to-transparent"
        />
      </motion.div>

      {/* ─── AFTER — typewriter with pre-reserved layout space ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.65,
          delay: TIMELINE.afterFade,
          ease: SMOOTH_EASE,
        }}
        className="relative mb-5"
      >
        <div className="text-[10px] font-bold text-primaryOrange uppercase tracking-widest mb-1.5">
          Mit BeAFox
        </div>

        {/* 
          Layout reservation pattern:
          - Invisible full text (`aria-hidden`) reserves the final height
          - Absolutely positioned visible text overlays it during typewriter
          - Result: card height is stable from frame 1, no layout jumps
        */}
        <div className="relative text-base md:text-xl font-bold leading-snug">
          {/* Hidden ghost text — reserves space */}
          <span aria-hidden="true" className="invisible block">
            {after}
          </span>

          {/* Visible animated text — overlays the ghost */}
          <span aria-live="polite" className="absolute inset-0 text-darkerGray">
            {after.substring(0, typedChars)}
            {!shouldReduceMotion && typedChars < after.length && isInView && (
              <motion.span
                className="inline-block w-[2px] h-[0.9em] bg-primaryOrange ml-0.5 align-middle rounded-sm"
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ willChange: "opacity" }}
              />
            )}
          </span>
        </div>
      </motion.div>

      {/* ─── METRIC BADGE ─── */}
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.85 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: -16, scale: 0.85 }
        }
        transition={{
          delay: TIMELINE.metricDrop,
          type: "spring",
          stiffness: 180,
          damping: 22,
          mass: 0.9,
        }}
        style={{ willChange: "transform, opacity" }}
        className="relative inline-block"
      >
        {/* Glow pulse around badge */}
        {!shouldReduceMotion && isInView && (
          <motion.div
            aria-hidden="true"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [0.9, 1.4], opacity: [0.7, 0] }}
            transition={{
              duration: 1.2,
              delay: TIMELINE.metricDrop + 0.15,
              ease: "easeOut",
            }}
            style={{
              background:
                "radial-gradient(circle, rgba(232,119,32,0.4) 0%, transparent 70%)",
              willChange: "transform, opacity",
            }}
            className="absolute inset-0 rounded-xl pointer-events-none"
          />
        )}

        <div
          className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
            border: "1px solid rgba(232,119,32,0.25)",
            boxShadow: "0 4px 12px rgba(232,119,32,0.08)",
          }}
        >
          <TrendingUp
            className="w-4 h-4 text-primaryOrange flex-shrink-0"
            strokeWidth={2.5}
            aria-hidden="true"
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
