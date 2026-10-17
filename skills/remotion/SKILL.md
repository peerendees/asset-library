---
name: remotion
description: Erstellt Videos mit Remotion (React) im BERENT-CI – Teaser, Keynote-Opener, Social-Clips, Erklärvideos. Verwende diesen Skill IMMER bei /remotion, „mach ein Video“, „Video-Teaser“, „Motion Graphics“, „Remotion“, „Opener für den Vortrag“, „animierte Folien als Video“ – auch wenn das CI nicht erwähnt wird.
---

# /remotion – Videos im BERENT-CI

Dieser Skill legt fest, **wie** BERENT-Videos aussehen, klingen und gebaut werden.
Für die Remotion-Technik (APIs, Rendern, Untertitel, Medien) gelten zusätzlich die
offiziellen Remotion-Skills (`remotion-dev/skills`, insbesondere
`remotion-best-practices`, `remotion-markup`, `remotion-create`, `remotion-render`).
Sind sie nicht installiert, die aktuelle Doku über remotion.dev nachschlagen –
nicht aus dem Gedächtnis arbeiten, die API ändert sich schnell.

**Versionsstand der Vorlage: Remotion 4.0.534**, exakt gepinnt. Grund: BERENT-Regel
„Abhängigkeiten reifen lassen“ (ENGINEERING-PRINCIPLES §5.4, mindestens 7 Tage alt).
Die offiziellen Skills beschreiben bereits `Interactive.create()` und `<Track>` – die
gibt es erst ab 4.0.535/4.0.536. Die Vorlage nutzt deshalb einfache React-Komponenten
in `<Sequence>`; das läuft in jeder 4.x-Version. Umstieg erst, wenn die neue Version
die Frist erfüllt, dann `npx remotion upgrade` und Szenen auf `Interactive.create()`
umstellen. Bis dahin Codebeispiele der offiziellen Skills entsprechend zurückübersetzen.

## Arbeitsweise mit Marcus

1. **Erst fragen, dann bauen.** Vor jeder Verarbeitung Briefing und Storyboard
   vorlegen und auf Bestätigung warten. Kein Rendern ohne ausdrücklichen Auftrag
   („rendern“, „exportieren“, „gib mir die MP4“) – sonst Studio-Vorschau.
2. Sprache: Deutsch, kein Gendern, kein `&` (immer „und“), Datum TT.MM.JJJJ.
3. Kritisch bleiben: Wenn ein Text zu lang für seine Takte ist oder ein Effekt
   die Aussage überdeckt, das sagen – nicht stillschweigend bauen.

## Standards (wenn nichts anderes genannt ist)

| Eigenschaft | Wert |
|---|---|
| Format | 16:9, 1920 × 1080 |
| Bildrate | 30 fps |
| Länge | 30 s = 900 Frames |
| Tempo | 120 BPM → 1 Schlag = 15 Frames, 1 Takt = 60 Frames = 2 s, 30 s = 15 Takte |
| CI | **BERENT**, sofern kein anderes CI vorgegeben ist |

Andere Formate: 9:16 = 1080 × 1920, 1:1 = 1080 × 1080. Schriftgrößen dann mit
`skaliere()` aus `tokens.ts` umrechnen und Layouts neu prüfen, nicht nur skalieren.

## Vorlage

Jedes Video startet als Kopie der **BERENT Remotion-Vorlage**:

- lokal: `/Users/Shared/Projekte/Entwicklung/Projekte/videoschnitt/berent-remotion-vorlage`
- GitHub: `peerendees/asset-library` → `templates/berent-remotion-vorlage`
- Ist beides nicht erreichbar: Marcus fragen. Nur wenn es die Vorlage nirgends gibt,
  mit `npx create-video@latest --yes --blank --no-tailwind` neu anlegen, Versionen auf
  eine mindestens 7 Tage alte Remotion-Version pinnen und die Bausteine nach dem
  Katalog unten nachbauen.

```bash
cp -R berent-remotion-vorlage <video-name> && cd <video-name> && npm i && npm run dev
```

