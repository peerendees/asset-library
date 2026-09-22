# Infrastructure Playbook — BERENT

> Grundlagendokument für alle Entwicklungsprojekte: Infrastruktur, Tools, Workflows, Konventionen.
> Stand: 2026-09-22 · v1.7 · Schwester-Dokumente: `ENGINEERING-PRINCIPLES.md` · `systems-register.md`

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

- **Erst holen und hinsehen, dann arbeiten.** Vor der ersten Änderung zwei Fragen **beantworten**, nicht nur stellen:
  1. *Auf welchem Branch stehe ich?* — `git branch --show-current`. Ein Arbeitsbaum steht selten dort, wo man ihn verlassen hat: parallele Sitzungen wechseln ihn, gemergte PR-Branches bleiben ausgecheckt liegen.
  2. *Wie weit bin ich zurück?* — `git fetch`, dann `git rev-list --left-right --count main...origin/main`.

  Wer auf einem veralteten Stand aufsetzt, merkt es erst beim Push — bei **versionierten Dokumenten** (`systems-register.md`, `ENGINEERING-PRINCIPLES.md`) vergibt er zusätzlich eine Versionsnummer zweimal. Auflösung: Rebase auf `origin/`, eigene Änderung umnummerieren; **nie** `--force`. Wer auf dem falschen Branch committet hat, holt den Commit per `git cherry-pick` auf `main` und setzt den fremden Branch mit `git branch -f <branch> origin/<branch>` auf den Remote-Stand zurück.
  *(Zwei Belege, beide 06.08.2026 asset-library. Erstens: lokales `main` lag 3 Commits zurück, `systems-register` v1.8 war remote bereits vergeben — dieselbe Datei trägt im Änderungsprotokoll schon einen v1.6-Eintrag „Zusammenführung zweier auseinandergelaufener Fassungen". Zweitens, am selben Tag: Divergenz zwar abgefragt, die Antwort aber nicht gelesen — und dazu auf einem längst gemergten PR-Branch statt auf `main` committet. Eine abgerufene Zahl, die niemand liest, ist keine Prüfung.)*
- **Die Git-Regeln werden maschinell gehalten, nicht nur beschrieben.** `hooks/git-leitplanke.sh` liegt in
  diesem Ordner und wird einmal je Rechner installiert:

  ```bash
  mkdir -p ~/.claude/hooks
  cp hooks/git-leitplanke.sh ~/.claude/hooks/ && chmod +x ~/.claude/hooks/git-leitplanke.sh
  ```

  Dazu in `~/.claude/settings.json` unter `hooks.PreToolUse` ein Eintrag mit `matcher: "Bash"` und dem
  Befehl `"$HOME/.claude/hooks/git-leitplanke.sh"`. Der Hook verweigert Claude vier Dinge: committen auf
  `main`, pushen nach `main`, jeden Force-Push und `git merge`, solange `main` ausgecheckt ist. Die
  Fehlermeldung nennt jeweils den richtigen Weg. Erlaubt bleiben `gh pr merge`, `git merge origin/main`
  auf einem Feature-Zweig, das **Vorspulen von `main`** (`git pull --ff-only`, `git merge --ff-only
  origin/main`) nach einem Merge auf GitHub, und `git commit --dry-run`. Ein Mensch im Terminal ist
  nicht betroffen.
  *(Beleg: Am 22.09.2026 landete ein Doku-Nachtrag trotz dreier schriftlicher Regeln direkt auf `main`.
  Eine Regel, die niemand durchsetzt, ist eine Bitte. Zweiter Beleg aus derselben Sitzung: Die erste
  Fassung des Hooks las die ganze Befehlszeile und hielt eine Tabellenzeile ueber Force-Push in einem
  Pull-Request-Rumpf fuer einen Force-Push — ein Waechter muss Befehle von Text unterscheiden. Dritter
  Beleg, Stunden spaeter: Dieselbe Fassung verweigerte das Vorspulen von `main` nach einem Merge auf
  GitHub. **Ein Waechter, der die richtige Bewegung blockiert, wird umgangen** — deshalb ist jede
  Blockade hier eng gefasst und nennt den erlaubten Weg.)*
- **Ein gestapelter Pull Request stirbt mit seinem Basiszweig.** Steht PR B auf dem Zweig von PR A,
  schliesst GitHub B stillschweigend, sobald A gemergt und sein Zweig geloescht wird. Vorher die Basis von
  B auf `main` umstellen (`gh pr edit <nr> --base main`) oder B danach neu eroeffnen.
  *(Zweimal belegt: nr7 #16 am 15.09.2026, berentai-nativ #2 am 22.09.2026.)*
- **`gh pr merge` aus einem Arbeitsbaum heraus meldet einen Fehler, der keiner ist** — `fatal: 'main' is
  already used by worktree`. Der Merge auf GitHub ist trotzdem gelaufen, nur das lokale Aufraeumen nicht.
  Erst den Zustand auf GitHub nachsehen, dann Zweig und Arbeitsbaum von Hand entfernen — den Merge nicht
  wiederholen. *(Beleg: berentai-nativ #3 am 22.09.2026.)*
- **Commit pro Arbeitsschritt**, sprechende Botschaft (was + weshalb), Umlaute in Commit-Botschaften als ae/oe/ue.
- **Push sofort** nach jedem abgeschlossenen Schritt (Remote = Backup + Wiederaufsetzpunkt).
- **Tag pro Phase/Meilenstein** (`phase-1-fundament`).
- KI-Commits: `Co-Authored-By: Claude <Modellname> <noreply@anthropic.com>`.
- **main deployt automatisch** (Vercel-Repos): Features über Branch + PR; PR-Merge = bewusste Deploy-Freigabe.
- Vor jedem Push: Secret-Scan über den Diff; bei Workflows/Deploys die belegchat-security-Checkliste.
- **`.gitignore` ab dem ersten Commit**, mindestens `.DS_Store`. Getrackte Finder-Metadaten blockieren Rebase und Stash und verrauschen jeden Diff — nachträglich per `git rm --cached` entfernen.

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

## 5a · Coolify — Hosting der berent.ai-Subdomains

**Wo:** Oberfläche `coolify.berent.ai` (Cloudflare-proxied — **kein SSH darüber**, dafür die IP).
Läuft auf **`srv1098810`, derselben Maschine wie n8n** (§4), nicht auf einem eigenen Server.
Seit 07/2026 tragen dort die berent.ai-Websites; Vercel ist für diese Hosts aus dem Weg.

**Der Proxy gehört nicht Coolify.** Den Verkehr verteilt `root-traefik-1` aus dem Compose-Projekt
`root` — erkennbar am Löser `mytlschallenge` und der ACME-Adresse `user@srv1098810.hstgr.cloud`.
Er läuft mit `--providers.docker.exposedbydefault=false`:

> **Ein Container ohne Traefik-Labels ist für den Proxy unsichtbar.** Er ist dann nicht kaputt,
> er existiert nicht. Coolify schreibt für neue Anwendungen keine Labels — das tut ein Mensch.

Deshalb der Hinweis in der Oberfläche: *„Container label readonly mode is disabled. Domains must be
set in the Labels section."* Eine Domain im Domains-Bereich einzutragen bewirkt für sich **nichts**.

### Neue Subdomain — Reihenfolge

1. **Cloudflare**: Eintrag wie ein bestehender Host, **proxied**. Gegenprobe `dig +short` gegen `blog`.
2. **Anwendung anlegen**: Bauart **Static**, Webserver `nginx:alpine`, Base directory `/` — Hausmuster
   der laufenden Hosts. Bauart lässt sich später **nicht** wechseln (siehe unten).
3. **Domain** unter Public access eintragen, ohne Portangabe.
4. **Labels** setzen (General-Seite) — ohne diesen Schritt passiert nichts:

```
traefik.enable=true
traefik.http.middlewares.gzip.compress=true
traefik.http.routers.NAME.entryPoints=websecure
traefik.http.routers.NAME.middlewares=gzip
traefik.http.routers.NAME.rule=Host(`SUBDOMAIN.berent.ai`)
traefik.http.routers.NAME.service=NAME-svc
traefik.http.routers.NAME.tls=true
traefik.http.services.NAME-svc.loadbalancer.server.port=80
```

`NAME` frei wählbar, muss nur in diesen Zeilen zusammenpassen. Container im Netz `coolify`, intern
Port 80.
5. **Deployen**, dann prüfen — nicht im Browser, der cached.
6. **Host ins `systems-register.md`.**

### Prüfung in dreißig Sekunden

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://neu.berent.ai
curl -sS -o /dev/null -w "%{http_code}\n" https://gibtesnichtxyz.berent.ai
```

Beide **404** mit 19-Byte-Rumpf `404 page not found` → Traefik kennt den Host nicht, **Labels fehlen**.
Nur die neue Subdomain 5xx → Route steht, Container antwortet nicht. Anderer 404-Rumpf → Datei fehlt.

Auf dem Server: `docker inspect <container> --format '{{json .Config.Labels}}' | grep traefik` —
kommt nichts, ist der Container unsichtbar.

### Fallen, alle belegt

- **Bauart nicht nachträglich wechselbar.** Eine als *Compose* angelegte Anwendung bleibt es; gestartet
  wird weiter aus der in Coolifys Datenbank gespeicherten Definition, die **nicht** aus dem Repo
  aufgefrischt wird. Ausweg nur: löschen und neu anlegen. *(25.08.2026 — ein Deployment scheiterte an
  einem Mount, den der deployte Commit gar nicht mehr enthielt.)*
- **Keine Bind-Mounts mit relativen Pfaden.** Coolify legt das Repo nicht dort ab, wohin sie zeigen;
  Docker erzeugt die fehlende Quelle als Verzeichnis und bricht ab. Dateien ins Abbild **kopieren**.
- **Der DNS-Check ist reine Anzeige.** `blog` läuft und zeigt „DNS pending".
- **`tls=true` ohne certresolver** trägt nur, weil Cloudflare davor terminiert. Eine Domain auf
  „DNS only" zu stellen bricht das.

### Offen

Der Zustand ist eine halbfertige Migration: Websites auf Coolify, Proxy nicht. Solange das so bleibt,
kostet jede Subdomain acht Zeilen Handarbeit. Coolify einen eigenen Proxy zu geben wäre die Abhilfe —
berührt aber den Traefik, an dem n8n hängt.

*(Belege: Einrichtung `framework.berent.ai` am 24./25.08.2026, sechs Fehlversuche; Ursache erst per
SSH-Einsicht gefunden. Label-Vorlage vom laufenden `blog`-Container gelesen.)*

### Node-Anwendungen mit Dockerfile (seit 21.09.2026)

Das Hausmuster *Static + nginx* trägt Seiten aus Dateien. Ein laufendes Programm (Website-Motor, fedor-seo)
braucht die Bauart **Dockerfile** — und vier Dinge, die beim Static-Muster nicht vorkommen:

1. **Port in den Labels:** letzte Zeile `traefik.http.services.NAME-svc.loadbalancer.server.port=3000`
   (der Port, auf dem der Prozess lauscht), sonst wie die Vorlage oben.
2. **Laufzeitdaten auf ein benanntes Volume** (*Persistent Storage → Add Volume*, z. B. `/app/data`), nie ein
   Host-Pfad: Der Container läuft als `node`, ein Bind-Mount gehört `root`, SQLite könnte nicht schreiben.
   Ein leeres benanntes Volume übernimmt die Rechte aus dem Abbild.
3. **`/health` nennt den Bauzeitpunkt** (`gebaut`, im Dockerfile per `date` ins Abbild geschrieben). „Ist mein
   Push schon live?" beantworten fünf gleiche Antworten in Folge — beim Redeploy laufen kurz zwei Container.
4. **Env vor dem ersten Start eintragen** (fail-closed: ohne Kennwort und Geheimnis ist ein Cockpit zu), Labels
   dazu ins `systems-register.md`.

Referenz: `peerendees/berentai-nativ`, `docs/betrieb/deploy-coolify.md`.

### Woher weiß ich, wer ausliefert?

**Nicht aus dem Repository.** `vercel.json`, eine `CLAUDE.md` mit „Deployment: Vercel" oder eine `.htaccess`
beschreiben, was einmal war. Am lebenden Objekt prüfen:

```bash
curl -sI https://www.berent.ai/ | grep -i -E "^(server|x-vercel|cf-ray)"   # server: cloudflare ohne x-vercel-id = Coolify-Weg
dig +short www.berent.ai A && dig +short blog.berent.ai A                    # gleiche IPs wie ein bekannter Coolify-Host?
node tools/coolify.mjs apps | grep berent.ai                                 # steht die Domain an einer Coolify-Anwendung?
```

*(Beleg: `www.berent.ai` galt bis zum 21.09.2026 als Vercel-Deployment und lief seit 07/2026 über Coolify.
Die „Störung" vom 02.08.2026 — fehlende Header, `/faq` 404 — war kein Cloudflare-Cache, sondern ein anderer
Hoster, auf dem die `vercel.json` nie galt. Zwei Sessions suchten am falschen Ort.)*

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

## 10 · Fremdgut — Übernahme aus fremden Quellen

Gilt für alles Fremde: Code, Konfiguration, Regelwerke, Vorträge, Studien, Kundendokumente.
Die Unterscheidung, auf die alles hinausläuft: **Geschützt ist die Ausformulierung, nicht das Verfahren.**

- **Mechanismus übernehmen, Wortlaut neu schreiben.** Ein Verfahren („neue Paketversionen erst nach sieben Tagen") ist frei; der Absatz, mit dem jemand es aufgeschrieben hat, nicht. Nie fremde Absätze übernehmen, auch nicht umgestellt. **Umformulieren mit dem Ziel, die Herkunft zu verwischen, ist die schlechteste Variante** — mehr Aufwand als eigenes Formulieren und rechtlich riskanter.
- **Herkunft an der Übernahmestelle, nicht in einer Sammelliste.** Eine Fußnote am Dateiende beantwortet nicht, welcher Absatz woher kommt. Format wie bei den Belegen in `ENGINEERING-PRINCIPLES.md`: Quelle in Klammern, direkt an der Regel.
- **Lizenz mitnehmen, sobald wirklich kopiert wird.** Bei MIT (Intentron, Prime Agent) wandern Urheberrechtsvermerk und Lizenztext mit, sobald Code oder Textdateien übernommen werden. Wer nur ein Verfahren nachbaut, löst die Lizenz gar nicht erst aus.
- **Fremde Volltexte bleiben intern.** Mitschriften, Übersetzungen und Kopien fremder Vorträge, Studien und Dokumente sind **Bearbeitungen**. Arbeitskopie im Vault: ja. Weitergabe, Veröffentlichung, Versand an Kunden: nur mit Zustimmung des Urhebers. Solche Dateien tragen einen Kopfblock, der genau das festhält.
- **Zitate** bleiben kurz, stehen in Anführungszeichen und nennen Urheber und Anlass. Ein Zitat ersetzt keine eigene Formulierung.
- **Gegenrichtung nicht vergessen:** Eigene Mechanismen an Fremde weiterzugeben ist eine **Entscheidung**, keine Nebensache — besonders bei MIT-lizenzierten Projekten, die sie anschließend weiterverbreiten.

*(Gelebte Praxis seit 07/2026, hier nur benannt: Die Übernahme der Koerting-Impulse war von Tobias und
TJ freigegeben, die BERENT-Fassung ist eigenständig formuliert und trägt ihre Herkunft im Schlussabsatz —
so wie die Fußzeile dieser Datei. Anlass der Verschriftlichung: die Auswertung eines fremden
Konferenzvortrags und eines fremden Repos am 06./08.08.2026.)*

---

*Adaptiert nach dem Struktur-Vorbild des Koerting-Infrastructure-Playbooks (v1.1), Inhalte aus der
BERENT-Infrastruktur. Änderungen an der Infrastruktur bitte hier UND im systems-register.md nachziehen.*
