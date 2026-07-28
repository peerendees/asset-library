# Systems & Integrations Register — BERENT

> Verzeichnis aller Systeme, ihrer Verbindungen und **aller Secret-Speicherorte**.
> Stand: 2026-07-28 · v1.6 · Schwester-Dokumente: `ENGINEERING-PRINCIPLES.md` · `infrastructure-playbook.md`
> Pflegeregel: Jede neue Integration und jedes neue Secret wird HIER eingetragen, bevor sie live geht.
>
> **SSoT ist diese Datei in `asset-library/templates/berent-framework/` — NUR hier pflegen.**
> Spiegel (z. B. `beirat/framework/`) werden nach jeder Änderung nachgezogen, nie direkt editiert.
> Anlass: Am 27./28.07.2026 liefen SSoT (v1.5) und Beirat-Spiegel (v1.1 + neuere Inhalte) in
> BEIDE Richtungen auseinander, gepflegt aus zwei parallelen Chats.

---

## Überblick — Systemlandschaft

```
Threema (*BERENT2, E2E) ──Callback──▶ n8n BelegChat ──▶ Supabase BelegChat (Belege, GoBD)
Threema (*BERENT1, Basic) ◀──send_simple── Vercel threema-decrypt ◀── n8n (Executor, Durchsicht)
Mail (iCloud, IONOS, HPCN*, Proton*) ──IMAP──▶ n8n Ingestion ──▶ berent-os.mails
berent-os (Skills/Kontext/Mails/Executions) ◀──▶ n8n Skill Executor ◀──▶ Anthropic API
NR7 (nr7.berent.ai, Passkey-SSO) ──service_role──▶ berent-os (Dashboard, Freigaben)
Obsidian-Vault ◀──Extrakt-Export──── berent-os · Vault-Git ◀──▶ GitHub
Threema (*BERENTB) ──idee──▶ Skill Executor ──GitHub-Commit──▶ Vault-Repo ──Obsidian-Git-Pull──▶ Vault
                                                        (* = geplant)
```

## Kategorie A — Kernsysteme

### A1 · Supabase `berent-os` — KI-Betriebssystem
- Ref `umbuggxvbluxbejdekvd`, eu-west-1. Tabellen: skills (21), categories (8), context_sources,
  mails (+mail_actions, +verwertung/ablage), executions, feedback, governance, auth_credentials, beirat_sessions, beirat_beitraege, beirat_koepfe, beirat_boards.
- Zugriff: anon (nur skills/categories/context/executions per Policy) · service_role (mails,
  auth_credentials — keine anon-Policies).
- Konsumenten: n8n (Executor, Ingestion, Durchsicht), NR7, Claude-Code-Sessions (MCP).

### A2 · Supabase BelegChat — Produktion, GoBD
- Ref `xuqefeewzdvjhuquciut`. Belege, identity-Schema, Edge Function `threema-decrypt`.
- GoBD: Belege append-only, Audit-Log, keine echte Löschung. Eigentum der BelegChat-Arbeitsstränge —
  Änderungen nur dort.

### A3 · n8n (Hostinger VPS srv1098810)
- Produktions-Workflows: BelegChat mit Threema Beleg-Eingang · Hedy Transkripte v2 · fonio-Strecken.
- KI-Betriebssystem: BERENT Skill Executor (`suljizPHm2nCwXCl`) · Mail Ingestion iCloud
  (`vVrsTjy1MrkcAtqa`) · Mail Ingestion IONOS (`8kLtEouNotJql2Wh`) · Postfach-Durchsicht
  (`nBmkteHSFECAOlOA`, Schedule 03:00 + Webhook) · Beirat-Orchestrator (Webhook `berent-beirat-orchestrator-7f2e9c1a`, 4 Modi, self-contained via `$env`). Mail-Erinnerung (`RpWJ75O9xM9FjUmQ`, Cron 07:00+17:30) · Rechnungs-Alarm (`vqPe0T1NatkRqSRH`, stuendlich). Aufraeum-Executor (`hBQmwkRg7QeZbAtB`, IMAP-Move, INAKTIV bis Creds+Dry-Run).
- April-Strecke „BERENT AI Mail" (Webhook-Live-Abruf für Lovable-App) — parallel, kein Konflikt.

