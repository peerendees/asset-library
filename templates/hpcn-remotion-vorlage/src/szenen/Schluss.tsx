import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../ci/schriften";
import { farbe, gluehen, schrift } from "../ci/tokens";
import { schlag } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { Netzwerk } from "../bausteine/Netzwerk";
import { Satz } from "../bausteine/Satz";
import { Kachel, kachelLage, RASTER } from "./Vorgaenge";

const LOGO = { links: 580, oben: 290, breite: 760 } as const;
/** Lage der vier Signet-Felder im Logo (px relativ zur Logo-Ecke, bei 760 px Breite). */
const SIGNET = { x: [12, 143], y: [5, 131], b: 108, h: 120 } as const;

/**
 * Die vier Vorgangs-Kacheln ziehen sich zum 2×2-Signet zusammen, das Logo
 * entsteht daraus. Darunter die Zeile der Website und die Adresse.
 */
export const Schluss: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const opt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const inhalt = interpolate(frame, [0, 10], [1, 0], opt);
  const zug = interpolate(frame, [4, 34], [0, 1], {
    ...opt,
    easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  const kachelAus = interpolate(frame, [30, 44], [1, 0], opt);
  const logo = interpolate(frame, [28, 44], [0, 1], opt);
  const adresse = interpolate(
    frame,
    [schlag(5, fps), schlag(5, fps) + 12],
    [0, 1],
    opt,
  );
  const aus = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 1],
    [1, 0],
    opt,
  );

  return (
    <Grund ecke="keine">
      <AbsoluteFill style={{ opacity: aus }}>
        <AbsoluteFill style={{ opacity: logo }}>
          <Netzwerk radius={560} deckkraft={0.3} tempo={0.3} seed="schluss" />
        </AbsoluteFill>
        {[0, 1, 2, 3].map((i) => {
          const von = kachelLage(i);
          const nachX = LOGO.links + SIGNET.x[i % 2];
          const nachY = LOGO.oben + SIGNET.y[Math.floor(i / 2)];
          const sx = 1 + (SIGNET.b / RASTER.breite - 1) * zug;
          const sy = 1 + (SIGNET.h / RASTER.hoehe - 1) * zug;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: von.x + (nachX - von.x) * zug,
                top: von.y + (nachY - von.y) * zug,
                transformOrigin: "0 0",
                scale: `${sx} ${sy}`,
                opacity: kachelAus,
              }}
            >
              <Kachel i={i} inhalt={inhalt} />
            </div>
          );
        })}
        <Img
          src={staticFile("bilder/hpcn-logo-negativ.svg")}
          style={{
            position: "absolute",
            left: LOGO.links,
            top: LOGO.oben,
            width: LOGO.breite,
            opacity: logo,
            filter: `blur(${(1 - logo) * 6}px) drop-shadow(0 0 ${30 * logo}px ${farbe.markenblau}88)`,
          }}
        />
        <AbsoluteFill style={{ top: 640, alignItems: "center", gap: 10 }}>
          <Satz
            text="Ihr ERP ist bewährt."
            start={schlag(2, fps)}
            versatz={2}
            groesseText={60}
            gewicht={700}
          />
          <Satz
            text="*Jetzt wird es klug.*"
            start={schlag(3, fps)}
            versatz={3}
            groesseText={60}
            gewicht={800}
          />
          <div
            style={{
              marginTop: 34,
              opacity: adresse,
              fontFamily: schrift.mono,
              fontSize: 26,
              letterSpacing: "0.12em",
              color: farbe.gedaempft2,
              textShadow: gluehen(farbe.grund, 0.2),
            }}
          >
            www.h-pcn.de
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Grund>
  );
};
