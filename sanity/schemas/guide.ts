import { defineField, defineType } from "sanity";

/**
 * Guide: the unified, compact ratgeber format.
 *
 * Every guide has the SAME fixed shape so the editorial team can work
 * fast and every page feels consistent:
 *
 *   1. Meta + SEO          (title, slug, category, SEO-Felder, Autor, Datum, tags …)
 *   2. Einstieg            (2–3 sentence teaser, names the tension, opens the question)
 *   3. Genau 4 Kapitel     (each: text + 1 interactive element + 1 "Frag Bea"-Frage)
 *   4. Abschluss-Block     (Pflicht: Vergleichstabelle ODER Zusammenfassung)
 *   5. Frag-Bea-Block      (intro + 3 vorgefertigte Fragen → öffnet Bea AI)
 *   6. FAQ                 (4–6 Fragen, rendert FAQ-Schema für SEO)
 *   7. Quellen             (optional: Belege stützen E-E-A-T)
 *
 * Keep it short. Compact guides bounce less and convert better into the app.
 */

const CATEGORY_LIST = [
  { title: "Schüler", value: "schueler" },
  { title: "Azubis", value: "azubis" },
  { title: "Studenten", value: "studenten" },
  { title: "Berufseinsteiger", value: "berufseinsteiger" },
  { title: "Lebenssituationen", value: "lebenssituationen" },
  { title: "Investieren", value: "investieren" },
];

export default defineType({
  name: "guide",
  title: "Ratgeber",
  type: "document",
  groups: [
    { name: "meta", title: "Meta & SEO", default: true },
    { name: "content", title: "Inhalt" },
    { name: "convert", title: "Frag Bea & FAQ" },
  ],
  fields: [
    // ─── 1. META & SEO ───────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "meta",
      description:
        "Die H1 des Ratgebers. Klar und konkret, idealerweise mit Keyword.",
      validation: (Rule) => Rule.required().min(10).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "meta",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      group: "meta",
      options: { list: CATEGORY_LIST },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Lesezeit (Minuten)",
      type: "number",
      group: "meta",
      description: "Kompakte Guides liegen bei 4–7 Minuten.",
      validation: (Rule) => Rule.required().min(1).max(15),
    }),
    defineField({
      name: "publishedAt",
      title: "Datum",
      type: "date",
      group: "meta",
      description:
        "Das sichtbare Datum des Ratgebers. Bei jeder inhaltlichen Überarbeitung aktualisieren. Aktualität ist bei Finanzthemen ein Rankingfaktor.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
      group: "meta",
      description:
        "Wer den Ratgeber verantwortet. Pflicht für E-E-A-T. Die Redaktion wechselt bewusst zwischen den Autoren ab.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaTitle",
      title: "SEO-Title",
      type: "string",
      group: "meta",
      description:
        "Wird als <title>-Tag verwendet. Idealerweise 50–60 Zeichen.",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO-Description",
      type: "text",
      rows: 3,
      group: "meta",
      description: "Meta-Description für Google. Idealerweise 150–160 Zeichen.",
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: "excerpt",
      title: "Kurzbeschreibung",
      type: "text",
      rows: 3,
      group: "meta",
      description:
        "Wird auf Übersichts- und Kategorieseiten als Vorschau gezeigt.",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    // ─── 2. SCHNELLANTWORT ───────────────────────────────────────────────────
    defineField({
      name: "quickAnswer",
      title: "Einstieg („Darum geht\u2019s“)",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "2–3 Sätze als Teaser, NICHT als fertige Antwort. Benenne die Kernspannung des Themas und ende mit der offenen Frage, die der Ratgeber klärt. So bleibt der Nutzer und liest weiter, statt nach der Antwort abzuspringen.",
      validation: (Rule) => Rule.required().min(80).max(400),
    }),

    // ─── 3. KAPITEL (genau 4) ────────────────────────────────────────────────
    defineField({
      name: "chapters",
      title: "Kapitel",
      type: "array",
      group: "content",
      description:
        "Genau 4 kurze Kapitel. Jedes Kapitel hat Text, ein interaktives Element und eine „Frag Bea“-Frage.",
      of: [{ type: "guideChapter" }],
      validation: (Rule) =>
        Rule.required()
          .length(4)
          .error(
            "Ein Ratgeber hat genau 4 Kapitel, das hält das Format einheitlich.",
          ),
    }),

    // ─── 4. ABSCHLUSS: VERGLEICH ODER ZUSAMMENFASSUNG (Pflicht) ──────────────
    defineField({
      name: "summary",
      title: "Abschluss: Vergleichstabelle oder Zusammenfassung",
      type: "array",
      group: "content",
      description:
        "Pflicht. Jeder Ratgeber endet vor dem Frag-Bea-Block mit GENAU EINEM Abschluss-Block: einer Vergleichstabelle (bei Vergleichsthemen) ODER einer kompakten Zusammenfassung „Das Wichtigste in Kürze“.",
      of: [{ type: "comparisonTable" }, { type: "summaryBox" }],
      validation: (Rule) =>
        Rule.required()
          .length(1)
          .error(
            "Genau ein Abschluss-Block: Vergleichstabelle oder Zusammenfassung.",
          ),
    }),

    // ─── 7. QUELLEN (optional) ───────────────────────────────────────────────
    defineField({
      name: "sources",
      title: "Quellen",
      type: "array",
      group: "content",
      description:
        "Belege für Zahlen und Aussagen. Stützt die Glaubwürdigkeit (E-E-A-T) und wird am Ende des Ratgebers verlinkt.",
      of: [
        {
          type: "object",
          name: "source",
          fields: [
            {
              name: "label",
              title: "Bezeichnung",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
    }),

    // ─── 4. FRAG-BEA-BLOCK ───────────────────────────────────────────────────
    defineField({
      name: "beaBlock",
      title: "Frag-Bea-Block",
      type: "object",
      group: "convert",
      description:
        "Der Konversions-Block vor dem FAQ: Er lädt den Nutzer ein, Bea zu diesem Thema zu fragen. Bea führt dann in die App.",
      fields: [
        {
          name: "intro",
          title: "Einleitungstext",
          type: "text",
          rows: 2,
          description:
            "1–2 Sätze, die den Nutzer motivieren, Bea eine Frage zu stellen.",
          validation: (Rule) => Rule.required().min(20).max(240),
        },
        {
          name: "questions",
          title: "Vorgefertigte Fragen",
          type: "array",
          description:
            "Genau 3 anklickbare Fragen, die mit Bea AI geöffnet werden.",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().length(3),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ─── 5. FAQ ──────────────────────────────────────────────────────────────
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "convert",
      description:
        "Genau 3 häufige Fragen. Wird als FAQ-Schema ausgespielt, wichtig für SEO.",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            {
              name: "question",
              title: "Frage",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              title: "Antwort",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .length(3)
          .error(
            "Ein Ratgeber hat genau 3 FAQ-Fragen, das hält das Format einheitlich.",
          ),
    }),
  ],

  preview: {
    select: {
      title: "title",
      category: "category",
      author: "author.name",
    },
    prepare({ title, category, author }) {
      const cat = CATEGORY_LIST.find((c) => c.value === category)?.title;
      return {
        title,
        subtitle: `${cat ?? category ?? "?"}${author ? ` · ${author}` : ""}`,
      };
    },
  },

  orderings: [
    {
      title: "Veröffentlicht (neueste zuerst)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Kategorie",
      name: "categoryAsc",
      by: [{ field: "category", direction: "asc" }],
    },
  ],
});
