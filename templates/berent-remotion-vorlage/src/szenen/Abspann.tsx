import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../ci/schriften";
import { farbe } from "../ci/tokens";
import { Satz } from "../bausteine/Satz";
import { schlag } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { PlusNetz } from "../bausteine/PlusNetz";
import { PlusZeichen } from "../bausteine/PlusZeichen";
import { Einschlag } from "../bausteine/Einschlag";
import { Kicker } from "../bausteine/Kicker";

type Props = { claim: string; adresse: string };

/** Szene 8 – Abspann (2 Takte): Wortmarke, Claim mit Gold-Plus, Adresse, Ausblende. */
export const Abspann: React.FC<Props> = ({ claim, adresse }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const claimEin = interpolate(
    frame,
    [schlag(2, fps), schlag(2, fps) + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const aus = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <Grund>
      <AbsoluteFill style={{ opacity: aus }}>
        <PlusNetz radius={520} deckkraft={0.55} tempo={0.4} />
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <PlusZeichen groesse={96} />
            <Einschlag text="BERENT.AI" bei={4} groesseText={200} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: claimEin,
              translate: `0 ${(1 - claimEin) * 16}px`,
            }}
          >
            <Satz
              text={claim}
              start={schlag(2, fps)}
              versatz={0}
              groesseText={60}
              gewicht={600}
              farbeText={farbe.text}
            />
            <PlusZeichen groesse={36} gluehen={0.6} />
          </div>
          <Kicker
            style={{ opacity: claimEin, marginTop: 10 }}
            farbeText={farbe.gedaempft2}
            versalien={false}
          >
            {adresse}
          </Kicker>
        </AbsoluteFill>
      </AbsoluteFill>
    </Grund>
  );
};
