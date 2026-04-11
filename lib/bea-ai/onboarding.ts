// ─────────────────────────────────────────────────────────────
// Bea AI — Onboarding Journey (v2)
//
// 10 Fragen, 7 verschiedene UI-Patterns.
// Jeder Step wird von einer eigenen Component mit eigenem Layout gerendert —
// diese Datei liefert nur die Daten + das finale Profil-Shape + Helpers.
// ─────────────────────────────────────────────────────────────

// ─── STEP IDENTIFIERS ──────────────────────────────────────
// These IDs are used by the flow orchestrator to pick the right component.
export type StepId =
  | "lebenssituation"
  | "alter"
  | "geldgefuehl"
  | "wissensstand"
  | "wissenstest"
  | "prioritaeten"
  | "szenario"
  | "sparverhalten"
  | "persoenlichkeit"
  | "ziel";

export const STEP_ORDER: StepId[] = [
  "lebenssituation",
  "alter",
  "geldgefuehl",
  "wissensstand",
  "wissenstest",
  "prioritaeten",
  "szenario",
  "sparverhalten",
  "persoenlichkeit",
  "ziel",
];

export const TOTAL_STEPS = STEP_ORDER.length;

// ─── STEP 1: Lebenssituation (Hero Cards) ──────────────────
export interface LifeSituationOption {
  id: string;
  label: string;
  sub: string;
  mascot: string;
}

export const LIFE_SITUATION_OPTIONS: LifeSituationOption[] = [
  {
    id: "schueler",
    label: "Schüler:in",
    sub: "Noch in der Schule",
    mascot: "/Maskottchen/Maskottchen-School.webp",
  },
  {
    id: "azubi",
    label: "Azubi",
    sub: "In der Ausbildung",
    mascot: "/Maskottchen/Maskottchen-Azubi.webp",
  },
  {
    id: "student",
    label: "Student:in",
    sub: "An der Uni oder FH",
    mascot: "/Maskottchen/Maskottchen-Hero.webp",
  },
  {
    id: "berufseinstieg",
    label: "Berufseinstieg",
    sub: "Gerade erst angefangen",
    mascot: "/Maskottchen/Maskottchen-Business.webp",
  },
  {
    id: "berufstaetig",
    label: "Berufstätig",
    sub: "Schon länger im Job",
    mascot: "/Maskottchen/Maskottchen-Freude.webp",
  },
];

// ─── STEP 2: Age Slider Config ─────────────────────────────
export const AGE_MIN = 14;
export const AGE_MAX = 35;
export const AGE_DEFAULT = 22;

/** Pick a mascot that matches the dragged age. */
export function getMascotForAge(age: number): {
  src: string;
  mood: string;
} {
  if (age <= 17)
    return {
      src: "/Maskottchen/Maskottchen-School.webp",
      mood: "Schulzeit",
    };
  if (age <= 20)
    return {
      src: "/Maskottchen/Maskottchen-Azubi.webp",
      mood: "Erste eigene Schritte",
    };
  if (age <= 25)
    return {
      src: "/Maskottchen/Maskottchen-Hero.webp",
      mood: "Finde deinen Weg",
    };
  if (age <= 30)
    return {
      src: "/Maskottchen/Maskottchen-Business.webp",
      mood: "Durchstarten",
    };
  return {
    src: "/Maskottchen/Maskottchen-Freude.webp",
    mood: "Erfahrung zahlt sich aus",
  };
}

// ─── STEP 3: Geldgefühl (Split Screen) ─────────────────────
export interface MoneyFeelingOption {
  id: "freiheit" | "stress";
  label: string;
  description: string;
  emoji: string;
  mascot: string;
  gradient: string;
}

