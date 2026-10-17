import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { farbe, gluehen, groesse, schrift } from "../ci/tokens";

type Props = {
  text: string;
  start?: number;
  /** Zeichen pro Sekunde. */
  tempo?: number;
  groesseText?: number;
  /** Cursor ausblenden ab Frame (z. B. wenn die zweite Zeile kommt). */
  cursorBis?: number;
  style?: React.CSSProperties;
};

/** Tipp-Effekt mit Akzent-Cursor, der im Viertel blinkt. */
export const Schreibmaschine: React.FC<Props> = ({
  text,
  start = 0,
  tempo = 18,
  groesseText = groesse.satzGross,
  cursorBis = Infinity,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zeichen = Math.max(0, Math.floor(((frame - start) / fps) * tempo));
  const fertig = zeichen >= text.length;
  const blink = fertig ? Math.floor(frame / (fps / 4)) % 2 === 0 : true;
  const cursor = frame >= start && frame < cursorBis && blink;

  return (
    <div
      style={{
        fontFamily: schrift.satz,
        fontWeight: 700,
        fontSize: groesseText,
        color: farbe.champagne,
        letterSpacing: "-0.01em",
        whiteSpace: "pre",
        ...style,
      }}
    >
      {text.slice(0, zeichen)}
      <span
        style={{
          display: "inline-block",
          width: "0.08em",
          height: "0.9em",
          marginLeft: "0.06em",
          verticalAlign: "-0.08em",
          backgroundColor: farbe.kupferHell,
          boxShadow: gluehen(farbe.kupfer, 0.6),
          opacity: cursor ? 1 : 0,
        }}
      />
    </div>
  );
};
