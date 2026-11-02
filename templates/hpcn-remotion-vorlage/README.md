# HPCN Remotion-Vorlage

Startprojekt für Videos im HPCN-CI (Skill `hpcn-ci`), abgeleitet aus der
BERENT Remotion-Vorlage. Beispiel: 30-s-Teaser für **M-HIS** („Vom Posteingang in die Maske“).

**Standard:** 16:9 · 1920 × 1080 · 30 fps · 30 s. Tempo je Video aus dem Inhalt; das Beispiel läuft mit 96 BPM (12 Takte à 2,5 s), ruhige HPCN-Videos sonst eher 100–115 BPM.
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
| Tempo | 120 BPM | ruhiger, je Video festgelegt |

`src/ci/tokens.ts` behält die Rollennamen der BERENT-Vorlage (`kupfer` = Akzentblau,
`gold` = Raster-Farbe), damit die gemeinsamen Bausteine unverändert laufen.

## Das Beispiel – Anschauung, keine Schablone

Erzählform **Arbeitsplatz**, weil die Website-Botschaft ein Ablauf ist („KI setzt an den
Vorgängen an, die in M-HIS bereits liegen“):

| Takt | Szene | Inhalt |
|---|---|---|
| 0–1 | `Anfrage` | Mietanfrage kommt per Mail |
| 2–3 | | KI liest die Angaben heraus, Leitstrahlen füllen die M-HIS-Maske |
| 4 | | Hinweis aus der Maschinenakte (Musik ohne Kick) |
| 5 | | F10: der Mensch bestätigt (Einschlag) |
| 6 | | „M-HIS bleibt das führende System.“ |
| 7–9 | `Vorgaenge` | Maske wird zur Kachel, vier Vorgänge im 2×2 des Logos |
| 10–11 | `Schluss` | Kacheln werden zum Signet, Logo, Website-Zeile |

Für ein neues Video **nicht** diese Szenenfolge kopieren, sondern eine eigene Erzählform aus
dem Inhalt wählen (Skill `remotion`, „Aufbau“). Die Bausteine sind Werkzeug:

| Baustein | Wirkung |
|---|---|
| `Nachricht` | Mail-Karte mit Tipp-Effekt und markierten Wortgruppen |
| `Maske` | Bildschirmmaske im IBM-i-Stil (5250-Raster, F-Tasten), stilisiert |
| `Leitstrahl` | Lichtlinie von der Quelle zum Feld: woher ein Wert stammt |
| `Raster` | 2×2-Markenelement aus dem Logo |
| `Netzwerk` | Netz mit quadratischen Knoten |
| `Satz`, `Kicker`, `Blitz`, `Grund` | Text, beschreibende Überzeile, Blitz auf dem Schlag, Hintergrund |
| `Einschlag`, `Schreibmaschine`, `Wortwolke`, `Ablauf`, `Scanner`, `Quadratrahmen` | weitere Effekte, nur einsetzen, wenn der Inhalt sie trägt |

## Inhalt des Beispiels

Belegt: M-HIS = Modulares Handels-Informations-System der HPCN, auf IBM Power i,
für Baumaschinenhandel, Werkstätten, technischen Handel und Vermietung.
Mail, Kunde, Maschine und Maske sind erfunden und im Video als „Darstellung beispielhaft“
gekennzeichnet. **Bewusst nicht behauptet:** fertige KI-Funktionen in M-HIS,
Release-Stände, Kundenzahlen.

## Musik

`public/musik/taktspur-96bpm.wav` ist selbst synthetisiert (Einschlag Takt 5, Pause Takt 4, Abspann Takt 10 – passend zum Storyboard) (Platzhalter, keine Samples).
Für die Veröffentlichung ein lizenziertes Stück einsetzen und mit
`python3 scripts/takt-analyse.py` Tempo und Downbeat in `src/ci/takt.ts` eintragen.

## Lizenzen

Schriften OFL (`public/fonts/LIZENZEN.md`). Logo `public/bilder/` ist ein Nachbau –
für Veröffentlichungen das Original von HPCN einsetzen.
