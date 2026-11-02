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
import { farbe, schrift } from "../ci/tokens";
import { schlag, takt } from "../ci/takt";
import { Grund } from "../bausteine/Grund";
import { Satz } from "../bausteine/Satz";
import { Nachricht, NACHRICHT } from "../bausteine/Nachricht";
import { Maske, MASKE } from "../bausteine/Maske";
import { Leitstrahl } from "../bausteine/Leitstrahl";

/** Lage der Mail-Karte und der Maske (Endstellung). */
export const LAGE = {
  mail: { links: 140, oben: 270, breite: 720 },
  maske: { links: 980, oben: 230, breite: 800 },
} as const;

export const MASKE_FELDER = (ab: (i: number) => number | undefined) => [
  { bezeichnung: "Kunde", wert: "Beispielbau GmbH", ab: ab(0) },
  { bezeichnung: "Gerät", wert: "Minibagger 2,5 t", ab: ab(1) },
  { bezeichnung: "Zeitraum", wert: "Mo bis Fr, 5 Tage", ab: ab(2) },
  { bezeichnung: "Lieferort", wert: "Baustelle Reutlingen", ab: ab(3) },
  { bezeichnung: "Maschine", wert: "MB 25-07 · verfügbar", ab: ab(4) },
];

export const HINWEIS =
  "Maschinenakte: Wartung in 40 Bh fällig. Vor Auslieferung einplanen?";
export const STATUS = {
  vorher: "Vorschlag, wartet auf Sie",
  nachher: "Mietvertrag angelegt",
};

const mailZeile = (i: number) =>
  LAGE.mail.oben +
  NACHRICHT.kopf +
  2 +
  28 +
  i * NACHRICHT.zeilenhoehe +
  NACHRICHT.zeilenhoehe / 2;
const maskeZeile = (i: number) =>
  LAGE.maske.oben +
  MASKE.kopf +
  2 +
  MASKE.feldOben +
  i * MASKE.zeilenhoehe +
  MASKE.zeilenhoehe / 2;

/** Überzeile oben, läuft ein und blendet zum gesetzten Frame aus. */
export const Zeile: React.FC<{
  text: string;
  bis: number;
  groesse?: number;
}> = ({ text, bis, groesse = 56 }) => {
  const frame = useCurrentFrame();
  const aus = interpolate(frame, [bis - 8, bis], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ top: 84, height: 130, opacity: aus, alignItems: "center" }}
    >
      <Satz text={text} versatz={2} groesseText={groesse} gewicht={700} />
    </AbsoluteFill>
  );
};

export const Fussnote: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 140,
      bottom: 56,
      fontFamily: schrift.mono,
      fontSize: 18,
      letterSpacing: "0.12em",
      color: farbe.gedaempft,
    }}
  >
    Darstellung beispielhaft
  </div>
);

/**
 * Vom Posteingang in die Maske: Eine Mietanfrage kommt per Mail, KI liest die
 * Angaben heraus und trägt sie in M-HIS ein, die Maschinenakte meldet einen
 * Hinweis, der Mensch bestätigt mit F10. Danach die Kernaussage.
 */
