"use client";

// ─── ChatInput ────────────────────────────────────────────
// Breathing input field that visually reacts to chat context:
//   - Hidden during greeting sequence
//   - Shrunken when quick-replies are visible
//   - Disabled but visible while Bea is streaming
//   - Subtle "delivered" toast when user sends to absent Bea

import {
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  MAX_INPUT_LENGTH,
  MAX_TEXTAREA_HEIGHT,
} from "@/lib/bea-ai/chat/chatTypes";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  /** Whether quick-reply chips are currently visible (input shrinks). */
  isCondensed?: boolean;
  /** Whether the input should be hidden completely (greeting sequence). */
  isHidden?: boolean;
  /** Whether to show "Nachricht ist angekommen" toast after send (Bea away). */
  showAwayAcknowledge?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isStreaming,
  inputRef,
  isCondensed = false,
  isHidden = false,
  showAwayAcknowledge = false,
}: Props) {
  const t = useTranslations("beaAi.chat");
  const [showToast, setShowToast] = useState(false);
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isStreaming;

  // Reset textarea height when value is cleared externally
  useEffect(() => {
    if (value === "" && inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }, [value, inputRef]);

  // "Bea is away" toast handling
  useEffect(() => {
    if (!showAwayAcknowledge) return;
    setShowToast(true);
    const id = window.setTimeout(() => setShowToast(false), 2200);
    return () => window.clearTimeout(id);
  }, [showAwayAcknowledge]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      if (next.length > MAX_INPUT_LENGTH) return;
      onChange(next);
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
    <motion.div
      animate={{
        opacity: isHidden ? 0 : 1,
        y: isHidden ? 20 : 0,
        scale: isCondensed ? 0.97 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        boxShadow: "0 -8px 20px rgba(232,119,32,0.04)",
        pointerEvents: isHidden ? "none" : "auto",
      }}
      className="shrink-0 bg-white/95 px-3 pb-3 pt-2.5 backdrop-blur md:px-6 md:pb-4 md:pt-3"
    >
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mx-auto mb-2 max-w-3xl rounded-full bg-primaryOrange/10 px-3 py-1.5 text-center text-[11px] font-semibold text-primaryOrange md:text-xs"
          >
            {t("awayAcknowledge")}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2 md:gap-2.5"
      >
        <div
          className="relative flex-1 rounded-[22px] transition-all duration-200"
          style={{
            background: "#FFFFFF",
            border: `1.5px solid ${trimmed ? "rgba(232,119,32,0.22)" : "rgba(232,119,32,0.15)"}`,
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
            placeholder={
              isCondensed
                ? t("input.placeholderWithReplies")
                : t("input.placeholder")
            }
            disabled={isStreaming}
            rows={1}
            aria-label={t("input.placeholder")}
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
          aria-label={t("input.send")}
          whileTap={canSend ? { scale: 0.93 } : {}}
          whileHover={canSend ? { scale: 1.05 } : {}}
          className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
          style={{
            background: trimmed
              ? "linear-gradient(135deg, #E87720, #F08A3C)"
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
        {t("input.disclaimer")}{" "}
        <Link
          href="/datenschutz"
          className="underline hover:text-primaryOrange"
        >
          {t("input.privacyLink")}
        </Link>
      </p>
    </motion.div>
  );
}
