"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Plus,
  ArrowDown,
  Loader2,
  Download,
  MessageCircle,
} from "lucide-react";
import { type UserProfile, TOTAL_STEPS } from "@/lib/bea-ai/onboarding";
import OnboardingFlow from "@/components/bea-ai/OnboardingFlow";
import ProgressIndicator from "@/components/bea-ai/shared/ProgressIndicator";

// ─── Brand Constants ────────────────────────────────────────
const C = {
  brand: "#E87720",
  brandLight: "#F08A3C",
  brandBg: "rgba(232,119,32,0.06)",
  brandBgMed: "rgba(232,119,32,0.10)",
  brandBorder: "rgba(232,119,32,0.22)",
  brandShadow: "rgba(232,119,32,0.18)",
} as const;

// ─── Types ──────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
}

interface SSEEvent {
  type: "meta" | "text" | "done" | "error";
  text?: string;
  model?: string;
  remainingMessages?: number;
  message?: string;
}

interface OnboardingState {
  stepIdx: number;
  total: number;
  isComplete: boolean;
}

// ─── Constants ──────────────────────────────────────────────
const MAX_INPUT_LENGTH = 2000;

const INITIAL_ONBOARDING_STATE: OnboardingState = {
  stepIdx: 0,
  total: TOTAL_STEPS,
  isComplete: false,
};

// ─── Helpers ────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
function fmtTime(d: Date): string {
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

// ─── Bea Avatar (reusable) ──────────────────────────────────
function BeaAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      <Image
        src="/Maskottchen/Maskottchen-Hero.webp"
        alt="Bea"
        width={size}
        height={size}
        className="object-cover"
      />
    </div>
  );
}

// ─── Typing Indicator ───────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-[7px] w-[7px] rounded-full"
          style={{ backgroundColor: C.brand }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

// ─── Message Bubble ─────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && <BeaAvatar size={34} />}

      <div className="max-w-[82%] md:max-w-[68%]">
        {!isUser && (
          <span className="mb-1 block text-[11px] font-semibold text-primaryOrange">
            Bea
          </span>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-[1.65] ${
            isUser
              ? "rounded-tr-md text-white"
              : "rounded-tl-md text-darkerGray"
          }`}
          style={
            isUser
              ? {
                  background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandLight} 100%)`,
                  boxShadow: `0 2px 12px ${C.brandShadow}`,
                }
              : {
                  background: C.brandBg,
                  border: `1px solid ${C.brandBorder}`,
                }
          }
        >
          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
        </div>

        <div
          className={`mt-1 flex items-center gap-2 text-[10px] text-gray-400 ${
            isUser ? "justify-end" : ""
          }`}
        >
          <span>{fmtTime(msg.timestamp)}</span>
          {msg.model && !isUser && (
            <span
              className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium"
              style={{
                background: msg.model.includes("sonnet")
                  ? "rgba(124,58,237,0.08)"
                  : C.brandBg,
                color: msg.model.includes("sonnet") ? "#7C3AED" : C.brand,
              }}
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
      </div>
    </motion.div>
  );
}

// ─── Session Limit Screen ───────────────────────────────────
function SessionLimitScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto my-8 flex max-w-md flex-col items-center rounded-2xl border border-primaryOrange/20 bg-gradient-to-b from-white to-orange-50/50 p-8 text-center"
    >
      <div className="relative mb-5 h-24 w-24">
        <Image
          src="/Maskottchen/Maskottchen-Herzen.webp"
          alt="Bea mit Herzen"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="mb-2 text-lg font-bold text-darkerGray">
        Das war&apos;s für die Demo!
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-lightGray">
        In der BeAFox App kannst du unbegrenzt mit mir quatschen — und ich kenne
        dort deinen Fortschritt, deine Ziele und deinen Lernpfad.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="https://apps.apple.com/de/app/beafox/id6746110612"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
          }}
        >
          <Download className="h-4 w-4" />
          App laden
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-darkerGray transition-colors hover:border-primaryOrange/40 hover:text-primaryOrange"
        >
          <Plus className="h-4 w-4" />
          Neuer Chat
        </button>
      </div>
    </motion.div>
  );
}

// ─── Phase enum ─────────────────────────────────────────────
type Phase = "onboarding" | "chat";

