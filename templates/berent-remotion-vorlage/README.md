# BERENT Remotion-Vorlage

Startprojekt für Videos im BERENT-CI. Gehört zum Skill `/remotion`.

**Standard:** 16:9 · 1920 × 1080 · 30 fps · 30 s · 120 BPM (15 Takte à 2 s)

**Remotion 4.0.534**, exakt gepinnt (mindestens 7 Tage alt, siehe ENGINEERING-PRINCIPLES §5.4).
Szenen sind einfache Komponenten in `<Sequence>`, damit die Vorlage ohne
`Interactive.create()` (erst ab 4.0.535/536) läuft.

## Loslegen

```bash
cp -R berent-remotion-vorlage mein-video   # pro Video eine Kopie
cd mein-video
npm i
npm run dev                                 # Remotion Studio im Browser
```

Rendern erst, wenn das Video abgenommen ist:

```bash
npx remotion render BerentTeaser out/mein-video.mp4
```

## Aufbau

| Pfad | Inhalt |
|------|--------|
| `src/ci/tokens.ts` | Farben, Schriftrollen, Größen, Glühen – **einzige Stelle für CI-Werte** |
| `src/ci/schriften.ts` | Lädt Bebas Neue, Instrument Sans, JetBrains Mono lokal aus `public/fonts` |
| `src/ci/takt.ts` | Taktraster: `takt(n)`, `schlag(n)`, `takte(n)`, `puls()` |
| `src/bausteine/` | Effekt-Bausteine (siehe unten) |
| `src/szenen/` | Acht Beispielszenen, jede einzeln im Studio öffnenbar |
| `src/BerentTeaser.tsx` | 30-s-Beispiel: Szenen als `<Sequence>`, Blitze, Musik |
| `public/musik/` | `taktspur-120bpm.wav` = synthetischer Platzhalter |
| `scripts/taktspur.py` | Erzeugt Platzhalter-Musik für beliebiges Tempo/Länge |
| `scripts/takt-analyse.py` | Misst BPM und ersten Downbeat eines echten Musikstücks |

## Bausteine

| Baustein | Wirkung |
|----------|---------|
| `Grund` | CI-Hintergrund, atmender Kupferschein in einer Ecke, Vignette; Variante Vollfläche |
| `PlusZeichen` | Das Gold-Plus (einzige Gold-Anwendung) |
| `PlusNetz` | Rotierende 3D-Punktwolke, Kupferlinien, Gold-Plus-Knoten, Lichtfunken |
| `Schreibmaschine` | Tipp-Effekt mit Kupfer-Cursor |
| `Wortwolke` | Schlagwort-Schwarm in Tiefenstaffelung, optional Sog in die Mitte |
| `Satz` | Wort-für-Wort-Einlauf, `*Hervorhebung*` in Kupfer mit Glühen |
| `Einschlag` | Wort schlägt groß und unscharf ein, rastet scharf ein |
| `Blitz` | Lichtblitz (Champagne) oder Farbblitz (Kupfer) auf dem Schlag |
| `Kicker` | Überzeile in JetBrains Mono, gesperrt: „FRAGE 01“ |
| `PlusRahmen` | Drehende Plus-Umrisse und Geisterzahl für Kapitelmarken |
| `Ablauf` | Prozesskette mit wanderndem Lichtpunkt |
| `Scanner` | Lichtlinie verwandelt Daten (Klartext → Platzhalter) |

## Musik

Die Platzhalter-Spur ist selbst erzeugt (keine Samples, keine Fremdmusik) und
nur zum Timing gedacht. Für die Veröffentlichung ein lizenziertes Stück
einsetzen, Tempo messen und in `src/ci/takt.ts` eintragen:

```bash
pip install librosa numpy
python3 scripts/takt-analyse.py public/musik/stueck.mp3
python3 scripts/taktspur.py --bpm 124 --takte 16 --ziel public/musik/spur.wav
```

## Lizenzen

- Schriften: SIL Open Font License, siehe `public/fonts/LIZENZEN.md`
- Remotion: kostenfrei für Teams bis drei Personen, darüber Firmenlizenz (remotion.pro/license)
