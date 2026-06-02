// ─────────────────────────────────────────────────────────────
// sanitizeBeaOutput
//
// Deterministischer Post-Processor für Beas LLM-Output.
// Erzwingt die Voice-Regeln aus lib/bea-ai/system-prompt.ts,
// wenn Claude unter Last vom Stil abweicht (Markdown, Gedanken-
// striche zwischen Satzteilen, deutsche Anführungszeichen).
//
// Idempotent: sanitizeBeaOutput(sanitizeBeaOutput(x)) === sanitizeBeaOutput(x).
// Läuft am Stream-Ende, NICHT pro Delta, damit Token-Splits
// nicht mitten in einem Marker hängen bleiben.
// ─────────────────────────────────────────────────────────────

export function sanitizeBeaOutput(text: string): string {
  if (!text) return text;
  let out = text;

  // 1. Triple-backtick Fenced-Blocks → inneren Inhalt behalten
  out = out.replace(/```[a-zA-Z0-9_-]*\n?([\s\S]*?)```/g, "$1");

  // 2. Einzel-Backticks komplett entfernen
  out = out.replace(/`+/g, "");

  // 3. Headings am Zeilenanfang strippen
  out = out.replace(/^[ \t]*#{1,6}[ \t]+/gm, "");

  // 4. Bold **text** und Italic *text* / _text_
  out = out.replace(/\*\*(.+?)\*\*/g, "$1");
  out = out.replace(/(^|[^*\w])\*(?!\s)([^*\n]+?)(?<!\s)\*(?!\w)/g, "$1$2");
  out = out.replace(/(^|[^_\w])_(?!\s)([^_\n]+?)(?<!\s)_(?!\w)/g, "$1$2");

  // 5. Listen-Bullets am Zeilenanfang (-, *, •)
  out = out.replace(/^[ \t]*[-*•][ \t]+/gm, "");

  // 5b. Nummerierte Listen am Zeilenanfang (1. 2. 3., 1) 2) 3)).
  // Claude umgeht das Bullet-Verbot manchmal mit Zahlen. Nur am
  // Zeilenanfang strippen, damit Jahreszahlen wie "2026." mitten
  // im Satz unangetastet bleiben.
  out = out.replace(/^[ \t]*\d{1,2}[.)][ \t]+/gm, "");

  // 6. Spaced em/en-dash zwischen Satzteilen → "." oder ","
  //    Nächstes Zeichen Großbuchstabe → ". ", Kleinbuchstabe → ", ".
  //    Bindestriche IN Wörtern (Start-up, E-Mail) bleiben unangetastet,
  //    da die Regel auf Leerzeichen vor UND nach dem Dash besteht.
  out = out.replace(/[ \t]+[—–][ \t]+(.)/g, (_match, next: string) =>
    /[A-ZÄÖÜ]/.test(next) ? ". " + next : ", " + next,
  );

  // 7. Deutsche Anführungszeichen → normale doppelte/einfache
  out = out.replace(/[„"]/g, '"').replace(/[‚']/g, "'");

  // 8. Doppelte Whitespaces aus den Substitutionen wieder einkollabieren
  out = out.replace(/[ \t]{2,}/g, " ");

  return out;
}
