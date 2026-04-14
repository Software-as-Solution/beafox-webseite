"use client";

// ─── useAutoScroll ────────────────────────────────────────
// Smart auto-scroll for chat: scrolls to bottom on new messages
// UNLESS the user has scrolled up. Exposes a `showScrollButton`
// flag that consumers can use to render a "scroll to bottom" CTA.

import { useCallback, useEffect, useRef, useState } from "react";

// CONSTANTS
const NEAR_BOTTOM_THRESHOLD_PX = 100;
const SHOW_BUTTON_THRESHOLD_PX = 200;

interface UseAutoScrollArgs<T> {
  /** Reactive value that triggers a re-evaluation (typically messages array). */
  trigger: T;
}

export function useAutoScroll<T>({ trigger }: UseAutoScrollArgs<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isPinnedToBottomRef = useRef(true);

  // Auto-scroll on new content if the user is pinned to bottom
  useEffect(() => {
    if (isPinnedToBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [trigger]);

  // Listen for user scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      isPinnedToBottomRef.current =
        distFromBottom < NEAR_BOTTOM_THRESHOLD_PX;
      setShowScrollButton(distFromBottom > SHOW_BUTTON_THRESHOLD_PX);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return {
    scrollRef,
    bottomRef,
    showScrollButton,
    scrollToBottom,
  };
}
