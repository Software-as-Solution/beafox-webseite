"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// CUSTOM COMPONENTS
import Button from "@/components/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
// IMPORTS
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// ICONS
import { Sparkles, RotateCcw } from "lucide-react";

// TYPES
interface ChatMessage {
  text: string;
  timeLabel?: string;
  delayBefore: number;
  sender: "bea" | "user";
}

// CONSTANTS
const CHAT_MESSAGES: ChatMessage[] = [
  {
    sender: "bea",
    text: "Hey! 👋 Du hast gerade dein erstes Gehalt bekommen: 1.247€ netto. Glückwunsch! Soll ich dir zeigen, was du als erstes damit tun solltest?",
    delayBefore: 2000,
  },
  {
    sender: "user",
    text: "Ja bitte! Ich hab keine Ahnung was Brutto/Netto bedeutet 😅",
    delayBefore: 2500,
  },
  {
    sender: "bea",
    text: 'Kein Problem! Dafür bin ich da. Ich empfehle dir das Modul „Dein erstes Gehalt" zu absolvieren. Dauert 5 Minuten, danach weißt du genau was abgezogen wird und was dein erster Schritt ist. Ready? 🐾',
    delayBefore: 2200,
  },
  {
    sender: "user",
    text: "Los geht's! 🚀",
    delayBefore: 1800,
  },
  {
    sender: "bea",
    text: "Du hast diesen Monat 124€ gespart, das sind 47€ mehr als letzten Monat! 🎉 Soll ich dir zeigen wie du das Geld jetzt für dich arbeiten lässt?",
    timeLabel: "· 3 Wochen später",
    delayBefore: 3000,
  },
];

const CAPABILITY_TAGS = [
  "Gehaltsdaten",
  "Sparverhalten",
  "Lernfortschritt",
  "Lebenssituation",
] as const;

const IN_VIEW_THRESHOLD = 0.4;

const BEA_BUBBLE_STYLE = {
  background: "rgba(232,119,32,0.1)",
  border: "1px solid rgba(232,119,32,0.28)",
  color: "rgba(55,65,81,0.98)",
} as const;

const USER_BUBBLE_STYLE = {
  background: "rgba(31,41,55,0.08)",
  border: "1px solid rgba(31,41,55,0.1)",
  color: "rgba(55,65,81,0.95)",
} as const;

const BEA_TYPING_STYLE = {
  background: "rgba(232,119,32,0.1)",
  border: "1px solid rgba(232,119,32,0.25)",
} as const;

const USER_TYPING_STYLE = {
  background: "rgba(31,41,55,0.08)",
  border: "1px solid rgba(31,41,55,0.08)",
} as const;

