/**
 * Einmal-Migration: setzt das `category`-Feld aller `guide`-Dokumente in Sanity
 * von den alten Lang-Slugs auf die neuen Kurz-Slugs.
 *
 * Nutzung:
 *   npm run sanity:migrate-categories
 *
 * Idempotent — Dokumente, die bereits einen Kurz-Slug haben, werden übersprungen.
 */

const { createClient } = require("@sanity/client");

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    "✗ SANITY_API_TOKEN fehlt. Token in .env setzen und mit `npm run sanity:migrate-categories` starten.",
  );
  process.exit(1);
}

const client = createClient({
  projectId: "gnyg0xwn",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const CATEGORY_MAP = {
  "finanzen-fuer-schueler": "schueler",
  "finanzen-fuer-azubis": "azubis",
  "finanzen-fuer-studenten": "studenten",
  "finanzen-fuer-berufseinsteiger": "berufseinsteiger",
  "finanzen-bei-lebensereignissen": "lebenssituation",
  "investieren-fuer-anfaenger": "investieren",
};

async function main() {
  const oldSlugs = Object.keys(CATEGORY_MAP);
  const docs = await client.fetch(
    '*[_type == "guide" && category in $oldSlugs]{ _id, category }',
    { oldSlugs },
  );

  if (docs.length === 0) {
    console.log("Nichts zu tun — keine Dokumente mit alten Kategorie-Slugs.");
    return;
  }

  for (const doc of docs) {
    const next = CATEGORY_MAP[doc.category];
    await client.patch(doc._id).set({ category: next }).commit();
    console.log(`✓ ${doc._id}: ${doc.category} → ${next}`);
  }
  console.log(`\nFertig — ${docs.length} Dokument(e) migriert.`);
}

main().catch((err) => {
  console.error("✗ Migration fehlgeschlagen:", err.message);
  process.exit(1);
});
