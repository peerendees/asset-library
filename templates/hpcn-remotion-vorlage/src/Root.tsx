import { Composition, Folder } from "remotion";
import { MhisTeaser } from "./MhisTeaser";
import { Hook } from "./szenen/Hook";
import { Titel } from "./szenen/Titel";
import { Frage } from "./szenen/Frage";
import { Kapitel } from "./szenen/Kapitel";
import { Prozess } from "./szenen/Prozess";
import { Plattform } from "./szenen/Plattform";
import { Aussage } from "./szenen/Aussage";
import { Abspann } from "./szenen/Abspann";

// 16:9, 30 fps, 30 s. 112 BPM → 14 Takte.
const FORMAT = { fps: 30, width: 1920, height: 1080 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MhisTeaser"
      component={MhisTeaser}
      durationInFrames={900}
      {...FORMAT}
      defaultProps={{ musik: "musik/taktspur-112bpm.wav", lautstaerke: 0.8 }}
    />
    <Folder name="Szenen">
      <Composition
        id="Hook"
        component={Hook}
        durationInFrames={193}
        {...FORMAT}
        defaultProps={{
          zeile1: "Vermieten. Reparieren. Verkaufen.",
          zeile2: "Ein System.",
          woerter: [
            "Mietvertrag",
            "Werkstattauftrag",
            "Ersatzteil",
            "Kostenstelle",
            "Maschinenakte",
            "Wartung",
          ],
        }}
      />
      <Composition
        id="Titel"
        component={Titel}
        durationInFrames={129}
        {...FORMAT}
        defaultProps={{
          produkt: "M-HIS",
          langname: "Modulares Handels-Informations-System",
          absender: "von HPCN",
        }}
      />
      <Composition
        id="Frage"
        component={Frage}
        durationInFrames={129}
        {...FORMAT}
        defaultProps={{
          kicker: "Frage 01",
          frage: "Was hat die Maschine *wirklich gekostet?*",
        }}
      />
      <Composition
        id="Kapitel"
        component={Kapitel}
        durationInFrames={64}
        {...FORMAT}
        defaultProps={{ nummer: "01", titel: "Durchgängig." }}
      />
      <Composition
        id="Prozess"
        component={Prozess}
        durationInFrames={129}
        {...FORMAT}
        defaultProps={{
          aussage: "Vom Auftrag *bis zur Auswertung.*",
          fazit: "Büro, Werkstatt und Vermietung in einem System.",
          schritte: [
            { titel: "Anfrage", zeile: "Kunde meldet Bedarf" },
            { titel: "Mietvertrag", zeile: "Maschine disponiert" },
            { titel: "Werkstatt", zeile: "Wartung erfasst" },
            { titel: "Auswertung", zeile: "Kosten je Maschine" },
          ],
        }}
      />
      <Composition
        id="Plattform"
        component={Plattform}
        durationInFrames={64}
        {...FORMAT}
        defaultProps={{
          kicker: "Plattform",
          plattform: "IBM Power i",
          zeile: "Robuste Technik für den Mittelstand.",
        }}
      />
      <Composition
        id="Aussage"
        component={Aussage}
        durationInFrames={64}
        {...FORMAT}
        defaultProps={{ zeile1: "Ein System.", zeile2: "Ein Partner." }}
      />
      <Composition
        id="Abspann"
        component={Abspann}
        durationInFrames={129}
        {...FORMAT}
        defaultProps={{
          zeile: "M-HIS von HPCN",
          leistungen: "IT-Consulting · KI-Beratung",
          adresse: "www.h-pcn.de",
        }}
      />
    </Folder>
  </>
);
