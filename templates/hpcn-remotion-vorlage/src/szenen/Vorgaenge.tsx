import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../ci/schriften";
import { farbe, gluehen, schrift } from "../ci/tokens";
import { schlag, takt } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { Raster } from "../bausteine/Raster";
import { Maske } from "../bausteine/Maske";
import {
  Fussnote,
  HINWEIS,
  LAGE,
  MASKE_FELDER,
  STATUS,
  Zeile,
} from "./Anfrage";

export const RASTER = {
  breite: 600,
  hoehe: 280,
  luecke: 28,
  links: (1920 - (2 * 600 + 28)) / 2,
  oben: 300,
} as const;

export const kachelLage = (i: number) => ({
  x: RASTER.links + (i % 2) * (RASTER.breite + RASTER.luecke),
  y: RASTER.oben + Math.floor(i / 2) * (RASTER.hoehe + RASTER.luecke),
});

/** Die vier Vorgänge aus der Website, angeordnet wie das 2×2 im Logo. */
export const VORGAENGE = [
  {
    name: "Vermietung",
    von: "Anfrage aus der Mail",
    zu: "Mietvertrag vorbereitet",
  },
  { name: "Auftrag", von: "Bestellung als PDF", zu: "Auftrag vorbereitet" },
  {
    name: "Maschinenakte",
    von: "Stunden und Wartung",
    zu: "Hinweis zur rechten Zeit",
  },
  {
    name: "Disposition",
    von: "Gerät, Termin, Fahrt",
    zu: "Vorschlag zum Prüfen",
  },
] as const;

export const Kachel: React.FC<{ i: number; inhalt?: number }> = ({
  i,
  inhalt = 1,
}) => {
  const v = VORGAENGE[i];
  const aktiv = i === 0;
  return (
    <div
      style={{
        width: RASTER.breite,
        height: RASTER.hoehe,
        boxSizing: "border-box",
        padding: "34px 40px",
        borderRadius: 18,
        backgroundColor: aktiv ? `${farbe.markenblau}40` : farbe.karte,
        border: `2px solid ${aktiv ? farbe.kupfer : farbe.rand}`,
        boxShadow: aktiv ? `0 0 40px ${farbe.kupfer}33` : undefined,
      }}
    >
      <div style={{ opacity: inhalt }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Raster groesse={30} aktiv={i as 0 | 1 | 2 | 3} gluehen={0.5} />
          <span
            style={{
              fontFamily: schrift.mono,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: aktiv ? farbe.kupferHell : farbe.kupfer,
            }}
          >
            {v.name}
          </span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: schrift.satz,
            fontSize: 38,
            lineHeight: 1.3,
            color: farbe.text,
          }}
        >
          {v.von}
        </div>
        <div
          style={{
            fontFamily: schrift.satz,
            fontWeight: 700,
            fontSize: 38,
            lineHeight: 1.3,
            color: farbe.champagne,
            textShadow: aktiv ? gluehen(farbe.kupfer, 0.35) : undefined,
          }}
        >
          → {v.zu}
        </div>
      </div>
    </div>
  );
};

/**
 * Vom einen Vorgang auf alle: Die Maske zieht sich in die erste Kachel zurück,
 * drei weitere Vorgänge kommen auf den Schlag dazu. Das Raster entspricht dem
 * 2×2 im Logo – daraus entsteht im Schluss das Signet.
 */
export const Vorgaenge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flug = interpolate(frame, [4, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const maskeAus = interpolate(frame, [26, 42], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const start = {
    x: LAGE.maske.links + LAGE.maske.breite / 2,
    y: LAGE.maske.oben + 365,
  };
  const ziel = {
    x: kachelLage(0).x + RASTER.breite / 2,
    y: kachelLage(0).y + RASTER.hoehe / 2,
  };
  const ein = [28, schlag(3, fps), schlag(4, fps), schlag(5, fps)];

  return (
    <Grund ecke="unten-rechts">
      {VORGAENGE.map((_, i) => {
        const p = interpolate(frame, [ein[i], ein[i] + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const { x, y } = kachelLage(i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: p,
              scale: String(0.94 + 0.06 * p),
            }}
          >
            <Kachel i={i} />
          </div>
        );
      })}
      {maskeAus > 0 ? (
        <div
          style={{
            position: "absolute",
            left: LAGE.maske.links,
            top: LAGE.maske.oben,
            opacity: maskeAus,
            transformOrigin: `${LAGE.maske.breite / 2}px 365px`,
            translate: `${(ziel.x - start.x) * flug}px ${(ziel.y - start.y) * flug}px`,
            scale: String(1 - 0.4 * flug),
          }}
        >
          <Maske
            titel="Mietvertrag erfassen"
            bereich="Vermietung"
            breite={LAGE.maske.breite}
            felder={MASKE_FELDER(() => -100)}
            hinweis={{ text: HINWEIS, ab: -100 }}
            status={{ ...STATUS, wechsel: -100 }}
            bestaetigt={-100}
          />
        </div>
      ) : null}
      <Sequence from={10} durationInFrames={takt(2, fps) - 10} layout="none">
        <Zeile
          text="Dasselbe Prinzip, *an jedem Vorgang.*"
          bis={takt(2, fps) - 10}
        />
      </Sequence>
      <Sequence from={takt(2, fps)} layout="none">
        <Zeile
          text="KI setzt an den Vorgängen an, *die in M-HIS bereits liegen.*"
          bis={9999}
          groesse={52}
        />
      </Sequence>
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [40, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Fussnote />
      </AbsoluteFill>
    </Grund>
  );
};
