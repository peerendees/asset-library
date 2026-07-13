# Infrastructure Playbook — BERENT

> Grundlagendokument für alle Entwicklungsprojekte: Infrastruktur, Tools, Workflows, Konventionen.
> Stand: 2026-07-13 · v1.0 · Schwester-Dokumente: `ENGINEERING-PRINCIPLES.md` · `systems-register.md`

---

## 1 · Infrastruktur-Übersicht

| Schicht | Dienst | Zweck |
|---|---|---|
| Automation | **n8n** auf Hostinger VPS `srv1098810.hstgr.cloud` | Workflows: Orchestrator, Mail-Pipeline, BelegChat, Hedy u. a. (~50 Workflows) |
| Apps/Functions | **Vercel** (Team `peerendees-projects`) | Next.js-Apps (nr7, belegchat) + Serverless Functions (threema-decrypt) |
| Daten | **Supabase** (2 Projekte) | `berent-os` = KI-Betriebssystem · BelegChat-Projekt = Belege/Identity/Edge Functions |
| Code | **GitHub** `peerendees/*` | SSoT für Code, Workflows, Skills, Vault |
| Wissen | **Obsidian-Vault** (`berent-2nd-brain`, Git-synchronisiert) + Notion | Second Brain, Doku, Asset Library |
| Kommunikation | **Threema Gateway** (*BERENT1 Basic, *BERENT2 E2E) | Benachrichtigungen + Befehlskanal |

**Grundsatz:** Der VPS trägt Produktion (BelegChat!). Alles, was dort läuft, ist volumen- und lastgedeckelt
(Engineering §2.5). Speicher ist knapp — OOM eines Bastel-Workflows trifft die Produktion.

## 2 · Code-Verwaltung

### 2.1 Repos (Kernbestand)

| Repo | Inhalt | Auto-Deploy |
|---|---|---|
| `berent-ki-team-orga` | Skills-SSoT (`skills-db/`), Orchestrator-JSONs, Migrationen-Spiegel, Scripts | — |
| `nr7` | KI-Team-Dashboard (Next.js) → nr7.berent.ai | ✅ Vercel |
| `threema-decrypt` | **ÖFFENTLICH.** BelegChat-Backend (Vercel Fn + Supabase Edge Fns) | ✅ Vercel |
| `belegchat` | BelegChat-Frontend (Passkey-SSO-Referenz) | ✅ Vercel |
| `berent-2nd-brain` | Obsidian-Vault | — |
| `asset-library` | Skills, Templates, dieses Framework | — |

### 2.2 Git-Konventionen

- **Commit pro Arbeitsschritt**, sprechende Botschaft (was + weshalb), Umlaute in Commit-Botschaften als ae/oe/ue.
- **Push sofort** nach jedem abgeschlossenen Schritt (Remote = Backup + Wiederaufsetzpunkt).
- **Tag pro Phase/Meilenstein** (`phase-1-fundament`).
- KI-Commits: `Co-Authored-By: Claude <Modellname> <noreply@anthropic.com>`.
- **main deployt automatisch** (Vercel-Repos): Features über Branch + PR; PR-Merge = bewusste Deploy-Freigabe.
- Vor jedem Push: Secret-Scan über den Diff; bei Workflows/Deploys die belegchat-security-Checkliste.

## 3 · Datenbank (Supabase)

- **RLS immer aktiv.** Personenbezogene Daten (mails, auth_credentials, identity): **keine anon-Policies**,
  Zugriff nur service_role serverseitig. Öffentlich lesbare Daten (skills, categories): SELECT-Policy explizit.
