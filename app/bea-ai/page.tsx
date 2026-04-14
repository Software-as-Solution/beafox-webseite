"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import OnboardingFlow from "@/components/bea-ai/OnboardingFlow";
import LegalDisclaimer from "@/components/bea-ai/shared/LegalDisclaimer";
// IMPORTS
import {
  memo,
  useRef,
  useState,
  useEffect,
  useReducer,
  useCallback,
  type RefObject,
  type ChangeEvent,
  type KeyboardEvent,
  type ComponentProps,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
// ICONS
import {
  Send,
  Plus,
  Loader2,
  Sparkles,
  Download,
  RotateCcw,
  ArrowDown,
  ArrowRight,
  X as XIcon,
} from "lucide-react";
// LIB
import { type UserProfile, TOTAL_STEPS } from "@/lib/bea-ai/onboarding";

// BRAND CONSTANTS
const C = {
  brand: "#E87720",
  brandLight: "#F08A3C",
  brandBg: "rgba(232,119,32,0.06)",
  brandBgMed: "rgba(232,119,32,0.10)",
  brandBorder: "rgba(232,119,32,0.22)",
  brandShadow: "rgba(232,119,32,0.18)",
} as const;
const MAX_INPUT_LENGTH = 2000;
const MAX_TEXTAREA_HEIGHT = 150;
const SCROLL_THRESHOLD_NEAR_BOTTOM = 100;
const SCROLL_THRESHOLD_SHOW_BUTTON = 200;
const CHAT_API_ENDPOINT = "/api/bea-ai/chat";
const INITIAL_ONBOARDING_STATE: OnboardingState = {
  stepIdx: 0,
  total: TOTAL_STEPS,
  isComplete: false,
};

// TYPES
interface Message {
  id: string;
  model?: string;
  content: string;
  timestamp: Date;
  role: "user" | "assistant";
}
interface SSEEvent {
  text?: string;
  model?: string;
  message?: string;
  remainingMessages?: number;
  type: "meta" | "text" | "done" | "error";
}
type Phase = "welcome" | "onboarding" | "chat";
type WelcomeStep = "greeting" | "disclaimer";
interface OnboardingState {
  total: number;
  stepIdx: number;
  isComplete: boolean;
}
type ChatStatus = "idle" | "streaming" | "error" | "session_limited";
interface ChatState {
  status: ChatStatus;
  messages: Message[];
  error: string | null;
  remaining: number | null;
  lastInput: string | null;
}
type ChatAction =
  | { type: "addUserMessage"; message: Message; input: string }
  | { type: "streamStart"; assistantId: string }
  | {
      type: "streamText";
      assistantId: string;
      text: string;
      model?: string;
    }
  | { type: "streamMeta"; remaining: number }
  | { type: "streamEnd" }
  | { type: "error"; message: string }
  | { type: "sessionLimit" }
  | { type: "clearError" }
  | { type: "retryStart" }
  | { type: "reset" };

// HELPERS
/** Cheap collision-resistant ID for client-side message IDs. */
function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
/** Format a Date as HH:MM in German locale. */
function fmtTime(d: Date): string {
  return d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
/**
 * Parse a single SSE event chunk (`data: {...}`) into a typed object.
 * Returns null for malformed or empty events so the caller can skip them.
 */
function parseSSEEvent(raw: string): SSEEvent | null {
  const cleaned = raw.replace(/^data: /, "").trim();
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned) as SSEEvent;
  } catch {
    return null;
  }
}
/**
 * Returns a contextual encouragement label for the onboarding progress
 * based on how far the user has come. Designed to feel like Bea cheering
 * the user on without being patronizing.
 */
function getOnboardingEncouragement(current: number, total: number): string {
  if (current === 0) return "Lass uns starten";
  const ratio = current / total;
  if (ratio < 0.25) return "Guter Start 🧡";
  if (ratio < 0.5) return "Du bist drin";
  if (ratio < 0.6) return "Halbzeit 🎉";
  if (ratio < 0.85) return "Über die Hälfte";
  if (ratio < 1) return "Fast geschafft 🎯";
  return "Fertig!";
}

