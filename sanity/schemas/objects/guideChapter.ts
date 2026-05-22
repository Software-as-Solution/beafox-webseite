import { defineField, defineType } from "sanity";

/**
 * One guide chapter.
 *
 * A guide has exactly FOUR of these, short, focused, and each one
 * carries one interactive element plus a tailored "Frag Bea" prompt.
 * That fixed shape is what makes every guide feel the same and keeps
 * the format compact (low bounce, strong SEO).
 */

export default defineType({
  name: "guideChapter",
  title: "Kapitel",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Kapitel-Überschrift",
      type: "string",
      description:
        "Wird als H2 gerendert. Möglichst eine Frage oder ein klares Versprechen.",
      validation: (Rule) => Rule.required().min(8).max(90),
    }),
    defineField({
      name: "body",
      title: "Kapitel-Text",
      type: "array",
      description:
        "Kurz halten, 2–4 Absätze. Zwischenüberschriften (H3) und Listen sind erlaubt. Hinweise und Tipps NICHT hier einbauen, dafür gibt es das eigene Feld „Hinweis / Tipp“ weiter unten, das zwischen den Kapiteln gerendert wird.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Zwischenüberschrift", value: "h3" },
          ],
          lists: [
            { title: "Aufzählung", value: "bullet" },
            { title: "Nummeriert", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Fett", value: "strong" },
              { title: "Kursiv", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  { name: "href", type: "url", title: "URL" },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "In neuem Tab öffnen",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "interactive",
      title: "Interaktives Element",
      type: "array",
      description:
        "Genau EIN interaktives Element pro Kapitel, das hält die Guides einheitlich und lebendig.",
      of: [
        { type: "inlineQuiz" },
        { type: "matchPairs" },
        { type: "inputCalc" },
        { type: "miniChecklist" },
        { type: "estimateSlider" },
        { type: "rankingExercise" },
        { type: "thisOrThat" },
        { type: "didYouKnow" },
      ],
      validation: (Rule) =>
        Rule.required().length(1).error("Genau ein interaktives Element pro Kapitel."),
    }),
    defineField({
      name: "visual",
      title: "Visual-Element (optional)",
      type: "array",
      description:
        "Optional EIN datengetriebenes Visual oder Bild, transportiert Information kompakt und macht das Kapitel scanbar. Datengetriebene Typen (Kostenbalken, Zeitstrahl, Stat-Karte) sind der Standard.",
      of: [
        { type: "costBarChart" },
        { type: "timeline" },
        { type: "statHighlight" },
        { type: "figureImage" },
      ],
      validation: (Rule) =>
        Rule.max(1).error("Höchstens ein Visual-Element pro Kapitel."),
    }),
    defineField({
      name: "beaPrompt",
      title: "„Frag Bea“-Frage zu diesem Kapitel",
      type: "string",
      description:
        "Die vorausgefüllte Frage, die der Nutzer mit einem Klick an Bea schicken kann. Bezieht sich konkret auf dieses Kapitel.",
      validation: (Rule) => Rule.required().min(15).max(160),
    }),
    defineField({
      name: "callout",
      title: "Hinweis / Tipp (zwischen den Kapiteln)",
      type: "object",
      description:
        "Optionaler Hinweis oder Tipp, der NACH diesem Kapitel, also zwischen den Kapiteln, als eigene Box gerendert wird. Leer lassen, wenn nicht gebraucht. Hinweis: Beim LETZTEN Kapitel wird die Box nicht angezeigt, danach folgt direkt der Frag-Bea-Block.",
      fields: [
        {
          name: "kind",
          title: "Art",
          type: "string",
          options: {
            list: [
              { title: "Hinweis (Info)", value: "info" },
              { title: "Tipp", value: "tip" },
            ],
            layout: "radio",
          },
          initialValue: "info",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "text",
          title: "Text",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required().min(20).max(320),
        },
      ],
      preview: {
        select: { kind: "kind", text: "text" },
        prepare({ kind, text }) {
          return {
            title: kind === "tip" ? "Tipp" : "Hinweis",
            subtitle: text ?? "",
          };
        },
      },
    }),
  ],
  preview: {
    select: { title: "heading", interactive: "interactive.0._type" },
    prepare({ title, interactive }) {
      const labels: Record<string, string> = {
        inlineQuiz: "Inline-Quiz",
        matchPairs: "Zuordnungsübung",
        inputCalc: "Rechne selbst",
        miniChecklist: "Mini-Checkliste",
        estimateSlider: "Schätz-Slider",
        rankingExercise: "Reihenfolge",
        thisOrThat: "Das oder das?",
        didYouKnow: "Wusstest du schon?",
      };
      return {
        title: title ?? "Kapitel",
        subtitle: interactive ? labels[interactive] ?? interactive : "—",
      };
    },
  },
});
