# BERENT Corporate Identity – KI Skill
> Einsetzbar als Claude Skill (neuer Chat) oder als `.cursor/rules/berent-ci.md` in Cursor AI

---

## Identität

**Marke:** BERENT.AI – Beratung + Entwicklung  
**Domain:** berent.ai  
**Claim:** Beratung + Entwicklung  
**Markensymbol:** Das `+` Kreuz-Symbol – steht für die Verbindung von Beratung und Entwicklung

---

## Farbpalette

| Rolle | Hex | Beschreibung |
|---|---|---|
| Hintergrund | `#090806` | Warmes Dunkelbraun-Schwarz – KEIN reines Schwarz |
| Primär / Kupfer | `#B5742A` | Hauptakzent, Headlines, Buttons, Borders |
| Gold / Champagne | `#E8C98A` | Exklusiv für das `+` Symbol und sparsame Highlights |
| Text | `#C4BCB1` | Warmes Graubeige – Fließtext und Body |
| Sekundärtext | `#7A6A58` | Muted / Labels / Metainfo |
| Sekundärtext 2 | `#9A8870` | Noch sichtbar, aber dezent |
| Card-Hintergrund | `#110E0A` | Leicht aufgehellt vom Seitenhintergrund |
| Border | `#2A2118` | Subtile Trennlinien und Rahmen |

**Regel:** Niemals reines Schwarz (`#000000`) oder reines Weiß (`#FFFFFF`) verwenden.  
**Regel:** Das Gold `#E8C98A` ist dem `+` Symbol vorbehalten – sparsam einsetzen.

---

## Typografie

| Einsatz | Font | Gewicht | Stil |
|---|---|---|---|
| Headlines / Display | **Bebas Neue** | Regular | UPPERCASE, kondensiert-geometrisch |
| Body / Fließtext | **Lora** | 300 / 400 / 600 | Kein Kursiv |
| Code / Labels / Mono | **JetBrains Mono** | 300 / 400 / 700 | Technische Inhalte |

**Google Fonts Import:**
```
https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:wght@300;400;600&family=JetBrains+Mono:wght@300;400;700&display=swap
```

**Regel:** Niemals `font-style: italic` bei Lora verwenden.  
**Regel:** Niemals generische Fonts wie Inter, Roboto, Arial, System-UI verwenden.  
**Regel:** Bebas Neue immer in Großbuchstaben, mit `letter-spacing: 0.04em` bis `0.1em`.

---

## CSS Variablen (Standard-Setup)

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

Das `+` ist das zentrale Markenelement von BERENT.AI.

**Verwendung:**
- Als Bullet-Punkt-Ersatz in Listen
- Als Trennelement zwischen Sektionen
- Als visueller Anker in Headlines (`Beratung + Entwicklung`)
- Als dekoratives Element in Navigation und Footer

**CSS-Implementierung:**
```css
.plus-mark {
  width: 18px;
  height: 18px;
  position: relative;
  flex-shrink: 0;
}
.plus-mark::before,
.plus-mark::after {
  content: '';
  position: absolute;
  background: var(--gold);
  border-radius: 1px;
}
.plus-mark::before {
  width: 2px; height: 100%;
  left: 50%; top: 0;
  transform: translateX(-50%);
}
.plus-mark::after {
  width: 100%; height: 2px;
  top: 50%; left: 0;
  transform: translateY(-50%);
}
```

**Regel:** Das Plus ist immer in `#E8C98A` (Gold) – niemals in Kupfer.

---

## Design-Prinzipien

1. **Wärme statt Kälte** – Warme Braun-Schwarz-Töne, keine kalten Grautöne
2. **Editorial** – Großzügiger Weißraum, klare Typografie-Hierarchie
3. **Kupfer als Leitfarbe** – Akzente, Hover-States, Borders, Nummern
4. **Kein Generic-AI-Look** – Keine lila Gradienten, keine Inter-Font, keine weißen Hintergründe
5. **Plus als Markenelement** – Überall wo Bullets, Separatoren oder Highlights erscheinen

---

## Navigation / Header

```html
<a href="https://berent.ai" class="nav-brand" style="text-decoration:none;color:inherit;">
  <div class="plus-mark"></div>
  <span>BERENT.AI — Beratung + Entwicklung</span>
</a>
```

**Regel:** `BERENT.AI` immer in Großbuchstaben.  
**Regel:** Der Header-Brand ist immer ein Link zurück zu `https://berent.ai`.

---

## Footer (Standard)

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

**Pflichtlinks im Footer:** Impressum (`https://berent.ai/impressum.html`) + Zurück zur Hauptseite (`https://berent.ai`).

---

## Gamma Theme Parameter (BERENT 0.9.4)

| Parameter | Wert |
|---|---|
| Background | `#090806` |
| Primary Accent | `#B5742A` |
| Secondary Accent | `#E8C98A` |
| Text Color | `#C4BCB1` |
| Heading Font | Bebas Neue |
| Body Font | Lora |
| Mono Font | JetBrains Mono |
| Bullet Style | `+` |
| Card Background | `#110e0a` |
| Border Color | `#2a2118` |

**Theme ID:** `yg1h3fiwbwfurqf`

---

## Anwendungsregeln für KI (Claude / Cursor)

Wenn du für BERENT.AI Inhalte oder Code erstellst, gilt immer:

- Hintergrund ist **immer** `#090806` – niemals `#000` oder `#fff`
- Fließtext ist **immer** `#C4BCB1` – niemals Weiß
- Headlines: **Bebas Neue**, Body: **Lora ohne Kursiv**, Code: **JetBrains Mono**
- Akzentfarbe: **Kupfer `#B5742A`** für Buttons, Borders, Nummern, Highlights
- Das **`+` Symbol** ist immer in Gold `#E8C98A`
- Footer enthält **immer** Impressum-Link und Zurück-zur-Hauptseite-Link
- Nav-Brand ist **immer** ein klickbarer Link auf `https://berent.ai`
- Kein `font-style: italic` bei Lora
- Kein reines Schwarz, kein Weiß, kein generic AI-Look

---

## Für Cursor AI – Datei ablegen als:

```
.cursor/rules/berent-ci.md
```

Cursor liest diese Datei automatisch und wendet die Regeln auf alle Prompts im Projekt an.

---

*BERENT.AI · Beratung + Entwicklung · berent.ai*
