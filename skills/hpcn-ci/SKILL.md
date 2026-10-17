---
name: hpcn-ci
description: Wendet das Corporate Design der HPCN – Heinrich Professional Consultant Network GmbH an (Logo, Farben, Schriften, Video-Regeln). Verwenden bei allem, was für HPCN oder M-HIS gestaltet wird: Videos, Folien, Webseiten, Dokumente.
---

# HPCN-CI

Gilt für alle Ausgaben, die für **HPCN – Heinrich Professional Consultant Network GmbH**
(Tübingen, www.h-pcn.de) oder ihr Produkt **M-HIS** entstehen. Nicht mit dem
BERENT-CI mischen: kein Kupfer, kein Gold-Plus, keine Bebas Neue.

Fassung 1.0 vom 17.10.2026. Abgeleitet aus dem Logo und der Website; ein
offizielles Markenhandbuch lag nicht vor. Abweichungen, die HPCN vorgibt, gehen vor.

## Logo

Wortbildmarke: 2×2-Block **HP / CN** (Grotesk fett, „H“ in Markenblau, „P C N“ in
Markengrau), rechts vierzeilig **HEINRICH** (Markenblau) / **PROFESSIONAL /
CONSULTANT / NETWORK** (Markengrau) + kleines **GMBH**.

| Datei | Einsatz |
|---|---|
| `logo/hpcn-logo.svg` / `.png` | Standard auf hellem Grund |
| `logo/hpcn-logo-negativ.svg` / `.png` | Auf Navy oder dunklem Grund |
| `logo/hpcn-signet.svg` / `.png` | Nur der 2×2-Block (Favicon, Avatar, Video-Ecke) |
| `logo/hpcn-signet-negativ.svg` / `.png` | Signet auf Dunkel |

Ablage aller Dateien (Logo, Schriften, Tokens, CI-Übersicht):
`peerendees/asset-library` → `brand/hpcn/`, lokal
`/Users/Shared/Projekte/Entwicklung/Projekte/asset-library/brand/hpcn/`.

**Wichtig:** Die Vektordateien sind ein **Nachbau** aus der 250-px-PNG der Website
(Schrift Arimo, in Pfade gewandelt). Für Druck und große Formate die Originaldatei
anfordern – laut Metadaten wurde das Logo 2016 in Adobe Illustrator gebaut.
Logo nie verzerren, nicht umfärben (außer Negativfassung), Schutzzone = Höhe des „H“.

## Farben

| Rolle | Hex | Einsatz | Kontrast |
|---|---|---|---|
| Markenblau | `#3450AC` | Logo, Akzente, Links, Akzent-Vollfläche | 7,27:1 auf Weiß |
| Navy | `#003366` | Flächen (Hero, Kopf), Überschriften | 12,61:1 auf Weiß |
| Mittelblau | `#005C9E` | Hover, Sekundärakzent | 6,94:1 auf Weiß |
| Markengrau | `#787878` | Nur Logo und Grafik – als Text zu schwach (4,42:1) | – |
| Text | `#1F2937` | Fließtext | 13,34:1 auf Grund hell |
| Text 2 | `#4B5563` | Sekundärtext | – |
| Grund hell | `#F3F4F6` | Seitengrund | – |
| Rand hell | `#E5E7EB` | Linien, Kartenrand | – |

**Dunkel (Video, Bühne, Dark Mode)** – Ergänzung, auf der Website nicht vorhanden:

| Rolle | Hex | Kontrast |
|---|---|---|
| Grund dunkel | `#071A30` | – |
| Karte dunkel | `#0C2A4D` | – |
| Rand dunkel | `#1E3F66` | – |
| Akzent | `#7E9BF0` (Markenblau aufgehellt) | 6,53:1 auf Grund dunkel |
| Glühkern | `#A9BDF7` | – |
| Text dunkel | `#EEF1F5` | 15,45:1 |
| Text dunkel 2 | `#A7B0BD` | 7,99:1 |

Markenblau `#3450AC` direkt auf Dunkel hat nur 2,41:1 – dort immer den Akzent `#7E9BF0` nehmen.

## Schriften (lokal einbinden, `fonts/`, OFL)

| Rolle | Schrift | Einsatz |
|---|---|---|
| Überschrift | **Inter 800**, Laufweite −0,02em | Titel, Aussagen; gemischte Schreibung |
| Text | **Inter 400 / 600** | Fließtext, Unterzeilen |
| Kennung | **JetBrains Mono 700**, Versalien, Sperrung 0.3em | Kicker, Modulnamen, IBM-i-Begriffe |

Begründung: Das Logo ist eine Helvetica-Grotesk, die Website nutzt die Systemschrift.
Inter ist die frei lizenzierte, gut lesbare Grotesk, die beiden am nächsten kommt.
Kein Google-Fonts-CDN in Produktion.

## Markenelement: das Raster

Der 2×2-Block des Logos ist das wiederkehrende Gestaltungselement (Gegenstück zum
BERENT-Plus): vier Quadrate, oben links hervorgehoben. Einsatz als Aufzählungszeichen,
Trenner, Ladeanimation, Knoten im Netzwerk-Hintergrund („Network“ im Namen).

## Video (mit `/remotion`)

- Fertige HPCN-Variante: `templates/hpcn-remotion-vorlage` (M-HIS-Teaser als Beispiel),
  lokal `/Users/Shared/Projekte/Entwicklung/Projekte/videoschnitt/hpcn-remotion-vorlage`.
  Sonst die BERENT-Vorlage kopieren, `src/ci/tokens.ts` durch `tokens/hpcn-tokens.ts`
  ersetzen, Schriften aus `fonts/` nach `public/fonts` legen, `src/ci/schriften.ts`
  auf Inter umstellen.
- Die Vorlage-Rollennamen bleiben (`kupfer` = Akzentblau, `gold` = Raster-Farbe),
  damit die Bausteine unverändert laufen.
- Ersetze in den Szenen: `PlusZeichen` → Raster (2×2), `PlusNetz` → Netz mit
  quadratischen Knoten, `PlusRahmen` → ineinanderliegende, drehende Quadrate.
- Lichtblitz in `#EEF1F5`, Farbblitz in Markenblau, Kernaussage auf Markenblau-
  oder Navy-Vollfläche mit heller Schrift.
- Ton: sachlich, IBM-i-Kundschaft und Mittelstand – weniger Neon, mehr Ruhe als bei BERENT.
  Tempo eher 100–115 BPM.
- Abspann: Negativ-Logo, www.h-pcn.de, keine BERENT-Elemente.
- M-HIS-Inhalte nur belegt verwenden: Modulares Handels-Informations-System auf
  IBM Power i, für Baumaschinenhandel, Werkstätten, technischen Handel und Vermietung;
  Auftragsabwicklung und Kostenauswertung. Keine KI-Funktionen, Release-Stände oder
  Kundenzahlen behaupten, solange sie nicht bestätigt sind.

## Pflichtangaben

Firma: HPCN – Heinrich Professional Consultant Network GmbH · Egeriaplatz 3,
72074 Tübingen · Telefon +49 7071 13566-24 · info@h-pcn.de · www.h-pcn.de

## Texte

Deutsch, Sie-Form gegenüber Kunden (wie die Website), kein Gendern, „und“ statt `&`,
Datum TT.MM.JJJJ. Produktname immer **M-HIS** (mit Bindestrich), ausgeschrieben
„Modulares Handels-Informations-System“.
