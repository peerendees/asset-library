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

## Produkt-Oberflächen (mediumgerecht)

Festgelegt am 10.10.2026 am Beispiel des BelegChat-Cockpits.

Für Web schreibt diese CI den dunklen Grund `#090806` und Lora als Fließtext vor. Das gilt
für Auftritte — Landing Pages, Präsentationen, Seiten, die jemand ansieht. Ein **Arbeits-
werkzeug** ist etwas anderes: Dort werden Zahlenkolonnen über Stunden gelesen, und eine
Serifen-Lesetypo setzt Ziffern schlechter als eine Tabellenschrift.

Es gilt dasselbe Prinzip wie bei DOCX: **CI über Farben und Formen, nicht über den
Hintergrund.** Der dunkle Auftritt bleibt im Dunkelmodus erhalten.

### Farben, heller Modus

| Rolle | Hex | Hinweis |
|---|---|---|
| Hintergrund | `#FDFAF5` | warmes Off-White — **nie** `#FFFFFF` |
| Karte | `#FFFDF9` | hebt sich minimal ab |
| Fließtext | `#2A1A08` | dunkles Warmbraun |
| Primär / Akzent | `#B5742A` | Kupfer — Schaltflächen, Links, Fokusring |
| Sekundär / Muted | `#F5EFE4` | Champagne |
| Sekundärtext | `#7A6A58` | Labels, Metainfo |
| Akzentfläche | `#F0E6D4` | aktive Navigation |
| Akzenttext | `#8D5A20` | dunkleres Kupfer |
| Rahmen, Eingabefeld | `#E4DAC8` | |
| Destruktiv | `#A33A2A` | warmes Rot statt des kalten Standardtons |

### Farben, dunkler Modus

Hier gilt die CI im Original: Grund `#090806`, Fließtext `#C4BCB1`, Karte `#110E0A`, Rahmen
`#2A2118`, Akzent weiterhin Kupfer `#B5742A`, Sekundärtext `#9A8870`.

### Status-Plaketten

Drei Zustände, in beiden Modi unterscheidbar — Sandgold wartet, Salbei ist erledigt,
Terrakotta ruft. Rot bleibt dem Klärungsfall vorbehalten und ist gedämpft: Er bedeutet
Arbeit, nicht Gefahr.

| Status | hell (Grund / Text) | dunkel (Grund / Text) |
|---|---|---|
| wartend | `#F2E4C6` / `#875713` | `#3A2E14` / `#E8C98A` |
| erledigt | `#E4EBDD` / `#4A5D39` | `#24301D` / `#A8C48C` |
| Klärung | `#F7E0D8` / `#9C3B26` | `#3D201A` / `#E0937F` |

**Als CSS-Variablen führen, nicht als Utility-Klassen.** Ein `bg-green-100` aus einem
Framework kennt den Dunkelmodus nicht und bringt zugleich einen kalten Ton in eine warme
Oberfläche.

### Typografie in Produkt-Oberflächen

| Einsatz | Schrift | Hinweis |
|---|---|---|
| Überschriften | **Bebas Neue** | wie überall: Versalien, `letter-spacing: 0.06em` |
| Fließtext und Tabellen | **Instrument Sans** | editorial und straff, bei 14 px noch ruhig |
| Code, technische Labels | JetBrains Mono | |

**Warum nicht Lora:** siehe oben — Lesetypo gegen Tabellenschrift.

**Warum Instrument Sans:** Gewählt aus einem Sehvergleich bei 14 px im echten Tabellen-
kontext. Verworfen wurden *Jost* (der Verlag-Linie am nächsten, aber `1 / l / I` laufen bei
13 px zusammen — in einer Belegliste ein Risiko), *IBM Plex Sans* (die sichersten Ziffern,
wirkt aber technisch statt edel) und *Manrope* (wärmer, dafür runder und breiter).

**Verlag** (Hoefler & Co) ist kommerziell und pro Domain lizenziert — in Produkten nur
einsetzbar, wo eine Lizenz für genau diese Domain vorliegt.

Zahlen in Tabellen immer mit `font-variant-numeric: tabular-nums`, sonst springen die
Spalten.

### Signet im Produkt

Hell: `be-farbe-v3.webp` (farbig). Dunkel: `be-sw-v3.webp` (grau-schwarz). **In dieser
Richtung** — wie auf berent.ai. Das Signet wird auf die Höhe von Titel plus Untertitel
gesetzt; die konkrete Pixelzahl gehört gemessen, nicht geschätzt, weil sie an den Metriken
der Schrift hängt.

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
