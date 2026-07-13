# Code Style Guide — BERENT

> Verbindlich für alle Entwicklungsprojekte, für menschliche Entwickler und Claude Code gleichermaßen.
> Stand: 2026-07-13 · v1.0 · Schwester-Dokumente: `ENGINEERING-PRINCIPLES.md` (Wirkung) ·
> `infrastructure-playbook.md` (Umgebung) · `systems-register.md` (Zusammenhänge).
> **Dieser Guide kodifiziert die im Bestand gelebten Konventionen** (nr7, berent-ki-team-orga,
> threema-decrypt, Scripts) — er beschreibt, wie BERENT-Code tatsächlich aussieht, nicht ein Wunschbild.

---

## 1 · Übergreifende Prinzipien

1. **Lesbarkeit vor Cleverness.** Code wird häufiger von der nächsten Claude-Session gelesen als vom
   Autor — Sessions haben keine Chat-Historie. Alles Wichtige steht im Code, in der CLAUDE.md oder im Commit.
2. **Sprachen-Konvention:** Code-Bezeichner Englisch, **Fachbegriffe der Domäne Deutsch** und unübersetzt
   (`beleg_nr`, `mandant_id`, `disposition: 'loeschkandidat'`, `governance_level`). Nie halb übersetzen —
   ein Begriff, eine Schreibweise, projektweit.