// CHAT REDUCER
const initialChatState: ChatState = {
  error: null,
  messages: [],
  status: "idle",
  remaining: null,
  lastInput: null,
};
/**
 * Centralized chat state management. All chat-related state transitions
 * go through this reducer, which makes the flow easy to reason about
 * and debug compared to scattered useState calls.
 */
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "addUserMessage":
      return {
        ...state,
        messages: [...state.messages, action.message],
        status: "streaming",
        error: null,
        lastInput: action.input,
      };

    case "streamStart":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: action.assistantId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
          },
        ],
      };

    case "streamText":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.assistantId
            ? { ...m, content: action.text, model: action.model ?? m.model }
            : m,
        ),
      };

    case "streamMeta":
      return { ...state, remaining: action.remaining };

    case "streamEnd":
      return { ...state, status: "idle" };

    case "error":
      return {
        ...state,
        status: "error",
        error: action.message,
        // Drop any empty assistant message that was created before the error
        messages: state.messages.filter(
          (m) => m.role === "user" || m.content.length > 0,
        ),
      };

    case "sessionLimit":
      return { ...state, status: "session_limited", error: null };

    case "clearError":
      return { ...state, error: null, status: "idle" };

    case "retryStart":
      return { ...state, status: "streaming", error: null };

    case "reset":
      return initialChatState;
  }
}