### A4 · Vercel (peerendees-projects)
- `threema-decrypt` (ÖFFENTLICHES Repo; Decrypt/Send/OCR; Bearer-Pflicht) · `nr7` (Dashboard,
  Passkey-SSO) · `belegchat` (Frontend) · `berent-ai-mail` (Lovable-Frontend, Mock) · Marketing-Seiten.

### A5 · Threema Gateway
- `*BERENT1` (Basic): send_simple-Versand an Marcus (BUMFMZ39). Guthaben im Gateway-Portal prüfen.
- `*BERENT2` (E2E): Callback zeigt auf BelegChat-Webhook — Umstellung nur mit bewusster Entscheidung.
- `*BERENTB` (E2E): Beirat-Bot. Callback -> `threema-decrypt.vercel.app/api/beirat-callback` -> n8n-Beirat-Webhook. Syntax `/beirat <board> [modus] <frage>`.
  Seit 27.07.: Kommando-Router im Callback — `/beirat` → Beirat, `idee`/`ideenparkplatz`
  (ohne Schrägstrich) → Skill Executor; Antworten des Executors gehen kanalabhängig als
  `send_beirat` zurück in denselben Chat (Rückfall `*BERENT1`). Absender-Allowlist
  `BERENTB_ERLAUBTE_ABSENDER` (Default BUMFMZ39). Sendesperre `lib/sende-sperre.js`:
  max. 8 Sendungen je Empfänger in 5 Min (Lehre aus der Antwort-Schleife vom 27.07.,
  ~900 Sendungen durch Empfangsbestätigungen Typ 0x80).

### A6 · Mail-Konten
- **iCloud** (imap.mail.me.com:993, App-Passwort) — Ingestion live, Bestand 2026 komplett.
- **IONOS/BERENT** (Credential „IONOS IMAP") — Ingestion live; Unterordner unter Archiv (AGS,
  isb Netzwerk, KI Allgemein, Automatisierung, Business-Anfragen, …) noch nicht ingestiert.
- **HPCN** (Exchange) — geplant; erst IMAP testen, sonst MS-Graph-OAuth.
- **Proton** — kein IMAP ohne Bridge; Empfehlung: Weiterleitung. **Mailbox.org** — stillgelegt.

### A7 · Anthropic API · A8 · GitHub · A9 · Obsidian/Notion/Linear
- Anthropic: n8n-Credential „Anthropic API"; Modellwahl nach Engineering §4.1. Beirat-Orchestrator nutzt einen EIGENEN Key `BEIRAT_ANTHROPIC_KEY` als Container-Env (Kostentrennung).
- GitHub `peerendees/*`: Repos siehe Playbook §2.1; gh-CLI lokal authentifiziert.
- Vault `~/BERENT-2nd-Brain` (Git, Auto-Backup) · Notion (Asset Library
  data_source `ec790d33-f7c9-4ff2-93a0-a3f03e4b0bc0`) · Linear (Backlog).

---

## SECRET-VERZEICHNIS — ein Label, alle Speicherorte

> **Zuständig: Ingo** (Infrastruktur & DevOps). Ihm fällt die Token-Pflege zu — Eintragung
> vor dem Go-live, Rotation über ALLE Speicherorte, und das Bemerken abgelaufener oder
> stillgelegter Zugänge, bevor sie etwas blockieren. Zwei Vorfälle am 26./27.07.2026 zeigen,
> warum das eine benannte Aufgabe braucht: die n8n-Credential `berent-os Supabase (anon)`
> war gelöscht — der Skill Executor lief 19 Tage ins Leere, ohne dass es auffiel. Und
> `VAULT_GITHUB_TOKEN` trug einen falsch kopierten Wert (GitHub 401), während
> `BEIRAT_VAULT_TOKEN` mit demselben Zweck korrekt gesetzt war.

> **Die teuerste Lektion (12.07.2026):** `DECRYPT_API_TOKEN` lebte in vier Speichern mit zwei Werten —
> plus einem falsch benannten fünften. Ein Nachmittag Fehlersuche. Deshalb: Rotation nur noch als
> Checkliste über ALLE Orte, Abgleich per Fingerprint `printf %s "$W" | shasum -a 256 | cut -c1-8`.

