// ─── CHAT TYPES ───────────────────────────────────────────
// Shared type definitions for the chat phase. Imported by the
// reducer, hooks, and components.

import type {
  UserProfile,
  OnboardingInsights,
} from "@/lib/bea-ai/onboarding";

// CONSTANTS
export const MAX_INPUT_LENGTH = 2000;
export const MAX_TEXTAREA_HEIGHT = 150;

// ─── Bea Cards (discriminated union) ──────────────────────
export interface PollOption {
  label: string;
  value: string;
}

export type RechnerType = "notgroschen" | "sparziel" | "zinseszins";

export type BeaCard =
  | {
      type: "welcome";
      userProfile: UserProfile;
      insights: OnboardingInsights;
    }
  | { type: "beta_access" }
  | {
      type: "ratgeber";
      slug: string;
      title: string;
      description: string;
    }
  | { type: "rechner"; rechnerType: RechnerType }
  | {
      type: "quick_poll";
      question: string;
      options: PollOption[];
    }
  | { type: "milestone"; milestone: string; description: string };

export type BeaCardType = BeaCard["type"];

// ─── Quick Replies ────────────────────────────────────────
export interface QuickReply {
  id: string;
  label: string;
  prompt: string;
  emoji?: string;
}

// ─── Message ──────────────────────────────────────────────
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
  /** When set, the message is rendered as a Bea-Card instead of plain text. */
  card?: BeaCard;
  /**
   * When true, this is a proactive client-side message (idle nudge,
   * return greeting, etc.) — not sent to the LLM as conversation context.
   */
  isProactive?: boolean;
}

// ─── Chat State ───────────────────────────────────────────
export type ChatStatus =
  | "idle"
  | "streaming"
  | "error"
  | "session_limited"
  | "greeting";

export interface ChatState {
  status: ChatStatus;
  messages: Message[];
  error: string | null;
  remaining: number | null;
  lastInput: string | null;
  quickReplies: QuickReply[];
  /** Card-IDs that have already been rendered (to avoid duplicates). */
  shownCardIds: string[];
}

// ─── Chat Actions ─────────────────────────────────────────
export type ChatAction =
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
  | { type: "greetingDone"; quickReplies: QuickReply[] }
  | { type: "addProactiveMessage"; message: Message }
  | { type: "addCard"; message: Message; cardId: string };

// ─── SSE Event ────────────────────────────────────────────
export interface SSEEvent {
  text?: string;
  model?: string;
  message?: string;
  remainingMessages?: number;
  type: "meta" | "text" | "done" | "error";
}

// ─── Greeting Builder ─────────────────────────────────────
export interface GreetingMessage {
  content: string;
  /** Delay in ms before this message appears (cumulative from greeting start). */
  delayMs: number;
}

export interface Greeting {
  messages: GreetingMessage[];
  quickReplies: QuickReply[];
}
