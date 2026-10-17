import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { farbe, gluehen, schrift } from "../ci/tokens";

type Schritt = { titel: string; zeile: string };

type Props = {
  schritte: Schritt[];
  start?: number;
  /** Frames, die das Licht von Kasten zu Kasten braucht. */
  schrittDauer?: number;
  y?: number;
};

/**
 * Prozesskette: Kästen auf einer Linie, ein Lichtpunkt läuft durch und
 * lässt jeden Kasten aufleuchten, wenn er ankommt.
 */
export const Ablauf: React.FC<Props> = ({
  schritte,
  start = 0,
  schrittDauer = 15,
  y,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mitteY = y ?? height * 0.56;
  const kasten = { b: 300, h: 150 };
  const luecke = 80;
  const gesamt = schritte.length * kasten.b + (schritte.length - 1) * luecke;
  const x0 = (width - gesamt) / 2;
  const mitteX = (i: number) => x0 + i * (kasten.b + luecke) + kasten.b / 2;

  const lauf = interpolate(
    frame,
    [start, start + (schritte.length - 1) * schrittDauer],
    [0, schritte.length - 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    },
  );
  const lichtX = mitteX(0) + lauf * (kasten.b + luecke);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: mitteX(0),
          top: mitteY - 1,
          width: lichtX - mitteX(0),
          height: 2,
          backgroundColor: farbe.kupfer,
          boxShadow: gluehen(farbe.kupfer, 0.4),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: lichtX - 9,
          top: mitteY - 9,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: farbe.champagne,
          boxShadow: gluehen(farbe.kupfer, 0.8),
          opacity: frame >= start ? 1 : 0,
        }}
      />
      {schritte.map((s, i) => {
        const an = interpolate(lauf, [i - 0.15, i], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const sichtbar = interpolate(
          frame,
          [start - 10 + i * 3, start + i * 3],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: mitteX(i) - kasten.b / 2,
              top: mitteY - kasten.h / 2,
              width: kasten.b,
              height: kasten.h,
              borderRadius: 18,
              backgroundColor: farbe.karte,
              border: `2px solid ${an > 0.5 ? farbe.kupfer : farbe.rand}`,
              boxShadow:
                an > 0 ? `0 0 ${40 * an}px ${farbe.kupfer}55` : undefined,
              opacity: sichtbar,
              translate: `0 ${(1 - sichtbar) * 20}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: schrift.satz,
                fontWeight: 700,
                fontSize: 38,
                color: an > 0.5 ? farbe.champagne : farbe.text,
              }}
            >
              {s.titel}
            </div>
            <div
              style={{
                fontFamily: schrift.mono,
                fontSize: 20,
                color: farbe.gedaempft2,
              }}
            >
              {s.zeile}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
