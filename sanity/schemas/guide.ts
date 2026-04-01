import { defineField, defineType } from "sanity";

export default defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: {
        list: [
          { title: "Finanzen für Schüler", value: "finanzen-fuer-schueler" },
          { title: "Finanzen für Azubis", value: "finanzen-fuer-azubis" },
          { title: "Finanzen für Studenten", value: "finanzen-fuer-studenten" },
          { title: "Finanzen für Berufseinsteiger", value: "finanzen-fuer-berufseinsteiger" },
          { title: "Finanzen bei Lebensereignissen", value: "finanzen-bei-lebensereignissen" },
          { title: "Investieren lernen", value: "investieren-lernen" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      description: "Wird als <title> Tag verwendet. Idealerweise 50-60 Zeichen.",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Wird als Meta-Description verwendet. Idealerweise 150-160 Zeichen.",
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: "excerpt",
      title: "Kurzbeschreibung",
      type: "text",
      rows: 3,
      description: "Wird auf Übersichtsseiten und in der Vorschau angezeigt.",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "difficulty",
      title: "Schwierigkeitsgrad",
      type: "string",
      options: {
        list: [
          { title: "Einsteiger", value: "einsteiger" },
          { title: "Fortgeschritten", value: "fortgeschritten" },
        ],
      },
      initialValue: "einsteiger",
    }),
    defineField({
      name: "readingTime",
      title: "Lesezeit (Minuten)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(30),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "publishedAt",
      title: "Veröffentlicht am",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "steps",
      title: "Guide-Schritte",
      type: "array",
      of: [
        {
          type: "object",
          name: "step",
          title: "Schritt",
          fields: [
            { name: "title", title: "Titel", type: "string" },
            { name: "description", title: "Beschreibung", type: "text", rows: 3 },
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Inhalt",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Zitat", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
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
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt-Text",
              description: "Wichtig für SEO und Barrierefreiheit",
            },
            {
              name: "caption",
              type: "string",
              title: "Bildunterschrift",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      difficulty: "difficulty",
    },
    prepare({ title, category, difficulty }) {
      return {
        title,
        subtitle: `${category} · ${difficulty ?? "einsteiger"}`,
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
