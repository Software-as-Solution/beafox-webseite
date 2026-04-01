"use client";

// IMPORTS
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ICONS
import { ChevronDown } from "lucide-react";

// TYPES
export type FaqAccordionItem = {
  answer: string;
  question: string;
  id: string | number;
};
interface FaqAccordionProps {
  className?: string;
  items: FaqAccordionItem[];
  listLabel?: string;
}
// CONSTANTS
const OPEN_CARD_STYLE = {
  border: "1px solid rgba(232,119,32,0.25)",
  boxShadow: "0 8px 24px rgba(232,119,32,0.1)",
  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
} as const;
const CLOSED_CARD_STYLE = {
  background: "#FFFFFF",
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  border: "1px solid rgba(229,231,235,0.9)",
} as const;
const BADGE_OPEN_STYLE = {
  color: "#FFFFFF",
  background: "#E87720",
} as const;
const BADGE_CLOSED_STYLE = {
  color: "#E87720",
  background: "rgba(232,119,32,0.08)",
} as const;
const EXPAND_TRANSITION = {
  duration: 0.2,
  ease: "easeInOut" as const,
};

// COMPONENT
export default function FaqAccordion({
  items,
  className = "",
  listLabel,
}: FaqAccordionProps) {
  // STATES
  const [openId, setOpenId] = useState<string | number | null>(null);
  // FUNCTIONS
  const toggleItem = useCallback((id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div
      role="list"
      aria-label={listLabel ?? "Häufig gestellte Fragen"}
      className={`max-w-3xl mx-auto space-y-3 ${className}`.trim()}
    >
      {items.map((faq, index) => {
        const isOpen = openId === faq.id;
        const displayIndex = typeof faq.id === "number" ? faq.id : index + 1;
        const panelId = `faq-panel-${faq.id}`;
        const triggerId = `faq-trigger-${faq.id}`;

        return (
          <motion.div
            role="listitem"
            key={String(faq.id)}
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
          >
            <div
              style={isOpen ? OPEN_CARD_STYLE : CLOSED_CARD_STYLE}
              className="rounded-2xl overflow-hidden transition-all duration-200"
            >
              {/* TRIGGER */}
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(faq.id)}
                className="w-full px-4 py-4 md:px-5 md:py-4 flex items-center gap-3 text-left transition-colors"
              >
                {/* Number badge */}
                <div
                  aria-hidden="true"
                  style={isOpen ? BADGE_OPEN_STYLE : BADGE_CLOSED_STYLE}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-200"
                >
                  {displayIndex}
                </div>
                {/* Question */}
                <span
                  style={{ color: isOpen ? "#E87720" : "#1F2937" }}
                  className="flex-1 font-semibold text-sm md:text-[15px] leading-snug transition-colors duration-200"
                >
                  {faq.question}
                </span>
                {/* Chevron */}
                <ChevronDown
                  aria-hidden="true"
                  className="w-4 h-4 flex-shrink-0 transition-all duration-200"
                  style={{
                    color: isOpen ? "#E87720" : "#9CA3AF",
                    transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              {/* PANEL */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="overflow-hidden"
                    transition={EXPAND_TRANSITION}
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pl-14 md:pl-[3.75rem] text-sm leading-relaxed text-lightGray">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
