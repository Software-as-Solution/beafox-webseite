// ─────────────────────────────────────────────────────────────
// Bea AI — Onboarding Journey (v3)
//
// 12 Fragen, 9 verschiedene UI-Patterns.
// Jeder Step wird von einer eigenen Component mit eigenem Layout gerendert —
// diese Datei liefert nur die Daten + das finale Profil-Shape + Helpers
// + die Insights Engine für die Auswertung am Ende.
// ─────────────────────────────────────────────────────────────

// STEP IDENTIFIERS
export type StepId =
  | "lebenssituation"
  | "alter"
  | "wohnsituation"
  | "einkommen"
  | "schulden"
  | "zeithorizont"
  | "prioritaeten"
  | "wissenstest"
  | "szenario"
  | "persoenlichkeit"
  | "geldgefuehl"
  | "zielbild";

export const STEP_ORDER: StepId[] = [
  "lebenssituation",
  "alter",
  "wohnsituation",
  "einkommen",
  "schulden",
  "zeithorizont",
  "prioritaeten",
  "wissenstest",
  "szenario",
  "persoenlichkeit",
  "geldgefuehl",
  "zielbild",
];
export const TOTAL_STEPS = STEP_ORDER.length;

// STEP 1: LEBENSSITUATION -----------------------------------------------------------------------------------------------
export interface LifeSituationOption {
  id: string;
  sub: string;
  label: string;
  mascot: string;
}
export const LIFE_SITUATION_OPTIONS: LifeSituationOption[] = [
  {
    id: "schueler",
    label: "Schüler:in",
    sub: "Noch in der Schule",
    mascot: "/Maskottchen/Maskottchen-Freude.webp",
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
    mascot: "/Maskottchen/Maskottchen-Studenten.webp",
  },
  {
    id: "berufseinstieg",
    label: "Berufseinstieg",
    sub: "Frisch eingestiegen",
    mascot: "/Maskottchen/Maskottchen-Berufseinsteiger.webp",
  },
  {
    id: "berufstaetig",
    label: "Berufstätig",
    sub: "Schon länger im Job",
    mascot: "/Maskottchen/Maskottchen-Loesung.webp",
  },
];

// STEP 2: ALTER --------------------------------------------------------------------------------------------------------
export const AGE_MIN = 14;
export const AGE_MAX = 35;
export const AGE_DEFAULT = 22;
export interface AgeMascot {
  src: string;
  mood: string;
  hint?: string;
}
const AGE_MASCOT_RANGES: ReadonlyArray<{
  minAge: number;
  mascot: AgeMascot;
}> = [
  {
    minAge: 32,
    mascot: {
      src: "/Maskottchen/Maskottchen-Berufseinsteiger.webp",
      mood: "Mittendrin im Leben",
      hint: "größere Entscheidungen, stabile Basis",
    },
  },
  {
    minAge: 28,
    mascot: {
      src: "/Maskottchen/Maskottchen-Loesung.webp",
      mood: "Alles wird konkreter",
      hint: "Karriere läuft, Zukunft plant sich",
    },
  },
  {
    minAge: 24,
    mascot: {
      src: "/Maskottchen/Maskottchen-Begleitung.webp",
      mood: "Deine eigene Richtung",
      hint: "Miete, Job, eigene Entscheidungen",
    },
  },
  {
    minAge: 20,
    mascot: {
      src: "/Maskottchen/Maskottchen-Azubi.webp",
      mood: "Zwischen Plan und Plan B",
      hint: "Uni, Ausbildung oder Berufsstart",
    },
  },
  {
    minAge: 17,
    mascot: {
      src: "/Maskottchen/Maskottchen-Freude.webp",
      mood: "Erstes eigenes Geld",
      hint: "Nebenjob, Ausbildung, erste Freiheiten",
    },
  },
  {
    minAge: AGE_MIN,
    mascot: {
      src: "/Maskottchen/Maskottchen-Schueler.png",
      mood: "Der Anfang zählt",
      hint: "früh starten ist dein größter Vorteil",
    },
  },
] as const;
export function getMascotForAge(age: number): AgeMascot {
  const clamped = Math.max(AGE_MIN, Math.min(AGE_MAX, age));
  const match = AGE_MASCOT_RANGES.find(({ minAge }) => clamped >= minAge);
  return (match ?? AGE_MASCOT_RANGES[AGE_MASCOT_RANGES.length - 1]).mascot;
}

// STEP 3: WOHNSITUATION --------------------------------------------------------------------------------------------------
export type HousingCostImpact =
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "variable";

export interface WohnsituationOption {
  id: string;
  icon: string;
  label: string;
  description: string;
  costImpact: HousingCostImpact;
  approxRentEur: { min: number; max: number } | null;
}
export const WOHNSITUATION_OPTIONS: readonly WohnsituationOption[] = [
  {
    id: "housing_parents",
    label: "Bei den Eltern",
    description: "Noch zuhause, evtl. kleiner Beitrag zum Haushalt",
    icon: "🏠",
    costImpact: "minimal",
    approxRentEur: { min: 0, max: 200 },
  },
  {
    id: "housing_dorm",
    label: "Wohnheim",
    description: "Studenten-, Azubi- oder Internats-Wohnheim",
    icon: "🏢",
    costImpact: "low",
    approxRentEur: { min: 200, max: 450 },
  },
  {
    id: "housing_shared",
    label: "WG",
    description: "Wohngemeinschaft mit geteilten Kosten",
    icon: "👥",
    costImpact: "medium",
    approxRentEur: { min: 300, max: 600 },
  },
  {
    id: "housing_partner",
    label: "Mit Partner:in",
    description: "Zusammen wohnend, Kosten geteilt",
    icon: "💑",
    costImpact: "medium",
    approxRentEur: { min: 400, max: 700 },
  },
  {
    id: "housing_alone",
    label: "Eigene Wohnung",
    description: "Alleine zur Miete, volle Fixkosten",
    icon: "🔑",
    costImpact: "high",
    approxRentEur: { min: 600, max: 1200 },
  },
  {
    id: "housing_owned_loan",
    label: "Eigentum mit Kredit",
    description: "Eigene Immobilie, läuft noch ein Darlehen",
    icon: "🏡",
    costImpact: "variable",
    approxRentEur: null,
  },
  {
    id: "housing_owned_paid",
    label: "Eigentum abbezahlt",
    description: "Eigene Immobilie ohne laufenden Kredit",
    icon: "🏡",
    costImpact: "low",
    approxRentEur: { min: 150, max: 400 },
  },
  {
    id: "housing_temporary",
    label: "Übergangslösung",
    description: "Vorübergehend bei Freunden, in Bewegung",
    icon: "🎒",
    costImpact: "variable",
    approxRentEur: null,
  },
] as const;
export function getWohnsituationOption(id: string): WohnsituationOption | null {
  return WOHNSITUATION_OPTIONS.find((opt) => opt.id === id) ?? null;
}
export function getApproxRent(id: string): number | null {
  const opt = getWohnsituationOption(id);
  if (!opt || !opt.approxRentEur) return null;
  return Math.round((opt.approxRentEur.min + opt.approxRentEur.max) / 2);
}

// STEP 4: EINKOMMEN ------------------------------------------------------------------------------------------------------
export interface EinkommensOption {
  id: string;
  label: string;
  description: string;
  minEur: number | null;
  maxEur: number | null;
  midpointEur: number | null;
}
export const EINKOMMENS_OPTIONS: readonly EinkommensOption[] = [
  {
    id: "income_none",
    label: "Kein Einkommen",
    description: "Aktuell keine eigene Einkommensquelle",
    minEur: 0,
    maxEur: 0,
    midpointEur: 0,
  },
  {
    id: "income_0_500",
    label: "Bis 500 €",
    description: "Taschengeld, Minijob, kleiner Nebenjob",
    minEur: 0,
    maxEur: 500,
    midpointEur: 250,
  },
  {
    id: "income_500_1000",
    label: "500 bis 1.000 €",
    description: "Werkstudent, frühe Ausbildung, Teilzeit-Schüler",
    minEur: 500,
    maxEur: 1000,
    midpointEur: 750,
  },
  {
    id: "income_1000_1500",
    label: "1.000 bis 1.500 €",
    description: "Azubi-Gehalt, Teilzeit, BAföG-Höchstsatz",
    minEur: 1000,
    maxEur: 1500,
    midpointEur: 1250,
  },
  {
    id: "income_1500_2500",
    label: "1.500 bis 2.500 €",
    description: "Einstiegsgehalt nach Ausbildung oder Studium",
    minEur: 1500,
    maxEur: 2500,
    midpointEur: 2000,
  },
  {
    id: "income_2500_3500",
    label: "2.500 bis 3.500 €",
    description: "Erste Berufsjahre, solides Vollzeit-Gehalt",
    minEur: 2500,
    maxEur: 3500,
    midpointEur: 3000,
  },
  {
    id: "income_3500_plus",
    label: "3.500 € und mehr",
    description: "Erfahrene Fachkraft, Spezialist:in, Führungsrolle",
    minEur: 3500,
    maxEur: null,
    midpointEur: 4500,
  },
  {
    id: "income_skip",
    label: "Möchte ich nicht angeben",
    description: "Kein Problem, wir kommen auch so klar",
    minEur: null,
    maxEur: null,
    midpointEur: null,
  },
] as const;
export function getEinkommensOption(id: string): EinkommensOption | null {
  return EINKOMMENS_OPTIONS.find((opt) => opt.id === id) ?? null;
}
export function hasUsableIncome(id: string): boolean {
  const opt = getEinkommensOption(id);
  return opt !== null && opt.midpointEur !== null && opt.midpointEur > 0;
}

// STEP 5: SCHULDEN -------------------------------------------------------------------------------------------------------
export type DebtSeverity = "none" | "manageable" | "significant";
export interface SchuldenOption {
  id: string;
  label: string;
  emoji: string;
  mascot: string;
  gradient: string;
  description: string;
  severity: DebtSeverity;
  blocksInvesting: boolean;
}
export const SCHULDEN_OPTIONS: readonly SchuldenOption[] = [
  {
    id: "debt_none",
    label: "Alles im grünen Bereich",
    description: "Keine Schulden, kein Dispo, nichts offen",
    emoji: "🌱",
    mascot: "/Maskottchen/Maskottchen-Freude.webp",
    gradient: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)",
    severity: "none",
    blocksInvesting: false,
  },
  {
    id: "debt_manageable",
    label: "Kleinere Sache",
    description: "Dispo, Ratenkauf oder Kleinkredit",
    emoji: "📋",
    mascot: "/Maskottchen/Maskottchen-Unklar.png",
    gradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)",
    severity: "manageable",
    blocksInvesting: false,
  },
  {
    id: "debt_significant",
    label: "Größere Sache",
    description: "Höhere Schulden, die mich beschäftigen",
    emoji: "🤝",
    mascot: "/Maskottchen/Maskottchen-Weinen.webp",
    gradient: "linear-gradient(135deg, #FFF8F3 0%, #FFEEDB 50%, #FED4B0 100%)",
    severity: "significant",
    blocksInvesting: true,
  },
] as const;
export function getSchuldenOption(id: string): SchuldenOption | null {
  return SCHULDEN_OPTIONS.find((opt) => opt.id === id) ?? null;
}
export function shouldPrioritizeDebtPayoff(id: string): boolean {
  const opt = getSchuldenOption(id);
  return opt?.blocksInvesting ?? false;
}