export const Anfrage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = (n: number) => takt(n, fps);

  const wechsel = interpolate(frame, [T(2), T(2) + 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const mailEin = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const maskeEin = interpolate(frame, [T(2) + 20, T(2) + 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rueck = interpolate(frame, [T(7) - 14, T(7)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dimm =
    interpolate(frame, [T(6) - 4, T(6) + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    (1 - rueck);

  // Takt 2–3: Felder füllen sich; je Feld ein Leitstrahl aus der Mail.
  const strahl = [
    { von: [LAGE.mail.links + LAGE.mail.breite, LAGE.mail.oben + 46], feld: 0 },
    { von: [LAGE.mail.links + LAGE.mail.breite, mailZeile(2)], feld: 1 },
    { von: [LAGE.mail.links + LAGE.mail.breite, mailZeile(1)], feld: 2 },
    { von: [LAGE.mail.links + LAGE.mail.breite, mailZeile(3)], feld: 3 },
  ].map((s, i) => ({ ...s, ab: T(2) + 52 + i * 21 }));
  const feldAb = (i: number) => (i < 4 ? strahl[i].ab + 12 : T(4));

  const bestaetigt = schlag(5 * 4, fps);
  const mailX = (1 - wechsel) * (960 - LAGE.mail.breite / 2 - LAGE.mail.links);

  return (
    <Grund ecke="unten-links">
      <AbsoluteFill
        style={{
          filter: `blur(${dimm * 6}px)`,
          opacity: 1 - dimm * 0.55,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: LAGE.mail.links,
            top: LAGE.mail.oben,
            translate: `${mailX}px ${(1 - mailEin) * 40}px`,
            opacity: mailEin * (1 - rueck),
          }}
        >
          <Nachricht
            absender="bauleitung@beispielbau.de"
            betreff="Minibagger ab Montag"
            start={22}
            breite={LAGE.mail.breite}
            zeilen={[
              "Guten Morgen,",
              "wir brauchen ab Montag für fünf Tage",
              "einen Minibagger 2,5 t auf unserer",
              "Baustelle in Reutlingen. Geht das?",
              "",
              "Gruß aus der Bauleitung",
            ]}
            markierungen={[
              { zeile: 2, text: "Minibagger 2,5 t", ab: strahl[1].ab - 6 },
              {
                zeile: 1,
                text: "ab Montag für fünf Tage",
                ab: strahl[2].ab - 6,
              },
              { zeile: 3, text: "Reutlingen", ab: strahl[3].ab - 6 },
            ]}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: LAGE.maske.links,
            top: LAGE.maske.oben,
            opacity: maskeEin,
            translate: `${(1 - maskeEin) * 120}px 0`,
          }}
        >
          <Maske
            titel="Mietvertrag erfassen"
            bereich="Vermietung"
            breite={LAGE.maske.breite}
            felder={MASKE_FELDER(feldAb)}
            hinweis={{ text: HINWEIS, ab: T(4) + 18 }}
            status={{ ...STATUS, wechsel: bestaetigt }}
            bestaetigt={bestaetigt}
          />
        </div>
        {strahl.map((s) => (
          <Leitstrahl
            key={s.feld}
            von={s.von as [number, number]}
            nach={[LAGE.maske.links + 4, maskeZeile(s.feld)]}
            ab={s.ab}
          />
        ))}
        <Sequence from={6} durationInFrames={T(2) - 6} layout="none">
          <Zeile text="Montag, 7:42 Uhr. *Eine Mietanfrage.*" bis={T(2) - 6} />
        </Sequence>
        <Sequence
          from={T(2) + 14}
          durationInFrames={T(4) - T(2) - 14}
          layout="none"
        >
          <Zeile
            text="KI liest mit und *bereitet den Vorgang in M-HIS vor.*"
            bis={T(4) - T(2) - 14}
          />
        </Sequence>
        <Sequence from={T(4)} durationInFrames={T(5) - T(4)} layout="none">
          <Zeile text="Mit Blick in die *Maschinenakte.*" bis={T(5) - T(4)} />
        </Sequence>
        <Sequence
          from={T(5) + 2}
          durationInFrames={T(6) - T(5) - 2}
          layout="none"
        >
          <Zeile
            text="Bestätigen tun *Sie.*"
            bis={T(6) - T(5) - 2}
            groesse={64}
          />
        </Sequence>
        <Fussnote />
      </AbsoluteFill>
      <Sequence from={T(6) + 2} layout="none">
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: 1 - rueck,
          }}
        >
          <Satz
            text="M-HIS bleibt *das führende System.*"
            versatz={3}
            groesseText={104}
            gewicht={800}
            style={{ maxWidth: 1400, letterSpacing: "-0.02em" }}
          />
        </AbsoluteFill>
      </Sequence>
    </Grund>
  );
};
