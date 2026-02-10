# Mehrsprachigkeit (i18n) – nur Webseite

## Aktueller Stand

- **Projekt:** `beafox-webseite` (Next.js 14, App Router)
- **Sprache:** Alles fest auf Deutsch (DE)
- **Wo Text vorkommt:**
  - `app/layout.tsx`: Metadata (title, description, openGraph, etc.), `<html lang="de">`
  - `app/page.tsx`: Homepage-Texte (Hero, Use-Cases, Features, etc.)
  - `components/Header.tsx`: Navigation (`navItems`, `productItems`)
  - `components/Footer.tsx`: Links und Texte
  - Alle weiteren Seiten unter `app/*/page.tsx` und `app/*/layout.tsx` (z. B. FAQ, Preise, Kontakt, Impressum, Datenschutz)
- **Keine** i18n-Bibliothek installiert

---

## Ziel

- Webseite in mehreren Sprachen (z. B. Deutsch + Englisch).
- **Sprache ermitteln durch:**
  1. **Browser/Handy:** `Accept-Language` (vom Gerät/Browser).
  2. **Optional:** Nutzer wählt manuell (z. B. Sprachumschalter im Header) → Speicherung in Cookie, damit die Wahl erhalten bleibt.

---

## Empfohlene Lösung: next-intl (Next.js 14 App Router)

- Gut mit Next.js 14 App Router und Server/Client Components.
- Locale über **Middleware** (z. B. aus Cookie + Fallback auf `Accept-Language`).
- Optional: Locale im Pfad (`/de/...`, `/en/...`) für SEO und klare URLs.

### 1. Paket installieren

```bash
cd beafox-webseite
npm install next-intl
```

### 2. Ordnerstruktur (Vorschlag)

```
beafox-webseite/
├── app/
│   └── [locale]/           # alle Routen unter Locale
│       ├── layout.tsx      # Root-Layout pro Sprache
│       ├── page.tsx
│       ├── preise/
│       ├── faq/
│       └── ...
├── messages/
│   ├── de.json
│   └── en.json
├── i18n/
│   ├── request.ts          # getRequestConfig für next-intl
│   └── routing.ts          # Locales, defaultLocale, pathnames
└── middleware.ts           # Locale-Erkennung (Cookie + Accept-Language)
```

### 3. Sprache erkennen (Land/Browser/Handy)

- **In der Middleware:**
  - Zuerst: **Cookie** prüfen (z. B. `NEXT_LOCALE=de` oder `en`), falls der Nutzer manuell gewählt hat.
  - Kein Cookie: **`Accept-Language`** vom Request lesen (kommt vom Browser/Handy und reflektiert oft die Systemsprache/Region).
  - Fallback: z. B. `de` als Default.

- **Beispiel-Logik (Pseudocode):**

```ts
// middleware.ts
const locale = request.cookies.get('NEXT_LOCALE')?.value
  ?? getLocaleFromAcceptLanguage(request.headers.get('accept-language'))
  ?? 'de';
```

- `getLocaleFromAcceptLanguage`: Header parsen (z. B. `de-DE,de;q=0.9,en;q=0.8`) und erste unterstützte Locale wählen (z. B. `de` oder `en`).

- **Land:** Die Browsersprache ist meist schon an die Region angepasst (z. B. Österreich → oft `de-AT`). Eine reine „Land-Erkennung“ (z. B. per Geo-IP) ist optional; für „Sprache nach Land/Handy“ reicht in der Regel `Accept-Language` + optional Cookie.

### 4. Übersetzungsdateien

- **messages/de.json** und **messages/en.json** mit gleichen Keys, z. B.:

```json
{
  "nav": {
    "home": "Startseite",
    "about": "Über BeAFox",
    "pricing": "Preise",
    "faq": "FAQ's"
  },
  "home": {
    "hero": { "title": "...", "subtitle": "..." },
    "cta": "Jetzt starten"
  }
}
```

- In Komponenten: `useTranslations('nav')` bzw. `t('home.hero.title')` (Client/Server je nach next-intl-Setup).

### 5. Sprachumschalter (optional)

- Im **Header** (oder Footer) ein Dropdown/Buttons: „DE | EN“.
- Bei Klick: Locale in Cookie setzen (z. B. `NEXT_LOCALE=en`) und zur aktuellen Seite in der neuen Locale wechseln (z. B. `/{locale}/preise`).
- Beim nächsten Besuch liest die Middleware das Cookie und zeigt die gewählte Sprache, unabhängig von Browser/Handy.

### 6. Wichtige Anpassungen

- **Metadata pro Sprache:** In `layout.tsx` für `[locale]` title/description aus den Übersetzungen oder aus einer mappings pro Locale laden.
- **Canonical/Alternates:** `alternates.canonical` und `alternates.languages` (hreflang) für DE/EN setzen, damit Suchmaschinen die Sprachversionen verstehen.
- **Alle statischen Texte** schrittweise aus den Komponenten in `messages/de.json` / `messages/en.json` auslagern und über next-intl einbinden.

---

## Kurz: „Sprache nach Land/Handy“

- **Automatik:** Cookie (wenn gesetzt) → sonst **Accept-Language** (Browser/Handy) → sonst Default (z. B. DE). Das deckt „Sprache wechselt sich nach Gerät/Region“ in der Praxis ab.
- **Manuell:** Sprachumschalter setzt Cookie; Middleware nutzt diese Wahl beim nächsten Request.

Wenn du möchtest, kann als Nächster Schritt die konkrete **middleware.ts**, **i18n/request.ts** und ein **Beispiel-Layout mit useTranslations** für die Webseite ausgearbeitet werden (ohne die App anzufassen).
