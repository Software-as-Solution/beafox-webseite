"use client";

// ─── BeaAvatar ────────────────────────────────────────────
// Round Bea avatar with emotion-driven asset + special filters for
// "sleeping" and "returning" presence states.

import { memo } from "react";
import Image from "next/image";
import {
  type BeaEmotion,
  getEmotionAsset,
} from "@/lib/bea-ai/chat/beaEmotions";
import type { BeaPresenceState } from "@/lib/bea-ai/chat/beaPresence";

interface Props {
  size?: number;
  emotion?: BeaEmotion;
  presence?: BeaPresenceState;
}

/**
 * Round avatar that picks its asset from `emotion`. Adds a
 * grayscale + reduced-opacity filter when `presence === "sleeping"`,
 * and a fade-in pulse when `presence === "returning"`.
 */
const BeaAvatar = memo(function BeaAvatar({
  size = 32,
  emotion = "online_default",
  presence,
}: Props) {
  const isSleeping = presence === "sleeping";
  const isReturning = presence === "returning";

  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 overflow-hidden rounded-full"
    >
      <Image
        alt="Bea"
        width={size}
        height={size}
        className="object-cover transition-all duration-500"
        src={getEmotionAsset(emotion)}
        style={{
          filter: isSleeping
            ? "grayscale(0.6) blur(0.5px)"
            : isReturning
              ? "saturate(1.15)"
              : undefined,
          opacity: isSleeping ? 0.65 : 1,
        }}
      />
      {isSleeping && (
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 text-xs"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" }}
        >
          💤
        </span>
      )}
    </div>
  );
});

export default BeaAvatar;
