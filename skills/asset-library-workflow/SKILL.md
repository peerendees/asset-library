---
name: asset-library-workflow
description: >
  Legt neue Assets (Skills, Templates, Scripts, Configs) in der Notion Asset Library ab
  und bereitet die zugehörigen Dateien für GitHub vor. Verwende diesen Skill immer dann,
  wenn der User einen neuen Skill, ein Template oder eine andere Datei in die Asset Library
  eintragen möchte – auch bei Formulierungen wie "leg das als Skill ab", "trag das in die
  Asset Library ein", "füge das zur Bibliothek hinzu", "erstelle einen neuen Asset-Eintrag"
  oder "push das auf GitHub".
compatibility: Erfordert Notion MCP. GitHub MCP optional (sonst manueller Push).
---

# Asset Library Workflow

Dieser Skill legt neue Assets in der Notion-Datenbank „Asset Library" ab, erstellt die
zugehörigen Dateien und bereitet sie für GitHub vor.

---

## Bekannte IDs

- Notion Datenbank (data_source_id): ec790d33-f7c9-4ff2-93a0-a3f03e4b0bc0
- Notion Container-Seite: 31931cc6-fd56-81eb-a8c7-c014ad4fb902
- GitHub Repository: https://github.com/peerendees/asset-library

---

## Erstinstallation (Einmalig)

Dieser Abschnitt gilt für alle, die die Asset Library neu aufsetzen.
Wer die Library bereits nutzt, kann direkt zu "Workflow" springen.

### A) Notion Container-Seite anlegen

```
notion_create_pages(
    pages=[{
        "properties": {"title": "🗂️ Asset Library"},
        "content": "Zentrale Bibliothek für Skills, Templates, Scripts und andere Assets."
    }]
)
```

Die zurückgegebene page_id notieren – sie wird als parent für die Datenbank benötigt.

### B) Notion Datenbank anlegen

```
notion_create_database(
    parent={"page_id": "<container_page_id>"},
    title="Assets",
    schema="""CREATE TABLE (
        "Name" TITLE,
        "Typ" SELECT('Skill':blue, 'Template':green, 'Script':orange, 'Config':yellow, 'Sonstiges':gray),
        "Kurzinfo" RICH_TEXT,
        "Status" SELECT('Draft':gray, 'Ready':green, 'Deprecated':red),
        "Version" RICH_TEXT,
        "Tags" MULTI_SELECT('Slack':blue, 'Notion':red, 'Automation':orange, 'Claude':purple, 'MCP':green, 'n8n':yellow),
        "Lieferformat" SELECT('Copy-Paste':yellow, 'GitHub Download':blue, 'Beides':green),
        "GitHub URL" URL,
        "Kompatibilitaet" RICH_TEXT,
        "Oeffentlich" CHECKBOX,
        "Erstellt am" CREATED_TIME,
        "Zuletzt aktualisiert" LAST_EDITED_TIME
    )"""
)
```

Die zurückgegebene data_source_id notieren – sie ersetzt überall in dieser SKILL.md
den Platzhalter ec790d33-f7c9-4ff2-93a0-a3f03e4b0bc0.

### C) GitHub Repository anlegen

1. Neues Repository auf github.com erstellen (z.B. "asset-library")
2. Lokal klonen: git clone https://github.com/<username>/<repo>.git
3. Folgende Ordnerstruktur anlegen:
   mkdir -p skills templates scripts configs
4. Ersten Commit pushen:
   git add . && git commit -m "Initial structure" && git push

Die GitHub-Repository-URL überall in dieser SKILL.md anpassen.

### D) SKILL.md anpassen

Nach der Erstinstallation die folgenden Werte in dieser Datei ersetzen:
- ec790d33-f7c9-4ff2-93a0-a3f03e4b0bc0 → eigene data_source_id
- 31931cc6-fd56-81eb-a8c7-c014ad4fb902 → eigene Container-Seiten-ID
- https://github.com/peerendees/asset-library → eigene GitHub-Repository-URL

---

## Workflow

### Schritt 1: Asset-Typ bestimmen

Frage den User falls nicht klar:
- **Skill** – Workflow-Anweisung für Claude (besteht aus SKILL.md + description.md)
- **Template** – Wiederverwendbare Vorlage
- **Script** – Ausführbares Skript
- **Config** – Konfigurationsdatei
- **Sonstiges** – Alles andere

### Schritt 2: Dateien vorbereiten

Für einen **Skill** immer zwei Dateien erstellen:

**SKILL.md** – Vollständige Ausführungslogik:
- YAML-Header mit name, description, compatibility
- Workflow-Schritte
- Fehlerbehandlung
- Beispiel-Auslöser

