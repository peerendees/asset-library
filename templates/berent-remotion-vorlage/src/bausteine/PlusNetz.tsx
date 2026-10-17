import type React from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { farbe } from "../ci/tokens";

type Props = {
  punkte?: number;
  radius?: number;
  /** Umdrehungen pro 10 Sekunden. */
  tempo?: number;
  deckkraft?: number;
  seed?: string;
  mitte?: [number, number];
};

/**
 * Rotierende 3D-Punktwolke mit Verbindungslinien („Plexus“), BERENT-Fassung:
 * Linien und Knoten in Kupfer, jeder achte Knoten ein kleines Gold-Plus,
 * Lichtfunken in Champagne wandern über einzelne Linien.
 */
export const PlusNetz: React.FC<Props> = ({
  punkte = 72,
  radius = 380,
  tempo = 0.6,
  deckkraft = 1,
  seed = "berent",
  mitte,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [cx, cy] = mitte ?? [width / 2, height / 2];
  const winkelY = (frame / fps / 10) * tempo * Math.PI * 2;
  const winkelX = 0.35 + Math.sin(frame / fps / 4) * 0.08;

  // Fibonacci-Kugel mit leichtem Zufall – gleichmäßig verteilt, nicht starr
  const knoten = Array.from({ length: punkte }, (_, i) => {
    const y0 = 1 - (i / (punkte - 1)) * 2;
    const r0 = Math.sqrt(1 - y0 * y0);
    const phi = i * Math.PI * (3 - Math.sqrt(5));
    const jitter = 0.86 + random(`${seed}-r-${i}`) * 0.22;
    let x = Math.cos(phi) * r0 * jitter;
    let z = Math.sin(phi) * r0 * jitter;
    let y = y0 * jitter;
    // Rotation um Y, dann um X
    const xr = x * Math.cos(winkelY) - z * Math.sin(winkelY);
    const zr = x * Math.sin(winkelY) + z * Math.cos(winkelY);
    x = xr;
    z = zr;
    const yr = y * Math.cos(winkelX) - z * Math.sin(winkelX);
    const zr2 = y * Math.sin(winkelX) + z * Math.cos(winkelX);
    y = yr;
    z = zr2;
    const perspektive = 1.9 / (2.6 - z);
    return {
      x: cx + x * radius * perspektive,
      y: cy + y * radius * perspektive,
      z,
      i,
    };
  });

  const linien: {
    a: (typeof knoten)[0];
    b: (typeof knoten)[0];
    d: number;
    k: number;
  }[] = [];
  let k = 0;
  for (let a = 0; a < knoten.length; a++) {
    for (let b = a + 1; b < knoten.length; b++) {
      const dx = knoten[a].x - knoten[b].x;
      const dy = knoten[a].y - knoten[b].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < radius * 0.42)
        linien.push({ a: knoten[a], b: knoten[b], d, k: k++ });
    }
  }

  const tiefe = (z: number) => 0.25 + ((z + 1) / 2) * 0.75;

  return (
    <AbsoluteFill style={{ opacity: deckkraft }}>
      <svg width={width} height={height}>
        {linien.map(({ a, b, d, k: n }) => (
          <line
            key={`l${a.i}-${b.i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={farbe.kupfer}
            strokeWidth={1.2}
            strokeOpacity={
              (1 - d / (radius * 0.42)) * tiefe((a.z + b.z) / 2) * 0.7
            }
            data-n={n}
          />
        ))}
        {linien
          .filter(({ k: n }) => n % 23 === 0)
          .map(({ a, b, k: n }) => {
            const p = ((frame + n * 7) % 45) / 45;
            return (
              <circle
                key={`f${n}`}
                cx={a.x + (b.x - a.x) * p}
                cy={a.y + (b.y - a.y) * p}
                r={2.6}
                fill={farbe.champagne}
                opacity={Math.sin(p * Math.PI) * tiefe(a.z)}
              />
            );
          })}
        {knoten.map((n) =>
          n.i % 8 === 0 ? (
            <g
              key={`p${n.i}`}
              opacity={tiefe(n.z)}
              transform={`translate(${n.x} ${n.y})`}
            >
              <rect x={-1.4} y={-7} width={2.8} height={14} fill={farbe.gold} />
              <rect x={-7} y={-1.4} width={14} height={2.8} fill={farbe.gold} />
            </g>
          ) : (
            <circle
              key={`k${n.i}`}
              cx={n.x}
              cy={n.y}
              r={2 + tiefe(n.z) * 2.4}
              fill={farbe.kupferHell}
              opacity={tiefe(n.z)}
            />
          ),
        )}
      </svg>
    </AbsoluteFill>
  );
};
