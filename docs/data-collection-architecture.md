# BeAFox — Daten-Sammlung & Training-Architektur

**Status:** Konzept v1.1
**Datum:** 2026-04-14
**Eigentümer:** Alex
**Scope:** Sammlung aller Nutzer-Eingaben (Onboarding, Chat, Profile, System-Prompts) für Fine-Tuning, Analytics, Prompt-Iteration und Profil-Tracking — DSGVO-konform von Tag 1.
**Gültig für:** B2C-Privatnutzer-Flow (ab 18 Jahren). Der B2B-Schul-Flow mit Minderjährigen wird separat konzipiert (BeAFox als Auftragsverarbeiter, Schule als Verantwortlicher).

**Änderungen v1.1:** Minderjährigen-Consent-Flow im B2C entfernt, da Privat-App ausschließlich 18+. B2B-Schul-Flow als separater Kanal klar getrennt.

---

## 1. Rechtlicher Rahmen

### 1.1 Zwei Zugangskanäle mit unterschiedlichem Recht

BeAFox hat zwei Vertriebskanäle mit unterschiedlicher datenschutzrechtlicher Lage:

- **Privatkunden (B2C)**: App-Registrierung nur ab **18 Jahren**. Damit entfällt Art. 8 DSGVO (Kinder-Einwilligung) komplett. Erwachsene können selbst rechtswirksam einwilligen.
- **B2B über Schulen/Unternehmen**: Minderjährige Schüler:innen greifen über Institutions-Lizenzen zu. Hier ist die **Schule (bzw. der Schulträger) der datenschutzrechtlich Verantwortliche** nach Art. 4 Nr. 7 DSGVO. BeAFox ist Auftragsverarbeiter (Art. 28). Die Schule holt im Vorfeld die Einwilligung der Eltern ein, ihr schließt einen **Auftragsverarbeitungsvertrag (AVV)** mit der Schule ab.

Das entschärft den B2C-Flow erheblich — kein Eltern-Consent, keine altersspezifische UI-Sonderlogik. Aber es bedeutet: Die Privat-App muss User unter 18 aktiv ablehnen, und der Schul-Flow muss architektonisch klar vom Privat-Flow getrennt sein.

**Hauptrisikoflächen bleiben:**

- **Finanz-Kontext**: Auch wenn Bea keine Anlageberatung macht (Baustein 8 sichert das ab), sammelt ihr sensible Daten: Einkommensrange, Schuldenstand, Geldprägung durch Elternhaus, Zielbild-Freitext. Die Zielbild-Freitexte können Angaben zu Gesundheit, Familie, Beziehungen enthalten — potentiell Art. 9 DSGVO-Daten (besondere Kategorien).
- **Freitext-Chat**: Sobald User mit Bea chatten, landen potentiell extrem persönliche Informationen in den Logs. Das muss *separat* eingewilligt werden.
- **Crisis-Signals** (Baustein 7): Bei erkannter finanzieller Not können Chats sensible psychische Gesundheitsdaten enthalten — Art. 9-relevant.

### 1.2 Rechtsgrundlagen pro Verarbeitungszweck

Für jeden Zweck müsst ihr eine eigene Rechtsgrundlage nach DSGVO Art. 6 haben:

| Zweck | Rechtsgrundlage | Consent-Checkbox-Text (Vorschlag) |
|---|---|---|
| App-Betrieb (Profile, Login, Chat-Session) | Art. 6(1)(b) — Vertragserfüllung | Keine Checkbox, aber Datenschutzerklärung verlinken |
| Produkt-Analytics (anonymisiert, Funnel, Abbrüche) | Art. 6(1)(f) — berechtigtes Interesse + Widerspruchsrecht | Cookie-Banner: "Hilf uns, Bea zu verbessern (Nutzungsstatistiken)" |
| Chat-Logs für Prompt-Iteration (pseudonymisiert, intern) | Art. 6(1)(a) — Einwilligung | "Ich erlaube BeAFox, meine Chats mit Bea intern auszuwerten, damit Bea besser wird" |
| Chat-Logs für LLM-Fine-Tuning | Art. 6(1)(a) — separate Einwilligung | "Ich erlaube BeAFox, meine Chats zur Verbesserung des KI-Modells zu nutzen" |
| Profil-Snapshot-Tracking (Fortschritt über Zeit) | Art. 6(1)(b) — Vertragserfüllung (falls Kern des Produkts) | Keine Extra-Checkbox |

