"use client";

// IMPORTS
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
// COMPONENTS
import TransformationCard from "./TransformationCard";

// TYPES
interface Transformation {
  after: string;
  before: string;
  metric: string;
  metricLabel: string;
}
// CONSTANTS
const PATH_BG_STYLE = {
  background:
    "linear-gradient(to bottom, transparent, rgba(232,119,32,0.08) 8%, rgba(232,119,32,0.08) 92%, transparent)",
} as const;
const PATH_DRAW_STYLE = {
  background:
    "linear-gradient(to bottom, transparent, #E87720 8%, #F08A3C 50%, #E87720 92%, transparent)",
  boxShadow: "0 0 12px rgba(232,119,32,0.4)",
} as const;
const COMET_STYLE = {
  background: "radial-gradient(circle, #FFFFFF 0%, #F5A155 40%, #E87720 100%)",
  boxShadow: "0 0 16px rgba(232,119,32,0.8), 0 0 32px rgba(232,119,32,0.4)",
} as const;
const NODE_PULSE_STYLE = {
  background:
    "radial-gradient(circle, rgba(232,119,32,0.3) 0%, transparent 70%)",
} as const;
const NODE_DOT_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow:
    "0 0 0 3px #FFFFFF, 0 0 0 4px rgba(232,119,32,0.3), 0 4px 12px rgba(232,119,32,0.4)",
} as const;
const COMET_OPACITY_VALUES = [0, 1, 1, 0] as const;
const SCROLL_OFFSET = ["start 70%", "end 30%"] as const;
const COMET_OPACITY_KEYFRAMES = [0, 0.05, 0.95, 1] as const;

// SUBCOMPONENTS
function TimelineNode({ isEven, index }: { isEven: boolean; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const positionStyle = isEven
    ? { right: "calc(-2rem - 10px)" }
    : { left: "calc(-2rem - 10px)" };

  return (
    <div
      aria-hidden="true"
      style={positionStyle}
      className="hidden md:block absolute top-12 z-20"
    >
      <motion.div
        className="relative w-5 h-5"
        viewport={{ once: true, amount: 0.5 }}
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
        whileInView={
          shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }
        }
        transition={{
          delay: 0.3,
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.div
          style={NODE_PULSE_STYLE}
          className="absolute inset-0 rounded-full"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        />
        <div className="absolute inset-1 rounded-full" style={NODE_DOT_STYLE} />
      </motion.div>
    </div>
  );
}
function TimelineConnector({ isEven }: { isEven: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const positionStyle = isEven
    ? {
        transformOrigin: "right",
        right: "calc(-2rem + 10px)",
        background: "linear-gradient(to right, transparent, #E87720)",
      }
    : {
        transformOrigin: "left",
        left: "calc(-2rem + 10px)",
        background: "linear-gradient(to left, transparent, #E87720)",
      };

  return (
    <motion.div
      aria-hidden="true"
      viewport={{ once: true, amount: 0.5 }}
      style={{ ...positionStyle, width: "calc(2rem - 10px)" }}
      className="hidden md:block absolute top-[3.625rem] h-px z-10"
      initial={shouldReduceMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
      whileInView={
        shouldReduceMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 }
      }
      transition={{
        delay: 0.5,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
}

export default function TransformationsTimeline() {
  // HOOKS
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("home.promiseSection");
  // REFS
  const containerRef = useRef<HTMLDivElement>(null);
  // CONTSTANTS
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: SCROLL_OFFSET as any,
  });
  const cometOpacity = useTransform(
    scrollYProgress,
    [...COMET_OPACITY_KEYFRAMES],
    [...COMET_OPACITY_VALUES],
  );
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cometY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const transformations = t.raw("transformations") as readonly Transformation[];

  return (
    <div
      ref={containerRef}
      className="relative mb-14 md:mb-20 max-w-5xl mx-auto"
    >
      {!shouldReduceMotion && (
        <div
          aria-hidden="true"
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none"
        >
          <div className="absolute inset-0 w-px" style={PATH_BG_STYLE} />
          <motion.div
            style={{ ...PATH_DRAW_STYLE, scaleY: pathLength }}
            className="absolute top-0 left-0 w-px h-full origin-top"
          />
          <motion.div
            className="absolute left-0 w-px"
            style={{ top: cometY, opacity: cometOpacity }}
          >
            <div
              style={COMET_STYLE}
              className="absolute left-1/2 top-0 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
            />
          </motion.div>
        </div>
      )}
      <div className="relative space-y-6 md:space-y-10">
        {transformations.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`relative md:w-[calc(50%-2rem)] ${
                isEven ? "md:mr-auto" : "md:ml-auto"
              }`}
            >
              <TimelineNode isEven={isEven} index={idx} />
              <TimelineConnector isEven={isEven} />
              <TransformationCard
                index={idx}
                after={item.after}
                before={item.before}
                metric={item.metric}
                metricLabel={item.metricLabel}
                number={String(idx + 1).padStart(2, "0")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
