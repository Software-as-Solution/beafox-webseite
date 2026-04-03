"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
// ICONS
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

// TYPES
interface Testimonial {
  org: string;
  name: string;
  role: string;
  quote: string;
  logo?: string;
}
// CONSTANTS
const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD = 60;
const CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
  border: "1px solid rgba(232,119,32,0.22)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,119,32,0.06)",
} as const;
const QUOTE_ICON_STYLE = {
  background: "rgba(232,119,32,0.12)",
} as const;
const LOGO_STYLE = {
  background: "rgba(232,119,32,0.08)",
  border: "1px solid rgba(232,119,32,0.22)",
} as const;
const ARROW_STYLE = {
  background: "rgba(232,119,32,0.08)",
  border: "1px solid rgba(232,119,32,0.28)",
} as const;
const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
};

export default function TestimonialsCarousel() {
  // HOOKS
  const t = useTranslations("home.testimonialsSection");
  // STATES
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // REFS
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // MEMOIZED
  const testimonials: Testimonial[] = useMemo(
    () => t.raw("items") as Testimonial[],
    [t],
  );
  const active = testimonials[current];
  // FUNCTIONS
  const testimonialCountRef = useRef(testimonials.length);
  testimonialCountRef.current = testimonials.length;
  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((prev) => {
        const len = testimonialCountRef.current;
        const next = prev + dir;
        if (next < 0) return len - 1;
        if (next >= len) return 0;
        return next;
      });
    },
    [], // stable reference — length read from ref
  );
  const goToSlide = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current],
  );
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
      else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
    },
    [paginate],
  );
  // EFFECTS
  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paginate, isPaused]);
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  return (
    <div
      role="region"
      className="max-w-3xl mx-auto"
      aria-roledescription={t("carouselRole")}
      aria-label={t("carouselLabel")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* CARD */}
      <div className="relative overflow-hidden" aria-live="polite">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            drag="x"
            exit="exit"
            role="group"
            key={current}
            initial="enter"
            animate="center"
            style={CARD_STYLE}
            custom={direction}
            dragElastic={0.15}
            variants={SLIDE_VARIANTS}
            onDragEnd={handleDragEnd}
            aria-roledescription={t("slideRole")}
            dragConstraints={{ left: 0, right: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            aria-label={t("slideLabel", {
              current: current + 1,
              total: testimonials.length,
            })}
            className="rounded-3xl p-6 md:p-10 cursor-grab active:cursor-grabbing"
          >
            {/* Quote icon */}
            <div className="mb-4">
              <div
                style={QUOTE_ICON_STYLE}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <Quote
                  aria-hidden="true"
                  className="w-5 h-5 text-primaryOrange"
                />
              </div>
            </div>
            {/* Quote text */}
            <blockquote className="text-darkerGray/90 text-base md:text-lg leading-relaxed mb-6 italic">
              &ldquo;{active.quote}&rdquo;
            </blockquote>
            {/* Author */}
            <div className="flex items-center gap-3 sm:gap-4">
              {active.logo && (
                <div
                  className="h-[4.5rem] w-[5.25rem] sm:h-20 sm:w-[6.25rem] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden px-1 py-0.5"
                  style={LOGO_STYLE}
                >
                  <Image
                    width={200}
                    height={120}
                    loading="lazy"
                    alt={active.org}
                    src={active.logo}
                    sizes="(max-width: 768px) 120px, 140px"
                    className="h-full w-full object-contain object-center"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-darkerGray text-sm font-bold">
                  {active.name}
                </div>
                <div className="text-darkerGray/70 text-xs">
                  {active.role} · {active.org}
                </div>
              </div>
              {/* Stars */}
              <div
                aria-label={t("ratingLabel")}
                className="flex items-center gap-0.5 flex-shrink-0"
              >
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    stroke="none"
                    fill="#F97316"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* CONTROLS */}
      <div
        role="group"
        aria-label={t("controlsLabel")}
        className="flex items-center justify-center gap-4 mt-6"
      >
        {/* Previous */}
        <button
          style={ARROW_STYLE}
          onClick={() => paginate(-1)}
          aria-label={t("prevLabel")}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-primaryOrange/15"
        >
          <ChevronLeft
            aria-hidden="true"
            className="w-4 h-4 text-primaryOrange"
          />
        </button>

        {/* Dots */}
        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label={t("selectLabel")}
        >
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              onClick={() => goToSlide(idx)}
              aria-selected={idx === current}
              aria-label={`Testimonial ${idx + 1}`}
              className="transition-all duration-300"
              style={{
                height: 8,
                borderRadius: 4,
                width: idx === current ? 24 : 8,
                background:
                  idx === current ? "#E87720" : "rgba(232,119,32,0.2)",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          style={ARROW_STYLE}
          onClick={() => paginate(1)}
          aria-label={t("nextLabel")}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-primaryOrange/15"
        >
          <ChevronRight
            aria-hidden="true"
            className="w-4 h-4 text-primaryOrange"
          />
        </button>
      </div>
    </div>
  );
}