**Jede Einwilligung muss:**

- Separat (nicht gebündelt — "Ich akzeptiere alles" ist unzulässig)
- Freiwillig (App muss auch ohne Training-Opt-In voll nutzbar sein)
- Informiert (klare Sprache, was passiert, wie lange, wer hat Zugriff)
- Widerrufbar (per Klick, nicht "E-Mail an privacy@…")

### 1.3 Altersgrenze + B2B-Trennung

**Im Privat-Flow (App-Registrierung):**

- **AGE_MIN = 18** (aktuell im Code: `AGE_MIN=14` → muss hoch auf 18). Altersabfrage in Step 2 (`Step2.tsx`) muss so limitiert werden, dass <18 gar nicht auswählbar ist.
- In der AGB + Datenschutzerklärung: „Die Nutzung als Privatperson ist ab 18 Jahren möglich."
- Die Lebenssituation „Schüler:in" sollte entweder entfernt oder umgelabelt werden („Erwachsene in Weiterbildung / Abendschule / Berufsschule"), da klassische Schüler:innen unter 18 kein Privatkonto erstellen dürfen.
- Im Registrierungsflow: Checkbox „Ich bestätige, dass ich mindestens 18 Jahre alt bin." (separate Checkbox, nicht in die AGB-Zustimmung gebündelt).

**Im B2B-Schul-Flow (später, separat von diesem Dokument):**

- Schule schließt Vertrag + AVV mit BeAFox.
- Schul-Account gibt Schüler:innen-Zugänge per eigener ID aus (keine individuelle App-Registrierung durch den Schüler).
- Datenschutzrechtliche Verantwortung liegt bei der Schule (eigene Einwilligungen, eigene Löschprozesse).
- In der DB klar markiert: `user.source = "b2c" | "b2b_school" | "b2b_enterprise"`. Consent-Logik greift nur für B2C-User — B2B-User laufen über das Schul-Vertragsverhältnis.

### 1.4 Betroffenenrechte (DSGVO Art. 15–22)

Ihr müsst anbieten:

- **Auskunft** (Art. 15): User kann alles sehen, was ihr über ihn gespeichert habt → Privacy-Dashboard.
- **Berichtigung** (Art. 16): User kann Profil-Felder ändern → schon im Produkt.
- **Löschung / „Recht auf Vergessen"** (Art. 17): „Account löschen"-Button. Wichtig: Muss auch aus Training-Datasets entfernen — vor nächstem Fine-Tuning-Batch prüfen, ob gelöschte User-IDs noch drin sind.
- **Portabilität** (Art. 20): JSON-Export aller User-Daten (Profile + Chat-Logs).
- **Widerspruch** (Art. 21): Analytics-Opt-Out ohne App-Einschränkung.

---

## 2. Daten-Taxonomie — was wird gesammelt

### 2.1 Event-Kategorien

Events sind strukturierte JSON-Objekte mit einheitlichem Schema. Fünf Hauptkategorien:

**A) Onboarding-Events** (pro Step)
- `onboarding.step.started` — User ist auf Step X angekommen
- `onboarding.step.completed` — User hat Step X abgeschlossen (inkl. Antwort-Payload)
- `onboarding.step.abandoned` — User hat Onboarding auf Step X verlassen
- `onboarding.step.back` — User ist zurück gegangen (wenn ihr Back-Button habt)
- `onboarding.completed` — finaler Abschluss, inkl. vollem Profil

**B) Insights-Events** (Ergebnis der Engine)
- `insights.generated` — `OnboardingInsights`-Objekt snapshottet (inkl. confidence, relativePerformance, crisisSignals, inconsistencies, selfReportBiasDetected)
- `insights.viewed` — welche Insight-Karte hat der User wie lange angeschaut
- `insights.reacted` — z.B. „Das passt nicht"-Feedback-Button auf einer Karte

