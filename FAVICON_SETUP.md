# Favicon Setup Guide

Diese Anleitung zeigt dir, wie du perfekte Favicons für die BeAFox Website erstellst.

## 🎯 Schritt-für-Schritt Anleitung

### Schritt 1: Favicons erstellen

**Empfohlene Tools:**

1. **RealFaviconGenerator** (BESTE OPTION)

   - URL: https://realfavicongenerator.net/
   - Vorteile:
     - Automatische Generierung aller benötigten Formate
     - Vorschau für alle Plattformen (iOS, Android, Windows, etc.)
     - Optimierte Dateien
     - Generiert auch `manifest.json` und `browserconfig.xml`

2. **Favicon.io**
   - URL: https://favicon.io/
   - Vorteile:
     - Einfache Bedienung
     - Schnelle Generierung

### Schritt 2: Logo vorbereiten

**Empfehlungen für das Logo:**

- **Quelldatei**: Verwende dein Logo als PNG oder SVG
- **Mindestgröße**: 512x512 Pixel (für beste Qualität)
- **Format**: PNG mit **transparentem Hintergrund** (WICHTIG!)
- **Inhalt**: Logo sollte auch bei kleinen Größen erkennbar sein
- **Hintergrund**: Muss transparent sein (kein weißer Hintergrund!)

### Schritt 3: Favicons generieren (mit RealFaviconGenerator)

1. Gehe zu https://realfavicongenerator.net/
2. Klicke auf "Select your Favicon image"
3. **WICHTIG**: Lade dein Logo als PNG mit **transparentem Hintergrund** hoch
   - Falls dein Logo noch einen weißen Hintergrund hat:
     - Öffne es in Photoshop/GIMP/Figma
     - Entferne den weißen Hintergrund (Magic Wand Tool oder ähnlich)
     - Speichere als PNG mit transparentem Hintergrund
4. **Wichtig**: Stelle sicher, dass das Logo gut sichtbar ist
5. Scrolle nach unten und passe die Einstellungen an:
   - **iOS**: Apple Touch Icon aktivieren
     - **iOS Background**: Wähle eine Farbe (z.B. Orange #ff6b35) oder "Kein Hintergrund"
   - **Android Chrome**: Manifest aktivieren
   - **Windows Metro**: Optional (für Windows-Tiles)
   - **Favicon für Desktop**: Stelle sicher, dass "Transparenz beibehalten" aktiviert ist
6. Klicke auf "Generate your Favicons and HTML code"
7. Lade das Paket herunter

### Schritt 4: Favicons einbinden

**Dateien im Download-Paket:**

- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `manifest.json`
- `browserconfig.xml` (optional)

**Einbindung:**

1. **Favicon-Dateien kopieren:**

   ```
   public/
   ├── favicon.ico
   ├── favicon-16x16.png
   ├── favicon-32x32.png
   ├── apple-touch-icon.png
   ├── android-chrome-192x192.png
   ├── android-chrome-512x512.png
   ├── manifest.json
   └── browserconfig.xml (optional)
   ```

2. **Layout aktualisieren:**
   Das Layout (`app/layout.tsx`) wird automatisch aktualisiert, sobald die Dateien vorhanden sind.

## 📋 Benötigte Favicon-Größen

| Größe   | Verwendung       | Dateiname                    |
| ------- | ---------------- | ---------------------------- |
| 16x16   | Standard Favicon | `favicon.ico`                |
| 32x32   | Standard Favicon | `favicon-32x32.png`          |
| 180x180 | Apple Touch Icon | `apple-touch-icon.png`       |
| 192x192 | Android Chrome   | `android-chrome-192x192.png` |
| 512x512 | Android Chrome   | `android-chrome-512x512.png` |

## 🔧 Aktuelle Konfiguration

Die Favicons werden automatisch von Next.js erkannt, wenn sie im `public/` Verzeichnis liegen.

**Aktuelle Einbindung in `app/layout.tsx`:**

```typescript
icons: {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180" },
  ],
  other: [
    {
      rel: "android-chrome-192x192",
      url: "/android-chrome-192x192.png",
    },
    {
      rel: "android-chrome-512x512",
      url: "/android-chrome-512x512.png",
    },
  ],
},
```

## ✅ Checkliste

- [ ] Logo vorbereitet (mindestens 512x512 Pixel)
- [ ] Favicons mit RealFaviconGenerator generiert
- [ ] Alle Dateien in `/public/` kopiert
- [ ] Favicons im Browser getestet
- [ ] Apple Touch Icon auf iOS-Gerät getestet
- [ ] Android Chrome Icon auf Android-Gerät getestet

## 🧪 Testen

Nach dem Einbinden der Favicons:

1. **Browser-Cache leeren** (wichtig!)

   - Chrome: `Ctrl+Shift+Delete` → "Bilder und Dateien im Cache"
   - Firefox: `Ctrl+Shift+Delete` → "Cache"
   - Safari: Entwicklermenü → "Caches leeren"

2. **Favicon testen:**

   - Öffne `https://beafox.app` im Browser
   - Prüfe das Favicon im Browser-Tab
   - Prüfe auf verschiedenen Geräten (Desktop, iOS, Android)

3. **Online-Tools zum Testen:**
   - https://realfavicongenerator.net/favicon_checker
   - Gibt Feedback zu allen Favicon-Formaten

## 💡 Tipps

1. **Logo-Optimierung:**

   - Stelle sicher, dass das Logo auch bei 16x16 Pixel erkennbar ist
   - Vermeide zu viele Details
   - Verwende klare Kontraste

2. **Performance:**

   - Favicons sollten klein sein (< 50 KB)
   - Verwende PNG für bessere Qualität
   - ICO-Datei kann mehrere Größen enthalten

3. **Cross-Platform:**
   - Teste auf verschiedenen Browsern
   - Teste auf verschiedenen Geräten
   - Prüfe Dark Mode (falls unterstützt)

## 🔗 Nützliche Links

- RealFaviconGenerator: https://realfavicongenerator.net/
- Favicon.io: https://favicon.io/
- Favicon Checker: https://realfavicongenerator.net/favicon_checker
- Next.js Icons Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
