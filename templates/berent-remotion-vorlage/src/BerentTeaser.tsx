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
import { Datenschutz } from "./szenen/Datenschutz";
import { Aussage } from "./szenen/Aussage";
import { Abspann } from "./szenen/Abspann";

type Props = { musik: string; lautstaerke: number };

/**
 * Beispiel-Teaser, 30 s, 16:9, 120 BPM = 15 Takte à 2 s.
 * Harte Schnitte auf dem Downbeat, Blitze nur an Wendepunkten.
 *
 *  Takt  0–2  Hook          Wortwolke, Tippzeile, Sog ins Plus
 *  Takt  3–4  Titel         Einschlag + Farbblitz, Plus-Netz
 *  Takt  5–6  Frage         Kicker + Frage mit Akzentwort
 *  Takt  7    Kapitel       Plus-Rahmen, Geisterzahl
 *  Takt  8–9  Prozess       Lichtpunkt durch die Kette
 *  Takt 10–11 Datenschutz   Scanner Klartext → Platzhalter
 *  Takt 12    Aussage       Kupfer-Vollfläche
 *  Takt 13–14 Abspann       Wortmarke, Claim, Ausblende
 */
export const BerentTeaser: React.FC<Props> = ({ musik, lautstaerke }) => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: farbe.grund }}>
      <Sequence
        name="Hook"
        from={takt(0, fps)}
        durationInFrames={takte(3, fps)}
      >
        <Hook
          zeile1="Alle testen KI."
          zeile2="Wenige arbeiten damit."
          woerter={[
            "ChatGPT",
            "Copilot",
            "DSGVO?",
            "Agenten",
            "Prompt",
            "AI Act",
            "Keine Zeit.",
            "Später mal.",
            "Lizenzen",
            "Zu teuer?",
            "Gemini",
            "Pilotprojekt",
            "Wer haftet?",
            "Workshop",
          ]}
        />
      </Sequence>
      <Sequence
        name="Titel"
        from={takt(3, fps)}
        durationInFrames={takte(2, fps)}
      >
        <Titel
          wort1="Beratung"
          wort2="Entwicklung"
          unterzeile="KI, die im Betrieb ankommt."
        />
      </Sequence>
      <Sequence
        name="Frage"
        from={takt(5, fps)}
        durationInFrames={takte(2, fps)}
      >
        <Frage
          kicker="Frage 01"
          frage="Wie viele Anrufe *verpasst* ihr pro Woche?"
        />
      </Sequence>
      <Sequence
        name="Kapitel"
        from={takt(7, fps)}
        durationInFrames={takte(1, fps)}
      >
        <Kapitel nummer="01" titel="Voice Agent" />
      </Sequence>
      <Sequence
        name="Prozess"
        from={takt(8, fps)}
        durationInFrames={takte(2, fps)}
      >
        <Prozess
          aussage="Nimmt ab, *wenn ihr nicht könnt.*"
          schritte={[
            { titel: "Anruf", zeile: "18:42 Uhr" },
            { titel: "Voice Agent", zeile: "nimmt sofort ab" },
            { titel: "Termin", zeile: "im Kalender" },
            { titel: "Euer Team", zeile: "morgens informiert" },
          ]}
          fazit="Kein Rückruf-Stapel. Kein verlorener Kunde."
        />
      </Sequence>
      <Sequence
        name="Datenschutz"
        from={takt(10, fps)}
        durationInFrames={takte(2, fps)}
      >
        <Datenschutz
          aussage="Personenbezug? *Bleibt im Haus.*"
          marke="Pseudonymisierung · DSGVO"
          eintraege={[
            { klar: "Karin Weber", ersatz: "[PERSON_1]" },
            { klar: "0171 482 19 07", ersatz: "[TELEFON_1]" },
            { klar: "Lindenstraße 12", ersatz: "[ADRESSE_1]" },
            { klar: "k.weber@web.de", ersatz: "[E-MAIL_1]" },
            { klar: "Vertrag 2019-4471", ersatz: "[VERTRAG_1]" },
          ]}
        />
      </Sequence>
      <Sequence
        name="Aussage"
        from={takt(12, fps)}
        durationInFrames={takte(1, fps)}
      >
        <Aussage zeile1="KI im Alltag." zeile2="Nicht auf Folien." />
      </Sequence>
      <Sequence
        name="Abspann"
        from={takt(13, fps)}
        durationInFrames={takte(2, fps)}
      >
        <Abspann claim="gem*AI*nsam wachsen" adresse="berent.ai" />
      </Sequence>
      <Blitz bei={takt(3, fps)} art="licht" abklingen={14} />
      <Blitz bei={takt(7, fps)} art="licht" abklingen={10} staerke={0.7} />
      <Blitz bei={takt(13, fps)} art="licht" abklingen={14} staerke={0.6} />
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