**C) Chat-Events** (Herzstück fürs Fine-Tuning)
- `chat.session.started` — neue Chat-Session, mit System-Prompt-Snapshot (!)
- `chat.message.sent` — User-Nachricht
- `chat.response.received` — Bea-Antwort mit Metadaten (Modell, Temperatur, Tokens, Latenz)
- `chat.response.regenerated` — User hat "nochmal probieren" geklickt
- `chat.response.feedback` — Daumen hoch/runter + optionaler Freitext
- `chat.session.ended`

**D) Profil-Snapshot-Events** (Longitudinal-Tracking)
- `profile.snapshot` — komplettes UserProfile alle 30 Tage oder bei Major-Änderungen
- `profile.field.changed` — einzelnes Feld geändert (mit Vorher/Nachher)
- `profile.goal.achieved` — Ziel erreicht (wenn ihr Goal-Tracking einbaut)

**E) System-Events** (Debug + Training-Kontext)
- `system.prompt.rendered` — der komplette System-Prompt, den ihr ans LLM schickt (inkl. `buildProfileContext()`-Output). Essentiell fürs Fine-Tuning, da ihr sonst nicht reproduzieren könnt, mit welchem Kontext Bea geantwortet hat.
- `system.error` — API-Fehler, Timeouts, Fallbacks

### 2.2 Datenschutz-Klassifizierung

Jedes Feld gehört in eine Kategorie:

