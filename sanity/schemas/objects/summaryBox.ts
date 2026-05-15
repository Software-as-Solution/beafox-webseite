import { defineField, defineType } from "sanity";

/**
 * Zusammenfassung: „Das Wichtigste in Kürze".
 *
 * Die Alternative zur Vergleichstabelle als Abschluss-Block des Ratgebers.
 * Bei Vergleichsthemen nimmt man die Tabelle, sonst diese kompakte
 * Kernaussagen-Liste. Jeder Ratgeber hat genau eines von beidem.
 */

export default defineType({
  name: "summaryBox",
  title: "Zusammenfassung",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Überschrift",
      type: "string",
      description: "Standard: „Das Wichtigste in Kürze“.",
      initialValue: "Das Wichtigste in Kürze",
      validation: (Rule) => Rule.required().min(5).max(80),
    }),
    defineField({
      name: "points",
      title: "Kernaussagen",
      type: "array",
      of: [{ type: "string" }],
      description:
        "3–6 knappe Kernaussagen, die Essenz des Ratgebers zum Mitnehmen.",
      validation: (Rule) => Rule.required().min(3).max(6),
    }),
  ],
  preview: {
    select: { title: "heading", points: "points" },
    prepare({ title, points }) {
      const count = Array.isArray(points) ? points.length : 0;
      return {
        title: title ?? "Zusammenfassung",
        subtitle: `Zusammenfassung · ${count} Punkte`,
      };
    },
  },
});
