# SEO Setup & Best Practices

Diese Dokumentation beschreibt alle implementierten SEO-Maßnahmen für die BeAFox Website.

## ✅ Implementierte SEO-Features

### 1. Sitemap.xml

- **Datei**: `app/sitemap.ts`
- **Status**: ✅ Implementiert
- **Funktionalität**: Dynamische Generierung aller Seiten mit Prioritäten und Änderungsfrequenzen
- **URL**: `https://beafox.app/sitemap.xml`

### 2. Robots.txt

- **Datei**: `app/robots.ts`
- **Status**: ✅ Implementiert
- **Funktionalität**: Steuert Crawler-Zugriff, erlaubt alle Seiten außer `/api/` und `/_next/`
- **URL**: `https://beafox.app/robots.txt`

### 3. Meta-Tags (Root Layout)

- **Datei**: `app/layout.tsx`
- **Status**: ✅ Implementiert
- **Features**:
  - Title Template mit Fallback
  - Meta Description
  - Keywords
  - Open Graph Tags (Facebook, LinkedIn)
  - Twitter Card Tags
  - Canonical URLs
  - Robots Meta Tags
  - Author & Publisher Information

### 4. Seiten-spezifische Meta-Tags

- **Status**: ✅ Implementiert für alle Seiten
- **Layout-Dateien erstellt für**:
  - `/ueber-beafox`
  - `/preise`
  - `/fuer-unternehmen`
  - `/fuer-schulen`
  - `/fuer-clubs`
  - `/beafox-unlimited`
  - `/kontakt`
  - `/faq`
  - `/blog`
  - `/blog/updates`
  - `/guidelines`
  - `/impressum` (noindex)
  - `/datenschutz` (noindex)
  - `/agb` (noindex)

### 5. Structured Data (Schema.org)

- **Komponente**: `components/StructuredData.tsx`
- **Status**: ✅ Implementiert auf Homepage
- **Schemas**:
  - **Organization Schema**: Firmendaten, Kontaktinformationen, Social Media Links
  - **WebSite Schema**: Website-Informationen mit SearchAction
  - **SoftwareApplication Schema**: App-Details, Bewertungen, Preise

## 📋 Noch zu erledigen (Manuelle Schritte)

### 1. Open Graph Image erstellen

- **Erforderlich**: Erstelle eine OG-Image-Datei (`/public/assets/og-image.jpg`)
- **Spezifikationen**:
  - Größe: 1200x630 Pixel
  - Format: JPG oder PNG
  - Inhalt: BeAFox Logo + Hauptslogan
  - Dateipfad: `/public/assets/og-image.jpg`

### 2. Google Search Console einrichten

1. Gehe zu [Google Search Console](https://search.google.com/search-console)
2. Füge die Property `https://beafox.app` hinzu
3. Verifiziere die Domain (DNS oder HTML-Tag)
4. Füge den Verification-Code in `app/layout.tsx` ein:
   ```typescript
   verification: {
     google: "your-google-verification-code",
   },
   ```

### 3. Bing Webmaster Tools einrichten

1. Gehe zu [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Füge die Website hinzu
3. Verifiziere die Domain
4. Füge den Verification-Code in `app/layout.tsx` ein:
   ```typescript
   verification: {
     other: "your-bing-verification-code",
   },
   ```

### 4. Sitemap einreichen

Nach dem Deployment:

1. Google Search Console → Sitemaps → `https://beafox.app/sitemap.xml` hinzufügen
2. Bing Webmaster Tools → Sitemaps → `https://beafox.app/sitemap.xml` hinzufügen

### 5. Twitter Handle aktualisieren

- Aktuell: `@beafox_app` (in `app/layout.tsx`)
- Prüfe, ob dieser Handle korrekt ist und aktualisiere falls nötig

### 6. Social Media Links prüfen

- Aktuell in Structured Data:
  - Instagram: `https://www.instagram.com/beafox_app`
  - LinkedIn: `https://www.linkedin.com/company/beafox`
  - Twitter: `https://twitter.com/beafox_app`
  - YouTube: `https://www.youtube.com/@beafox`
- Prüfe alle Links und aktualisiere falls nötig

### 7. Logo-Pfad prüfen

- Aktuell in Structured Data: `https://beafox.app/assets/logo.png`
- Stelle sicher, dass das Logo unter diesem Pfad verfügbar ist

## 🔍 SEO-Best Practices Checkliste

### Technische SEO

- ✅ Semantisches HTML5
- ✅ Mobile-First Responsive Design
- ✅ Schnelle Ladezeiten (Next.js Optimierungen)
- ✅ Bildoptimierung (next/image)
- ✅ Canonical URLs
- ✅ Robots.txt
- ✅ Sitemap.xml

### On-Page SEO

- ✅ Title Tags (einzigartig pro Seite)
- ✅ Meta Descriptions (einzigartig pro Seite)
- ✅ Heading-Hierarchie (H1, H2, H3)
- ✅ Alt-Texte für Bilder (zu prüfen)
- ✅ Interne Verlinkung
- ✅ Structured Data

### Content SEO

- ⚠️ Keyword-Optimierung (zu prüfen)
- ⚠️ Content-Länge (ausreichend für alle Seiten?)
- ⚠️ Fresh Content (Blog regelmäßig aktualisieren)

## 📊 Monitoring & Analytics

### Empfohlene Tools:

1. **Google Search Console**: Indexierung, Performance, Fehler
2. **Google Analytics**: Traffic, User Behavior
3. **PageSpeed Insights**: Performance-Metriken
4. **Schema Markup Validator**: Structured Data prüfen
   - URL: https://validator.schema.org/

## 🚀 Performance-Optimierungen

### Bereits implementiert:

- ✅ Next.js Image Optimization
- ✅ Code Splitting (automatisch durch Next.js)
- ✅ Font Optimization (next/font)

### Weitere Empfehlungen:

- CDN für statische Assets
- Lazy Loading für Bilder
- Service Worker für Offline-Funktionalität

## 📝 Wichtige Notizen

1. **Rechtliche Seiten (noindex)**:

   - `/impressum`
   - `/datenschutz`
   - `/agb`
   - Diese Seiten werden nicht von Suchmaschinen indexiert, aber können gefolgt werden.

2. **Canonical URLs**:

   - Alle Seiten haben eine Canonical URL
   - Verhindert Duplicate Content

3. **Structured Data**:
   - Aktuell nur auf der Homepage
   - Kann für Blog-Posts erweitert werden (Article Schema)

## 🔄 Regelmäßige Wartung

- **Wöchentlich**: Blog-Inhalte aktualisieren
- **Monatlich**: Sitemap prüfen, neue Seiten hinzufügen
- **Quartal**: SEO-Performance analysieren, Keywords prüfen
- **Jährlich**: Meta-Descriptions überarbeiten, Content aktualisieren

## 📞 Support

Bei Fragen zur SEO-Implementierung:

- Dokumentation: Diese Datei
- Next.js SEO Docs: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Schema.org Docs: https://schema.org/
