import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import "./ci/schriften";
import { farbe } from "./ci/tokens";
import { takt, takte } from "./ci/takt";
import { Blitz } from "./bausteine/Blitz";
import { Hook } from "./szenen/Hook";
import { Titel } from "./szenen/Titel";
import { Frage } from "./szenen/Frage";
import { Kapitel } from "./szenen/Kapitel";
import { Prozess } from "./szenen/Prozess";
import { Plattform } from "./szenen/Plattform";
import { Aussage } from "./szenen/Aussage";
import { Abspann } from "./szenen/Abspann";

type Props = { musik: string; lautstaerke: number };

/**
 * M-HIS-Teaser im HPCN-CI, 30 s, 16:9, 112 BPM = 14 Takte à ≈ 2,14 s.
 * Harte Schnitte auf dem Downbeat, Blitze nur an Wendepunkten.
 *
 *  Takt  0–2  Hook       Branchenwörter, Tippzeile, Sog ins Raster
 *  Takt  3–4  Titel      M-HIS schlägt ein, Farbblitz, Netzwerk
 *  Takt  5–6  Frage      Kicker + Frage mit Akzentwort
 *  Takt  7    Kapitel    Quadratrahmen, Geisterzahl
 *  Takt  8–9  Prozess    Lichtpunkt durch die Kette
 *  Takt 10    Plattform  IBM Power i
 *  Takt 11    Aussage    Markenblau-Vollfläche
 *  Takt 12–13 Abspann    Logo, Leistungen, Adresse, Ausblende
 *
 * Inhaltliche Grundlage (belegt): M-HIS = Modulares Handels-Informations-System
 * der HPCN, auf IBM Power i, für Baumaschinenhandel, Werkstätten, technischen
 * Handel und Vermietung; Auftragsabwicklung und Kostenauswertung.
 * Bewusst nicht behauptet: KI-Funktionen in M-HIS, aktuelle Release-Stände.
 */
export const MhisTeaser: React.FC<Props> = ({ musik, lautstaerke }) => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: farbe.grund }}>
      <Sequence
        name="Hook"
        from={takt(0, fps)}
        durationInFrames={takte(3, fps)}
      >
        <Hook
          zeile1="Vermieten. Reparieren. Verkaufen."
          zeile2="Ein System."
          woerter={[
            "Mietvertrag",
            "Werkstattauftrag",
            "Ersatzteil",
            "Kostenstelle",
            "Maschinenakte",
            "Rücknahme",
            "Inventur",
            "Wartung",
            "Angebot",
            "Lieferschein",
            "Disposition",
            "Stundenzettel",
            "Excel-Liste",
            "Rechnung",
          ]}
        />
      </Sequence>
      <Sequence
        name="Titel"
        from={takt(3, fps)}
        durationInFrames={takte(2, fps)}
      >
        <Titel
          produkt="M-HIS"
          langname="Modulares Handels-Informations-System"
          absender="von HPCN"
        />
      </Sequence>
      <Sequence
        name="Frage"
        from={takt(5, fps)}
        durationInFrames={takte(2, fps)}
      >
        <Frage
          kicker="Frage 01"
          frage="Was hat die Maschine *wirklich gekostet?*"
        />
      </Sequence>
      <Sequence
        name="Kapitel"
        from={takt(7, fps)}
        durationInFrames={takte(1, fps)}
      >
        <Kapitel nummer="01" titel="Durchgängig." />
      </Sequence>
      <Sequence
        name="Prozess"
        from={takt(8, fps)}
        durationInFrames={takte(2, fps)}
      >
        <Prozess
          aussage="Vom Auftrag *bis zur Auswertung.*"
          schritte={[
            { titel: "Anfrage", zeile: "Kunde meldet Bedarf" },
            { titel: "Mietvertrag", zeile: "Maschine disponiert" },
            { titel: "Werkstatt", zeile: "Wartung erfasst" },
            { titel: "Auswertung", zeile: "Kosten je Maschine" },
          ]}
          fazit="Büro, Werkstatt und Vermietung in einem System."
        />
      </Sequence>
      <Sequence
        name="Plattform"
        from={takt(10, fps)}
        durationInFrames={takte(1, fps)}
      >
        <Plattform
          kicker="Plattform"
          plattform="IBM Power i"
          zeile="Robuste Technik für den Mittelstand."
        />
      </Sequence>
      <Sequence
        name="Aussage"
        from={takt(11, fps)}
        durationInFrames={takte(1, fps)}
      >
        <Aussage zeile1="Ein System." zeile2="Ein Partner." />
      </Sequence>
      <Sequence
        name="Abspann"
        from={takt(12, fps)}
        durationInFrames={durationInFrames - takt(12, fps)}
      >
        <Abspann
          zeile="M-HIS von HPCN"
          leistungen="IT-Consulting · KI-Beratung"
          adresse="www.h-pcn.de"
        />
      </Sequence>
      <Blitz bei={takt(3, fps)} art="licht" abklingen={14} staerke={0.8} />
      <Blitz bei={takt(7, fps)} art="licht" abklingen={10} staerke={0.6} />
      <Blitz bei={takt(12, fps)} art="licht" abklingen={14} staerke={0.6} />
      <Audio
        src={staticFile(musik)}
        volume={(f) =>
          lautstaerke *
          interpolate(
            f,
            [0, 6, durationInFrames - 24, durationInFrames - 1],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )
        }
      />
    </AbsoluteFill>
  );
};
