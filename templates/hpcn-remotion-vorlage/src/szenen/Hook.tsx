import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../ci/schriften";
import { groesse, sicher } from "../ci/tokens";
import { schlag, takt } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { Wortwolke } from "../bausteine/Wortwolke";
import { Schreibmaschine } from "../bausteine/Schreibmaschine";
import { Satz } from "../bausteine/Satz";
import { Raster } from "../bausteine/Raster";

type Props = { zeile1: string; zeile2: string; woerter: string[] };

/**
 * Szene 1 – Aufhänger (3 Takte). Takt 1: Branchenwörter, Zeile 1 tippt.
 * Takt 2: Akzent-Zeile 2. Takt 3: alles zieht sich ins 2×2-Raster.
 */
export const Hook: React.FC<Props> = ({ zeile1, zeile2, woerter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sogAb = takt(2, fps);
  const textWeg = interpolate(frame, [sogAb, sogAb + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const raster = interpolate(frame, [sogAb + 14, sogAb + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });
  const pulsen = [schlag(10, fps), schlag(11, fps)].reduce(
    (acc, s) =>
      acc +
      interpolate(frame, [s, s + 3, s + 12], [0, 0.3, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    0,
  );

  return (
    <Grund>
      <Wortwolke
        woerter={woerter}
        start={4}
        takt={3}
        sogAb={sogAb}
        sogDauer={14}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingLeft: sicher.seite,
          opacity: textWeg,
        }}
      >
        <Schreibmaschine
          text={zeile1}
          start={6}
          tempo={18}
          groesseText={groesse.satzGross + 8}
          cursorBis={takt(1, fps)}
        />
        <Satz
          text={`*${zeile2}*`}
          start={takt(1, fps)}
          versatz={4}
          ausrichtung="left"
          groesseText={groesse.satzGross + 8}
          style={{ marginTop: 10 }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Raster
          groesse={96}
          gluehen={1 + pulsen * 3}
          style={{ scale: String(raster * (1 + pulsen)), opacity: raster }}
        />
      </AbsoluteFill>
    </Grund>
  );
};