// SUBCOMPONENTS
function TypingIndicator({ sender }: { sender: "bea" | "user" }) {
  const isBea = sender === "bea";

  return (
    <div
      role="status"
      aria-label={`${isBea ? "Bea" : "Du"} tippt…`}
      className={`flex flex-col ${isBea ? "items-start" : "items-end"}`}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
        style={{
          color: isBea ? "rgba(232,119,32,0.8)" : "rgba(31,41,55,0.45)",
        }}
      >
        {isBea ? "Bea" : "Du"}
      </div>
      <div
        style={isBea ? BEA_TYPING_STYLE : USER_TYPING_STYLE}
        className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: isBea ? "#E87720" : "rgba(31,41,55,0.35)",
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// MAIN COMPONENT
export default function BeaChatDemo({
  onCtaClick,
}: {
  onCtaClick: () => void;
}) {
  // STATES
  const [isTyping, setIsTyping] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [typingSender, setTypingSender] = useState<"bea" | "user">("bea");

  // REFS
  const hasTrackedImpression = useRef(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // HOOKS
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInView = useInView(chatRef, {
    once: true,
    amount: IN_VIEW_THRESHOLD,
  });

  // CONSTANTS
  const messages = useMemo(() => CHAT_MESSAGES, []);
  const messageVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 14, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
      };

  // FUNCTIONS
  const handleReplay = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisibleCount(0);
    setIsTyping(false);
    setIsComplete(false);
    setChatStarted(true);
  }, []);

  // EFFECTS
  useEffect(() => {
    if (isInView && !chatStarted) {
      setChatStarted(true);
      if (!hasTrackedImpression.current) {
        hasTrackedImpression.current = true;
      }
    }
  }, [isInView, chatStarted]);

  useEffect(() => {
    if (!chatStarted || visibleCount >= messages.length) {
      if (chatStarted && visibleCount >= messages.length && !isComplete) {
        setIsComplete(true);
      }
      return;
    }

    const nextMessage = messages[visibleCount];
    setTypingSender(nextMessage.sender);
    setIsTyping(true);

    const delay = prefersReducedMotion ? 300 : nextMessage.delayBefore;

    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((prev) => prev + 1);
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [chatStarted, visibleCount, messages, prefersReducedMotion, isComplete]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [visibleCount, isTyping, prefersReducedMotion]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          border: "1px solid rgba(232,119,32,0.22)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.1), 0 0 0 1px rgba(232,119,32,0.06)",
        }}
      >
        {/* CHAT HEADER */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(232,119,32,0.18)" }}
        >
          <div className="w-12 h-12 rounded-xl bg-primaryWhite border border-primaryOrange/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              width={50}
              height={50}
              loading="lazy"
              src="/Logo.webp"
              alt="Bea Maskottchen"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-darkerGray text-base font-bold">Bea</div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-green-600 text-[12px] font-medium">
                Dein KI-Begleiter
              </span>
            </div>
          </div>
          <AnimatePresence>
            {isComplete && (
              <motion.button
                onClick={handleReplay}
                title="Nochmal abspielen"
                exit={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.8 }}
                aria-label="Chat-Demo erneut abspielen"
                className="p-2 rounded-xl hover:bg-primaryOrange/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-primaryOrange" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* CHAT MESSAGES */}
        <div
          role="log"
          ref={chatRef}
          aria-live="polite"
          aria-label="Chat-Verlauf mit Bea"
          style={{ scrollbarWidth: "none" }}
          className="px-5 py-6 space-y-4 min-h-[280px] max-h-[420px] overflow-y-auto"
        >
          {/* MESSAGES — no AnimatePresence wrapper needed, just enter animations */}
          {messages.slice(0, visibleCount).map((msg, idx) => {
            const isBea = msg.sender === "bea";
            return (
              <motion.div
                key={`msg-${idx}`}
                {...messageVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`flex flex-col ${isBea ? "items-start" : "items-end"}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[12px] font-bold tracking-wider"
                    style={{
                      color: isBea
                        ? "rgba(232,119,32,0.9)"
                        : "rgba(31,41,55,0.5)",
                    }}
                  >
                    {isBea ? "Bea" : "Du"}
                  </span>
                  {msg.timeLabel && (
                    <span className="text-[10px] text-darkerGray/45">
                      {msg.timeLabel}
                    </span>
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isBea
                      ? "rounded-tl-md max-w-[90%]"
                      : "rounded-tr-md max-w-[75%]"
                  }`}
                  style={isBea ? BEA_BUBBLE_STYLE : USER_BUBBLE_STYLE}
                >
                  {msg.text}
                </div>
              </motion.div>
            );
          })}

          {/* TYPING INDICATOR — separate AnimatePresence, fixed key */}
          <AnimatePresence mode="wait">
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <TypingIndicator sender={typingSender} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CAPABILITY PILLS */}
        <div
          className="px-5 py-3.5 flex items-center gap-2 flex-wrap"
          style={{ borderTop: "1px solid rgba(232,119,32,0.18)" }}
        >
          <span className="text-[12px] text-darkerGray/55 font-medium mr-1">
            Bea nutzt:
          </span>
          {CAPABILITY_TAGS.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                color: "#E87720",
                background: "rgba(232,119,32,0.15)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="text-center mt-6"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <p className="text-base text-lightGray mb-3">
              Bea wird smarter, je länger du dabei bist.
            </p>
            <Button
              variant="primary"
              onClick={onCtaClick}
              className="flex items-center justify-center gap-2 mx-auto !px-6 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
            >
              <Sparkles className="w-4 h-4" />
              Bea kennenlernen
              <Sparkles className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
