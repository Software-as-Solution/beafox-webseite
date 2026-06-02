// ─────────────────────────────────────────────────────────────
// BeAFox Analytics — Ratgeber Tracker
// ─────────────────────────────────────────────────────────────
// Typed wrapper für Ratgeber-Kategorie-Klicks. Geht durch den
// consent-gated enqueue() (Produkt-Analytics-Purpose). Best-effort,
// blockiert niemals die Navigation.
// ─────────────────────────────────────────────────────────────

import { buildMeta, enqueue } from "../client";
import type { BlogCategorySlug } from "@/lib/blog";

export function trackRatgeberCategoryClick(args: {
  slug: BlogCategorySlug;
  source: "card" | "bea_button";
}): void {
  enqueue({
    type: "ratgeber_category_click",
    slug: args.slug,
    source: args.source,
    meta: buildMeta(),
  });
}
