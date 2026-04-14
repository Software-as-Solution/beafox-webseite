"use client";

// ─── ChatMessagesList ─────────────────────────────────────
// Renders the message stream with cluster-awareness, typing
// indicator, optional Bea-Cards inline, and quick-replies.

import { type RefObject, useMemo } from "react";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import BeaAvatar from "./BeaAvatar";
import QuickRepliesRow from "./quick-replies/QuickRepliesRow";
import BeaCardRenderer from "./cards/BeaCardRenderer";
import type {
  ChatStatus,
  Message,
  QuickReply,
} from "@/lib/bea-ai/chat/chatTypes";

// STYLES
const TYPING_BUBBLE_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
  border: "1px solid rgba(232,119,32,0.18)",
  boxShadow: "0 2px 12px rgba(232,119,32,0.06)",
} as const;

interface Props {
  messages: Message[];
  status: ChatStatus;
  bottomRef: RefObject<HTMLDivElement | null>;
  quickReplies: QuickReply[];
  onQuickReply: (prompt: string) => void;
  /** Card interaction handler (forwarded to BeaCardRenderer). */
  onCardAction?: (action: string, payload?: unknown) => void;
}

export default function ChatMessagesList({
  messages,
  status,
  bottomRef,
  quickReplies,
  onQuickReply,
  onCardAction,
}: Props) {
  // Cluster info per message
  const clusterInfo = useMemo(() => {
    return messages.map((m, i) => {
      const prev = messages[i - 1];
      const next = messages[i + 1];
      const isClusterStart = !prev || prev.role !== m.role || !!m.card;
      const isClusterEnd = !next || next.role !== m.role || !!next.card;
      return { isClusterStart, isClusterEnd };
    });
  }, [messages]);

  const lastMsg = messages[messages.length - 1];
  const showStreamingTyping =
    status === "streaming" &&
    (!lastMsg ||
      lastMsg.role === "user" ||
      (lastMsg.role === "assistant" && lastMsg.content === ""));
  const showGreetingTyping = status === "greeting";
  const showTyping = showStreamingTyping || showGreetingTyping;

  const showQuickReplies =
    status === "idle" &&
    quickReplies.length > 0 &&
    lastMsg?.role === "assistant";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-4 pt-4 md:px-6 md:pt-6">
      <div className="flex flex-col">
        {messages.map((m, i) =>
          m.card ? (
            <div key={m.id} className="mt-3">
              <BeaCardRenderer
                card={m.card}
                onAction={onCardAction}
              />
            </div>
          ) : (
            <MessageBubble
              key={m.id}
              msg={m}
              isClusterStart={clusterInfo[i].isClusterStart}
              isClusterEnd={clusterInfo[i].isClusterEnd}
            />
          ),
        )}

        {showTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 flex items-start gap-2.5"
          >
            <div className="h-8 w-8 shrink-0">
              {(!lastMsg || lastMsg.role !== "assistant") && (
                <BeaAvatar size={32} emotion="typing" />
              )}
            </div>
            <div
              className="inline-flex items-center rounded-2xl rounded-bl-md px-4 py-3"
              style={TYPING_BUBBLE_STYLE}
            >
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        {showQuickReplies && (
          <div className="mt-3">
            <QuickRepliesRow replies={quickReplies} onSelect={onQuickReply} />
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
