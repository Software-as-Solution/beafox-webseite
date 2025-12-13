# Merch-Shop Integration - Best Practices & Optionen

## 🎯 Übersicht der Lösungen

### 1. **Printful + Shopify** (Empfohlen für Next.js) ⭐

**Vorteile:**

- ✅ Print-on-Demand (kein Lager nötig)
- ✅ Sehr gute Next.js/React Integration
- ✅ Shopify Storefront API für Headless Commerce
- ✅ Automatische Bestellabwicklung
- ✅ Hohe Produktqualität
- ✅ Internationaler Versand
- ✅ White-Label möglich

**Nachteile:**

- ⚠️ Monatliche Shopify-Kosten (~29€/Monat)
- ⚠️ Transaktionsgebühren (2.9% + 0.30€)

**Integration:**

- Shopify Storefront API für Produktanzeige
- Printful API für Produkterstellung
- Shopify Checkout oder Custom Checkout möglich

---

### 2. **Spreadshirt Shop Integration**

**Vorteile:**

- ✅ Print-on-Demand
- ✅ Keine monatlichen Kosten
- ✅ Spreadshirt übernimmt Produktion & Versand
- ✅ White-Label Shop möglich
- ✅ API verfügbar

**Nachteile:**

- ⚠️ Weniger flexible Design-Optionen
- ⚠️ Begrenzte Produktauswahl
- ⚠️ API-Dokumentation weniger umfangreich
- ⚠️ Design muss über Spreadshirt hochgeladen werden

**Integration:**

- Spreadshirt Shop-Integration (iframe oder API)
- White-Label Shop URL
- Produkte werden auf Spreadshirt-Seite verkauft

---

### 3. **Snipcart** (Headless E-Commerce für Next.js) ⭐

**Vorteile:**

- ✅ Perfekt für Next.js/React
- ✅ Keine Backend-Entwicklung nötig
- ✅ Einfache Integration (JavaScript SDK)
- ✅ Printful Integration möglich
- ✅ Pay-as-you-go Pricing (2% + 0.30€ pro Transaktion)
- ✅ Vollständige Kontrolle über Design

**Nachteile:**

- ⚠️ Transaktionsgebühren
- ⚠️ Printful-Integration muss selbst eingerichtet werden

**Integration:**

- Snipcart JavaScript SDK
- HTML-Attribute für Produkte
- Automatisches Checkout

---

### 4. **Medusa.js** (Open-Source E-Commerce)

**Vorteile:**

- ✅ Open-Source & kostenlos
- ✅ Vollständige Kontrolle
- ✅ Next.js Integration möglich
- ✅ Printful Plugin verfügbar

**Nachteile:**

- ⚠️ Mehr Entwicklungsaufwand
- ⚠️ Server-Hosting nötig
- ⚠️ Payment-Integration selbst implementieren

---

## 🏆 Empfehlung für BeAFox

### **Option A: Printful + Shopify Storefront API** (Beste UX)

**Warum:**

- Professionelles E-Commerce-Erlebnis
- Nahtlose Integration in bestehende Next.js-Seite
- Printful für Merch-Produktion
- Shopify für Checkout & Zahlungsabwicklung

**Implementierung:**

1. Shopify Store erstellen
2. Printful App in Shopify installieren
3. Shopify Storefront API für Produktanzeige nutzen
4. Custom Shop-Seite in Next.js erstellen
5. Shopify Checkout einbinden

**Kosten:** ~29€/Monat + Transaktionsgebühren

---

### **Option B: Snipcart + Printful** (Flexibel & Kosteneffizient)

**Warum:**

- Keine monatlichen Fixkosten
- Perfekt für Next.js
- Printful für Produktion
- Einfache Integration

**Implementierung:**

1. Snipcart Account erstellen
2. Printful Account erstellen
3. Snipcart SDK einbinden
4. Produkte als HTML-Attribute definieren
5. Webhooks für Printful-Bestellungen einrichten

**Kosten:** Nur Transaktionsgebühren (2% + 0.30€)

---

### **Option C: Spreadshirt White-Label Shop** (Schnellste Lösung)

**Warum:**

- Schnellste Implementierung
- Keine monatlichen Kosten
- Spreadshirt übernimmt alles

**Implementierung:**

1. Spreadshirt Account erstellen
2. White-Label Shop aktivieren
3. Shop als Subdomain oder iframe einbinden
4. Design-Upload über Spreadshirt

**Kosten:** Nur Spreadshirt-Margen

---

## 📋 Implementierungsplan (Empfohlen: Option B - Snipcart + Printful)

### Phase 1: Setup

1. ✅ Snipcart Account erstellen
2. ✅ Printful Account erstellen
3. ✅ Printful mit Snipcart verbinden
4. ✅ Produkte in Printful erstellen

