import { Composition, Folder } from "remotion";
import { BerentTeaser } from "./BerentTeaser";
import { Hook } from "./szenen/Hook";
import { Titel } from "./szenen/Titel";
import { Frage } from "./szenen/Frage";
import { Kapitel } from "./szenen/Kapitel";
import { Prozess } from "./szenen/Prozess";
import { Datenschutz } from "./szenen/Datenschutz";
import { Aussage } from "./szenen/Aussage";
import { Abspann } from "./szenen/Abspann";

// 16:9, 30 fps, 30 s = Standard. 120 BPM → 1 Takt = 60 Frames.
const FORMAT = { fps: 30, width: 1920, height: 1080 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BerentTeaser"
      component={BerentTeaser}
      durationInFrames={900}
      {...FORMAT}
      defaultProps={{ musik: "musik/taktspur-120bpm.wav", lautstaerke: 0.8 }}
    />
    <Folder name="Szenen">
      <Composition
        id="Hook"
        component={Hook}
        durationInFrames={180}
        {...FORMAT}
        defaultProps={{
          zeile1: "Alle testen KI.",
          zeile2: "Wenige arbeiten damit.",
          woerter: [
            "ChatGPT",
            "Copilot",
            "DSGVO?",
            "Agenten",
            "Prompt",
            "AI Act",
            "Keine Zeit.",
            "Später mal.",
          ],
        }}
      />
      <Composition
        id="Titel"
        component={Titel}
        durationInFrames={120}
        {...FORMAT}
        defaultProps={{
          wort1: "Beratung",
          wort2: "Entwicklung",
          unterzeile: "KI, die im Betrieb ankommt.",
        }}
      />
      <Composition
        id="Frage"
        component={Frage}
        durationInFrames={120}
        {...FORMAT}
        defaultProps={{
          kicker: "Frage 01",
          frage: "Wie viele Anrufe *verpasst* ihr pro Woche?",
        }}
      />
      <Composition
        id="Kapitel"
        component={Kapitel}
        durationInFrames={60}
        {...FORMAT}
        defaultProps={{ nummer: "01", titel: "Voice Agent" }}
      />
      <Composition
        id="Prozess"
        component={Prozess}
        durationInFrames={120}
        {...FORMAT}
        defaultProps={{
          aussage: "Nimmt ab, *wenn ihr nicht könnt.*",
          fazit: "Kein Rückruf-Stapel. Kein verlorener Kunde.",
          schritte: [
            { titel: "Anruf", zeile: "18:42 Uhr" },
            { titel: "Voice Agent", zeile: "nimmt sofort ab" },
            { titel: "Termin", zeile: "im Kalender" },
            { titel: "Euer Team", zeile: "morgens informiert" },
          ],
        }}
      />
      <Composition
        id="Datenschutz"
        component={Datenschutz}
        durationInFrames={120}
        {...FORMAT}
        defaultProps={{
          aussage: "Personenbezug? *Bleibt im Haus.*",
          marke: "Pseudonymisierung · DSGVO",
          eintraege: [
            { klar: "Karin Weber", ersatz: "[PERSON_1]" },
            { klar: "0171 482 19 07", ersatz: "[TELEFON_1]" },
            { klar: "Lindenstraße 12", ersatz: "[ADRESSE_1]" },
          ],
        }}
      />
      <Composition
        id="Aussage"
        component={Aussage}
        durationInFrames={60}
        {...FORMAT}
        defaultProps={{ zeile1: "KI im Alltag.", zeile2: "Nicht auf Folien." }}
      />
      <Composition
        id="Abspann"
        component={Abspann}
        durationInFrames={120}
        {...FORMAT}
        defaultProps={{ claim: "gem*AI*nsam wachsen", adresse: "berent.ai" }}
      />
    </Folder>
  </>
);
