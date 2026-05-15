/**
 * Einmal-Migration: weist allen `guide`-Dokumenten ohne Autor einen
 * rotierenden Autor aus dem 3er-Pool zu.
 *
 * Nutzung:
 *   npm run sanity:import            (legt erst die 3 Autoren-Docs an)
 *   npm run sanity:migrate-authors   (dann diese Migration)
 *
 * Idempotent — Ratgeber, die bereits einen Autor haben, werden übersprungen. Die Rotation läuft in stabiler Reihenfolge, sodass
 * sich die drei Autoren gleichmäßig über die Ratgeber verteilen.
 */

const { createClient } = require("@sanity/client");

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    "✗ SANITY_API_TOKEN fehlt. Token in .env setzen und mit `npm run sanity:migrate-authors` starten.",
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

// Der Autoren-Pool, zwischen dem rotiert wird.
const AUTHOR_IDS = [
  "author-marcel-dulgeridis",
  "author-alexandru-fuchs",
  "author-selina-fuchs",
];

async function main() {
  // 1. Sicherstellen, dass die Autoren-Dokumente existieren.
  const existing = await client.fetch(
    '*[_type == "author" && _id in $ids]._id',
    { ids: AUTHOR_IDS },
  );
  const missing = AUTHOR_IDS.filter((id) => !existing.includes(id));
  if (missing.length > 0) {
    console.error(
      "✗ Autoren-Dokumente fehlen: " +
        missing.join(", ") +
        "\n  Zuerst `npm run sanity:import` ausführen.",
    );
    process.exit(1);
  }

  // 2. Alle Ratgeber in stabiler Reihenfolge holen.
  const guides = await client.fetch(
    `*[_type == "guide"] | order(publishedAt asc, _id asc) {
      _id,
      "hasAuthor": defined(author)
    }`,
  );

  let rotation = 0;
  let patched = 0;

  for (const guide of guides) {
    const patch = {};

    if (!guide.hasAuthor) {
      patch.author = {
        _type: "reference",
        _ref: AUTHOR_IDS[rotation % AUTHOR_IDS.length],
      };
      rotation += 1;
    }
    if (Object.keys(patch).length === 0) continue;

    await client.patch(guide._id).set(patch).commit();
    console.log(`✓ ${guide._id}: ${Object.keys(patch).join(", ")}`);
    patched += 1;
  }

  console.log(
    `\nFertig — ${patched} von ${guides.length} Ratgeber(n) ergänzt.`,
  );
}

main().catch((err) => {
  console.error("✗ Migration fehlgeschlagen:", err.message);
  process.exit(1);
});
