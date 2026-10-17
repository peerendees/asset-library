#!/usr/bin/env python3
"""
Misst Tempo (BPM) und Lage des ersten Downbeats eines Musikstücks und
schlägt die Werte für src/ci/takt.ts vor.

  pip install librosa
  python3 scripts/takt-analyse.py public/musik/mein-stueck.mp3

Hinweis: Bei leisen Intros liegt die Schätzung oft einen Bruchteil zu spät.
Die Downbeat-Schätzung nimmt den lautesten Schlag unter den ersten
acht als Takt-Eins. Im Studio gegenhören und `versatz` notfalls von Hand
um einen Schlag verschieben.
"""
import sys

import librosa
import numpy as np

datei = sys.argv[1]
y, sr = librosa.load(datei, sr=22050, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
tempo = float(np.atleast_1d(tempo)[0])
roh = tempo
# Halbe/doppelte Lesart: Werbe- und Imagemusik liegt fast immer zwischen 90 und 180 BPM
while tempo < 90:
    tempo *= 2
while tempo > 180:
    tempo /= 2
zeiten = librosa.frames_to_time(beats, sr=sr)
env = librosa.onset.onset_strength(y=y, sr=sr)
staerke = env[beats[:8]]
eins = int(np.argmax(staerke)) % 4 if len(staerke) else 0
takt_s = 4 * 60 / tempo
versatz = float(zeiten[eins]) % takt_s if len(zeiten) else 0.0
dauer = len(y) / sr
print(f"Datei:       {datei}")
print(f"Dauer:       {dauer:.2f} s")
print(f"Tempo:       {tempo:.1f} BPM  (gerundet {round(tempo)}; Rohwert {roh:.1f})")
print(f"1. Downbeat: {versatz:.3f} s")
print(f"Takt-Länge:  {takt_s:.3f} s  → 30 s ≈ {30 / takt_s:.1f} Takte")
print()
print("In src/ci/takt.ts eintragen:")
print(f"  bpm: {round(tempo, 2)},")
print(f"  versatz: {round(versatz, 3)},")
