---
name: slack-daily-summary
description: >
  Liest einen oder mehrere Slack-Kanäle aus, fasst die wichtigsten Inhalte des Tages zusammen
  und legt die Zusammenfassung als neue Seite in Notion ab. Verwende diesen Skill immer dann,
  wenn der User Slack-Inhalte zusammenfassen, täglich protokollieren oder in Notion übertragen
  möchte – auch bei Formulierungen wie "Was gab es heute in Slack?", "Fasse #kanal zusammen",
  "Tages-Update aus Slack", "Slack-Digest", oder "Slack nach Notion". Auch wenn der User fragt
  "Was wurde heute gepostet?" in Bezug auf einen Slack-Kanal, soll dieser Skill ausgelöst werden.
compatibility: Erfordert Slack MCP und Notion MCP
---

# Slack Daily Summary → Notion

Dieser Skill liest Slack-Kanäle aus, erstellt eine strukturierte Tages-Zusammenfassung und
speichert diese als Notion-Seite.

---

## Workflow

### Schritt 1: Kanal-ID ermitteln

Falls die Channel-ID nicht bekannt ist, zuerst suchen:

```
slack_search_channels(query="<kanalname>")
```

Bekannte Kanal-IDs aus früheren Sessions können direkt verwendet werden (z.B. #general = C07D2J226DN).

---

### Schritt 2: Heutige Nachrichten abrufen

Zeitstempel für den Beginn des heutigen Tages (Mitternacht UTC) berechnen und als `oldest` übergeben:

```python
import time
from datetime import datetime, timezone

today_midnight = datetime(
    datetime.now(timezone.utc).year,
    datetime.now(timezone.utc).month,
    datetime.now(timezone.utc).day,
    tzinfo=timezone.utc
)
oldest_ts = str(today_midnight.timestamp())
```

Dann Kanal lesen:

```
slack_read_channel(
    channel_id="<channel_id>",
    oldest="<today_midnight_timestamp>",
    limit=100,
    response_format="concise"
)
```

Falls mehr als 100 Nachrichten: Pagination mit `cursor` nutzen, bis alle Nachrichten des Tages geladen sind.

---

### Schritt 3: Zusammenfassung erstellen

Die abgerufenen Nachrichten zu einer strukturierten Zusammenfassung verdichten:

**Format der Zusammenfassung:**

```
# Slack-Digest: #<kanalname> – <Datum TT.MM.JJJJ>

## Überblick
<2–3 Sätze: Was war heute das dominante Thema?>

## Wesentliche Beiträge
- **<n>**: <Kernaussage des Beitrags>
- **<n>**: <Kernaussage>
...

## Offene Fragen / Action Items
- <Falls vorhanden: Fragen, die unbeantwortet blieben, oder genannte To-dos>

## Neue Mitglieder
- <Falls vorhanden: Wer ist dem Kanal beigetreten?>
```

**Regeln für die Zusammenfassung:**
- Nur inhaltlich relevante Beiträge aufnehmen – "joined the channel"-Meldungen unter "Neue Mitglieder"
- Bei wenig Aktivität: kurze Zusammenfassung + Hinweis "Wenig Aktivität heute"
- Keine wörtlichen Zitate, nur Kernaussagen
- Sprache: Deutsch, es sei denn der User wünscht etwas anderes

---

### Schritt 4: In Notion ablegen

Ziel-Seite in Notion suchen oder anlegen. Standard: Eine Datenbank oder Seite namens "Slack-Digest" oder "Daily Summaries".

Falls keine Zielseite bekannt:
```
notion_search(query="Slack Digest")
```

Neue Seite anlegen:
```
notion_create_pages(
    parent={"page_id": "<ziel_seiten_id>"},
    pages=[{
        "properties": {
            "title": "Slack-Digest: #<kanal> – <TT.MM.JJJJ>"
        },
        "content": "<zusammenfassung als Notion Markdown>"
    }]
)
```

---

## Mehrere Kanäle

Falls mehrere Kanäle (oder alle Kanäle des Workspaces) zusammengefasst werden sollen:

1. Schritte 1–3 für **jeden Kanal einzeln** durchführen
2. Kanäle **ohne heutige Aktivität** werden nicht mit einem vollständigen Abschnitt aufgeführt
3. Kanäle mit ausschließlich „joined the channel"-Meldungen gelten ebenfalls als **inaktiv**
4. Am Ende eine **Übersichtszeile** einfügen: „X von Y Kanälen heute aktiv"
5. Reihenfolge: aktivste Kanäle (meiste Beiträge) zuerst

**Format der kombinierten Notion-Seite:**

```
# Slack-Digest – <TT.MM.JJJJ>

**Aktivität heute: X von Y Kanälen**

## #general
<Zusammenfassung>

## #share-experiences
<Zusammenfassung>

---
_Keine Aktivität heute: #announcements, #help, #language-requests_
```

---

## Fehlerbehandlung

| Problem | Lösung |
|---|---|
| Keine Nachrichten heute | Kurze Seite mit "Heute keine Aktivität in #<kanal>" anlegen |
| Kanal nicht gefunden | User nach korrektem Kanalnamen fragen |
| Notion-Zielseite nicht gefunden | User fragen, wo die Seite abgelegt werden soll |
| Mehr als 100 Nachrichten | Pagination nutzen, alle Seiten laden bevor zusammengefasst wird |

---

## Beispiel-Auslöser

- „Was gab es heute in #general?"
- „Fasse #team für heute zusammen und leg's in Notion ab"
- „Tages-Digest aus Slack erstellen"
- „Slack-Update in Notion speichern"
- „Was wurde heute in Slack gepostet?"
