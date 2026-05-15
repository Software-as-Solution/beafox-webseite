import { defineField, defineType } from "sanity";

/**
 * Bild, für die seltenen Fälle, in denen eine echte Illustration mehr bringt
 * als ein datengetriebenes Element.
 *
 * Datengetriebene Visuals (Kostenbalken, Zeitstrahl, Stat-Karte) sind der
 * Standard, sie sind schneller, einheitlich und SEO-sicher. Dieses Bild-Feld
 * ist die Ausnahme. Alt-Text ist Pflicht (Barrierefreiheit + SEO).
 */

export default defineType({
  name: "figureImage",
  title: "Bild",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt-Text",
      type: "string",
      description:
        "Beschreibt das Bild für Screenreader und Suchmaschinen. Pflicht.",
      validation: (Rule) => Rule.required().min(5).max(160),
    }),
    defineField({
      name: "caption",
      title: "Bildunterschrift",
      type: "string",
      description: "Optional, wird unter dem Bild angezeigt.",
    }),
  ],
  preview: {
    select: { title: "alt", media: "image", subtitle: "caption" },
    prepare({ title, media, subtitle }) {
      return { title: title ?? "Bild", subtitle: subtitle ?? "Bild", media };
    },
  },
});
