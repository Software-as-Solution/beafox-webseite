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
  useMemo,
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
  ArrowLeft,
  ArrowRight,
  X as XIcon,
} from "lucide-react";
// LIB
import {
  type UserProfile,
  TOTAL_STEPS,
  buildProfileContext,
  generateInsights,
  FINANCIAL_TYPES,
} from "@/lib/bea-ai/onboarding";
import type { OnboardingInsights } from "@/lib/bea-ai/onboarding";
// ANALYTICS
import {
  trackChatSessionStarted,
  trackChatMessageSent,
  trackChatResponseReceived,
  trackChatError,
  trackChatSessionEnded,
  trackInsightsGenerated,
  uuid,
} from "@/lib/analytics";

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
type ChatStatus =
  | "idle"
  | "streaming"
  | "error"
  | "session_limited"
  | "greeting"; // Bea ist gerade dabei, die Begrüßung zu tippen
interface ChatState {
  status: ChatStatus;
  messages: Message[];
  error: string | null;
  remaining: number | null;
  lastInput: string | null;
  /** Quick-Reply-Chips unter der letzten Bea-Nachricht. Leer = keine anzeigen. */
  quickReplies: QuickReply[];
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
  | { type: "reset" }
  | { type: "greetingStart" }
  | { type: "greetingMessage"; message: Message }
  | { type: "greetingDone"; quickReplies: QuickReply[] };

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

// ─── GREETING BUILDER ─────────────────────────────────────
// Bea-als-beste-Freundin-Willkommen: personalisiert nach Fuchs-Typ,
// Zielbild und Prioritäten. Wird als Serie von 2-3 Messages injiziert,
// wie eine echte Freundin es schreiben würde.

interface QuickReply {
  id: string;
  label: string;
  prompt: string; // Text der an Bea gesendet wird
  emoji?: string;
}

/** Messages die Bea proaktiv schreibt, mit verzögertem Timing. */
interface GreetingMessage {
  content: string;
  /** Verzögerung ab dem vorherigen Greeting-Step, in ms */
  delayMs: number;
}

interface Greeting {
  messages: GreetingMessage[];
  quickReplies: QuickReply[];
}

function buildGreeting(
  profile: UserProfile,
  insights: OnboardingInsights,
): Greeting {
  const foxLabel = insights.financialType.label;
  const foxTagline = insights.financialType.tagline;
  const zielbild = profile.zielbild?.trim();
  const topPriority = profile.prioritaeten?.[0];

  // Erste Nachricht: warmer Empfang
  const line1: GreetingMessage = {
    content: "Heeey 🧡 schön, dass du da bist.",
    delayMs: 400,
  };

  // Zweite Nachricht: Fuchs-Typ-Anerkennung
  const line2: GreetingMessage = {
    content: `Ich hab mir alles in Ruhe angeschaut — und ich muss sagen: du bist ${foxLabel.toLowerCase().replace("der ", "ein ")}. ${foxTagline}.`,
    delayMs: 1600,
  };

  // Dritte Nachricht: Zielbild-Pickup oder Priorität-Pickup oder offen
  let line3: GreetingMessage;
  if (zielbild && zielbild.length > 10) {
    line3 = {
      content: `Und dein Ziel — „${zielbild}" — das ist was, wo ich dir wirklich helfen möchte. Womit wollen wir anfangen?`,
      delayMs: 1800,
    };
  } else if (topPriority) {
    line3 = {
      content:
        "Du hast mir schon gesagt, was dir wichtig ist. Wir müssen also nicht bei Null anfangen — wo willst du einsteigen?",
      delayMs: 1800,
    };
  } else {
    line3 = {
      content:
        "Keine Sorge, wir müssen jetzt nicht direkt deep gehen. Du kannst mich alles fragen — oder wir quatschen einfach. Was sagst du?",
      delayMs: 1800,
    };
  }

  // Quick-Replies: kontext-spezifisch
  const quickReplies: QuickReply[] = [];

  // 1. Fuchs-Typ-Deep-Dive — immer vorhanden
  quickReplies.push({
    id: "explain_fox",
    label: "Was heißt das genau?",
    prompt: `Kannst du mir nochmal genauer erklären, warum ich ${foxLabel} bin und was das für mich heißt?`,
    emoji: insights.financialType.icon,
  });

  // 2. Priorität-spezifischer Einstieg, falls vorhanden
  if (topPriority) {
    const priorityPrompts: Record<
      string,
      { label: string; prompt: string; emoji: string }
    > = {
      prio_overview: {
        label: "Überblick bekommen",
        prompt:
          "Lass uns mit einem Überblick starten — wie fang ich an, meine Finanzen zu ordnen?",
        emoji: "📊",
      },
      prio_saving: {
        label: "Sparen lernen",
        prompt: "Ich will sparen lernen. Wie fang ich konkret an?",
        emoji: "💰",
      },
      prio_goal: {
        label: "Auf mein Ziel sparen",
        prompt: "Ich möchte auf mein Ziel hin sparen. Wie planen wir das?",
        emoji: "🎯",
      },
      prio_debt: {
        label: "Schulden loswerden",
        prompt: "Ich möchte meine Schulden loswerden. Wo fangen wir an?",
        emoji: "🔓",
      },
      prio_invest: {
        label: "Investieren starten",
        prompt: "Ich will anfangen zu investieren. Wo starte ich?",
        emoji: "📈",
      },
      prio_retirement: {
        label: "Altersvorsorge",
        prompt: "Wie gehe ich das Thema Altersvorsorge an?",
        emoji: "🌳",
      },
      prio_emergency: {
        label: "Notgroschen aufbauen",
        prompt: "Wie baue ich einen Notgroschen auf?",
        emoji: "🛡️",
      },
      prio_budget: {
        label: "Budget planen",
        prompt: "Wie erstelle ich ein Budget, das ich auch durchziehe?",
        emoji: "📝",
      },
    };
    const pri = priorityPrompts[topPriority];
    if (pri) {
      quickReplies.push({
        id: "top_priority",
        label: pri.label,
        prompt: pri.prompt,
        emoji: pri.emoji,
      });
    }
  }

  // 3. Offener Talk — für User die erstmal quatschen wollen
  quickReplies.push({
    id: "casual",
    label: "Einfach quatschen",
    prompt: "Lass uns einfach mal quatschen — erzähl mir was über dich.",
    emoji: "💬",
  });

  // 4. Zielbild-spezifisch, wenn vorhanden
  if (zielbild && zielbild.length > 10) {
    quickReplies.push({
      id: "goal_deep_dive",
      label: "Zu meinem Ziel",
      prompt: `Lass uns über mein Ziel sprechen: „${zielbild}". Wie realistisch ist das und was brauche ich dafür?`,
      emoji: "✨",
    });
  }

  return {
    messages: [line1, line2, line3],
    quickReplies,
  };
}

// CHAT REDUCER
const initialChatState: ChatState = {
  error: null,
  messages: [],
  status: "idle",
  remaining: null,
  lastInput: null,
  quickReplies: [],
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
        // Quick-Replies wegwerfen, sobald der User etwas eingegeben hat
        quickReplies: [],
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

    case "greetingStart":
      return { ...state, status: "greeting", messages: [], quickReplies: [] };

    case "greetingMessage":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case "greetingDone":
      return {
        ...state,
        status: "idle",
        quickReplies: action.quickReplies,
      };
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
// ─── Bubble (mit Cluster-Awareness) ────────────────────────
// Aufeinanderfolgende Nachrichten der gleichen Person werden visuell
// gruppiert — wie bei iMessage/WhatsApp. Avatar + Name erscheinen nur
// bei der ERSTEN Nachricht eines Clusters, nicht bei jeder.

interface BubbleProps {
  msg: Message;
  /** Ist das die erste Nachricht eines neuen Sprechers (Cluster-Start)? */
  isClusterStart: boolean;
  /** Ist das die letzte Nachricht eines Sprechers (Cluster-Ende)? */
  isClusterEnd: boolean;
}

const Bubble = memo(function Bubble({
  msg,
  isClusterStart,
  isClusterEnd,
}: BubbleProps) {
  const isUser = msg.role === "user";

  // Bubble-Corner-Shape: nach iMessage-Stil
  const cornerClasses = isUser
    ? isClusterEnd
      ? "rounded-2xl rounded-tr-md rounded-br-md"
      : "rounded-2xl rounded-br-md"
    : isClusterEnd
      ? "rounded-2xl rounded-tl-md rounded-bl-md"
      : "rounded-2xl rounded-bl-md";

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2.5 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } ${isClusterStart ? "mt-3" : "mt-1"}`}
    >
      {!isUser && (
        <div className="h-8 w-8 shrink-0">
          {isClusterStart && <BeaAvatar size={32} />}
        </div>
      )}
      <div className="max-w-[85%] md:max-w-[68%]">
        {!isUser && isClusterStart && (
          <span className="mb-1 block text-[11px] font-bold tracking-wide text-primaryOrange">
            Bea
          </span>
        )}
        <div
          className={`px-4 py-2.5 text-[14.5px] leading-[1.55] md:px-5 md:py-3 md:text-[15px] md:leading-[1.65] ${cornerClasses} ${
            isUser ? "text-white" : "text-darkerGray"
          }`}
          style={
            isUser
              ? {
                  background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
                  boxShadow: `0 4px 16px ${C.brandShadow}, 0 1px 2px rgba(232,119,32,0.25)`,
                }
              : {
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
                  border: "1px solid rgba(232,119,32,0.18)",
                  boxShadow: "0 2px 12px rgba(232,119,32,0.06)",
                }
          }
        >
          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
        </div>
        {/* Timestamp nur am Cluster-Ende — wie bei iMessage */}
        {isClusterEnd && (
          <div
            className={`mt-1 flex items-center gap-2 px-1 text-[10px] text-gray-400 ${
              isUser ? "justify-end" : ""
            }`}
          >
            <span>{fmtTime(msg.timestamp)}</span>
            {isUser && (
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-label="Gelesen"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
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
        )}
      </div>
    </motion.div>
  );
});

function SessionLimitScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.95 }}
      className="mx-auto my-6 flex max-w-md flex-col items-center rounded-2xl border border-primaryOrange/20 bg-gradient-to-b from-white to-orange-50/50 p-6 text-center sm:my-8 sm:p-8"
    >
      <div className="relative mb-4 h-20 w-20 sm:mb-5 sm:h-24 sm:w-24">
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

// ─── Quick-Reply-Chips ─────────────────────────────────────
// Kontextuelle Vorschläge unter Bea's letzter Nachricht.
// Ein Klick schickt die Nachricht als User-Input an Bea.

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (prompt: string) => void;
}

function QuickRepliesRow({ replies, onSelect }: QuickRepliesProps) {
  if (replies.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-wrap gap-2 pl-[42px]"
    >
      {replies.map((r, idx) => (
        <motion.button
          key={r.id}
          type="button"
          onClick={() => onSelect(r.prompt)}
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.3 + idx * 0.06,
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -2 }}
          className="group inline-flex items-center gap-1.5 rounded-full border border-primaryOrange/30 bg-white px-3 py-1.5 text-xs font-semibold text-darkerGray transition-colors hover:border-primaryOrange hover:bg-primaryOrange/5 hover:text-primaryOrange md:text-[13px]"
          style={{ boxShadow: "0 2px 8px rgba(232,119,32,0.08)" }}
        >
          {r.emoji && <span className="text-sm">{r.emoji}</span>}
          <span>{r.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ─── Chat Header (Bea-Presence oben) ───────────────────────
// Ähnlich wie die Kopfzeile in iMessage/WhatsApp: Avatar + Name + Online-
// Status. Macht klar: Du chattest mit einer Person (Bea), nicht mit
// einer Settings-Oberfläche.

function ChatHeader({ onReset }: { onReset: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-primaryOrange/10 bg-white/85 px-4 pb-3 pl-[4.25rem] pt-3 backdrop-blur-md sm:pl-40 md:px-6 md:pl-48">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primaryOrange/10 md:h-10 md:w-10">
          <Image
            src="/Maskottchen/Maskottchen-Hero.webp"
            alt="Bea"
            fill
            sizes="40px"
            className="object-contain"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          </span>
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-black text-darkerGray md:text-[15px]">
            Bea
          </div>
          <div className="truncate text-[11px] text-green-600 md:text-xs">
            Gerade online
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-darkerGray transition-colors hover:border-primaryOrange/40 hover:text-primaryOrange md:text-xs"
        aria-label="Neuer Chat"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Neuer Chat</span>
      </button>
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
  quickReplies: QuickReply[];
  onQuickReply: (prompt: string) => void;
}

function ChatMessages({
  messages,
  status,
  sessionLimitReached,
  onReset,
  bottomRef,
  quickReplies,
  onQuickReply,
}: ChatMessagesProps) {
  // Cluster-Info pro Message: ist das der erste/letzte Eintrag eines
  // Sprechers in einer Reihe aufeinanderfolgender Nachrichten?
  const clusterInfo = useMemo(() => {
    return messages.map((m, i) => {
      const prev = messages[i - 1];
      const next = messages[i + 1];
      const isClusterStart = !prev || prev.role !== m.role;
      const isClusterEnd = !next || next.role !== m.role;
      return { isClusterStart, isClusterEnd };
    });
  }, [messages]);

  // Typing-Indicator: während Streaming oder Greeting
  const lastMsg = messages[messages.length - 1];
  const showStreamingTyping =
    status === "streaming" &&
    (!lastMsg ||
      lastMsg.role === "user" ||
      (lastMsg.role === "assistant" && lastMsg.content === ""));
  const showGreetingTyping = status === "greeting";
  const showTyping = showStreamingTyping || showGreetingTyping;

  // Quick-Replies nur zeigen, wenn status idle + letzte Nachricht von Bea
  const showQuickReplies =
    status === "idle" &&
    quickReplies.length > 0 &&
    lastMsg?.role === "assistant";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-4 pt-4 md:px-6 md:pt-6">
      <div className="flex flex-col">
        {messages.map((m, i) => (
          <Bubble
            key={m.id}
            msg={m}
            isClusterStart={clusterInfo[i].isClusterStart}
            isClusterEnd={clusterInfo[i].isClusterEnd}
          />
        ))}

        {showTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-3 flex items-start gap-2.5`}
          >
            {/* Avatar-Platzhalter wenn vorheriges auch Bea war → leer */}
            <div className="h-8 w-8 shrink-0">
              {(!lastMsg || lastMsg.role !== "assistant") && (
                <BeaAvatar size={32} />
              )}
            </div>
            <div
              className="inline-flex items-center rounded-2xl rounded-bl-md px-4 py-3"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
                border: "1px solid rgba(232,119,32,0.18)",
                boxShadow: "0 2px 12px rgba(232,119,32,0.06)",
              }}
            >
              <TypingDots />
            </div>
          </motion.div>
        )}

        {showQuickReplies && (
          <div className="mt-3">
            <QuickRepliesRow replies={quickReplies} onSelect={onQuickReply} />
          </div>
        )}

        {sessionLimitReached && <SessionLimitScreen onReset={onReset} />}

        <div ref={bottomRef} className="h-4" />
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
    <div
      className="shrink-0 border-t border-primaryOrange/10 bg-white/95 px-3 pb-3 pt-2.5 backdrop-blur md:px-6 md:pb-4 md:pt-3"
      style={{ boxShadow: "0 -8px 20px rgba(232,119,32,0.04)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2 md:gap-2.5"
      >
        <div
          className="relative flex-1 rounded-[22px] transition-all duration-200"
          style={{
            background: "#FFFFFF",
            border: `1.5px solid ${trimmed ? C.brandBorder : "rgba(232,119,32,0.15)"}`,
            boxShadow: trimmed
              ? "0 4px 16px rgba(232,119,32,0.12)"
              : "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <textarea
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Schreib Bea eine Nachricht…"
            disabled={isStreaming}
            rows={1}
            aria-label="Nachricht an Bea"
            className="w-full resize-none rounded-[22px] bg-transparent px-4 py-3 pr-12 text-[15px] text-darkerGray placeholder-gray-400 outline-none transition-all duration-200 disabled:opacity-50"
            style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
          />
          {value.length > MAX_INPUT_LENGTH * 0.8 && (
            <span className="absolute bottom-2 right-4 text-[10px] text-gray-400">
              {value.length}/{MAX_INPUT_LENGTH}
            </span>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={!canSend}
          aria-label="Senden"
          whileTap={canSend ? { scale: 0.93 } : {}}
          whileHover={canSend ? { scale: 1.05 } : {}}
          className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
          style={{
            background: trimmed
              ? `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`
              : "#e5e7eb",
            boxShadow: trimmed
              ? "0 6px 16px rgba(232,119,32,0.35)"
              : "0 2px 6px rgba(0,0,0,0.06)",
          }}
        >
          {isStreaming ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </motion.button>
      </form>

      <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-gray-400 md:mt-2.5">
        Bea ist deine Lernbegleiterin, keine Anlageberaterin.{" "}
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
          <div className="relative h-8 w-8 shrink-0 overflow-hidden md:h-9 md:w-9">
            <Image
              src="/assets/Logos/Logo.webp"
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
      className="relative flex max-w-md flex-col items-center px-4 text-center sm:px-0"
    >
      {/* Mascot + Speech Bubble */}
      <div className="relative mb-4 flex h-[220px] w-full items-end justify-center sm:mb-6 sm:h-[260px] md:h-[300px]">
        {/* Halo behind mascot */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-2xl sm:h-56 sm:w-56 md:h-64 md:w-64"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,32,0.28) 0%, transparent 65%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Mascot — gentle bob */}
        <motion.div
          className="relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56"
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
          className="absolute left-[32.5%] sm:left-1/2 top-[-40px] sm:top-[-20px] z-20 -translate-x-[55%]"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[3rem] blur-3xl"
            style={{ background: "rgba(232,119,32,0.1)" }}
          />
          <div className="relative h-[88px] w-[220px] sm:h-[100px] sm:w-[250px] md:h-[118px] md:w-[290px]">
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
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden md:h-12 md:w-12">
                <Image
                  src="/assets/Logos/Logo.webp"
                  alt="Bea Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white bg-green-500"
                />
              </div>
              <div className="flex flex-col items-start text-left leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primaryOrange">
                  Bea
                </span>
                <span className="whitespace-nowrap text-sm sm:text-base font-bold text-darkerGray md:text-lg">
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
        className="mb-5 mt-2 text-lg font-medium leading-snug text-darkerGray sm:mb-6 sm:text-xl"
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
        className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.04] sm:gap-2.5 sm:px-8 sm:py-4 sm:text-base"
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
      className="relative flex max-w-md flex-col items-center px-4 text-center sm:px-0"
    >
      <motion.div
        className="relative z-10 mb-[-36px] h-24 w-24 sm:mb-[-40px] sm:h-28 sm:w-28"
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
        className="relative w-full rounded-3xl p-6 pt-10 sm:p-8 sm:pt-12"
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

// ─── Back-to-Site Button ──────────────────────────────────
// Dezenter Pfeil oben links, der zur Hauptseite zurückführt.
// Immer sichtbar (alle Phasen), mobile-first Tap-Target (≥44px).

function BackToSiteButton() {
  return (
    <Link
      href="/"
      aria-label="Zurück zur BeAFox-Startseite"
      title="Zur Startseite"
      className="mt-2 group absolute left-3 top-3 z-30 inline-flex h-8 w-8 items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white/85 text-darkerGray shadow-sm backdrop-blur transition-all duration-200 hover:border-primaryOrange/40 hover:bg-white hover:text-primaryOrange sm:h-11 sm:w-auto sm:pl-3 sm:pr-4 sm:text-sm sm:font-semibold md:left-5 md:top-5"
    >
      <ArrowLeft
        className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-x-0.5"
        strokeWidth={2.4}
      />
      <span className="hidden sm:inline">Zur Startseite</span>
    </Link>
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
  // ANALYTICS — conversation tracking
  const conversationIdRef = useRef<string>("");
  const conversationStartRef = useRef<number>(0);
  const conversationMessageCountRef = useRef<number>(0);
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
    // ANALYTICS — frische Chat-Session + Insights
    const newConvId = uuid();
    conversationIdRef.current = newConvId;
    conversationStartRef.current = Date.now();
    conversationMessageCountRef.current = 0;
    try {
      const insights = generateInsights(p);
      trackInsightsGenerated(insights);
      const systemPrompt = buildProfileContext(p);
      trackChatSessionStarted({
        conversation_id: newConvId,
        system_prompt: systemPrompt,
        profile: p,
      });

      // ─── Bea-Begrüßung starten (sequentielle Nachrichten) ──
      const greeting = buildGreeting(p, insights);
      dispatch({ type: "greetingStart" });
      let cumulative = 0;
      greeting.messages.forEach((gm) => {
        cumulative += gm.delayMs;
        setTimeout(() => {
          dispatch({
            type: "greetingMessage",
            message: {
              id: uid(),
              role: "assistant",
              content: gm.content,
              timestamp: new Date(),
            },
          });
        }, cumulative);
      });
      // Nachdem die letzte Nachricht sichtbar ist → Quick-Replies zeigen
      setTimeout(
        () =>
          dispatch({
            type: "greetingDone",
            quickReplies: greeting.quickReplies,
          }),
        cumulative + 300,
      );
    } catch (err) {
      // Tracking darf nie den UX-Flow brechen
      console.warn("[Analytics] Failed to track chat session start", err);
    }
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
      let userMsgId = "";
      if (options?.isRetry) {
        // The failed user message is still at the end of the messages array
        history = stateRef.current.messages;
        userMsgId = history[history.length - 1]?.id ?? "";
        dispatch({ type: "retryStart" });
      } else {
        const userMsg: Message = {
          id: uid(),
          role: "user",
          content: trimmed,
          timestamp: new Date(),
        };
        userMsgId = userMsg.id;
        dispatch({ type: "addUserMessage", message: userMsg, input: trimmed });
        history = [...stateRef.current.messages, userMsg];
        // ANALYTICS — User-Message gesendet
        conversationMessageCountRef.current += 1;
        if (conversationIdRef.current) {
          trackChatMessageSent({
            conversation_id: conversationIdRef.current,
            message_id: userMsg.id,
            content: trimmed,
          });
        }
      }

      const requestStartMs = Date.now();
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
        // ANALYTICS — Bea-Antwort komplett angekommen
        if (conversationIdRef.current && beaText) {
          conversationMessageCountRef.current += 1;
          trackChatResponseReceived({
            conversation_id: conversationIdRef.current,
            message_id: assistantId,
            in_reply_to: userMsgId,
            content: beaText,
            model: beaModel,
            latency_ms: Date.now() - requestStartMs,
          });
        }
      } catch (err) {
        // Aborted requests are silent — they're either user-initiated
        // (reset, new send) or component unmount
        if (err instanceof Error && err.name === "AbortError") return;

        const message =
          err instanceof Error ? err.message : "Etwas ist schiefgelaufen.";
        dispatch({ type: "error", message });
        // ANALYTICS — Fehler erfassen
        if (conversationIdRef.current) {
          trackChatError({
            conversation_id: conversationIdRef.current,
            error_code: err instanceof Error ? err.name : "unknown",
            error_message: message,
          });
        }
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
    // ANALYTICS — vorherige Chat-Session schließen, falls aktiv
    if (conversationIdRef.current) {
      trackChatSessionEnded({
        conversation_id: conversationIdRef.current,
        message_count: conversationMessageCountRef.current,
        duration_ms: Date.now() - conversationStartRef.current,
      });
      conversationIdRef.current = "";
      conversationMessageCountRef.current = 0;
    }
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
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <BackToSiteButton />
      {/* ── PHASE: Welcome ─────────────────────────────── */}
      {phase === "welcome" && (
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4">
          <WelcomeDecor />
          <AnimatePresence mode="wait">
            {welcomeStep === "greeting" ? (
              <WelcomeGreeting onContinue={handleWelcomeContinue} />
            ) : (
              <WelcomeDisclaimer
                onBack={handleWelcomeBack}
                onContinue={handleStartOnboarding}
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
            <div className="mt-2 sticky top-0 z-10 border-b border-primaryOrange/10 bg-white/95 pb-2.5 pl-14 pr-4 pt-3 backdrop-blur sm:pl-40 md:pl-48 md:pr-6 md:pt-4">
              <div className="mx-auto w-full max-w-6xl">
                <OnboardingProgress
                  current={onboardingState.stepIdx}
                  total={onboardingState.total}
                />
              </div>
            </div>
          )}
          <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center py-4 sm:px-2 sm:py-6">
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
            style={{
              background:
                "linear-gradient(180deg, #FFFDFB 0%, #FFF8F0 40%, #FFFAF3 100%)",
            }}
          >
            <ChatHeader onReset={handleReset} />
            <ChatMessages
              messages={chatState.messages}
              status={chatState.status}
              sessionLimitReached={sessionLimitReached}
              onReset={handleReset}
              bottomRef={bottomRef}
              quickReplies={chatState.quickReplies}
              onQuickReply={(prompt) => sendMessage(prompt)}
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
