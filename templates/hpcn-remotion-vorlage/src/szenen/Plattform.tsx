import { AbsoluteFill, useVideoConfig } from "remotion";
import "../ci/schriften";
import { farbe, groesse } from "../ci/tokens";
import { schlag } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { Netzwerk } from "../bausteine/Netzwerk";
import { Kicker } from "../bausteine/Kicker";
import { Einschlag } from "../bausteine/Einschlag";
import { Satz } from "../bausteine/Satz";

type Props = { kicker: string; plattform: string; zeile: string };

/** Szene 6 – Plattform (1 Takt): Kicker, Plattformname schlägt ein, eine Zeile Nutzen. */
export const Plattform: React.FC<Props> = ({ kicker, plattform, zeile }) => {
  const { fps } = useVideoConfig();
  return (
    <Grund ecke="oben-rechts">
      <Netzwerk radius={520} deckkraft={0.3} tempo={0.3} seed="plattform" />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <Kicker>{kicker}</Kicker>
        <Einschlag
          text={plattform}
          bei={4}
          anflug={5}
          groesseText={groesse.titel + 10}
        />
        <Satz
          text={zeile}
          start={schlag(2, fps)}
          versatz={2}
          groesseText={groesse.klein + 4}
          gewicht={600}
          farbeText={farbe.text}
        />
      </AbsoluteFill>
    </Grund>
  );
};
