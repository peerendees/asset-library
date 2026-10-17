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
 * Rotierende 3D-Punktwolke mit Verbindungslinien – HPCN-Fassung des Netzes
 * („Network“ im Namen): quadratische Knoten, jeder achte hervorgehoben,
 * Lichtpunkte wandern über einzelne Linien.
 */
export const Netzwerk: React.FC<Props> = ({
  punkte = 64,
  radius = 380,
  tempo = 0.45,
  deckkraft = 1,
  seed = "hpcn",
  mitte,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [cx, cy] = mitte ?? [width / 2, height / 2];
  const winkelY = (frame / fps / 10) * tempo * Math.PI * 2;
  const winkelX = 0.3 + Math.sin(frame / fps / 5) * 0.06;

  const knoten = Array.from({ length: punkte }, (_, i) => {
    const y0 = 1 - (i / (punkte - 1)) * 2;
    const r0 = Math.sqrt(1 - y0 * y0);
    const phi = i * Math.PI * (3 - Math.sqrt(5));
    const j = 0.88 + random(`${seed}-r-${i}`) * 0.2;
    let x = Math.cos(phi) * r0 * j;
    let z = Math.sin(phi) * r0 * j;
    let y = y0 * j;
    const xr = x * Math.cos(winkelY) - z * Math.sin(winkelY);
    const zr = x * Math.sin(winkelY) + z * Math.cos(winkelY);
    x = xr;
    z = zr;
    const yr = y * Math.cos(winkelX) - z * Math.sin(winkelX);
    const zr2 = y * Math.sin(winkelX) + z * Math.cos(winkelX);
    y = yr;
    z = zr2;
    const p = 1.9 / (2.6 - z);
    return { x: cx + x * radius * p, y: cy + y * radius * p, z, i };
  });

  const grenze = radius * 0.42;
  const linien: {
    a: (typeof knoten)[0];
    b: (typeof knoten)[0];
    d: number;
    n: number;
  }[] = [];
  let n = 0;
  for (let a = 0; a < knoten.length; a++) {
    for (let b = a + 1; b < knoten.length; b++) {
      const d = Math.hypot(
        knoten[a].x - knoten[b].x,
        knoten[a].y - knoten[b].y,
      );
      if (d < grenze) linien.push({ a: knoten[a], b: knoten[b], d, n: n++ });
    }
  }
  const tiefe = (z: number) => 0.25 + ((z + 1) / 2) * 0.75;

  return (
    <AbsoluteFill style={{ opacity: deckkraft }}>
      <svg width={width} height={height}>
        {linien.map(({ a, b, d }) => (
          <line
            key={`l${a.i}-${b.i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={farbe.kupfer}
            strokeWidth={1.1}
            strokeOpacity={(1 - d / grenze) * tiefe((a.z + b.z) / 2) * 0.55}
          />
        ))}
        {linien
          .filter((l) => l.n % 21 === 0)
          .map(({ a, b, n: k }) => {
            const p = ((frame + k * 7) % 48) / 48;
            return (
              <circle
                key={`f${k}`}
                cx={a.x + (b.x - a.x) * p}
                cy={a.y + (b.y - a.y) * p}
                r={2.4}
                fill={farbe.champagne}
                opacity={Math.sin(p * Math.PI) * tiefe(a.z)}
              />
            );
          })}
        {knoten.map((k) => {
          const s = k.i % 8 === 0 ? 9 : 4 + tiefe(k.z) * 3;
          return (
            <rect
              key={`k${k.i}`}
              x={k.x - s / 2}
              y={k.y - s / 2}
              width={s}
              height={s}
              rx={1}
              fill={k.i % 8 === 0 ? farbe.gold : farbe.kupfer}
              opacity={tiefe(k.z)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
