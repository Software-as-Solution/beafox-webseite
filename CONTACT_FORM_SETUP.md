# Kontaktformular Setup

Das Kontaktformular verwendet [SendGrid](https://sendgrid.com) zum Versenden von Emails.

## Setup-Anleitung

### 1. SendGrid API Key

Da ihr bereits SendGrid für Verifizierungs-Emails in eurer App verwendet, habt ihr bereits einen SendGrid Account und API Key.

### 2. Environment Variables setzen

Füge die folgenden Environment Variables zu deiner `.env.local` Datei hinzu (oder zu deinem Deployment-Service wie Vercel):

```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@beafox.app
```

**Wichtig:**

- Die `.env.local` Datei sollte nicht ins Git Repository committed werden (sie ist bereits in `.gitignore`)
- Für Production: Setze diese Variablen auch in deinem Deployment-Service (z.B. Vercel Environment Variables)

### 3. From Email Adresse

Die `SENDGRID_FROM_EMAIL` sollte eine verifizierte Email-Adresse oder Domain in SendGrid sein.

**Optionen:**

- **Single Sender Verification**: Verifiziere eine einzelne Email-Adresse (z.B. `noreply@beafox.app`)
- **Domain Authentication** (empfohlen): Verifiziere die gesamte Domain `beafox.app` für bessere Deliverability

### 4. Domain Authentication (Empfohlen)

Für Production solltest du deine Domain bei SendGrid authentifizieren:

1. Gehe zu SendGrid Dashboard → Settings → Sender Authentication
2. Wähle "Authenticate Your Domain"
3. Folge den DNS-Anweisungen zur Verifizierung
4. Nach der Verifizierung kannst du jede Email-Adresse von deiner Domain verwenden

### 5. Testen

1. Starte den Development Server: `npm run dev`
2. Gehe zu `/kontakt`
3. Fülle das Formular aus und sende es ab
4. Prüfe, ob die Email an `info@beafox.app` ankommt
5. Prüfe das SendGrid Dashboard für Delivery-Status und Logs

## Funktionsweise

- Alle Formularanfragen werden an `info@beafox.app` gesendet
- Die Email enthält alle Formulardaten in einem formatierten HTML-Format
- Der Absender kann direkt auf die Email antworten (replyTo wird auf die Email des Nutzers gesetzt)
- Das Formular validiert alle Pflichtfelder und die Email-Adresse

## SendGrid Limits

SendGrid Free Plan bietet:

- **100 Emails/Tag** kostenlos
- **40,000 Emails** für die ersten 30 Tage

Für höhere Limits gibt es verschiedene Paid Plans.

## Troubleshooting

### Email kommt nicht an

1. Prüfe das SendGrid Dashboard → Activity Feed für Delivery-Status
2. Prüfe ob die `SENDGRID_API_KEY` korrekt gesetzt ist
3. Prüfe ob die `SENDGRID_FROM_EMAIL` verifiziert ist
4. Prüfe die Server-Logs für Fehlermeldungen

### API Key Fehler

- Stelle sicher, dass der API Key die richtigen Berechtigungen hat (Mail Send)
- Prüfe ob der API Key nicht abgelaufen ist