export const MONEY_FEELING_OPTIONS: [MoneyFeelingOption, MoneyFeelingOption] = [
  {
    id: "freiheit",
    label: "Freiheit",
    description: "Geld ist ein Werkzeug für Möglichkeiten",
    emoji: "🦅",
    mascot: "/Maskottchen/Maskottchen-Freude.webp",
    gradient: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 50%, #FED4B0 100%)",
  },
  {
    id: "stress",
    label: "Stress",
    description: "Geld macht mir Sorgen, es reicht nie",
    emoji: "😰",
    mascot: "/Maskottchen/Maskottchen-Weinen.webp",
    gradient: "linear-gradient(135deg, #F5F5F5 0%, #EDE5DC 50%, #E5D5C3 100%)",
  },
];

// ─── STEP 4: Wissensstand Self-Rating (1–10) ───────────────
export interface KnowledgeLevelMessage {
  min: number;
  max: number;
  title: string;
  message: string;
  mascot: string;
}

export const KNOWLEDGE_LEVEL_MESSAGES: KnowledgeLevelMessage[] = [
  {
    min: 1,
    max: 2,
    title: "Totaler Anfänger",
    message: "Perfekt — wir starten bei null und bauen alles systematisch auf.",
    mascot: "/Maskottchen/Maskottchen-Unklar.webp",
  },
  {
    min: 3,
    max: 4,
    title: "Erste Schritte",
    message: "Du hast schon mal reingeschaut. Ich zeige dir das große Bild.",
    mascot: "/Maskottchen/Maskottchen-Beratung.webp",
  },
  {
    min: 5,
    max: 6,
    title: "Solide Basics",
    message: "Du kennst die Basics. Zeit für die nächste Stufe.",
    mascot: "/Maskottchen/Maskottchen-Hero.webp",
  },
  {
    min: 7,
    max: 8,
    title: "Ziemlich fit",
    message: "Respekt — du weißt schon eine Menge. Wir gehen in die Tiefe.",
    mascot: "/Maskottchen/Maskottchen-Azubi.webp",
  },
  {
    min: 9,
    max: 10,
    title: "Finanz-Nerd",
    message:
      "Okay, du brauchst keine Grundlagen mehr. Lass uns tiefer tauchen.",
    mascot: "/Maskottchen/Maskottchen-Business.webp",
  },
];

export function getKnowledgeLevelMessage(level: number): KnowledgeLevelMessage {
  return (
    KNOWLEDGE_LEVEL_MESSAGES.find((m) => level >= m.min && level <= m.max) ??
    KNOWLEDGE_LEVEL_MESSAGES[0]
  );
}

// ─── STEP 5: Wissenstest (Quiz) ────────────────────────────
export interface QuizAnswer {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

export interface QuizQuestion {
  question: string;
  answers: QuizAnswer[];
}

export const KNOWLEDGE_QUIZ: QuizQuestion = {
  question: "Was ist ein ETF?",
  answers: [
    {
      id: "a",
      text: "Eine spezielle Spar-App auf dem Handy",
      correct: false,
      feedback:
        "Verständlich gedacht, aber nein. ETFs sind ein Finanzprodukt — keine App.",
    },
    {
      id: "b",
      text: "Ein Korb mit vielen Aktien, den du auf einmal kaufen kannst",
      correct: true,
      feedback:
        "Exakt! ETFs bündeln viele Aktien in einem Produkt. Eine der wichtigsten Erfindungen fürs langfristige Investieren.",
    },
    {
      id: "c",
      text: "Eine Form von Kryptowährung",
      correct: false,
      feedback:
        "Nope — aber gute Gelegenheit das aufzuklären. ETFs sind klassische Wertpapiere, keine Kryptos.",
    },
    {
      id: "d",
      text: "Keine Ahnung, noch nie gehört",
      correct: false,
      feedback:
        "Ehrlich und völlig okay. Wir werden das zusammen anschauen — ETFs sind wichtig aber nicht kompliziert.",
    },
  ],
};

// ─── STEP 6: Prioritäten Ranking ───────────────────────────
export interface PriorityOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    id: "sparen",
    label: "Sparen lernen",
    description: "Am Ende vom Monat soll was übrig bleiben",
    icon: "🐷",
  },
  {
    id: "ueberblick",
    label: "Überblick bekommen",
    description: "Wissen wohin mein Geld wirklich fließt",
    icon: "🗺️",
  },
  {
    id: "investieren",
    label: "Investieren starten",
    description: "Mein Geld langfristig wachsen lassen",
    icon: "📈",
  },
  {
    id: "schulden",
    label: "Schulden loswerden",
    description: "Raus aus Dispo, Ratenkäufen oder BAföG-Rückzahlung",
    icon: "🔓",
  },
  {
    id: "steuern",
    label: "Steuern & Anträge verstehen",
    description: "Steuererklärung, Wohngeld, KV-Beiträge",
    icon: "📋",
  },
];

