# HPCN Remotion-Vorlage

Startprojekt für Videos im HPCN-CI (Skill `hpcn-ci`), abgeleitet aus der
BERENT Remotion-Vorlage. Beispiel: 30-s-Teaser für **M-HIS**.

**Standard:** 16:9 · 1920 × 1080 · 30 fps · 30 s · 112 BPM (14 Takte à ≈ 2,14 s)
**Remotion 4.0.534**, exakt gepinnt (mindestens 7 Tage alt, ENGINEERING-PRINCIPLES §5.4).

## Loslegen

```bash
cp -R hpcn-remotion-vorlage mein-video && cd mein-video
npm i
npm run dev                                   # Studio im Browser
npx remotion render MhisTeaser out/teaser.mp4 # erst nach Abnahme
```

## Unterschiede zur BERENT-Vorlage

| Thema | BERENT | HPCN |
|---|---|---|
| Farben | Kupfer, Gold, Warmbraun | Markenblau, Navy, Akzentblau auf `#071A30` |
| Schrift | Bebas Neue, Instrument Sans | Inter 800/700/600, JetBrains Mono |
| Markenzeichen | `PlusZeichen` | `Raster` (2×2 aus dem Logo) |
| Netz | `PlusNetz` (Plus-Knoten) | `Netzwerk` (quadratische Knoten) |
| Kapitelmarke | `PlusRahmen` | `Quadratrahmen` |
| Titel | Versalien | gemischte Schreibung |
| Tempo | 120 BPM | 112 BPM, ruhiger |

`src/ci/tokens.ts` behält die Rollennamen der BERENT-Vorlage (`kupfer` = Akzentblau,
`gold` = Raster-Farbe), damit die gemeinsamen Bausteine unverändert laufen.

## Inhalt des Beispiels

Belegt: M-HIS = Modulares Handels-Informations-System der HPCN, auf IBM Power i,
für Baumaschinenhandel, Werkstätten, technischen Handel und Vermietung;
Auftragsabwicklung und Kostenauswertung. **Bewusst nicht behauptet:**
KI-Funktionen in M-HIS, aktuelle Release-Stände, Kundenzahlen.

## Musik

`public/musik/taktspur-112bpm.wav` ist selbst synthetisiert (Platzhalter, keine Samples).
Für die Veröffentlichung ein lizenziertes Stück einsetzen und mit
`python3 scripts/takt-analyse.py` Tempo und Downbeat in `src/ci/takt.ts` eintragen.

## Lizenzen

Schriften OFL (`public/fonts/LIZENZEN.md`). Logo `public/bilder/` ist ein Nachbau –
für Veröffentlichungen das Original von HPCN einsetzen.
