# ENGINEERING-PRINCIPLES.md — BERENT

> Verbindliche Engineering-Prinzipien für alle Automationen, Produkte und Kundenprojekte von BERENT.
> Diese Datei ist eine KI-Anweisungsdatei. Sie wird in jedes Projekt gelegt und sorgt dafür, dass Claude Code
> Software baut, die **unbeaufsichtigt läuft und nicht bricht** — nachts um 03:00, ohne dass jemand zuschaut.
>
> Stand: 2026-08-14 · v1.4
> Schwester-Dokumente: `infrastructure-playbook.md` (wo es läuft) · `systems-register.md` (was zusammenhängt) ·
> berent-ci-Skill (wie es aussieht) · belegchat-security-Skill (Sicherheits-Checkliste vor Deploy/Push).
>
> Jedes Prinzip hier ist aus einem **echten BERENT-Vorfall** destilliert (Beleg in Klammern). Keine Theorie.
> Einzige Abweichung: die benannte Ausnahme für irreversible Schadensklassen im Schlussabsatz — dort ist ein
> Fremdbeleg zulässig und als solcher gekennzeichnet.

---

## 0 · Wie diese Datei zu benutzen ist

**Für Claude Code — verpflichtend:**
1. Datei in den Projekt-Root kopieren, in der `CLAUDE.md` referenzieren: `## Engineering → siehe ENGINEERING-PRINCIPLES.md (verbindlich)`.
2. Die Regeln mit **IMMER** / **NIE** sind nicht verhandelbar. Bei Konflikt mit einem Projektwunsch: nachfragen, nicht still abweichen.
3. §8 ist das kopierfertige Briefing, §9 die Checkliste vor Deploy und vor Aktivierung einer Automation.

**Der BERENT-Kontext, der alles prägt:** BERENT baut überwiegend **unbeaufsichtigte Systeme** —
n8n-Automationen, die nachts laufen; Webhooks, die produktive Threema-Nachrichten auslösen; GoBD-relevante
Belegverarbeitung. Der Maßstab ist nicht „besteht vor dem Kunden im Raum", sondern **„läuft drei Wochen ohne
Eingriff, und wenn es bricht, merkt man es sofort und verliert nichts"**.

---

## 1 · Governance zuerst

### 1.1 · Ampel vor Autonomie — *Green/Yellow/Red Gates*

**Prinzip.** Jede KI-Aktion hat eine Governance-Stufe: Grün = autonom, Gelb = Entwurf + Freigabe durch Marcus,
Rot = nur Mensch. Die Stufe steht als Datum am Skill/Workflow (`governance_level`), nicht als Kommentar.

