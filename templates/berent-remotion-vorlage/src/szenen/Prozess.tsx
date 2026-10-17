import { AbsoluteFill, useVideoConfig } from "remotion";
import "../ci/schriften";
import { farbe, groesse, sicher } from "../ci/tokens";
import { schlag, takt } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { Satz } from "../bausteine/Satz";
import { Ablauf } from "../bausteine/Ablauf";

type Props = {
  aussage: string;
  schritte: { titel: string; zeile: string }[];
  fazit: string;
};

/** Szene 5 – Ablauf (2 Takte): Aussage oben, Lichtpunkt läuft durch die Kette, Fazit unten. */
export const Prozess: React.FC<Props> = ({ aussage, schritte, fazit }) => {
  const { fps } = useVideoConfig();
  return (
    <Grund>
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: sicher.oben + 80 }}
      >
        <Satz
          text={aussage}
          start={2}
          versatz={3}
          groesseText={groesse.satz + 8}
        />
      </AbsoluteFill>
      <Ablauf
        schritte={schritte}
        start={schlag(2, fps)}
        schrittDauer={schlag(1, fps) + 3}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: sicher.unten + 60,
        }}
      >
        <Satz
          text={fazit}
          start={takt(1, fps) + schlag(2, fps)}
          versatz={2}
          groesseText={groesse.klein - 4}
          gewicht={500}
          farbeText={farbe.gedaempft2}
        />
      </AbsoluteFill>
    </Grund>
  );
};
