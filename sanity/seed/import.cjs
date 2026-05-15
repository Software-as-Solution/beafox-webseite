/**
 * Importiert die Seed-Ratgeber in den Sanity-Datensatz (production).
 *
 * Nutzung:
 *   npm run sanity:import
 *
 * Das Script liest den Write-Token aus `SANITY_API_TOKEN` (per `--env-file=.env`
 * geladen) und schreibt jedes Dokument der NDJSON-Datei mit `createOrReplace`.
 * Da die Dokumente feste `_id`s haben, ist der Import idempotent — ein erneuter
 * Lauf ersetzt das Dokument einfach.
 */

const { createClient } = require("@sanity/client");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    "✗ SANITY_API_TOKEN fehlt. Token in .env setzen und mit `npm run sanity:import` starten.",
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

const SEED_FILES = ["auto-kaufen-oder-leasen.ndjson"];

async function main() {
  let count = 0;
  for (const fileName of SEED_FILES) {
    const path = join(__dirname, fileName);
    const docs = readFileSync(path, "utf8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    for (const doc of docs) {
      const res = await client.createOrReplace(doc);
      console.log(`✓ importiert: ${res._id}`);
      count += 1;
    }
  }
  console.log(`\nFertig — ${count} Dokument(e) in Sanity (production).`);
}

main().catch((err) => {
  console.error("✗ Import fehlgeschlagen:", err.message);
  process.exit(1);
});
