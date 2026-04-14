"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// HOOKS
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
// IMPORTS
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// ICONS
import type { LucideIcon } from "lucide-react";
import {
  Zap,
  RotateCcw,
  Handshake,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// TYPES
type Sender = "bea" | "user";
type UseCaseId = (typeof USE_CASE_IDS)[number];
interface ChatMessage {
  text: string;
  sender: Sender;
  timeLabel?: string;
  delayBefore: number;
}
interface UseCase {
  id: UseCaseId;
  label: string;
  icon: LucideIcon;
  shortLabel: string;
  capabilities: readonly string[];
  messages: readonly ChatMessage[];
}
// CONSTANTS
const C = {
  brand: "#E87720",
  brandLight: "#F08A3C",
  userBg: "rgba(31,41,55,0.08)",
  beaText: "rgba(55,65,81,0.98)",
  userDot: "rgba(31,41,55,0.35)",
  userText: "rgba(55,65,81,0.95)",
  brand10: "rgba(232,119,32,0.1)",
  userBorder: "rgba(31,41,55,0.1)",
  brand06: "rgba(232,119,32,0.06)",
  brand08: "rgba(232,119,32,0.08)",
  brand15: "rgba(232,119,32,0.15)",
  brand18: "rgba(232,119,32,0.18)",
  brand22: "rgba(232,119,32,0.22)",
  brand25: "rgba(232,119,32,0.25)",
  brand28: "rgba(232,119,32,0.28)",
  brand35: "rgba(232,119,32,0.35)",
} as const;
const STYLES = {
  card: {
    border: `1px solid ${C.brand22}`,
    background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
    boxShadow: `0 24px 64px rgba(0,0,0,0.1), 0 0 0 1px ${C.brand06}`,
  },
  tabsContainer: {
    background: C.brand06,
    border: `1px solid ${C.brand18}`,
  },
  activeTabBg: {
    boxShadow: `0 4px 14px ${C.brand35}`,
    background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
  },
  beaBubble: {
    color: C.beaText,
    background: C.brand10,
    border: `1px solid ${C.brand28}`,
  },
  userBubble: {
    color: C.userText,
    background: C.userBg,
    border: `1px solid ${C.userBorder}`,
  },
  beaTyping: {
    background: C.brand10,
    border: `1px solid ${C.brand25}`,
  },
  userTyping: {
    background: C.userBg,
    border: `1px solid ${C.brand08}`,
  },
  divider: {
    borderBottom: `1px solid ${C.brand18}`,
  },
  dividerTop: {
    borderTop: `1px solid ${C.brand18}`,
  },
  capabilityPill: {
    color: C.brand,
    background: C.brand15,
  },
  endCtaButton: {
    background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
    boxShadow: `0 8px 24px ${C.brand35}`,
  },
  endCtaCard: {
    background: `linear-gradient(180deg, #FFFFFF 0%, ${C.brand06} 100%)`,
    border: `1.5px solid ${C.brand22}`,
  },
} as const;
const IN_VIEW_THRESHOLD = 0.4;
const REDUCED_MOTION_DELAY = 300;
const TYPING_TRANSITION = { duration: 0.15 } as const;
const USE_CASE_ICONS: Record<UseCaseId, LucideIcon> = {
  lernen: GraduationCap,
  proaktiv: Zap,
  partner: Handshake,
};
const USE_CASE_IDS = ["lernen", "proaktiv", "partner"] as const;
const MESSAGE_TRANSITION = { duration: 0.35, ease: "easeOut" } as const;

// SUBCOMPONENTS
interface ChatBubbleProps {
  userName: string;
  message: ChatMessage;
  assistantName: string;
  prefersReducedMotion: boolean;
}
function ChatBubble({
  message,
  userName,
  assistantName,
  prefersReducedMotion,
}: ChatBubbleProps) {
  const isBea = message.sender === "bea";
  const initial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 14, scale: 0.97 };
  const animate = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={MESSAGE_TRANSITION}
      className={`flex flex-col ${isBea ? "items-start" : "items-end"}`}
    >
      <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-1.5">
        <span
          className="text-[10px] md:text-[12px] font-bold tracking-wider"
          style={{ color: isBea ? "rgba(232,119,32,0.9)" : C.userText }}
        >
          {isBea ? assistantName : userName}
        </span>
        {message.timeLabel && (
          <span className="text-[9px] md:text-[10px] text-darkerGray/45">
            {message.timeLabel}
          </span>
        )}
      </div>
      <div
        className={`rounded-2xl px-3 py-2 md:px-4 md:py-3 text-[13px] md:text-sm leading-relaxed ${
          isBea ? "rounded-tl-md max-w-[88%]" : "rounded-tr-md max-w-[80%]"
        }`}
        style={isBea ? STYLES.beaBubble : STYLES.userBubble}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

interface TypingIndicatorProps {
  label: string;
  sender: Sender;
  typingLabel: string;
}
function TypingIndicator({ sender, label, typingLabel }: TypingIndicatorProps) {
  const isBea = sender === "bea";

  return (
    <div
      role="status"
      aria-label={`${label} ${typingLabel}`}
      className={`flex flex-col ${isBea ? "items-start" : "items-end"}`}
    >
      <div
        className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1 md:mb-1.5"
        style={{
          color: isBea ? "rgba(232,119,32,0.8)" : "rgba(31,41,55,0.45)",
        }}
      >
        {label}
      </div>
      <div
        style={isBea ? STYLES.beaTyping : STYLES.userTyping}
        className="rounded-2xl px-3 py-2 md:px-4 md:py-3 flex items-center gap-1 md:gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
            style={{ background: isBea ? C.brand : C.userDot }}
            transition={{
              duration: 0.6,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function BeaChatDemo() {
  // HOOKS
  const t = useTranslations("home.beaChatDemo");
  // STATES
  const [isTyping, setIsTyping] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [typingSender, setTypingSender] = useState<Sender>("bea");
  const [activeUseCaseId, setActiveUseCaseId] = useState<UseCaseId>(
    USE_CASE_IDS[0],
  );
  // REFS
  const chatRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // CONSTANTS
  const isInView = useInView(containerRef, {
    once: true,
    amount: IN_VIEW_THRESHOLD,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const useCases = useMemo<readonly UseCase[]>(
    () =>
      USE_CASE_IDS.map((id) => {
        const raw = t.raw(`useCases.${id}`) as Omit<UseCase, "id" | "icon">;
        return { ...raw, id, icon: USE_CASE_ICONS[id] };
      }),
    [t],
  );
  const activeUseCase = useMemo(
    () => useCases.find((uc) => uc.id === activeUseCaseId) ?? useCases[0],
    [useCases, activeUseCaseId],
  );
  const labels = useMemo(
    () => ({
      logoAlt: t("logoAlt"),
      userName: t("userName"),
      typingLabel: t("typingLabel"),
      replayTitle: t("replayTitle"),
      endCtaButton: t("endCtaButton"),
      assistantName: t("assistantName"),
      tabsAriaLabel: t("tabsAriaLabel"),
      endCtaQuestion: t("endCtaQuestion"),
      assistantStatus: t("assistantStatus"),
      replayAriaLabel: t("replayAriaLabel"),
      chatLogAriaLabel: t("chatLogAriaLabel"),
      capabilitiesLabel: t("capabilitiesLabel"),
      endCtaQuestionHighlight: t("endCtaQuestionHighlight"),
    }),
    [t],
  );
  // FUNCTIONS
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const resetChatState = useCallback(() => {
    clearTimer();
    setVisibleCount(0);
    setIsTyping(false);
    setIsComplete(false);
  }, [clearTimer]);
  const handleUseCaseChange = useCallback(
    (id: UseCaseId) => {
      if (id === activeUseCaseId) return;
      resetChatState();
      setActiveUseCaseId(id);
    },
    [activeUseCaseId, resetChatState],
  );
  // EFFECTS
  useEffect(() => {
    if (isInView && !chatStarted) {
      setChatStarted(true);
    }
  }, [isInView, chatStarted]);
  useEffect(() => {
    if (!chatStarted) return;

    const { messages } = activeUseCase;

    if (visibleCount >= messages.length) {
      setIsComplete(true);
      return;
    }

    const nextMessage = messages[visibleCount];
    setTypingSender(nextMessage.sender);
    setIsTyping(true);

    const delay = prefersReducedMotion
      ? REDUCED_MOTION_DELAY
      : nextMessage.delayBefore;

    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((prev) => prev + 1);
      timerRef.current = null;
    }, delay);

    return clearTimer;
  }, [
    chatStarted,
    visibleCount,
    activeUseCase,
    prefersReducedMotion,
    clearTimer,
  ]);
  useEffect(() => {
    const chatEl = chatRef.current;
    if (!chatEl) return;
    chatEl.scrollTo({
      top: chatEl.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [visibleCount, isTyping, isComplete, prefersReducedMotion]);
  useEffect(() => clearTimer, [clearTimer]);

  return (
    <div ref={containerRef} className="w-full">
      <div
        role="tablist"
        aria-label={labels.tabsAriaLabel}
        className="mb-4 md:mb-5 flex justify-center lg:justify-start"
      >
        <div
          style={STYLES.tabsContainer}
          className="inline-flex items-center gap-1 md:gap-1.5 p-1 md:p-1.5 rounded-2xl max-w-full"
        >
          {useCases.map((uc) => {
            const Icon = uc.icon;
            const isActive = uc.id === activeUseCaseId;
            return (
              <button
                role="tab"
                key={uc.id}
                id={`tab-${uc.id}`}
                aria-selected={isActive}
                aria-controls={`chat-panel-${uc.id}`}
                onClick={() => handleUseCaseChange(uc.id)}
                className={`relative inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-white"
                    : "text-darkerGray/70 hover:text-primaryOrange"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-bg"
                    className="absolute inset-0 rounded-xl"
                    style={STYLES.activeTabBg}
                    transition={{
                      damping: 30,
                      type: "spring",
                      stiffness: 380,
                    }}
                  />
                )}
                <Icon aria-hidden="true" className="w-4 h-4 relative z-10" />
                <span className="relative z-10 text-sm md:text-base">
                  {uc.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div
        role="tabpanel"
        style={STYLES.card}
        id={`chat-panel-${activeUseCase.id}`}
        aria-labelledby={`tab-${activeUseCase.id}`}
        className="rounded-2xl md:rounded-3xl overflow-hidden"
      >
        <div
          style={STYLES.divider}
          className="flex items-center gap-2.5 md:gap-3 px-4 py-3 md:px-5 md:py-4"
        >
          <div className="w-8 h-8 md:w-12 md:h-12 bg-primaryWhite flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              width={100}
              height={100}
              loading="lazy"
              alt={labels.logoAlt}
              src="/assets/Logos/Logo.webp"
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-darkerGray text-sm md:text-base font-bold">
              {labels.assistantName}
            </div>
            <div className="flex items-center gap-1 md:gap-1.5">
              <span
                className="relative flex h-1.5 w-1.5 md:h-2 md:w-2"
                aria-hidden="true"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500" />
              </span>
              <span className="text-green-600 text-[10px] md:text-[12px] font-medium">
                {labels.assistantStatus}
              </span>
            </div>
          </div>
          <AnimatePresence>
            {isComplete && (
              <motion.button
                onClick={resetChatState}
                title={labels.replayTitle}
                exit={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                aria-label={labels.replayAriaLabel}
                initial={{ opacity: 0, scale: 0.8 }}
                className="p-1.5 md:p-2 rounded-xl hover:bg-primaryOrange/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4 text-primaryOrange" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div
          role="log"
          ref={chatRef}
          aria-live="polite"
          style={{ scrollbarWidth: "none" }}
          aria-label={labels.chatLogAriaLabel}
          className="px-4 py-4 md:px-5 md:py-6 space-y-3 md:space-y-4 min-h-[280px] md:min-h-[320px] max-h-[420px] md:max-h-[480px] overflow-y-auto"
        >
          {activeUseCase.messages.slice(0, visibleCount).map((msg, idx) => (
            <ChatBubble
              message={msg}
              userName={labels.userName}
              assistantName={labels.assistantName}
              key={`${activeUseCase.id}-msg-${idx}`}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
          <AnimatePresence mode="wait">
            {isTyping && (
              <motion.div
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={TYPING_TRANSITION}
                key={`${activeUseCase.id}-typing`}
              >
                <TypingIndicator
                  sender={typingSender}
                  typingLabel={labels.typingLabel}
                  label={
                    typingSender === "bea"
                      ? labels.assistantName
                      : labels.userName
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isComplete && (
              <motion.div
                key="end-cta"
                exit={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                className="flex flex-col items-center text-center pt-4 md:pt-6 pb-2"
                transition={{
                  delay: 0.3,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-primaryWhite overflow-hidden flex-shrink-0">
                    <Image
                      width={80}
                      height={80}
                      alt={labels.logoAlt}
                      src="/assets/Logos/Logo.webp"
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-base font-bold tracking-wider text-primaryOrange">
                    {labels.assistantName}
                  </span>
                </div>
                <p className="text-sm md:text-base font-semibold text-darkerGray max-w-[280px] md:max-w-[340px] leading-snug mb-4">
                  {labels.endCtaQuestion}
                  <br />
                  <span className="text-primaryOrange">
                    {labels.endCtaQuestionHighlight}
                  </span>
                </p>
                <Link
                  href="/bea-ai"
                  style={STYLES.endCtaButton}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-white font-bold text-xs md:text-sm transition-all hover:scale-[1.04] hover:shadow-xl"
                >
                  <Sparkles
                    aria-hidden="true"
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                  />
                  {labels.endCtaButton}
                  <ArrowRight
                    aria-hidden="true"
                    className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          style={STYLES.dividerTop}
          className="px-4 py-3 md:px-5 md:py-3.5 flex items-center gap-1.5 md:gap-2 flex-wrap"
        >
          <span className="text-[10px] md:text-[12px] text-darkerGray/55 font-medium mr-0.5 md:mr-1">
            {labels.capabilitiesLabel}
          </span>
          <AnimatePresence mode="popLayout">
            {activeUseCase.capabilities.map((tag) => (
              <motion.span
                layout
                style={STYLES.capabilityPill}
                transition={{ duration: 0.2 }}
                key={`${activeUseCase.id}-${tag}`}
                exit={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.8 }}
                className="text-[9px] md:text-[10px] font-semibold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full"
              >
                {tag}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