Im Projekt ist `src/ci/tokens.ts` die **einzige** Stelle für Farben, Schriften,
Größen. Komponenten nennen Rollen (`farbe.kupfer`, `schrift.titel`), nie Hex-Werte.

## CI im Video

Grundlage: BERENT-CI-Skill und die BelegChat-Umsetzung (BER-197/BER-199).
„Mediumgerecht“ heißt: CI über Farben und Formen, angepasst an das Leuchtmedium Video.

### Farben

| Rolle | Hex | Einsatz im Video |
|---|---|---|
| Grund | `#090806` | Hintergrund jeder Szene |
| Karte | `#110E0A` | Kästen, Karten |
| Rand | `#2A2118` | Linien, Geisterzahlen, Umrisse |
| Kupfer | `#B5742A` | Leitfarbe: Akzentwörter, Linien, Glühen, Farbblitz, Vollfläche |
| Kupfer hell | `#C98D45` | Glühkern, Akzentwort-Füllung |
| Gold | `#E8C98A` | **ausschließlich** das Plus-Zeichen – auch im Plus-Netz nur als kleine Plus-Knoten |
| Champagne | `#F5EFE4` | Große Überschriften, Lichtblitz |
| Text | `#C4BCB1` | Fließtext, Unterzeilen |
| Gedämpft | `#7A6A58` / `#9A8870` | Kicker, Labels, Hintergrund-Wörter |

Regeln: nie `#000000`, nie `#FFFFFF` (der Lichtblitz ist Champagne).
Überschriften im Video in Champagne statt Kupfer – Kupfer als 200-px-Fläche wirkt
matt und verliert nach der Kompression. Kupfer trägt das **eine** Akzentwort.
Dunkle Schrift auf Kupfer-Vollfläche: `#090806` auf `#B5742A` = 5,24:1.

### Schriften (lokal in `public/fonts`, OFL, kein Google-Abruf)

| Rolle | Schrift | Einsatz |
|---|---|---|
| `schrift.titel` | **Bebas Neue** 400 | Einschläge, Titel, Zahlen. Immer Versalien, Sperrung 0.04–0.1em |
| `schrift.satz` | **Instrument Sans** 600/700 | Sätze, Fragen, Aussagen, Unterzeilen |
| `schrift.mono` | **JetBrains Mono** 700 | Kicker („FRAGE 01“), Kennungen, Platzhalter, Daten |

Warum nicht Lora: Feine Serifen flimmern bei 1080p nach der Kompression und
lesen sich in 2–4 s Standzeit schlechter. BelegChat hat aus demselben Grund
Instrument Sans gewählt (editorial, straff, gut lesbar in kleinen Größen).
Lora nur für ein ruhiges Zitat ab 64 px, Gewicht 600, nie kursiv.
Bebas Neue hat keine Kleinbuchstaben – Markenschreibweisen wie „gemAInsam“
deshalb in Instrument Sans setzen.

### Größen und Ränder (1920 × 1080)

Einschlag 240 px · Titel 150 px · Aussage 92 px · Zweitzeile 64 px · Unterzeile
40 px · Kicker 26 px. Sicherer Bereich: 140 px seitlich, 120 px oben/unten.

### Wenn ein anderes CI gilt

Kundenvideo oder eigene Marke (z. B. Trutzburg AI mit eigenem CI): nur
`tokens.ts` und `public/fonts` tauschen, Bausteine bleiben. Die Gold-Regel gilt
dann nicht – die Regeln des jeweiligen CI ersetzen sie.

## Effektsprache

Abgeleitet aus der Stilvorlage „Thomas Völker – KI-Keynote-Teaser“ (77 s, ~123 BPM):
schwarzer Grund, eine Neonfarbe, harte Schnitte auf dem Downbeat, eine Aussage
pro Bild. Übernommen wird die **Grammatik**, nicht das Aussehen: keine
Sechsecke, kein Magenta, keine Montserrat, keine fremden Texte.

