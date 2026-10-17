import { AbsoluteFill } from "remotion";
import "../ci/schriften";
import { groesse, sicher } from "../ci/tokens";
import { Grund } from "../bausteine/Grund";
import { Satz } from "../bausteine/Satz";
import { Scanner } from "../bausteine/Scanner";

type Props = {
  aussage: string;
  marke: string;
  eintraege: { klar: string; ersatz: string }[];
};

/** Szene 6 – Umwandlung (2 Takte): Daten laufen durch die Lichtlinie und kommen pseudonymisiert heraus. */
export const Datenschutz: React.FC<Props> = ({ aussage, marke, eintraege }) => (
  <Grund>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: sicher.oben }}>
      <Satz
        text={aussage}
        start={0}
        versatz={3}
        groesseText={groesse.satz + 8}
      />
    </AbsoluteFill>
    <Scanner
      eintraege={eintraege}
      start={8}
      marke={marke}
      bereich={[360, 800]}
    />
  </Grund>
);
