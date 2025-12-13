# Stripe Integration mit Snipcart - Checkliste

Da du Stripe als Payment Gateway in Snipcart aktiviert hast, hier eine Checkliste, um sicherzustellen, dass alles korrekt eingerichtet ist.

---

## ✅ Was bereits erledigt ist

- ✅ Stripe im Snipcart Dashboard aktiviert
- ✅ Frontend-Code benötigt keine Änderungen (Snipcart übernimmt alles)

---

## 🔍 Was du noch prüfen solltest

### 1. Stripe API Keys abrufen

**Schritt-für-Schritt Anleitung:**

#### Schritt 1: Stripe Account erstellen (falls noch nicht vorhanden)

1. **Gehe zu:** https://stripe.com/
2. **Klicke auf:** "Start now" oder "Sign up"
3. **Erstelle einen Account:**
   - E-Mail-Adresse eingeben
   - Passwort erstellen
   - Business-Informationen eingeben

#### Schritt 2: Stripe Dashboard öffnen

1. **Nach dem Login:** Gehe zu https://dashboard.stripe.com/
2. **Stelle sicher:** Du bist im richtigen Modus:
   - **Test Mode** (für Tests) - Toggle oben rechts sollte "Test mode" anzeigen
   - **Live Mode** (für Produktion) - Toggle sollte "Live mode" anzeigen

#### Schritt 3: API Keys finden

1. **Im Stripe Dashboard:**

   - Klicke auf **"Developers"** im linken Menü
   - Dann auf **"API keys"**

2. **Du siehst jetzt zwei Keys:**

   **Publishable Key:**

   - Beginnt mit `pk_test_` (Test Mode) oder `pk_live_` (Live Mode)
   - Sieht aus wie: `pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`
   - **Kann sicher im Frontend verwendet werden**
   - Klicke auf "Reveal test key" oder "Reveal live key" um ihn zu sehen
   - Klicke auf das Kopier-Symbol, um ihn zu kopieren

   **Secret Key:**

   - Beginnt mit `sk_test_` (Test Mode) oder `sk_live_` (Live Mode)
   - Sieht aus wie: `sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`
   - **NIEMALS im Frontend verwenden - nur im Backend/Dashboard!**
   - Klicke auf "Reveal test key" oder "Reveal live key"
   - Klicke auf das Kopier-Symbol, um ihn zu kopieren

#### Schritt 4: Keys in Snipcart einfügen

1. **Gehe zu:** Snipcart Dashboard → Settings → Payment Gateways → Stripe
2. **Füge die Keys ein:**
   - **Publishable Key:** Füge deinen `pk_test_...` oder `pk_live_...` Key ein
   - **Secret Key:** Füge deinen `sk_test_...` oder `sk_live_...` Key ein
3. **Aktiviere Stripe:** Aktiviere den Toggle/Schalter
4. **Speichere:** Klicke auf "Save" oder "Update"

**Wichtig:**

- Für Tests: Verwende **Test Mode Keys** (`pk_test_` und `sk_test_`)
- Für Produktion: Verwende **Live Mode Keys** (`pk_live_` und `sk_live_`)
- Stelle sicher, dass du im Stripe Dashboard im richtigen Modus bist (Test/Live)

### 2. Stripe-Konfiguration im Snipcart Dashboard prüfen

**Nach dem Einfügen der Keys:**

1. **Gehe zu:** Snipcart Dashboard → Settings → Payment Gateways → Stripe
2. **Stelle sicher:**
   - ✅ Stripe ist aktiviert
   - ✅ Publishable Key ist eingetragen (beginnt mit `pk_`)
   - ✅ Secret Key ist eingetragen (beginnt mit `sk_`)
   - ✅ Test Mode Keys für Tests, Live Keys für Produktion

### 2. Stripe Account Status

**In deinem Stripe Dashboard:**

1. **Gehe zu:** https://dashboard.stripe.com/
2. **Prüfe:**
   - ✅ Account ist aktiviert
   - ✅ Bankverbindung ist hinterlegt (für Auszahlungen)
   - ✅ Business-Informationen sind vollständig
   - ✅ Für Produktion: Account-Verifizierung abgeschlossen

### 3. Test-Modus vs. Live-Modus

**Wichtig:** Stelle sicher, dass du die richtigen Keys verwendest:

- **Test Mode:**

  - Keys beginnen mit `pk_test_` und `sk_test_`
  - Verwende Test-Kartennummern: `4242 4242 4242 4242`
  - Keine echten Zahlungen

- **Live Mode:**
  - Keys beginnen mit `pk_live_` und `sk_live_`
  - Echte Zahlungen werden verarbeitet
  - Account muss vollständig verifiziert sein

### 4. Test-Zahlung durchführen

**So testest du Stripe:**

