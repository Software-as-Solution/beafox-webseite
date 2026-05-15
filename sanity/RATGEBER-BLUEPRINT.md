# Ratgeber-Blueprint & SEO-Checkliste

Diese Datei beschreibt, wie jeder BeAFox-Ratgeber aufgebaut sein muss — als
Referenz für die Redaktion und als Begründung hinter dem Sanity-Schema. Der
Beispiel-Ratgeber „Auto kaufen oder leasen" (`sanity/seed/`) ist die lebende
Vorlage: So sieht ein vollständiger Ratgeber aus.

## Zielgruppe & Mission

Wir schreiben für **junge Menschen bis ca. 28**. Der Anspruch: *der einzige
Ratgeber, der junge Menschen wirklich versteht* — mit Bea als „deine beste
Freundin für Finanzen". Das heißt konkret:

- **Kompakt und scanbar**, nicht die Textwüste von Finanzfluss & Co. Kurze
  Aufmerksamkeitsspanne ernst nehmen.
- **Visuell und interaktiv** — Information wird über Grafiken und interaktive
  Elemente transportiert, nicht über lange Absätze.
- **Schnelle Conversion zu Bea** — der Ratgeber beantwortet die *allgemeine*
  Frage, Bea übernimmt die *persönliche*.

## Das Modell: Antwort-Ebene + Mach-Ebene

Jeder Ratgeber hat zwei Jobs:

1. **Antwort-Ebene** — beantwortet die allgemeine Frage vollständig und schnell
   scanbar: „Welche Optionen gibt es, was kostet was, worauf achten." Das ist
   der Teil, der bei Google rankt.
