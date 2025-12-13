# Snipcart Produkte - Vollständiger Guide

Diese Anleitung basiert auf der [offiziellen Snipcart Dokumentation](https://docs.snipcart.com/v3/setup/products) und zeigt dir alle Möglichkeiten zur Produktkonfiguration.

---

## 📋 Pflichtattribute

Diese Attribute **müssen** für jedes Produkt gesetzt sein:

| Attribute         | Beschreibung                            | Beispiel              |
| ----------------- | --------------------------------------- | --------------------- |
| `data-item-id`    | Eindeutige Produkt-ID                   | `"tshirt-beafox-001"` |
| `data-item-name`  | Produktname                             | `"BeAFox T-Shirt"`    |
| `data-item-price` | Preis (mit `.` als Dezimaltrennzeichen) | `"29.99"`             |

**Wichtig:**

- Der Preis muss als String mit `.` als Dezimaltrennzeichen angegeben werden
- Jedes Produkt muss eine eindeutige ID haben
- Produkte mit derselben ID müssen denselben Preis haben

---

## 🔧 Optionale Attribute

| Attribute               | Beschreibung                               | Beispiel                              |
| ----------------------- | ------------------------------------------ | ------------------------------------- |
| `data-item-url`         | URL der Produktseite (optional seit 3.2.2) | `"/shop"` oder `window.location.href` |
| `data-item-description` | Produktbeschreibung                        | `"Premium Baumwoll-T-Shirt"`          |
| `data-item-image`       | URL zum Produktbild                        | `"/merch/tshirt.jpg"`                 |

---

## 🎨 Custom Fields (Produktvarianten)

Custom Fields ermöglichen es, Produktvarianten wie Größe, Farbe, etc. anzubieten.

### 1. Dropdown (Auswahlliste)

**Syntax:**

```html
data-item-custom1-name="Feldname"
data-item-custom1-options="Option1|Option2|Option3"
```

**Beispiel:**

```tsx
<button
  className="snipcart-add-item"
  data-item-id="tshirt-beafox-001"
  data-item-price="29.99"
  data-item-name="BeAFox T-Shirt"
  data-item-custom1-name="Größe"
  data-item-custom1-options="XS|S|M|L|XL|XXL"
>
  In den Warenkorb
</button>
```

**Mit Preis-Modifikatoren:**

```tsx
data-item-custom1-options="XS|S|M|L|XL[+2.00]|XXL[+3.00]"
```

### 2. Textfeld (Standard)

Für freie Texteingabe:

```tsx
<button
  className="snipcart-add-item"
  data-item-id="notebook-beafox-001"
  data-item-price="12.99"
  data-item-name="BeAFox Notizbuch"
  data-item-custom1-name="Gravur-Text"
>
  In den Warenkorb
</button>
```

### 3. Checkbox

Für Ja/Nein-Optionen:

```tsx
<button
  className="snipcart-add-item"
  data-item-id="tshirt-beafox-001"
  data-item-price="29.99"
  data-item-name="BeAFox T-Shirt"
  data-item-custom1-name="Als Geschenk verpacken"
  data-item-custom1-type="checkbox"
  data-item-custom1-options="true[+2.00]|false"
>
  In den Warenkorb
</button>
```

### 4. Textarea

Für längere Texteingaben:

```tsx
<button
  className="snipcart-add-item"
  data-item-id="notebook-beafox-001"
  data-item-price="12.99"
  data-item-name="BeAFox Notizbuch"
  data-item-custom1-name="Persönliche Nachricht"
  data-item-custom1-type="textarea"
>
  In den Warenkorb
</button>
```

### 5. Readonly

Für nicht editierbare Informationen:

```tsx
<button
  className="snipcart-add-item"
  data-item-id="tshirt-beafox-001"
  data-item-price="29.99"
  data-item-name="BeAFox T-Shirt"
  data-item-custom1-name="Material"
  data-item-custom1-type="readonly"
  data-item-custom1-value="100% Bio-Baumwolle"
>
  In den Warenkorb
</button>
```

### 6. Hidden

Für versteckte Felder (z.B. für Tracking):

```tsx
<button
  className="snipcart-add-item"
  data-item-id="tshirt-beafox-001"
  data-item-price="29.99"
  data-item-name="BeAFox T-Shirt"
  data-item-custom1-name="Source"
  data-item-custom1-type="hidden"
  data-item-custom1-value="shop-page"
>
  In den Warenkorb
</button>
```

**Hinweis:** Du kannst bis zu 10 Custom Fields verwenden (`custom1` bis `custom10`).

---

## 🔢 Mengensteuerung

### Standard-Menge

```tsx
data-item-quantity="2"  // Fügt 2 Stück hinzu
```

### Mindestmenge

```tsx
data-item-min-quantity="3"  // Mindestens 3 Stück erforderlich
```

### Maximale Menge

```tsx
data-item-max-quantity="10"  // Maximal 10 Stück pro Bestellung
```

### Mengen-Schrittweite

```tsx
data-item-quantity-step="2"  // Erhöht/verringert Menge um 2
```

**Beispiel:**

```tsx
<button
  className="snipcart-add-item"
  data-item-id="sticker-beafox-001"
  data-item-price="4.99"
  data-item-name="BeAFox Sticker Pack"
  data-item-min-quantity="2"
  data-item-max-quantity="20"
  data-item-quantity-step="2"
>
  In den Warenkorb
</button>
```

---

## 📦 Versand-Konfiguration

### Nicht versandbare Produkte (Digitale Güter)

```tsx
data-item-shippable="false"
```

**Beispiel für digitales Produkt:**

```tsx
<button
  className="snipcart-add-item"
  data-item-id="ebook-beafox-001"
  data-item-price="9.99"
  data-item-name="BeAFox E-Book"
  data-item-shippable="false"
  data-item-file-guid="deine-file-guid-vom-dashboard"
>
  Download kaufen
</button>
```

---

## 💰 Steuer-Konfiguration

### Produkt von Steuern ausschließen

```tsx
data-item-taxable="false"
```

### Steuern bereits im Preis enthalten

```tsx
data-item-has-taxes-included="true"
```

### Spezifische Steuern anwenden

```tsx
data-item-taxes="MwSt|Umsatzsteuer"
```

**Beispiel:**

```tsx
<button
  className="snipcart-add-item"
  data-item-id="book-beafox-001"
  data-item-price="19.99"
  data-item-name="BeAFox Buch"
  data-item-taxable="true"
  data-item-taxes="MwSt"
>
  In den Warenkorb
</button>
```

---

## 🔄 Produkt-Verhalten

### Stacking-Verhalten

Steuert, ob identische Produkte gestapelt werden:

```tsx
data-item-stackable="never"  // Immer separate Einträge
data-item-stackable="always" // Immer stapeln
data-item-stackable="auto"   // Automatisch (Standard)
```

**Beispiel:**

```tsx
<button
  className="snipcart-add-item"
  data-item-id="engraved-notebook-001"
  data-item-price="12.99"
  data-item-name="Gravur-Notizbuch"
  data-item-custom1-name="Gravur-Text"
  data-item-stackable="never" // Jede Gravur ist einzigartig
>
  In den Warenkorb
</button>
```

---

## 📝 Vollständiges Beispiel

Hier ist ein vollständiges Beispiel mit mehreren Custom Fields:

```tsx
<button
  className="snipcart-add-item flex items-center gap-2 bg-primaryOrange text-primaryWhite px-6 py-3 rounded-full"
  data-item-id="tshirt-beafox-premium-001"
  data-item-price="34.99"
  data-item-name="BeAFox Premium T-Shirt"
  data-item-description="Premium Bio-Baumwoll-T-Shirt mit BeAFox-Logo"
  data-item-image="/merch/tshirt-premium.jpg"
  data-item-url="/shop"
  // Custom Fields
  data-item-custom1-name="Größe"
  data-item-custom1-options="XS|S|M|L|XL[+2.00]|XXL[+3.00]"
  data-item-custom2-name="Farbe"
  data-item-custom2-options="Schwarz|Weiß|Orange|Blau"
  data-item-custom3-name="Als Geschenk verpacken"
  data-item-custom3-type="checkbox"
  data-item-custom3-options="true[+2.50]|false"
  data-item-custom4-name="Gravur-Text (optional)"
  data-item-custom4-type="textarea"
  // Mengensteuerung
  data-item-min-quantity="1"
  data-item-max-quantity="5"
  // Versand & Steuern
  data-item-shippable="true"
  data-item-taxable="true"
>
  <ShoppingCart className="w-4 h-4" />
  In den Warenkorb
</button>
```

---

## 🎯 Best Practices

1. **Eindeutige IDs:** Verwende aussagekräftige, eindeutige IDs (z.B. `tshirt-beafox-premium-001`)

2. **Preis-Format:** Immer mit `.` als Dezimaltrennzeichen (z.B. `"29.99"` nicht `"29,99"`)

3. **Bildoptimierung:** Verwende optimierte Bilder (empfohlen: 800x800px oder größer)

4. **Custom Fields:** Nutze Custom Fields für alle Produktvarianten, die den Preis oder die Produktauswahl beeinflussen

5. **URL-Attribut:** Seit Snipcart 3.2.2 ist `data-item-url` optional. Wenn nicht gesetzt, wird automatisch `window.location.href` verwendet.

6. **Validierung:** Snipcart validiert Bestellungen, indem es die Produktseite crawlt. Stelle sicher, dass alle Produkte auf der Seite verfügbar sind.

---

## 📚 Weitere Ressourcen

- [Snipcart Produkte Dokumentation](https://docs.snipcart.com/v3/setup/products)
- [Snipcart Custom Fields](https://docs.snipcart.com/v3/setup/products#custom-fields)
- [Snipcart API Reference](https://docs.snipcart.com/v3/api-reference)

---

## ❓ Häufige Fragen

**Q: Kann ich mehr als 10 Custom Fields verwenden?**
A: Nein, Snipcart unterstützt maximal 10 Custom Fields pro Produkt.

**Q: Wie funktionieren Preis-Modifikatoren?**
A: Preis-Modifikatoren werden in eckigen Klammern angegeben: `Option[+5.00]` erhöht den Preis um 5€, `Option[-2.00]` verringert ihn um 2€.

**Q: Was passiert, wenn zwei Produkte dieselbe ID haben?**
A: Sie müssen denselben Preis haben, sonst schlägt die Validierung fehl. Verwende unterschiedliche IDs für unterschiedliche Preise.

**Q: Kann ich Custom Fields dynamisch ändern?**
A: Ja, du kannst Attribute mit JavaScript ändern, bevor das Produkt zum Warenkorb hinzugefügt wird. Siehe [Snipcart Dokumentation](https://docs.snipcart.com/v3/setup/products#update-item-before-adding-to-cart).
