# BeAFox Backend — Analytics & Consent API Spec

**Status:** v1.0 für Backend-Team
**Ziel-Host:** `api.software-as-solution.de`
**Frontend-Proxy:** `/api/analytics/events` in der Next.js-App leitet hierher weiter.
**Auth:** API-Key im `Authorization: Bearer`-Header (zu definieren, per Environment `BEAFOX_API_KEY`).

---

## 1. Event-Ingestion

### `POST /api/v1/events/batch`

Nimmt einen Batch von Analytics-Events entgegen. Vom Frontend alle 5 Sekunden oder bei 20 Events gesendet.

**Request:**

```http
POST /api/v1/events/batch
Content-Type: application/json
Authorization: Bearer <BEAFOX_API_KEY>

{
  "events": [
    {
      "type": "chat.message.sent",
      "conversation_id": "d4e5f6a7-...",
      "message_id": "a1b2c3d4-...",
      "content": "Wie spare ich am besten für meinen Notgroschen?",
      "length_chars": 47,
      "meta": {
        "analytics_id": "01936a4f-...",
        "session_id": "019370e3-...",
        "client_timestamp": "2026-04-14T10:23:45.123Z",
        "app_version": "1.0.0",
        "schema_version": 1,
        "source": "b2c"
      }
    }
  ]
}
```

**Response 202 Accepted:**

```json
{ "accepted": 1, "rejected": 0 }
```

**Fehler:**

- `400 invalid_payload` — Schema-Mismatch
- `413 payload_too_large` — > 256 KB
- `429 rate_limit` — zu viele Batches
- `503 server_error` — DB unreachable

### Event-Typen (diskriminiert über `type`)

Alle Events haben `meta: BaseEventMeta`. Diskriminante ist `type`.

**Onboarding:**
- `onboarding.started`
- `onboarding.step.viewed` — `{ step_id, step_idx }`
- `onboarding.step.completed` — `{ step_id, step_idx, duration_ms, payload }`
- `onboarding.step.abandoned` — `{ step_id, step_idx, duration_ms }`
- `onboarding.step.back` — `{ from_step_id, to_step_id }`
- `onboarding.completed` — `{ total_duration_ms, profile: BucketedProfile }`

**Insights:**
- `insights.generated` — `{ insights: OnboardingInsights }`
- `insights.viewed` — `{ insight_type, dwell_ms }`
- `insights.reacted` — `{ insight_type, reaction }`

**Chat (Herzstück fürs Fine-Tuning):**
- `chat.session.started` — `{ conversation_id, system_prompt, profile_snapshot }`
- `chat.message.sent` — `{ conversation_id, message_id, content, length_chars }`
- `chat.response.received` — `{ conversation_id, message_id, in_reply_to, content, model, latency_ms, tokens_approx }`
- `chat.response.regenerated` — `{ conversation_id, message_id }`
- `chat.response.feedback` — `{ conversation_id, message_id, feedback: "up"|"down", note }`
- `chat.error` — `{ conversation_id, error_code, error_message }`
- `chat.session.ended` — `{ conversation_id, message_count, duration_ms }`

**Profile:**
- `profile.snapshot` — `{ snapshot: BucketedProfile, reason }`
- `profile.field.changed` — `{ field, change_type }`

**System:**
- `system.consent.changed` — `{ purpose, granted, consent_text_version }`
- `system.session.started` — `{ device_class, language, referrer_domain }`
- `system.error` — `{ scope, code, message }`

Für die konkrete Shape-Definition: siehe `lib/analytics/types.ts` im Frontend-Repo (TypeScript-Interfaces sind die Source of Truth).

---

## 2. Consent-Management

### `POST /api/v1/consents`

```http
POST /api/v1/consents
Content-Type: application/json

{
  "purpose": "model_training",
  "granted": true,
  "consent_text_version": "2026.04.14"
}
```

Server speichert einen Eintrag mit `user_id`, `purpose`, `granted`, `granted_at`, `revoked_at=null`, `consent_text_version`, `ip_hash` (SHA256 über IP + Tages-Salt), `user_agent`.

### `GET /api/v1/consents`

Liefert den aktuellen Consent-Status des eingeloggten Users:

```json
{
  "consents": [
    {
      "purpose": "analytics",
      "granted": true,
      "granted_at": "2026-04-14T10:05:12.000Z",
      "revoked_at": null,
      "consent_text_version": "2026.04.14"
    }
  ]
}
```

### `DELETE /api/v1/consents/:purpose`

