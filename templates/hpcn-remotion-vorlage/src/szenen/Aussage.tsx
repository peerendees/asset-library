import { AbsoluteFill } from "remotion";
import "../ci/schriften";
import { farbe, groesse, sicher } from "../ci/tokens";
import { Grund } from "../bausteine/Grund";
import { Satz } from "../bausteine/Satz";
import { Raster } from "../bausteine/Raster";

type Props = { zeile1: string; zeile2: string };

/** Szene 7 – Kernaussage auf Markenblau-Vollfläche (1 Takt): Zeile 1 hell (6,42:1), Zeile 2 Glühblau (3,75:1, nur Großschrift). */
export const Aussage: React.FC<Props> = ({ zeile1, zeile2 }) => (
  <Grund flaeche={farbe.markenblau}>
    <AbsoluteFill
      style={{ justifyContent: "center", paddingLeft: sicher.seite + 20 }}
    >
      <Raster groesse={56} gluehen={0} style={{ marginBottom: 28 }} />
      <Satz
        text={zeile1}
        start={0}
        versatz={3}
        ausrichtung="left"
        groesseText={groesse.satzGross + 24}
        gewicht={800}
        farbeText={farbe.champagne}
      />
      <Satz
        text={zeile2}
        start={15}
        versatz={3}
        ausrichtung="left"
        groesseText={groesse.satzGross + 24}
        gewicht={800}
        farbeText={farbe.kupferHell}
      />
    </AbsoluteFill>
  </Grund>
);
