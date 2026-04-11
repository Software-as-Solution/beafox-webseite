"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  type UserProfile,
  LIFE_SITUATION_OPTIONS,
  PRIORITY_OPTIONS,
  getOnboardingComplete,
} from "@/lib/bea-ai/onboarding";

interface OnboardingCompleteProps {
  profile: UserProfile;
  onStartChat: () => void;
}

const LOADING_MESSAGES = [
  "Ich verarbeite was du mir erzählt hast...",
  "Ich analysiere deine Situation...",
  "Ich sortiere deine Prioritäten...",
  "Jetzt weiß ich wer du bist.",
] as const;

const MESSAGE_INTERVAL = 900;
const REVEAL_DELAY = LOADING_MESSAGES.length * MESSAGE_INTERVAL + 400;

/**
 * ONBOARDING COMPLETE
 *
 * Two-phase reveal:
 * 1. Loading phase (~4s): Bea "processes" the profile with rotating messages
 * 2. Reveal phase: Profile summary card appears with all collected insights
 */
export default function OnboardingComplete({
  profile,
  onStartChat,
}: OnboardingCompleteProps) {
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");
  const [loadingIdx, setLoadingIdx] = useState(0);

  // Cycle loading messages
  useEffect(() => {
    if (phase !== "loading") return;
    const interval = setInterval(() => {
      setLoadingIdx((prev) => {
        if (prev < LOADING_MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, MESSAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [phase]);

  // Switch to reveal phase after all messages played
  useEffect(() => {
    const timer = setTimeout(() => setPhase("reveal"), REVEAL_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Derived profile values for display
  const situation = LIFE_SITUATION_OPTIONS.find(
    (o) => o.id === profile.lebenssituation,
  );
  const topPriorities = profile.prioritaeten
    .map((id) => PRIORITY_OPTIONS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="relative flex min-h-full w-full flex-col items-center justify-center px-4 md:px-8 py-12">
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <LoadingPhase key="loading" messageIdx={loadingIdx} />
        )}
        {phase === "reveal" && (
          <RevealPhase
            key="reveal"
            profile={profile}
            situation={situation}
            topPriorities={topPriorities}
            onStartChat={onStartChat}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LOADING PHASE ─────────────────────────────────────────
function LoadingPhase({ messageIdx }: { messageIdx: number }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center max-w-lg"
    >
      {/* Pulsing Bea with glow */}
      <div className="relative">
        {/* Outer pulsing glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,32,0.4) 0%, transparent 70%)",
          }}
        />

        {/* Mascot */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-40 h-40 md:w-52 md:h-52"
        >
          <Image
            src="/Maskottchen/Maskottchen-Beratung.webp"
            alt="Bea denkt nach"
            fill
            priority
            sizes="208px"
            className="object-contain"
            style={{
              filter: "drop-shadow(0 16px 40px rgba(232,119,32,0.3))",
            }}
          />
        </motion.div>
      </div>

      {/* Thinking dots */}
      <div className="mt-6 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            className="w-2.5 h-2.5 rounded-full bg-primaryOrange"
            style={{
              boxShadow: "0 0 12px rgba(232,119,32,0.6)",
            }}
          />
        ))}
      </div>

      {/* Rotating messages */}
      <div className="mt-8 min-h-[60px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-darkerGray font-medium max-w-md"
          >
            {LOADING_MESSAGES[messageIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── REVEAL PHASE ──────────────────────────────────────────
interface RevealPhaseProps {
  profile: UserProfile;
  situation: (typeof LIFE_SITUATION_OPTIONS)[number] | undefined;
  topPriorities: (typeof PRIORITY_OPTIONS)[number][];
  onStartChat: () => void;
}

function RevealPhase({
  profile,
  situation,
  topPriorities,
  onStartChat,
}: RevealPhaseProps) {
  const completionMessage = getOnboardingComplete(profile);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center max-w-3xl w-full"
    >
      {/* Celebration mascot */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.7,
          type: "spring",
          stiffness: 180,
          damping: 14,
        }}
        className="relative"
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-[85%] h-[85%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(232,119,32,0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative w-44 h-44 md:w-56 md:h-56">
          <Image
            src="/Maskottchen/Maskottchen-Freude.webp"
            alt="Bea freut sich"
            fill
            priority
            sizes="224px"
            className="object-contain"
            style={{
              filter: "drop-shadow(0 20px 48px rgba(232,119,32,0.3))",
            }}
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-primaryOrange/20 px-3 py-1 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primaryOrange animate-pulse" />
          <span className="text-[10px] md:text-[11px] font-bold text-primaryOrange uppercase tracking-widest">
            Profil erstellt
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-darkerGray leading-tight tracking-tight">
          Jetzt kenne ich <span className="text-primaryOrange">dich</span>
        </h2>
      </motion.div>

      {/* Profile summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8 w-full rounded-3xl p-6 md:p-8"
        style={{
          background:
            "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 50%, #FFEEDB 100%)",
          border: "2px solid rgba(232,119,32,0.2)",
          boxShadow: "0 24px 60px rgba(232,119,32,0.15)",
        }}
      >
        {/* Completion message */}
        <div className="mb-6 pb-6 border-b border-primaryOrange/15">
          <p className="text-sm md:text-base text-darkerGray leading-relaxed whitespace-pre-line">
            {completionMessage}
          </p>
        </div>

        {/* Profile insights grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProfileStat
            label="Situation"
            value={situation?.label ?? "–"}
            delay={0.9}
          />
          <ProfileStat label="Alter" value={`${profile.alter}`} delay={1.0} />
          <ProfileStat
            label="Wissen"
            value={`${profile.wissensstand}/10`}
            delay={1.1}
          />
          <ProfileStat
            label="Sparrate"
            value={`${profile.sparverhaltenProzent}%`}
            delay={1.2}
          />
        </div>

        {/* Top priorities */}
        {topPriorities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="mt-6 pt-6 border-t border-primaryOrange/15"
          >
            <div className="text-[10px] font-bold text-primaryOrange uppercase tracking-widest mb-3">
              Deine Top-Prioritäten
            </div>
            <div className="flex flex-wrap gap-2">
              {topPriorities.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 1.4 + idx * 0.08,
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
                    border: "1px solid rgba(232,119,32,0.25)",
                    color: "#161616",
                  }}
                >
                  <span className="text-base">{p.icon}</span>
                  <span>
                    {idx + 1}. {p.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Start chat CTA */}
      <motion.button
        type="button"
        onClick={onStartChat}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 inline-flex items-center gap-2 rounded-full px-8 md:px-10 py-4 md:py-5 text-white font-black text-base md:text-lg"
        style={{
          background: "linear-gradient(135deg, #E87720 0%, #F08A3C 100%)",
          boxShadow: "0 16px 40px rgba(232,119,32,0.4)",
        }}
      >
        Jetzt mit mir chatten
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
}

// ─── Profile stat cell ─────────────────────────────────────
function ProfileStat({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-2xl p-3 md:p-4 text-center"
      style={{
        background: "rgba(255,255,255,0.6)",
        border: "1px solid rgba(232,119,32,0.12)",
      }}
    >
      <div className="text-[9px] md:text-[10px] font-bold text-primaryOrange uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="text-sm md:text-base font-black text-darkerGray leading-tight">
        {value}
      </div>
    </motion.div>
  );
}
