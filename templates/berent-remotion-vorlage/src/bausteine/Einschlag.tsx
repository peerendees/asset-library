import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { farbe, gluehen, groesse, schrift, sperrung } from "../ci/tokens";

type Props = {
  text: string;
  /** Frame des Einschlags (auf einen Schlag legen). */
  bei: number;
  /** Dauer des Anflugs in Frames. */
  anflug?: number;
  groesseText?: number;
  akzent?: boolean;
  style?: React.CSSProperties;
};

/**
 * Ein Wort schlägt groß und unscharf ein und rastet scharf ein.
 * Akzent-Variante: Kupfer mit starkem Glühen (Gegenstück zum Neon-„DO.“).
 */
export const Einschlag: React.FC<Props> = ({
  text,
  bei,
  anflug = 6,
  groesseText = groesse.held,
  akzent = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [bei - anflug, bei], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const nachglimmen = interpolate(frame, [bei, bei + 20], [1.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontFamily: schrift.titel,
        fontSize: groesseText,
        lineHeight: 0.9,
        letterSpacing: sperrung.titel,
        textTransform: "uppercase",
        color: akzent ? farbe.kupferHell : farbe.champagne,
        textShadow: akzent ? gluehen(farbe.kupfer, nachglimmen) : undefined,
        opacity: p,
        scale: String(interpolate(p, [0, 1], [2.4, 1])),
        filter: `blur(${(1 - p) * 18}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