3. **Alle Texte für Menschen auf Deutsch:** Kommentare, Fehlermeldungen, UI, Commits, Doku. Du-Form,
   direkt, **generisches Maskulinum — kein Gendern, keine Partizipformen** („Mitarbeiter", nie
   „Mitarbeitende"). Keine Ausrufezeichen in UI-Texten.
4. **Minimal dependencies.** Erst Standardbibliothek (`node:fs`, `fetch`), dann etablierte Pakete. Ein
   Utility-Script hat idealerweise null Dependencies (Vorbild: `seed-skills.mjs`). Jede neue Dependency
   ist eine Wartungs- und Lieferketten-Entscheidung.
5. **Konsistenz schlägt Geschmack.** Neuer Code liest sich wie der umgebende. Stil-Umbauten nur als
   eigener, deklarierter Commit — nie beiläufig im Feature-Commit.

## 2 · Kommentare & Dateiköpfe

- Jede nicht-triviale Datei beginnt mit einem **Zweck-Kommentar**: was sie tut, welche Env sie erwartet,
  wie sie aufgerufen wird (Vorbild: Kopf von `seed-skills.mjs`, `mails-provider.ts`).
- Kommentare nennen **Constraints und Entscheidungen**, nicht das Offensichtliche:
  `// Bewusst KEINE anon-Policies: Mail-Inhalte sind personenbezogen` ✓ ·
  `// Schleife über alle Mails` ✗.
- Entscheidungen mit Datum/Referenz, wenn sie später verwundern würden
  (`-- Entscheidung (Vault 08): eine Governance-SSoT`).
- Secrets-Hinweis gehört an die Stelle, wo man ihn braucht: `// Secrets: NIE im Code. Erwartet Env: …`

## 3 · TypeScript / Next.js (nr7, belegchat)

- **App Router, Server Components als Default.** `"use client"` nur, wo Interaktivität es erzwingt.
  Datenzugriff server-only; Komponenten importieren aus `@/lib/data` — nie direkt aus Providern.
- **Env-Zugriff nur über Helper** (`lib/data/env.ts`): eine Funktion pro Variable, `?.trim() || undefined`,
  plus `is…Configured()`. Kein nacktes `process.env.X` im Feature-Code. Server-only-Dateien tragen den
  Hinweis im Kopf („niemals im Client importieren").
- **Row-Typen und Domain-Typen trennen:** `MailRow` (snake_case, wie PostgREST liefert) → `mapRow()` →
  `OsMail` (camelCase). Der Mapper ist die einzige Stelle, die beide kennt.
- **Fehlverhalten still degradieren, wo es UI ist** (`if (!res.ok) return null` + Hinweis-Box mit dem
  fehlenden Env-Namen), **hart werfen, wo es Auth/Sicherheit ist** — fail-closed (Engineering §1.3).
  Fehlermeldungen benennen die exakte Variable: `"SUPABASE_BERENT_OS_URL fehlt"` — nie eine
  Sammelmeldung für zwei mögliche Ursachen (Lehre vom 13.07.: kostete eine Debugging-Runde).
- **Server Actions** für Mutationen (`"use server"`, FormData, `revalidatePath`) statt API-Routen,
  wenn nur das eigene UI schreibt. API-Routen für externe Aufrufer und Auth-Flows.
- **Styling:** Tailwind mit den Projekt-Tokens (`text-copper`, `border-border`, `bg-card`, `font-heading`,
  `font-mono`) — nie Hex-Werte im JSX. CI-Regeln kommen aus dem berent-ci-Skill.
- Kein `any`; `unknown` + Schema-Prüfung an Grenzen. `satisfies` für literale Objekte gegen Interfaces.

## 4 · Node-Scripts (.mjs)

- ESM, Shebang `#!/usr/bin/env node`, `node:`-Prefix für Builtins, top-level `await` erlaubt.
- Argumente schlicht: `process.argv.includes('--dry-run')` — **jedes schreibende Script hat `--dry-run`**.
- Ausgabe als Arbeitsprotokoll: was gefunden, was getan, am Ende `Fertig: X ok, Y Fehler.`;
  Exit-Code ≠ 0 bei Fehlern.
- Env-Prüfung ganz oben mit klarer Meldung und Tipp, wo die Werte liegen.

## 5 · SQL / Migrationen (Supabase)

- snake_case, Singular vermeiden wir nicht dogmatisch — bestehende Tabellen geben das Muster vor
  (`mails`, `skills`, `executions`).
- **Jede Migration:** Kopfkommentar mit Anwendungsdatum + Weg („Angewendet am … via Supabase MCP"),
  Entscheidungs-Referenz, und sie liegt gespiegelt in `supabase/migrations/` (Playbook §3).
- CHECK für Enums, UNIQUE für Dedup-Schlüssel, FK statt CHECK bei eigener Wertetabelle,
  partielle Indizes für Arbeitsvorrats-Abfragen (`WHERE triaged_at IS NULL`).
- RLS in derselben Migration wie die Tabelle — nie „später".

## 6 · n8n-Workflows & Code-Nodes

- **JSON im Repo ist SSoT** (Playbook §4). Node-Namen deutsch und sprechend („Mail normalisieren",
  „Ergebnis zurueckschreiben") — sie sind zugleich Doku und Referenzziele (`$('Intent ermitteln')`).
- Wichtige Nodes tragen `notes` mit Betriebs-Hinweisen (Credential-Zuordnung, Grenzen, Warnungen).
- Code-Nodes: kleine, pure Transformationen; Sanitizer an Fremddaten-Grenzen; ein Kommentar am Anfang,
  was der Node leistet. Keine Secrets — Credentials/`$env` only.
- Fehlertoleranz explizit: `onError: continueRegularOutput` an Batch-Nodes (Engineering §2.2).

## 7 · Fehlermeldungen & Logging

- Nutzerfehlertexte: menschlich, deutsch, handlungsleitend („Login abgelaufen — bitte neu starten").
  Auth-Fehler bewusst **generisch** nach außen („Login nicht möglich" — keine Auskunft, ob die ID existiert).
- Logs strukturiert und PII-frei; bei KI-Calls Dauer/Modell/Tokens (Engineering §3.1).
- Stacktraces enden im Log, nie in UI oder Threema-Nachricht.

## 8 · Threema-/Kurznachrichten-Ausgaben

Klartext ohne Markdown, sparsame Emoji als Struktur-Anker (📊 ▶ ✅), max. ~1.500–2.000 Zeichen,
konkrete Zahlen statt „fertig". Stilregeln aus `00 Kontext/Schreibstil.md` gelten auch für maschinelle Texte.

## 9 · Tests

- **Pflicht: Regressionstest für jeden deterministischen Kern** (Nummernkreise, Beträge, Gating) —
  Snapshot über repräsentative Fälle; eine Parameter-Auslagerung muss ergebnisneutral beweisbar sein
  (Lehre: BelegChat BER-90).
- Vitest, wo ein Testrahmen existiert; für Pipelines gilt der isolierte Wegwerf-Test (Engineering §3.3)
  als legitimes Testmittel — Testartefakte danach entfernen.
- `pnpm build` grün ist Push-Voraussetzung, kein Ersatz für Tests.

## 10 · Formatierung

Prettier-/ESLint-Defaults des Projekts, keine Privatregeln. 2 Spaces, doppelte Anführungszeichen in
TS/TSX (Bestand nr7), einfache in .mjs (Bestand Scripts) — Bestand schlägt Vereinheitlichung.
Dateinamen: kebab-case für Scripts/Docs, PascalCase für React-Komponenten.

---

## Kurz-Briefing für Claude Code

**IMMER:** Zweck-Kommentar im Dateikopf · Env nur über Helper, exakte Fehlermeldung pro Variable ·
Row/Domain-Typen mit einem Mapper · deutsche Fachbegriffe konsistent · `--dry-run` in Schreib-Scripts ·
Migration mit Kopfkommentar + Spiegel · Node-`notes` mit Betriebs-Hinweisen · Regressionstest für Rechenkerne.

**NIE:** Gendern (in keinem Text) · `any` · nacktes `process.env` im Feature-Code · Hex-Farben im JSX ·
Secrets in Code, Workflow-JSON oder Logs · Stil-Umbau im Feature-Commit · Stacktrace Richtung Nutzer ·
Auth-Fehler, die Existenz von Konten verraten.

---

*Lebendes Dokument — Änderungen mit Beleg aus dem Bestand, über die Asset-Library (Git).
Struktur-Vorbild: Koerting code-style-guide v2.0; Inhalte: gelebte BERENT-Konventionen, Stand 07/2026.*
