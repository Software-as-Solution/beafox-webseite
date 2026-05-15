import { defineField, defineType } from "sanity";

/**
 * Author: die Person hinter einem Ratgeber.
 *
 * Wichtig für E-E-A-T: Finanzinhalte (YMWL) ranken nur mit einem echten,
 * benannten Autor mit erkennbarer Qualifikation. Jeder Ratgeber referenziert
 * genau einen Autor; die Redaktion wechselt bewusst zwischen den Autoren ab.
 */

export default defineType({
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Voller Name inkl. Titel, z. B. „Prof. Dr. Marcel Dulgeridis“.",
      validation: (Rule) => Rule.required().min(3).max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Für die spätere Autorenseite (/autor/...).",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Rolle",
      type: "string",
      description:
        "Einheitlich für alle Autoren: „BeAFox-Redaktion“. Wird unter dem Ratgeber angezeigt.",
      initialValue: "BeAFox-Redaktion",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "credentials",
      title: "Qualifikation",
      type: "string",
      description:
        "Kurze Qualifikations-Zeile, die das Vertrauen stützt, z. B. „10+ Jahre Finanzjournalismus“ oder „Lehrstuhl für Finanzwirtschaft“.",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "bio",
      title: "Kurzbiografie",
      type: "text",
      rows: 3,
      description:
        "2–3 Sätze, die zeigen, warum diese Person zum Thema schreiben darf. Wird unter dem Ratgeber angezeigt.",
      validation: (Rule) => Rule.required().min(40).max(400),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      description: "Optionales Porträtfoto.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
