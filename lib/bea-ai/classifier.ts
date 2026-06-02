// ─────────────────────────────────────────────────────────────
// Bea AI — Topic-Classifier (Pre-Call Gate)
//
// Deterministische Vor-Klassifikation. Läuft VOR dem Haupt-Modell
// und prüft, ob der Nutzer eine individualisierte Anlageempfehlung
// oder eine Beurteilung eines konkreten Finanzprodukts will.
//
// Fail-OPEN: bei API-/Parse-Fehler → "NEIN" (durchlassen). Der Klassifikator
// ist nur die ERSTE Schranke — das Haupt-Modell verweigert regulierte Beratung
// ohnehin per System-Prompt (§34d/§34f GewO, belegt: es lehnt Tesla/Krypto von
// sich aus ab). Fail-closed führte bei transientem Anthropic-Overload zu einer
// "Beratungs-Wall" für harmlose Nachrichten ("ja", "warum die App?"). Daher:
// nur ein EXPLIZITES "JA"-Verdikt blockt; alles andere (inkl. Fehler) lässt das
// Modell antworten. Retries gegen Overload: SDK maxRetries (siehe client.ts).
// ─────────────────────────────────────────────────────────────

import { BEA_MODEL_CLASSIFIER, getAnthropicClient } from "@/lib/bea-ai/client";

// CONSTANTS
const MAX_INPUT_CHARS = 1500;
const MAX_OUTPUT_TOKENS = 4;
const CLASSIFIER_SYSTEM = `Du bist ein deterministischer Klassifikator. Beantworte ausschließlich mit "JA" oder "NEIN", ohne weitere Worte.

Frage: Bittet der Nutzer um eine individualisierte Anlageempfehlung, eine konkrete Kauf- oder Verkaufsempfehlung für ein bestimmtes Wertpapier, eine Beurteilung eines konkreten Finanzprodukts (Aktie, ETF, Fonds, Anleihe, Zertifikat, Derivat, Kryptowährung, Lebensversicherung, Immobilien-Investment, Kredit) oder eine personalisierte Portfolio-Allokation für seine eigene Situation?

Bildungsfragen wie "Was ist ein ETF?" oder "Wie funktioniert Zinseszins?" sind NEIN.
Konkrete Fragen wie "Soll ich Tesla kaufen?", "Lohnt sich der MSCI World für mich?", "Wie soll ich meine 10.000 Euro investieren?", "Welcher Broker ist der beste für mich?" sind JA.

Antworte nur mit JA oder NEIN.`;

// Voice-Rule-konform: keine Gedankenstriche zwischen Satzteilen,
// kein Markdown, normale "..." Anführungszeichen, duzen, max ein
// Emoji. Verweist auf lizenzierte Berater plus Verbraucherzentrale.
export const ADVICE_REFUSAL_TEMPLATE =
  'Da muss ich kurz stoppen. Konkrete Tipps zu einzelnen Aktien, ETFs oder "soll ich das kaufen" darf ich dir nicht geben, das ist rechtlich Sache von lizenzierten Beratern. Wenn du eine echte Entscheidung treffen willst, sprich am besten mit einem unabhängigen Berater oder schau bei der Verbraucherzentrale vorbei, die beraten günstig und neutral. Was ich aber super gerne mache: dir erklären, wie ETFs oder Aktien grundsätzlich funktionieren. Magst du das? 🧡';

export async function classifyAdviceRequest(
  userMessage: string,
): Promise<"JA" | "NEIN"> {
  try {
    const client = getAnthropicClient();
    const res = await client.messages.create({
      model: BEA_MODEL_CLASSIFIER,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: CLASSIFIER_SYSTEM,
      messages: [{ role: "user", content: userMessage.slice(0, MAX_INPUT_CHARS) }],
    });
    const block = res.content[0];
    // Kein Text-Block → unklar → fail-open (Modell-Guard greift).
    if (!block || block.type !== "text") return "NEIN";
    const verdict = block.text.trim().toUpperCase().slice(0, 4);
    if (verdict.startsWith("JA")) return "JA"; // nur explizites JA blockt
    // "NEIN" oder alles Unklare → durchlassen.
    return "NEIN";
  } catch {
    // API-Fehler (z. B. Anthropic "Overloaded") → fail-open, NICHT blockieren.
    // Sonst entstünde eine Beratungs-Wall für harmlose Nachrichten.
    return "NEIN";
  }
}
