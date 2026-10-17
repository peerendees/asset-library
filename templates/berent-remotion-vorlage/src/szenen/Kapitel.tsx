import { AbsoluteFill } from "remotion";
import "../ci/schriften";
import { groesse } from "../ci/tokens";
import { Grund } from "../bausteine/Grund";
import { PlusRahmen } from "../bausteine/PlusRahmen";
import { Einschlag } from "../bausteine/Einschlag";
import { Kicker } from "../bausteine/Kicker";
import { PlusZeichen } from "../bausteine/PlusZeichen";

type Props = { nummer: string; titel: string };

/** Szene 4 – Kapitelmarke (1 Takt): drehende Plus-Umrisse, Geisterzahl, Titel. */
export const Kapitel: React.FC<Props> = ({ nummer, titel }) => (
  <Grund ecke="keine">
    <PlusRahmen nummer={nummer} />
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <PlusZeichen groesse={40} gluehen={0.8} />
      <Kicker>Kapitel {nummer}</Kicker>
      <Einschlag text={titel} bei={4} anflug={4} groesseText={groesse.titel} />
    </AbsoluteFill>
  </Grund>
);