**description.md** – Kurzbeschreibung:
- Trigger-Formulierungen
- Kompatibilität
- Verweis auf SKILL.md

Dateien unter `/home/claude/<asset-name>/` erstellen, dann nach
`/mnt/user-data/outputs/<asset-name>/` kopieren.

### Schritt 3: Notion-Eintrag anlegen

```
notion_create_pages(
    parent={"data_source_id": "ec790d33-f7c9-4ff2-93a0-a3f03e4b0bc0"},
    pages=[{
        "properties": {
            "Name": "<Asset-Name>",
            "Typ": "<Skill|Template|Script|Config|Sonstiges>",
            "Kurzinfo": "<1-2 Sätze Beschreibung>",
            "Status": "Ready",
            "Version": "1.0",
            "Tags": "[\"<tag1>\", \"<tag2>\"]",
            "Lieferformat": "Beides",
            "GitHub URL": "https://github.com/peerendees/asset-library/tree/main/<typ>/<name>",
            "Kompatibilitaet": "<z.B. Erfordert Slack MCP + Notion MCP>",
            "Oeffentlich": "__YES__"
        },
        "content": "<siehe Seitenstruktur unten>"
    }]
)
```

### Schritt 4: Seitenstruktur des Notion-Eintrags

Jeder Eintrag folgt diesem Aufbau:

```
## 📋 Überblick
<Ausführliche Beschreibung, Anwendungsfälle>

---

## 🎯 Aktivierung – So rufst du den Skill auf

Sobald der Skill installiert ist, wird er durch folgende Formulierungen aktiviert:

- „<Trigger-Formulierung 1>"
- „<Trigger-Formulierung 2>"
- „<Trigger-Formulierung 3>"
- ...

Der Skill erkennt diese Formulierungen automatisch – kein spezieller Befehl nötig.

---

## 📦 Dateien / Komponenten
| Datei | Zweck | Verfügbar als |
|---|---|---|
| SKILL.md | Vollständige Skill-Logik | Copy-Paste ↓ / GitHub |
| description.md | Trigger-Beschreibung | Copy-Paste ↓ / GitHub |

---

## ⚙️ Voraussetzungen
- ...

---

## 🚀 Installation
Option A – Copy-Paste: Inhalt unten kopieren
Option B – GitHub: [Link zum Repo-Ordner]

---

## 📄 SKILL.md
[Gesamter Inhalt als EIN Codeblock – kein Markdown-Rendering]

---

## 📄 description.md
[Gesamter Inhalt als EIN Codeblock]

---

## 📝 Changelog
| Version | Datum | Änderung |
| 1.0 | TT.MM.JJJJ | Erstveröffentlichung |
```

**Wichtig:** Dateinamen (SKILL.md, description.md) als einfache Überschriften –
KEINE Links oder Hyperlinks auf die Dateinamen setzen.

**Wichtig:** Jeden Dateiinhalt als EINEN einzigen Codeblock einfügen, nicht als
formatierten Notion-Content. Notion interpretiert sonst Markdown und erstellt
gemischte Blöcke statt eines kopierbaren Blocks.

### Schritt 5: GitHub

Falls GitHub MCP verfügbar → direkt pushen unter:
`<typ>/<asset-name>/SKILL.md`
`<typ>/<asset-name>/description.md`

Falls nicht verfügbar → Dateien als Output bereitstellen mit Anweisung:
```
git clone https://github.com/peerendees/asset-library.git
mkdir -p <typ>/<asset-name>
cp ~/Downloads/SKILL.md <typ>/<asset-name>/
cp ~/Downloads/description.md <typ>/<asset-name>/
git add .
git commit -m "Add <asset-name>"
git push
```

---

## GitHub-Verzeichnisstruktur

```
asset-library/
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md
│       └── description.md
├── templates/
│   └── <template-name>/
├── scripts/
│   └── <script-name>/
└── configs/
    └── <config-name>/
```

---

## Fehlerbehandlung

| Problem | Lösung |
|---|---|
| Notion-Datenbank nicht gefunden | data_source_id: ec790d33-f7c9-4ff2-93a0-a3f03e4b0bc0 |
| GitHub MCP nicht verfügbar | Dateien als Output bereitstellen, Terminal-Befehl mitgeben |
| Dateiinhalt wird als Markdown gerendert | Gesamten Inhalt als einen Codeblock einfügen |
| Links auf Dateinamen entstehen | Dateinamen nur als einfache Überschrift, nie als Link |

---

## Beispiel-Auslöser

- „Leg das als Skill ab"
- „Trag das in die Asset Library ein"
- „Erstelle einen neuen Asset-Eintrag"
- „Füge das zur Bibliothek hinzu"
- „Push das auf GitHub"
- „Speicher den Skill in Notion"