| Label | Speicherorte (ALLE bei Rotation!) | Konsumenten |
|---|---|---|
| `DECRYPT_API_TOKEN` | ① n8n-Container-Env (Hostinger; Config-Datei ≠ laufender Container!) ② Supabase BelegChat Function-Secrets ③ Vercel threema-decrypt Env ④ Passwortmanager „Decrypt API Token" | BelegChat-Workflow, Skill Executor, Durchsicht, Hedy v2 (alle `$env`) |
| berent-os anon (`sb_publishable_…`/Legacy) | ① n8n-Credential „berent-os Supabase (anon)" ② nr7/.env.local ③ Vercel nr7 Env `SUPABASE_BERENT_OS_KEY` | Executor Skills/Kontext, NR7 skills/team |
| berent-os service (`sb_secret_…`) | ① n8n-Credential „BERENT-OS Supabase" ② nr7/.env.local ③ Vercel nr7 Env `SUPABASE_BERENT_OS_SERVICE_KEY` ④ Passwortmanager ⑤ n8n-Container-Env `SUPABASE_BERENT_OS_SERVICE_KEY` (Beirat) | Ingestion/Durchsicht-Writes, NR7 mails+auth, Export-Script, Beirat-Orchestrator |
| `AUTH_SESSION_SECRET` (NR7) | ① Vercel nr7 Env ② nr7/.env.local (lokaler Eigenwert) | NR7 SSO (Session/Challenge-JWTs) |
| Threema-Bot Beirat (`*BERENTB`, E2E) | ① Vercel threema-decrypt Env: `THREEMA_GATEWAY_ID_BERENTB`, `THREEMA_SECRET_BERENTB`, `THREEMA_PRIVATE_KEY_BERENTB` (Private Key auch im Passwortmanager) ② Gateway-Portal (Quelle + Callback-URL `https://threema-decrypt.vercel.app/api/beirat-callback`) | Callback `/api/beirat-callback` (empfängt, routet `/beirat` + `idee`) · `send_beirat` (antwortet) — **Namen einheitlich `_BERENTB` seit 27.07.** (vorher gemischt `_BEIRAT`; alte Namen sind TOT) |
| Threema-Secrets (*BERENT1/2, Private Key) | Vercel threema-decrypt Env (`THREEMA_SECRET_BERENT1`, `THREEMA_GATEWAY_ID_BASIC`, `THREEMA_PRIVATE_KEY`, …) — Gateway-Portal ist die Quelle | Vercel-Function send_simple/decrypt |
| IMAP-Credentials (iCloud, IONOS) | ① n8n-Credential-Store (Ingestion) ② n8n-Container-Env `IMAP_ICLOUD_USER/PASS` + `IMAP_IONOS_USER/PASS` (+HOST) fuer den Aufraeum-Executor (Code-Node kann Credential-Store nicht lesen) | Ingestion-Trigger, Aufraeum-Executor |
| `N8N_API_KEY` | nr7/.env.local | n8n-Verwaltung per API |
| Anthropic API Key | n8n-Credential „Anthropic API" | Executor, Durchsicht |
| `BEIRAT_ANTHROPIC_KEY` (EIGENER Anthropic-Key, Kostentrennung) | n8n-Container-Env + Passwortmanager | Beirat-Orchestrator (`$env`) |
| `BEIRAT_VAULT_TOKEN` (GitHub PAT, contents:write nur auf berent-2nd-brain) | n8n-Container-Env + Passwortmanager | Beirat-Vault-Export · Skill Executor/`donna/idee` (bevorzugt, da nachweislich gültig) |
| `VAULT_GITHUB_TOKEN` (**sollte** derselbe Wert wie `BEIRAT_VAULT_TOKEN` sein — neutraler Name) | n8n-Container-Env + Passwortmanager | Skill Executor (`$env`-Fallback). **ACHTUNG 27.07.:** trug einen falsch kopierten Wert (GitHub 401); der Executor bevorzugt deshalb `BEIRAT_VAULT_TOKEN`. Wert korrigieren oder Variable löschen — zwei Namen für einen Wert sind die DECRYPT-Lektion in neu |
| Linear API-Keys (2 Stück, getrennt nach Zweck) | ① Linear-Portal → Einstellungen → API (**Quelle**) ② Passwortmanager „Linear API-Keys" ③ Claude-Connector (Key „für Claude") ④ NR7 (Key „für nr7-Dashboard") ⑤ *geplant:* n8n-Container-Env `LINEAR_API_KEY` (eigener Key, nicht wiederverwenden) | Claude-Code-Sitzungen (lesen+schreiben, erprobt 28.07.2026 mit HPCN-20) · NR7 · *geplant:* Skill Executor über das Werkzeug-Register |

**Bekannte Altlast (offen):** n8n-Config-Datei auf dem VPS enthält einen VERALTETEN
`DECRYPT_API_TOKEN`-Wert — vor jedem Container-Neustart auf den Live-Wert korrigieren
(Fingerprint-Vergleich mit Passwortmanager).

**Bekannte Altlast (18.07.2026, Stand 28.07.):** `nr7/.env.local` existiert lokal NICHT mehr — die unten genannten Speicherort-Listen sind entsprechend zu lesen (Live-Werte: Passwortmanager/Vercel). Ursprünglich: `nr7/.env.local` trug einen VERALTETEN berent-os service-Key (401 gegen die REST-API); Live-Wert liegt in Passwortmanager/Vercel. Vor Nutzung (auch fuer die n8n-Container-Env des Beirats) alle Orte per Fingerprint abgleichen.

---

## Datenfluss — Kernprozesse

**Mail-Pipeline:** IMAP (UNSEEN, Fenster) → n8n Normalisierung (Sanitizer, Dedup account/folder/message_id)
→ berent-os.mails → Durchsicht-Batch 03:00 (Regeln → Claude-Chunks) → Disposition/Extrakt →
Threema-Summary → Freigabe NR7 `/mails` → (geplant) Move nach „KI-Aussortiert" · Extrakte →
Vault `01 Inbox/Mail-Extrakte/` (`scripts/export-extrakte.mjs`).

**Skill-Ausführung:** Threema → Executor-Webhook → Decrypt (Vercel, Bearer) → Skills+Kontext aus berent-os
→ Claude → Execution-Log → send_simple (*BERENT1). Skills: `skills-db/` → `seed-skills.mjs` → berent-os.

**BelegChat (Produktion, nicht anfassen ohne BelegChat-Session):** Threema *BERENT2 → n8n → Supabase Edge
(decrypt/OCR) → Belege mit GoBD-Audit.

---

## Änderungsprotokoll

| Datum | Änderung |
|---|---|
| 2026-07-13 | v1.0 — Erstfassung aus der Umbau-Session 11.–13.07. (KI-Betriebssystem, Mail-Pipeline, SSO) |
| 2026-07-18 | v1.1 — Beirat-Orchestrator (beirat_sessions/beitraege, eigener `BEIRAT_ANTHROPIC_KEY`, service-Key als n8n-Container-Env); veralteten lokalen service-Key dokumentiert. |
| 2026-07-18 | v1.2 — Beirat v2 (Arena-Loop, Boards, Nachdebatte, Vault-Export): neues Secret BEIRAT_VAULT_TOKEN; Beirat-Projekt nach /Users/Shared/Projekte/.../beirat + Repo peerendees/beirat. |
| 2026-07-18 | v1.3 — Mail-Automatisierung (Erinnerung 07:00/17:30, stuendl. Rechnungs-Alarm; kein neues Secret) + Triage-Erweiterung (mail_actions, verwertung/ablage). |
| 2026-07-19 | v1.4 — Aufraeum-Executor (IMAP-Move via imapflow im Code-Node): IMAP-Creds als Container-Env noetig, AUFRAEUM_LIVE-Schalter, inaktiv bis Dry-Run. |
| 2026-07-19 | v1.5 — Threema-Beirat-Bot *BERENTB (E2E): Callback-Empfaenger + send_beirat in threema-decrypt; neue Secrets THREEMA_*_BEIRAT/BERENTB. |
| 2026-07-28 | v1.6 — Zusammenführung zweier auseinandergelaufener Fassungen (SSoT v1.5 + Beirat-Spiegel): SSoT-Regel im Kopf; idee-Datenfluss (Threema→Vault); *BERENTB-Router/Allowlist/Sendesperre; Env-Namen `_BERENTB` korrigiert; `VAULT_GITHUB_TOKEN`-Warnung; Linear-Keys; Ingo als Token-Verantwortlicher; Skill Executor `suljizPHm2nCwXCl` jetzt 19 Nodes (idee-Zweig + Kanal-Antwort). |