// SUB-COMPONENTS
const BeaAvatar = memo(function BeaAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 overflow-hidden rounded-full"
    >
      <Image
        alt="Bea"
        width={size}
        height={size}
        className="object-cover"
        src="/Maskottchen/Maskottchen-Hero.webp"
      />
    </div>
  );
});
const TypingDots = memo(function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ backgroundColor: C.brand }}
          className="block h-[7px] w-[7px] rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
});
const Bubble = memo(function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && <BeaAvatar size={34} />}
      <div className="max-w-[82%] md:max-w-[68%]">
        {!isUser && (
          <span className="mb-1 block text-[11px] font-semibold text-primaryOrange">
            Bea
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-[1.65] ${
            isUser
              ? "rounded-tr-md text-white"
              : "rounded-tl-md text-darkerGray"
          }`}
          style={
            isUser
              ? {
                  background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
                  boxShadow: `0 2px 12px ${C.brandShadow}`,
                }
              : {
                  background: C.brandBg,
                  border: `1px solid ${C.brandBorder}`,
                }
          }
        >
          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
        </div>
        <div
          className={`mt-1 flex items-center gap-2 text-[10px] text-gray-400 ${
            isUser ? "justify-end" : ""
          }`}
        >
          <span>{fmtTime(msg.timestamp)}</span>
          {msg.model && !isUser && (
            <span
              className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium"
              style={{
                background: msg.model.includes("sonnet")
                  ? "rgba(124,58,237,0.08)"
                  : C.brandBg,
                color: msg.model.includes("sonnet") ? "#7C3AED" : C.brand,
              }}
            >
              {msg.model.includes("sonnet") ? (
                <>
                  <Sparkles className="h-2.5 w-2.5" /> Sonnet
                </>
              ) : (
                "Haiku"
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

function SessionLimitScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.95 }}
      className="mx-auto my-8 flex max-w-md flex-col items-center rounded-2xl border border-primaryOrange/20 bg-gradient-to-b from-white to-orange-50/50 p-8 text-center"
    >
      <div className="relative mb-5 h-24 w-24">
        <Image
          fill
          alt="Bea mit Herzen"
          className="object-contain"
          src="/Maskottchen/Maskottchen-Herzen.webp"
        />
      </div>
      <h3 className="mb-2 text-lg font-bold text-darkerGray">
        Das war&apos;s für die Demo!
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-lightGray">
        In der BeAFox App kannst du unbegrenzt mit mir quatschen — und ich kenne
        dort deinen Fortschritt, deine Ziele und deinen Lernpfad.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="https://apps.apple.com/de/app/beafox/id6746110612"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
          }}
        >
          <Download className="h-4 w-4" />
          App laden
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-darkerGray transition-colors hover:border-primaryOrange/40 hover:text-primaryOrange"
        >
          <Plus className="h-4 w-4" />
          Neuer Chat
        </button>
      </div>
    </motion.div>
  );
}

interface ErrorBannerProps {
  error: string;
  canRetry: boolean;
  onRetry: () => void;
  onDismiss: () => void;
}

function ErrorBanner({
  error,
  canRetry,
  onRetry,
  onDismiss,
}: ErrorBannerProps) {
  return (
    <motion.div
      exit={{ opacity: 0, height: 0 }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="border-t border-red-100 bg-red-50"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
        <span className="flex-1 text-sm text-red-600">{error}</span>
        <div className="flex shrink-0 items-center gap-1">
          {canRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <RotateCcw className="h-3 w-3" />
              Erneut versuchen
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Fehler schließen"
            className="rounded-full p-1 text-red-600 transition-colors hover:bg-red-100"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Chat Empty State ──────────────────────────────────────

function ChatEmptyState() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center"
      >
        <div className="relative mb-4 h-20 w-20">
          <Image
            src="/Maskottchen/Maskottchen-Beratung.webp"
            alt="Bea bereit"
            fill
            className="object-contain"
          />
        </div>
        <p className="max-w-md text-sm text-lightGray">
          Ich kenne dich jetzt schon ein bisschen besser! Frag mich einfach
          drauflos — egal ob Sparen, Investieren, Budget oder was dich gerade
          beschäftigt.
        </p>
      </motion.div>
    </div>
  );
}

// ─── Chat Messages List ────────────────────────────────────

interface ChatMessagesProps {
  messages: Message[];
  status: ChatStatus;
  sessionLimitReached: boolean;
  onReset: () => void;
  bottomRef: RefObject<HTMLDivElement | null>;
}

function ChatMessages({
  messages,
  status,
  sessionLimitReached,
  onReset,
  bottomRef,
}: ChatMessagesProps) {
  if (messages.length === 0) {
    return <ChatEmptyState />;
  }

  // Show typing dots while streaming AND the last message is either a user
  // message or an empty assistant message (chunks haven't arrived yet)
  const lastMsg = messages[messages.length - 1];
  const showTyping =
    status === "streaming" &&
    (lastMsg.role === "user" ||
      (lastMsg.role === "assistant" && lastMsg.content === ""));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <div className="flex flex-col gap-5">
        {messages.map((m) => (
          <Bubble key={m.id} msg={m} />
        ))}

        {showTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5"
          >
            <BeaAvatar size={34} />
            <div>
              <span className="mb-1 block text-[11px] font-semibold text-primaryOrange">
                Bea
              </span>
              <div
                className="inline-flex rounded-2xl rounded-tl-md px-4 py-3"
                style={{
                  background: C.brandBg,
                  border: `1px solid ${C.brandBorder}`,
                }}
              >
                <TypingDots />
              </div>
            </div>
          </motion.div>
        )}

        {sessionLimitReached && <SessionLimitScreen onReset={onReset} />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Chat Input ────────────────────────────────────────────

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}

function ChatInput({
  value,
  onChange,
  onSend,
  isStreaming,
  inputRef,
}: ChatInputProps) {
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isStreaming;

  // Reset textarea height when value is cleared externally
  useEffect(() => {
    if (value === "" && inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }, [value, inputRef]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      if (next.length > MAX_INPUT_LENGTH) return;
      onChange(next);

      // Auto-resize
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) onSend();
      }
    },
    [canSend, onSend],
  );

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> =
    useCallback(
      (e) => {
        e.preventDefault();
        if (canSend) onSend();
      },
      [canSend, onSend],
    );

  return (
    <div className="shrink-0 border-t border-gray-100 bg-white px-4 pb-4 pt-3 md:px-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2.5"
      >
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Schreib Bea eine Nachricht…"
            disabled={isStreaming}
            rows={1}
            aria-label="Nachricht an Bea"
            className="w-full resize-none rounded-2xl border bg-gray-50/80 px-4 py-3 pr-12 text-[15px] text-darkerGray placeholder-gray-400 outline-none transition-all duration-200 disabled:opacity-50"
            style={{
              maxHeight: MAX_TEXTAREA_HEIGHT,
              borderColor: trimmed ? C.brandBorder : "rgb(229 231 235)",
            }}
          />
          {value.length > MAX_INPUT_LENGTH * 0.8 && (
            <span className="absolute bottom-2 right-14 text-[10px] text-gray-400">
              {value.length}/{MAX_INPUT_LENGTH}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Senden"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
          style={{
            background: trimmed
              ? `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`
              : "#d1d5db",
          }}
        >
          {isStreaming ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>

      <p className="mx-auto mt-2.5 max-w-3xl text-center text-[10px] text-gray-400">
        Bea ist eine KI-Companion und kann Fehler machen. Keine Finanzberatung.{" "}
        <Link
          href="/datenschutz"
          className="underline hover:text-primaryOrange"
        >
          Datenschutz
        </Link>
      </p>
    </div>
  );
}

// ─── Onboarding Progress ───────────────────────────────────

interface OnboardingProgressProps {
  current: number;
  total: number;
}

function OnboardingProgress({ current, total }: OnboardingProgressProps) {
  const percent = Math.round((current / total) * 100);
  const displayCurrent = Math.min(current + 1, total);
  const encouragement = getOnboardingEncouragement(current, total);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full md:h-9 md:w-9"
            style={{ background: C.brandBg }}
          >
            <Image
              src="/Maskottchen/Maskottchen-Right.png"
              alt="Bea"
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] font-bold uppercase tracking-wider text-primaryOrange md:text-[10px]">
              Dein Weg mit Bea
            </span>
            <span className="text-xs font-bold text-darkerGray md:text-sm">
              Frage {displayCurrent} von {total}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-semibold text-darkerGray/60 sm:inline md:text-sm">
            {encouragement}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold text-primaryOrange md:text-xs"
            style={{ background: C.brandBgMed }}
          >
            {percent}%
          </span>
        </div>
      </div>

      <div
        className="relative h-2 w-full overflow-hidden rounded-full"
        style={{ background: C.brandBg }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
            boxShadow: `0 0 12px ${C.brandShadow}`,
          }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Welcome Greeting ──────────────────────────────────────

interface WelcomeGreetingProps {
  onContinue: () => void;
}

function WelcomeGreeting({ onContinue }: WelcomeGreetingProps) {
  return (
    <motion.div
      key="greeting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30, transition: { duration: 0.35 } }}
      className="relative flex max-w-md flex-col items-center text-center"
    >
      {/* Mascot + Speech Bubble */}
      <div className="relative mb-6 flex h-[260px] w-full items-end justify-center md:h-[300px]">
        {/* Halo behind mascot */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-2xl md:h-64 md:w-64"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,32,0.28) 0%, transparent 65%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Mascot — gentle bob */}
        <motion.div
          className="relative h-48 w-48 md:h-56 md:w-56"
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1,
          }}
        >
          <motion.div
            className="h-full w-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/Maskottchen/Maskottchen-Hero.webp"
              alt="Bea"
              fill
              priority
              className="scale-110 object-contain drop-shadow-[0_20px_40px_rgba(232,119,32,0.3)]"
            />
          </motion.div>
        </motion.div>

        {/* Speech Bubble — SVG matching landing hero */}
        <motion.div
          className="absolute left-1/2 top-[-20px] z-20 -translate-x-[55%]"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[3rem] blur-3xl"
            style={{ background: "rgba(232,119,32,0.1)" }}
          />
          <div className="relative h-[100px] w-[250px] md:h-[118px] md:w-[290px]">
            <svg
              fill="none"
              width="100%"
              height="100%"
              viewBox="0 0 310 118"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
              style={{
                filter:
                  "drop-shadow(0 12px 32px rgba(232,119,32,0.15)) drop-shadow(0 2px 6px rgba(0,0,0,0.05))",
              }}
            >
              <defs>
                <linearGradient
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                  id="beaWelcomeBubble"
                >
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFF8F0" />
                </linearGradient>
              </defs>
              <path
                d="M 44 1 L 266 1 Q 309 1 309 44 Q 309 87 266 87 L 130 87 Q 118 102 78 116 Q 100 100 92 87 L 44 87 Q 1 87 1 44 Q 1 1 44 1 Z"
                fill="url(#beaWelcomeBubble)"
                stroke="rgba(232,119,32,0.3)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute left-0 right-0 top-0 flex h-[74px] items-center gap-3 px-4 md:h-[88px] md:gap-4 md:px-5">
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden md:h-12 md:w-12">
                <Image
                  src="/assets/Logos/Logo.webp"
                  alt="Bea Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
                />
              </div>
              <div className="flex flex-col items-start text-left leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primaryOrange">
                  Bea
                </span>
                <span className="whitespace-nowrap text-base font-bold text-darkerGray md:text-lg">
                  Hey, ich bin Bea
                  <span aria-hidden="true" className="ml-1">
                    👋
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subline */}
      <motion.p
        className="mb-6 mt-2 text-xl font-medium text-darkerGray"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        Deine beste Freundin{" "}
        <span className="text-primaryOrange">für Finanzen.</span>
      </motion.p>

      {/* CTA */}
      <motion.button
        type="button"
        onClick={onContinue}
        className="group relative inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:scale-[1.04]"
        style={{
          background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
          boxShadow: `0 10px 30px ${C.brandShadow}`,
        }}
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${C.brand}` }}
          animate={{ scale: [1, 1.15, 1.15], opacity: [0.6, 0, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 2,
          }}
        />
        <Sparkles className="h-5 w-5" />
        Jetzt loslegen
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  );
}