// STEP 6: ZEITHORIZONT ----------------------------------------------------------------------------------------------------
export type HorizonClass = "urgent" | "short" | "medium" | "long";

export interface ZeithorizontOption {
  id: string;
  icon: string;
  label: string;
  description: string;
  horizonClass: HorizonClass;
  rangeMonths: { min: number; max: number | null };
}
export const ZEITHORIZONT_OPTIONS: readonly ZeithorizontOption[] = [
  {
    id: "horizon_now",
    label: "Jetzt sofort",
    description: "Ich muss diesen Monat etwas ändern",
    icon: "⚡",
    horizonClass: "urgent",
    rangeMonths: { min: 0, max: 3 },
  },
  {
    id: "horizon_short",
    label: "Dieses Jahr",
    description: "In den nächsten 3 – 12 Monaten",
    icon: "📅",
    horizonClass: "short",
    rangeMonths: { min: 3, max: 12 },
  },
  {
    id: "horizon_medium",
    label: "Mittelfristig",
    description: "1 – 5 Jahre, konkrete Ziele im Blick",
    icon: "🎯",
    horizonClass: "medium",
    rangeMonths: { min: 12, max: 60 },
  },
  {
    id: "horizon_long",
    label: "Langfristig",
    description: "5+ Jahre, ich baue auf",
    icon: "🚀",
    horizonClass: "long",
    rangeMonths: { min: 60, max: null },
  },
] as const;
export function getZeithorizontOption(id: string): ZeithorizontOption | null {
  return ZEITHORIZONT_OPTIONS.find((opt) => opt.id === id) ?? null;
}
export function isInvestmentHorizon(id: string): boolean {
  const opt = getZeithorizontOption(id);
  return opt?.horizonClass === "long";
}

// STEP 7: PRIORITÄTEN -----------------------------------------------------------------------------------------------------
export type PriorityCategory =
  | "overview"
  | "saving"
  | "saving_goal"
  | "debt"
  | "investing"
  | "retirement"
  | "insurance"
  | "taxes"
  | "side_income"
  | "banking";
export interface PriorityOption {
  id: string;
  icon: string;
  label: string;
  description: string;
  category: PriorityCategory;
}
export const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  {
    id: "priority_overview",
    label: "Überblick bekommen",
    description: "Wissen, wohin mein Geld wirklich fließt",
    icon: "🗺️",
    category: "overview",
  },
  {
    id: "priority_saving",
    label: "Sparen lernen",
    description: "Am Monatsende soll was übrig bleiben",
    icon: "🐷",
    category: "saving",
  },
  {
    id: "priority_saving_goal",
    label: "Auf ein Ziel sparen",
    description: "Auto, Reise, eigene Wohnung",
    icon: "🎯",
    category: "saving_goal",
  },
  {
    id: "priority_debt",
    label: "Schulden loswerden",
    description: "Raus aus Dispo, Ratenkäufen oder Krediten",
    icon: "🔓",
    category: "debt",
  },
  {
    id: "priority_investing",
    label: "Investieren starten",
    description: "Mein Geld langfristig wachsen lassen",
    icon: "📈",
    category: "investing",
  },
  {
    id: "priority_retirement",
    label: "Vorsorge fürs Alter",
    description: "Früh anfangen lohnt sich wirklich",
    icon: "🌳",
    category: "retirement",
  },
  {
    id: "priority_insurance",
    label: "Versicherungen checken",
    description: "Was brauche ich wirklich, was nicht?",
    icon: "🛡️",
    category: "insurance",
  },
  {
    id: "priority_side_income",
    label: "Mehr verdienen",
    description: "Nebenjob, Side-Hustle, eigene Projekte",
    icon: "🚀",
    category: "side_income",
  },
];
export const PRIORITY_RANK_COUNT = 3;
export function getPriorityOption(id: string): PriorityOption | null {
  return PRIORITY_OPTIONS.find((opt) => opt.id === id) ?? null;
}
export function getPriorityCategories(ids: string[]): PriorityCategory[] {
  return ids
    .map((id) => getPriorityOption(id)?.category)
    .filter((c): c is PriorityCategory => c !== undefined);
}

// STEP 8: WISSENSTEST -----------------------------------------------------------------------------------------------------
export type KnowledgeLevel = "beginner" | "intermediate" | "advanced";
export interface QuizAnswer {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}
export interface QuizQuestion {
  id: string;
  intro?: string;
  question: string;
  answers: QuizAnswer[];
}
export const KNOWLEDGE_QUIZ: readonly QuizQuestion[] = [
  {
    id: "q1_etf",
    intro: "Lass uns mit einem Klassiker starten:",
    question: "Was beschreibt einen ETF am besten?",
    answers: [
      {
        id: "a",
        text: "Ein aktiv gemanagter Fonds, bei dem Profis Aktien handeln, um den Markt zu schlagen.",
        correct: false,
        feedback:
          "Knapp daneben! Das beschreibt einen klassischen Investmentfonds. ETFs sind das Gegenteil: passiv, sie bilden einfach einen Index nach. Genau das macht sie günstig.",
      },
      {
        id: "b",
        text: "Ein Wertpapier, das einen ganzen Index nachbildet und an der Börse handelbar ist.",
        correct: true,
        feedback:
          "Stark! ETFs bilden Indizes wie den DAX oder MSCI World ab und werden wie Aktien an der Börse gehandelt — niedrige Kosten, breite Streuung.",
      },
      {
        id: "c",
        text: "Ein festverzinslicher Sparvertrag mit garantierter Rendite und staatlicher Einlagensicherung.",
        correct: false,
        feedback:
          "Das klingt eher nach Festgeld oder Sparbrief. Bei ETFs gibt es keine garantierte Rendite, dafür aber langfristig mehr Potenzial.",
      },
      {
        id: "d",
        text: "Ich weiß es nicht genau.",
        correct: false,
        feedback:
          "Kein Stress! ETFs sind eines der Themen, das ich dir am liebsten erkläre, weil sie für viele der einfachste Einstieg ins Investieren sind.",
      },
    ],
  },
  {
    id: "q2_compound",
    intro: "Jetzt wird's mathematisch.",
    question:
      "Du legst 10.000 € zu 6 % Zinsen pro Jahr an. Wie viel hast du nach 20 Jahren ungefähr, wenn du die Zinsen reinvestierst?",
    answers: [
      {
        id: "a",
        text: "Ungefähr 22.000 € — also etwas mehr als doppelt so viel wie am Anfang",
        correct: false,
        feedback:
          "Das wäre rein die einfache Verzinsung (10.000 € + 12.000 € Zinsen). Du unterschätzt den Zinseszins-Effekt — der macht über 20 Jahre einen großen Unterschied.",
      },
      {
        id: "b",
        text: "Ungefähr 32.000 € — Zinseszins lässt das Kapital deutlich wachsen",
        correct: true,
        feedback:
          "Genau richtig! Bei 6 % verdoppelt sich Geld etwa alle 12 Jahre (72er-Regel). Nach 20 Jahren werden aus 10.000 € rund 32.000 € — das ist die Magie des Zinseszinses.",
      },
      {
        id: "c",
        text: "Ungefähr 16.000 € — wegen Inflation und Steuern bleibt nicht viel übrig",
        correct: false,
        feedback:
          "Inflation und Steuern sind real, aber bei dieser Frage geht es um Brutto-Wachstum. Vor Abzügen sind es etwa 32.000 € — Zinseszins wirkt stärker als die meisten denken.",
      },
      {
        id: "d",
        text: "Ich kann das schwer einschätzen ohne Taschenrechner",
        correct: false,
        feedback:
          "Verständlich — Zinseszinsen sind im Kopf schwer zu rechnen. Die Faustregel: 72 geteilt durch den Zinssatz = Jahre bis zur Verdopplung. Bei 6 % also ca. 12 Jahre.",
      },
    ],
  },
  {
    id: "q3_diversification",
    intro: "Letzte Frage! Die ist etwas kniffliger.",
    question:
      "Welche dieser Strategien bietet langfristig das beste Verhältnis aus Risiko und Rendite?",
    answers: [
      {
        id: "a",
        text: "Das gesamte Geld in Tagesgeld parken, weil dort kein Verlustrisiko besteht",
        correct: false,
        feedback:
          "Tagesgeld ist sicher, aber durch Inflation verlierst du langfristig Kaufkraft. Echte Sicherheit heißt nicht „kein Risiko, sondern „kein Verlust nach Inflation.",
      },
      {
        id: "b",
        text: "Alles in zwei oder drei Top-Aktien stecken, die in den letzten Jahren stark gestiegen sind",
        correct: false,
        feedback:
          "Das ist Performance-Chasing — vergangene Gewinner sind selten zukünftige Gewinner. Konzentration auf wenige Aktien ist eines der größten Anfänger-Risiken.",
      },
      {
        id: "c",
        text: "Breit gestreut weltweit investieren und über viele Jahre konsequent dranbleiben",
        correct: true,
        feedback:
          "Genau! Breite Streuung über Länder und Branchen plus langer Atem ist die wissenschaftlich belegt beste Strategie für Privatanleger. Langweilig, aber wirkungsvoll.",
      },
      {
        id: "d",
        text: "Ich bin mir bei dieser Frage wirklich unsicher",
        correct: false,
        feedback:
          "Diese Frage trennt Anfänger von Fortgeschrittenen — kein Wunder, wenn sie schwer fällt. Die Antwort lautet: Streuung schlägt Stockpicking, fast immer.",
      },
    ],
  },
];
export function getKnowledgeLevel(correctCount: number): KnowledgeLevel {
  if (correctCount === 0) return "beginner";
  if (correctCount === KNOWLEDGE_QUIZ.length) return "advanced";
  return "intermediate";
}

// STEP 9: VERHALTENSSZENARIEN ----------------------------------------------------------------------------------------------
export type BehaviorBias =
  | "instant_gratification"
  | "loss_aversion"
  | "balanced"
  | "growth_oriented"
  | "debt_priority"
  | "panic"
  | "rational"
  | "avoidance";

