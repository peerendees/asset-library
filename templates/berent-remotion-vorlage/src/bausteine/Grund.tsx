import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { farbe } from "../ci/tokens";

type Props = {
  /** Kupferner Lichtschein in einer Ecke (Wiedererkennung über alle Szenen). */
  ecke?: "unten-rechts" | "unten-links" | "oben-rechts" | "keine";
  /** Vollfläche statt Dunkel, z. B. für eine Aussage-Szene in Kupfer. */
  flaeche?: string;
  children?: React.ReactNode;
};

/**
 * Szenen-Hintergrund: CI-Grund, atmender Kupferschein in einer Ecke, Vignette.
 * Entspricht dem durchgehenden Eckenschein der Vorlage, aber in Kupfer.
 */
export const Grund: React.FC<Props> = ({
  ecke = "unten-rechts",
  flaeche,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const atem = 0.75 + 0.25 * Math.sin((frame / fps) * Math.PI * 0.5);
  const pos = {
    "unten-rechts": "92% 105%",
    "unten-links": "8% 105%",
    "oben-rechts": "92% -5%",
    keine: "50% 50%",
  }[ecke];

  return (
    <AbsoluteFill
      style={{ backgroundColor: flaeche ?? farbe.grund, overflow: "hidden" }}
    >
      {ecke !== "keine" && !flaeche ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 38% 45% at ${pos}, ${farbe.kupfer}55, transparent 70%)`,
            opacity: atem,
          }}
        />
      ) : null}
      {flaeche ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 70% 70% at 50% 45%, #ffffff22, transparent 70%)`,
          }}
        />
      ) : null}
      {children}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 55%, ${farbe.grund}cc 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
