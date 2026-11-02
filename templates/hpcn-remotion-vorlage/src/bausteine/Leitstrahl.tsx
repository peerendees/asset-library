import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { farbe } from "../ci/tokens";

type Props = {
  von: [number, number];
  nach: [number, number];
  /** Frame, an dem der Strahl losläuft. */
  ab: number;
  /** Frames bis zum Ziel. */
  dauer?: number;
};

/**
 * Lichtlinie von einer Quelle (markierte Textstelle) zu einem Ziel (Feld).
 * Zeigt, woher ein eingetragener Wert stammt. Erlischt nach dem Eintreffen.
 */
export const Leitstrahl: React.FC<Props> = ({ von, nach, ab, dauer = 12 }) => {
  const frame = useCurrentFrame();
  const lauf = interpolate(frame, [ab, ab + dauer], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
  const aus = interpolate(frame, [ab + dauer, ab + dauer + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < ab || aus <= 0) return null;

  const mx = (von[0] + nach[0]) / 2;
  const pfad = `M ${von[0]} ${von[1]} C ${mx} ${von[1]}, ${mx} ${nach[1]}, ${nach[0]} ${nach[1]}`;
  // Punkt auf der Kurve (kubische Bezier) für den wandernden Lichtpunkt.
  const t = lauf;
  const bez = (a: number, b: number, c: number, d: number) =>
    (1 - t) ** 3 * a +
    3 * (1 - t) ** 2 * t * b +
    3 * (1 - t) * t ** 2 * c +
    t ** 3 * d;
  const px = bez(von[0], mx, mx, nach[0]);
  const py = bez(von[1], von[1], nach[1], nach[1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: aus }}>
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <filter
            id="leitstrahl-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path
          d={pfad}
          fill="none"
          stroke={farbe.kupfer}
          strokeWidth={6}
          pathLength={1}
          strokeDasharray={`${lauf} 1`}
          opacity={0.5}
          filter="url(#leitstrahl-glow)"
        />
        <path
          d={pfad}
          fill="none"
          stroke={farbe.kupferHell}
          strokeWidth={2.5}
          pathLength={1}
          strokeDasharray={`${lauf} 1`}
        />
        <circle
          cx={px}
          cy={py}
          r={9}
          fill={farbe.champagne}
          filter="url(#leitstrahl-glow)"
        />
        <circle cx={px} cy={py} r={5} fill={farbe.champagne} />
      </svg>
    </AbsoluteFill>
  );
};