| Wirkung | Baustein | Einsatz und Taktregel |
|---|---|---|
| Rauschen um ein Thema | `Wortwolke` | Aufhänger. Wörter tauchen alle 3–4 Frames auf; mit `sogAb` in die Mitte saugen |
| Tippende Zeile | `Schreibmaschine` | Erste Zeile des Aufhängers, Cursor blinkt im Achtel |
| Zweitzeile als Pointe | `Satz` mit `*…*` | Kommt auf Takt-Eins des nächsten Taktes, in Kupfer |
| Verdichtung | `PlusZeichen` | Alles verschwindet, das Gold-Plus bleibt und pulst auf Schlag 3 und 4 |
| Lichtblitz | `Blitz art="licht"` | Auf dem Downbeat eines Wendepunkts (Titel, Kapitel, Abspann). Höchstens 3 pro 30 s |
| Farbblitz | `Blitz art="kupfer"` | Genau einmal: auf dem Einschlag des Akzentworts im Titel |
| Einschlag | `Einschlag` | Titelwörter; Anflug 4–6 Frames, Ankunft exakt auf dem Schlag |
| Netz-Raum | `PlusNetz` | Hinter Titel und Abspann, nie hinter Fließtext |
| Frage | `Kicker` + `Satz` | „FRAGE 01“ + Frage mit einem Akzentwort, Geister-„?“ dahinter, 2 Takte Standzeit |
| Kapitelmarke | `PlusRahmen` | 1 Takt: Plus, Kicker, Titel über drehenden Plus-Umrissen, Geisterzahl |
| Prozess | `Ablauf` | Lichtpunkt springt im Viertel von Kasten zu Kasten, max. 4 Kästen |
| Umwandlung | `Scanner` | Daten laufen durch die Lichtlinie: Klartext links, Ergebnis rechts in Mono |
| Kernaussage | `Grund flaeche={farbe.kupfer}` | Einmal pro Video, Satz in zwei Zeilen, dunkel + Champagne |
| Wiedererkennung | `Grund` | Atmender Kupferschein in einer Ecke durch alle Szenen |

Grundregeln:

- **Eine Aussage pro Bild.** Pro 2 Takte (4 s) höchstens 8–10 Wörter, pro Takt höchstens 5.
- **Ein Akzentwort pro Satz** – das, worum es geht. Nie zwei Kupferwörter in einer Zeile.
- Bewegung mit `interpolate()` und `Easing`, nie CSS-Animationen.
- Unschärfe + Skalierung beim Einlaufen, nie Hereinfliegen von der Seite.
- Glühen nur auf Kupfer und Gold, nie auf Champagne-Text.

## Dramaturgie für 30 s (15 Takte)

| Takte | Szene | Inhalt |
|---|---|---|
| 0–2 | Aufhänger | Wortwolke, Tippzeile, Kupfer-Pointe, Sog ins Plus |
| 3–4 | Titel | Lichtblitz, Einschlag – Plus – Akzent-Einschlag mit Farbblitz, Netz |
| 5–6 | Frage | Das Problem des Zuschauers als Frage |
| 7 | Kapitel | Die Antwort bekommt einen Namen |
| 8–9 | Beweis 1 | Ablauf: so läuft es |
| 10–11 | Beweis 2 | Scanner oder Karten: Einwand entkräften (DSGVO, Aufwand, Kosten) |
| 12 | Kernaussage | Kupfer-Vollfläche |
| 13–14 | Abspann | Wortmarke, Claim „gemAInsam wachsen +“, berent.ai, Ausblende |

Für 60 s: Fragen und Beweise verdoppeln, sonst gleich. Für 15 s: Aufhänger (2) –
Titel (2) – ein Beweis (2) – Abspann (1.5).

## Takt und Musik

- Szenen beginnen auf Takt-Eins (`takt(n, fps)`), Dauern in ganzen Takten (`takte(n, fps)`).
- Innerhalb einer Szene: Zweitzeilen auf den nächsten Takt, Einschläge auf Schläge (`schlag(n, fps)`).
- Szenen als harte Schnitte: je Szene eine `<Sequence name=… from={takt(n, fps)}
  durationInFrames={takte(m, fps)}>`, Blitze danach als eigene Ebene mit absolutem
  `bei`-Frame. Weiche Überblendungen (`TransitionSeries`) passen nicht zu dieser Effektsprache.

