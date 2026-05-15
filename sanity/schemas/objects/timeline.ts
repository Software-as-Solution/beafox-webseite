import { defineField, defineType } from "sanity";

/**
 * Zeitstrahl, datengetrieben.
 *
 * Für Abläufe und Schritt-für-Schritt-Themen: Die Redaktion gibt die Schritte
 * ein, die Komponente rendert einen sauberen Zeitstrahl. Kompakter und
 * scanbarer als ein ausformulierter Ablauf-Absatz.
 */

export default defineType({
  name: "timeline",
  title: "Zeitstrahl",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Überschrift",
      type: "string",
      description: "Optional.",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "steps",
      title: "Schritte",
      type: "array",
      description: "2–6 Stationen in zeitlicher Reihenfolge.",
      of: [
        {
          type: "object",
          name: "timelineStep",
          fields: [
            {
              name: "label",
              title: "Titel",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "detail",
              title: "Detail",
              type: "string",
              description: "Ein kurzer erklärender Satz. Optional.",
            },
          ],
          preview: {
            select: { title: "label", subtitle: "detail" },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(6),
    }),
  ],
  preview: {
    select: { title: "heading", steps: "steps" },
    prepare({ title, steps }) {
      const count = Array.isArray(steps) ? steps.length : 0;
      return {
        title: title ?? "Zeitstrahl",
        subtitle: `Zeitstrahl · ${count} Schritte`,
      };
    },
  },
});
