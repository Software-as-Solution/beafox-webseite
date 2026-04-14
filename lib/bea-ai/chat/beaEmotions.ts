// ─── BEA EMOTIONS ─────────────────────────────────────────
// Maps emotional states to mascot assets and provides logic for
// inferring the right emotion based on chat context.

export type BeaEmotion =
  | "online_default"
  | "thinking"
  | "typing"
  | "happy"
  | "loving"
  | "empathetic"
  | "confused"
  | "excited_idea"
  | "welcome"
  | "companion"
  | "friendly"
  | "sleeping"
  | "returning";

// CONSTANTS
export const BEA_EMOTION_ASSETS: Record<BeaEmotion, string> = {
  online_default: "/Maskottchen/Maskottchen-Hero.webp",
  thinking: "/Maskottchen/Maskottchen-Beratung.webp",
  typing: "/Maskottchen/Maskottchen-Hero.webp",
  happy: "/Maskottchen/Maskottchen-Freude.webp",
  loving: "/Maskottchen/Maskottchen-Herzen.webp",
  empathetic: "/Maskottchen/Maskottchen-Weinen.webp",
  confused: "/Maskottchen/Maskottchen-Unklar.webp",
  excited_idea: "/Maskottchen/Maskottchen-Loesung.webp",
  welcome: "/Maskottchen/Maskottchen-Welcome.webp",
  companion: "/Maskottchen/Maskottchen-Begleitung.webp",
  friendly: "/Maskottchen/Maskottchen-Friends.webp",
  sleeping: "/Maskottchen/Maskottchen-Hero.webp",
  returning: "/Maskottchen/Maskottchen-Hero.webp",
} as const;

// CONSTANTS — keyword sets for context inference
const EMPATHETIC_KEYWORDS = [
  "weiß nicht weiter",
  "verzweifelt",
  "stress",
  "angst",
  "überfordert",
  "schulden",
  "kann nicht",
  "schlimm",
  "schwer",
  "traurig",
] as const;

const EXCITED_KEYWORDS = [
  "geschafft",
  "endlich",
  "super",
  "mega",
  "geil",
  "mein ziel",
  "freue mich",
  "klappt",
] as const;

const CONFUSED_KEYWORDS = [
  "verstehe nicht",
  "was bedeutet",
  "wie meinst",
  "kapier ich nicht",
  "?",
  "wieso",
  "warum",
] as const;

interface EmotionContext {
  /** The latest user message — used to detect mood-relevant keywords. */
  userMessage?: string;
  /** Bea is currently producing a response. */
  isStreaming: boolean;
  /** Bea is in the "considering" pre-stream phase. */
  isThinking: boolean;
  /** Where in the chat lifecycle we are. */
  chatStage: "greeting" | "active" | "idle";
  /** Optional override (e.g. when a card explicitly sets the emotion). */
  override?: BeaEmotion;
}

/**
 * Infers the right Bea emotion from chat context. Used to drive the
 * presence header and avatar visuals. Returns a `BeaEmotion` that
 * maps directly to an asset via {@link BEA_EMOTION_ASSETS}.
 */
export function inferBeaEmotionFromContext(
  context: EmotionContext,
): BeaEmotion {
  if (context.override) return context.override;
  if (context.chatStage === "greeting") return "welcome";
  if (context.isThinking) return "thinking";
  if (context.isStreaming) return "typing";
  if (context.chatStage === "idle") return "friendly";

  const msg = context.userMessage?.toLowerCase() ?? "";
  if (msg) {
    if (EMPATHETIC_KEYWORDS.some((k) => msg.includes(k))) return "empathetic";
    if (EXCITED_KEYWORDS.some((k) => msg.includes(k))) return "excited_idea";
    if (CONFUSED_KEYWORDS.some((k) => msg.includes(k))) return "confused";
  }
  return "online_default";
}

/** Returns the asset path for a given emotion. */
export function getEmotionAsset(emotion: BeaEmotion): string {
  return BEA_EMOTION_ASSETS[emotion];
}
