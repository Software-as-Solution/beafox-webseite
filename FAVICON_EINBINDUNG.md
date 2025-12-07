# Favicon Einbindung - Schritt für Schritt

## 📁 Dateien die du einfügen musst

Kopiere **alle diese Dateien** direkt in den `/public/` Ordner:

```
public/
├── favicon.ico                    ✅ Hauptfavicon
├── favicon.svg                    ✅ SVG Favicon (moderne Browser)
├── favicon-96x96.png              ✅ PNG Favicon
├── apple-touch-icon.png           ✅ Apple Touch Icon (iOS)
├── web-app-manifest-192x192.png   ✅ Android Icon (192x192)
├── web-app-manifest-512x512.png   ✅ Android Icon (512x512)
└── site.webmanifest              ✅ Web App Manifest
```

## ✅ Was bereits konfiguriert ist

Das Layout (`app/layout.tsx`) ist bereits so konfiguriert, dass es **alle diese Dateien automatisch verwendet**, sobald sie im `/public/` Ordner liegen.

## 🔧 Zusätzlich: Web Manifest einbinden

Falls du `site.webmanifest` hast, füge diesen Code in `app/layout.tsx` hinzu (nach Zeile 113):

```typescript
// Im <head> Bereich (wird automatisch von Next.js hinzugefügt)
```

Oder erstelle eine separate Datei `app/manifest.ts`:

```typescript
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BeAFox - Finanzbildungs-Ökosystem",
    short_name: "BeAFox",
    description:
      "Das erste unabhängige, spielerische Lern-App für Finanzbildung junger Menschen.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff6b35",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
```

## 📋 Checkliste

- [ ] `favicon.ico` in `/public/` kopiert
- [ ] `favicon.svg` in `/public/` kopiert
- [ ] `favicon-96x96.png` in `/public/` kopiert
- [ ] `apple-touch-icon.png` in `/public/` kopiert
- [ ] `web-app-manifest-192x192.png` in `/public/` kopiert
- [ ] `web-app-manifest-512x512.png` in `/public/` kopiert
- [ ] `site.webmanifest` in `/public/` kopiert (optional, wird automatisch erkannt)
- [ ] Browser-Cache geleert
- [ ] Favicon im Browser getestet

## 🧪 Testen

1. **Browser-Cache leeren** (sehr wichtig!)

   - Chrome: `Ctrl+Shift+Delete` → "Bilder und Dateien im Cache"
   - Oder: Hard Reload mit `Ctrl+Shift+R`

2. **Favicon prüfen:**

   - Öffne `http://localhost:3000` (oder deine Domain)
   - Schaue in den Browser-Tab → sollte das BeAFox Logo zeigen
   - Prüfe auch auf Mobile-Geräten

3. **Online-Test:**
   - https://realfavicongenerator.net/favicon_checker
   - Gibt Feedback zu allen Favicon-Formaten

## 💡 Wichtig

- **Dateinamen müssen exakt übereinstimmen** (Groß-/Kleinschreibung beachten!)
- Alle Dateien müssen direkt im `/public/` Ordner liegen (nicht in Unterordnern)
- Browser-Cache leeren ist essentiell, sonst siehst du die alten Favicons

## 🚀 Fertig!

Sobald alle Dateien im `/public/` Ordner sind, werden sie automatisch verwendet. Das Layout ist bereits konfiguriert!
