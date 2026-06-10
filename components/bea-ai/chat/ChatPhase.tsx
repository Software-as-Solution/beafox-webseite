"use client";

// ─── ChatPhase ────────────────────────────────────────────
// Orchestrator for the chat phase. Wires reducer, hooks, presence,
// idle nudges, and card triggers together. Renders the full chat
// surface (header + messages + cards + quick-replies + input).

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import {
  buildProfileContext,
  generateInsights,
  type UserProfile,
} from "@/lib/bea-ai/onboarding";
import {
  chatReducer,
  initialChatState,
} from "@/lib/bea-ai/chat/chatReducer";
import {
  buildGreeting,
  pickIdleNudge,
  pickReturnGreeting,
} from "@/lib/bea-ai/chat/greetingBuilder";
import { uid } from "@/lib/bea-ai/chat/helpers";
import { sanitizeBeaOutput } from "@/lib/bea-ai/sanitize";
import {
  inferBeaEmotionFromContext,
  type BeaEmotion,
} from "@/lib/bea-ai/chat/beaEmotions";
import {
  type BeaPresenceState,
  shouldGreetReturning,
} from "@/lib/bea-ai/chat/beaPresence";
import type { Message, BeaCard } from "@/lib/bea-ai/chat/chatTypes";

import {
  trackChatSessionStarted,
  trackChatMessageSent,
  trackChatResponseReceived,
  trackChatError,
  trackChatSessionEnded,
  trackInsightsGenerated,
} from "@/lib/analytics";

import { useChatStream } from "@/hooks/useChatStream";
import { useBeaPresence } from "@/hooks/useBeaPresence";
import { useIdleDetection } from "@/hooks/useIdleDetection";
import { useAutoScroll } from "@/hooks/useAutoScroll";

import BeaPresenceHeader from "./BeaPresenceHeader";
import ChatMessagesList from "./ChatMessagesList";
import ChatInput from "./ChatInput";
import SessionLimitScreen from "./SessionLimitScreen";
import ErrorBanner from "./ErrorBanner";
import BetaAccessCard from "@/components/bea-ai/BetaAccessCard";

// CONSTANTS
const IDLE_NUDGE_THRESHOLD_MS = 60 * 1000;

interface Props {
  profile: UserProfile;
  /** Reset back to welcome / start-over. */
  onReset: () => void;
  /**
   * Optionale Seed-Frage aus dem Ratgeber-Deep-Link (`/bea-ai?topic=`).
   * Wird beim Mount GENAU EINMAL gesendet (ref-guarded gegen
   * Strict-Mode-/Doppel-Render — jeder Extra-Send kostet Geld).
   * Läuft durch die normale, gecappte /api/bea-ai/chat-Route.
   */
  autoSend?: string;
}

