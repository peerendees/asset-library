import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../ci/schriften";
import { farbe, groesse } from "../ci/tokens";
import { schlag } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { Netzwerk } from "../bausteine/Netzwerk";
import { Kicker } from "../bausteine/Kicker";
import { Satz } from "../bausteine/Satz";

type Props = { zeile: string; leistungen: string; adresse: string };

/** Szene 8 – Abspann (2 Takte): Negativ-Logo, Produktzeile, Leistungen, Adresse, Ausblende. */
export const Abspann: React.FC<Props> = ({ zeile, leistungen, adresse }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const logo = interpolate(frame, [2, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rest = interpolate(
    frame,
    [schlag(3, fps), schlag(3, fps) + 12],
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
        <Netzwerk radius={560} deckkraft={0.35} tempo={0.3} seed="abspann" />
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 34,
          }}
        >
          <Img
            src={staticFile("bilder/hpcn-logo-negativ.svg")}
            style={{
              width: 760,
              opacity: logo,
              scale: String(0.94 + 0.06 * logo),
              filter: `blur(${(1 - logo) * 8}px)`,
            }}
          />
          <Satz
            text={zeile}
            start={schlag(2, fps)}
            versatz={2}
            groesseText={groesse.satz - 4}
            gewicht={700}
          />
          <div
            style={{
              opacity: rest,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Kicker farbeText={farbe.kupfer}>{leistungen}</Kicker>
            <Kicker farbeText={farbe.gedaempft2} versalien={false}>
              {adresse}
            </Kicker>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Grund>
  );
};
