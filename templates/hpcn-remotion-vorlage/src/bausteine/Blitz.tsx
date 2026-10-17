import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { farbe } from "../ci/tokens";

type Props = {
  /** „licht“ = heller Blitz, „kupfer“ = Farbblitz in Markenblau. */
  art?: "licht" | "kupfer";
  /** Frame des Schlags, auf dem der Blitz sitzt. */
  bei: number;
  /** Abklingzeit in Frames. */
  abklingen?: number;
  staerke?: number;
};

/**
 * Blitz auf dem Schlag: in einem Frame voll da, klingt dann ab.
 * Licht-Blitz mit hellem Kern und Vignette, Farbblitz als Akzentfläche.
 * Sparsam einsetzen: höchstens alle zwei Takte, nie zweimal hintereinander.
 */
export const Blitz: React.FC<Props> = ({
  art = "licht",
  bei,
  abklingen = 12,
  staerke = 1,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [bei - 1, bei, bei + abklingen], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (p <= 0) return null;
  const hintergrund =
    art === "licht"
      ? `radial-gradient(ellipse 70% 65% at 50% 50%, ${farbe.champagne} 30%, ${farbe.gedaempft2} 100%)`
      : `radial-gradient(ellipse 75% 70% at 50% 50%, ${farbe.kupfer}, ${farbe.markenblau} 60%, ${farbe.navy} 100%)`;
  return (
    <AbsoluteFill
      style={{
        background: hintergrund,
        opacity: Math.pow(p, 1.6) * staerke * (art === "licht" ? 0.85 : 0.9),
        mixBlendMode: art === "licht" ? "screen" : "normal",
        pointerEvents: "none",
      }}
    />
  );
};
