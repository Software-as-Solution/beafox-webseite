import { defineField, defineType } from "sanity";

/**
 * Kostenbalken-Diagramm, datengetrieben.
 *
 * Die Redaktion gibt nur Werte ein, die Komponente rendert daraus saubere,
 * markentreue Balken. Transportiert einen Zahlenvergleich kompakt und visuell,
 * statt ihn als Aufzählung auszuschreiben. Die Werte stehen als echter Text
 * im DOM, kein SEO-Risiko wie bei einer Pixel-Grafik.
 */

export default defineType({
  name: "costBarChart",
  title: "Kostenbalken-Diagramm",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Überschrift",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(80),
    }),
    defineField({
      name: "bars",
      title: "Balken",
      type: "array",
      description: "2–6 Werte, die verglichen werden.",
      of: [
        {
          type: "object",
          name: "costBar",
          fields: [
            {
              name: "label",
              title: "Bezeichnung",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "value",
              title: "Wert (Zahl)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: "suffix",
              title: "Einheit",
              type: "string",
              description: "z. B. „€“, „%“. Optional.",
            },
            {
              name: "highlight",
              title: "Hervorheben",
              type: "boolean",
              description: "Markiert diesen Balken farblich (z. B. die günstigste Option).",
              initialValue: false,
            },
          ],
          preview: {
            select: { title: "label", value: "value", suffix: "suffix" },
            prepare({ title, value, suffix }) {
              return {
                title: title ?? "Balken",
                subtitle: `${value ?? ""} ${suffix ?? ""}`.trim(),
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(6),
    }),
  ],
  preview: {
    select: { title: "heading", bars: "bars" },
    prepare({ title, bars }) {
      const count = Array.isArray(bars) ? bars.length : 0;
      return {
        title: title ?? "Kostenbalken-Diagramm",
        subtitle: `Kostenbalken · ${count} Werte`,
      };
    },
  },
});