export interface ScenarioOption {
  id: string;
  label: string;
  description: string;
  bias: BehaviorBias;
}
export interface Scenario {
  id: string;
  intro: string;
  setup: string;
  emoji: string;
  options: readonly ScenarioOption[];
}
export const SCENARIOS: readonly Scenario[] = [
  {
    id: "scenario_windfall",
    intro: "Erste Situation: Etwas Positives!",
    setup:
      "Du bekommst überraschend 1.000 € Steuerrückerstattung aufs Konto. \nWas machst du als Erstes: Ganz ehrlich?",
    emoji: "💸",
    options: [
      {
        id: "windfall_spend",
        label: "Direkt was gönnen",
        description: "Sneakers, Trip, das Ding auf der Wunschliste",
        bias: "instant_gratification",
      },
      {
        id: "windfall_save",
        label: "Komplett wegsparen",
        description: "Aufs Sparkonto schieben, sicher parken",
        bias: "loss_aversion",
      },
      {
        id: "windfall_split_save",
        label: "Aufteilen: mehr sparen",
        description: "Etwa 70 % zurücklegen, 30 % gönnen",
        bias: "balanced",
      },
      {
        id: "windfall_split_spend",
        label: "Aufteilen: mehr gönnen",
        description: "Etwa 70 % gönnen, 30 % zurücklegen",
        bias: "instant_gratification",
      },
      {
        id: "windfall_invest",
        label: "In ETF oder Aktien stecken",
        description: "Sparplan einzahlen, Wertpapiere kaufen",
        bias: "growth_oriented",
      },
      {
        id: "windfall_debt",
        label: "Schulden oder Dispo abbauen",
        description: "Erst die offenen Posten loswerden",
        bias: "debt_priority",
      },
    ],
  },
  {
    id: "scenario_crisis",
    intro: "Zweite Situation — diesmal andersrum.",
    setup:
      "Deine Waschmaschine geht plötzlich kaputt und du brauchst 600 € für eine neue. \nWas ist deine erste Reaktion?",
    emoji: "🔧",
    options: [
      {
        id: "crisis_panic",
        label: "Kurze Panik, wo nehm ich das jetzt her?",
        description: "Stress, schnelles Suchen, Dispo nutzen",
        bias: "panic",
      },
      {
        id: "crisis_calm",
        label: "Vom Notgroschen nehmen",
        description: "Genau dafür hab ich Rücklagen gebildet",
        bias: "rational",
      },
      {
        id: "crisis_used",
        label: "Gebraucht kaufen oder reparieren lassen",
        description: "Günstigere Lösung suchen statt neu kaufen",
        bias: "rational",
      },
      {
        id: "crisis_credit",
        label: "Per Ratenkauf finanzieren",
        description: "Kleinere monatliche Beträge sind machbar",
        bias: "instant_gratification",
      },
      {
        id: "crisis_help",
        label: "Familie oder Freunde um Hilfe bitten",
        description: "Eltern vorschießen lassen, später zurückzahlen",
        bias: "avoidance",
      },
      {
        id: "crisis_postpone",
        label: "Erstmal aufschieben und improvisieren",
        description: "Waschsalon nutzen, bis Geld da ist",
        bias: "avoidance",
      },
    ],
  },
];
export function getScenario(id: string): Scenario | null {
  return SCENARIOS.find((s) => s.id === id) ?? null;
}
export function getScenarioOption(
  scenarioId: string,
  optionId: string,
): ScenarioOption | null {
  const scenario = getScenario(scenarioId);
  return scenario?.options.find((o) => o.id === optionId) ?? null;
}
export type BiasPattern = "stable" | "fragile" | "conservative" | "rational";
export function combineBiases(
  windfallBias: BehaviorBias,
  crisisBias: BehaviorBias,
): BiasPattern {
  const fragileSignals: BehaviorBias[] = ["instant_gratification", "panic"];
  const conservativeSignals: BehaviorBias[] = ["loss_aversion", "avoidance"];
  const rationalSignals: BehaviorBias[] = ["debt_priority", "rational"];

  const both = [windfallBias, crisisBias];
  const fragileCount = both.filter((b) => fragileSignals.includes(b)).length;
  const conservativeCount = both.filter((b) =>
    conservativeSignals.includes(b),
  ).length;
  const rationalCount = both.filter((b) => rationalSignals.includes(b)).length;

  if (fragileCount >= 1) return "fragile";
  if (rationalCount >= 1 && conservativeCount === 0) return "rational";
  if (conservativeCount >= 1) return "conservative";
  return "stable";
}
export const BIAS_PATTERN_REACTIONS: Record<BiasPattern, string> = {
  stable:
    "Spannend! Du reagierst in beiden Situationen ausgewogen. Das ist eine echt starke Basis: Du gönnst dir was, ohne den Boden zu verlieren, und hast in Krisen einen kühlen Kopf. Wenn ich eines beachten soll, dann nur, dass „balanced manchmal auch heißt: wenig konkrete Strategie. Wir können das schärfen.",
  fragile:
    "Dein Bauchgefühl ist sehr im Moment. Bei gutem Geld freust du dich direkt, bei schlechtem Geld stressst du. Das ist menschlich und super häufig, aber es macht dich emotional abhängig vom Kontostand. Mein Job ist, mit dir ein Polster aufzubauen, das dir diese Momente leichter macht. Notgroschen ist das Erste, was wir angehen.",
  conservative:
    "Du gehst also gerne auf eine Nummer sicher. Sparen statt ausgeben, fremde Hilfe statt Risiko. Das schützt dich, aber kann auch bremsen. Sicher ist nicht automatisch sinnvoll: Geld, das nur auf dem Sparkonto liegt, verliert durch Inflation Wert. Wir schauen, wie du Sicherheit fühlst UND trotzdem wachsen kannst.",
  rational:
    "Du denkst rational und mathematisch. Schulden weg, Notgroschen nutzen, Ratio statt Emotion. Das ist eine starke Grundlage, mit der wir vieles aufbauen können. Mein einziger Hinweis: Vergiss nicht, dir auch mal was zu gönnen. Geld ist Werkzeug, nicht Selbstzweck.",
};

// STEP 10: PERSONALITÄT ---------------------------------------------------------------------------------------------------
export type FinancialMaturity = "starter" | "developing" | "established";
export interface SwipeStatement {
  id: string;
  mascot: string;
  statement: string;
  positiveLabel: string;
  negativeLabel: string;
}
export const PERSONALITY_STATEMENTS: readonly SwipeStatement[] = [
  {
    id: "habit_checks_balance",
    statement: "Ich checke meinen Kontostand mindestens einmal pro Woche.",
    positiveLabel: "Ja, mache ich",
    negativeLabel: "Eher selten",
    mascot: "/Maskottchen/Maskottchen-Beratung.webp",
  },
  {
    id: "habit_knows_spending",
    statement:
      "Ich weiß ungefähr, wie viel ich im letzten Monat ausgegeben habe.",
    positiveLabel: "Ungefähr ja",
    negativeLabel: "Keine Ahnung",
    mascot: "/Maskottchen/Maskottchen-Unklar.png",
  },
  {
    id: "habit_auto_savings",
    statement: "Ich habe einen Dauerauftrag, der automatisch Geld wegspart.",
    positiveLabel: "Ja, läuft",
    negativeLabel: "Nein, noch nicht",
    mascot: "/Maskottchen/Maskottchen-Hero.webp",
  },
  {
    id: "habit_emergency_fund",
    statement:
      "Ich habe einen Notgroschen für plötzliche Ausgaben. Etwa 1-3 Monatsgehälter.",
    positiveLabel: "Ja, hab ich",
    negativeLabel: "Nicht wirklich",
    mascot: "/Maskottchen/Maskottchen-Freude.webp",
  },
  {
    id: "habit_invested",
    statement: "Ich habe schon mal in eine Aktie oder einen ETF investiert.",
    positiveLabel: "Ja, schon mal",
    negativeLabel: "Nein, nie",
    mascot: "/Maskottchen/Maskottchen-Business.webp",
  },
  {
    id: "habit_impulse_buying",
    statement:
      "Wenn ich was Schönes sehe, kaufe ich es oft direkt. Auch wenn ich es nicht geplant hatte.",
    positiveLabel: "Stimmt schon",
    negativeLabel: "Eher nicht",
    mascot: "/Maskottchen/Maskottchen-Unklar.png",
  },
];
// CONSTANTS
const REVERSE_CODED_HABIT_IDS = ["habit_impulse_buying"] as const;
export function getMaturityLevel(
  answers: Record<string, boolean>,
): FinancialMaturity {
  // Count positive habits, but invert reverse-coded ones.
  // For reverse-coded: answering "true" (e.g. "Stimmt schon" for
  // impulse buying) counts as a MINUS, not a plus.
  let score = 0;
  for (const [id, value] of Object.entries(answers)) {
    const isReverseCoded = (
      REVERSE_CODED_HABIT_IDS as readonly string[]
    ).includes(id);
    if (isReverseCoded) {
      // Reverse: true = impulsive → minus, false = disciplined → plus
      if (!value) score += 1;
      else score -= 1;
    } else {
      if (value) score += 1;
    }
  }
  if (score <= 1) return "starter";
  if (score <= 3) return "developing";
  return "established";
}
export const MATURITY_REACTIONS: Record<FinancialMaturity, string> = {
  starter:
    "Du startest mit einem fast leeren Blatt — und das ist überhaupt kein Nachteil. Im Gegenteil: keine schlechten Gewohnheiten, die ich erst aufbrechen muss. Wir bauen Schritt für Schritt eine Routine auf, die zu dir passt — angefangen bei dem Allereinfachsten.",
  developing:
    "Du hast schon ein paar gute Routinen — aber noch nicht alles im Griff. Das ist eigentlich der spannendste Punkt: Du hast bewiesen, dass du Gewohnheiten aufbauen kannst, jetzt geht's um die nächsten Hebel. Wir schauen, welche dir am leichtesten fallen.",
  established:
    "Beeindruckend — du hast die wichtigsten Basics schon stehen. Das ist seltener, als du denkst, gerade in deinem Alter. Mein Job ist jetzt nicht mehr Aufbau, sondern Optimierung: Wo können wir deine Strategie noch schärfer machen?",
};

// LIFE PHASE BASELINES ─────────────────────────────────────
// Expected performance for each life situation. Used to compute
// whether a user is ahead, on-track, or behind relative to their
// life phase — which fundamentally changes the tone of insights.
export type RelativePerformance = "ahead" | "on_track" | "behind";
interface LifePhaseBaseline {
  expectsInvested: boolean;
  expectsEmergencyFund: boolean;
  expectedKnowledge: KnowledgeLevel;
  expectedMaturity: FinancialMaturity;
}
// CONSTANTS
const LIFE_PHASE_BASELINES: Record<string, LifePhaseBaseline> = {
  schueler: {
    expectedMaturity: "starter",
    expectedKnowledge: "beginner",
    expectsEmergencyFund: false,
    expectsInvested: false,
  },
  azubi: {
    expectedMaturity: "starter",
    expectedKnowledge: "beginner",
    expectsEmergencyFund: false,
    expectsInvested: false,
  },
  student: {
    expectedMaturity: "starter",
    expectedKnowledge: "beginner",
    expectsEmergencyFund: false,
    expectsInvested: false,
  },
  berufseinstieg: {
    expectedMaturity: "developing",
    expectedKnowledge: "intermediate",
    expectsEmergencyFund: true,
    expectsInvested: false,
  },
  berufstaetig: {
    expectedMaturity: "developing",
    expectedKnowledge: "intermediate",
    expectsEmergencyFund: true,
    expectsInvested: true,
  },
} as const;
// CONSTANTS
const MATURITY_ORDER: Record<FinancialMaturity, number> = {
  starter: 0,
  developing: 1,
  established: 2,
} as const;
const KNOWLEDGE_ORDER: Record<KnowledgeLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
} as const;
/**
 * Compares the user's actual metrics against the expected baseline
 * for their life situation. Returns "ahead" if ALL metrics exceed
 * expectations, "behind" if ALL fall below, "on_track" otherwise.
 */