// ─── Main Page ──────────────────────────────────────────────
export default function BeaAIPage() {
  // Phase management
  const [phase, setPhase] = useState<Phase>("onboarding");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Lifted onboarding state — used to render progress in the header
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(
    INITIAL_ONBOARDING_STATE,
  );

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScroll, setShowScroll] = useState(false);
  const [sessionLimitReached, setSessionLimitReached] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  // ─── Onboarding handlers ────────────────────────────────
  const handleOnboardingFinish = useCallback((p: UserProfile) => {
    setProfile(p);
    setPhase("chat");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleOnboardingStateChange = useCallback((state: OnboardingState) => {
    setOnboardingState(state);
  }, []);

  // ─── Scroll ──────────────────────────────────────────────
  const scrollDown = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length) scrollDown();
  }, [messages, scrollDown]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Send ────────────────────────────────────────────────
  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;
      setError(null);

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setIsStreaming(true);

      if (inputRef.current) inputRef.current.style.height = "auto";

      try {
        const res = await fetch("/api/bea-ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            ...(profile ? { profile } : {}),
          }),
        });

        if (res.headers.get("content-type")?.includes("application/json")) {
          const json = await res.json();
          if (json.error === "session_limit") {
            setSessionLimitReached(true);
            setIsStreaming(false);
            return;
          }
          if (json.error === "rate_limit") {
            throw new Error(json.message);
          }
          if (!res.ok) throw new Error(json.message ?? "Fehler");
        }

        if (!res.ok) throw new Error("Bea ist gerade nicht erreichbar.");
        if (!res.body) throw new Error("Kein Streaming.");

        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let beaText = "";
        let beaModel = "";
        const beaId = uid();

        setMessages((prev) => [
          ...prev,
          { id: beaId, role: "assistant", content: "", timestamp: new Date() },
        ]);

        let buf = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const parts = buf.split("\n\n");
          buf = parts.pop() ?? "";

          for (const part of parts) {
            const raw = part.replace(/^data: /, "").trim();
            if (!raw) continue;
            try {
              const ev: SSEEvent = JSON.parse(raw);
              if (ev.type === "meta") {
                beaModel = ev.model ?? "";
                if (ev.remainingMessages !== undefined)
                  setRemaining(ev.remainingMessages);
              } else if (ev.type === "text" && ev.text) {
                beaText += ev.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === beaId
                      ? { ...m, content: beaText, model: beaModel }
                      : m,
                  ),
                );
              } else if (ev.type === "error") {
                throw new Error(ev.message);
              }
            } catch {
              /* skip non-JSON */
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === beaId ? { ...m, content: beaText, model: beaModel } : m,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Etwas ist schiefgelaufen.",
        );
        setMessages((prev) =>
          prev.filter((m) => m.content.length > 0 || m.role === "user"),
        );
      } finally {
        setIsStreaming(false);
        inputRef.current?.focus();
      }
    },
    [messages, isStreaming, profile],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setRemaining(null);
    setSessionLimitReached(false);
    setPhase("onboarding");
    setProfile(null);
    setOnboardingState(INITIAL_ONBOARDING_STATE);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (v.length <= MAX_INPUT_LENGTH) setInput(v);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  };

  // Derived for header subtitle
  const headerSubtitle =
    phase === "onboarding"
      ? onboardingState.isComplete
        ? "Fast fertig — gleich geht's los"
        : "Lass uns kennenlernen"
      : "Deine KI-Companion von BeAFox";

  // Show progress indicator only when we're stepping through onboarding
  const showProgress = phase === "onboarding" && !onboardingState.isComplete;

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100dvh-72px)] flex-col bg-white md:h-[calc(100dvh-80px)]">
      {/* ── Unified Header Bar ──────────────────────────────── */}
      <div
        className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 md:px-6"
        style={{
          background: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 100%)",
          borderBottom: `1px solid ${C.brandBorder}`,
        }}
      >
        {/* LEFT — identity */}
        <div className="flex items-center gap-3 min-w-0">
          <BeaAvatar size={38} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-darkerGray">Bea AI</h2>
              <span className="relative flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-lightGray truncate">
              {headerSubtitle}
            </p>
          </div>
        </div>

        {/* RIGHT — context-dependent */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Onboarding: progress indicator */}
          <AnimatePresence mode="wait">
            {showProgress && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProgressIndicator
                  current={onboardingState.stepIdx}
                  total={onboardingState.total}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat: remaining counter */}
          {phase === "chat" && remaining !== null && remaining > 0 && (
            <div
              className="hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold sm:inline-flex"
              style={{ background: C.brandBgMed, color: C.brand }}
            >
              <MessageCircle className="h-3 w-3" />
              {remaining} übrig
            </div>
          )}

          {/* Chat: new chat button */}
          {phase === "chat" && hasMessages && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-darkerGray shadow-sm transition-all hover:border-primaryOrange/40 hover:text-primaryOrange"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Neuer Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* ── PHASE: Onboarding ───────────────────────────────── */}
      {phase === "onboarding" && (
        <div className="flex-1 overflow-y-auto">
          <OnboardingFlow
            onFinish={handleOnboardingFinish}
            onStateChange={handleOnboardingStateChange}
          />
        </div>
      )}

      {/* ── PHASE: Chat ─────────────────────────────────────── */}
      {phase === "chat" && (
        <>
          {/* Messages area */}
          <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
            {!hasMessages ? (
              <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-4 h-20 w-20">
                    <Image
                      src="/Maskottchen/Maskottchen-Beratung.webp"
                      alt="Bea bereit"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-lightGray max-w-md">
                    Ich kenne dich jetzt schon ein bisschen besser! Frag mich
                    einfach drauflos — egal ob Sparen, Investieren, Budget oder
                    was dich gerade beschäftigt.
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
                <div className="flex flex-col gap-5">
                  {messages.map((m) => (
                    <Bubble key={m.id} msg={m} />
                  ))}

                  {isStreaming &&
                    messages[messages.length - 1]?.role === "user" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2.5"
                      >
                        <BeaAvatar size={34} />
                        <div>
                          <span className="mb-1 block text-[11px] font-semibold text-primaryOrange">
                            Bea
                          </span>
                          <div
                            className="inline-flex rounded-2xl rounded-tl-md px-4 py-3"
                            style={{
                              background: C.brandBg,
                              border: `1px solid ${C.brandBorder}`,
                            }}
                          >
                            <TypingDots />
                          </div>
                        </div>
                      </motion.div>
                    )}

                  {sessionLimitReached && (
                    <SessionLimitScreen onReset={reset} />
                  )}

                  <div ref={bottomRef} />
                </div>
              </div>
            )}

            {/* Scroll-down */}
            <AnimatePresence>
              {showScroll && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  type="button"
                  onClick={scrollDown}
                  className="fixed bottom-32 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-lg transition-colors hover:border-primaryOrange/40"
                >
                  <ArrowDown className="h-4 w-4 text-darkerGray" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-red-100 bg-red-50 px-4 py-2.5 text-center text-sm text-red-600"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          {!sessionLimitReached && (
            <div className="shrink-0 border-t border-gray-100 bg-white px-4 pb-4 pt-3 md:px-6">
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-3xl items-end gap-2.5"
              >
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    placeholder="Schreib Bea eine Nachricht…"
                    disabled={isStreaming}
                    rows={1}
                    className="w-full resize-none rounded-2xl border bg-gray-50/80 px-4 py-3 pr-12 text-[15px] text-darkerGray placeholder-gray-400 outline-none transition-all duration-200 disabled:opacity-50"
                    style={{
                      maxHeight: 150,
                      borderColor: input.trim()
                        ? C.brandBorder
                        : "rgb(229 231 235)",
                    }}
                  />
                  {input.length > MAX_INPUT_LENGTH * 0.8 && (
                    <span className="absolute bottom-2 right-14 text-[10px] text-gray-400">
                      {input.length}/{MAX_INPUT_LENGTH}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
                  style={{
                    background: input.trim()
                      ? `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`
                      : "#d1d5db",
                  }}
                >
                  {isStreaming ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>

              <p className="mx-auto mt-2.5 max-w-3xl text-center text-[10px] text-gray-400">
                Bea ist eine KI-Companion und kann Fehler machen. Keine
                Finanzberatung.{" "}
                <Link
                  href="/datenschutz"
                  className="underline hover:text-primaryOrange"
                >
                  Datenschutz
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
