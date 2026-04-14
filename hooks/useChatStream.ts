"use client";

// ─── useChatStream ────────────────────────────────────────
// Encapsulates the fetch + SSE + AbortController logic for chatting
// with Bea. Returns a stable `sendMessage` function and exposes the
// in-flight state.

import { useCallback, useEffect, useRef } from "react";
import type { UserProfile } from "@/lib/bea-ai/onboarding";
import { parseSSEEvent } from "@/lib/bea-ai/chat/sseParser";
import { uid } from "@/lib/bea-ai/chat/helpers";
import type { ChatAction, Message } from "@/lib/bea-ai/chat/chatTypes";

// CONSTANTS
const CHAT_API_ENDPOINT = "/api/bea-ai/chat";

interface SendOptions {
  isRetry?: boolean;
}

interface UseChatStreamArgs {
  /** Reactive snapshot of the current chat state (used to read messages). */
  getMessages: () => Message[];
  dispatch: React.Dispatch<ChatAction>;
  profile: UserProfile | null;
  /**
   * Optional analytics hooks. Called at well-defined lifecycle points.
   * If not provided, calls are silently skipped.
   */
  onUserMessage?: (msg: Message) => void;
  onResponse?: (args: {
    msg: Message;
    inReplyTo: string;
    latencyMs: number;
  }) => void;
  onError?: (args: { code: string; message: string }) => void;
}

/**
 * Hook that wraps the streaming fetch logic. The returned `sendMessage`
 * is stable and safe to use as a dependency in other hooks/effects.
 *
 * Aborts in-flight requests on unmount AND when the user starts a new
 * send (only one stream at a time).
 */
export function useChatStream(args: UseChatStreamArgs) {
  const { getMessages, dispatch, profile } = args;
  const abortRef = useRef<AbortController | null>(null);
  const argsRef = useRef(args);
  argsRef.current = args;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string, options: SendOptions = {}) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Build history depending on retry vs. fresh
      let history: Message[];
      let userMsgId = "";
      if (options.isRetry) {
        history = getMessages();
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
        dispatch({
          type: "addUserMessage",
          message: userMsg,
          input: trimmed,
        });
        history = [...getMessages(), userMsg];
        argsRef.current.onUserMessage?.(userMsg);
      }

      const requestStartMs = Date.now();
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
            messages: history
              .filter((m) => !m.isProactive && !m.card) // proactive + cards never go to LLM
              .map((m) => ({ role: m.role, content: m.content })),
            ...(profile ? { profile } : {}),
          }),
          signal: controller.signal,
        });

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
            throw new Error(
              json.message ?? "Bea ist gerade nicht erreichbar.",
            );
          }
        }
        if (!res.ok) throw new Error("Bea ist gerade nicht erreichbar.");
        if (!res.body) throw new Error("Streaming nicht verfügbar.");

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
        if (beaText) {
          argsRef.current.onResponse?.({
            msg: {
              id: assistantId,
              role: "assistant",
              content: beaText,
              timestamp: new Date(),
              model: beaModel,
            },
            inReplyTo: userMsgId,
            latencyMs: Date.now() - requestStartMs,
          });
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Etwas ist schiefgelaufen.";
        dispatch({ type: "error", message });
        argsRef.current.onError?.({
          code: err instanceof Error ? err.name : "unknown",
          message,
        });
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [dispatch, getMessages, profile],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { sendMessage, abort };
}