Setzt `granted=false`, `revoked_at=now()`. Event-Ingestion wird stillschweigend verweigern, sobald der Consent fehlt.

---

## 3. Privacy-Endpoints (DSGVO Art. 15–17, 20)

### `GET /api/v1/privacy/export`

Vollständiger JSON-Export aller Daten des Users: Profil, Conversations, Messages, Events, Snapshots, Consents.

**Response:** `application/json` oder `application/zip` (bei großen Archiven).

### `POST /api/v1/privacy/delete-account`

Triggert die vollständige Löschung:

1. User-Row in `users` löschen → Kaskadiert via FK.
2. `analytics_id` in `deletion_queue` vormerken.
3. Bei nächstem Export-Batch (Training) werden Events dieses `analytics_id` ausgeschlossen.
4. Nach 30 Tagen: physische Löschung aus Event-Store.

**Response:**
```json
{ "scheduled_for": "2026-04-14T10:30:00.000Z", "estimated_completion": "2026-05-14" }
```

---

## 4. DB-Schema-Vorschlag (PostgreSQL)

Siehe `data-collection-architecture.md` Abschnitt 4.1 für volles Schema. Kurzfassung der Haupt-Tabellen:

- `consents` — User × Purpose × granted/revoked
- `events` — Alle Analytics-Events (JSONB-Payload)
- `conversations` — Pro Chat-Session, mit System-Prompt-Snapshot + Consent-Flags
- `messages` — User- und Assistant-Messages pro Conversation
- `profile_snapshots` — Longitudinal-Profile über Zeit
- `deletion_queue` — Pending Delete-IDs für Training-Filter

**Retention:**
- `events` (Analytics): 90 Tage rolling
- `conversations`/`messages` (prompt_iteration): 12 Monate
- `conversations`/`messages` (model_training): unbegrenzt bis Widerruf
- `profile_snapshots`: Account-Lebensdauer + 30 Tage
- `consents`: 3 Jahre nach Widerruf (Beweislast)

---

## 5. Training-Export (Phase 5)

Periodischer Cron-Job, der für Fine-Tuning ausspielt:

```sql
SELECT
  c.id               AS conversation_id,
  c.system_prompt_snapshot,
  c.profile_snapshot,
  jsonb_agg(
    jsonb_build_object(
      'role', m.role,
      'content', m.content,
      'feedback', m.feedback
    ) ORDER BY m.created_at
  ) AS messages
FROM conversations c
JOIN messages m ON m.conversation_id = c.id
WHERE c.consent_training = true
  AND c.analytics_id NOT IN (SELECT analytics_id FROM deletion_queue)
  AND c.created_at > :last_export
  AND NOT EXISTS (
    SELECT 1 FROM messages m2
    WHERE m2.conversation_id = c.id
      AND m2.content LIKE '%[EMAIL]%'  -- falls Scrubber durchgerutscht ist
  )
GROUP BY c.id
HAVING COUNT(m.id) >= 4;  -- mindestens 2 User + 2 Assistant Messages
```

Output im OpenAI/Anthropic-Fine-Tuning-Format (JSONL).

---

## 6. Wichtige Constraints fürs Backend-Team

1. **EU-Hosting zwingend** — DSGVO-konformer Standort (Frankfurt, Falkenstein, Dublin).
2. **Encryption at-rest** — Postgres TDE oder Disk-Encryption, Backups ebenfalls verschlüsselt.
3. **Audit-Log** — wer hat wann auf welche User-Daten zugegriffen (Art. 32 DSGVO).
4. **Consent-Gate auf Server-Seite** — der Server muss nochmal prüfen, ob Consent vorliegt, auch wenn das Frontend bereits filtert. Defense in depth.
5. **PII-Scrubber serverseitig** — NER-basiert (spaCy de_core_news_lg oder Presidio), läuft auf ALLEN `content`-Feldern vor dem Persistieren.
6. **Rate-Limiting pro User-ID + IP** — Schutz gegen Event-Flooding.
7. **Schema-Versionierung** — `meta.schema_version` beachten, neue Felder additiv zulassen.

---

## 7. Nächste Schritte fürs Backend

1. Entwurf des Schemas in PR/Ticket festhalten
2. Endpoints stub'en mit 501-Antworten, Frontend kann gegen stub testen
3. Consent-Tabelle + API zuerst (blockiert Event-Ingestion)
4. Event-Ingestion + DB
5. Privacy-Export
6. Training-Export (später)
