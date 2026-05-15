# Sanity Seed — Beispiel-Ratgeber

Dieser Ordner enthält den Beispiel-Ratgeber **„Auto kaufen oder leasen"** im
einheitlichen Kompakt-Format. Er dient zwei Zwecken:

1. Als **Referenz** für die Redaktion, wie ein vollständiger Ratgeber aussieht.
2. Als **Import-Datei**, um den Sanity-Datensatz mit echten Inhalten zu füllen.

## Dateien

- `build-seed.py` — Generator-Skript. Baut die Import-Datei aus lesbarem
  Python-Code (inkl. automatisch vergebener `_key`s).
- `auto-kaufen-oder-leasen.ndjson` — die generierte Import-Datei (NDJSON,
  ein Dokument pro Zeile): die **3 Autoren** (Prof. Dr. Marcel Dulgeridis,
  Alexandru Fuchs, Selina Fuchs) plus der **Ratgeber**. **Nicht von Hand
  bearbeiten** — stattdessen `build-seed.py` anpassen und neu ausführen.
- `import.cjs` — Import-Skript. Schreibt die NDJSON-Dokumente per
  `@sanity/client` in den Datensatz (`createOrReplace`).
- `migrate-categories.cjs` — Einmal-Migration: setzt alte Kategorie-Slugs
  auf die Kurzform (`finanzen-fuer-azubis` → `azubis` usw.).
- `migrate-authors.cjs` — Einmal-Migration: weist Ratgebern ohne Autor einen
  rotierenden Autor zu.

## Verwendung

```bash
# 1. (Optional) Import-Datei neu generieren — nur nötig nach Inhaltsänderungen
python3 sanity/seed/build-seed.py

# 2. In den Sanity-Datensatz importieren (Autoren + Beispiel-Ratgeber)
npm run sanity:import

# 3. Einmalig: Alt-Ratgeber auf die neue Struktur bringen
npm run sanity:migrate-categories   # alte Kategorie-Slugs → Kurzform
npm run sanity:migrate-authors      # rotierender Autor für Alt-Ratgeber
```

`npm run sanity:import` lädt den Write-Token aus `.env` (`SANITY_API_TOKEN`)
und schreibt jedes Dokument nach Sanity (`production`). Der Import nutzt eine
feste `_id` (`guide-auto-kaufen-oder-leasen`) — ein erneuter Import **ersetzt**
das Dokument, ist also gefahrlos wiederholbar.

Voraussetzung: In `.env` muss `SANITY_API_TOKEN` mit Schreibrechten gesetzt
sein. Alternativ funktioniert auch `npx sanity dataset import
sanity/seed/auto-kaufen-oder-leasen.ndjson production`, wenn man via
`npx sanity login` angemeldet ist.

## Datenquelle

Die Ratgeber-Seite (`app/[kategorie]/[slug]/page.tsx`) ist **rein
Sanity-getrieben** — es gibt keine Dummy-Daten mehr. Liefert Sanity zu
einem Slug kein Dokument, rendert die Seite `notFound()` (404).

Damit ein Ratgeber live ist, muss er also in Sanity existieren — entweder
über diesen Seed-Import oder direkt im Studio angelegt.
