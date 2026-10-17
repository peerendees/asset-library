import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { farbe, schrift } from "../ci/tokens";
import { puls } from "../ci/takt";

type Props = {
  /** Große Geisterzahl im Hintergrund, z. B. „01“. */
  nummer?: string;
  start?: number;
};

/**
 * Kapitel-Ornament: ineinanderliegende, gegenläufig drehende Quadrate, die im
 * Takt atmen – HPCN-Gegenstück zum Plus-Rahmen der BERENT-Vorlage.
 */
export const Quadratrahmen: React.FC<Props> = ({ nummer, start = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = (frame - start) / fps;
  const ein = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const schlag = puls(frame, fps);
  const ringe = [
    { r: 420, dreh: 4, farbeR: farbe.rand, breite: 3, deck: 0.9 },
    { r: 320, dreh: -7, farbeR: farbe.markenblau, breite: 3, deck: 0.8 },
    { r: 230, dreh: 11, farbeR: farbe.kupfer, breite: 3, deck: 0.9 },
  ];

  return (
    <AbsoluteFill>
      {nummer ? (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              fontFamily: schrift.titel,
              fontWeight: 800,
              fontSize: 640,
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: `3px ${farbe.rand}`,
              opacity: ein * 0.8,
              translate: `${(1 - ein) * 60}px 0`,
            }}
          >
            {nummer}
          </div>
        </AbsoluteFill>
      ) : null}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        <g transform={`translate(${width / 2} ${height / 2})`}>
          {ringe.map((ring, i) => {
            const r =
              ring.r * (0.6 + 0.4 * ein) * (1 + schlag * 0.025 * (i + 1));
            return (
              <rect
                key={i}
                x={-r}
                y={-r}
                width={r * 2}
                height={r * 2}
                rx={r * 0.04}
                fill="none"
                stroke={ring.farbeR}
                strokeWidth={ring.breite}
                opacity={ring.deck * ein}
                transform={`rotate(${t * ring.dreh + i * 12})`}
                style={
                  i === 2
                    ? {
                        filter: `drop-shadow(0 0 ${8 + schlag * 12}px ${ring.farbeR}aa)`,
                      }
                    : undefined
                }
              />
            );
          })}
        </g>
      </svg>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 34% 22% at 50% 50%, ${farbe.grund}e6, transparent 100%)`,
          opacity: ein,
        }}
      />
    </AbsoluteFill>
  );
};
