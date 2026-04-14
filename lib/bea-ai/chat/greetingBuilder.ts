// ─── GREETING BUILDER ─────────────────────────────────────
// Personalisierte Bea-Begrüßung nach dem Onboarding.
// Kombiniert Tageszeit + Fuchs-Typ + Zielbild + Top-Priorität
// zu einer 3-teiligen Message-Sequenz, die Bea wie eine echte
// Freundin tippt.

import type {
  UserProfile,
  OnboardingInsights,
} from "@/lib/bea-ai/onboarding";
import type { Greeting, GreetingMessage, QuickReply } from "./chatTypes";

// ─── Tageszeit-Logik ──────────────────────────────────────
type TimeOfDay = "morning" | "noon" | "evening" | "night";

function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "noon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

const TIME_GREETINGS: Record<TimeOfDay, string> = {
  morning: "Guten Morgen 🧡 schön, dass du da bist.",
  noon: "Heeey 🧡 schön, dass du da bist.",
  evening: "Hey 🧡 schön, dass du noch da bist.",
  night: "Hey 🧡 noch wach? Schön, dass du da bist.",
};

// ─── Priority-Quick-Reply Map ────────────────────────────
const PRIORITY_PROMPTS: Record<
  string,
  { label: string; prompt: string; emoji: string }
> = {
  prio_overview: {
    label: "Überblick bekommen",
    prompt:
      "Lass uns mit einem Überblick starten — wie fang ich an, meine Finanzen zu ordnen?",
    emoji: "📊",
  },
  prio_saving: {
    label: "Sparen lernen",
    prompt: "Ich will sparen lernen. Wie fang ich konkret an?",
    emoji: "💰",
  },
  prio_goal: {
    label: "Auf mein Ziel sparen",
    prompt: "Ich möchte auf mein Ziel hin sparen. Wie planen wir das?",
    emoji: "🎯",
  },
  prio_debt: {
    label: "Schulden loswerden",
    prompt: "Ich möchte meine Schulden loswerden. Wo fangen wir an?",
    emoji: "🔓",
  },
  prio_invest: {
    label: "Investieren starten",
    prompt: "Ich will anfangen zu investieren. Wo starte ich?",
    emoji: "📈",
  },
  prio_retirement: {
    label: "Altersvorsorge",
    prompt: "Wie gehe ich das Thema Altersvorsorge an?",
    emoji: "🌳",
  },
  prio_emergency: {
    label: "Notgroschen aufbauen",
    prompt: "Wie baue ich einen Notgroschen auf?",
    emoji: "🛡️",
  },
  prio_budget: {
    label: "Budget planen",
    prompt: "Wie erstelle ich ein Budget, das ich auch durchziehe?",
    emoji: "📝",
  },
};

/**
 * Builds the personalized greeting sequence for a user entering the
 * chat for the first time.
 *
 * Returns 3 messages with cumulative delays so the chat orchestrator
 * can render them sequentially with realistic typing pauses.
 */
export function buildGreeting(
  profile: UserProfile,
  insights: OnboardingInsights,
  now: Date = new Date(),
): Greeting {
  const foxLabel = insights.financialType.label;
  const foxTagline = insights.financialType.tagline;
  const zielbild = profile.zielbild?.trim();
  const topPriority = profile.prioritaeten?.[0];
  const timeOfDay = getTimeOfDay(now);

  // Message 1 — tageszeit-aware Greeting
  const line1: GreetingMessage = {
    content: TIME_GREETINGS[timeOfDay],
    delayMs: 400,
  };

  // Message 2 — Fuchs-Typ-Anerkennung
  const line2: GreetingMessage = {
    content: `Ich hab mir alles in Ruhe angeschaut — und ich muss sagen: du bist ${foxLabel.toLowerCase().replace("der ", "ein ")}. ${foxTagline}.`,
    delayMs: 1600,
  };

  // Message 3 — Zielbild / Priorität / offen
  let line3: GreetingMessage;
  if (zielbild && zielbild.length > 10) {
    line3 = {
      content: `Und dein Ziel — „${zielbild}" — das ist was, wo ich dir wirklich helfen möchte. Womit wollen wir anfangen?`,
      delayMs: 1800,
    };
  } else if (topPriority) {
    line3 = {
      content:
        "Du hast mir schon gesagt, was dir wichtig ist. Wir müssen also nicht bei Null anfangen — wo willst du einsteigen?",
      delayMs: 1800,
    };
  } else {
    line3 = {
      content:
        "Keine Sorge, wir müssen jetzt nicht direkt deep gehen. Du kannst mich alles fragen — oder wir quatschen einfach. Was sagst du?",
      delayMs: 1800,
    };
  }

  // Quick-Replies
  const quickReplies: QuickReply[] = [
    {
      id: "explain_fox",
      label: "Was heißt das genau?",
      prompt: `Kannst du mir nochmal genauer erklären, warum ich ${foxLabel} bin und was das für mich heißt?`,
      emoji: insights.financialType.icon,
    },
  ];

  if (topPriority && PRIORITY_PROMPTS[topPriority]) {
    const pri = PRIORITY_PROMPTS[topPriority];
    quickReplies.push({
      id: "top_priority",
      label: pri.label,
      prompt: pri.prompt,
      emoji: pri.emoji,
    });
  }

  quickReplies.push({
    id: "casual",
    label: "Einfach quatschen",
    prompt: "Lass uns einfach mal quatschen — erzähl mir was über dich.",
    emoji: "💬",
  });

  if (zielbild && zielbild.length > 10) {
    quickReplies.push({
      id: "goal_deep_dive",
      label: "Zu meinem Ziel",
      prompt: `Lass uns über mein Ziel sprechen: „${zielbild}". Wie realistisch ist das und was brauche ich dafür?`,
      emoji: "✨",
    });
  }

  return {
    messages: [line1, line2, line3],
    quickReplies,
  };
}

// ─── Idle / Return Variations ─────────────────────────────
// Random helpers for proactive client-side messages.

const IDLE_NUDGES: readonly string[] = [
  "Hey, noch da? 🧡",
  "Kein Stress, nimm dir Zeit.",
  "Ich bin hier, wenn du was brauchst.",
  "Denk ruhig nach, wir haben Zeit.",
] as const;

const RETURN_GREETINGS: readonly string[] = [
  "Ah, da bist du wieder! 🧡",
  "Hey, schön dass du wieder da bist.",
  "Oh, du bist zurück — perfekt.",
] as const;

export function pickIdleNudge(seed: number = Date.now()): string {
  return IDLE_NUDGES[seed % IDLE_NUDGES.length];
}

export function pickReturnGreeting(seed: number = Date.now()): string {
  return RETURN_GREETINGS[seed % RETURN_GREETINGS.length];
}