1. **Aktiviere Test Mode** im Snipcart Dashboard
2. **Gehe zu:** https://beafox.app/shop
3. **Füge ein Produkt zum Warenkorb hinzu**
4. **Führe Checkout durch:**

   - **Kartennummer:** `4242 4242 4242 4242`
   - **Ablaufdatum:** Beliebige zukünftige Daten (z.B. `12/25`)
   - **CVC:** Beliebige 3 Ziffern (z.B. `123`)
   - **ZIP:** Beliebige Postleitzahl (z.B. `12345`)

5. **Prüfe:**
   - ✅ Bestellung erscheint im Snipcart Dashboard
   - ✅ Bestellung erscheint im Stripe Dashboard
   - ✅ E-Mail-Bestätigung wird gesendet

---

## 💡 Weitere Stripe-Features (Optional)

### Stripe Elements (Erweiterte UI)

Snipcart verwendet standardmäßig Stripe Elements für das Checkout-Formular. Du kannst das Design im Snipcart Dashboard anpassen.

### Stripe Radar (Betrugserkennung)

Stripe Radar ist automatisch aktiviert und schützt vor betrügerischen Transaktionen.

### Stripe 3D Secure

Für zusätzliche Sicherheit bei Kreditkartenzahlungen. Wird automatisch verwendet, wenn erforderlich.

---

## 🚨 Häufige Probleme

### Problem: Zahlung wird abgelehnt

**Mögliche Ursachen:**

- Falsche Stripe Keys (Test vs. Live)
- Stripe Account nicht vollständig verifiziert
- Karte hat nicht genug Guthaben (bei Tests)

**Lösung:**

- Prüfe Stripe Keys im Snipcart Dashboard
- Verwende Test-Kartennummern für Tests
- Prüfe Stripe Dashboard für Fehlerdetails

### Problem: Bestellung wird nicht erstellt

**Mögliche Ursachen:**

- Snipcart API Key ist falsch
- Stripe Keys sind falsch
- Test Mode ist nicht aktiviert

**Lösung:**

- Prüfe alle Keys im Snipcart Dashboard
- Aktiviere Test Mode für Tests
- Prüfe Browser Console auf Fehler

### Problem: Geld kommt nicht an

**Mögliche Ursachen:**

- Bankverbindung nicht hinterlegt
- Account nicht verifiziert
- Auszahlungszeitraum (normalerweise 2-7 Tage)

**Lösung:**

- Prüfe Stripe Dashboard → Settings → Bank accounts
- Stelle sicher, dass Account verifiziert ist
- Warte auf Auszahlungszeitraum

---

## 📊 Stripe Dashboard - Wichtige Bereiche

### 1. Payments (Zahlungen)

- Sieh alle erfolgreichen Zahlungen
- Prüfe fehlgeschlagene Zahlungen
- Erstelle Refunds

### 2. Customers (Kunden)

- Alle Kunden, die bei dir gekauft haben
- Zahlungsmethoden der Kunden
- Kundenhistorie

### 3. Disputes (Streitigkeiten)

- Chargebacks und Disputes
- Reagiere auf Disputes

### 4. Reports (Berichte)

- Umsatzstatistiken
- Transaktionsübersicht
- Export-Funktionen

---

## 🔐 Sicherheit

**Wichtig:**

- ✅ **Niemals** Secret Keys im Frontend-Code verwenden
- ✅ Secret Keys nur im Snipcart Dashboard eingeben
- ✅ Publishable Keys können sicher im Frontend verwendet werden
- ✅ Snipcart verwaltet alle Stripe-Kommunikation sicher

---

## 📚 Weitere Ressourcen

- **Stripe Dokumentation:** https://stripe.com/docs
- **Snipcart Stripe Integration:** https://docs.snipcart.com/v3/setup/payment-gateway
- **Stripe Test Cards:** https://stripe.com/docs/testing
- **Stripe Dashboard:** https://dashboard.stripe.com/

---

## ✅ Checkliste für Produktion

Bevor du Live gehst:

- [ ] Stripe Account vollständig verifiziert
- [ ] Bankverbindung hinterlegt
- [ ] Live Keys (nicht Test Keys) im Snipcart Dashboard
- [ ] Test-Bestellung mit Test-Karte erfolgreich
- [ ] E-Mail-Benachrichtigungen funktionieren
- [ ] Versandoptionen konfiguriert
- [ ] AGB und Datenschutzerklärung aktualisiert
- [ ] Rückgaberecht kommuniziert

---

## 🎉 Fertig!

Wenn alle Punkte erledigt sind, sollte Stripe reibungslos funktionieren. Snipcart übernimmt die gesamte Zahlungsabwicklung, du musst nichts im Code ändern!

Bei Problemen:

1. Prüfe Snipcart Dashboard → Orders
2. Prüfe Stripe Dashboard → Payments
3. Prüfe Browser Console auf Fehler
4. Kontaktiere Snipcart Support oder Stripe Support