- **Key-Generationen:** Neue Keys `sb_publishable_…` (= anon) / `sb_secret_…` (= service_role). In Passwort-
  manager-Einträgen immer Projekt + Typ benennen („berent-os Secret Key").
- **Constraints als Tippfehler-Schutz:** CHECK für Enums, UNIQUE für Dedup-Schlüssel, FK statt CHECK, wenn die
  Werteliste eine eigene Tabelle ist (categories).
- **Migrationen:** via MCP/Dashboard angewendet, aber IMMER als Datei in `supabase/migrations/` des Repos
  gespiegelt (Datum + Kommentar „Angewendet am … via …").
- **Edge Functions** (BelegChat): Secrets in Supabase Function-Secrets; identisches Token wie n8n-Env
  (siehe Secret-Register).

## 4 · n8n (Automation)

- **Workflow-JSON im Repo ist SSoT** (`berent-ki-team-orga/orchestrator/`). Deploy/Update per n8n-API
  (PUT), nicht per UI-Bastelei. UI-Änderungen zurück ins Repo exportieren.
- **Credentials nur im n8n-Credential-Store** (UI). Header-Auth-Credential: Feld „Name" = Header-Name
  (z. B. `apikey`), Feld „Value" = Wert. Server-weite Secrets als Container-Env, in Nodes via
  `{{ $env.NAME }}`.
- **API-Zugriff:** `N8N_BASE_URL` + `N8N_API_KEY` (liegen in `nr7/.env.local`). Aktivieren/Deaktivieren,
  Anlegen, Patchen — alles skriptbar. `settings` beim PUT auf `{executionOrder:"v1"}` reduzieren.
- **Env-Variablen des Containers** werden nur beim Start geladen: Config-Datei-Änderung ≠ laufender Container.
  Vor jedem Neustart prüfen, dass Config-Datei und gewünschter Live-Wert übereinstimmen (Fingerprint!).
- **Trigger-Verhalten:** IMAP-Trigger feuert bei Aktivierung/Reconnect für alle Treffer neu → Dedup zwingend.
  `customEmailConfig` begrenzt Abruffenster.

## 5 · Vercel

- **GitHub-Push = Auto-Deploy** (main → Production). Env-Änderungen erfordern manuelles Redeploy.
- **Env pro Projekt dokumentieren** (im Projekt-README oder CLAUDE.md): Name, Zweck, Quelle — nie den Wert.
- Function-Auth fail-closed im Code (Bearer gegen Env, timing-safe); Domains: nr7.berent.ai u. a.
- Debugging: Vercel-MCP (`list_deployments`, `get_runtime_logs`) liefert Deploy-Historie + Runtime-Fehler.

## 6 · Secrets-Politik (Kurzfassung — Details im systems-register.md)

1. Secrets nie in Chat, Git, Vault oder Logs. Maschinelle Wege: Env, Credential-Stores, Zwischenablage-Pipes.
2. **Jedes Secret-Label hat ein Speicherorte-Verzeichnis** im systems-register.md. Rotation = ALLE Orte,
   in dokumentierter Reihenfolge, mit Fingerprint-Abgleich: `printf %s "$WERT" | shasum -a 256 | cut -c1-8`.
3. Ein Label, ein Wert. Zwei Werte unter einem Label sind ein Incident, kein Zustand.
4. Passwortmanager-Einträge benennen Projekt + Typ; maskierte Anzeigen nie per Textmarkierung kopieren
   (Copy-Button/Auge), Werte ohne Whitespace einfügen.

## 7 · Entwicklungsumgebung

- **Arbeitskopien:** `~/berent-ki-team-orga` (maßgeblich) · `/Users/Shared/Entwicklung/projekte/nr7` ·
  `/Users/Shared/Projekte/Entwicklung/Projekte/{threema-decrypt, belegchat, berent-ai-mail}`.
  Achtung: Teile von `/Users/Shared` gehören User `hpcn` (read-only für kunkel).
- **Claude Code:** Jedes Projekt hat eine `CLAUDE.md` (Projekt, Stack, Architektur, Konventionen, Deployment,
  Prioritäten) und referenziert dieses Framework. Parallele Sessions arbeiten in getrennten Repos —
  bei geteilten Diensten (threema-decrypt!) nur additiv ändern und per PR.
- **Node/Next:** pnpm; Build vor jedem Push (`pnpm build` muss grün sein).

## 8 · Neues Projekt aufsetzen — Checkliste

1. Repo anlegen (privat, außer bewusst öffentlich) + `CLAUDE.md` + Framework-Dateien aus der Asset-Library.
2. Supabase: eigenes Projekt oder berent-os? RLS-Konzept VOR der ersten Tabelle.
3. Vercel: Projekt verbinden, Env-Variablen dokumentieren, Auto-Deploy bewusst aktivieren.
4. Secrets im systems-register.md eintragen (Label + alle Speicherorte).
5. n8n-Workflows als JSON ins Repo, Deploy per API.
6. Governance-Stufen der Automationen festlegen (Engineering §1.1).
7. belegchat-security-Checkliste als Pre-Deploy-Gate übernehmen.

## 9 · Kostenrahmen (Stand 07/2026)

Hostinger VPS (n8n) · Vercel Team · Supabase Free/Pro · Anthropic API (nach Verbrauch — Modellwahl und
Regel-vor-Modell drücken die Kosten, Engineering §4) · Threema Gateway Credits (*BERENT1/2).

---

*Adaptiert nach dem Struktur-Vorbild des Koerting-Infrastructure-Playbooks (v1.1), Inhalte aus der
BERENT-Infrastruktur. Änderungen an der Infrastruktur bitte hier UND im systems-register.md nachziehen.*
