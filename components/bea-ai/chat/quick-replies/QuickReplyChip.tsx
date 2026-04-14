"use client";

// ─── QuickReplyChip ───────────────────────────────────────
// Single tappable quick-reply chip. Designed as a follow-up
// suggestion to a Bea message.

import { motion } from "framer-motion";
import type { QuickReply } from "@/lib/bea-ai/chat/chatTypes";

interface Props {
  reply: QuickReply;
  index: number;
  onSelect: (prompt: string) => void;
}

// STYLES
const CHIP_STYLE = {
  boxShadow: "0 2px 8px rgba(232,119,32,0.08)",
} as const;

export default function QuickReplyChip({ reply, index, onSelect }: Props) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(reply.prompt)}
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.3 + index * 0.06,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      className="group inline-flex items-center gap-1.5 rounded-full border border-primaryOrange/30 bg-white px-3 py-1.5 text-xs font-semibold text-darkerGray transition-colors hover:border-primaryOrange hover:bg-primaryOrange/5 hover:text-primaryOrange md:text-[13px]"
      style={CHIP_STYLE}
    >
      {reply.emoji && <span className="text-sm">{reply.emoji}</span>}
      <span>{reply.label}</span>
    </motion.button>
  );
}