export function getRelativePerformance(
  profile: UserProfile,
): RelativePerformance {
  const baseline = LIFE_PHASE_BASELINES[profile.lebenssituation];
  if (!baseline) return "on_track"; // unknown life situation → neutral

  const maturity = getMaturityLevel(profile.persoenlichkeit ?? {});
  const knowledge = getKnowledgeLevel(profile.wissenstest?.correctCount ?? 0);
  const hasEmergencyFund =
    profile.persoenlichkeit?.habit_emergency_fund === true;
  const hasInvested = profile.persoenlichkeit?.habit_invested === true;

  // Compare each metric: +1 for above expectation, -1 for below
  const scores: number[] = [];

  // Maturity comparison
  const matDiff =
    MATURITY_ORDER[maturity] - MATURITY_ORDER[baseline.expectedMaturity];
  scores.push(matDiff > 0 ? 1 : matDiff < 0 ? -1 : 0);

  // Knowledge comparison
  const knowDiff =
    KNOWLEDGE_ORDER[knowledge] - KNOWLEDGE_ORDER[baseline.expectedKnowledge];
  scores.push(knowDiff > 0 ? 1 : knowDiff < 0 ? -1 : 0);

  // Emergency fund: only counts if the baseline expects it
  if (baseline.expectsEmergencyFund) {
    scores.push(hasEmergencyFund ? 0 : -1);
  } else {
    // Bonus if they have one even though not expected
    if (hasEmergencyFund) scores.push(1);
  }

  // Invested: only counts if the baseline expects it
  if (baseline.expectsInvested) {
    scores.push(hasInvested ? 0 : -1);
  } else {
    if (hasInvested) scores.push(1);
  }

  const allPositiveOrZero = scores.every((s) => s >= 0);
  const anyPositive = scores.some((s) => s > 0);
  const allNegativeOrZero = scores.every((s) => s <= 0);
  const anyNegative = scores.some((s) => s < 0);

  if (allPositiveOrZero && anyPositive) return "ahead";
  if (allNegativeOrZero && anyNegative) return "behind";
  return "on_track";
}

// STEP 11: GELDGEFÜHL + PRÄGUNG ---------------------------------------------------------------------------------------------
export type MoneyFeeling = "freedom" | "stress";
export type MoneyImprint =
  | "open"
  | "absent"
  | "scarcity"
  | "taboo"
  | "conflict";
