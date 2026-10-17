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

/** Umriss eines Plus-Kreuzes als Pfad, Mittelpunkt 0/0, Armbreite b. */
const kreuz = (r: number, b: number) => {
  const h = b / 2;
  return `M ${-h} ${-r} H ${h} V ${-h} H ${r} V ${h} H ${h} V ${r} H ${-h} V ${h} H ${-r} V ${-h} H ${-h} Z`;
};

/**
 * Kapitel-Ornament: ineinander liegende, gegenläufig drehende Plus-Umrisse,
 * pulsierend im Takt. BERENT-Gegenstück zu den Neon-Sechsecken der Vorlage.
 * Gold bleibt dem echten Plus-Zeichen vorbehalten (siehe Kapitel-Szene);
 * die Umrisse sind Ornament und daher Kupfer bzw. Randfarbe.
 */
export const PlusRahmen: React.FC<Props> = ({ nummer, start = 0 }) => {
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
    { r: 380, b: 150, dreh: 6, farbeR: farbe.rand, breite: 3, deck: 0.9 },
    {
      r: 270,
      b: 110,
      dreh: -11,
      farbeR: farbe.kupferDunkel,
      breite: 3,
      deck: 0.8,
    },
    { r: 170, b: 70, dreh: 17, farbeR: farbe.kupfer, breite: 4, deck: 1 },
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
              fontSize: 720,
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
          {ringe.map((ring, i) => (
            <path
              key={i}
              d={kreuz(
                ring.r * (0.6 + 0.4 * ein) * (1 + schlag * 0.03 * (i + 1)),
                ring.b,
              )}
              fill="none"
              stroke={ring.farbeR}
              strokeWidth={ring.breite}
              strokeLinejoin="round"
              opacity={ring.deck * ein}
              transform={`rotate(${t * ring.dreh + i * 9})`}
              style={{
                filter:
                  i >= 2
                    ? `drop-shadow(0 0 ${10 + schlag * 14}px ${ring.farbeR}aa)`
                    : undefined,
              }}
            />
          ))}
        </g>
      </svg>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 30% 18% at 50% 50%, ${farbe.grund}e6, transparent 100%)`,
          opacity: ein,
        }}
      />
    </AbsoluteFill>
  );
};
