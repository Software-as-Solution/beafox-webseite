import { defineField, defineType } from "sanity";

/**
 * Stat-Karte, datengetrieben.
 *
 * Ein bis vier große Zahlen mit kurzer Erklärung. Holt die wichtigste
 * Kennzahl eines Kapitels nach vorne, statt sie im Fließtext zu verstecken,
 * perfekt für die scanbare, junge Zielgruppe.
 */

export default defineType({
  name: "statHighlight",
  title: "Stat-Karte",
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
      name: "stats",
      title: "Kennzahlen",
      type: "array",
      description: "1–4 Kennzahlen.",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            {
              name: "value",
              title: "Wert",
              type: "string",
              description: "Frei formuliert, z. B. „13.046 €“, „70 %“, „4 Jahre“.",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "label",
              title: "Erklärung",
              type: "string",
              description: "Ein kurzer Satzteil, der die Zahl einordnet.",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
  ],
  preview: {
    select: { title: "heading", stats: "stats" },
    prepare({ title, stats }) {
      const count = Array.isArray(stats) ? stats.length : 0;
      return {
        title: title ?? "Stat-Karte",
        subtitle: `Stat-Karte · ${count} Kennzahlen`,
      };
    },
  },
});
