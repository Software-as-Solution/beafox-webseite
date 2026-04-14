"use client";

// ─── WelcomeCard ──────────────────────────────────────────
// First card after the greeting sequence. Offers personalized
// quick-start buttons based on the user's onboarding profile.

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type {
  UserProfile,
  OnboardingInsights,
} from "@/lib/bea-ai/onboarding";

// STYLES
const CARD_STYLE = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #FFFAF5 100%)",
  border: "1.5px solid rgba(232,119,32,0.22)",
  boxShadow: "0 4px 16px rgba(232,119,32,0.08)",
} as const;
const BUTTON_STYLE = {
  background: "#FFFFFF",
  border: "1.5px solid rgba(232,119,32,0.25)",
  boxShadow: "0 2px 8px rgba(232,119,32,0.06)",
} as const;

interface QuickStartButton {
  id: string;
  emoji: string;
  label: string;
  prompt: string;
}

interface Props {
  userProfile: UserProfile;
  insights: OnboardingInsights;
  onQuickStart: (prompt: string) => void;
}

function buildQuickStarts(
  profile: UserProfile,
  insights: OnboardingInsights,
): QuickStartButton[] {
  const buttons: QuickStartButton[] = [];

  // 1. Fox-Typ-Erklärung (immer)
  buttons.push({
    id: "fox_explain",
    emoji: insights.financialType.icon,
    label: `Mehr zu ${insights.financialType.label}`,
    prompt: `Erklär mir nochmal was ${insights.financialType.label} bedeutet und was ich daraus mitnehmen kann.`,
  });

  // 2. Top-Priorität
  const topPrio = profile.prioritaeten?.[0];
  if (topPrio) {
    const prioMap: Record<string, { emoji: string; label: string; prompt: string }> = {
      prio_overview: { emoji: "📊", label: "Überblick", prompt: "Wie kriege ich einen Überblick über meine Finanzen?" },
      prio_saving: { emoji: "💰", label: "Sparen lernen", prompt: "Ich will sparen lernen — wie fang ich an?" },
      prio_goal: { emoji: "🎯", label: "Auf mein Ziel sparen", prompt: "Wie spare ich gezielt auf mein Ziel?" },
      prio_debt: { emoji: "🔓", label: "Schulden weg", prompt: "Wie gehe ich Schulden strategisch an?" },
      prio_invest: { emoji: "📈", label: "Investieren", prompt: "Wo fange ich beim Investieren an?" },
      prio_retirement: { emoji: "🌳", label: "Vorsorge", prompt: "Wie starte ich mit Altersvorsorge?" },
      prio_emergency: { emoji: "🛡️", label: "Notgroschen", prompt: "Wie baue ich einen Notgroschen auf?" },
      prio_budget: { emoji: "📝", label: "Budget", prompt: "Hilf mir ein Budget zu erstellen." },
    };
    const p = prioMap[topPrio];
    if (p) buttons.push({ id: `prio_${topPrio}`, ...p });
  }

  // 3. Zielbild-Deep-Dive
  const zielbild = profile.zielbild?.trim();
  if (zielbild && zielbild.length > 10) {
    buttons.push({
      id: "goal_dive",
      emoji: "✨",
      label: "Mein Ziel realistisch?",
      prompt: `Lass uns über mein Ziel sprechen: „${zielbild}". Wie realistisch ist das?`,
    });
  }

  // 4. Casual fallback
  buttons.push({
    id: "casual",
    emoji: "💬",
    label: "Einfach quatschen",
    prompt: "Lass uns einfach mal quatschen — erzähl mir was über dich.",
  });

  return buttons.slice(0, 4);
}

export default function WelcomeCard({
  userProfile,
  insights,
  onQuickStart,
}: Props) {
  const t = useTranslations("beaAi.chat.welcomeCard");
  const buttons = buildQuickStarts(userProfile, insights);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={CARD_STYLE}
      className="mx-auto w-full max-w-[85%] overflow-hidden rounded-3xl rounded-bl-md p-5 md:max-w-[68%] md:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 md:h-14 md:w-14">
          <Image
            src="/Maskottchen/Maskottchen-Welcome.webp"
            alt="Bea begrüßt dich"
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-black text-darkerGray md:text-lg">
            {t("title")}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-lightGray md:text-sm">
            {t("subtitle")}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {buttons.map((b, i) => (
          <motion.button
            key={b.id}
            type="button"
            onClick={() => onQuickStart(b.prompt)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + i * 0.06,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -2 }}
            style={BUTTON_STYLE}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold text-darkerGray transition-colors hover:border-primaryOrange hover:text-primaryOrange md:text-sm"
          >
            <span className="text-base">{b.emoji}</span>
            <span className="flex-1 truncate">{b.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
