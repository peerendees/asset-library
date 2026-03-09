---
name: berent-ci
description: >
  Wendet die vollständige Corporate Identity von BERENT.AI auf alle erstellten
  Inhalte an – Webseiten, Artefakte, HTML, CSS, Gamma-Präsentationen und
  Dokumente. Verwende diesen Skill immer dann, wenn für BERENT oder BERENT.AI
  etwas gestaltet, gebaut oder erstellt werden soll, auch wenn der Nutzer das
  CI nicht explizit erwähnt. Enthält Farben, Typografie, CSS-Variablen,
  Plus-Symbol, Footer-Pflichtlinks, Gamma-Theme-Parameter und
  KI-Anwendungsregeln für konsistente BERENT-Outputs.
---

# BERENT CI – Corporate Identity Skill

Dieser Skill stellt sicher, dass alle Outputs für BERENT.AI konsistent im
definierten Corporate Design erscheinen. Er gilt für HTML, CSS, Artefakte,
Präsentationen, Dokumente und alle anderen visuellen Outputs.

## Identität

- **Marke:** BERENT.AI – Beratung + Entwicklung
- **Domain:** berent.ai
- **Markensymbol:** Das `+` Kreuz-Symbol – verbindet Beratung und Entwicklung

---

## Farbpalette

| Rolle            | Hex       | Beschreibung                                    |
|------------------|-----------|-------------------------------------------------|
| Hintergrund      | `#090806` | Warmes Dunkelbraun-Schwarz – KEIN reines Schwarz |
| Primär / Kupfer  | `#B5742A` | Hauptakzent, Headlines, Buttons, Borders        |
| Gold / Champagne | `#E8C98A` | **Exklusiv** für das `+` Symbol                 |
| Text             | `#C4BCB1` | Warmes Graubeige – Fließtext                    |
| Sekundärtext     | `#7A6A58` | Muted / Labels / Metainfo                       |
| Sekundärtext 2   | `#9A8870` | Dezente Labels                                  |
| Card-Hintergrund | `#110E0A` | Leicht aufgehellt                               |
| Border           | `#2A2118` | Subtile Trennlinien                             |

**Regeln:**
- Niemals `#000000` oder `#FFFFFF` verwenden
- Gold `#E8C98A` ist ausschließlich dem `+` Symbol vorbehalten

---

## Typografie

| Einsatz          | Font             | Gewicht       | Hinweis              |
|------------------|------------------|---------------|----------------------|
| Headlines        | **Bebas Neue**   | Regular       | Immer UPPERCASE      |
| Body / Fließtext | **Lora**         | 300 / 400 / 600 | Kein `font-style: italic` |
| Code / Labels    | **JetBrains Mono** | 300 / 400 / 700 | Technische Inhalte |

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:wght@300;400;600&family=JetBrains+Mono:wght@300;400;700&display=swap" rel="stylesheet">
```

**Regeln:**
- Niemals `font-style: italic` bei Lora
- Niemals Inter, Roboto, Arial, System-UI
- Bebas Neue: `letter-spacing: 0.04em` bis `0.1em`

---

## CSS Standard-Setup

```css
:root {
  --bg:      #090806;
  --card:    #110e0a;
  --border:  #2a2118;
  --copper:  #B5742A;
  --gold:    #E8C98A;
  --text:    #C4BCB1;
  --muted:   #7A6A58;
  --muted2:  #9a8870;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Lora', serif;
  font-weight: 300;
  line-height: 1.7;
}
```

---

## Das Plus-Symbol

Zentrales Markenelement – immer in Gold `#E8C98A`, niemals in Kupfer.

**Verwendung:** Bullet-Ersatz, Trennelement, Headlines, Navigation, Footer.

```css
.plus-mark {
  width: 18px; height: 18px;
  position: relative; flex-shrink: 0;
}
.plus-mark::before,
.plus-mark::after {
  content: '';
  position: absolute;
  background: var(--gold);
  border-radius: 1px;
}
.plus-mark::before { width: 2px; height: 100%; left: 50%; top: 0; transform: translateX(-50%); }
.plus-mark::after  { width: 100%; height: 2px; top: 50%; left: 0; transform: translateY(-50%); }
```

---

## Navigation / Header

```html
<a href="https://berent.ai" class="nav-brand" style="text-decoration:none;color:inherit;">
  <div class="plus-mark"></div>
  <span>BERENT.AI — Beratung + Entwicklung</span>
</a>
```

**Regeln:**
- `BERENT.AI` immer in Großbuchstaben
- Header-Brand ist immer ein Link auf `https://berent.ai`

---

## Footer (Pflichtstruktur)

```html
<footer>
  <div class="footer-brand">
    <div class="plus-mark"></div>
    BERENT
  </div>
  <span>[ Seitenname ] · berent.ai</span>
  <div style="display:flex;gap:2rem;">
    <a href="https://berent.ai/impressum.html">Impressum</a>
    <a href="https://berent.ai">← Zurück zur Hauptseite</a>
  </div>
</footer>
```

**Pflichtlinks:** Impressum (`https://berent.ai/impressum.html`) + Zurück zur Hauptseite (`https://berent.ai`)

---

## Gamma Theme (BERENT 0.9.4)

| Parameter        | Wert          |
|------------------|---------------|
| Theme ID         | `yg1h3fiwbwfurqf` |
| Background       | `#090806`     |
| Primary Accent   | `#B5742A`     |
| Secondary Accent | `#E8C98A`     |
| Text Color       | `#C4BCB1`     |
| Heading Font     | Bebas Neue    |
| Body Font        | Lora          |
| Mono Font        | JetBrains Mono |
| Bullet Style     | `+`           |
| Card Background  | `#110e0a`     |
| Border Color     | `#2a2118`     |

---

## Design-Prinzipien

1. **Wärme statt Kälte** – Warme Braun-Schwarz-Töne, keine kalten Graus
2. **Editorial** – Großzügiger Weißraum, klare Typografie-Hierarchie
3. **Kupfer als Leitfarbe** – Akzente, Hover-States, Borders, Nummern
4. **Kein Generic-AI-Look** – Keine lila Gradienten, kein Inter-Font, kein Weiß
5. **Plus als Markenelement** – Überall wo Bullets, Separatoren oder Highlights

---

## Anwendungsregeln (Kurzfassung)

- Hintergrund: immer `#090806`
- Fließtext: immer `#C4BCB1`
- Headlines: Bebas Neue · Body: Lora ohne Kursiv · Code: JetBrains Mono
- Akzent: Kupfer `#B5742A` · Plus-Symbol: Gold `#E8C98A`
- Footer: immer mit Impressum-Link und Zurück-zur-Hauptseite-Link
- Nav-Brand: immer klickbarer Link auf `https://berent.ai`

---

## Für Cursor AI

Datei ablegen als `.cursor/rules/berent-ci.md` im Projektordner.
Cursor liest sie automatisch bei jedem Prompt.

---

*BERENT.AI · Beratung + Entwicklung · berent.ai*
