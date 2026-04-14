"use client";

// ─── BeaPresenceHeader ────────────────────────────────────
// Sticky top bar with Bea's avatar, name, status, and reset button.
// Animates Bea's status text and online dot to mirror her presence.

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import BeaAvatar from "./BeaAvatar";
import {
  type BeaPresenceState,
  isPresenceAvailable,
} from "@/lib/bea-ai/chat/beaPresence";
import type { BeaEmotion } from "@/lib/bea-ai/chat/beaEmotions";

interface Props {
  emotion: BeaEmotion;
  presence: BeaPresenceState;
  onReset: () => void;
}

export default function BeaPresenceHeader({
  emotion,
  presence,
  onReset,
}: Props) {
  const t = useTranslations("onboarding.beaAi.chat");
  const isAvailable = isPresenceAvailable(presence);
  const isThinking = presence === "thinking" || presence === "typing";

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-primaryOrange/10 bg-white/85 px-4 pb-3 pl-[4.25rem] pt-3 backdrop-blur-md sm:pl-40 md:px-6 md:pl-48">
      <div className="flex min-w-0 items-center gap-3">
        <motion.div
          animate={
            isThinking ? { scale: [1, 1.04, 1] } : { scale: 1 }
          }
          transition={
            isThinking
              ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          className="relative h-9 w-9 shrink-0 md:h-10 md:w-10"
        >
          <div className="h-full w-full overflow-hidden rounded-full bg-primaryOrange/10">
            <BeaAvatar
              size={40}
              emotion={emotion}
              presence={presence}
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3"
          >
            {isAvailable && (
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                style={{
                  background: isThinking ? "#E87720" : "#22c55e",
                  animationDuration: isThinking ? "0.8s" : "1.6s",
                }}
              />
            )}
            <span
              className="relative inline-flex h-3 w-3 rounded-full border-2 border-white"
              style={{
                background: isAvailable
                  ? isThinking
                    ? "#E87720"
                    : "#22c55e"
                  : "#9ca3af",
              }}
            />
          </span>
        </motion.div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-black text-darkerGray md:text-[15px]">
            {t("header.name")}
          </div>
          <div
            className={`truncate text-[11px] md:text-xs ${
              isAvailable ? "text-green-600" : "text-gray-400"
            }`}
          >
            {t(`presence.${presence}`)}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-darkerGray transition-colors hover:border-primaryOrange/40 hover:text-primaryOrange md:text-xs"
        aria-label={t("header.newChat")}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("header.newChat")}</span>
      </button>
    </div>
  );
}