export interface MoneyFeelingOption {
  label: string;
  emoji: string;
  mascot: string;
  id: MoneyFeeling;
  gradient: string;
  description: string;
}
export interface GeldpraegungOption {
  icon: string;
  label: string;
  id: MoneyImprint;
  description: string;
}
export const MONEY_FEELING_OPTIONS: readonly MoneyFeelingOption[] = [
  {
    id: "freedom",
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
export const GELDPRAEGUNG_OPTIONS: readonly GeldpraegungOption[] = [
  {
    id: "open",
    label: "Offen & entspannt",
    description: "Über Geld wurde normal geredet, kein Drama",
    icon: "☀️",
  },
  {
    id: "absent",
    label: "Kaum thematisiert",
    description: "Geld war einfach kein häufiges Gesprächsthema",
    icon: "🤷",
  },
  {
    id: "scarcity",
    label: "Mit Sorgen behaftet",
    description: "„Geld ist knapp war oft präsent",
    icon: "😟",
  },
  {
    id: "conflict",
    label: "Oft Streitthema",
    description: "Geld hat regelmäßig für Spannungen gesorgt",
    icon: "⚡",
  },
  {
    id: "taboo",
    label: "Tabu — wurde verschwiegen",
    description: "Darüber hat man einfach nicht gesprochen",
    icon: "🤐",
  },
];
export function getMoneyFeelingOption(
  id: MoneyFeeling,
): MoneyFeelingOption | null {
  return MONEY_FEELING_OPTIONS.find((opt) => opt.id === id) ?? null;
}
export function getGeldpraegungOption(id: string): GeldpraegungOption | null {
  return GELDPRAEGUNG_OPTIONS.find((opt) => opt.id === id) ?? null;
}
export const FEELING_TRANSITIONS: Record<MoneyFeeling, string> = {
  freedom:
    "Spannend — bei vielen ist das umgekehrt. Lass uns kurz schauen, woher das wahrscheinlich kommt.",
  stress:
    "Danke, dass du das ehrlich teilst. Das ist viel häufiger, als du denkst — und meistens hat es einen Ursprung. Lass uns mal hinschauen.",
};

// STEP 12: ZIELBILD --------------------------------------------------------------------------------------------------------
export interface ZielbildStarter {
  id: string;
  icon: string;
  label: string;
  starter: string;
}
export const ZIELBILD_MAX_LENGTH = 280;
export const ZIELBILD_PLACEHOLDERS: readonly string[] = [
  "Zum Beispiel: In 5 Jahren möchte ich endlich keinen Stress mehr am Monatsende haben...",
  "Zum Beispiel: Einen Notgroschen aufbauen, damit ich nachts ruhig schlafen kann...",
  "Zum Beispiel: Mein erstes eigenes Depot eröffnen und regelmäßig investieren...",
  "Zum Beispiel: Schulden komplett abbezahlen und neu durchstarten...",
  "Zum Beispiel: Mir Reisen leisten können, ohne danach pleite zu sein...",
  "Zum Beispiel: Endlich verstehen, was mit meinem Geld passiert...",
];
export const ZIELBILD_STARTERS: readonly ZielbildStarter[] = [
  {
    id: "starter_calm",
    label: "Ruhe haben",
    starter: "In 12 Monaten möchte ich finanziell entspannter sein, weil ",
    icon: "😌",
  },
  {
    id: "starter_overview",
    label: "Überblick gewinnen",
    starter:
      "Ich will endlich genau wissen, wohin mein Geld jeden Monat geht, damit ",
    icon: "🗺️",
  },
  {
    id: "starter_safety",
    label: "Notgroschen aufbauen",
    starter: "Mein erstes Ziel ist ein Notgroschen von ",
    icon: "🛡️",
  },
  {
    id: "starter_invest",
    label: "Investieren starten",
    starter: "Ich will endlich anfangen zu investieren — am liebsten ",
    icon: "📈",
  },
  {
    id: "starter_debt",
    label: "Schulden abbauen",
    starter: "Bis Ende nächsten Jahres möchte ich meine Schulden ",
    icon: "🔓",
  },
  {
    id: "starter_freedom",
    label: "Freiheit",
    starter: "Geld bedeutet für mich Freiheit — ich will damit ",
    icon: "🦅",
  },
];

// LIFE VALUES (Step 12 extension) ----------------------------------------------------------------------------------------------
export type LifeValue =
  | "security"
  | "freedom"
  | "family"
  | "experience"
  | "status"
  | "growth";
export interface LifeValueOption {
  icon: string;
  id: LifeValue;
  label: string;
  description: string;
}
// CONSTANTS
export const LIFE_VALUES: readonly LifeValueOption[] = [
  {
    id: "security",
    label: "Sicherheit",
    icon: "🛡️",
    description: "Stabilität und Planbarkeit zählen",
  },
  {
    id: "freedom",
    label: "Freiheit",
    icon: "🦅",
    description: "Unabhängig und selbstbestimmt leben",
  },
  {
    id: "family",
    label: "Familie",
    icon: "👨‍👩‍👧",
    description: "Geliebte Menschen absichern und unterstützen",
  },
  {
    id: "experience",
    label: "Erlebnisse",
    icon: "🌍",
    description: "Reisen, Abenteuer, neue Erfahrungen",
  },
  {
    id: "status",
    label: "Status & Anerkennung",
    icon: "⭐",
    description: "Respekt und gesellschaftliche Position",
  },
  {
    id: "growth",
    label: "Wachstum",
    icon: "🌱",
    description: "Ständig lernen und sich weiterentwickeln",
  },
] as const;

// PROFILE SHAPE ------------------------------------------------------------------------------------------------------------
export interface UserProfile {
  // Step 1–2: Who
  lebenssituation: string;
  alter: number;

  // Step 3: Where
  wohnsituation: string;

  // Step 4: Income
  einkommensRange: string;

  // Step 5: Debt
  /** Selected option id from `SCHULDEN_OPTIONS` (e.g. debt_none). */
  schuldenOptionId: string;
  /** Convenience boolean — derived from schuldenOptionId at write time. */
  hatSchulden: boolean;

  // Step 6: Time horizon
  zeithorizont: string;

  // Step 7: Priorities (top 3 ranked)
  prioritaeten: string[];

  // Step 8: Knowledge quiz
  wissenstest: {
    correctCount: number;
    answeredIds: string[];
  };

  // Step 9: Two scenarios → behavioral bias measurement
  szenario: {
    windfallBias: BehaviorBias;
    crisisBias: BehaviorBias;
  } | null;

  // Step 10: Personality (statement id → agreed/disagreed)
  persoenlichkeit: Record<string, boolean>;

  // Step 11: Money feeling + upbringing
  geldgefuehl: MoneyFeeling;
  geldpraegung: string;

  // Step 12: Vision goal + Lebenswerte
  zielbild: string;
  lebenswerte: LifeValue[]; // up to 2 values
}
/** Empty profile used as initial state. */
export function emptyProfile(): UserProfile {
  return {
    lebenssituation: "",
    alter: AGE_DEFAULT,
    wohnsituation: "",
    einkommensRange: "",
    schuldenOptionId: "",
    hatSchulden: false,
    zeithorizont: "",
    prioritaeten: [],
    wissenstest: { correctCount: 0, answeredIds: [] },
    szenario: null,
    persoenlichkeit: {},
    geldgefuehl: "freedom",
    geldpraegung: "",
    zielbild: "",
    lebenswerte: [],
  };
}

// ═══════════════════════════════════════════════════════════
// CRISIS DETECTION ---------------------------------------------------------------------------------------------------------
// ═══════════════════════════════════════════════════════════
// Identifies users in vulnerable financial or emotional
// situations so Bea can refer them to professional help.
export type CrisisSignalType =
  | "debt_trap"
  | "financial_trauma"
  | "acute_distress";

export interface CrisisSignal {
  type: CrisisSignalType;
  severity: "moderate" | "severe";
  description: string;
}
export interface CrisisResource {
  name: string;
  url?: string;
  phone?: string;
  description: string;
}
// CRISIS RESOURCES — verified German help services (free, anonymous)
export const CRISIS_RESOURCES: readonly CrisisResource[] = [
  {
    name: "Caritas Schuldnerberatung für junge Leute",
    description: "Kostenlose und vertrauliche Online-Beratung bei Schulden",
    url: "https://www.caritas.de/hilfeundberatung/onlineberatung/schuldnerberatung-fuer-junge-leute/schuldnerberatung-fuer-junge-leute",
  },
  {
    name: "Verbraucherzentrale Schuldenberatung",
    description:
      "Unabhängige Beratung in deiner Stadt — kostenlos oder gegen geringe Gebühr",
    url: "https://www.verbraucherzentrale.de/wissen/geld-versicherungen/kredit-schulden-insolvenz",
  },
  {
    name: "Telefonseelsorge",
    description:
      "Bei akutem psychischen Stress — 24/7 erreichbar, kostenlos und anonym",
    phone: "0800 111 0 111",
    url: "https://www.telefonseelsorge.de",
  },
] as const;
// Keywords that may indicate acute distress in the free-text Zielbild field
const DISTRESS_KEYWORDS: readonly string[] = [
  "verzweifelt",
  "weiß nicht weiter",
  "weiss nicht weiter",
  "existenz",
  "raus aus",
  "kann nicht mehr",
  "nicht mehr weiter",
  "hoffnungslos",
  "ausweglos",
  "überschuldet",
  "ueberschuldet",
  "inkasso",
  "pfändung",
  "pfaendung",
  "gerichtsvollzieher",
  "insolvenz",
  "privatinsolvenz",
] as const;
// Low income thresholds for debt_trap and financial_trauma checks
const LOW_INCOME_IDS: readonly string[] = [
  "income_none",
  "income_0_500",
  "income_500_1000",
] as const;
/**
 * Scans the completed profile for crisis signals that warrant
 * referral to professional help. Returns an empty array when
 * no signals are detected.
 */
export function detectCrisisSignals(profile: UserProfile): CrisisSignal[] {
  const signals: CrisisSignal[] = [];

  const hasLowIncome = LOW_INCOME_IDS.includes(profile.einkommensRange);

  // debt_trap: significant debt + low income
  if (profile.schuldenOptionId === "debt_significant" && hasLowIncome) {
    signals.push({
      type: "debt_trap",
      severity:
        profile.einkommensRange === "income_none" ? "severe" : "moderate",
      description:
        "Hohe Schuldenbelastung bei niedrigem oder fehlendem Einkommen — professionelle Schuldnerberatung empfohlen.",
    });
  }

  // financial_trauma: stress + negative imprint + low income
  const traumaImprints: string[] = ["scarcity", "conflict", "taboo"];
  if (
    profile.geldgefuehl === "stress" &&
    traumaImprints.includes(profile.geldpraegung) &&
    hasLowIncome
  ) {
    signals.push({
      type: "financial_trauma",
      severity: "moderate",
      description:
        "Geldstress kombiniert mit belastender Prägung und niedrigem Einkommen — behutsam vorgehen, professionelle Unterstützung anbieten.",
    });
  }

  // acute_distress: Zielbild free-text contains distress keywords
  if (profile.zielbild && profile.zielbild.trim().length > 0) {
    const lower = profile.zielbild.toLowerCase();
    const matchedKeyword = DISTRESS_KEYWORDS.find((kw) => lower.includes(kw));
    if (matchedKeyword) {
      signals.push({
        type: "acute_distress",
        severity: "severe",
        description: `Zielbild enthält belastendes Signal ("${matchedKeyword}") — auf professionelle Hilfsangebote hinweisen.`,
      });
    }
  }

  return signals;
}

// ═══════════════════════════════════════════════════════════
// CROSS-VALIDATION LAYER -----------------------------------------------------------------------------------------------------
// ═══════════════════════════════════════════════════════════
// Detects inconsistencies between steps that reveal blind spots,
// self-deception, or nuanced patterns worth exploring in chat.
export interface Inconsistency {
  id: string;
  severity: "low" | "medium" | "high";
  /** Internal description for debugging / analytics */
  description: string;
  /** How Bea would gently bring this up in conversation */
  chatPrompt: string;
}
/**
 * Scans the profile for cross-step inconsistencies.
 * Returns an empty array when no patterns are detected.
 */
export function detectInconsistencies(profile: UserProfile): Inconsistency[] {
  const results: Inconsistency[] = [];

  // Derive signals needed for checks
  const knowledgeLevel = getKnowledgeLevel(
    profile.wissenstest?.correctCount ?? 0,
  );
  const maturity = getMaturityLevel(profile.persoenlichkeit ?? {});
  const biasPattern: BiasPattern = profile.szenario
    ? combineBiases(profile.szenario.windfallBias, profile.szenario.crisisBias)
    : "stable";

  // 1. debt_priority_mismatch:
  //    No debt but "Schulden loswerden" is a priority
  if (
    profile.schuldenOptionId === "debt_none" &&
    profile.prioritaeten.includes("priority_debt")
  ) {
    results.push({
      id: "debt_priority_mismatch",
      severity: "low",
      description:
        "User hat keine Schulden angegeben, aber Schuldenabbau als Priorität gewählt. Antizipiert möglicherweise Schulden oder hat eine verzerrte Selbstwahrnehmung.",
      chatPrompt:
        "Du hast gesagt, du hast aktuell keine Schulden — aber Schulden loswerden ist trotzdem eine deiner Top-Prioritäten. Planst du etwas, bei dem Schulden entstehen könnten, oder hast du das Gefühl, dass da doch etwas ist?",
    });
  }

  // 2. emergency_fund_panic:
  //    Claims to have emergency fund but panics in crisis scenario
  if (
    profile.persoenlichkeit?.habit_emergency_fund === true &&
    profile.szenario?.crisisBias === "panic"
  ) {
    results.push({
      id: "emergency_fund_panic",
      severity: "medium",
      description:
        "User hat Notgroschen angegeben, reagiert aber bei der Krisensituation mit Panik. Notgroschen ist möglicherweise psychologisch nicht verankert oder zu klein.",
      chatPrompt:
        'Spannend: Du hast einen Notgroschen, aber bei der Waschmaschinen-Situation kam trotzdem erstmal Panik. Kann es sein, dass sich dein Polster noch nicht wirklich wie Sicherheit anfühlt? Manchmal liegt das daran, dass die Summe zwar da ist, aber man sie gedanklich nicht als "dafür ist das da" verbucht hat.',
    });
  }

  // 3. knowledge_action_gap:
  //    High knowledge but hasn't started investing
  if (
    knowledgeLevel === "advanced" &&
    profile.persoenlichkeit?.habit_invested === false
  ) {
    results.push({
      id: "knowledge_action_gap",
      severity: "medium",
      description:
        "User hat alle Quiz-Fragen richtig, hat aber noch nie investiert. Klassischer 'weiß-aber-tut-nicht'-Typ — sehr häufiges Muster.",
      chatPrompt:
        "Du hast im Quiz gezeigt, dass du theoretisch richtig fit bist — ETFs, Zinseszins, Diversifikation sitzt alles. Aber investiert hast du noch nie. Was hält dich zurück? Oft ist es nicht Wissen, das fehlt, sondern der letzte Anstoß.",
    });
  }

  // 4. stress_maturity_paradox:
  //    Reports money stress despite having established habits
  if (profile.geldgefuehl === "stress" && maturity === "established") {
    results.push({
      id: "stress_maturity_paradox",
      severity: "medium",
      description:
        "User hat gute Finanzgewohnheiten, empfindet Geld aber als Stress. Hinweis auf Perfektionismus, verzerrte Selbstwahrnehmung, oder externe Stressoren (z.B. hohe Fixkosten).",
      chatPrompt:
        "Du hast eigentlich viele gute Routinen — Kontocheck, Sparplan, Notgroschen. Trotzdem fühlt sich Geld für dich stressig an. Das ist nicht ungewöhnlich: Manchmal bleibt das Stressgefühl, obwohl man objektiv gut dasteht. Woher kommt das bei dir — ist es eher ein Kopfthema oder gibt es konkrete Situationen, die Druck machen?",
    });
  }

  // 5. fragile_established_paradox:
  //    Claims good habits but reacts impulsively in scenarios
  if (biasPattern === "fragile" && maturity === "established") {
    results.push({
      id: "fragile_established_paradox",
      severity: "high",
      description:
        "User gibt an, alle wichtigen Gewohnheiten zu haben, reagiert in Szenarien aber impulsiv/panisch. Habits sind vermutlich oberflächlich oder sozial erwünscht beantwortet.",
      chatPrompt:
        "Mir fällt etwas Spannendes auf: Du hast solide Gewohnheiten beschrieben — aber in den Szenarien hat dein Bauch ganz anders reagiert. Das ist kein Widerspruch, das ist menschlich. Manchmal laufen Routinen auf Autopilot, aber wenn es emotional wird, übernimmt ein anderer Teil. Lass uns schauen, wo du wirklich stabil bist und wo wir noch Anker setzen können.",
    });
  }

  return results;
}

// ═══════════════════════════════════════════════════════════
// INSIGHTS ENGINE ------------------------------------------------------------------------------------------------------------
// ═══════════════════════════════════════════════════════════
// Derives structured insights from the completed user profile.
// Used by OnboardingComplete to show the analysis, and later by
// Bea's first chat message to greet the user with full context.
export type InsightTone = "positive" | "neutral" | "cautious";
export interface Insight {
  title: string;
  description: string;
  icon: string;
  tone: InsightTone;
  /**
   * How confident the engine is in this insight (0-1).
   * Based on how many independent signals support it.
   * - 1 signal  → 0.5
   * - 2 signals → 0.7
   * - 3+ signals → 0.9
   */
  confidence: number;
}
// ─── FINANCIAL TYPES (Fox Taxonomy) -----------------------------------------------------------------------------------------
// Six distinct fox personalities that map to specific combinations
// of maturity, stability, and emotional-vs-rational approach.
// See getFinancialType() for the assignment logic.

export type FinancialTypeId =
  | "bauch_fuchs"
  | "schutz_fuchs"
  | "klar_fuchs"
  | "meister_fuchs"
  | "spuer_fuchs"
  | "kletter_fuchs";

export interface FinancialType {
  id: FinancialTypeId;
  label: string;
  description: string;
  icon: string;
  /** Short tagline, max 14 words */
  tagline: string;
}

// CONSTANTS
export const FINANCIAL_TYPES: Record<FinancialTypeId, FinancialType> = {
  bauch_fuchs: {
    id: "bauch_fuchs",
    label: "Der Bauch-Fuchs",
    icon: "💛",
    tagline:
      "Du spürst, bevor du rechnest — und liegst öfter richtig als du denkst",
    description:
      "Geld löst bei dir mehr Gefühl als Rechnung aus — und das ist okay. Dein Bauch hat dich bisher durchgebracht, und er ist ein ernstzunehmender Ratgeber. Was dir noch fehlt: ein paar handfeste Werkzeuge, damit dein Bauchgefühl sich auf Zahlen stützen kann, die du verstehst. Keine Formeln, kein Fachchinesisch — nur Dinge, die du selbst nachvollziehen kannst.",
  },
  schutz_fuchs: {
    id: "schutz_fuchs",
    label: "Der Schutz-Fuchs",
    icon: "🛡️",
    tagline:
      "Sicherheit ist dein Anker — pass auf, dass er dich nicht auch festhält",
    description:
      "Du gehst Geld-Themen mit Vorsicht an, und das hat dich vor vielen Fehlern bewahrt. Gleichzeitig merkst du vielleicht selbst: manchmal hält dich das Sicherheits-Denken auch davon ab, Dinge zu tun, die dir langfristig gut täten. Zusammen schauen wir, wo dein Schutz dir hilft — und wo er dir eher im Weg steht.",
  },
  klar_fuchs: {
    id: "klar_fuchs",
    label: "Der Klar-Fuchs",
    icon: "🎯",
    tagline: "Klarer Kopf, klare Zahlen — du denkst, bevor du handelst",
    description:
      "Du gehst strukturiert an Geld ran — erst verstehen, dann entscheiden. Das ist eine starke Basis, auf der sich viel aufbauen lässt. Wir können uns also direkt den spannenderen Themen widmen: wie Kapital wirklich arbeitet, wo sich Mythen halten, und welche Muster im Kopf dir selbst die beste analytische Brille beschlagen lassen können.",
  },
  meister_fuchs: {
    id: "meister_fuchs",
    label: "Der Meister-Fuchs",
    icon: "👑",
    tagline: "Die Basics sitzen längst — jetzt geht's um die Feinheiten",
    description:
      "Du hast dein Fundament schon lange gelegt: Notgroschen, laufende Finanzen, erste Investitionen. Bei dir geht's nicht mehr um „wie fange ich an\", sondern um Feintuning — Steueroptimierung, langfristige Strategie, Fallstricke, die man erst sieht, wenn man drinsteckt. Hier bin ich für dich eher Sparringspartner als Lehrer.",
  },
  spuer_fuchs: {
    id: "spuer_fuchs",
    label: "Der Spür-Fuchs",
    icon: "🧭",
    tagline: "Wenig Erfahrung, aber ein richtig guter Riecher",
    description:
      "Du bist noch am Anfang deiner Finanz-Reise, aber dein Instinkt ist schon verblüffend gut. Das merkst du vielleicht selbst gar nicht — aber die Art, wie du Fragen stellst und Entscheidungen triffst, zeigt es. Wir können deshalb schneller ans Eingemachte als bei anderen Anfängern. Dein Riecher wird dich nicht hängen lassen — wir müssen ihn nur mit Wissen unterfüttern.",
  },
  kletter_fuchs: {
    id: "kletter_fuchs",
    label: "Der Kletter-Fuchs",
    icon: "🧗",
    tagline: "Schritt für Schritt — du baust dir dein Fundament",
    description:
      "Du bist mitten drin im Aufbau deines finanziellen Lebens — nicht ganz am Anfang, aber auch noch nicht fertig. Das ist eine spannende Phase: du hast schon erste Erfahrungen, aber es gibt noch viel, wo dir Klarheit fehlt. Wir nehmen uns das Schritt für Schritt vor, ohne Druck. Jede Etappe, die du gemacht hast, wird dein Fundament stabiler.",
  },
} as const;
export interface OnboardingInsights {
  financialType: FinancialType;
  primaryStrength: Insight;
  primaryChallenge: Insight;
  startingPoint: Insight;
  /** Second-best strength (only if score > 2) */
  secondaryStrength: Insight | null;
  /** Second-biggest challenge (only if score > 2) */
  secondaryChallenge: Insight | null;
  /** Cross-step inconsistencies — conversation hooks for Bea */
  inconsistencies: Inconsistency[];
  /** Detected crisis signals — triggers safety-net UI and chat behavior */
  crisisSignals: CrisisSignal[];
  /** Raw derived signals — useful for Bea's chat priming */
  signals: {
    maturity: FinancialMaturity;
    biasPattern: BiasPattern;
    knowledgeLevel: KnowledgeLevel;
    hasDebt: boolean;
    hasSignificantDebt: boolean;
    hasEmergencyFund: boolean;
    isStressedAboutMoney: boolean;
    relativePerformance: RelativePerformance;
  };
}

// MAIN ENTRY ----------------------------------------------------------------------------------------------------------------
export function generateInsights(profile: UserProfile): OnboardingInsights {
  const signals = extractSignals(profile);

  const strengths = getScoredStrengths(profile, signals);
  const challenges = getScoredChallenges(profile, signals);

  // Apply self-report bias penalty to all confidence values
  const withPenalty = (insight: Insight): Insight => ({
    ...insight,
    confidence: applyBiasPenalty(insight.confidence, profile),
  });

  const startingPoint = getStartingPoint(profile, signals);

  return {
    financialType: getFinancialType(profile, signals),
    primaryStrength: withPenalty(strengths[0].insight),
    primaryChallenge: withPenalty(challenges[0].insight),
    secondaryStrength:
      strengths.length > 1 && strengths[1].score > 2
        ? withPenalty(strengths[1].insight)
        : null,
    secondaryChallenge:
      challenges.length > 1 && challenges[1].score > 2
        ? withPenalty(challenges[1].insight)
        : null,
    startingPoint: withPenalty(startingPoint),
    inconsistencies: detectInconsistencies(profile),
    crisisSignals: detectCrisisSignals(profile),
    signals,
  };
}

// SIGNAL EXTRACTION ----------------------------------------------------------------------------------------------------------
function extractSignals(profile: UserProfile) {
  const maturity = getMaturityLevel(profile.persoenlichkeit ?? {});
  const biasPattern: BiasPattern = profile.szenario
    ? combineBiases(profile.szenario.windfallBias, profile.szenario.crisisBias)
    : "stable";
  const knowledgeLevel = getKnowledgeLevel(
    profile.wissenstest?.correctCount ?? 0,
  );

  return {
    maturity,
    biasPattern,
    knowledgeLevel,
    hasDebt: profile.hatSchulden,
    hasSignificantDebt: profile.schuldenOptionId === "debt_significant",
    hasEmergencyFund: profile.persoenlichkeit?.habit_emergency_fund === true,
    isStressedAboutMoney: profile.geldgefuehl === "stress",
    relativePerformance: getRelativePerformance(profile),
  };
}

// FINANCIAL TYPE -------------------------------------------------------------------------------------------------------------
// 6 Fuchs-Archetypen, gemappt aus maturity × bias pattern × money feeling.
// Die Namen sind Fuchs-thematisch und wärmend (nicht abwertend).
// Die Daten selbst leben in FINANCIAL_TYPES — diese Funktion macht nur die Auswahl.
function getFinancialTypeId(
  signals: OnboardingInsights["signals"],
): FinancialTypeId {
  const { maturity, biasPattern, isStressedAboutMoney } = signals;

  // Bauch-Fuchs — lebt im Moment, folgt dem Bauchgefühl
  if (biasPattern === "fragile" && maturity === "starter") {
    return "bauch_fuchs";
  }

  // Schutz-Fuchs — sucht Sicherheit, vermeidet Risiko
  if (biasPattern === "conservative" && isStressedAboutMoney) {
    return "schutz_fuchs";
  }

  // Klar-Fuchs — denkt strukturiert, entscheidet mit Kopf
  if (
    (biasPattern === "rational" || biasPattern === "stable") &&
    (maturity === "developing" || maturity === "established")
  ) {
    return "klar_fuchs";
  }

  // Meister-Fuchs — Basics sitzen, jetzt geht's um Feinheiten
  if (maturity === "established" && biasPattern !== "fragile") {
    return "meister_fuchs";
  }

  // Spür-Fuchs — wenig Erfahrung, guter Instinkt
  if (
    maturity === "starter" &&
    (biasPattern === "stable" || biasPattern === "rational")
  ) {
    return "spuer_fuchs";
  }

  // Kletter-Fuchs — Default: mittendrin im Aufbau
  return "kletter_fuchs";
}

function getFinancialType(
  _profile: UserProfile,
  signals: OnboardingInsights["signals"],
): FinancialType {
  return FINANCIAL_TYPES[getFinancialTypeId(signals)];
}

// ─── SCORE-BASED INSIGHT SYSTEM ----------------------------------------------------------------------------------------------
// Instead of first-match-wins, each candidate insight receives a
// numeric score (0-10) based on weighted profile signals.
// The top-scored candidate becomes Primary, second becomes Secondary.
interface ScoredInsight {
  score: number;
  /** Number of independent signals that contributed to this score */
  signalCount: number;
  insight: Insight;
}

// CONFIDENCE HELPERS ----------------------------------------------------------------------------------------------------------

/** Maps the number of contributing signals to a confidence value (0-1). */
export function signalCountToConfidence(count: number): number {
  if (count >= 3) return 0.9;
  if (count === 2) return 0.7;
  if (count === 1) return 0.5;
  return 0.3; // fallback / default candidates
}
/**
 * Returns a German hedging prefix based on confidence.
 * High confidence → assertive, low confidence → tentative.
 */
export function confidenceToHedge(confidence: number): string {
  if (confidence >= 0.8) return ""; // assertive: "Du bist..."
  if (confidence >= 0.5) return "Du wirkst auf mich wie jemand, der "; // "scheinst"
  return "Es scheint, als ob "; // tentative
}

// SELF-REPORT BIAS DETECTION ---------------------------------------------------------------------------------------------------
// Stub — full implementation in Baustein 5 (Reverse-Coding & Akquieszenz-Schutz).
// When bias is detected, all confidence values are reduced by 20%.

// CONSTANTS
const POSITIVE_HABIT_IDS = [
  "habit_checks_balance",
  "habit_knows_spending",
  "habit_auto_savings",
  "habit_emergency_fund",
  "habit_invested",
] as const;
/**
 * Detects whether the user's onboarding answers show signs of
 * self-report bias (acquiescence / social desirability).
 *
 * Returns true when ALL of the following hold — a statistically
 * improbable "everything is rosy" pattern:
 * - All 5 positive habits answered true
 * - geldgefuehl === "freedom" (no money stress)
 * - biasPattern === "stable" (perfectly balanced scenarios)
 * - habit_impulse_buying === false (denies any impulse buying)
 */
export function detectSelfReportBias(profile: UserProfile): boolean {
  const p = profile.persoenlichkeit ?? {};

  // All 5 positive habits must be true
  const allPositive = POSITIVE_HABIT_IDS.every((id) => p[id] === true);
  if (!allPositive) return false;

  // Money feeling must be carefree
  if (profile.geldgefuehl !== "freedom") return false;

  // Bias pattern must be "stable" (balanced)
  if (profile.szenario) {
    const pattern = combineBiases(
      profile.szenario.windfallBias,
      profile.szenario.crisisBias,
    );
    if (pattern !== "stable") return false;
  } else {
    return false; // can't assess without scenario data
  }

  // Must deny impulse buying (reverse-coded item)
  if (p.habit_impulse_buying !== false) return false;

  return true;
}
// CONFIDENCE REDUCTION FACTOR
const SELF_REPORT_BIAS_PENALTY = 0.8; // multiply confidence by 0.8 → 20% reduction
/**
 * Applies self-report bias penalty to a confidence value.
 * Only reduces if detectSelfReportBias() returns true.
 */
export function applyBiasPenalty(
  confidence: number,
  profile: UserProfile,
): number {
  if (!detectSelfReportBias(profile)) return confidence;
  return Math.round(confidence * SELF_REPORT_BIAS_PENALTY * 100) / 100;
}

// STRENGTH SCORING ------------------------------------------------------------------------------------------------------------
// Each strength candidate accumulates points from independent signals.
// signalCount tracks how many independent signals contributed → confidence.
function getScoredStrengths(
  profile: UserProfile,
  signals: OnboardingInsights["signals"],
): ScoredInsight[] {
  const candidates: ScoredInsight[] = [];

  // "Du bringst Wissen mit"
  {
    let score = 0;
    let sCount = 0;
    if (signals.knowledgeLevel === "advanced") {
      score += 5;
      sCount++;
    } else if (signals.knowledgeLevel === "intermediate") {
      score += 3;
      sCount++;
    }
    if (
      score > 0 &&
      (signals.biasPattern === "rational" || signals.biasPattern === "stable")
    ) {
      score += 1;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Du weißt, wovon du redest",
          description:
            "Im Quiz hast du gezeigt, dass du die Basics verstanden hast — ETFs, Zinseszins, Diversifikation. Das ist eine seltene Ausgangslage, auf der wir aufbauen können.",
          icon: "🧠",
          tone: "positive",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // "Du hast Routine"
  {
    let score = 0;
    let sCount = 0;
    if (signals.maturity === "established") {
      score += 5;
      sCount++;
    } else if (signals.maturity === "developing") {
      score += 3;
      sCount++;
    }
    if (score > 0 && signals.hasEmergencyFund) {
      score += 1;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Du hast schon Routine",
          description:
            "Die wichtigsten Finanz-Gewohnheiten sitzen bei dir bereits. Kontocheck, Sparautomatik, Notgroschen. Viele kämpfen jahrelang mit diesen Basics.",
          icon: "⚡",
          tone: "positive",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // "Du bleibst ausgeglichen"
  {
    let score = 0;
    let sCount = 0;
    if (signals.biasPattern === "stable") {
      score += 5;
      sCount++;
    } else if (signals.biasPattern === "rational") {
      score += 4;
      sCount++;
    }
    if (score > 0 && !signals.isStressedAboutMoney) {
      score += 1;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title:
            signals.biasPattern === "rational"
              ? "Du denkst mathematisch"
              : "Du bleibst ausgeglichen",
          description:
            signals.biasPattern === "rational"
              ? "Du triffst Geldentscheidungen mit dem Kopf, nicht aus dem Bauch. Das wird dir langfristig viel Geld sparen — und viel Stress."
              : "Egal ob Geld reinkommt oder rausmuss — du reagierst besonnen und überlegt. Das ist eine Superkraft im Umgang mit Geld, die man sich schwer antrainieren kann.",
          icon: signals.biasPattern === "rational" ? "🎯" : "⚖️",
          tone: "positive",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // "Du weißt wo du hinwillst"
  {
    let score = 0;
    let sCount = 0;
    const zielLen = profile.zielbild?.trim().length ?? 0;
    if (zielLen > 80) {
      score += 4;
      sCount++;
    } else if (zielLen > 40) {
      score += 2;
      sCount++;
    }
    if (score > 0 && profile.zeithorizont === "horizon_long") {
      score += 1;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Du weißt, wo du hinwillst",
          description:
            "Du hast dir die Mühe gemacht, dein Zielbild in eigenen Worten zu formulieren. Das ist mehr, als 90 % der Menschen tun — wir bauen genau darauf auf.",
          icon: "🧭",
          tone: "positive",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // Default fallback — always present with baseline score
  candidates.push({
    score: 1,
    signalCount: 0,
    insight: {
      title: "Du bist ehrlich zu dir selbst",
      description:
        "Du hast dir 12 Fragen lang die Zeit genommen, ehrlich zu reflektieren — auch bei schwierigen Themen wie Schulden oder Geldgefühlen. Das ist die wichtigste Voraussetzung für echten Fortschritt.",
      icon: "💛",
      tone: "positive",
      confidence: 0.3,
    },
  });

  // Sort descending by score, stable sort preserves insertion order for ties
  return candidates.sort((a, b) => b.score - a.score);
}

// CHALLENGE SCORING ------------------------------------------------------------------------------------------------------------
// Each challenge candidate accumulates points from problem signals.
function getScoredChallenges(
  profile: UserProfile,
  signals: OnboardingInsights["signals"],
): ScoredInsight[] {
  const candidates: ScoredInsight[] = [];

  // "Schulden"
  {
    let score = 0;
    let sCount = 0;
    if (signals.hasSignificantDebt) {
      score += 6;
      sCount++;
    } else if (signals.hasDebt) {
      score += 3;
      sCount++;
    }
    if (score > 0 && signals.knowledgeLevel === "beginner") {
      score += 1;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Schulden sind dein erstes Thema",
          description:
            "Solange offene Kredite oder Ratenkäufe laufen, die dir Zinsen kosten, ist Investieren fast nie sinnvoll. Mathematisch gesehen: Schulden tilgen = garantierte Rendite. Da starten wir.",
          icon: "🔓",
          tone: "cautious",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // "Geldstress"
  {
    let score = 0;
    let sCount = 0;
    if (signals.isStressedAboutMoney) {
      score += 5;
      sCount++;
    }
    const negativeImprints: string[] = ["scarcity", "conflict", "taboo"];
    if (score > 0 && negativeImprints.includes(profile.geldpraegung)) {
      score += 2;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Dein Verhältnis zu Geld ist angespannt",
          description:
            "Du hast gesagt, Geld macht dir Stress — das nehme ich ernst. Bevor wir über Strategien reden, müssen wir dafür sorgen, dass du dich nachts nicht mehr sorgst. Ein Notgroschen ist das erste konkrete Ziel.",
          icon: "💛",
          tone: "cautious",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // "Impulsivität / fragile"
  {
    let score = 0;
    let sCount = 0;
    if (signals.biasPattern === "fragile") {
      score += 5;
      sCount++;
    }
    if (score > 0 && signals.maturity === "starter") {
      score += 2;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Dein Bauchgefühl bestimmt zu viel",
          description:
            "Du reagierst stark auf den Moment — euphorisch bei gutem Geld, gestresst bei schlechtem. Wir bauen Automatismen, damit du nicht jedes Mal neu entscheiden musst. Weniger Willenskraft, mehr System.",
          icon: "🎢",
          tone: "cautious",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // "Kein Notgroschen"
  {
    let score = 0;
    let sCount = 0;
    if (!signals.hasEmergencyFund) {
      score += 4;
      sCount++;
    }
    if (score > 0 && signals.isStressedAboutMoney) {
      score += 2;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Dir fehlt ein Notgroschen",
          description:
            "Ohne 1-3 Monatsgehälter auf der hohen Kante wird jede unerwartete Ausgabe zum Stressfaktor. Das ist das erste, was wir aufbauen — bevor wir über Investieren reden.",
          icon: "🛡️",
          tone: "cautious",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // "Wissenslücke"
  {
    let score = 0;
    let sCount = 0;
    if (signals.knowledgeLevel === "beginner") {
      score += 4;
      sCount++;
    }
    if (
      score > 0 &&
      profile.prioritaeten.some((p) =>
        ["priority_investing", "priority_retirement"].includes(p),
      )
    ) {
      score += 2;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Dir fehlt noch Grundlagenwissen",
          description:
            "Kein Drama — das holen wir systematisch nach. Aber wir müssen mit den Basics anfangen, bevor komplexere Themen wie ETF-Strategien Sinn ergeben.",
          icon: "📚",
          tone: "neutral",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // "Zu vorsichtig"
  {
    let score = 0;
    let sCount = 0;
    if (signals.biasPattern === "conservative") {
      score += 4;
      sCount++;
    }
    if (score > 0 && profile.zeithorizont === "horizon_long") {
      score += 1;
      sCount++;
    }
    if (score > 0) {
      candidates.push({
        score,
        signalCount: sCount,
        insight: {
          title: "Du bist vielleicht zu vorsichtig",
          description:
            "Sicherheit ist dir wichtig — aber sicher heißt nicht automatisch sinnvoll. Geld auf dem Sparkonto verliert jedes Jahr an Kaufkraft. Wir finden den Punkt, an dem du Sicherheit und Wachstum gleichzeitig hast.",
          icon: "⚠️",
          tone: "neutral",
          confidence: signalCountToConfidence(sCount),
        },
      });
    }
  }

  // Default fallback
  candidates.push({
    score: 1,
    signalCount: 0,
    insight: {
      title: "Dir fehlt noch Konsistenz",
      description:
        "Du hast die richtigen Ideen und ein gutes Mindset, aber noch nicht alle Gewohnheiten automatisiert. Wir bauen Routinen, die sich selbst tragen, damit du nicht ständig neu entscheiden musst.",
      icon: "🔁",
      tone: "neutral",
      confidence: 0.3,
    },
  });

  return candidates.sort((a, b) => b.score - a.score);
}

// STARTING POINT --------------------------------------------------------------------------------------------------------------
function getStartingPoint(
  profile: UserProfile,
  signals: OnboardingInsights["signals"],
): Insight {
  if (signals.hasSignificantDebt) {
    return {
      title: "Schulden-Strategie entwickeln",
      description:
        "Wir schauen uns deine offenen Posten an, priorisieren nach Zinssatz und machen einen realistischen Tilgungsplan. Das ist dein erstes konkretes Ziel.",
      icon: "🔓",
      tone: "neutral",
      confidence: 0.9, // debt is a hard fact from the onboarding
    };
  }

  if (!signals.hasEmergencyFund && signals.isStressedAboutMoney) {
    return {
      title: "Notgroschen aufbauen",
      description:
        "Das ist die Grundlage für alles andere — und für deinen inneren Frieden. Wir berechnen, wie viel du brauchst und wie du es realistisch in den nächsten Monaten erreichst.",
      icon: "🛡️",
      tone: "neutral",
      confidence: 0.8, // two signals: no emergency fund + money stress
    };
  }

  const firstPriority = profile.prioritaeten?.[0];
  if (firstPriority) {
    const option = getPriorityOption(firstPriority);
    if (option) {
      return {
        title: `Zuerst: ${option.label}`,
        description: `Du hast „${option.label}" als wichtigstes Thema gewählt. Genau da starten wir! Ich habe konkrete Tools und Schritte vorbereitet, und wir gehen das systematisch an.`,
        icon: option.icon,
        tone: "neutral",
        confidence: 0.7, // single signal: user's explicit priority choice
      };
    }
  }

  return {
    title: "Überblick schaffen",
    description:
      "Wir fangen damit an, dass du genau weißt, wohin dein Geld jeden Monat fließt. Das ist die Basis — ohne Klarheit gibt es keine gute Strategie.",
    icon: "🗺️",
    tone: "neutral",
    confidence: 0.3, // fallback — no specific signals
  };
}

// VALUE-BASED TONE GENERATOR ---------------------------------------------------------------------------------------------------
// Maps selected LifeValues into a Bea speech-rule string.
// CONSTANTS
const VALUE_TONE_MAP: Record<LifeValue, string> = {
  security: "ruhig, planbar, Schritt für Schritt",
  freedom: "unabhängig, selbstbestimmt, finanzielle Freiheit als Ziel",
  family: "Verantwortung für andere, Vorsorge, Schutz der Lieben",
  experience: "lebendig, erfahrungsorientiert, Geld als Erlebnis-Mittel",
  status: "ehrgeizig, anerkennungs-orientiert, sichtbarer Erfolg",
  growth: "entwicklungsorientiert, lernhungrig, Wachstum als Selbstzweck",
} as const;
/**
 * Generates a speech-rule string from the user's selected life values.
 * Used in `buildProfileContext()` to calibrate Bea's tone.
 */
export function getValueBasedTone(values: LifeValue[]): string {
  if (values.length === 0) return "";
  const parts = values.map((v) => {
    const option = LIFE_VALUES.find((o) => o.id === v);
    const tone = VALUE_TONE_MAP[v];
    return option ? `${tone} (${option.label})` : tone;
  });
  return `Spreche ${parts.join(", aber betone auch ")}.`;
}

// ─── SYSTEM PROMPT ENHANCEMENT --------------------------------------------------------------------------------------------------
// Builds a markdown context block for Bea's chat system prompt.
// Uses the insights engine to give Bea a structured summary on top
// of the raw profile data.
export function buildProfileContext(profile: UserProfile): string {
  const lines: string[] = ["\n## Nutzerprofil (aus dem Onboarding)", ""];

  // Raw profile facts
  const situation = LIFE_SITUATION_OPTIONS.find(
    (o) => o.id === profile.lebenssituation,
  );
  if (situation) {
    lines.push(`- Lebenssituation: ${situation.label} (${situation.sub})`);
  }

  lines.push(`- Alter: ${profile.alter} Jahre`);

  const wohnung = WOHNSITUATION_OPTIONS.find(
    (o) => o.id === profile.wohnsituation,
  );
  if (wohnung) {
    lines.push(`- Wohnsituation: ${wohnung.label}`);
  }

  if (profile.einkommensRange && profile.einkommensRange !== "income_skip") {
    const einkommen = getEinkommensOption(profile.einkommensRange);
    if (einkommen) {
      lines.push(`- Einkommens-Range: ${einkommen.label} netto/Monat`);
    }
  }

  const schuldenOpt = profile.schuldenOptionId
    ? getSchuldenOption(profile.schuldenOptionId)
    : null;
  if (schuldenOpt) {
    lines.push(
      `- Schulden: ${schuldenOpt.label} — ${schuldenOpt.description}`,
    );
  }

  const zeit = getZeithorizontOption(profile.zeithorizont);
  if (zeit) {
    lines.push(`- Zeithorizont: ${zeit.label} (${zeit.description})`);
  }

  if (profile.prioritaeten.length) {
    const prioLabels = profile.prioritaeten
      .map((id) => getPriorityOption(id)?.label ?? id)
      .join(" → ");
    lines.push(`- Top-Prioritäten: ${prioLabels}`);
  }

  // Quiz: numerical score + derived level
  const knowledgeLevel = getKnowledgeLevel(profile.wissenstest.correctCount);
  lines.push(
    `- Wissens-Level: ${knowledgeLevel} (${profile.wissenstest.correctCount}/${KNOWLEDGE_QUIZ.length} richtig)`,
  );

  // Scenario: combined bias pattern, not raw answers
  if (profile.szenario) {
    const pattern = combineBiases(
      profile.szenario.windfallBias,
      profile.szenario.crisisBias,
    );
    lines.push(
      `- Verhaltens-Muster: ${pattern} (Geldsegen: ${profile.szenario.windfallBias}, Krise: ${profile.szenario.crisisBias})`,
    );
  }

  // Personality: derived maturity + raw established habits
  const maturity = getMaturityLevel(profile.persoenlichkeit);
  lines.push(`- Finanz-Reife: ${maturity}`);

  const establishedHabits = Object.entries(profile.persoenlichkeit)
    .filter(([, v]) => v)
    .map(([k]) => k);
  if (establishedHabits.length) {
    lines.push(
      `- Bereits etablierte Gewohnheiten: ${establishedHabits.join(", ")}`,
    );
  }

  // Money feeling + imprint
  lines.push(
    `- Einstellung zu Geld: ${
      profile.geldgefuehl === "freedom"
        ? "Sieht Geld als Freiheit/Werkzeug"
        : "Hat Stress mit dem Thema Geld"
    }`,
  );

  const praegung = getGeldpraegungOption(profile.geldpraegung);
  if (praegung) {
    lines.push(
      `- Prägung durch Elternhaus: ${praegung.label} — ${praegung.description}`,
    );
  }

  if (profile.zielbild.trim()) {
    lines.push(`- Finanzielles Zielbild: "${profile.zielbild.trim()}"`);
  }

  // Life values + value-based speech rule
  if (profile.lebenswerte.length > 0) {
    const valueLabels = profile.lebenswerte
      .map((v) => LIFE_VALUES.find((o) => o.id === v)?.label ?? v)
      .join(", ");
    lines.push(`- Lebenswerte: ${valueLabels}`);
    const toneRule = getValueBasedTone(profile.lebenswerte);
    if (toneRule) {
      lines.push(`- Sprachregel für Bea: ${toneRule}`);
    }
  }

  // Add insights summary on top
  const insights = generateInsights(profile);
  lines.push("");
  lines.push("## Bea's Analyse (aus dem Onboarding abgeleitet)");
  lines.push("");
  lines.push(
    `- Finanz-Typ: ${insights.financialType.label} — ${insights.financialType.tagline}`,
  );
  lines.push(
    `- Größte Stärke: ${insights.primaryStrength.title} (Confidence: ${insights.primaryStrength.confidence.toFixed(1)} — ${insights.primaryStrength.confidence >= 0.8 ? "assertive Sprache verwenden" : insights.primaryStrength.confidence >= 0.5 ? "vorsichtig formulieren" : "sehr tentativ bleiben"})`,
  );
  if (insights.secondaryStrength) {
    lines.push(
      `- Zweitstärkste Stärke: ${insights.secondaryStrength.title} (Confidence: ${insights.secondaryStrength.confidence.toFixed(1)})`,
    );
  }
  lines.push(
    `- Größte Baustelle: ${insights.primaryChallenge.title} (Confidence: ${insights.primaryChallenge.confidence.toFixed(1)} — ${insights.primaryChallenge.confidence >= 0.8 ? "assertive Sprache verwenden" : insights.primaryChallenge.confidence >= 0.5 ? "vorsichtig formulieren" : "sehr tentativ bleiben"})`,
  );
  if (insights.secondaryChallenge) {
    lines.push(
      `- Zweitgrößte Baustelle: ${insights.secondaryChallenge.title} (Confidence: ${insights.secondaryChallenge.confidence.toFixed(1)})`,
    );
  }
  lines.push(
    `- Empfohlener Startpunkt: ${insights.startingPoint.title} (Confidence: ${insights.startingPoint.confidence.toFixed(1)})`,
  );

  // Relative performance vs. life phase
  const relPerf = insights.signals.relativePerformance;
  const relPerfLabel =
    relPerf === "ahead"
      ? "Über Erwartung für diese Lebensphase — ausdrücklich loben!"
      : relPerf === "behind"
        ? "Unter Erwartung für diese Lebensphase — ermutigend und ohne Vorwurf ansprechen"
        : "Im erwarteten Bereich für diese Lebensphase";
  lines.push(`- Lebensphasen-Performance: ${relPerf} — ${relPerfLabel}`);

  // Cross-validation inconsistencies — conversation hooks
  if (insights.inconsistencies.length > 0) {
    lines.push("");
    lines.push("## Erkannte Inkonsistenzen (behutsam im Chat ansprechen)");
    lines.push("");
    lines.push(
      "Die folgenden Widersprüche zwischen den Onboarding-Antworten sind spannende Gesprächsanlässe. Bea soll sie NIEMALS als Vorwurf formulieren, sondern als neugierige Beobachtung — offen, wertfrei, einladend.",
    );
    lines.push("");
    for (const inc of insights.inconsistencies) {
      lines.push(`- ${inc.id} (${inc.severity}): ${inc.description}`);
      lines.push(`  → Gesprächs-Einstieg: "${inc.chatPrompt}"`);
    }
  }

  // Behavioral instructions
  lines.push("");
  lines.push("## Verhaltensregeln für Bea");
  lines.push("");
  lines.push(
    'Passe deine Antworten an dieses Profil an. Nutze Beispiele und Sprache, die zu dieser Lebenssituation passen. Wenn jemand Schüler:in ist, rede nicht über Gehaltsverhandlungen. Wenn jemand bei Finanzen Stress empfindet, sei besonders einfühlsam und ermutigend. Wenn das Wissen niedrig ist, erkläre Grundbegriffe. Wenn das Wissen hoch ist, gehe direkt in die Tiefe. Berücksichtige die Wohn- und Einkommenssituation für realistische Empfehlungen. Wenn Schulden vorhanden, priorisiere Schuldenabbau in deinen Tipps. Berücksichtige den Verhaltens-Bias: bei "fragile" baue Automatismen, bei "conservative" zeige Wachstumschancen, bei "rational" gib mathematische Argumente.',
  );

  // Confidence-based speech rules
  lines.push("");
  lines.push("### Confidence-basierte Sprache");
  lines.push("");
  lines.push(
    [
      "Die Confidence-Werte oben geben an, wie sicher Bea's Analyse ist. Passe deine Sprache entsprechend an:",
      '- Confidence ≥ 0.8: Assertiv formulieren. "Du bist gut darin..." / "Dein größtes Thema ist..."',
      '- Confidence 0.5–0.7: Vorsichtig formulieren. "Du wirkst auf mich wie jemand, der..." / "Es sieht so aus, als ob..."',
      '- Confidence < 0.5: Sehr tentativ bleiben. "Es scheint, als ob..." / "Möglicherweise..."',
      "- Wenn du einen Insight im Chat aufgreifst, nutze den passenden Hedging-Level. NIEMALS einen Low-Confidence-Insight als Tatsache darstellen.",
    ].join("\n"),
  );

  // Life-phase-relative speech rules
  if (relPerf === "ahead") {
    lines.push("");
    lines.push("### Lebensphasen-Kalibrierung: AHEAD");
    lines.push("");
    lines.push(
      [
        "Der User ist seiner Lebensphase voraus. Bea soll das ausdrücklich anerkennen:",
        `- \"Du bist deinem Alter weit voraus — das ist wirklich beeindruckend.\"`,
        "- Vermeide Basics-Erklärungen, gehe direkt in die Tiefe.",
        "- Stelle höhere Herausforderungen, z.B. Optimierungsstrategien statt Aufbau-Tipps.",
        '- Nutze die Stärken als Sprungbrett: "Weil du schon X drauf hast, können wir direkt Y angehen."',
      ].join("\n"),
    );
  } else if (relPerf === "behind") {
    lines.push("");
    lines.push("### Lebensphasen-Kalibrierung: BEHIND");
    lines.push("");
    lines.push(
      [
        "Der User liegt unter der Erwartung für seine Lebensphase. Bea soll das NIEMALS als Vorwurf formulieren:",
        `- \"Es gibt noch Lücken, die typisch in deiner Phase sind — aber wir können sie schließen.\"`,
        '- Normalisiere: "Viele in deiner Situation haben genau die gleichen Themen."',
        "- Fange mit Quick Wins an, um Selbstwirksamkeit aufzubauen.",
        "- Vermeide Vergleiche mit anderen. Fokus auf den individuellen Fortschritt.",
      ].join("\n"),
    );
  }

  // Crisis signals — if any, add urgent behavioral rules
  const crisisSignals = detectCrisisSignals(profile);
  if (crisisSignals.length > 0) {
    lines.push("");
    lines.push("## ⚠️ Wichtige Verhaltensregeln — Crisis-Signals erkannt");
    lines.push("");
    for (const signal of crisisSignals) {
      lines.push(
        `- Crisis-Signal: ${signal.type} (${signal.severity}) — ${signal.description}`,
      );
    }
    lines.push("");
    lines.push(
      [
        "Bea-Verhalten bei Crisis-Signals:",
        "- Sei besonders behutsam und einfühlsam. Vermeide Druck oder Vorwürfe.",
        "- Gib keine konkreten Finanz-Strategien, bevor du geprüft hast, ob der User akute Hilfe braucht.",
        "- Verweise proaktiv auf professionelle Hilfsangebote: Schuldnerberatung der Caritas (kostenlos, online: caritas.de), Verbraucherzentrale, oder Telefonseelsorge (0800 111 0 111) bei psychischem Stress.",
        "- Stelle keine diagnostischen Fragen — Bea ist keine Therapeutin.",
        "- Wenn der User von akuter Not spricht, hat der Verweis auf professionelle Hilfe IMMER Vorrang vor Finanz-Bildung.",
      ].join("\n"),
    );
  }

  // Hard legal / compliance rules — NEVER override
  lines.push("");
  lines.push("## 🚨 Zwingende Bea-Regeln (NIEMALS verletzen)");
  lines.push("");
  lines.push(
    [
      "1. Bea darf NIEMALS spezifische Finanzprodukte empfehlen. Das umfasst:",
      '   - Konkrete Aktien oder ETF-Namen (z.B. "Kauf den iShares MSCI World")',
      "   - Konkrete Versicherungs-Anbieter oder -Tarife",
      "   - Konkrete Banken oder Kreditkarten-Produkte",
      "   - Konkrete Kredite, Hypotheken- oder Sparangebote",
      "2. Bea darf erklären, wie ETFs, Versicherungen, Kredite etc. funktionieren — als Bildungsthema. Sie darf NICHT konkrete Produkte empfehlen.",
      "3. Wenn der User explizit nach Produktempfehlungen fragt, muss Bea freundlich erklären, dass sie das nicht darf, und auf lizenzierte Berater verweisen (Honorarberater, Verbraucherzentrale).",
      "4. Bea ist Lernbegleiterin, keine Anlageberaterin im Sinne des §1 KWG und keine Versicherungsvermittlerin nach §34d GewO.",
      "5. Bei Anzeichen von akuter finanzieller Not hat der Verweis auf professionelle Hilfsangebote (Schuldnerberatung, Telefonseelsorge) IMMER Vorrang vor Finanz-Bildung.",
    ].join("\n"),
  );

  return lines.join("\n");
}
