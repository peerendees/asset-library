import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { farbe, gluehen, schrift } from "../ci/tokens";

export type Markierung = {
  /** Zeile (0-basiert) im Text. */
  zeile: number;
  /** Wortlaut, der in dieser Zeile markiert wird. */
  text: string;
  /** Frame, ab dem die Markierung aufleuchtet. */
  ab: number;
};

type Props = {
  absender: string;
  betreff: string;
  zeilen: string[];
  markierungen?: Markierung[];
  /** Frame, ab dem der Text getippt erscheint. */
  start?: number;
  /** Zeichen pro Frame. */
  tempo?: number;
  breite?: number;
};

export const NACHRICHT = {
  kopf: 150,
  zeilenhoehe: 52,
  innen: 44,
  schrift: 34,
} as const;

/**
 * Eingangs-Mail als Karte. Der Text erscheint zeichenweise, einzelne
 * Wortgruppen leuchten auf, wenn sie ausgelesen werden.
 * Zeilen sind fest umbrochen, damit Leitstrahlen ihre Höhe kennen.
 */
export const Nachricht: React.FC<Props> = ({
  absender,
  betreff,
  zeilen,
  markierungen = [],
  start = 0,
  tempo = 1.6,
  breite = 720,
}) => {
  const frame = useCurrentFrame();
  const sichtbar = Math.max(0, Math.floor((frame - start) * tempo));
  let vorher = 0;

  return (
    <div
      style={{
        width: breite,
        backgroundColor: farbe.karte,
        border: `2px solid ${farbe.rand}`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: `0 40px 80px ${farbe.grund}`,
      }}
    >
      <div
        style={{
          height: NACHRICHT.kopf,
          padding: `30px ${NACHRICHT.innen}px 0`,
          borderBottom: `2px solid ${farbe.rand}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontFamily: schrift.mono,
            fontSize: 22,
            color: farbe.gedaempft2,
            letterSpacing: "0.04em",
          }}
        >
          Von: {absender}
        </div>
        <div
          style={{
            fontFamily: schrift.satz,
            fontWeight: 700,
            fontSize: 38,
            color: farbe.champagne,
            marginTop: 14,
          }}
        >
          {betreff}
        </div>
      </div>
      <div
        style={{
          padding: `28px ${NACHRICHT.innen}px 36px`,
          fontFamily: schrift.satz,
          fontSize: NACHRICHT.schrift,
          lineHeight: `${NACHRICHT.zeilenhoehe}px`,
          color: farbe.text,
        }}
      >
        {zeilen.map((zeile, i) => {
          const offen = Math.max(0, Math.min(zeile.length, sichtbar - vorher));
          vorher += zeile.length;
          const m = markierungen.find((x) => x.zeile === i);
          const inhalt = zeile.slice(0, offen);
          if (!m || !zeile.includes(m.text)) {
            return (
              <div key={i} style={{ height: NACHRICHT.zeilenhoehe }}>
                {inhalt}
              </div>
            );
          }
          const a = zeile.indexOf(m.text);
          const b = a + m.text.length;
          const p = interpolate(frame, [m.ab, m.ab + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={i} style={{ height: NACHRICHT.zeilenhoehe }}>
              {inhalt.slice(0, a)}
              <span
                style={{
                  color: p > 0.5 ? farbe.champagne : undefined,
                  backgroundImage: `linear-gradient(${farbe.markenblau}aa, ${farbe.markenblau}aa)`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${p * 100}% 100%`,
                  borderRadius: 6,
                  padding: "0 4px",
                  margin: "0 -4px",
                  textShadow: p > 0.5 ? gluehen(farbe.kupfer, 0.4) : undefined,
                }}
              >
                {inhalt.slice(a, b)}
              </span>
              {inhalt.slice(b)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