**Praxis.** Mail-Versand, Löschen, Publizieren, Geld = nie autonom. „Löschen" heißt grundsätzlich
**Verschieben in einen reversiblen Ordner** (z. B. „KI-Aussortiert"), nie endgültig. Freigaben sind
item- oder kategoriebezogen, nie pauschal-implizit. *(Beleg: mail-triage/postfach-durchsicht, 07/2026.)*

### 1.2 · Kein Silent Patch — *Git → Seed → Runtime*

**Prinzip.** Verhalten (Prompts, Skills, Workflows, Parameter) wird NIE direkt in der Runtime geändert.
Der Weg ist immer: Git (SSoT) → Review/Commit → Seed/Deploy in die Runtime.

**Praxis.** Skills leben in `skills-db/` und werden per `seed-skills.mjs` nach berent-os synchronisiert;
n8n-Workflow-JSONs liegen im Repo und werden per API deployt. Wer live per UI patcht, erzeugt Drift,
die die nächste Session nicht kennt. *(Beleg: KI-Betriebssystem-Umbau, Entscheidung 5, Vault 08.)*

### 1.3 · Fail-closed — *Ohne Konfiguration ist zu*

**Prinzip.** Fehlt ein Secret, eine Policy oder eine Env-Variable, ist das Verhalten **gesperrt**, nie offen.

**Praxis.** Auth-Middleware ohne Session-Secret → alles 401. Decrypt-Dienst ohne Token-Env → jeder Request 401.
Tabellen mit personenbezogenen Daten → RLS aktiv und **keine** anon-Policies; Zugriff nur service_role.
Ein öffentliches Repo (threema-decrypt!) erzwingt: Code enthält nie Secrets, Auth ist im Code fail-closed.
*(Beleg: decrypt.js `if (!API_TOKEN) return false`, NR7-Middleware, mails-Tabelle.)*

---

## 2 · Robustheit im unbeaufsichtigten Betrieb

### 2.1 · Jede Grenze validiert UND bereinigt — *Validate & Sanitize at the boundary*

**Prinzip.** Fremde Daten (Modell-Output, Mails, Webhooks, API-Antworten) werden am Eingang gegen Schema
und erlaubte Werte geprüft — und **bereinigt**: Steuerzeichen, Null-Bytes, kaputte Encodings fliegen raus,
bevor irgendetwas gespeichert wird.

**Praxis.** LLM-Antworten: striktes Antwortformat im Prompt, dann JSON-Extraktion (erste `[` bis letzte `]`),
Enum-Validierung, unbekannte Werte auf konservativen Default (`behalten`, nie `löschen`). Externe Texte:
`U+0000` (Null-Byte) und einsame Surrogate entfernen — PostgreSQL lehnt sie ab, und EINE Gift-Mail stoppte den ganzen
Batch. *(Beleg: Durchsicht-Batch 11685, „unsupported Unicode escape sequence", 12.07.2026.)*

### 2.2 · Ein Gift-Element stoppt nie den Batch — *Poison-Item Isolation*

**Prinzip.** Batch-Verarbeitung ist pro Element fehlertolerant (`onError: continue`), Fehler werden
protokolliert, der Rest läuft weiter. Alles-oder-nichts ist verboten.

**Praxis.** n8n-Nodes in Batch-Strecken mit `continueRegularOutput`; fehlgeschlagene Elemente bleiben
unmarkiert und kommen beim nächsten Lauf wieder dran (siehe 2.4). *(Beleg: 46/51 Mails gerettet trotz Gift-Mail.)*

### 2.3 · Idempotenz über natürliche Schlüssel — *Upsert + Unique*

**Prinzip.** Jede Ingestion/Schreiboperation hat einen natürlichen Dedup-Schlüssel und läuft als Upsert.
Wiederholung, Reconnect, Doppellauf → gleicher Endzustand. Bereits angereicherte Daten werden nie überschrieben
(`ignore-duplicates`, nicht `merge`).

**Praxis.** Mails: UNIQUE (account, folder, message_id). Belege: UNIQUE (mandant, gobd_hash). Der IMAP-Trigger
feuert nach jedem Reconnect erneut — nur Dedup macht das harmlos. *(Beleg: Mail-Ingestion, doppelte
Trigger-Läufe 11681/11682 → eine Zeile.)*

### 2.4 · Resümierbar in Fenstern — *Windowed Backfill / Resume*

**Prinzip.** Große Bestände werden in begrenzten Fenstern (Zeitraum, Limit pro Lauf) verarbeitet, mit
persistiertem Fortschrittsmarker (`triaged_at`, `exported_at`, `processed`-Set). Neustart = weitermachen,
nie von vorn.

**Praxis.** Backfill in Monatsfenstern; Analyse-Batches mit `limit` + Marker-Spalte; Schleife läuft, bis der
Rest 0 ist. *(Beleg: 820 Mails in 13 Fenstern + 9 Batch-Runden, 0 Verluste, 13.07.2026.)*

### 2.5 · Lastdeckel — *Bounded Fan-out*

**Prinzip.** Volumen wird VOR der Verarbeitung begrenzt: Abruf-Fenster, `limit` pro Lauf, gedeckelte
Parallelität, gekappte Feldgrößen (Body-Cap). Unbegrenztes „hol alles" ist ein selbstverschuldeter Ausfall.

**Praxis.** IMAP-Abruf mit Zeitfenster statt „alle Ungelesenen" (650 auf einmal = OOM auf dem VPS, der auch
Produktiv-Workflows trägt!). Chunks von 15 an das Modell, max. N pro Lauf. *(Beleg: n8n-OOM-Crashes 11658/11659,
12.07.2026 — der teuerste Fehler des Tages.)*

### 2.6 · KI/APIs sind unzuverlässige Abhängigkeiten — *Timeout, Retry-selektiv, menschliche Meldung*

**Prinzip.** Jeder Call: Timeout, Abbruchmöglichkeit, Retry NUR bei transienten Fehlern (429/5xx), nie bei
4xx-Deterministik. Jeder Fehler endet in einer menschlichen Meldung, nie im Stacktrace.

**Praxis.** Modell-Calls mit 120-s-Timeout in Batch-Strecken; Threema-tauglicher Fehlertext („Entschuldige,
ich konnte keine Antwort erzeugen…"). Fallback ist ein **benutzbarer** Zustand, kein Error-Screen.

### 2.7 · Deterministischer Kern — *Zahlen rechnet Code, nie das Modell*

**Prinzip.** Beträge, Nummernkreise, Fristen, Gating-Entscheidungen kommen aus deterministischem Code +
kuratierten Parametern. Das Modell klassifiziert, fasst zusammen, entwirft — es rechnet nicht.

**Praxis.** Beleg-Nummern vergibt eine DB-Sequenz mit Kollisionsschutz, nicht das Modell; GoBD-relevante
Felder sind append-only mit Audit-Log. *(Beleg: BelegChat BER-90 Beleg-Nr-Bugfix — selbst deterministischer
Code braucht Regressionstests, ein LLM erst recht keine Zahlenhoheit.)*

### 2.8 · Unabhängige Zweitvalidierung — *Vier-Augen durch eine zweite KI*

**Prinzip.** Folgenreiche Ergebnisse mit komplexen Berechnungen oder kritischen Empfehlungen (Angebots-
beträge, Raten, rechtlich/steuerlich relevante Aussagen, Gating-Entscheidungen) werden vor Anzeige/Versand
von einer **zweiten, unabhängigen KI-Instanz** geprüft — möglichst ein **anderer Anbieter** als der
erzeugende, hinter einem austauschbaren Interface. Bei Zahlen prüft sie durch **unabhängiges Nachrechnen
gegen den deterministischen Kern** (§2.7) — das harte Signal ist der Zahlenvergleich, nie das Selbst-Urteil.

**Warum.** Eine Selbstprüfung hat dieselben blinden Flecken wie die Erzeugung. Die zweite Instanz fängt
inhaltliche Fehler (falsche Herleitung, Widerspruch, erfundener Betrag), bevor sie einen Kunden oder das
Finanzamt erreichen — und „von einer unabhängigen Instanz gegengeprüft" ist zugleich ein Vertrauenssignal.
Bewusst **selektiv**: nur für folgenreiche Ausgaben, nicht für jeden Output (Kosten/Latenz).
*(Vorgabe Marcus 13.07.2026; Struktur-Vorbild Koerting §4.9 / NIX-Sales-Assistent.)*

**Praxis.**
- Zweitinstanz hinter schmalem Interface (`Zweitinstanz`/`Validator`), Anbieter per Config tauschbar —
  anderer Vendor = echte Unabhängigkeit; ein schlanker `fetch` genügt.
- Input: deterministisches Kern-Ergebnis + zu prüfende Ausgabe → strukturiertes Urteil
  (bestätigt / Hinweise / Beanstandung). Rundungstoleranz bewusst setzen.
- **Nach Herleitung fragen, nicht nach Zustimmung.** „Bestätigst du das?" erzeugt Zustimmung — die
  Zweitinstanz neigt zum Ja, auch ohne geteilten blinden Fleck. Der Auftrag lautet deshalb:
  *unabhängig herleiten, dann die Abweichung benennen.* Erst die Abweichung ist ein Signal;
  ein „stimmt" ohne eigene Herleitung ist keins. Bei Zahlen ist das der Nachrechenweg oben, bei
  qualitativen Ausgaben die nachgebaute Begründung.
- Die Zweitinstanz ist selbst unzuverlässig (§2.6): Timeout, neutraler Fallback bei Ausfall —
  **NIE blockierend, NIE falscher Alarm**; bei Beanstandung greift die Governance-Ampel (§1.1):
  Ergebnis wird Gelb = Entwurf mit Freigabe, statt autonom rauszugehen.
- Prüfung im Hintergrund vorziehen, damit das abgesicherte Ergebnis ohne Wartezeit bereitliegt.

---

## 3 · Beobachtbarkeit & Nachvollzug

### 3.1 · Jede Ausführung hinterlässt eine Zeile — *Execution Log als Produkt-Feature*

**Prinzip.** Jede KI-Ausführung wird strukturiert protokolliert: Skill/Aufgabe, Input-Kanal, Dauer, Tokens,
Erfolg, geladener Kontext. Das Log ist Teil des Produkts (Dashboard), nicht nur Debug-Hilfe.

**Praxis.** `executions`-Tabelle in berent-os mit `context_loaded`, `tokens_used`, `review_required`;
NR7 zeigt es an. Keine personenbezogenen Daten in Logs. *(Beleg: berent-os seit Nachtlauf 07.07.2026.)*

### 3.2 · Ergebnis-Benachrichtigung mit Zahlen — *Push the summary*

**Prinzip.** Unbeaufsichtigte Läufe melden ihr Ergebnis aktiv (Threema/Slack) — mit konkreten Zahlen
(„84 analysiert: 12 verwertbar, 41 Löschkandidaten"), nicht nur „fertig". Kein Lauf endet stumm, außer er
hatte nichts zu tun.

**Praxis.** Abschluss-Summary als letzter Workflow-Node; bei leerem Batch bewusst keine Nachricht (kein Spam).

### 3.3 · Erst isoliert testen, dann integriert — *Test the smallest slice*

**Prinzip.** Bei Fehlern in Ketten wird die kleinste isolierbare Einheit einzeln getestet (Wegwerf-Workflow,
Ein-Zeilen-Testdatensatz), statt an der Gesamtkette zu raten. Testartefakte werden danach entfernt.

**Praxis.** Schreibpfad-Test mit einer Dummy-Zeile entlarvte den falschen API-Key in Sekunden, nachdem die
Gesamtkette nur „error" zeigte. Fingerprints (sha256-Präfix) vergleichen Secrets, ohne sie offenzulegen.
*(Beleg: Token-Odyssee 12.07.2026 — drei gestapelte Ursachen, nur durch Isolation trennbar.)*

---

## 4 · Ökonomie

### 4.1 · Modell nach Aufgabe, Kontext minimal

**Prinzip.** Billiges/schnelles Modell für Routing und Klassifikation, starkes nur für den Kern. Kontext
klein halten (Caps, Chunks) — spart Latenz, Kosten und ist DSGVO-freundlich.

**Praxis.** Mail-Klassifikation in 15er-Chunks mit 1500-Zeichen-Exzerpt statt Volltext; Keyword-Intent vor
LLM-Intent. Deterministische Regeln (Absender-Regeln) VOR dem Modell anwenden — jede gelernte Regel ist ein
gesparter Call.

### 4.2 · Selbstlernen über Feedback-Schleife — *Korrekturen werden Regeln*

**Prinzip.** Menschliche Korrekturen werden gespeichert (`feedback`) und zu deterministischen Regeln
destilliert, die künftige Läufe VOR dem Modell anwenden. Regeländerungen laufen über Git (1.2), nie als
stiller Runtime-Patch.

---

## 5 · Auslieferung

### 5.1 · Git-Takt: Commit pro Schritt, Push sofort, Tag pro Phase

Kleine Commits mit sprechender Botschaft (was + weshalb), sofort gepusht (Remote = Backup + Wiederaufsetzpunkt
für Sessions ohne Chat-Historie), benannte Stände als Tags. Migrationen werden im Repo gespiegelt
(`supabase/migrations/`), auch wenn sie per MCP angewendet wurden.

### 5.2 · Auto-Deploy ist eine Waffe — respektiere sie

GitHub-Push auf main = Production-Deploy (Vercel). Deshalb: nie auf main experimentieren, PR-Merge = bewusste
Deploy-Entscheidung, und **Env-Änderungen greifen erst mit Redeploy**. Bei fremden/geteilten Diensten additiv
ändern (neue Action, kein Umbau), Syntax-Check vor Push. *(Beleg: send_simple-Wiederherstellung via PR #8.)*

### 5.3 · Secrets: nie im Chat, nie in Git, Speicherorte registriert

Secrets wandern maschinell (Env, Credential-Stores, Zwischenablage-Pipes), nie durch Chat oder Commits.
Jedes Secret-Label hat ein Verzeichnis seiner Speicherorte im systems-register.md — bei Rotation werden ALLE
Orte aktualisiert, mit Fingerprint-Abgleich (sha256-Präfix) statt Sichtvergleich.
*(Beleg: DECRYPT_API_TOKEN lebte in 4 Speichern mit 2 Werten — ein Nachmittag Fehlersuche.)*

**Und die Gegenrichtung: am Eingang erkennen und zurückweisen.** Die Regel oben adressiert Claude als
**Absender**. Der Fall, der tatsächlich passiert, ist Claude als **Empfänger**: Ein Mensch fügt ein Secret in
eine Nachricht, eine Datei oder ein Freitextfeld ein — einmal kopiert, einmal eingefügt, ohne nachzudenken.
Trifft eine secret-förmige Zeichenkette in einer Eingabe ein, wird sie **nicht verarbeitet, nicht gespeichert,
nicht protokolliert und nicht wiederholt**. Claude meldet den Fund im Klartext, benennt das mutmaßliche Label
aus dem `systems-register.md` und fordert die Rotation über ALLE registrierten Orte an. Die laufende Aktion
geht auf **Rot** (1.1), nicht auf Gelb: Es gibt nichts freizugeben, der Vorgang bricht ab. Im Zweifel gilt die
Zeichenkette als Secret (1.3) — ein Fehlalarm kostet eine Rückfrage, ein übersehenes Token eine Rotation, die
niemand angestoßen hat.

Erkennungsmuster stehen im `systems-register.md`, Abschnitt „Secret-Formen am Eingang": JWT (`eyJ`-Präfix),
`Bearer `-Kopfzeilen, Anbieter-Präfixe (`sk-ant-`, `ghp_`, `xoxb-`, `sb_secret_`), PEM-Blöcke, lange
Zeichenketten mit hoher Entropie. Musterbasiert und damit ein **Stolperdraht, keine Mauer** — ein
strukturloses Passwort oder ein base64-Blob, der wie Nutzdaten aussieht, rutscht durch.
*(Fremdbeleg nach der benannten Ausnahme im Schlussabsatz: AI4 Conference 2026, Albert Milton, Hitachi Energy,
Folie „Even ‚Just the Variable Name' Isn't Safe" — der Agent fragte konstruktionsbedingt nur nach dem NAMEN
der Umgebungsvariablen; ein Nutzer fügte den rohen Token trotzdem ins Freitextfeld ein.)*

### 5.4 · Abhängigkeiten reifen lassen — *Mindestalter vor Übernahme*

**Prinzip.** Neue Versionen fremder Pakete werden erst nach einer Karenzzeit übernommen — Vorgabe
**sieben Tage**. Für dringende Sicherheitspatches gibt es einen ausdrücklichen, einzeln begründeten
Übersteuerungsweg, nie eine pauschale Abschaltung.

**Warum das unter Auslieferung steht.** Der Angriffsweg ist die kompromittierte Version eines
legitimen, viel genutzten Pakets. Solche Vorfälle werden meist binnen Stunden bis Tagen entdeckt und
zurückgezogen — wer eine Woche wartet, sieht sie nicht. Entscheidend ist die Schadensform: Die
Abhängigkeit selbst lässt sich zurückrollen, das typische Schadensbild nicht. Ein bösartiges
`postinstall`-Skript liest Umgebungsvariablen und Credential-Dateien und schickt sie fort. Damit
liegt der Fall bei **abgeflossenen Secrets** (5.3) — und genau deshalb greift die benannte Ausnahme
aus dem Schlussabsatz, obwohl das Paket-Update für sich genommen reversibel wäre.

**Praxis.** `.npmrc` im Projekt-Root: `min-release-age=7`. Läuft Dependabot, bekommt es eine
passende Abklingzeit — sonst schlägt es Versionen vor, die npm anschließend verweigert.
Übersteuerung nur einzeln: `npm install --min-release-age=0 <paket>`, mit Begründung im Commit.

**Verdrahtungsprüfung — Pflicht bei jeder Übernahme.** Die Einstellung wirkt erst ab **npm ≥ 11.10**;
ältere Versionen ignorieren sie **stillschweigend**. Wer sie setzt, ohne `npm --version` zu prüfen,
hat kein Gate, sondern eine Zeile in einer Datei. Das ist derselbe Fehler wie ein deklariertes, aber
nicht verdrahtetes Quality Gate — nur billiger zu vermeiden.

*(Fremdbeleg nach der benannten Ausnahme: Entwicklungsregeln von `PrimeIntellect-ai/prime-agent`
(MIT), geprüft 08.08.2026. Mechanismus übernommen, Wortlaut eigen — Playbook §10.)*

---

## 6 · Wirklichkeit schlägt Dokumentation

### 6.1 Zustand fremder Systeme wird gemessen, nicht nachgeschlagen

**IMMER** gegen das laufende System prüfen, bevor über dessen Zustand geredet wird.
**NIE** aus einem Dokument ableiten, was gebaut ist, läuft oder fehlt.

Dokumentation beschreibt den Stand ihres Entstehens, nicht den von heute. Bei fremden
Systemen liegen dazwischen regelmäßig Wochen — und niemand schickt eine Benachrichtigung,
wenn er etwas fertiggestellt hat.

(Beleg: SEO-Andockung, 08/2026. Einem Auftraggeber wurde mitgeteilt, zwei Schnittstellen
seien nicht gebaut und müssten erst entstehen. Grundlage war die Statustabelle in seinem
eigenen Übergabedokument, datiert eine Woche vor dem Commit, mit dem beide live gingen.
Gemessen waren **alle sieben** Vertragsbausteine seit drei Wochen in Produktion. Ein
einziger Aufruf hätte `401` statt `404` gezeigt. Der Schaden war nicht technisch — es war
die Fremdscham gegenüber jemandem, dem man etwas abverlangt, das er längst geliefert hat.)

**Die Unterscheidung, an der es scheiterte:**

| Antwort | Bedeutung |
|---|---|
| `401`, `403` | existiert, verlangt nur Anmeldung |
| `400`, `405`, `422` | Pfad existiert, Anfrage war unvollständig |
| `2xx` | existiert und antwortet |
| `404`, `501` | nicht gebaut — **nur hier** ist die Aussage zulässig |
| alles andere, keine Antwort | **unklar** — kein Befund, von Hand ansehen |

Ein „unklar" ist kein Ergebnis. Wer es als „fehlt" meldet, hat geraten.

### 6.2 Doppelte Absicherung: messen und belegen

Eine Regel ohne Mechanismus ist totes Vokabular. Deshalb beides:

**Messen.** Je Projekt ein Prüfskript, das jede fremde Schnittstelle abfragt und einen
**datierten Beleg** schreibt. Es braucht kein Token — die Unterscheidung oben genügt.
Die Tabelle gehört als Test ins Projekt: Wer die Logik ändert, muss die Tests ändern und
stolpert dabei über die Begründung.

**Belegen.** Jede Zustandsaussage über ein fremdes System — in einer Kundennachricht, einer
Spezifikation, einem Gesprächsleitfaden — braucht einen Beleg, der **nicht älter als
24 Stunden** ist. Fehlt er, lautet die zulässige Aussage **„nicht geprüft"**, nicht
„existiert nicht".

Gilt für jede Zustandsaussage über Fremdes, nicht nur für Schnittstellen: Läuft ein Dienst?
Ist eine Domain umgezogen? Ist eine Einstellung gesetzt? **Nachsehen, nicht nachschlagen.**

---

## 8 · Prinzipien-Briefing für Claude Code (kopierfertig)

**IMMER:**
- Governance-Stufe klären, bevor eine Aktion autonom läuft; Löschen = reversibles Verschieben (1.1).
- Verhalten über Git → Seed/Deploy ändern, nie live patchen (1.2).
- Fail-closed bauen: fehlende Config sperrt, RLS ohne anon-Policies bei personenbezogenen Daten (1.3).
- Fremddaten am Rand validieren UND bereinigen (Null-Bytes!), Enums konservativ defaulten (2.1).
- Batches elementweise fehlertolerant, mit Dedup-Schlüssel + Upsert, in Fenstern mit Fortschrittsmarker (2.2–2.4).
- Volumen deckeln: Zeitfenster, Limits, Chunks, Feld-Caps — besonders auf geteilter Infrastruktur (2.5).
- Timeout + selektiver Retry + menschliche Fehlermeldung an jedem Call (2.6).
- Zahlen deterministisch rechnen; GoBD-Relevantes append-only mit Audit-Log (2.7).
- Folgenreiche Ergebnisse von einer zweiten, unabhängigen KI gegenprüfen lassen — sie nach eigener Herleitung fragen, nie nach Zustimmung; bei Zahlen durch Nachrechnen gegen den Kern; nie blockierend, bei Beanstandung → Gelb (2.8).
- Jede Ausführung loggen (Dauer/Tokens/Kontext), Läufe melden ihr Ergebnis mit Zahlen (3.1–3.2).
- Bei Kettenfehlern die kleinste Einheit isoliert testen; Secrets per Fingerprint vergleichen (3.3).
- Secret-förmige Zeichenketten am Eingang erkennen, zurückweisen und die Rotation anstoßen — Rot, nicht Gelb (5.3).
- Neue Paketversionen sieben Tage reifen lassen; beim Setzen der Regel die npm-Version prüfen, sonst greift sie stillschweigend nicht (5.4).
- Zustand fremder Systeme messen, nie aus Doku ableiten; Aussagen brauchen einen Beleg < 24 h — sonst heißt es „nicht geprüft" (6.1–6.2).
- Regeln vor Modell, billig vor teuer, Kontext minimal (4.1–4.2).
- Commit pro Schritt, Push sofort, Tag pro Phase, Migrationen spiegeln (5.1).

**NIE:**
- Mail senden, endgültig löschen, publizieren oder Geld bewegen ohne explizite Freigabe.
- Einen Skill/Prompt/Workflow nur in der Runtime ändern (Silent Patch).
- Ein Secret in Chat, Commit oder Log schreiben — oder rotieren, ohne alle Speicherorte nachzuziehen.
- Ein **empfangenes** Secret weiterverarbeiten, speichern oder wiederholen, statt es zurückzuweisen und die Rotation anzustoßen (5.3).
- Unbegrenzt abrufen oder unbegrenzt parallelisieren („hol alle 650“) auf Infrastruktur, die Produktion trägt.
- Behaupten, eine fremde Schnittstelle sei nicht gebaut, ohne sie aufgerufen zu haben — `401` ist kein `404` (6.1).
- Einem Modell-Output ungeprüft trauen oder ihn ungefiltert in die Datenbank schreiben.
- Einen Batch als Alles-oder-nichts bauen.
- Auf main experimentieren, wenn main auto-deployt.
- Bei Unklarheit still abweichen — kurz nachfragen.

---

## 9 · Checkliste vor Deploy / Aktivierung

- [ ] Governance: Was darf autonom, wo ist die Freigabe? Reversibel statt endgültig?
- [ ] Dedup-Schlüssel + Upsert vorhanden? Wiederholung harmlos?
- [ ] Volumen gedeckelt (Fenster/Limit/Chunk/Cap)? Was passiert bei 10× Datenmenge?
- [ ] Sanitizer an jeder Fremddaten-Grenze? Enum-Defaults konservativ?
- [ ] Fehlertoleranz pro Element? Läuft der Rest bei einem Gift-Element weiter?
- [ ] Secrets: fail-closed, alle Speicherorte im Register dokumentiert?
- [ ] Erkennt der Eingang secret-förmige Zeichenketten, und ist der Rotationspfad hinterlegt? (5.3)
- [ ] `min-release-age` gesetzt UND npm ≥ 11.10 — sonst ist die Regel blind? (5.4)
- [ ] Braucht ein folgenreiches Ergebnis (Beträge, Empfehlungen, Rechtliches) die Zweitvalidierung? (2.8)
- [ ] Aussagen über fremde Systeme durch einen Beleg < 24 h gedeckt? (6.2)
- [ ] Execution-Log + Ergebnis-Benachrichtigung mit Zahlen?
- [ ] Migrationen gespiegelt, Commits gepusht, Tag gesetzt?
- [ ] belegchat-security-Checkliste durchlaufen (bei Deploy/Push Pflicht)?

---

*Lebendes Dokument. Neue Prinzipien nur mit Beleg aus einem echten BERENT-Vorfall. Adaptiert nach dem
Struktur-Vorbild der Koerting-Engineering-Prinzipien (v1.3), Inhalte aus der BERENT-Praxis.*

**Benannte Ausnahme — irreversible Schadensklassen.** Bei Prinzipien, deren Vorfall selbst der Schaden ist
und nicht rückholbar (abgeflossene Secrets, endgültig gelöschte Daten, versandte Nachrichten, bewegtes Geld
— die Menge aus §1.1), genügt ein **Fremdbeleg**: ein dokumentierter Vorfall außerhalb von BERENT, mit
benannter Quelle. Grund: Für Lastdeckel, Poison-Item oder Idempotenz ist die Beleg-Regel richtig, weil der
Vorfall reversibel und lehrreich ist — man verliert einen Nachmittag und gewinnt ein Prinzip. Bei einem
geleakten Credential verliert man das Credential. Die Ausnahme gilt **nur** für diese Klasse; der Beleg wird
im Text als fremd gekennzeichnet und NIE als BERENT-Vorfall geführt.
*(Erste Anwendung: §5.3 Eingangserkennung, v1.1 — 06.08.2026.)*
