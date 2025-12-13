# Snipcart Setup & Konfiguration - Schritt für Schritt Anleitung

Diese Anleitung führt dich durch die komplette Einrichtung von Snipcart für deinen BeAFox Merch-Shop.

---

## 📋 Übersicht

Nach dieser Anleitung hast du:

- ✅ Einen funktionierenden Snipcart-Shop
- ✅ Produkte, die zum Warenkorb hinzugefügt werden können
- ✅ Ein funktionierendes Checkout-System
- ✅ Automatische Bestellabwicklung

---

## 🚀 Schritt 1: Snipcart Account erstellen

1. **Gehe zu:** https://snipcart.com/
2. **Klicke auf:** "Start free trial" oder "Sign up"
3. **Erstelle einen Account:**
   - E-Mail-Adresse eingeben
   - Passwort erstellen
   - Bestätige deine E-Mail-Adresse

**Wichtig:** Snipcart bietet eine kostenlose Testphase. Nach der Testphase fallen nur Transaktionsgebühren an (2% + 0.30€ pro Transaktion).

---

## 🔑 Schritt 2: API Key abrufen

1. **Nach dem Login:** Gehe zu deinem Dashboard
2. **Navigiere zu:** Settings → API Keys
3. **Kopiere deinen Public API Key:**
   - Dieser beginnt normalerweise mit `MTA...` oder ähnlich
   - **WICHTIG:** Dies ist dein Public Key, er kann sicher im Frontend verwendet werden

**Beispiel:**

```
MTAyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4
```

NTU2ZmQ0YjEtNDhmNC00Y2E2LWFmYmQtM2RmZjU1M2QwYjBkNjM5MDEyNjA4NjA1NjUzNTgx
ST_MGM2MGY2YjItYmY2Zi00ZWI3LWFkM2QtZmZjM2Q1MDkxMjAzNjM5MDEyNjA5NDgzMzQyODI4

---

## 🔧 Schritt 3: Environment Variable konfigurieren

### Für lokale Entwicklung (.env.local):

1. **Erstelle oder öffne:** `.env.local` im Root-Verzeichnis deines Projekts
2. **Füge hinzu:**
   ```env
   NEXT_PUBLIC_SNIPCART_API_KEY=DEIN_API_KEY_HIER
   ```
3. **Ersetze** `DEIN_API_KEY_HIER` mit deinem tatsächlichen API Key aus Schritt 2

**Beispiel:**

```env
NEXT_PUBLIC_SNIPCART_API_KEY=MTAyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4
```

### Für Production (Vercel/Netlify):

#### **Vercel:**

1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt aus
3. Gehe zu **Settings** → **Environment Variables**
4. Füge eine neue Variable hinzu:
   - **Name:** `NEXT_PUBLIC_SNIPCART_API_KEY`
   - **Value:** Dein Snipcart API Key
   - **Environment:** Production, Preview, Development (alle auswählen)
5. **Redeploy** deine Anwendung

#### **Netlify:**

1. Gehe zu deinem Netlify Dashboard
2. Wähle dein Projekt aus
3. Gehe zu **Site settings** → **Environment variables**
4. Füge eine neue Variable hinzu:
   - **Key:** `NEXT_PUBLIC_SNIPCART_API_KEY`
   - **Value:** Dein Snipcart API Key
5. **Redeploy** deine Anwendung

---

## 🛍 Schritt 4: Produkte konfigurieren

### Aktuelle Implementierung:

Die Produkte sind aktuell in `app/shop/page.tsx` als Array definiert. Du kannst diese direkt dort bearbeiten.

### Produkt-Struktur:

```typescript
{
  id: "eindeutige-produkt-id",        // Eindeutige ID (z.B. "tshirt-beafox-001")
  name: "Produktname",                 // Name des Produkts
  description: "Produktbeschreibung",  // Beschreibung
  price: 29.99,                        // Preis in Euro
  image: "/merch/tshirt.jpg",          // Pfad zum Produktbild
  category: "Kleidung",                // Kategorie
  icon: <Shirt />,                     // Icon-Komponente
}
```

