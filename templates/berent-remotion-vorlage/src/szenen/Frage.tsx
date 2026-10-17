import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../ci/schriften";
import { farbe, groesse, schrift } from "../ci/tokens";
import { Grund } from "../bausteine/Grund";
import { Kicker } from "../bausteine/Kicker";
import { Satz } from "../bausteine/Satz";

type Props = { kicker: string; frage: string };

/** Szene 3 – Frage (2 Takte): Kicker, Frage mit Akzentwort, Geister-„?“ dahinter. */
export const Frage: React.FC<Props> = ({ kicker, frage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const geist = interpolate(frame, [0, 2 * fps], [1.08, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <Grund ecke="unten-links">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: schrift.titel,
            fontSize: 900,
            color: "transparent",
            WebkitTextStroke: `3px ${farbe.rand}`,
            scale: String(geist),
            lineHeight: 1,
          }}
        >
          ?
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 28,
          padding: "0 220px",
        }}
      >
        <Kicker>{kicker}</Kicker>
        <Satz
          text={frage}
          start={4}
          versatz={3}
          groesseText={groesse.satzGross}
        />
      </AbsoluteFill>
    </Grund>
  );
};