export default function ChatPhase({ profile, onReset, autoSend }: Props) {
  const [chatState, dispatch] = useReducer(chatReducer, initialChatState);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationIdRef = useRef<string>("");
  const conversationStartRef = useRef<number>(0);
  const conversationMessageCountRef = useRef<number>(0);
  const greetingDoneRef = useRef(false);
  const wasReturningRef = useRef(false);
  const autoSendDoneRef = useRef(false);
  const [showAwayToast, setShowAwayToast] = useState(false);

  // Stable getter for the latest messages (avoids stale closures)
  const messagesRef = useRef(chatState.messages);
  messagesRef.current = chatState.messages;
  const getMessages = useCallback(() => messagesRef.current, []);

  // ─── Auto-scroll ─────────────────────────────────────────
  const { scrollRef, bottomRef, showScrollButton, scrollToBottom } =
    useAutoScroll({ trigger: chatState.messages });

  // ─── Bea Presence (override based on chat status) ────────
  const presenceOverride: BeaPresenceState | null =
    chatState.status === "streaming" ? "typing" : null;
  const { state: presenceState, bumpActivity } = useBeaPresence({
    override: presenceOverride,
  });

  // Bea's emotion based on chat context
  const lastUserMsg = chatState.messages
    .filter((m) => m.role === "user")
    .pop()?.content;
  const emotion: BeaEmotion = inferBeaEmotionFromContext({
    userMessage: lastUserMsg,
    isStreaming: chatState.status === "streaming",
    isThinking: false,
    chatStage:
      chatState.status === "greeting"
        ? "greeting"
        : presenceState === "away" || presenceState === "sleeping"
          ? "idle"
          : "active",
  });

  // ─── Stream hook ─────────────────────────────────────────
  const { sendMessage } = useChatStream({
    getMessages,
    dispatch,
    profile,
    onUserMessage: (msg) => {
      conversationMessageCountRef.current += 1;
      bumpActivity();
      if (conversationIdRef.current) {
        trackChatMessageSent({
          conversation_id: conversationIdRef.current,
          message_id: msg.id,
          content: msg.content,
        });
      }
    },
    onResponse: ({ msg, inReplyTo, latencyMs }) => {
      conversationMessageCountRef.current += 1;
      if (conversationIdRef.current) {
        trackChatResponseReceived({
          conversation_id: conversationIdRef.current,
          message_id: msg.id,
          in_reply_to: inReplyTo,
          content: msg.content,
          model: msg.model ?? "unknown",
          latency_ms: latencyMs,
        });
      }
    },
    onError: ({ code, message }) => {
      if (conversationIdRef.current) {
        trackChatError({
          conversation_id: conversationIdRef.current,
          error_code: code,
          error_message: message,
        });
      }
    },
  });

  // ─── Greeting Sequence (run once on mount) ───────────────
  useEffect(() => {
    if (greetingDoneRef.current) return;
    greetingDoneRef.current = true;

    const newConvId = uid();
    conversationIdRef.current = newConvId;
    conversationStartRef.current = Date.now();
    conversationMessageCountRef.current = 0;

    // Deep-Link-Einstieg (autoSend aus /bea-ai?topic= oder ?context=): KEINE
    // Begrüßungssequenz + Welcome-Card. Direkt in die fokussierte Konversation —
    // die Auto-Send-Frage IST die erste Nachricht. Status bleibt "idle"
    // (initialChatState), Input sofort nutzbar. Session-Tracking bleibt erhalten.
    if (autoSend?.trim()) {
      try {
        trackChatSessionStarted({
          conversation_id: newConvId,
          system_prompt: buildProfileContext(profile),
          profile,
        });
      } catch (err) {
        console.warn("[ChatPhase] deep-link session init failed", err);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    try {
      const insights = generateInsights(profile);
      trackInsightsGenerated(insights);
      const systemPrompt = buildProfileContext(profile);
      trackChatSessionStarted({
        conversation_id: newConvId,
        system_prompt: systemPrompt,
        profile,
      });
      const greeting = buildGreeting(profile, insights);
      dispatch({ type: "greetingStart" });
      let cumulative = 0;
      greeting.messages.forEach((gm) => {
        cumulative += gm.delayMs;
        window.setTimeout(() => {
          dispatch({
            type: "greetingMessage",
            message: {
              id: uid(),
              role: "assistant",
              content: sanitizeBeaOutput(gm.content),
              timestamp: new Date(),
            },
          });
        }, cumulative);
      });
      // Nach den Greeting-Messages:
      //  • MIT Onboarding → WelcomeCard (Fuchs-Typ-Quickstarts), Quick-Replies leer.
      //  • OHNE Onboarding → KEINE WelcomeCard (sie würde den erfundenen Fuchs-Typ
      //    erneut zeigen UND ist redundant zur Begrüßung) → stattdessen die
      //    generischen Greeting-Quick-Replies (Überblick / Sparen / Quatschen).
      window.setTimeout(() => {
        const hasOnboarding =
          (profile.lebenssituation?.trim().length ?? 0) > 0 ||
          (profile.prioritaeten?.length ?? 0) > 0 ||
          (profile.zielbild?.trim().length ?? 0) > 0;
        if (hasOnboarding) {
          dispatch({
            type: "addCard",
            message: {
              id: uid(),
              role: "assistant",
              content: "",
              timestamp: new Date(),
              card: {
                type: "welcome",
                userProfile: profile,
                insights,
              } satisfies BeaCard,
            },
            cardId: "welcome",
          });
          dispatch({ type: "greetingDone", quickReplies: [] });
        } else {
          dispatch({
            type: "greetingDone",
            quickReplies: greeting.quickReplies,
          });
        }
      }, cumulative + 600);
    } catch (err) {
      console.warn("[ChatPhase] greeting init failed", err);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Deep-Link Auto-Send (Ratgeber → Bea) ────────────────
  // Schickt die Seed-Frage GENAU EINMAL. Der Ref-Guard verhindert,
  // dass React Strict-Mode / Doppel-Render einen zweiten LLM-Call
  // auslöst (Kosten!). Der Send läuft durch die normale, gecappte
  // /api/bea-ai/chat-Route — kein zweiter LLM-Einstiegspunkt.
  useEffect(() => {
    if (autoSendDoneRef.current) return;
    const seed = autoSend?.trim();
    if (!seed) return;
    autoSendDoneRef.current = true;
    sendMessage(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSend]);

  // ─── Idle Nudge Detection ────────────────────────────────
  const lastUserActivity = chatState.messages
    .filter((m) => m.role === "user")
    .pop()?.id;

  useIdleDetection(lastUserActivity ?? "init", {
    thresholdMs: IDLE_NUDGE_THRESHOLD_MS,
    disabled:
      chatState.status === "streaming" ||
      chatState.status === "greeting" ||
      chatState.status === "session_limited",
    onIdle: () => {
      // Only nudge when there's a real conversation going (≥ 1 user msg)
      if (
        !chatState.messages.some((m) => m.role === "user") ||
        chatState.status !== "idle"
      ) {
        return;
      }
      dispatch({
        type: "addProactiveMessage",
        message: {
          id: uid(),
          role: "assistant",
          content: sanitizeBeaOutput(pickIdleNudge()),
          timestamp: new Date(),
          isProactive: true,
        },
      });
    },
  });

  // ─── Send-Wrapper that injects return-greeting if user was away ─
  const sendWithReturn = useCallback(
    (text: string) => {
      const idleMs = Date.now() - conversationStartRef.current;
      const wasAbsent =
        presenceState === "away" || presenceState === "sleeping";
      // Inject return-greeting BEFORE the actual response if applicable
      if (wasAbsent || (shouldGreetReturning(idleMs) && !wasReturningRef.current)) {
        wasReturningRef.current = true;
        dispatch({
          type: "addProactiveMessage",
          message: {
            id: uid(),
            role: "assistant",
            content: sanitizeBeaOutput(pickReturnGreeting()),
            timestamp: new Date(),
            isProactive: true,
          },
        });
        // Show "delivered" toast briefly
        setShowAwayToast(true);
        window.setTimeout(() => setShowAwayToast(false), 2500);
      }
      sendMessage(text);
    },
    [presenceState, sendMessage],
  );

  const handleSendCurrentInput = useCallback(() => {
    sendWithReturn(input);
    setInput("");
  }, [input, sendWithReturn]);

  const handleQuickReply = useCallback(
    (prompt: string) => {
      sendWithReturn(prompt);
    },
    [sendWithReturn],
  );

  // ─── Card-Action Handler ─────────────────────────────────
  const handleCardAction = useCallback(
    (action: string, payload?: unknown) => {
      if (action === "welcome.quickStart" && typeof payload === "string") {
        sendWithReturn(payload);
      } else if (action === "quick_poll.answer" && typeof payload === "string") {
        sendWithReturn(payload);
      }
    },
    [sendWithReturn],
  );

  // ─── Reset ──────────────────────────────────────────────
  const handleReset = useCallback(() => {
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
    onReset();
  }, [onReset]);

  // ─── Derived ─────────────────────────────────────────────
  const isStreaming = chatState.status === "streaming";
  const showError = chatState.status === "error" && chatState.error !== null;
  const sessionLimitReached = chatState.status === "session_limited";
  const isGreeting = chatState.status === "greeting";
  const hasQuickReplies = chatState.quickReplies.length > 0;

  return (
    <>
      <div
        ref={scrollRef}
        className="relative flex min-h-0 flex-1 flex-col overflow-y-auto"
        style={{
          background:
            "linear-gradient(180deg, #FFFDFB 0%, #FFF8F0 40%, #FFFAF3 100%)",
        }}
      >
        <BeaPresenceHeader
          emotion={emotion}
          presence={presenceState}
          onReset={handleReset}
        />
        <ChatMessagesList
          messages={chatState.messages}
          status={chatState.status}
          bottomRef={bottomRef}
          quickReplies={chatState.quickReplies}
          onQuickReply={handleQuickReply}
          onCardAction={handleCardAction}
        />

        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              type="button"
              onClick={scrollToBottom}
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
            onRetry={() => {
              if (chatState.lastInput) sendMessage(chatState.lastInput, { isRetry: true });
            }}
            onDismiss={() => dispatch({ type: "clearError" })}
          />
        )}
      </AnimatePresence>

      {!sessionLimitReached && (
        <>
          <div className="shrink-0 border-t border-primaryOrange/10 bg-white/85 px-3 pt-3 backdrop-blur md:px-6 md:pt-3.5">
            <div className="mx-auto max-w-3xl">
              <BetaAccessCard />
            </div>
          </div>
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSendCurrentInput}
            isStreaming={isStreaming}
            inputRef={inputRef}
            isHidden={isGreeting}
            isCondensed={hasQuickReplies}
            showAwayAcknowledge={showAwayToast}
          />
        </>
      )}
      {sessionLimitReached && (
        <div className="shrink-0">
          <SessionLimitScreen onReset={handleReset} />
        </div>
      )}

    </>
  );
}