| Klasse | Beispiele | Behandlung |
|---|---|---|
| **Direkt identifizierend** | E-Mail, Username, IP-Adresse | NIE in Training-DB. Nur in Profil-DB, verschlüsselt at-rest. |
| **Quasi-identifizierend** | Alter + PLZ + Lebenssituation + Geschlecht | Wenn kombiniert → Re-Identifikation möglich. In Training-DB nur in Buckets (z.B. Alter als Range „20–24"). |
| **Sensibel Art. 9** (potentiell) | Zielbild-Freitext, Chat-Messages, Geldprägung | Explizites Opt-In. PII-Scrubber laufen lassen. Verschlüsselung. |
| **Profile-Standard** | einkommensRange, zeithorizont, persoenlichkeit | Pseudonymisiert in Training-DB. |
| **Aggregat-Metriken** | Funnel-Abbruchraten, durchschnittliche Session-Dauer | Darf anonym sein — Statistik, keine Personen. |

### 2.3 Was NICHT gesammelt werden sollte

- Device-Fingerprinting (Canvas, WebGL, Fonts) — unnötig und problematisch
- Mausbewegungen / Keystrokes — massiver PII-Gehalt, kein nachweisbarer Mehrwert
- Geolocation (GPS) — braucht ihr nicht
- Cookies von Drittanbietern zum Zweck von Werbung

---

## 3. PII-Handling

### 3.1 Wo PII stecken kann (und ihr's leicht übersehen könnt)

- `profile.zielbild` — Freitext, kann alles enthalten („Ich will nach dem Abschluss meiner Ausbildung als KFZ-Mechatroniker bei BMW München…")
- Chat-Messages — voller Klartext
- System-Prompt-Output von `buildProfileContext()` — enthält bereits das Zielbild im Klartext
- URL-Parameter, Referrer — können Username aus vorherigen Seiten tragen

### 3.2 Pseudonymisierungs-Pipeline

Beim Schreiben ins Event-Store:

1. **User-ID-Split**: `user_id` (real) → `analytics_id` (random UUID, per User fest, nur in Analytics-DB). Mapping-Tabelle lebt nur in Produktions-DB, nicht in Backups.
2. **PII-Scrubber** auf Freitext-Felder vor dem Persistieren:
   - Regex: E-Mail, IBAN (DE\d{20}), Telefonnummern, deutsche KFZ-Kennzeichen
   - Named-Entity-Recognition (später, Phase 2): Namen, Organisationen, Orte → durch `[NAME]`, `[ORG]`, `[LOCATION]` ersetzen
   - Längen-Limit: Nachrichten > 4000 Zeichen abschneiden (sonst drohen Dokument-Dumps)
3. **Bucketing**: `alter: 23` → `age_bucket: "20-24"`. `wohnsituation: "allein"` stays. PLZ (falls ihr das mal erfasst): nur erste 2 Stellen.
4. **Hashing** für Deduplication-Zwecke: wenn ihr prüfen müsst, ob zwei Sessions zum selben User gehören, ohne die User-ID preiszugeben → HMAC-SHA256(user_id, secret).

### 3.3 Zwei-DB-Trennung

**Produktions-DB** (api.software-as-solution.de):
- Tabellen: `users`, `profiles`, `sessions`, `consents`
- PII im Klartext (aber verschlüsselt at-rest), zugänglich für App-Funktionalität.

**Analytics/Training-DB** (neu, gern logisch getrennt):
- Tabellen: `events`, `conversations`, `messages`, `profile_snapshots`
- Nur `analytics_id`, keine direkte Verknüpfung zu E-Mail / Namen.
- Lösch-Job: wenn User in Produktions-DB löscht → Lösch-Flag setzen → bei nächstem Export-Batch werden seine Events raus-gefiltert.

---

## 4. Storage-Architektur

### 4.1 DB-Schema (PostgreSQL-Dialekt)

```sql
-- Produktions-DB (existierend + Erweiterung)

CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose VARCHAR(50) NOT NULL,  -- 'analytics', 'prompt_iteration', 'model_training', 'profile_tracking'
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  consent_text_version VARCHAR(20) NOT NULL,  -- damit ihr wisst, welchen Text der User gesehen hat
  ip_hash VARCHAR(64),  -- SHA256(IP + Tages-Salt), für Beweis-Zweck
  user_agent TEXT
);
CREATE INDEX idx_consents_user_purpose ON consents(user_id, purpose);

-- Analytics-DB (neu)

CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  analytics_id UUID NOT NULL,
  session_id UUID NOT NULL,
  event_type VARCHAR(100) NOT NULL,  -- z.B. 'onboarding.step.completed'
  event_version INTEGER NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  client_timestamp TIMESTAMPTZ NOT NULL,
  server_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  app_version VARCHAR(20) NOT NULL,
  age_bucket VARCHAR(10),  -- redundant kopiert für schnelle Queries
  life_phase VARCHAR(30)
);
CREATE INDEX idx_events_analytics_time ON events(analytics_id, server_timestamp);
CREATE INDEX idx_events_type_time ON events(event_type, server_timestamp);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_id UUID NOT NULL,
  session_id UUID NOT NULL,
  system_prompt_snapshot TEXT NOT NULL,  -- das Ergebnis von buildProfileContext()
  profile_snapshot JSONB NOT NULL,       -- das Profil, das dem System-Prompt zugrunde lag
  model VARCHAR(50) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  consent_training BOOLEAN NOT NULL,     -- redundant, für schnelles Filtern beim Export
  consent_iteration BOOLEAN NOT NULL
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL,  -- 'user' | 'assistant'
  content TEXT NOT NULL,      -- bereits PII-gescrubbt bevor es hier landet
  token_count INTEGER,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  feedback VARCHAR(10),       -- 'up' | 'down' | null
  feedback_note TEXT
);
CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at);

CREATE TABLE profile_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_id UUID NOT NULL,
  snapshot JSONB NOT NULL,    -- vollständiges UserProfile (bucketed)
  insights JSONB NOT NULL,    -- OnboardingInsights-Output
  taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason VARCHAR(30) NOT NULL -- 'onboarding_complete' | 'periodic_30d' | 'profile_changed'
);

CREATE TABLE deletion_queue (
  analytics_id UUID PRIMARY KEY,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scrubbed_at TIMESTAMPTZ      -- wann wurden Events tatsächlich gelöscht
);
```

### 4.2 Retention-Policies

| Daten | Aufbewahrung | Begründung |
|---|---|---|
| `events` (Analytics) | 90 Tage rolling | Reicht für Funnel-Analyse, minimiert Risiko |
| `conversations` + `messages` (iteration-opt-in) | 12 Monate | Prompt-Iteration braucht historische Daten |
| `conversations` + `messages` (training-opt-in) | Unbegrenzt bis Widerruf | User-Opt-In = Zustimmung zur längeren Speicherung |
| `profile_snapshots` | Solange Account aktiv + 30 Tage danach | Longitudinal-Tracking ist Kern des Produkts |
| `consents` | 3 Jahre nach Widerruf | Beweislast bei Aufsichtsbehörden |
| `deletion_queue` | 90 Tage nach Vollzug | Audit-Trail |

### 4.3 Backup + Verschlüsselung

- Postgres at-rest Verschlüsselung (AES-256) aktivieren
- Backups ebenfalls verschlüsselt, in EU-Region (z.B. Hetzner Frankfurt)
- Backup-Retention: tägliche Snapshots 7 Tage, wöchentlich 4 Wochen, monatlich 6 Monate
- Access-Log aufs Datenbank-Admin-Interface

---

## 5. Frontend-Tracking-Layer (Next.js)

### 5.1 Struktur

```
lib/
  analytics/
    client.ts              # Core-Client: queue, batch, flush
    consent.ts             # Consent-State + Storage (localStorage + backend-sync)
    scrubber.ts            # Regex-basierter PII-Scrubber
    events/
      onboarding.ts        # trackOnboardingStep(...)
      chat.ts              # trackChatMessage(...), trackChatFeedback(...)
      profile.ts           # trackProfileSnapshot(...)
      insights.ts          # trackInsightsGenerated(...)
    types.ts               # Event-Typen (diskriminierte Union)
    session.ts             # session_id + analytics_id Verwaltung
hooks/
  useConsent.ts            # React-Hook für Consent-State
  useAnalytics.ts          # auto-fires events bei Mount/Unmount
components/
  consent/
    ConsentBanner.tsx      # Initialer Consent-Flow
    ConsentPreferences.tsx # Profile-Einstellungen (Opt-Out)
    ConsentBlocker.tsx     # zeigt Inhalt erst, wenn Consent gegeben ist (für Training-Opt-In)
```

### 5.2 Event-Typen (TypeScript)

```ts
// lib/analytics/types.ts

export interface BaseEventMeta {
  analytics_id: string;
  session_id: string;
  client_timestamp: string; // ISO 8601
  app_version: string;
}

export type OnboardingEvent =
  | { type: "onboarding.step.started"; step_id: StepId; meta: BaseEventMeta }
  | { type: "onboarding.step.completed"; step_id: StepId; duration_ms: number; answer_hash: string; meta: BaseEventMeta }
  | { type: "onboarding.step.abandoned"; step_id: StepId; meta: BaseEventMeta }
  | { type: "onboarding.completed"; profile_snapshot: BucketedProfile; meta: BaseEventMeta };

export type ChatEvent =
  | { type: "chat.session.started"; conversation_id: string; system_prompt: string; meta: BaseEventMeta }
  | { type: "chat.message.sent"; conversation_id: string; content: string; meta: BaseEventMeta }
  | { type: "chat.response.received"; conversation_id: string; content: string; model: string; tokens: number; latency_ms: number; meta: BaseEventMeta }
  | { type: "chat.response.feedback"; conversation_id: string; message_id: string; feedback: "up" | "down"; note?: string; meta: BaseEventMeta };

export type AnalyticsEvent = OnboardingEvent | ChatEvent | /* ... */;
```

### 5.3 Consent-Hook

```ts
// hooks/useConsent.ts (Skizze)

export function useConsent() {
  const [consent, setConsent] = useState<ConsentState>(loadFromStorage());

  const update = useCallback((purpose: Purpose, granted: boolean) => {
    const next = { ...consent, [purpose]: { granted, at: new Date().toISOString() } };
    setConsent(next);
    saveToStorage(next);
    // Sync to backend (für Audit-Trail)
    fetch("/api/consents", { method: "POST", body: JSON.stringify({ purpose, granted }) });
  }, [consent]);

  return { consent, update };
}
```

### 5.4 Integration in den Onboarding-Flow

In `OnboardingFlow.tsx`:

```ts
// pseudocode
useEffect(() => {
  trackOnboardingStep({ type: "onboarding.step.started", step_id: currentStepId });
  return () => {
    if (!completedCurrentStep) {
      trackOnboardingStep({ type: "onboarding.step.abandoned", step_id: currentStepId });
    }
  };
}, [currentStepId]);

// in handleStepComplete:
trackOnboardingStep({
  type: "onboarding.step.completed",
  step_id: currentStepId,
  duration_ms: Date.now() - stepStartTime,
  answer_hash: hashAnswer(patch),
});
```

**Wichtig:** Alle Tracking-Calls gehen durch einen Consent-Gate. Wenn kein Consent für `analytics` → Event wird verworfen. Wenn kein Consent für `prompt_iteration` → Chat-Events werden NICHT geloggt.

### 5.5 Queueing + Batching

- Client-side Queue (In-Memory + IndexedDB als Fallback wenn offline)
- Batch-Flush alle 5 Sekunden oder bei 20 Events
- Retry mit exponential backoff bei Netzfehlern
- `navigator.sendBeacon()` bei `unload` für letzten Flush

---

## 6. Backend-Endpoints (Spec)

Die folgenden Endpoints müssen an `api.software-as-solution.de` hinzugefügt werden:

### 6.1 Consent-Endpoints

```
POST   /api/v1/consents
  Body: { purpose: "training", granted: true, consent_text_version: "2026.04.14" }
  Response: { consent_id, recorded_at }

GET    /api/v1/consents
  Response: { consents: [{ purpose, granted, granted_at, revoked_at, consent_text_version }] }

DELETE /api/v1/consents/:purpose
  Effect: revoked_at = now(), granted = false
```

### 6.2 Event-Ingestion

```
POST   /api/v1/events/batch
  Body: { events: AnalyticsEvent[] }
  Server verifiziert Consent pro Event-Typ, verwirft stillschweigend verbotene
  Response: { accepted: number, rejected: number }
```

### 6.3 Privacy-Dashboard

```
GET    /api/v1/privacy/export
  Response: { profile, conversations, events, snapshots }  // komplettes Archiv
  Audit-Log: "user_xyz exported data at timestamp"

POST   /api/v1/privacy/delete-account
  Effect: user row gelöscht, analytics_id in deletion_queue
  Response: { scheduled_for: ISO, estimated_completion: ISO }
```

### 6.4 System-Prompt-Ingestion (spezieller Endpoint)

```
POST   /api/v1/chat/conversations
  Body: { system_prompt, profile_snapshot, model }
  Response: { conversation_id }
  // Legt Conversation an mit Consent-Snapshot

POST   /api/v1/chat/conversations/:id/messages
  Body: { role, content, token_count, latency_ms }
```

---

## 7. Training-Pipeline (Phase 5, später)

Wenn ihr ready seid fürs Fine-Tuning:

1. **Export-Script** (serverseitig):
   ```sql
   SELECT c.system_prompt_snapshot, m.role, m.content
   FROM conversations c JOIN messages m ON m.conversation_id = c.id
   WHERE c.consent_training = true
     AND c.analytics_id NOT IN (SELECT analytics_id FROM deletion_queue)
     AND c.created_at > :last_export
   ORDER BY c.id, m.created_at;
   ```

2. **Format-Konvertierung**: JSONL im OpenAI/Anthropic-Fine-Tuning-Format:
   ```json
   {"messages": [
     {"role": "system", "content": "<system_prompt_snapshot>"},
     {"role": "user", "content": "<user message>"},
     {"role": "assistant", "content": "<Bea's answer>"}
   ]}
   ```

3. **Qualitäts-Filter**:
   - Mindestens 2 User-Messages in der Conversation (sonst zu kurz)
   - Mindestens ein `feedback: "up"` (positive Signale priorisieren)
   - Bea-Antwort nicht der System-Fallback-String
   - Keine Crisis-Signals aktiv (sensible Conversations ausschließen)

4. **Human-in-the-Loop-Review**: Bevor ein Batch ins Fine-Tuning geht, soll eine Person random 50 Beispiele durchschauen auf Qualität, PII-Leaks, Brand-Verstöße.

5. **Eval-Set-Kuration**: 100–200 geprüfte Beispiele als Gold-Standard-Evaluation NACH jedem Fine-Tuning — um Regression zu erkennen.

---

## 8. Implementation Roadmap

| Phase | Was | Wer | Dauer |
|---|---|---|---|
| **1. Consent-Infrastruktur** | `consents`-Tabelle, Consent-API, ConsentBanner, useConsent-Hook, Datenschutz-Text aktualisieren | Backend + Frontend | 1–2 Wochen |
| **2. Frontend-Tracking-SDK** | `lib/analytics/` komplett, Event-Typen, Scrubber, Queue, Wiring in Onboarding + Chat | Frontend | 2–3 Wochen |
| **3. Backend-Ingestion** | `/events/batch`, DB-Schema, PII-Scrubber serverseitig, Conversation-Endpoints | Backend | 2–3 Wochen |
| **4. Privacy-Dashboard** | Export, Delete-Account, Consent-Einstellungen im Profil | Fullstack | 1 Woche |
| **5. Auswertung + Training** | BI-Dashboard (Metabase/Grafana), Export-Script, Fine-Tuning-Pipeline | Data Team | später |

**Minimal-Viable-Launch-Blocker** (vor Beta-Go-Live zwingend): Phase 1 + Phase 2. Phase 3 kann teilweise parallel laufen, aber Events müssen spätestens beim Launch gespeichert werden — sonst verliert ihr Beta-Daten.

---

## 9. Offene Fragen für Alex

1. **AGE_MIN auf 18 hochziehen — wann?** Aktuell `AGE_MIN=14` in `lib/bea-ai/onboarding.ts`. Muss vor Beta-Launch geändert werden + Altersbestätigungs-Checkbox in die Registrierung. Wer macht das (ich, oder euer Team)?
2. **Labels für „Schüler:in"-Option** — soll die Option im Privat-Flow bleiben (für 18+ Abendschüler:innen / Berufsschüler:innen) oder ganz raus? Falls bleiben: Umbenennung überlegen.
3. **Wo läuft api.software-as-solution.de?** EU-Server? AWS Frankfurt? Hetzner? Relevant für DSGVO-Ortsbestimmung + Auftragsverarbeitungsvertrag.
4. **Datenschutzbeauftragter (DPO)?** Bei sensiblen Finanz-/Chat-Daten und Fine-Tuning-Nutzung praktisch Pflicht ab einer gewissen Größe — spätestens bei ≥20 Mitarbeitern oder systematischer Verarbeitung personenbezogener Daten als Kerntätigkeit (Art. 37 DSGVO).
5. **Welches LLM?** Claude, GPT-4, selbstgehostet? Ihr braucht einen AVV mit Anthropic/OpenAI. Das muss in der Datenschutzerklärung erwähnt werden inkl. Hinweis auf ggf. Drittlandtransfer (USA → Standardvertragsklauseln / EU-US Data Privacy Framework).
6. **Datenschutzerklärung** — Route `/datenschutz` existiert. Muss überarbeitet werden: neue Zwecke, neuer Consent-Flow, LLM-Anbieter, Training-Opt-In, Betroffenenrechte-Kontakt.
7. **B2B-Schul-Flow** — gibt es den schon oder ist das noch Konzept? Falls existiert: Wie wird aktuell die Trennung zu B2C abgebildet? Falls nicht: außerhalb dieses Dokuments — eigenes Konzept nötig.
8. **Crisis-Signals-Speicherung** — Baustein 7 erkennt sensible Zustände. Wollt ihr diese Conversations aus dem Training ganz ausschließen (empfohlen) oder nur mit Extra-Consent nutzen?

---

## 10. Nächste Schritte (Phase 2 + 3)

Nach deinem Go für dieses Konzept:
- **Phase 2:** Ich baue den Frontend-Tracking-Layer (`lib/analytics/`, Consent-Hook, Banner, Integration in Onboarding + Chat).
- **Phase 3:** Ich spezifiziere die Backend-Endpoints als OpenAPI- oder TypeScript-Interface-Dokument, das euer Backend-Team implementieren kann.
