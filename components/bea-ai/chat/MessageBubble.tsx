"use client";

// ─── MessageBubble ────────────────────────────────────────
// Cluster-aware chat bubble for User and Bea messages. Adapts its
// rounded corners depending on whether it's the start, middle, or
// end of a sequence of consecutive messages by the same speaker.

import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import BeaAvatar from "./BeaAvatar";
import { fmtTime } from "@/lib/bea-ai/chat/helpers";
import type { Message } from "@/lib/bea-ai/chat/chatTypes";

// STYLES
const BEA_BUBBLE_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
  border: "1px solid rgba(232,119,32,0.18)",
  boxShadow: "0 2px 12px rgba(232,119,32,0.06)",
} as const;
const USER_BUBBLE_STYLE = {
  background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.18), 0 1px 2px rgba(232,119,32,0.25)",
} as const;
const MODEL_BADGE_BASE_STYLE = {
  background: "rgba(232,119,32,0.08)",
} as const;
const SONNET_BADGE_STYLE = {
  background: "rgba(124,58,237,0.08)",
  color: "#7C3AED",
} as const;

interface Props {
  msg: Message;
  isClusterStart: boolean;
  isClusterEnd: boolean;
}

/**
 * Single chat bubble. Renders user vs. assistant with different
 * styles, and adjusts corners based on cluster position.
 */
const MessageBubble = memo(function MessageBubble({
  msg,
  isClusterStart,
  isClusterEnd,
}: Props) {
  const isUser = msg.role === "user";

  // Bubble corners follow iMessage convention
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
          style={isUser ? USER_BUBBLE_STYLE : BEA_BUBBLE_STYLE}
        >
          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
        </div>
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
                style={
                  msg.model.includes("sonnet")
                    ? SONNET_BADGE_STYLE
                    : { ...MODEL_BADGE_BASE_STYLE, color: "#E87720" }
                }
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

export default MessageBubble;