export const PRIORITY_RANK_COUNT = 3;

// ─── STEP 7: Szenario ──────────────────────────────────────
export interface ScenarioOption {
  id: string;
  label: string;
  description: string;
  beaReaction: string;
  insight: string;
}

export const SCENARIO_SETUP =
  "Stell dir vor: Du bekommst überraschend 500 € Steuerrückerstattung aufs Konto. Was machst du als Erstes?";

export const SCENARIO_OPTIONS: ScenarioOption[] = [
  {
    id: "spend",
    label: "Direkt was Schönes gönnen",
    description: "Neue Sneakers, Restaurant, Konzertticket",
    beaReaction:
      "Verständlich — du hast hart gearbeitet. Wir schauen zusammen wie du das mit Sparen in Balance bringst.",
    insight: "spending-first",
  },
  {
    id: "save",
    label: "Komplett aufs Sparkonto",
    description: "Sicher ist sicher, weg damit",
    beaReaction:
      "Du bist vorsichtig — gut. Aber Sparkonto ist bei heutigen Zinsen nur die halbe Miete. Darüber reden wir.",
    insight: "safety-first",
  },
  {
    id: "split",
    label: "Aufteilen: Was gönnen, Rest sparen",
    description: "50/50 oder ähnlich",
    beaReaction:
      "Klassischer Balance-Move — du hast Disziplin und gönnst dir was. Solide Ausgangslage.",
    insight: "balanced",
  },
  {
    id: "invest",
    label: "Direkt investieren",
    description: "ETF-Sparplan oder Aktie kaufen",
    beaReaction:
      "Mutig und vorausschauend. Du denkst langfristig — das zahlt sich aus.",
    insight: "growth-oriented",
  },
];

// ─── STEP 8: Sparverhalten (Circular Percentage) ───────────
export interface SavingLevelMessage {
  min: number;
  max: number;
  title: string;
  message: string;
  mascot: string;
}

export const SAVING_LEVEL_MESSAGES: SavingLevelMessage[] = [
  {
    min: 0,
    max: 0,
    title: "Noch gar nicht",
    message:
      "Okay, Startpunkt null. Ich zeige dir wie du die ersten 5% raushaust.",
    mascot: "/Maskottchen/Maskottchen-Unklar.webp",
  },
  {
    min: 1,
    max: 9,
    title: "Kleine Schritte",
    message:
      "Du legst schon was weg — besser als die meisten! Wir steigern das schrittweise.",
    mascot: "/Maskottchen/Maskottchen-Beratung.webp",
  },
  {
    min: 10,
    max: 19,
    title: "Solides Niveau",
    message: "10% ist die klassische Empfehlung — du machst einen guten Job.",
    mascot: "/Maskottchen/Maskottchen-Hero.webp",
  },
  {
    min: 20,
    max: 100,
    title: "Über-Performer",
    message:
      "Wow, 20%+ ist richtig stark. Jetzt geht's um intelligentes Investieren statt nur sparen.",
    mascot: "/Maskottchen/Maskottchen-Freude.webp",
  },
];

