"use client";

// IMPORTS
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
// ICONS
import { ArrowUp } from "lucide-react";

// CONSTANTS
const SCROLL_THRESHOLD = 300;

export default function ScrollToTop() {
  // STATES
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // REFS
  const rafRef = useRef<number | null>(null);
  // FUNCTIONS
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const next = window.scrollY > SCROLL_THRESHOLD;
      setIsVisible((prev) => (prev === next ? prev : next));
    });
  }, []);
  const scrollToTop = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);
  // USE EFFECT
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          title="Nach oben"
          onClick={scrollToTop}
          aria-label="Nach oben scrollen"
          transition={{ duration: 0.2, ease: "easeOut" }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
          className="fixed right-4 md:right-6 bottom-20 lg:bottom-6 z-40 bg-primaryOrange hover:bg-primaryOrange/90 text-primaryWhite rounded-full p-2.5 md:p-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          style={{
            boxShadow: "0 4px 16px rgba(232,119,32,0.25)",
          }}
        >
          <ArrowUp
            aria-hidden="true"
            className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
