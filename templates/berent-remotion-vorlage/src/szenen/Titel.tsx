import { AbsoluteFill, useVideoConfig } from "remotion";
import "../ci/schriften";
import { farbe, groesse } from "../ci/tokens";
import { schlag, takt } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { PlusNetz } from "../bausteine/PlusNetz";
import { Einschlag } from "../bausteine/Einschlag";
import { PlusZeichen } from "../bausteine/PlusZeichen";
import { Kicker } from "../bausteine/Kicker";
import { Blitz } from "../bausteine/Blitz";
import { Satz } from "../bausteine/Satz";

type Props = { wort1: string; wort2: string; unterzeile: string };

/**
 * Szene 2 – Titel (2 Takte). Schlag 1: Wort 1 schlägt ein. Schlag 2: Gold-Plus.
 * Schlag 3: Kupfer-Farbblitz, Wort 2 schlägt als Akzent ein. Takt 2: Unterzeile.
 */
export const Titel: React.FC<Props> = ({ wort1, wort2, unterzeile }) => {
  const { fps } = useVideoConfig();
  return (
    <Grund>
      <PlusNetz radius={420} deckkraft={0.85} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 46 }}>
          <Einschlag
            text={wort1}
            bei={schlag(0, fps) + 4}
            groesseText={groesse.titel + 10}
          />
          <PlusZeichen groesse={84} style={{ opacity: 1 }} />
          <Einschlag
            text={wort2}
            bei={schlag(2, fps)}
            groesseText={groesse.titel + 10}
            akzent
          />
        </div>
        <Satz
          text={unterzeile}
          start={takt(1, fps)}
          versatz={3}
          groesseText={groesse.klein}
          gewicht={600}
          farbeText={farbe.text}
        />
        <Kicker style={{ marginTop: 26 }} farbeText={farbe.gedaempft2}>
          BERENT.AI
        </Kicker>
      </AbsoluteFill>
      <Blitz art="kupfer" bei={schlag(2, fps)} abklingen={10} staerke={0.8} />
    </Grund>
  );
};