export function getSavingLevelMessage(percent: number): SavingLevelMessage {
  return (
    SAVING_LEVEL_MESSAGES.find((m) => percent >= m.min && percent <= m.max) ??
    SAVING_LEVEL_MESSAGES[0]
  );
}

// ─── STEP 9: Persönlichkeit (Swipe Statements) ─────────────
export interface SwipeStatement {
  id: string;
  statement: string;
  positiveLabel: string;
  negativeLabel: string;
  mascot: string;
}

export const PERSONALITY_STATEMENTS: SwipeStatement[] = [
  {
    id: "checkt-konto",
    statement: "Ich checke meinen Kontostand mindestens einmal pro Woche.",
    positiveLabel: "Ja, mache ich",
    negativeLabel: "Eher selten",
    mascot: "/Maskottchen/Maskottchen-Beratung.webp",
  },
  {
    id: "dauerauftrag",
    statement: "Ich habe einen Dauerauftrag der automatisch Geld wegspart.",
    positiveLabel: "Ja, läuft",
    negativeLabel: "Nein, noch nicht",
    mascot: "/Maskottchen/Maskottchen-Hero.webp",
  },
  {
    id: "weiss-ausgaben",
    statement:
      "Ich weiß ungefähr wie viel ich im letzten Monat ausgegeben habe.",
    positiveLabel: "Klar weiß ich",
    negativeLabel: "Keine Ahnung",
    mascot: "/Maskottchen/Maskottchen-Beratung.webp",
  },
  {
    id: "hat-investiert",
    statement: "Ich habe schon mal eine Aktie oder einen ETF gekauft.",
    positiveLabel: "Ja, habe ich",
    negativeLabel: "Nein, nie",
    mascot: "/Maskottchen/Maskottchen-Business.webp",
  },
  {
    id: "notgroschen",
    statement:
      "Ich habe einen finanziellen Notgroschen für plötzliche Notfälle.",
    positiveLabel: "Ja, ein Polster",
    negativeLabel: "Nicht wirklich",
    mascot: "/Maskottchen/Maskottchen-Hero.webp",
  },
];

// ─── STEP 10: Ziel (Free Text) ─────────────────────────────
export const GOAL_PLACEHOLDERS: readonly string[] = [
  "Endlich jeden Monat 200 € wegsparen...",
  "Meine Steuererklärung selbst machen...",
  "Einen echten Überblick über meine Ausgaben bekommen...",
  "Den ersten ETF-Sparplan einrichten...",
  "Raus aus dem Dispo kommen...",
  "Für die erste eigene Wohnung sparen...",
];

export const GOAL_MAX_LENGTH = 280;

// ─── PROFILE SHAPE ─────────────────────────────────────────
export interface UserProfile {
  // Step 1–2: Who
  lebenssituation: string;
  alter: number;

  // Step 3: How they feel
  geldgefuehl: "freiheit" | "stress";

  // Step 4–5: What they know
  wissensstand: number; // 1–10 self-rating
  wissenstest: {
    answerId: string;
    correct: boolean;
  };

  // Step 6: Priorities (top 3 ranked)
  prioritaeten: string[];

  // Step 7: Scenario bias
  szenarioInsight: string;

  // Step 8: Saving percentage
  sparverhaltenProzent: number;

  // Step 9: Personality (statement id → agreed/disagreed)
  persoenlichkeit: Record<string, boolean>;

  // Step 10: Free goal
  ziel: string;
}

/** Empty profile used as initial state. */
export function emptyProfile(): UserProfile {
  return {
    lebenssituation: "",
    alter: AGE_DEFAULT,
    geldgefuehl: "freiheit",
    wissensstand: 5,
    wissenstest: { answerId: "", correct: false },
    prioritaeten: [],
    szenarioInsight: "",
    sparverhaltenProzent: 0,
    persoenlichkeit: {},
    ziel: "",
  };
}

