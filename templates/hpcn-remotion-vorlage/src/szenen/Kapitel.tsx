import { AbsoluteFill } from "remotion";
import "../ci/schriften";
import { groesse } from "../ci/tokens";
import { Grund } from "../bausteine/Grund";
import { Quadratrahmen } from "../bausteine/Quadratrahmen";
import { Einschlag } from "../bausteine/Einschlag";
import { Kicker } from "../bausteine/Kicker";
import { Raster } from "../bausteine/Raster";

type Props = { nummer: string; titel: string };

/** Szene 4 – Kapitelmarke (1 Takt): drehende Quadrate, Geisterzahl, Raster, Kicker, Titel. */
export const Kapitel: React.FC<Props> = ({ nummer, titel }) => (
  <Grund ecke="keine">
    <Quadratrahmen nummer={nummer} />
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <Raster groesse={44} gluehen={0.8} />
      <Kicker>Kapitel {nummer}</Kicker>
      <Einschlag text={titel} bei={4} anflug={4} groesseText={groesse.titel} />
    </AbsoluteFill>
  </Grund>
);
