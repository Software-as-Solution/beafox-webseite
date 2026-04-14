// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Chat Tracker
// ─────────────────────────────────────────────────────────────
// Herzstück fürs Fine-Tuning: System-Prompt + User-Message + Bea's
// Response werden gekoppelt geloggt. System-Prompt enthält bereits
// buildProfileContext(), was PII (Zielbild-Freitext) haben kann —
// der Scrubber läuft DROP-IN drüber.
// ─────────────────────────────────────────────────────────────

import { buildMeta, enqueue } from "../client";
import { scrubPII } from "../scrubber";
import { bucketProfile } from "./onboarding";
import type { BucketedProfile } from "../types";
import type { UserProfile } from "@/lib/bea-ai/onboarding";

export function trackChatSessionStarted(args: {
  conversation_id: string;
  system_prompt: string;
  profile: UserProfile | null;
}): void {
  const profile_snapshot: BucketedProfile | null = args.profile
    ? bucketProfile(args.profile)
    : null;

  enqueue({
    type: "chat.session.started",
    conversation_id: args.conversation_id,
    system_prompt: scrubPII(args.system_prompt),
    profile_snapshot,
    meta: buildMeta(),
  });
}

export function trackChatMessageSent(args: {
  conversation_id: string;
  message_id: string;
  content: string;
}): void {
  const cleaned = scrubPII(args.content);
  enqueue({
    type: "chat.message.sent",
    conversation_id: args.conversation_id,
    message_id: args.message_id,
    content: cleaned,
    length_chars: cleaned.length,
    meta: buildMeta(),
  });
}

export function trackChatResponseReceived(args: {
  conversation_id: string;
  message_id: string;
  in_reply_to: string;
  content: string;
  model: string;
  latency_ms: number;
}): void {
  const cleaned = scrubPII(args.content);
  enqueue({
    type: "chat.response.received",
    conversation_id: args.conversation_id,
    message_id: args.message_id,
    in_reply_to: args.in_reply_to,
    content: cleaned,
    length_chars: cleaned.length,
    model: args.model,
    latency_ms: args.latency_ms,
    // Grobe Token-Schätzung: 1 Token ≈ 4 Zeichen (Deutsch)
    tokens_approx: Math.ceil(cleaned.length / 4),
    meta: buildMeta(),
  });
}

export function trackChatResponseRegenerated(
  conversation_id: string,
  message_id: string,
): void {
  enqueue({
    type: "chat.response.regenerated",
    conversation_id,
    message_id,
    meta: buildMeta(),
  });
}

export function trackChatFeedback(args: {
  conversation_id: string;
  message_id: string;
  feedback: "up" | "down";
  note?: string | null;
}): void {
  enqueue({
    type: "chat.response.feedback",
    conversation_id: args.conversation_id,
    message_id: args.message_id,
    feedback: args.feedback,
    note: args.note ? scrubPII(args.note) : null,
    meta: buildMeta(),
  });
}

export function trackChatError(args: {
  conversation_id: string;
  error_code: string;
  error_message: string;
}): void {
  enqueue({
    type: "chat.error",
    conversation_id: args.conversation_id,
    error_code: args.error_code,
    error_message: args.error_message.slice(0, 500),
    meta: buildMeta(),
  });
}

export function trackChatSessionEnded(args: {
  conversation_id: string;
  message_count: number;
  duration_ms: number;
}): void {
  enqueue({
    type: "chat.session.ended",
    conversation_id: args.conversation_id,
    message_count: args.message_count,
    duration_ms: args.duration_ms,
    meta: buildMeta(),
  });
}
