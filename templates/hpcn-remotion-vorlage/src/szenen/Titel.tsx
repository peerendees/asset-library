import { AbsoluteFill, useVideoConfig } from "remotion";
import "../ci/schriften";
import { farbe, groesse } from "../ci/tokens";
import { schlag } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { Netzwerk } from "../bausteine/Netzwerk";
import { Einschlag } from "../bausteine/Einschlag";
import { Raster } from "../bausteine/Raster";
import { Kicker } from "../bausteine/Kicker";
import { Blitz } from "../bausteine/Blitz";
import { Satz } from "../bausteine/Satz";

type Props = { produkt: string; langname: string; absender: string };

/** Szene 2 – Titel (2 Takte): Raster, Produktname schlägt auf Schlag 2 ein, Langname, Absender. */
export const Titel: React.FC<Props> = ({ produkt, langname, absender }) => {
  const { fps } = useVideoConfig();
  return (
    <Grund>
      <Netzwerk radius={430} deckkraft={0.75} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Raster groesse={150} />
          <Einschlag
            text={produkt}
            bei={schlag(1, fps)}
            groesseText={groesse.held + 20}
            akzent
          />
        </div>
        <Satz
          text={langname}
          start={schlag(3, fps)}
          versatz={3}
          groesseText={groesse.satz - 8}
          gewicht={600}
          farbeText={farbe.champagne}
        />
        <Kicker style={{ marginTop: 18 }} farbeText={farbe.gedaempft2}>
          {absender}
        </Kicker>
      </AbsoluteFill>
      <Blitz art="kupfer" bei={schlag(1, fps)} abklingen={10} staerke={0.75} />
    </Grund>
  );
};
