/**
 * Interactive element definitions for guides.
 * Each guide can have checklists, quizzes, and calculators.
 * These are keyed by guide slug — if a slug isn't here, generic fallbacks are shown.
 */

import type { ChecklistItem } from "@/components/guide/GuideChecklist";
import type { QuizQuestion } from "@/components/guide/GuideQuiz";
import type { CalcField, CalcResult } from "@/components/guide/GuideCalculator";

export interface GuideInteractiveData {
  checklist?: { title?: string; items: ChecklistItem[] };
  quiz?: { title?: string; questions: QuizQuestion[] };
  calculator?: {
    title?: string;
    description?: string;
    fields: CalcField[];
    results: CalcResult[];
  };
}

const fmt = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const GUIDE_INTERACTIVE: Record<string, GuideInteractiveData> = {
  "taschengeld-richtig-einteilen": {
    checklist: {
      title: "Taschengeld-Checkliste",
      items: [
        { id: "c1", label: "Monatliches Taschengeld notieren", hint: "Schreib auf, wie viel du bekommst" },
        { id: "c2", label: "50% für Notwendiges einplanen", hint: "Schulsachen, Bus, Essen" },
        { id: "c3", label: "30% für Spaß reservieren", hint: "Kino, Gaming, Snacks" },
        { id: "c4", label: "20% sparen", hint: "Für größere Wünsche zurücklegen" },
        { id: "c5", label: "Spardose oder Sparkonto einrichten" },
      ],
    },
    quiz: {
      title: "Taschengeld-Check",
      questions: [
        {
          question: "Was bedeutet die 50-30-20 Regel?",
          options: [
            { label: "50% sparen, 30% ausgeben, 20% investieren" },
            { label: "50% Notwendiges, 30% Spaß, 20% Sparen", correct: true },
            { label: "50% Spaß, 30% Sparen, 20% Notwendiges" },
          ],
          explanation:
            "Die 50-30-20 Regel teilt dein Geld in: 50% für Notwendiges (Essen, Schule), 30% für Freizeit und 20% zum Sparen.",
        },
        {
          question: "Warum ist es sinnvoll, schon als Schüler zu sparen?",
          options: [
            { label: "Weil Eltern es verlangen" },
            { label: "Weil man die Gewohnheit früh lernt", correct: true },
            { label: "Weil man sonst bestraft wird" },
          ],
          explanation:
            "Früh sparen zu lernen baut eine wichtige Gewohnheit auf. Wer es jung lernt, hat es als Erwachsener deutlich leichter.",
        },
      ],
    },
    calculator: {
      title: "Taschengeld-Rechner",
      description: "Berechne, wie du dein Taschengeld aufteilen kannst",
      fields: [
        { id: "income", label: "Taschengeld pro Monat", suffix: "€", defaultValue: 30, min: 0, step: 5 },
      ],
      results: [
        { label: "Notwendiges (50%)", compute: (v) => fmt((v.income ?? 0) * 0.5) + " €" },
        { label: "Spaß (30%)", compute: (v) => fmt((v.income ?? 0) * 0.3) + " €" },
        { label: "Sparen (20%)", compute: (v) => fmt((v.income ?? 0) * 0.2) + " €", highlight: true },
        { label: "Gespart nach 12 Monaten", compute: (v) => fmt((v.income ?? 0) * 0.2 * 12) + " €", highlight: true },
      ],
    },
  },

  "erstes-gehalt-was-tun": {
    checklist: {
      title: "Erstes-Gehalt-Checkliste",
      items: [
        { id: "c1", label: "Gehaltsabrechnung verstehen", hint: "Brutto vs. Netto, Abzüge prüfen" },
        { id: "c2", label: "Fixkosten auflisten", hint: "Miete, Versicherung, Handy" },
        { id: "c3", label: "Notgroschen starten", hint: "Ziel: 3 Monatsgehälter" },
        { id: "c4", label: "Dauerauftrag für Sparen einrichten", hint: "Automatisch am Gehaltstag" },
        { id: "c5", label: "VWL beim Arbeitgeber beantragen" },
        { id: "c6", label: "Erste Steuererklärung planen" },
      ],
    },
    quiz: {
      title: "Gehalt-Wissenscheck",
      questions: [
        {
          question: "Was ist der Unterschied zwischen Brutto und Netto?",
          options: [
            { label: "Brutto = was du bekommst, Netto = was du verdienst" },
            { label: "Brutto = Gesamtgehalt, Netto = nach Abzügen", correct: true },
            { label: "Es gibt keinen Unterschied" },
          ],
          explanation:
            "Brutto ist dein Gesamtgehalt vor Abzügen. Netto ist das, was tatsächlich auf deinem Konto landet — nach Steuern und Sozialabgaben.",
        },
        {
          question: "Wie groß sollte dein Notgroschen idealerweise sein?",
          options: [
            { label: "1 Monatsgehalt" },
            { label: "3 Monatsgehälter", correct: true },
            { label: "So viel wie möglich" },
          ],
          explanation:
            "Experten empfehlen 3 Nettogehälter als Notgroschen. Das deckt unerwartete Kosten wie Autoreparaturen oder einen Jobverlust ab.",
        },
        {
          question: "Was sind VWL (Vermögenswirksame Leistungen)?",
          options: [
            { label: "Ein Zuschuss vom Arbeitgeber zum Vermögensaufbau", correct: true },
            { label: "Eine Pflichtversicherung" },
            { label: "Ein Kredit für Azubis" },
          ],
          explanation:
            "VWL sind ein freiwilliger Zuschuss deines Arbeitgebers (bis zu 40€/Monat), der z.B. in einen Bausparvertrag oder ETF-Sparplan fließen kann.",
        },
      ],
    },
    calculator: {
      title: "Netto-Rechner (vereinfacht)",
      description: "Schätze dein Netto-Gehalt als Azubi/Berufseinsteiger",
      fields: [
        { id: "brutto", label: "Brutto-Gehalt", suffix: "€", defaultValue: 1200, min: 0, step: 50 },
        { id: "steuerklasse", label: "Steuerklasse (1-6)", suffix: "", defaultValue: 1, min: 1, max: 6 },
      ],
      results: [
        { label: "Sozialabgaben (~20%)", compute: (v) => "- " + fmt((v.brutto ?? 0) * 0.2) + " €" },
        { label: "Lohnsteuer (ca.)", compute: (v) => {
          const b = v.brutto ?? 0;
          const rate = b < 1100 ? 0 : b < 2000 ? 0.05 : 0.14;
          return "- " + fmt(b * rate) + " €";
        }},
        { label: "Netto (ca.)", compute: (v) => {
          const b = v.brutto ?? 0;
          const rate = b < 1100 ? 0 : b < 2000 ? 0.05 : 0.14;
          return fmt(b - b * 0.2 - b * rate) + " €";
        }, highlight: true },
      ],
    },
  },

  "altersvorsorge-mit-20-starten": {
    calculator: {
      title: "Zinseszins-Rechner",
      description: "Sieh, wie dein Geld über die Jahre wächst",
      fields: [
        { id: "monthly", label: "Monatliche Sparrate", suffix: "€", defaultValue: 50, min: 0, step: 25 },
        { id: "years", label: "Anlagedauer", suffix: "Jahre", defaultValue: 40, min: 1, max: 50 },
        { id: "rate", label: "Erwartete Rendite p.a.", suffix: "%", defaultValue: 7, min: 0, max: 15, step: 0.5 },
      ],
      results: [
        { label: "Eingezahlt", compute: (v) => fmt((v.monthly ?? 0) * 12 * (v.years ?? 0)) + " €" },
        { label: "Endwert", compute: (v) => {
          const m = v.monthly ?? 0;
          const r = (v.rate ?? 7) / 100 / 12;
          const n = (v.years ?? 40) * 12;
          if (r === 0) return fmt(m * n) + " €";
          const fv = m * ((Math.pow(1 + r, n) - 1) / r);
          return fmt(fv) + " €";
        }, highlight: true },
        { label: "Zinsgewinn", compute: (v) => {
          const m = v.monthly ?? 0;
          const r = (v.rate ?? 7) / 100 / 12;
          const n = (v.years ?? 40) * 12;
          const invested = m * n;
          if (r === 0) return "0,00 €";
          const fv = m * ((Math.pow(1 + r, n) - 1) / r);
          return fmt(fv - invested) + " €";
        }, highlight: true },
      ],
    },
    quiz: {
      questions: [
        {
          question: "Warum ist früh anfangen beim Investieren so wichtig?",
          options: [
            { label: "Wegen des Zinseszinseffekts", correct: true },
            { label: "Weil Aktien für Junge billiger sind" },
            { label: "Weil man als Junger mehr Risiko eingehen darf" },
          ],
          explanation:
            "Der Zinseszinseffekt bedeutet: Deine Rendite erzeugt wieder Rendite. Je mehr Zeit, desto stärker der Effekt. 10 Jahre mehr können den Unterschied von zehntausenden Euro machen.",
        },
      ],
    },
  },

  "mit-20-euro-investieren": {
    calculator: {
      title: "Sparplan-Rechner",
      description: "Was bringen 20€ im Monat langfristig?",
      fields: [
        { id: "monthly", label: "Monatliche Rate", suffix: "€", defaultValue: 20, min: 1, step: 5 },
        { id: "years", label: "Laufzeit", suffix: "Jahre", defaultValue: 30, min: 1, max: 50 },
        { id: "rate", label: "Rendite p.a.", suffix: "%", defaultValue: 7, min: 0, max: 15, step: 0.5 },
      ],
      results: [
        { label: "Eingezahlt", compute: (v) => fmt((v.monthly ?? 0) * 12 * (v.years ?? 0)) + " €" },
        { label: "Endwert", compute: (v) => {
          const m = v.monthly ?? 0;
          const r = (v.rate ?? 7) / 100 / 12;
          const n = (v.years ?? 30) * 12;
          if (r === 0) return fmt(m * n) + " €";
          return fmt(m * ((Math.pow(1 + r, n) - 1) / r)) + " €";
        }, highlight: true },
      ],
    },
  },

  "erste-wohnung-finanzieren": {
    checklist: {
      title: "Umzugs-Checkliste",
      items: [
        { id: "c1", label: "Mietbudget berechnen (max. 30% vom Netto)" },
        { id: "c2", label: "Kaution sparen (2-3 Kaltmieten)", hint: "Oft die größte einmalige Ausgabe" },
        { id: "c3", label: "Nebenkosten kalkulieren", hint: "Strom, Internet, GEZ, Versicherung" },
        { id: "c4", label: "Erstausstattung planen", hint: "Möbel, Küche, Basics" },
        { id: "c5", label: "Mietvertrag vor Unterschrift prüfen" },
        { id: "c6", label: "Nachsendeauftrag + Ummeldung" },
      ],
    },
    calculator: {
      title: "Mietkosten-Rechner",
      description: "Prüfe ob die Wohnung in dein Budget passt",
      fields: [
        { id: "netto", label: "Netto-Gehalt", suffix: "€", defaultValue: 1800, min: 0, step: 50 },
        { id: "kaltmiete", label: "Kaltmiete", suffix: "€", defaultValue: 500, min: 0, step: 25 },
        { id: "nebenkosten", label: "Nebenkosten", suffix: "€", defaultValue: 120, min: 0, step: 10 },
      ],
      results: [
        { label: "Warmmiete", compute: (v) => fmt((v.kaltmiete ?? 0) + (v.nebenkosten ?? 0)) + " €" },
        { label: "Anteil am Netto", compute: (v) => {
          const warm = (v.kaltmiete ?? 0) + (v.nebenkosten ?? 0);
          const pct = v.netto ? (warm / v.netto * 100) : 0;
          return fmt(pct) + " %";
        }, highlight: true },
        { label: "Empfehlung (max. 30%)", compute: (v) => fmt((v.netto ?? 0) * 0.3) + " €" },
        { label: "Kaution (3× Kaltmiete)", compute: (v) => fmt((v.kaltmiete ?? 0) * 3) + " €" },
      ],
    },
  },
};

/** Get interactive data for a guide, with generic fallback */
export function getGuideInteractive(slug: string, steps: { title: string; description: string }[]): GuideInteractiveData {
  if (GUIDE_INTERACTIVE[slug]) return GUIDE_INTERACTIVE[slug];

  // Generic checklist from steps
  return {
    checklist: {
      title: "Deine Schritte",
      items: steps.map((s, i) => ({
        id: `step-${i}`,
        label: s.title,
        hint: s.description,
      })),
    },
  };
}