// ─── Welcome Disclaimer ────────────────────────────────────

interface WelcomeDisclaimerProps {
  onContinue: () => void;
  onBack: () => void;
}

function WelcomeDisclaimer({ onContinue, onBack }: WelcomeDisclaimerProps) {
  return (
    <motion.div
      key="disclaimer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex max-w-md flex-col items-center text-center"
    >
      <motion.div
        className="relative z-10 mb-[-40px] h-28 w-28"
        initial={{ y: -20, opacity: 0, rotate: -8 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 180,
          damping: 14,
        }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/Maskottchen/Maskottchen-Herzen.webp"
            alt="Bea mit Herzen"
            fill
            className="scale-125 object-contain drop-shadow-[0_12px_24px_rgba(232,119,32,0.25)]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative w-full rounded-3xl p-8 pt-12"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
          border: `1.5px solid ${C.brandBorder}`,
          boxShadow: `0 24px 64px rgba(232,119,32,0.12), 0 0 0 1px ${C.brandBg}`,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <motion.div
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            background: C.brandBgMed,
            border: `1px solid ${C.brandBorder}`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <span className="text-base font-black uppercase tracking-widest text-primaryOrange">
            Beta
          </span>
        </motion.div>

        <motion.h3
          className="mb-4 text-xl font-bold text-darkerGray md:text-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          Kurz, bevor wir loslegen
        </motion.h3>

        <motion.p
          className="mb-7 text-sm leading-relaxed text-lightGray md:text-[15px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          Ich bin noch in meiner{" "}
          <span className="font-bold text-primaryOrange">Beta-Phase</span> und
          lerne jeden Tag dazu! Wenn ich mal einen Fehler mache, dann sag mir
          Bescheid. Ich freu mich über jeden Hinweis, um besser zu werden
        </motion.p>

        <motion.div
          className="mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <LegalDisclaimer variant="compact" />
        </motion.div>

        <motion.button
          type="button"
          onClick={onContinue}
          className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] md:text-base"
          style={{
            background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
            boxShadow: `0 8px 24px ${C.brandShadow}`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          Alles klar, lass uns starten
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
        </motion.button>

        <motion.button
          type="button"
          onClick={onBack}
          className="mt-4 text-xs font-medium text-gray-400 transition-colors hover:text-primaryOrange"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          ← Zurück
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Welcome Decor (ambient sparkles) ──────────────────────

function WelcomeDecor() {
  const sparkles = [
    { top: "15%", left: "10%", delay: 0 },
    { top: "25%", right: "12%", delay: 0.8 },
    { bottom: "20%", left: "15%", delay: 1.4 },
    { bottom: "28%", right: "18%", delay: 0.4 },
    { top: "45%", left: "8%", delay: 1.8 },
    { top: "55%", right: "6%", delay: 1.1 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,119,32,0.08) 0%, rgba(232,119,32,0.02) 40%, transparent 70%)",
        }}
      />
      {sparkles.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={pos}
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-4 w-4 text-primaryOrange/40" />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

/**
 * BEA AI PAGE
 *
 * Three-phase orchestrator: welcome → onboarding → chat.
 *
 * Architecture notes:
 * - Chat state lives in a useReducer for predictable transitions.
 * - SSE streams are aborted via AbortController on unmount, reset, or
 *   a new send (cancels the previous in-flight request).
 * - `stateRef` keeps `sendMessage` decoupled from `messages` so it stays
 *   stable across renders.
 * - Sub-components (Bubble, BeaAvatar, TypingDots) are memoized so the
 *   message list doesn't re-render every chunk during streaming.
 */
export default function BeaAIPage() {
  // ─── Phase state ─────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("welcome");
  const [welcomeStep, setWelcomeStep] = useState<WelcomeStep>("greeting");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(
    INITIAL_ONBOARDING_STATE,
  );

  // ─── Chat state ──────────────────────────────────────────
  const [chatState, dispatch] = useReducer(chatReducer, initialChatState);
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  // ─── Refs ────────────────────────────────────────────────
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onboardingScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isNearBottomRef = useRef(true);
  // Mirror of chatState so sendMessage doesn't need to depend on it
  const stateRef = useRef(chatState);
  stateRef.current = chatState;

  // ─── Lifecycle: cleanup any in-flight stream on unmount ──
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // ─── Onboarding handlers ─────────────────────────────────
  const handleOnboardingFinish = useCallback((p: UserProfile) => {
    setProfile(p);
    setPhase("chat");
    // Defer focus to next tick so the textarea exists in the DOM
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleOnboardingStateChange = useCallback((state: OnboardingState) => {
    setOnboardingState(state);
  }, []);

  // ─── Scroll handling ─────────────────────────────────────
  const scrollDown = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Track scroll position to decide auto-scroll behavior + button visibility
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      isNearBottomRef.current =
        distanceFromBottom < SCROLL_THRESHOLD_NEAR_BOTTOM;
      setShowScrollButton(distanceFromBottom > SCROLL_THRESHOLD_SHOW_BUTTON);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [phase]);

  // Auto-scroll only when user is already near the bottom
  useEffect(() => {
    if (chatState.messages.length && isNearBottomRef.current) {
      scrollDown();
    }
  }, [chatState.messages, scrollDown]);

  // When onboarding moves to the next step, reset scroll to top.
  useEffect(() => {
    if (phase !== "onboarding") return;
    onboardingScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase, onboardingState.stepIdx]);

  // ─── Send message (with retry support) ──────────────────
  const sendMessage = useCallback(
    async (text: string, options?: { isRetry?: boolean }) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (stateRef.current.status === "streaming") return;

      // Build the conversation history depending on whether this is a retry
      let history: Message[];
      if (options?.isRetry) {
        // The failed user message is still at the end of the messages array
        history = stateRef.current.messages;
        dispatch({ type: "retryStart" });
      } else {
        const userMsg: Message = {
          id: uid(),
          role: "user",
          content: trimmed,
          timestamp: new Date(),
        };
        dispatch({ type: "addUserMessage", message: userMsg, input: trimmed });
        history = [...stateRef.current.messages, userMsg];
      }

      setInput("");

      // Cancel any previous in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const assistantId = uid();
      let beaText = "";
      let beaModel = "";

      try {
        const res = await fetch(CHAT_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            ...(profile ? { profile } : {}),
          }),
          signal: controller.signal,
        });

        // JSON response means an error or quota event, not a stream
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const json = await res.json();
          if (json.error === "session_limit") {
            dispatch({ type: "sessionLimit" });
            return;
          }
          if (json.error === "rate_limit") {
            throw new Error(json.message ?? "Rate limit erreicht.");
          }
          if (!res.ok) {
            throw new Error(json.message ?? "Bea ist gerade nicht erreichbar.");
          }
        }

        if (!res.ok) throw new Error("Bea ist gerade nicht erreichbar.");
        if (!res.body) throw new Error("Streaming nicht verfügbar.");

        // Start the assistant's empty bubble — chunks fill it in
        dispatch({ type: "streamStart", assistantId });

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const parsed = parseSSEEvent(event);
            if (!parsed) continue;

            if (parsed.type === "meta") {
              beaModel = parsed.model ?? "";
              if (parsed.remainingMessages !== undefined) {
                dispatch({
                  type: "streamMeta",
                  remaining: parsed.remainingMessages,
                });
              }
            } else if (parsed.type === "text" && parsed.text) {
              beaText += parsed.text;
              dispatch({
                type: "streamText",
                assistantId,
                text: beaText,
                model: beaModel,
              });
            } else if (parsed.type === "error") {
              throw new Error(parsed.message ?? "Stream-Fehler.");
            }
          }
        }

        dispatch({ type: "streamEnd" });
      } catch (err) {
        // Aborted requests are silent — they're either user-initiated
        // (reset, new send) or component unmount
        if (err instanceof Error && err.name === "AbortError") return;

        const message =
          err instanceof Error ? err.message : "Etwas ist schiefgelaufen.";
        dispatch({ type: "error", message });
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
        inputRef.current?.focus();
      }
    },
    [profile],
  );

  // ─── Handlers ────────────────────────────────────────────
  const handleSendCurrentInput = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleRetry = useCallback(() => {
    const last = stateRef.current.lastInput;
    if (last) sendMessage(last, { isRetry: true });
  }, [sendMessage]);

  const handleDismissError = useCallback(() => {
    dispatch({ type: "clearError" });
  }, []);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: "reset" });
    setInput("");
    setPhase("welcome");
    setWelcomeStep("greeting");
    setProfile(null);
    setOnboardingState(INITIAL_ONBOARDING_STATE);
  }, []);

  const handleWelcomeContinue = useCallback(() => {
    setWelcomeStep("disclaimer");
  }, []);

  const handleWelcomeBack = useCallback(() => {
    setWelcomeStep("greeting");
  }, []);

  const handleStartOnboarding = useCallback(() => {
    setPhase("onboarding");
  }, []);

  // ─── Derived values ──────────────────────────────────────
  const isStreaming = chatState.status === "streaming";
  const showError = chatState.status === "error" && chatState.error !== null;
  const sessionLimitReached = chatState.status === "session_limited";

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="mt-[72px] flex h-[calc(100dvh-72px)] min-h-0 flex-col overflow-hidden bg-white md:mt-20 md:h-[calc(100dvh-80px)]">
      {/* ── PHASE: Welcome ─────────────────────────────── */}
      {phase === "welcome" && (
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4">
          <WelcomeDecor />
          <AnimatePresence mode="wait">
            {welcomeStep === "greeting" ? (
              <WelcomeGreeting onContinue={handleWelcomeContinue} />
            ) : (
              <WelcomeDisclaimer
                onContinue={handleStartOnboarding}
                onBack={handleWelcomeBack}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── PHASE: Onboarding ──────────────────────────── */}
      {phase === "onboarding" && (
        <div
          ref={onboardingScrollRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
        >
          {!onboardingState.isComplete && (
            <div className="border-b border-primaryOrange/10 bg-white px-4 pt-6 md:px-6 sm:pt-14">
              <div className="mx-auto w-full max-w-6xl">
                <OnboardingProgress
                  current={onboardingState.stepIdx}
                  total={onboardingState.total}
                />
              </div>
            </div>
          )}
          <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center py-6 sm:px-2">
            <OnboardingFlow
              onFinish={handleOnboardingFinish}
              onStateChange={handleOnboardingStateChange}
            />
          </div>
        </div>
      )}

      {/* ── PHASE: Chat ────────────────────────────────── */}
      {phase === "chat" && (
        <>
          <div
            ref={scrollRef}
            className="relative flex min-h-0 flex-1 flex-col overflow-y-auto"
          >
            <ChatMessages
              messages={chatState.messages}
              status={chatState.status}
              sessionLimitReached={sessionLimitReached}
              onReset={handleReset}
              bottomRef={bottomRef}
            />

            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  type="button"
                  onClick={scrollDown}
                  aria-label="Nach unten scrollen"
                  className="fixed bottom-32 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-lg transition-colors hover:border-primaryOrange/40"
                >
                  <ArrowDown className="h-4 w-4 text-darkerGray" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showError && chatState.error && (
              <ErrorBanner
                error={chatState.error}
                canRetry={chatState.lastInput !== null}
                onRetry={handleRetry}
                onDismiss={handleDismissError}
              />
            )}
          </AnimatePresence>

          {!sessionLimitReached && (
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSendCurrentInput}
              isStreaming={isStreaming}
              inputRef={inputRef}
            />
          )}
        </>
      )}
    </div>
  );
}
