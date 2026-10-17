import { AbsoluteFill } from "remotion";
import "../ci/schriften";
import { farbe, groesse, sicher } from "../ci/tokens";
import { Grund } from "../bausteine/Grund";
import { Satz } from "../bausteine/Satz";

type Props = { zeile1: string; zeile2: string };

/**
 * Szene 7 – Kernaussage auf Kupfer-Vollfläche (1 Takt). Dunkle Schrift auf
 * Kupfer (#090806 auf #B5742A = 5,24:1). Höchstens einmal pro Video.
 */
export const Aussage: React.FC<Props> = ({ zeile1, zeile2 }) => (
  <Grund flaeche={farbe.kupfer}>
    <AbsoluteFill
      style={{ justifyContent: "center", paddingLeft: sicher.seite + 20 }}
    >
      <Satz
        text={zeile1}
        start={0}
        versatz={3}
        ausrichtung="left"
        groesseText={groesse.satzGross + 16}
        farbeText={farbe.grund}
      />
      <Satz
        text={zeile2}
        start={14}
        versatz={3}
        ausrichtung="left"
        groesseText={groesse.satzGross + 16}
        farbeText={farbe.champagne}
      />
    </AbsoluteFill>
  </Grund>
);
