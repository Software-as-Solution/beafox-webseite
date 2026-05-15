import { defineField, defineType } from "sanity";

/**
 * Interactive blocks for guide chapters.
 *
 * Every guide chapter holds EXACTLY ONE of these, that is what keeps
 * the guides uniform and easy for the editorial team: open a chapter,
 * pick one interactive element, fill it in. All types are pure data
 * (no code), so they are fully editable in the Studio.
 */

// ─── Inline-Quiz: eine Frage, eine richtige Antwort ──────────────────────────

export const inlineQuiz = defineType({
  name: "inlineQuiz",
  title: "Inline-Quiz (1 Frage)",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Frage",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "options",
      title: "Antwortoptionen",
      type: "array",
      description: "2–4 Optionen. Genau eine als richtig markieren.",
      of: [
        {
          type: "object",
          name: "option",
          fields: [
            { name: "label", title: "Antwort", type: "string" },
            {
              name: "correct",
              title: "Richtige Antwort",
              type: "boolean",
              initialValue: false,
            },
          ],
          preview: {
            select: { title: "label", correct: "correct" },
            prepare({ title, correct }) {
              return { title, subtitle: correct ? "✓ richtig" : "" };
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .max(4)
          .custom((opts) => {
            const list = (opts ?? []) as { correct?: boolean }[];
            const correct = list.filter((o) => o?.correct).length;
            return correct === 1
              ? true
              : "Genau eine Antwort muss als richtig markiert sein.";
          }),
    }),
    defineField({
      name: "explanation",
      title: "Erklärung",
      type: "text",
      rows: 3,
      description: "Wird nach der Antwort angezeigt, kurz und lehrreich.",
      validation: (Rule) => Rule.required().min(20),
    }),
  ],
  preview: {
    select: { title: "question" },
    prepare({ title }) {
      return { title: title ?? "Inline-Quiz", subtitle: "Inline-Quiz" };
    },
  },
});

// ─── Zuordnungsübung: Begriffe den Erklärungen zuordnen ──────────────────────

export const matchPairs = defineType({
  name: "matchPairs",
  title: "Zuordnungsübung",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titel der Übung",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "instruction",
      title: "Anleitung",
      type: "string",
      description:
        "Optional. Standard: „Klick erst einen Begriff links an, dann die passende Erklärung rechts.“",
    }),
    defineField({
      name: "pairs",
      title: "Paare",
      type: "array",
      description: "3–5 Paare aus Begriff und passender Erklärung.",
      of: [
        {
          type: "object",
          name: "pair",
          fields: [
            { name: "left", title: "Begriff", type: "string" },
            { name: "right", title: "Erklärung", type: "string" },
          ],
          preview: {
            select: { title: "left", subtitle: "right" },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(3).max(5),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Zuordnungsübung", subtitle: "Zuordnungsübung" };
    },
  },
});

// ─── Rechne selbst: Nutzer gibt ein Ergebnis ein ─────────────────────────────

export const inputCalc = defineType({
  name: "inputCalc",
  title: "Rechne selbst",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Rechenaufgabe",
      type: "text",
      rows: 3,
      description: "Stell eine konkrete Aufgabe mit echten Zahlen aus dem Text.",
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "hint",
      title: "Tipp",
      type: "string",
      description: "Optionaler Lösungshinweis.",
    }),
    defineField({
      name: "answer",
      title: "Richtiges Ergebnis",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tolerance",
      title: "Toleranz (±)",
      type: "number",
      description: "Wie weit darf die Eingabe abweichen? Standard: 50.",
      initialValue: 50,
    }),
    defineField({
      name: "suffix",
      title: "Einheit",
      type: "string",
      description: "z. B. „€“, „%“, „Monate“. Standard: „€“.",
      initialValue: "€",
    }),
  ],
  preview: {
    select: { title: "question" },
    prepare({ title }) {
      return { title: title ?? "Rechne selbst", subtitle: "Rechne selbst" };
    },
  },
});

// ─── Mini-Checkliste: abhakbare Schritte ─────────────────────────────────────

