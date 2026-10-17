import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { farbe, schrift } from "../ci/tokens";

type Props = {
  woerter: string[];
  start?: number;
  /** Frames zwischen dem Auftauchen zweier Wörter. */
  takt?: number;
  /** Ab diesem Frame wird alles in die Mitte gesogen. */
  sogAb?: number;
  sogDauer?: number;
  seed?: string;
};

/**
 * Schwarm aus Schlagwörtern in verschiedenen Tiefen (Größe, Unschärfe,
 * Deckkraft). Steht für das Rauschen rund um ein Thema; mit `sogAb`
 * zieht sich alles in einen Punkt zusammen – Übergabe an das Markenzeichen.
 */
export const Wortwolke: React.FC<Props> = ({
  woerter,
  start = 0,
  takt = 4,
  sogAb,
  sogDauer = 20,
  seed = "wolke",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const sog =
    sogAb === undefined
      ? 0
      : interpolate(frame, [sogAb, sogAb + sogDauer], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        });

  return (
    <AbsoluteFill>
      {woerter.map((wort, i) => {
        const tiefe = random(`${seed}-z-${i}`); // 0 = hinten, 1 = vorn
        const winkel = random(`${seed}-w-${i}`) * Math.PI * 2;
        const abstand = 0.16 + random(`${seed}-a-${i}`) * 0.26;
        const x0 = Math.min(
          width - 260,
          Math.max(260, width * 0.55 + Math.cos(winkel) * width * abstand),
        );
        const y0 = Math.min(
          height - 120,
          Math.max(120, height / 2 + Math.sin(winkel) * height * abstand * 1.2),
        );
        const drift =
          (frame / fps) *
          (6 + tiefe * 14) *
          (random(`${seed}-d-${i}`) > 0.5 ? 1 : -1);
        const t0 = start + i * takt;
        const ein = interpolate(frame, [t0, t0 + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = x0 + drift + (width / 2 - x0 - drift) * sog;
        const y = y0 + (height / 2 - y0) * sog;
        const betont = i % 5 === 2;
        return (
          <div
            key={wort + i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              fontFamily: schrift.satz,
              fontWeight: tiefe > 0.6 ? 700 : 500,
              fontSize: 26 + tiefe * 34,
              color: betont
                ? farbe.kupfer
                : tiefe > 0.6
                  ? farbe.text
                  : farbe.gedaempft,
              opacity: ein * (0.3 + tiefe * 0.6) * (1 - sog * sog),
              filter: `blur(${(1 - tiefe) * 2.5 + sog * 6}px)`,
              scale: String(1 - sog * 0.7),
              whiteSpace: "nowrap",
            }}
          >
            {wort}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
