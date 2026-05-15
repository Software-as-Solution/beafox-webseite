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

  "auto-kaufen-oder-leasen": {
    calculator: {
      title: "Leasing vs. Autokredit – Vollkostenrechner",
      description:
        "Trag dein Wunschauto ein und sieh sofort: Was kostet dich Leasing wirklich, was kostet der Kredit — und welche Option ist günstiger, wenn du das Auto behalten willst?",
      fields: [
        {
          id: "kaufpreis",
          label: "Kaufpreis des Autos",
          suffix: "€",
          defaultValue: 27000,
          min: 5000,
          step: 500,
        },
        {
          id: "laufzeit",
          label: "Laufzeit",
          suffix: "Monate",
          defaultValue: 48,
          min: 12,
          max: 84,
          step: 6,
        },
        {
          id: "restwert",
          label: "Restwert nach Laufzeit",
          suffix: "%",
          defaultValue: 48,
          min: 10,
          max: 80,
          step: 1,
        },
        {
          id: "zinssatz",
          label: "Zinssatz Autokredit (p.a.)",
          suffix: "%",
          defaultValue: 5.99,
          min: 1,
          max: 20,
          step: 0.25,
        },
        {
          id: "leasingrate",
          label: "Monatliche Leasingrate",
          suffix: "€",
          defaultValue: 357,
          min: 50,
          step: 10,
        },
      ],
      results: [
        {
          label: "Kredit: Monatliche Rate",
          compute: (v) => {
            const P = v.kaufpreis ?? 27000;
            const r = (v.zinssatz ?? 5.99) / 100 / 12;
            const n = v.laufzeit ?? 48;
            if (r === 0) return fmt(P / n) + " €/Monat";
            const rate = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            return fmt(rate) + " €/Monat";
          },
        },
        {
          label: "Kredit: Gesamtkosten",
          compute: (v) => {
            const P = v.kaufpreis ?? 27000;
            const r = (v.zinssatz ?? 5.99) / 100 / 12;
            const n = v.laufzeit ?? 48;
            if (r === 0) return fmt(P) + " €";
            const rate = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            return fmt(rate * n) + " €";
          },
        },
        {
          label: "Leasing: Gesamtkosten",
          compute: (v) => {
            const total = (v.leasingrate ?? 357) * (v.laufzeit ?? 48);
            return fmt(total) + " €";
          },
        },
        {
          label: "Restwert des Autos",
          compute: (v) => {
            const restwert = (v.kaufpreis ?? 27000) * (v.restwert ?? 48) / 100;
            return fmt(restwert) + " €";
          },
        },
        {
          label: "Effektive Kosten Kredit (nach Restwert)",
          compute: (v) => {
            const P = v.kaufpreis ?? 27000;
            const r = (v.zinssatz ?? 5.99) / 100 / 12;
            const n = v.laufzeit ?? 48;
            const restwert = P * (v.restwert ?? 48) / 100;
            if (r === 0) return fmt(P - restwert) + " €";
            const rate = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            return fmt(rate * n - restwert) + " €";
          },
          highlight: true,
        },
        {
          label: "Günstiger (bei Behalten)",
          compute: (v) => {
            const P = v.kaufpreis ?? 27000;
            const r = (v.zinssatz ?? 5.99) / 100 / 12;
            const n = v.laufzeit ?? 48;
            const restwert = P * (v.restwert ?? 48) / 100;
            const kreditTotal = r === 0 ? P : P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) * n;
            const kreditEffektiv = kreditTotal - restwert;
            const leasingTotal = (v.leasingrate ?? 357) * n;
            const diff = Math.abs(kreditEffektiv - leasingTotal);
            return kreditEffektiv <= leasingTotal
              ? `Kredit (${fmt(diff)} € günstiger)`
              : `Leasing (${fmt(diff)} € günstiger)`;
          },
          highlight: true,
        },
      ],
    },
    checklist: {
      title: "Vor dem Abschluss prüfen",
      items: [
        {
          id: "c1",
          label: "Budget nach der 15-%-Regel prüfen",
          hint: "Rate + Versicherung + Steuer + Sprit + Wartung dürfen max. 15–20 % deines Nettos sein",
        },
        {
          id: "c2",
          label: "Mindestens 3 Angebote einholen",
          hint: "Händler, Direktbank und Vergleichsportal (z. B. Check24, Smava) vergleichen",
        },
        {
          id: "c3",
          label: "Effektiven Jahreszins vergleichen — nicht nur die Monatsrate",
          hint: "Niedrige Raten können hohe Gesamtkosten verstecken — immer auf den eff. Jahreszins achten",
        },
        {
          id: "c4",
          label: "Bei Leasing: Immer Kilometerleasing wählen",
          hint: "Restwertleasing hat oft günstigere Raten, aber unkontrollierbare Kosten bei Rückgabe",
        },
        {
          id: "c5",
          label: "Kilometergrenze realistisch schätzen (+ 10 % Puffer)",
          hint: "Mehrkilometerkosten: typisch 8–15 Cent/km — bei 5.000 km mehr schon 400–750 € extra",
        },
        {
          id: "c6",
          label: "Sondertilgungsrecht im Kreditvertrag bestätigen lassen",
          hint: "Damit kannst du den Kredit früher abbezahlen und Zinsen sparen",
        },
        {
          id: "c7",
          label: "Kfz-Versicherung vor dem Kauf vergleichen",
          hint: "Haftpflicht Pflicht, Vollkasko bei Neuwagen empfohlen — Preise stark unterschiedlich",
        },
        {
          id: "c8",
          label: "Kfz-Steuer berechnen",
          hint: "Abhängig von Hubraum, Antriebsart und Schadstoffklasse — ca. 100–400 €/Jahr",
        },
        {
          id: "c9",
          label: "Jährliche Wartungskosten einplanen",
          hint: "Inspektion, Ölwechsel, Reifen (Satz Winterreifen alle 4–5 Jahre): ca. 500–1.000 €/Jahr",
        },
        {
          id: "c10",
          label: "TÜV alle 2 Jahre einplanen",
          hint: "Kosten ca. 70–150 € plus eventuelle Reparaturen für die Plakette",
        },
        {
          id: "c11",
          label: "Wertverlust über die Haltedauer im Rechner kalkulieren",
          hint: "Neuwagen verlieren im ersten Jahr 20–30 % — nach 3 Jahren oft 40–50 % des Kaufpreises",
        },
        {
          id: "c12",
          label: "Bei Leasing: Überführungskosten und Zulassung klären",
          hint: "Manchmal werden Überführungskosten und Zulassung extra berechnet — fragen!",
        },
        {
          id: "c13",
          label: "Bei Autokredit: Fahrzeugbrief-Situation verstehen",
          hint: "Die Bank hält den Fahrzeugbrief bis zur letzten Rate — du bist erst dann rechtlich Eigentümer",
        },
        {
          id: "c14",
          label: "Bei Leasing-Rückgabe: Zustand des Autos vorher dokumentieren",
          hint: "Fotos innen und außen vor der Rückgabe machen — schützt vor ungerechtfertigten Forderungen",
        },
        {
          id: "c15",
          label: "Gebrauchtwagenmarkt im Blick haben",
          hint: "2–3 Jahre alte Gebrauchtwagen mit ~30.000 km haben den steilsten Wertverlust hinter sich",
        },
      ],
    },
    quiz: {
      title: "Auto-Finanzierungs-Check",
      questions: [
        {
          question: "Welche Leasingart solltest du immer wählen?",
          options: [
            {
              label: "Restwertleasing — die Raten sind günstiger",
            },
            {
              label: "Kilometerleasing — planbar und fair",
              correct: true,
            },
            { label: "Das ist egal, beide sind gleich" },
          ],
          explanation:
            "Kilometer­leasing ist die richtige Wahl. Beim Restwert­leasing schätzt der Leasinggeber den Wert des Autos am Ende — liegt dieser niedriger als erwartet, zahlst du drauf. Auf Markt­schwankungen, Image­verluste oder neue Umwelt­gesetze hast du keinen Einfluss. Kilometerleasing ist kalkulierbar: Mehr km = höhere Rate, weniger km = Geld zurück.",
        },
        {
          question:
            "Was bedeutet es, wenn die Bank beim Autokredit den Fahrzeugbrief einbehält?",
          options: [
            { label: "Das ist nur eine Formalität, das Auto gehört dir sofort" },
            {
              label: "Du bist erst nach der letzten Rate rechtlich Eigentümer",
              correct: true,
            },
            { label: "Du darfst das Auto nicht fahren" },
          ],
          explanation:
            "Beim klassischen Autokredit gilt Sicherungsübereignung: Die Bank hält den Fahrzeugbrief (Zulassungsbescheinigung Teil II) als Sicherheit. Erst mit der letzten Rate wird dir der Brief ausgehändigt und du wirst rechtlich Eigentümer des Autos.",
        },
        {
          question: "Wie viel verliert ein Neuwagen typischerweise im ersten Jahr an Wert?",
          options: [
            { label: "Etwa 5–10 %" },
            { label: "Etwa 20–30 %", correct: true },
            { label: "Etwa 50–60 %" },
          ],
          explanation:
            "Im ersten Jahr verlieren Neuwagen typischerweise 20–30 % ihres Kaufpreises. Nach 3 Jahren sind es oft 40–50 %. Deshalb sind gepflegte Gebrauchtwagen mit 2–3 Jahren oft das beste Preis-Leistungs-Verhältnis — der steilste Wertverlust ist bereits passiert.",
        },
        {
          question: "Warum sind die Gesamtkosten bei einer Ballonfinanzierung oft höher als beim Autokredit?",
          options: [
            { label: "Weil der Zinssatz grundsätzlich höher ist" },
            {
              label: "Weil die hohe Schlussrate über die gesamte Laufzeit mitverzinst wird",
              correct: true,
            },
            { label: "Weil man eine Anzahlung leisten muss" },
          ],
          explanation:
            "Bei der Ballonfinanzierung wird die hohe Schlussrate ('Ballon') über die gesamte Vertragslaufzeit mit Zinsen belastet — obwohl du sie erst am Ende zahlst. Beim normalen Autokredit sinkt die Restschuld jeden Monat, weshalb insgesamt weniger Zinsen anfallen.",
        },
        {
          question:
            "Für wen ist Leasing steuerlich besonders attraktiv?",
          options: [
            { label: "Für Arbeitnehmer, die viel pendeln" },
            {
              label: "Für Selbstständige und Freiberufler mit betrieblicher Nutzung",
              correct: true,
            },
            { label: "Für alle Steuerzahler gleichermaßen" },
          ],
          explanation:
            "Selbstständige und Freiberufler können Leasingraten als Betriebsausgabe vollständig von der Steuer absetzen — bei betrieblicher Nutzung des Fahrzeugs. Das macht Leasing steuerlich attraktiver als für Arbeitnehmer, die diese Möglichkeit nur eingeschränkt haben.",
        },
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
