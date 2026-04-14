"use client";

// ─── QuickRepliesRow ──────────────────────────────────────
// Horizontal flex-wrap row of quick-reply chips, indented to align
// with Bea's message column (after the avatar).

import { motion } from "framer-motion";
import QuickReplyChip from "./QuickReplyChip";
import type { QuickReply } from "@/lib/bea-ai/chat/chatTypes";

interface Props {
  replies: QuickReply[];
  onSelect: (prompt: string) => void;
}

export default function QuickRepliesRow({ replies, onSelect }: Props) {
  if (replies.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-wrap gap-2 pl-[42px]"
    >
      {replies.map((reply, idx) => (
        <QuickReplyChip
          key={reply.id}
          reply={reply}
          index={idx}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
}
