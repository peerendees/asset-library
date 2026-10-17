import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { farbe, gluehen, groesse, schrift } from "../ci/tokens";

type Props = {
  /** Text mit *Hervorhebung* in Sternchen – wird Kupfer mit Glühen. */
  text: string;
  /** Frame, ab dem die Wörter einlaufen. */
  start?: number;
  /** Frames zwischen zwei Wörtern. 0 = alles gleichzeitig. */
  versatz?: number;
  groesseText?: number;
  gewicht?: number;
  farbeText?: string;
  ausrichtung?: "left" | "center";
  style?: React.CSSProperties;
};

type Wort = { wort: string; betont: boolean };

const zerlege = (text: string): Wort[] => {
  const teile = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return teile.flatMap((teil) => {
    const betont = teil.startsWith("*") && teil.endsWith("*");
    const rein = betont ? teil.slice(1, -1) : teil;
    return rein
      .split(/(\s+)/)
      .filter((w) => w.length > 0)
      .map((w) => ({ wort: w, betont }));
  });
};

/**
 * Satz mit Wort-für-Wort-Einlauf und Hervorhebung.
 * Betonte Wörter: Kupfer + Glühen.
 */
export const Satz: React.FC<Props> = ({
  text,
  start = 0,
  versatz = 3,
  groesseText = groesse.satzGross,
  gewicht = 700,
  farbeText = farbe.champagne,
  ausrichtung = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let index = 0;

  return (
    <div
      style={{
        fontFamily: schrift.satz,
        fontWeight: gewicht,
        fontSize: groesseText,
        lineHeight: 1.12,
        letterSpacing: "-0.01em",
        color: farbeText,
        textAlign: ausrichtung,
        textWrap: "balance",
        ...style,
      }}
    >
      {zerlege(text).map((w, i) => {
        if (/^\s+$/.test(w.wort)) return <span key={i}>{w.wort}</span>;
        const t0 = start + index++ * versatz;
        const p = interpolate(frame, [t0, t0 + 0.35 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              translate: `0 ${(1 - p) * 0.35}em`,
              filter: `blur(${(1 - p) * 8}px)`,
              color: w.betont ? farbe.kupferHell : undefined,
              textShadow: w.betont ? gluehen(farbe.kupfer, 0.8) : undefined,
            }}
          >
            {w.wort}
          </span>
        );
      })}
    </div>
  );
};