export const miniChecklist = defineType({
  name: "miniChecklist",
  title: "Mini-Checkliste",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titel der Checkliste",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Punkte",
      type: "array",
      description: "3–8 abhakbare Punkte.",
      of: [
        {
          type: "object",
          name: "checkItem",
          fields: [
            { name: "label", title: "Punkt", type: "string" },
            {
              name: "hint",
              title: "Hinweis",
              type: "string",
              description: "Optionale Zusatzinfo unter dem Punkt.",
            },
          ],
          preview: {
            select: { title: "label", subtitle: "hint" },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(3).max(8),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Mini-Checkliste", subtitle: "Mini-Checkliste" };
    },
  },
});

// ─── Schätz-Slider: einen Wert auf einem Regler einschätzen ──────────────────

export const estimateSlider = defineType({
  name: "estimateSlider",
  title: "Schätz-Slider",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Schätzfrage",
      type: "text",
      rows: 2,
      description: "Was soll der Nutzer auf dem Regler einschätzen?",
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "min",
      title: "Minimum (Reglerstart)",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "max",
      title: "Maximum (Reglerende)",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "step",
      title: "Schrittweite",
      type: "number",
      description: "Standard: 1.",
      initialValue: 1,
    }),
    defineField({
      name: "correctValue",
      title: "Richtiger Wert",
      type: "number",
      description:
        "Der tatsächliche Wert, wird nach dem Auflösen angezeigt. Muss zwischen Minimum und Maximum liegen.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "unit",
      title: "Einheit",
      type: "string",
      description: "z. B. „€“, „%“, „Jahre“. Optional.",
    }),
    defineField({
      name: "explanation",
      title: "Erklärung",
      type: "text",
      rows: 3,
      description: "Wird nach dem Auflösen angezeigt, kurz und lehrreich.",
      validation: (Rule) => Rule.required().min(20),
    }),
  ],
  preview: {
    select: { title: "question" },
    prepare({ title }) {
      return { title: title ?? "Schätz-Slider", subtitle: "Schätz-Slider" };
    },
  },
});

// ─── Reihenfolge: Einträge per Drag & Drop sortieren ─────────────────────────

export const rankingExercise = defineType({
  name: "rankingExercise",
  title: "Reihenfolge (Drag & Drop)",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titel der Übung",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "instruction",
      title: "Anleitung",
      type: "string",
      description:
        "Optional. Standard: „Zieh die Einträge in die richtige Reihenfolge.“",
    }),
    defineField({
      name: "items",
      title: "Einträge (in RICHTIGER Reihenfolge)",
      type: "array",
      description:
        "3–6 Einträge in der korrekten Reihenfolge eintragen, dem Nutzer werden sie gemischt angezeigt.",
      of: [
        {
          type: "object",
          name: "rankItem",
          fields: [{ name: "label", title: "Eintrag", type: "string" }],
          preview: { select: { title: "label" } },
        },
      ],
      validation: (Rule) => Rule.required().min(3).max(6),
    }),
    defineField({
      name: "explanation",
      title: "Erklärung",
      type: "text",
      rows: 3,
      description: "Optional, wird nach dem Prüfen angezeigt.",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title ?? "Reihenfolge",
        subtitle: "Reihenfolge (Drag & Drop)",
      };
    },
  },
});

// ─── Das oder das?: zwei Karten, eine ist richtig ────────────────────────────

export const thisOrThat = defineType({
  name: "thisOrThat",
  title: "Das oder das?",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Frage",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "optionA",
      title: "Karte A (links)",
      type: "object",
      fields: [
        { name: "label", title: "Titel", type: "string" },
        { name: "description", title: "Kurzbeschreibung", type: "string" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "optionB",
      title: "Karte B (rechts)",
      type: "object",
      fields: [
        { name: "label", title: "Titel", type: "string" },
        { name: "description", title: "Kurzbeschreibung", type: "string" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "correct",
      title: "Richtige Karte",
      type: "string",
      options: {
        list: [
          { title: "Karte A", value: "a" },
          { title: "Karte B", value: "b" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "explanation",
      title: "Erklärung",
      type: "text",
      rows: 3,
      description: "Wird nach der Wahl angezeigt, warum diese Karte richtig ist.",
      validation: (Rule) => Rule.required().min(20),
    }),
  ],
  preview: {
    select: { title: "question" },
    prepare({ title }) {
      return { title: title ?? "Das oder das?", subtitle: "Das oder das?" };
    },
  },
});

// ─── Wusstest du schon?: Aufdeck-Karte mit überraschendem Fakt ───────────────

export const didYouKnow = defineType({
  name: "didYouKnow",
  title: "Wusstest du schon? (Aufdeck-Karte)",
  type: "object",
  fields: [
    defineField({
      name: "teaser",
      title: "Anreißer (vor dem Aufdecken)",
      type: "string",
      description:
        "Macht neugierig, ohne die Antwort zu verraten, z. B. „Was ein Neuwagen in den ersten 4 Jahren wirklich verliert …“",
      validation: (Rule) => Rule.required().min(10).max(140),
    }),
    defineField({
      name: "fact",
      title: "Fakt (nach dem Aufdecken)",
      type: "text",
      rows: 3,
      description: "Die überraschende Info, die aufgedeckt wird.",
      validation: (Rule) => Rule.required().min(20),
    }),
  ],
  preview: {
    select: { title: "teaser" },
    prepare({ title }) {
      return {
        title: title ?? "Wusstest du schon?",
        subtitle: "Aufdeck-Karte",
      };
    },
  },
});

export const interactiveBlocks = [
  inlineQuiz,
  matchPairs,
  inputCalc,
  miniChecklist,
  estimateSlider,
  rankingExercise,
  thisOrThat,
  didYouKnow,
];
