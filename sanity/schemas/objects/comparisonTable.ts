import { defineField, defineType } from "sanity";

/**
 * Vergleichstabelle, z. B. „Leasing vs. Finanzierung vs. Barkauf“.
 *
 * Vergleichs-Queries („X oder Y“) lieben Tabellen: Google zieht daraus gern
 * SERP-Features, und für den Nutzer ist es die schnellste Übersicht. Optional,
 * aber bei jedem Vergleichs-Ratgeber dringend empfohlen.
 */

export default defineType({
  name: "comparisonTable",
  title: "Vergleichstabelle",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Überschrift",
      type: "string",
      description: "z. B. „Leasing, Autokredit und Barkauf im Direktvergleich“.",
      validation: (Rule) => Rule.required().min(8).max(90),
    }),
    defineField({
      name: "columns",
      title: "Spaltenköpfe",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Die Kopfzeile. Erste Spalte ist die Merkmals-Spalte (z. B. „“ oder „Kriterium“), danach die Optionen, z. B. „Kriterium“, „Leasing“, „Autokredit“, „Barkauf“.",
      validation: (Rule) => Rule.required().min(2).max(5),
    }),
    defineField({
      name: "rows",
      title: "Zeilen",
      type: "array",
      description: "Pro Zeile ein Vergleichsmerkmal. Anzahl Zellen = Anzahl Spalten.",
      of: [
        {
          type: "object",
          name: "comparisonRow",
          fields: [
            {
              name: "cells",
              title: "Zellen",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(2).max(5),
            },
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }) {
              const list = (cells ?? []) as string[];
              return {
                title: list[0] || "Zeile",
                subtitle: list.slice(1).join("  ·  "),
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(10),
    }),
  ],
  preview: {
    select: { title: "heading", rows: "rows" },
    prepare({ title, rows }) {
      const count = Array.isArray(rows) ? rows.length : 0;
      return { title: title ?? "Vergleichstabelle", subtitle: `${count} Zeilen` };
    },
  },
});
