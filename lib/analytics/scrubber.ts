// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — PII-Scrubber
// ─────────────────────────────────────────────────────────────
// Entfernt / ersetzt personenbezogene Daten aus Freitext bevor
// die Daten ins Event-Log landen. Regex-basiert, first line of defense.
// Server-seitig sollte ein NER-Scrubber nachgeschaltet werden.
// ─────────────────────────────────────────────────────────────

// CONSTANTS — Regex-Patterns für häufige PII-Typen
const PII_PATTERNS: ReadonlyArray<{ name: string; regex: RegExp; replacement: string }> = [
  // E-Mail-Adressen
  {
    name: "email",
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: "[EMAIL]",
  },
  // Deutsche IBAN
  {
    name: "iban_de",
    regex: /\bDE\d{2}\s?(?:\d{4}\s?){4}\d{2}\b/gi,
    replacement: "[IBAN]",
  },
  // Generische IBAN (andere Länder)
  {
    name: "iban_generic",
    regex: /\b[A-Z]{2}\d{2}\s?(?:[A-Z0-9]{4}\s?){3,8}[A-Z0-9]{1,4}\b/g,
    replacement: "[IBAN]",
  },
  // Deutsche Telefonnummern (grob)
  {
    name: "phone_de",
    regex: /\b(?:\+49|0049|0)[\s-]?(?:\d[\s-]?){6,14}\d\b/g,
    replacement: "[PHONE]",
  },
  // Kreditkarten-Nummern (16 Ziffern, mit/ohne Trennzeichen)
  {
    name: "credit_card",
    regex: /\b(?:\d[ -]?){13,19}\b/g,
    replacement: "[CARD]",
  },
  // Deutsche KFZ-Kennzeichen (z.B. "M-AB 1234", "B-XY 99")
  {
    name: "license_plate_de",
    regex: /\b[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}\s?\d{1,4}\b/g,
    replacement: "[PLATE]",
  },
  // URLs (potentiell sensible Query-Parameter)
  {
    name: "url",
    regex: /https?:\/\/[^\s]+/g,
    replacement: "[URL]",
  },
];

// CONSTANTS
const MAX_FREETEXT_LENGTH = 4000; // längere Nachrichten werden abgeschnitten

/**
 * Scrubbt einen Freitext von häufigen PII-Typen.
 * Wird VOR dem Persistieren ins Event-Log ausgeführt.
 */
export function scrubPII(text: string): string {
  if (!text) return text;
  let cleaned = text;
  for (const { regex, replacement } of PII_PATTERNS) {
    cleaned = cleaned.replace(regex, replacement);
  }
  if (cleaned.length > MAX_FREETEXT_LENGTH) {
    cleaned = cleaned.slice(0, MAX_FREETEXT_LENGTH) + "…[TRUNCATED]";
  }
  return cleaned;
}

/**
 * Prüft, ob ein Text potentiell noch PII enthält.
 * Nur für Debug/Dev — nicht im Produktions-Flow aufrufen.
 */
export function detectPII(text: string): string[] {
  const found: string[] = [];
  for (const { name, regex } of PII_PATTERNS) {
    // Regex-State zurücksetzen (globale Flags)
    const r = new RegExp(regex.source, regex.flags);
    if (r.test(text)) found.push(name);
  }
  return found;
}

/**
 * Verwandelt einen numerischen Wert in einen Bucket-String.
 * Für Alter, Einkommen etc.
 */
export function bucket(value: number, boundaries: readonly number[]): string {
  if (value < boundaries[0]) return `<${boundaries[0]}`;
  for (let i = 0; i < boundaries.length - 1; i++) {
    if (value < boundaries[i + 1]) {
      return `${boundaries[i]}-${boundaries[i + 1] - 1}`;
    }
  }
  return `${boundaries[boundaries.length - 1]}+`;
}

// CONSTANTS
const AGE_BOUNDARIES = [18, 23, 28, 35] as const;

export function ageBucket(age: number): string {
  return bucket(age, AGE_BOUNDARIES);
}