2. **Mach-Ebene** — die persönliche Frage („Was ist für *mich* richtig?")
   beantwortet der Ratgeber bewusst **nicht** zu Ende, sondern reicht sie an
   Bea weiter. Jedes Kapitel endet im Frag-Bea-Block — das ist der emotionale
   Höhepunkt des Kapitels, nicht ein Anhängsel.

So entsteht kein Widerspruch zwischen „kompakt" und „rankt": **Tiefe ≠ Länge.**
Google belohnt, wie vollständig die Suchabsicht getroffen wird — nicht die
Wortzahl. Tiefe transportieren wir über *Struktur und Format* (Tabellen,
Visual-Blöcke, interaktive Elemente), nicht über Absätze.

## Content-Disziplin (verbindlich)

- **Pro Kapitel maximal ~2 kurze Absätze Fließtext** plus *ein* Visual- oder
  interaktives Element, das den Rest der Information trägt.
- **Visual-first**: Bevor du etwas ausformulierst, frag dich — geht das als
  Kostenbalken, Zeitstrahl, Stat-Karte, Tabelle oder interaktives Element?
- **Abdeckung breit, Prosa knapp**: Alle Unterfragen des Themas kommen vor —
  aber jede knapp. Keine Wiederholungen, kein Fülltext.
- **Du-Ansprache**, kein Behördendeutsch, keine Schachtelsätze.
- **Beispiele aus der Lebenswelt der Zielgruppe**: erstes Auto statt
  Firmenwagen-Leasing, Azubi-Gehalt statt Geschäftsführer-Gehalt.

## Die feste Struktur

1. **Meta & SEO** — Titel, Slug, Kategorie, SEO-Felder, Autor, Datum, Tags
2. **Einstieg** („Darum geht's") — 2–3 Sätze Teaser, der die Spannung benennt
   und mit der offenen Frage endet. **Keine fertige Antwort** — der Nutzer
   soll weiterlesen, nicht abspringen.
3. **Genau 4 Kapitel** — jedes mit kurzem Text, **einem** interaktiven Element,
   optional **einem** Visual-Block und einer „Frag Bea"-Frage. Optional ein
   Hinweis/Tipp-Callout, der *zwischen* den Kapiteln gerendert wird (beim
   letzten Kapitel wird er nicht angezeigt).
4. **Abschluss-Block** (Pflicht) — entweder eine **Vergleichstabelle** (bei
   Vergleichsthemen, ein SERP-Feature-Magnet) oder eine **Zusammenfassung**
   „Das Wichtigste in Kürze". Jeder Ratgeber hat genau eines von beidem.
5. **Frag-Bea-Block** — Intro + 3 vorgefertigte Fragen, die den Bea-Chat öffnen.
6. **FAQ** — 4–6 Fragen, rendert FAQ-Schema (Rich-Result-Chance).
7. **Quellen** (optional) — Belege für Zahlen und Aussagen, stützt E-E-A-T.

## Visual-Blöcke (datengetrieben)

Statt handgemachter Infografiken (langsam, inkonsistent, SEO-riskant) gibt es
**datengetriebene Visual-Blöcke**: Die Redaktion gibt nur Zahlen ein, die
Komponente rendert daraus ein sauberes, markentreues Element. Die Daten stehen
als echter Text im DOM — kein Pixel-Risiko, voll indexierbar. Pro Kapitel
**maximal eines**:

- **Kostenbalken-Diagramm** (`costBarChart`) — Zahlenvergleich als Balken.
  Ideal statt einer Aufzählung von Beträgen.
- **Zeitstrahl** (`timeline`) — Abläufe, Schritt-für-Schritt-Themen.
- **Stat-Karte** (`statHighlight`) — 1–4 große Kennzahlen mit Erklärung.
- **Bild** (`figureImage`) — die Ausnahme, für echte Illustrationen. Alt-Text
  ist Pflicht.

## Was einen Ratgeber ranken lässt — Checkliste

Vor dem Veröffentlichen jeden Punkt durchgehen:

### Inhalt & Suchabsicht
- [ ] Der Titel enthält das Haupt-Keyword, wie Menschen es googeln.
- [ ] Die 4 Kapitel decken die **ganze** Suchabsicht ab — knapp, aber
      vollständig. Auch naheliegende Unterfragen und Sonderfälle.
- [ ] Irgendwo steht eine **knappe, direkte Antwort** (40–60 Wörter) auf die
      Hauptfrage — Futter fürs Featured Snippet (z. B. erster Absatz Kapitel 1).
- [ ] Content-Disziplin eingehalten: max ~2 Absätze + 1 Visual/Interaktiv je
      Kapitel. Kein Füll-Text.
- [ ] Der Abschluss-Block ist gesetzt: Vergleichstabelle (bei
      Vergleichsthemen) oder Zusammenfassung „Das Wichtigste in Kürze".
- [ ] Wo immer möglich: Information als Visual-Block statt als Absatz.

### E-E-A-T (Pflicht bei Finanzthemen — YMYL)
- [ ] Ein **echter Autor** ist zugeordnet (Rotation: Prof. Dr. Marcel
      Dulgeridis · Alexandru Fuchs · Selina Fuchs — bewusst abwechseln).
- [ ] Autor-Bio und Qualifikation sind korrekt und aussagekräftig.
- [ ] Zahlen und starke Aussagen sind mit **Quellen** belegt.
- [ ] Das Datum wird bei **jeder** Überarbeitung aktualisiert — Aktualität
      ist bei Geldthemen ein Rankingfaktor.

### Conversion zu Bea
- [ ] Jedes Kapitel endet im Frag-Bea-Block — die Frage ist konkret und greift
      genau den persönlichen Teil auf, den der Text bewusst offen lässt.
- [ ] Der Frag-Bea-Block am Ende hat 3 Fragen, die in den Bea-Chat führen.

### Technik (greift automatisch, nur prüfen)
- [ ] Metadaten kommen pro Ratgeber serverseitig (`[slug]/layout.tsx`):
      Titel = `metaTitle`, Description, **Canonical auf die Ratgeber-URL**,
      OG-Typ `article`. Niemals die Kategorie-Metadaten erben lassen.
- [ ] Inhalt + JSON-LD (Article, BreadcrumbList, FAQPage) stehen im initialen
      HTML — die Seite wird serverseitig gerendert.
- [ ] URL-Struktur `/kategorie/ratgeber-slug` — kurz, stabil, **nie wieder
      ändern** (Slug-Wechsel kostet Linkkraft).
- [ ] Vor dem Go-live: Production-Domain in den Sanity-CORS-Origins.

### Struktur & Verlinkung
- [ ] Genau ein `<h1>` (der Titel), Kapitel sind `<h2>`, Zwischen­überschriften
      `<h3>`.
- [ ] Im Fließtext auf verwandte Ratgeber **und** passende Finanzrechner
      verlinken — nicht nur „Weitere Ratgeber" am Ende.
- [ ] Jedes Kapitel hat genau ein interaktives Element — hält Verweildauer
      und Engagement hoch.

## Feld-für-Feld-Hinweise

| Feld | Hinweis |
|---|---|
| `title` | H1. Klar, konkret, mit Keyword. |
| `metaTitle` | `<title>`-Tag. Inkl. „\| BeAFox". 50–60 Zeichen ideal. |
| `metaDescription` | 150–160 Zeichen, macht neugierig, enthält Keyword. |
| `quickAnswer` | Teaser, **keine** Antwort. Endet mit der offenen Frage. |
| `author` | Pflicht. Zwischen den 3 Autoren abwechseln. |
| `publishedAt` | Das sichtbare Datum. Bei jeder Überarbeitung aktualisieren. |
| `chapters` | Genau 4. Je 1 interaktives Element, optional 1 Visual-Block. |
| `visual` (im Kapitel) | Optional, max 1. Datengetrieben bevorzugen. |
| `callout` (im Kapitel) | Optional. Hinweis/Tipp **zwischen** den Kapiteln. |
| `summary` | Pflicht. Genau ein Abschluss-Block: Vergleichstabelle **oder** Zusammenfassung. |
| `beaBlock` | Intro + genau 3 Fragen, die in den Bea-Chat führen. |
| `faq` | 4–6 Fragen. Erste Antwort snippet-tauglich formulieren. |
| `sources` | Belege. Stützt E-E-A-T, am Ende verlinkt. |

## Workflow

1. Ratgeber im Sanity Studio anlegen — das Schema erzwingt die feste Struktur
   (genau 4 Kapitel, je ein interaktives Element, Autor + Datum Pflicht usw.).
2. Autor zuweisen — bewusst rotieren, nicht immer dieselbe Person.
3. Content-Disziplin und die Checkliste oben durchgehen.
4. Bei jeder späteren Überarbeitung das Datum (`publishedAt`) aktualisieren.

## Technischer Hintergrund (für Entwickler)

- Schema: `sanity/schemas/guide.ts`, `objects/guideChapter.ts`,
  `objects/interactive.ts`, `objects/comparisonTable.ts`, `objects/summaryBox.ts`,
  `author.ts` und die
  Visual-Typen `objects/costBarChart.ts`, `objects/timeline.ts`,
  `objects/statHighlight.ts`, `objects/figureImage.ts`.
- Serverseitige Metadaten: `app/[kategorie]/[slug]/layout.tsx`
  (`generateMetadata` + `getGuideMeta`).
- Serverseitiges Rendering: `app/[kategorie]/[slug]/page.tsx` (Server-Komponente,
  `getGuideFull`) übergibt den Ratgeber als Prop an
  `components/guide/GuideArticle.tsx` (Client-Komponente mit den interaktiven
  Inseln). Inhalt + JSON-LD landen dadurch im initialen HTML.
- Interaktive Typen: Inline-Quiz, Zuordnungsübung, Rechne selbst,
  Mini-Checkliste, Schätz-Slider, Reihenfolge (Drag & Drop), Das oder das?,
  Wusstest du schon?.
- Visual-Typen: Kostenbalken-Diagramm, Zeitstrahl, Stat-Karte, Bild.
- Beispiel-Inhalt + Import: `sanity/seed/` (`build-seed.py`, `import.cjs`,
  `migrate-categories.cjs`, `migrate-authors.cjs`).

## Offene SEO-Baustellen (Stand: laufend)

- **Domain-Autorität**: Eine neue Domain überholt etablierte Wettbewerber
  (ADAC, Finanztip …) für hart umkämpfte Head-Terms nicht über Nacht. Der
  realistische Weg: erst Long-Tail-Rankings, durch das einzigartige
  interaktive/visuelle Format Backlinks sammeln, über Monate mitwachsen.
  Interaktive Tools werden verlinkt — Textartikel nicht. Das Format *ist* die
  Backlink-Strategie.