// ─── COMPLETION MESSAGE ────────────────────────────────────
const LS_MAP: Record<string, string> = {
  schueler: "als Schüler:in",
  azubi: "als Azubi",
  student: "als Student:in",
  berufseinstieg: "beim Berufseinstieg",
  berufstaetig: "mitten im Berufsleben",
};

const GEFUEHL_MAP: Record<string, string> = {
  freiheit:
    "Du siehst Geld als Werkzeug für Freiheit — perfekte Grundhaltung, darauf bauen wir auf.",
  stress:
    "Ich merke, dass Geld dich eher stresst. No worries — genau da setzen wir an, Schritt für Schritt.",
};

export function getOnboardingComplete(profile: UserProfile): string {
  const ls = LS_MAP[profile.lebenssituation] ?? "";
  const gefuehl = GEFUEHL_MAP[profile.geldgefuehl] ?? "";
  const topPrio = profile.prioritaeten[0] ?? "";
  const prioLabel =
    PRIORITY_OPTIONS.find((p) => p.id === topPrio)?.label.toLowerCase() ?? "";

  return `Okay, ich hab dich! 🎯

Du bist ${profile.alter} ${ls}, und deine Top-Priorität ist ${prioLabel}. ${gefuehl}

Ab jetzt sind meine Antworten auf dich zugeschnitten. Kein generisches Finanz-Blabla — sondern das, was für dich gerade wirklich zählt.`;
}

// ─── SYSTEM PROMPT ENHANCEMENT ─────────────────────────────
export function buildProfileContext(profile: UserProfile): string {
  const lines: string[] = ["\n## Nutzerprofil (aus dem Onboarding)", ""];

  const situation = LIFE_SITUATION_OPTIONS.find(
    (o) => o.id === profile.lebenssituation,
  );
  if (situation) {
    lines.push(`- **Lebenssituation**: ${situation.label} (${situation.sub})`);
  }

  lines.push(`- **Alter**: ${profile.alter} Jahre`);
  lines.push(
    `- **Einstellung zu Geld**: ${
      profile.geldgefuehl === "freiheit"
        ? "Sieht Geld als Freiheit/Werkzeug"
        : "Hat Stress mit dem Thema Geld"
    }`,
  );
  lines.push(`- **Selbsteinschätzung Wissen**: ${profile.wissensstand}/10`);
  lines.push(
    `- **Wissenstest ETF**: ${
      profile.wissenstest.correct ? "korrekt beantwortet" : "noch nicht sicher"
    }`,
  );

  if (profile.prioritaeten.length) {
    const prioLabels = profile.prioritaeten
      .map((id) => PRIORITY_OPTIONS.find((p) => p.id === id)?.label ?? id)
      .join(" → ");
    lines.push(`- **Top-Prioritäten**: ${prioLabels}`);
  }

  if (profile.szenarioInsight) {
    lines.push(`- **Finanz-Bias**: ${profile.szenarioInsight}`);
  }

  lines.push(`- **Sparrate**: ${profile.sparverhaltenProzent}% vom Einkommen`);

  const pTrue = Object.entries(profile.persoenlichkeit)
    .filter(([, v]) => v)
    .map(([k]) => k);
  if (pTrue.length) {
    lines.push(`- **Bereits etablierte Gewohnheiten**: ${pTrue.join(", ")}`);
  }

  if (profile.ziel.trim()) {
    lines.push(`- **Selbstformuliertes Ziel**: "${profile.ziel.trim()}"`);
  }

  lines.push("");
  lines.push(
    "Passe deine Antworten an dieses Profil an. Nutze Beispiele und Sprache, die zu dieser Lebenssituation passen. Wenn jemand Schüler:in ist, rede nicht über Gehaltsverhandlungen. Wenn jemand bei Finanzen Stress empfindet, sei besonders einfühlsam und ermutigend. Wenn das Wissen niedrig ist, erkläre Grundbegriffe. Wenn das Wissen hoch ist, gehe direkt in die Tiefe.",
  );

  return lines.join("\n");
}
