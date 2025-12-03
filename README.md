# BeAFox Website

Moderne Next.js-Website für BeAFox - Das Finanzbildungs-Ökosystem.

## 🚀 Schnellstart

### Installation

```bash
# Dependencies installieren
npm install
```

### Entwicklung

```bash
# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Production Build

```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start
```

## 📁 Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Startseite
│   ├── layout.tsx         # Root Layout
│   ├── globals.css        # Globale Styles
│   ├── ueber-beafox/      # Über BeAFox Seite
│   ├── preise/            # Preise Seite
│   ├── fuer-unternehmen/  # Für Unternehmen Seite
│   ├── fuer-schulen/      # Für Schulen Seite
│   ├── faq/               # FAQ Seite
│   ├── kontakt/           # Kontakt Seite
│   ├── impressum/         # Impressum
│   ├── datenschutz/       # Datenschutz
│   └── agb/               # AGB
├── components/            # React Komponenten
│   ├── Header.tsx        # Header/Navigation
│   ├── Footer.tsx        # Footer
│   ├── Button.tsx        # Button Komponente
│   └── Section.tsx       # Section Wrapper
└── public/                # Statische Assets
```

## 🛠 Technologien

- **Next.js 14** - React Framework mit App Router
- **TypeScript** - Type-safe Development
- **Tailwind CSS** - Utility-first CSS Framework
- **Framer Motion** - Animation Library
- **Lucide React** - Icon Library

## ✨ Features

- ✅ Vollständig responsive Design
- ✅ Moderne Animationen mit Framer Motion
- ✅ Alle Unterseiten der originalen Website
- ✅ SEO-optimiert
- ✅ TypeScript für Type Safety
- ✅ Moderne UI/UX inspiriert von Duolingo & Seasn

## 📝 Seiten

- **Startseite** (`/`) - Hero, Features, Partner, CTA Sections
- **Über BeAFox** (`/ueber-beafox`) - Geschichte, Werte, Erfolge
- **Preise** (`/preise`) - Preispläne für Schulen, Unternehmen, Privatpersonen
- **Für Unternehmen** (`/fuer-unternehmen`) - Business-Lösungen
- **Für Schulen** (`/fuer-schulen`) - Schul-Lösungen
- **FAQ** (`/faq`) - Häufige Fragen mit Accordion
- **Kontakt** (`/kontakt`) - Kontaktformular und Kontaktdaten
- **Impressum** (`/impressum`) - Rechtliche Angaben
- **Datenschutz** (`/datenschutz`) - Datenschutzerklärung
- **AGB** (`/agb`) - Allgemeine Geschäftsbedingungen

## 🎨 Design

Das Design ist inspiriert von:
- [Duolingo](https://de.duolingo.com/) - Spielerisches, modernes Design
- [Seasn](https://seasn.de/) - Clean, minimalistisches Layout

## 📦 Deployment

Die Website kann auf folgenden Plattformen deployed werden:

- **Vercel** (empfohlen für Next.js)
- **Netlify**
- **AWS Amplify**
- Jeder Node.js-Hosting-Service

## 🔧 Anpassungen

### Farben ändern

Farben können in `tailwind.config.ts` angepasst werden:

```typescript
colors: {
  primary: { ... },
  accent: { ... }
}
```

### Inhalte anpassen

Alle Inhalte befinden sich direkt in den Page-Komponenten unter `app/`.

## 📄 Lizenz

Copyright © 2025 BeAFox UG (haftungsbeschränkt)

