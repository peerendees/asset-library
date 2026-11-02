import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { farbe, gluehen, schrift } from "../ci/tokens";
import { Raster } from "./Raster";

export type Feld = {
  bezeichnung: string;
  wert: string;
  /** Frame, ab dem der Wert eingetragen wird. Ohne Angabe: sofort da. */
  ab?: number;
};

type Props = {
  titel: string;
  bereich: string;
  felder: Feld[];
  /** Hinweiszeile unter den Feldern (z. B. aus der Maschinenakte). */
  hinweis?: { text: string; ab: number };
  status: { vorher: string; nachher: string; wechsel: number };
  /** Frame, an dem F10 gedrückt wird. */
  bestaetigt: number;
  breite?: number;
};

export const MASKE = {
  kopf: 96,
  innen: 48,
  zeilenhoehe: 62,
  feldOben: 40,
} as const;

const PUNKTE = 15;

/**
 * Bildschirmmaske im Stil einer IBM-i-Anwendung (5250-Raster, Funktionstasten),
 * übertragen ins HPCN-Farbschema. Werte werden zeichenweise eingetragen und
 * leuchten kurz nach. Stilisiert, keine Kopie einer echten M-HIS-Maske.
 */
export const Maske: React.FC<Props> = ({
  titel,
  bereich,
  felder,
  hinweis,
  status,
  bestaetigt,
  breite = 800,
}) => {
  const frame = useCurrentFrame();
  const druck = interpolate(
    frame,
    [bestaetigt - 6, bestaetigt, bestaetigt + 10],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const nach = frame >= status.wechsel;
  const hinweisP = hinweis
    ? interpolate(frame, [hinweis.ab, hinweis.ab + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const zeile = (
    bezeichnung: string,
    wert: string,
    ab: number | undefined,
    i: number,
    hervor = false,
  ) => {
    const start = ab ?? -10000;
    const offen = Math.max(0, Math.floor((frame - start) * 1.8));
    const text = wert.slice(0, Math.min(wert.length, offen));
    const nachleuchten = interpolate(
      frame,
      [start, start + 6, start + 30],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const leer = frame < start;
    return (
      <div
        key={i}
        style={{
          display: "flex",
          height: MASKE.zeilenhoehe,
          alignItems: "center",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: farbe.gedaempft2 }}>
          {(bezeichnung + " ").padEnd(PUNKTE, ".")}:{" "}
        </span>
        <span
          style={{
            flex: 1,
            color: hervor ? farbe.kupferHell : farbe.champagne,
            borderBottom: `2px solid ${leer ? farbe.rand : "transparent"}`,
            minHeight: 36,
            textShadow:
              nachleuchten > 0
                ? gluehen(farbe.kupfer, nachleuchten)
                : undefined,
          }}
        >
          {text}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        width: breite,
        backgroundColor: "#06152a",
        border: `2px solid ${farbe.rand}`,
        borderRadius: 18,
        overflow: "hidden",
        fontFamily: schrift.mono,
        fontSize: 28,
        boxShadow: `0 40px 80px ${farbe.grund}`,
      }}
    >
      <div
        style={{
          height: MASKE.kopf,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: `0 ${MASKE.innen}px`,
          backgroundColor: farbe.karte,
          borderBottom: `2px solid ${farbe.rand}`,
        }}
      >
        <Raster groesse={34} gluehen={0.6} />
        <span style={{ color: farbe.champagne, fontWeight: 700 }}>M-HIS</span>
        <span style={{ color: farbe.text }}>{titel}</span>
        <span
          style={{
            marginLeft: "auto",
            color: farbe.kupfer,
            fontSize: 20,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          {bereich}
        </span>
      </div>
      <div style={{ padding: `${MASKE.feldOben}px ${MASKE.innen}px 24px` }}>
        {felder.map((f, i) =>
          zeile(f.bezeichnung, f.wert, f.ab, i, f.bezeichnung === "Maschine"),
        )}
        <div
          style={{
            height: 104,
            marginTop: 10,
            opacity: hinweisP,
            translate: `0 ${(1 - hinweisP) * 16}px`,
          }}
        >
          {hinweis ? (
            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
                padding: "16px 20px",
                border: `2px solid ${farbe.kupfer}`,
                borderRadius: 12,
                backgroundColor: `${farbe.markenblau}33`,
                fontFamily: schrift.satz,
                fontSize: 27,
                lineHeight: 1.3,
                color: farbe.champagne,
              }}
            >
              <Raster
                groesse={26}
                aktiv={2}
                gluehen={0.5}
                style={{ marginTop: 4 }}
              />
              <span>{hinweis.text}</span>
            </div>
          ) : null}
        </div>
        <div style={{ marginTop: 18 }}>
          {zeile(
            "Status",
            nach ? status.nachher : status.vorher,
            nach ? status.wechsel : undefined,
            99,
            nach,
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 36,
          padding: `18px ${MASKE.innen}px`,
          borderTop: `2px solid ${farbe.rand}`,
          fontSize: 22,
          color: farbe.gedaempft2,
        }}
      >
        <span>F3=Zurück</span>
        <span>F4=Auswahl</span>
        <span
          style={{
            marginLeft: "auto",
            color: druck > 0 || nach ? farbe.champagne : farbe.kupfer,
            backgroundColor:
              druck > 0
                ? `${farbe.kupfer}${Math.round(druck * 160)
                    .toString(16)
                    .padStart(2, "0")}`
                : "transparent",
            borderRadius: 6,
            padding: "2px 10px",
            margin: "-2px -10px",
            scale: String(1 - druck * 0.06),
            boxShadow: druck > 0 ? gluehen(farbe.kupfer, druck) : undefined,
          }}
        >
          F10=Übernehmen
        </span>
      </div>
    </div>
  );
};