### Phase 2: Frontend-Integration

1. ✅ Snipcart SDK in `app/layout.tsx` einbinden
2. ✅ Shop-Seite erstellen (`/shop`)
3. ✅ Produkt-Komponenten erstellen
4. ✅ Warenkorb-Funktionalität aktivieren

### Phase 3: Backend-Integration

1. ✅ Webhooks für Bestellungen einrichten
2. ✅ Printful-Integration für automatische Produktion
3. ✅ E-Mail-Benachrichtigungen

### Phase 4: Design & UX

1. ✅ Shop-Design an BeAFox-Branding anpassen
2. ✅ Produktbilder optimieren
3. ✅ Mobile-Responsive Design

---

## 🛠 Technische Details

### Snipcart Integration Beispiel

```tsx
// app/shop/page.tsx
"use client";

import Script from "next/script";

export default function ShopPage() {
  return (
    <>
      <Script
        src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js"
        strategy="afterInteractive"
      />
      <link
        rel="stylesheet"
        href="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.css"
      />

      <div className="container mx-auto py-12">
        <h1>BeAFox Merch Shop</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Produkt 1 */}
          <div className="border rounded-lg p-6">
            <img src="/merch/t-shirt.jpg" alt="BeAFox T-Shirt" />
            <h2>BeAFox T-Shirt</h2>
            <p>29,99 €</p>
            <button
              className="snipcart-add-item"
              data-item-id="tshirt-001"
              data-item-price="29.99"
              data-item-description="BeAFox T-Shirt"
              data-item-image="/merch/t-shirt.jpg"
              data-item-name="BeAFox T-Shirt"
              data-item-url="/shop"
            >
              In den Warenkorb
            </button>
          </div>
        </div>
      </div>

      <div
        id="snipcart"
        data-api-key="YOUR_SNIPCART_API_KEY"
        data-config-modal-style="side"
      />
    </>
  );
}
```

### Shopify Storefront API Beispiel

```tsx
// lib/shopify.ts
const SHOPIFY_STOREFRONT_API_URL = process.env.SHOPIFY_STOREFRONT_API_URL!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function getProducts() {
  const query = `
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  return response.json();
}
```

---

## 🎨 Design-Empfehlungen

1. **Konsistentes Branding:** BeAFox-Farben (primaryOrange) verwenden
2. **Produktkategorien:**
   - T-Shirts & Hoodies
   - Tassen & Trinkflaschen
   - Sticker & Aufkleber
   - Notizbücher
   - Taschen & Rucksäcke
3. **Produktbilder:** Hochwertige Mockups mit BeAFox-Logo
4. **Mobile-First:** Responsive Design für alle Geräte

---

## 📊 Vergleichstabelle

| Lösung                  | Setup-Zeit | Monatliche Kosten | Transaktionsgebühren | Flexibilität | Empfehlung                 |
| ----------------------- | ---------- | ----------------- | -------------------- | ------------ | -------------------------- |
| **Printful + Shopify**  | 2-3 Tage   | ~29€              | 2.9% + 0.30€         | ⭐⭐⭐⭐⭐   | Für professionellen Shop   |
| **Snipcart + Printful** | 1-2 Tage   | 0€                | 2% + 0.30€           | ⭐⭐⭐⭐     | Für schnellen Start        |
| **Spreadshirt**         | 1 Tag      | 0€                | Margen               | ⭐⭐         | Für minimale Integration   |
| **Medusa.js**           | 5-7 Tage   | Hosting           | Payment-Provider     | ⭐⭐⭐⭐⭐   | Für vollständige Kontrolle |

---

## 🚀 Nächste Schritte

1. **Entscheidung treffen:** Welche Lösung passt am besten?
2. **Accounts erstellen:** Printful/Snipcart/Shopify
3. **Designs vorbereiten:** BeAFox-Logo in verschiedenen Formaten
4. **Produktliste definieren:** Welche Merch-Artikel?
5. **Implementierung starten:** Shop-Seite erstellen

---

## 💡 Tipps

- **Start klein:** Beginne mit 3-5 Produkten
- **Test-Bestellung:** Bestelle selbst ein Produkt zum Testen
- **Versandkosten:** Klare Versandkosten kommunizieren
- **Rückgaberecht:** AGB für Merch-Shop anpassen
- **SEO:** Shop-Seite für SEO optimieren

---

## 📞 Support & Ressourcen

- **Snipcart Docs:** https://docs.snipcart.com/
- **Printful API:** https://developers.printful.com/
- **Shopify Storefront API:** https://shopify.dev/api/storefront
- **Spreadshirt API:** https://developers.spreadshirt.com/
