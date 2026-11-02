import { Composition, Folder } from "remotion";
import { MhisTeaser } from "./MhisTeaser";
import { Anfrage } from "./szenen/Anfrage";
import { Vorgaenge } from "./szenen/Vorgaenge";
import { Schluss } from "./szenen/Schluss";

// 16:9, 30 fps, 30 s. 96 BPM → 12 Takte à 75 Frames.
const FORMAT = { fps: 30, width: 1920, height: 1080 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MhisTeaser"
      component={MhisTeaser}
      durationInFrames={900}
      {...FORMAT}
      defaultProps={{ musik: "musik/taktspur-96bpm.wav", lautstaerke: 0.8 }}
    />
    <Folder name="Szenen">
      <Composition
        id="Anfrage"
        component={Anfrage}
        durationInFrames={525}
        {...FORMAT}
      />
      <Composition
        id="Vorgaenge"
        component={Vorgaenge}
        durationInFrames={225}
        {...FORMAT}
      />
      <Composition
        id="Schluss"
        component={Schluss}
        durationInFrames={150}
        {...FORMAT}
      />
    </Folder>
  </>
);