**Musik-Anforderung** (an der Vorlage orientiert, nicht kopiert): elektronisch,
treibend, 118–128 BPM, 4/4. Leiser Aufbau über die ersten 3 Takte mit Riser,
hörbarer Einsatz (Drop) genau auf dem Titel, kurzer Breakdown vor der
Kernaussage, klarer Schlussschlag. Keine Stimme, keine Melodie, die mit dem
Text konkurriert.

Ablauf:

1. Bis echte Musik da ist: Platzhalter aus `scripts/taktspur.py` (eigene Synthese,
   keine Samples). Parameter `--bpm --takte --einschlag --breakdown --abspann`
   passend zum Storyboard setzen.
2. Echtes Stück: nur mit kommerzieller Lizenz (Lizenznachweis zum Projekt legen;
   bei KI-generierter Musik die Nutzungsbedingungen des Anbieters prüfen).
   Die Musik der Stilvorlage nie verwenden oder nachbauen.
3. `python3 scripts/takt-analyse.py public/musik/<datei>` → `bpm` und `versatz`
   in `src/ci/takt.ts` eintragen. Bei leisen Intros im Studio gegenhören, die
   Downbeat-Schätzung kann einen Bruchteil zu spät liegen.
4. Unrunde Tempi (z. B. 123 BPM) driften nicht, weil `schlag()` je Schlag rundet –
   Schnitte trotzdem im Studio auf dem Kick prüfen.

## Ablauf eines Auftrags

1. **Briefing klären** (nur fragen, was fehlt): Zweck und Ort der Ausspielung,
   Zielgruppe, Kernaussage in einem Satz, Länge/Format falls abweichend, CI falls
   nicht BERENT, vorhandene Musik, Bilder oder Logos.
2. **Storyboard als Tabelle** vorlegen: Takt · Szene · Text (wörtlich) · Effekt ·
   Akzentwort. Wörter je Takt zählen. **Bestätigung abwarten.**
3. Vorlage kopieren, Studio starten (`npm run dev`), Vorschau offen lassen.
4. Szenen in `src/szenen/` anpassen oder aus Bausteinen neu bauen. Jede Szene ist
   eine eigene Komponente und zusätzlich in `Root.tsx` im Ordner „Szenen“ als
   Komposition registriert, damit sie einzeln im Studio geprüft werden kann.
5. **Prüfen** (siehe Liste), Marcus die Vorschau zeigen, Änderungen einarbeiten.
6. Erst auf ausdrücklichen Wunsch rendern:
   `npx remotion render <Komposition> out/<name>.mp4`.

## Prüfliste vor der Abgabe

- [ ] `npx tsc --noEmit` und `npx eslint src` ohne Fehler
- [ ] Je Szene ein Standbild auf dem Höhepunkt (`npx remotion still <Komp> out/x.jpg --frame=<n>`)
      und als Kontaktbogen angesehen: Lesbarkeit, Überlappungen, Ränder
- [ ] Jedes Wort mindestens 1,5 s vollständig sichtbar, bevor es geht
- [ ] Gold nur am Plus, kein `#000`/`#FFF`, ein Akzentwort pro Satz
- [ ] Umlaute, „ß“ und deutsche Anführungszeichen korrekt dargestellt
- [ ] Schnitte und Blitze sitzen hörbar auf dem Schlag
- [ ] Ton blendet ein und aus, Abspann endet nicht abrupt
- [ ] Musiklizenz geklärt oder deutlich als Platzhalter markiert

## Technische Hinweise

- Schriften lädt `src/ci/schriften.ts`; jede Szene importiert die Datei, damit sie
  auch einzeln im Studio stimmt.
- Zufall nur über `random("seed")` aus `remotion`, nie `Math.random()`.
- Rendern in einer Cloud-Sitzung ohne Chrome-Download: vorhandenes Chromium mit
  `--browser-executable=<pfad>/headless_shell` übergeben, `--concurrency` ≤ Kernzahl.
- Qualität: `remotion.config.ts` setzt CRF 16 – Glühen und Verläufe brauchen das.
- Lizenz: Remotion ist für Teams bis drei Personen kostenfrei, darüber Firmenlizenz.
