#!/usr/bin/env python3
"""
Platzhalter-Musik („Taktspur“) für die BERENT-Remotion-Vorlage.

Erzeugt ein eigenes, synthetisches Stück im Taktraster des Videos:
Aufbau mit Riser, Einschlag auf dem Titel-Downbeat, durchgehender Groove,
Breakdown vor der Kernaussage, Abschlussschlag. Damit sitzen Schnitte und
Blitze hörbar auf dem Schlag, bevor echte Musik ausgewählt ist.

Keine Fremdmusik, keine Samples – alles aus Sinus, Rauschen und Hüllkurven.
Nur numpy nötig.

  python3 scripts/taktspur.py                          # 120 BPM, 15 Takte
  python3 scripts/taktspur.py --bpm 124 --takte 16 \
      --einschlag 3 --breakdown 12 --abspann 13 --ziel public/musik/spur.wav
"""
import argparse
import wave

import numpy as np

SR = 44100


def hk(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1.0) * np.exp(-t / d)


def kick(n):
    t = np.arange(n) / SR
    f = 48 + 110 * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * hk(n, 0.001, 0.28) * 0.95


def hat(n, rng, offen=False):
    x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))  # grob hochpassgefiltert
    return x * hk(n, 0.0005, 0.09 if offen else 0.03) * 0.16


def clap(n, rng):
    x = rng.standard_normal(n)
    env = sum(hk(n, 0.001, 0.012) * (np.arange(n) >= int(SR * k * 0.011)) for k in range(3))
    return np.diff(np.concatenate([[0], x])) * (env + hk(n, 0.004, 0.14)) * 0.22


def bass(n, freq):
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * 2 * freq * t)
    return np.tanh(x * 1.6) * hk(n, 0.004, 0.16) * 0.38


def pad(n, freqs):
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t + i) + 0.5 * np.sin(2 * np.pi * f * 1.003 * t) for i, f in enumerate(freqs))
    att = np.minimum(t / 0.4, 1.0)
    rel = np.minimum((n - np.arange(n)) / (0.3 * SR), 1.0)
    return x / len(freqs) * att * rel * 0.12


def riser(n, rng):
    t = np.linspace(0, 1, n)
    rausch = rng.standard_normal(n) * t**2.5 * 0.25
    ton = np.sin(2 * np.pi * np.cumsum(200 + 1400 * t**2) / SR) * t**3 * 0.12
    return rausch + ton


def einschlag(n, rng):
    t = np.arange(n) / SR
    tief = np.sin(2 * np.pi * np.cumsum(35 + 60 * np.exp(-t * 6)) / SR) * np.exp(-t / 0.9) * 0.9
    rausch = rng.standard_normal(n) * np.exp(-t / 0.25) * 0.35
    return tief + rausch


def setze(spur, signal, ab):
    ende = min(len(spur), ab + len(signal))
    if ab < len(spur):
        spur[ab:ende] += signal[: ende - ab]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bpm", type=float, default=120)
    ap.add_argument("--takte", type=int, default=15)
    ap.add_argument("--einschlag", type=int, default=3, help="Takt des großen Einschlags (Titel)")
    ap.add_argument("--breakdown", type=int, default=12, help="Takt ohne Kick (Kernaussage)")
    ap.add_argument("--abspann", type=int, default=13, help="Takt des Abspann-Einschlags")
    ap.add_argument("--ziel", default="public/musik/taktspur-120bpm.wav")
    ap.add_argument("--seed", type=int, default=7)
    a = ap.parse_args()

    rng = np.random.default_rng(a.seed)
    schlag = 60 / a.bpm
    n_schlag = int(round(schlag * SR))
    gesamt = int(a.takte * 4 * schlag * SR) + SR
    L = np.zeros(gesamt)
    R = np.zeros(gesamt)

    # Akkorde: Am – F – C – G (eigene Folge, je Takt ein Akkord)
    akkorde = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [261.63, 329.63, 392.0], [196.0, 246.94, 293.66]]
    bassnoten = [55.0, 43.65, 65.41, 49.0]

    for takt in range(a.takte):
        t0 = int(round(takt * 4 * schlag * SR))
        k = takt % 4
        aufbau = takt < a.einschlag
        p = pad(4 * n_schlag, akkorde[k]) * (0.5 if aufbau else 1.0)
        setze(L, p, t0)
        setze(R, np.roll(p, 220), t0)
        for s in range(4):
            ts = t0 + s * n_schlag
            mit_kick = (not aufbau or takt == a.einschlag - 1) and takt != a.breakdown
            if takt >= 1 and aufbau and takt < a.einschlag - 1:
                mit_kick = s in (0, 2)
            if mit_kick and takt < a.takte - 1 or (takt == a.takte - 1 and s < 2):
                setze(L, kick(n_schlag), ts)
                setze(R, kick(n_schlag), ts)
            off = ts + n_schlag // 2
            h = hat(n_schlag // 2, rng, offen=not aufbau)
            setze(L, h * 0.9, off)
            setze(R, h, off)
            if not aufbau and s in (1, 3) and takt != a.breakdown:
                c = clap(n_schlag, rng)
                setze(L, c, ts)
                setze(R, c * 0.9, ts)
            if not aufbau and takt != a.breakdown:
                b = bass(n_schlag // 2, bassnoten[k])
                setze(L, b, off)
                setze(R, b, off)

    # Riser in den Takt vor dem Einschlag, Einschläge auf die Downbeats
    for ziel in (a.einschlag, a.abspann):
        ts = int(round(ziel * 4 * schlag * SR))
        r = riser(4 * n_schlag if ziel == a.einschlag else 2 * n_schlag, rng)
        setze(L, r, ts - len(r))
        setze(R, r, ts - len(r))
        e = einschlag(int(2.5 * SR), rng)
        setze(L, e, ts)
        setze(R, e, ts)
    # Schlussschlag
    ende = int(round((a.takte * 4 - 2) * schlag * SR))
    e = einschlag(int(1.5 * SR), rng) * 0.8
    setze(L, e, ende)
    setze(R, e, ende)

    stereo = np.stack([L, R], axis=1)[: int(a.takte * 4 * schlag * SR)]
    stereo = np.tanh(stereo * 1.2)
    stereo /= np.max(np.abs(stereo)) / 0.89
    with wave.open(a.ziel, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype("<i2").tobytes())
    print(f"{a.ziel}: {a.bpm} BPM, {a.takte} Takte, {len(stereo) / SR:.2f} s")


if __name__ == "__main__":
    main()
