import type React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import "./ci/schriften";
import { takt } from "./ci/takt";
import { Blitz } from "./bausteine/Blitz";
import { Anfrage } from "./szenen/Anfrage";
import { Vorgaenge } from "./szenen/Vorgaenge";
import { Schluss } from "./szenen/Schluss";

type Props = { musik: string; lautstaerke: number };

/**
 * M-HIS-Teaser, 30 s, 96 BPM (12 Takte à 2,5 s). Erzählform: ein Vorgang am
 * Arbeitsplatz, dann dasselbe Prinzip auf alle Vorgänge, daraus das Signet.
 *
 * Takt 0–1   Mietanfrage kommt per Mail
 * Takt 2–3   KI liest die Angaben heraus, die M-HIS-Maske füllt sich
 * Takt 4     Maschinenakte meldet einen Hinweis (Musik ohne Kick)
 * Takt 5     F10: der Mensch bestätigt (Einschlag, Lichtblitz)
 * Takt 6     „M-HIS bleibt das führende System.“
 * Takt 7–9   Maske wird zur Kachel, vier Vorgänge im 2×2
 * Takt 10–11 Kacheln werden zum Signet, Logo, Website-Zeile
 */
export const MhisTeaser: React.FC<Props> = ({ musik, lautstaerke }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const T = (n: number) => takt(n, fps);
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile(musik)}
        volume={(f) =>
          interpolate(
            f,
            [0, 8, durationInFrames - 20, durationInFrames],
            [0, lautstaerke, lautstaerke, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )
        }
      />
      <Sequence durationInFrames={T(7)} name="Anfrage">
        <Anfrage />
      </Sequence>
      <Sequence from={T(7)} durationInFrames={T(10) - T(7)} name="Vorgänge">
        <Vorgaenge />
      </Sequence>
      <Sequence from={T(10)} name="Schluss">
        <Schluss />
      </Sequence>
      <Blitz art="licht" bei={T(5)} abklingen={14} staerke={0.55} />
      <Blitz art="kupfer" bei={T(10)} abklingen={16} staerke={0.5} />
    </AbsoluteFill>
  );
};
