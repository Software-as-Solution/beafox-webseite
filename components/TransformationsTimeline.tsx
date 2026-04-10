"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useTranslations } from "next-intl";
import TransformationCard from "./TransformationCard";

interface Transformation {
  before: string;
  after: string;
  metric: string;
  metricLabel: string;
}

// CONSTANTS — alignment math
// Card occupies 50% - GAP, leaving GAP * 2 in the center
// Node center must sit exactly on the center line
const CARD_GAP_REM = 2; // matches md:w-[calc(50%-2rem)]
const NODE_SIZE_PX = 20; // w-5 h-5
const NODE_OFFSET_REM = CARD_GAP_REM; // distance from card edge to center line
// Node's outer edge is at NODE_OFFSET_REM, but we want its CENTER there
// So we shift it inward by half its width
const NODE_HALF_PX = NODE_SIZE_PX / 2;

export default function TransformationsTimeline() {
  const t = useTranslations("home.promiseSection");
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const transformations = t.raw("transformations") as readonly Transformation[];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 30%"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cometY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const cometOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0],
  );

  return (
    <div
      ref={containerRef}
      className="relative mb-14 md:mb-20 max-w-5xl mx-auto"
    >
      {/* ─── ANIMATED DRAWING PATH (desktop only) ─── */}
      {!shouldReduceMotion && (
        <div
          aria-hidden="true"
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px pointer-events-none"
          style={{
            transform: "translateX(-50%)",
          }}
        >
          {/* Background line */}
          <div
            className="absolute inset-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(232,119,32,0.08) 8%, rgba(232,119,32,0.08) 92%, transparent)",
            }}
          />

          {/* Animated drawing line */}
          <motion.div
            className="absolute top-0 left-0 w-px h-full origin-top"
            style={{
              scaleY: pathLength,
              background:
                "linear-gradient(to bottom, transparent, #E87720 8%, #F08A3C 50%, #E87720 92%, transparent)",
              boxShadow: "0 0 12px rgba(232,119,32,0.4)",
            }}
          />

          {/* Comet — wrapped in a positioning parent so transforms don't conflict */}
          <motion.div
            className="absolute left-0 w-px"
            style={{
              top: cometY,
              opacity: cometOpacity,
            }}
          >
            <div
              className="absolute left-1/2 top-0 w-3 h-3 rounded-full"
              style={{
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, #FFFFFF 0%, #F5A155 40%, #E87720 100%)",
                boxShadow:
                  "0 0 16px rgba(232,119,32,0.8), 0 0 32px rgba(232,119,32,0.4)",
              }}
            />
          </motion.div>
        </div>
      )}

      {/* ─── CARDS ─── */}
        {transformations.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`relative md:w-[calc(50%-${CARD_GAP_REM}rem)] ${
                isEven ? "md:mr-auto" : "md:ml-auto"
              }`}
            >
              <ConnectionNode isEven={isEven} index={idx} />
              <ConnectionLine isEven={isEven} index={idx} />

              <TransformationCard
                number={String(idx + 1).padStart(2, "0")}
                before={item.before}
                after={item.after}
                metric={item.metric}
                metricLabel={item.metricLabel}
                index={idx}
              />
            </div>
          );
        })}
      </div>
  );
}

// ─── CONNECTION NODE on the timeline ───
// Node center must sit exactly on the center line
// Card edge → 2rem gap → center line
// Node center should be at (2rem) from card edge
// Node is 20px wide → its left edge needs to be at (2rem - 10px)
function ConnectionNode({ isEven, index }: { isEven: boolean; index: number }) {
  const shouldReduceMotion = useReducedMotion();

  // Position: outer edge of node sits at exactly the card-gap distance,
  // but we shift inward by half the node width so its CENTER is on the line
  const positionStyle = isEven
    ? { right: `calc(-${CARD_GAP_REM}rem - ${NODE_HALF_PX}px)` }
    : { left: `calc(-${CARD_GAP_REM}rem - ${NODE_HALF_PX}px)` };

  return (
    <div
      aria-hidden="true"
      className="hidden md:block absolute top-12 z-20"
      style={positionStyle}
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
        whileInView={
          shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }
        }
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative w-5 h-5"
      >
        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,32,0.3) 0%, transparent 70%)",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.8, 1],
                  opacity: [0.6, 0, 0.6],
                }
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        />
        {/* Solid dot */}
        <div
          className="absolute inset-1 rounded-full"
          style={{
            background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
            boxShadow:
              "0 0 0 3px #FFFFFF, 0 0 0 4px rgba(232,119,32,0.3), 0 4px 12px rgba(232,119,32,0.4)",
          }}
        />
      </motion.div>
    </div>
  );
}

// ─── HORIZONTAL CONNECTION LINE between node and card ───
// Line goes from card edge to node CENTER
// Distance: CARD_GAP_REM (to outer edge of node) - NODE_HALF_PX (to center of node)
function ConnectionLine({ isEven, index }: { isEven: boolean; index: number }) {
  const shouldReduceMotion = useReducedMotion();

  // Line width: from card edge to node center
  const lineWidth = `calc(${CARD_GAP_REM}rem - ${NODE_HALF_PX}px)`;

  const positionStyle = isEven
    ? { right: `-${lineWidth}`, transformOrigin: "right" }
    : { left: `-${lineWidth}`, transformOrigin: "left" };

  return (
    <motion.div
      aria-hidden="true"
      initial={shouldReduceMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
      whileInView={
        shouldReduceMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 }
      }
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.6,
        delay: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="hidden md:block absolute top-[3.625rem] h-px z-10"
      style={{
        ...positionStyle,
        width: lineWidth,
        background: isEven
          ? "linear-gradient(to right, transparent, #E87720)"
          : "linear-gradient(to left, transparent, #E87720)",
      }}
    />
  );
}
