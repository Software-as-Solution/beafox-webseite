// ─────────────────────────────────────────────────────────────
// Bea AI — Ratgeber → Bea Deep-Link Topic Seeds
// ─────────────────────────────────────────────────────────────
// Mappt die Ratgeber-Kategorie-Slugs (BLOG_CATEGORIES in @/lib/blog)
// auf eine Seed-Frage, mit der Bea direkt ins Thema startet, sowie
// auf eine passende `lebenssituation` (UserProfile-Shape aus
// @/lib/bea-ai/onboarding) für ein leichtes Default-Profil.
//
// Wird vom Deep-Link `/bea-ai?topic=<slug>` genutzt: bei bekanntem
// Slug überspringt die Seite Welcome + Onboarding und schickt die
// Seed-Frage GENAU EINMAL (ref-guarded) durch die normale, gecappte
// /api/bea-ai/chat-Route. Unbekannter/fehlender Slug → normaler Flow.
// ─────────────────────────────────────────────────────────────

import type { BlogCategorySlug } from "@/lib/blog";

// Gültige `lebenssituation`-Werte stammen aus LIFE_SITUATION_OPTIONS
// (@/lib/bea-ai/onboarding): schueler | azubi | student | berufseinstieg
// | berufstaetig. Wir referenzieren den string-Typ des Profils direkt.
import type { UserProfile } from "@/lib/bea-ai/onboarding";

// TYPES
export interface TopicSeed {
  /** Erste Nutzer-Nachricht, die Bea automatisch beantwortet. */
  seedQuestion: string;
  /** Leichtes Default-Profil-Signal — gemappt auf UserProfile.lebenssituation. */
  lebenssituation: UserProfile["lebenssituation"];
}

// CONSTANTS
// Keys sind exakt die BLOG_CATEGORIES-Slugs. Bewusst als Record über
// BlogCategorySlug typisiert, damit ein neuer Ratgeber-Slug einen
// Compile-Fehler erzeugt, bis er hier eine Seed-Frage bekommt.
export const TOPIC_SEEDS: Record<BlogCategorySlug, TopicSeed> = {
  azubis: {
    lebenssituation: "azubi",
    seedQuestion:
      "Als Azubi: Wie fange ich am besten mit meinem ersten Gehalt und meinem Geld an?",
  },
  schueler: {
    lebenssituation: "schueler",
    seedQuestion:
      "Ich bin noch in der Schule — wie kann ich mit Taschengeld oder Nebenjob clever mit Geld umgehen?",
  },
  studenten: {
    lebenssituation: "student",
    seedQuestion:
      "Als Student:in: Wie komme ich finanziell gut durchs Studium, ohne ständig knapp zu sein?",
  },
  berufseinsteiger: {
    lebenssituation: "berufseinstieg",
    seedQuestion:
      "Frisch im Job: Worauf sollte ich beim Berufseinstieg finanziell als Erstes achten?",
  },
  lebenssituationen: {
    lebenssituation: "berufstaetig",
    seedQuestion:
      "Bei einer großen Lebensveränderung (z. B. Umzug, Zusammenziehen, Familie) — worauf muss ich finanziell achten?",
  },
  investieren: {
    lebenssituation: "berufstaetig",
    seedQuestion:
      "Ich möchte mit dem Investieren starten — wie fange ich als Anfänger:in mit ETFs und Co. richtig an?",
  },
};

/**
 * Liefert den TopicSeed für einen Slug, oder `null` wenn der Slug
 * unbekannt/leer ist. Niemals werfen — der Deep-Link fällt bei
 * `null` einfach auf den normalen Welcome-Flow zurück.
 */
export function getTopicSeed(slug: string | null | undefined): TopicSeed | null {
  if (!slug) return null;
  return (TOPIC_SEEDS as Record<string, TopicSeed>)[slug] ?? null;
}