### Pflichtattribute für Snipcart:

Laut [Snipcart Dokumentation](https://docs.snipcart.com/v3/setup/products) sind folgende Attribute **erforderlich**:

- ✅ `data-item-id` - Eindeutige Produkt-ID
- ✅ `data-item-name` - Produktname
- ✅ `data-item-price` - Preis (mit `.` als Dezimaltrennzeichen, z.B. `29.99`)

**Optionale Attribute:**

- `data-item-url` - URL der Produktseite (optional seit Snipcart 3.2.2, standardmäßig wird `window.location.href` verwendet)
- `data-item-description` - Produktbeschreibung
- `data-item-image` - Produktbild-URL

### Produkte hinzufügen/bearbeiten:

1. **Öffne:** `app/shop/page.tsx`
2. **Finde:** Das `products` Array (ca. Zeile 20)
3. **Füge neue Produkte hinzu** oder bearbeite bestehende

**Beispiel für ein neues Produkt:**

```typescript
{
  id: "tasse-beafox-002",
  name: "BeAFox Premium Tasse",
  description: "Große Keramik-Tasse mit BeAFox-Logo",
  price: 16.99,
  image: "/merch/mug-premium.jpg",
  category: "Accessoires",
  icon: <Coffee className="w-6 h-6" />,
}
```

### Produktvarianten (Custom Fields) hinzufügen:

Für Produkte mit Varianten (z.B. Größe, Farbe) kannst du Custom Fields verwenden. Siehe [Snipcart Custom Fields Dokumentation](https://docs.snipcart.com/v3/setup/products#custom-fields).

**Beispiel für T-Shirt mit Größen:**

```tsx
<button
  className="snipcart-add-item"
  data-item-id="tshirt-beafox-001"
  data-item-price="29.99"
  data-item-name="BeAFox T-Shirt"
  data-item-description="Premium Baumwoll-T-Shirt"
  data-item-image="/merch/tshirt.jpg"
  data-item-url="/shop"
  data-item-custom1-name="Größe"
  data-item-custom1-options="XS|S|M|L|XL|XXL"
>
  In den Warenkorb
</button>
```

**Beispiel mit Preis-Modifikatoren:**

```tsx
<button
  className="snipcart-add-item"
  data-item-id="tshirt-beafox-001"
  data-item-price="29.99"
  data-item-name="BeAFox T-Shirt"
  data-item-custom1-name="Größe"
  data-item-custom1-options="XS|S|M|L|XL[+2.00]|XXL[+3.00]"
>
  In den Warenkorb
</button>
```

**Wichtig:**

- Jede Option muss durch `|` getrennt sein
- Preis-Modifikatoren werden in eckigen Klammern angegeben: `[+2.00]` oder `[-1.00]`
- Du kannst bis zu 10 Custom Fields verwenden (`data-item-custom1-name` bis `data-item-custom10-name`)

### Weitere nützliche Attribute:

**Mengensteuerung:**

- `data-item-quantity` - Standard-Menge beim Hinzufügen
- `data-item-min-quantity` - Mindestmenge
- `data-item-max-quantity` - Maximale Menge
- `data-item-quantity-step` - Schrittweite für Mengenänderung

**Versand:**

- `data-item-shippable="false"` - Für digitale Produkte (kein Versand)

**Steuern:**

- `data-item-taxable="false"` - Produkt von Steuern ausschließen
- `data-item-has-taxes-included="true"` - Steuern bereits im Preis enthalten

---

## 🖼 Schritt 5: Produktbilder hinzufügen

1. **Erstelle einen Ordner:** `public/merch/`
2. **Lade deine Produktbilder hoch:**

   - Empfohlene Größe: 800x800px oder größer
   - Format: JPG oder PNG
   - Dateinamen: z.B. `tshirt.jpg`, `hoodie.jpg`, `mug.jpg`

3. **Aktualisiere die Bildpfade** in `app/shop/page.tsx`:
   ```typescript
   image: "/merch/tshirt.jpg",  // Pfad relativ zu /public
   ```

**Hinweis:** Aktuell werden Platzhalter-Icons angezeigt. Sobald du Bilder hochgeladen hast, kannst du die `Image`-Komponente in `app/shop/page.tsx` aktivieren (siehe Kommentare im Code).

---

## 💳 Schritt 6: Zahlungsmethoden konfigurieren

1. **Gehe zu:** Snipcart Dashboard → Settings → Payment Gateways
2. **Wähle deine Zahlungsmethoden:**
   - **Stripe** (empfohlen für EU)
   - **PayPal**
   - **SEPA Direct Debit** (für Deutschland)

### Stripe Setup (empfohlen):

1. **Erstelle einen Stripe Account:** https://stripe.com/
2. **Gehe zu:** Stripe Dashboard → Developers → API keys
3. **Kopiere deine Keys:**
   - Publishable Key (beginnt mit `pk_`)
   - Secret Key (beginnt mit `sk_`)
4. **In Snipcart:**
   - Gehe zu Settings → Payment Gateways → Stripe
   - Füge deine Stripe Keys ein
   - Aktiviere Stripe

**Wichtig:** Für Test-Zahlungen verwende Stripe Test-Keys (beginnen mit `pk_test_` und `sk_test_`).

---

## 🚚 Schritt 7: Versand konfigurieren

1. **Gehe zu:** Snipcart Dashboard → Settings → Shipping
2. **Füge Versandoptionen hinzu:**

### Beispiel-Konfiguration für Deutschland:

**Standard-Versand:**

- Name: "Standard Versand"
- Preis: 4,99 €
- Länder: Deutschland
- DHL, DPD, Hermes

**Express-Versand:**

- Name: "Express Versand"
- Preis: 9,99 €
- Länder: Deutschland
- DHL Express

**Kostenloser Versand (ab Bestellwert):**

- Name: "Kostenloser Versand"
- Preis: 0,00 €
- Länder: Deutschland
- Mindestbestellwert: 50,00 €

---

## 📧 Schritt 8: E-Mail-Benachrichtigungen konfigurieren

1. **Gehe zu:** Snipcart Dashboard → Settings → Notifications
2. **Konfiguriere E-Mails:**
   - **Bestätigungs-E-Mail an Kunden:** Aktivieren
   - **Benachrichtigung an dich:** Aktivieren
   - **E-Mail-Templates anpassen:** Optional

### E-Mail-Template anpassen:

Du kannst die Standard-Templates verwenden oder eigene erstellen. Die E-Mails enthalten automatisch:

- Bestelldetails
- Rechnungsinformationen
- Versandinformationen

---

## 🧪 Schritt 9: Test-Bestellung durchführen

### Test-Modus aktivieren:

1. **Gehe zu:** Snipcart Dashboard → Settings → Test Mode
2. **Aktiviere Test Mode**

### Test-Zahlung durchführen:

1. **Gehe zu:** https://beafox.app/shop (oder deine lokale URL)
2. **Füge ein Produkt zum Warenkorb hinzu**
3. **Klicke auf den Warenkorb** (Icon im Header)
4. **Führe den Checkout durch:**

   - Verwende Test-Kreditkartendaten:
     - **Kartennummer:** `4242 4242 4242 4242`
     - **Ablaufdatum:** Beliebige zukünftige Daten
     - **CVC:** Beliebige 3 Ziffern
     - **ZIP:** Beliebige Postleitzahl

5. **Prüfe im Snipcart Dashboard:**
   - Gehe zu Orders
   - Du solltest deine Test-Bestellung sehen

---

## 🔗 Schritt 10: Webhooks konfigurieren (Optional - für Printful Integration)

Wenn du später Printful für Print-on-Demand verwenden möchtest:

1. **Gehe zu:** Snipcart Dashboard → Settings → Webhooks
2. **Füge einen Webhook hinzu:**
   - **URL:** `https://deine-domain.com/api/webhooks/snipcart`
   - **Events:** Wähle "Order completed"
3. **Erstelle eine API Route** in Next.js:
   - `app/api/webhooks/snipcart/route.ts`
   - Diese Route empfängt Bestellungen und leitet sie an Printful weiter

**Hinweis:** Dies ist für später, wenn du Print-on-Demand implementieren möchtest.

---

## ✅ Schritt 11: Produktion aktivieren

### Test Mode deaktivieren:

1. **Gehe zu:** Snipcart Dashboard → Settings → Test Mode
2. **Deaktiviere Test Mode**

### Finale Checks:

- [ ] API Key ist korrekt in Environment Variables gesetzt
- [ ] Produktbilder sind hochgeladen
- [ ] Zahlungsmethoden sind konfiguriert
- [ ] Versandoptionen sind eingerichtet
- [ ] E-Mail-Benachrichtigungen sind aktiviert
- [ ] Test-Bestellung war erfolgreich

---

## 🎨 Schritt 12: Design anpassen (Optional)

### Snipcart Modal anpassen:

Die Snipcart-Modal-Stile können in `app/layout.tsx` angepasst werden:

```tsx
<div
  id="snipcart"
  data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY || ""}
  data-config-modal-style="side" // "side" oder "side" für Sidebar
  data-config-add-product-behavior="none" // Verhalten beim Hinzufügen
/>
```

### Weitere Customization-Optionen:

Siehe Snipcart Dokumentation: https://docs.snipcart.com/v3/setup/customization

---

## 📊 Schritt 13: Analytics & Tracking

### Snipcart Analytics:

1. **Gehe zu:** Snipcart Dashboard → Analytics
2. **Sieh dir an:**
   - Verkaufsstatistiken
   - Beliebte Produkte
   - Conversion-Rate
   - Durchschnittlicher Bestellwert

### Google Analytics Integration:

Snipcart sendet automatisch Events an Google Analytics (falls konfiguriert):

- `snipcart:cart:opened`
- `snipcart:cart:item:added`
- `snipcart:order:completed`

---

## 🐛 Troubleshooting

### Problem: Warenkorb öffnet sich nicht

**Lösung:**

- Prüfe, ob Snipcart SDK korrekt geladen wird (Browser Console)
- Prüfe, ob API Key korrekt gesetzt ist
- Prüfe, ob `snipcart-checkout` Klasse auf dem Button ist

### Problem: Produkte werden nicht hinzugefügt

**Lösung:**

- Prüfe, ob alle `data-item-*` Attribute korrekt sind
- Prüfe Browser Console auf Fehler
- Stelle sicher, dass `data-item-url` auf die aktuelle Seite zeigt

### Problem: Zahlung schlägt fehl

**Lösung:**

- Prüfe, ob Payment Gateway korrekt konfiguriert ist
- Prüfe, ob Test Mode aktiviert ist (für Tests)
- Prüfe Stripe/PayPal Konfiguration

### Problem: Environment Variable wird nicht geladen

**Lösung:**

- Stelle sicher, dass Variable mit `NEXT_PUBLIC_` beginnt
- Redeploy nach dem Hinzufügen der Variable
- Prüfe `.env.local` für lokale Entwicklung

---

## 📚 Weitere Ressourcen

- **Snipcart Dokumentation:** https://docs.snipcart.com/
- **Snipcart API Reference:** https://docs.snipcart.com/v3/api-reference
- **Snipcart Support:** https://snipcart.com/support
- **Next.js Environment Variables:** https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

---

## 🎉 Fertig!

Dein Snipcart-Shop ist jetzt eingerichtet und bereit für echte Bestellungen!

**Nächste Schritte:**

1. Füge echte Produktbilder hinzu
2. Teste den kompletten Bestellprozess
3. Konfiguriere Versandoptionen für deine Region
4. Aktiviere Produktion und starte Verkäufe!

Bei Fragen oder Problemen, siehe die Troubleshooting-Sektion oder kontaktiere den Snipcart Support.
