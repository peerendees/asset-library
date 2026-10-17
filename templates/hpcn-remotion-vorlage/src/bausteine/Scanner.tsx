import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { farbe, gluehen, schrift } from "../ci/tokens";

type Eintrag = { klar: string; ersatz: string };

type Props = {
  eintraege: Eintrag[];
  start?: number;
  /** Beschriftung unter der Lichtlinie. */
  marke?: string;
  /** Vertikale Lage der Einträge (oben/unten) in px. */
  bereich?: [number, number];
};

/**
 * Lichtlinie in der Bildmitte: Daten laufen von links hindurch und kommen
 * rechts verwandelt heraus (Klartext → Platzhalter). Für Pseudonymisierung,
 * Übersetzung, Umwandlung – jede „Vorher/Nachher durch ein System“-Aussage.
 */
export const Scanner: React.FC<Props> = ({
  eintraege,
  start = 0,
  marke,
  bereich = [380, 860],
}) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const mitte = width / 2;
  const linieEin = interpolate(frame, [start, start + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zeile = (bereich[1] - bereich[0]) / Math.max(1, eintraege.length - 1);
  const flimmern = 0.85 + 0.15 * Math.sin(frame * 1.7);

  const lauf = (i: number) => {
    const t0 = start + 6 + (i % 2) * 7 + Math.floor(i / 2) * 5;
    const dauer = 2.6 * fps;
    return interpolate(frame, [t0, t0 + dauer], [-0.15 * width, 1.0 * width], {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    });
  };

  const ebene = (seite: "links" | "rechts") => (
    <AbsoluteFill
      style={{
        clipPath:
          seite === "links"
            ? `inset(0 ${width - mitte}px 0 0)`
            : `inset(0 0 0 ${mitte}px)`,
      }}
    >
      {eintraege.map((e, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: lauf(i),
            top: bereich[0] + i * zeile,
            translate: "-50% -50%",
            whiteSpace: "nowrap",
            fontFamily: seite === "links" ? schrift.satz : schrift.mono,
            fontWeight: seite === "links" ? 600 : 700,
            fontSize: seite === "links" ? 34 : 30,
            color: seite === "links" ? farbe.text : farbe.kupferHell,
            textShadow:
              seite === "rechts" ? gluehen(farbe.kupfer, 0.35) : undefined,
          }}
        >
          {seite === "links" ? e.klar : e.ersatz}
        </div>
      ))}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      {ebene("links")}
      {ebene("rechts")}
      <div
        style={{
          position: "absolute",
          left: mitte - 2,
          top: bereich[0] - 80,
          height: (bereich[1] - bereich[0] + 160) * linieEin,
          width: 4,
          backgroundColor: farbe.kupferHell,
          boxShadow: gluehen(farbe.kupfer, 1.2 * flimmern),
          borderRadius: 2,
        }}
      />
      {marke ? (
        <div
          style={{
            position: "absolute",
            left: mitte,
            top: bereich[1] + 110,
            translate: "-50% 0",
            opacity: linieEin,
            padding: "10px 26px",
            borderRadius: 999,
            backgroundColor: farbe.kupfer,
            color: farbe.grund,
            fontFamily: schrift.mono,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {marke}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
