import type React from "react";
import { farbe } from "../ci/tokens";

type Props = {
  groesse?: number;
  /** 0–1: wie stark das hervorgehobene Feld oben links leuchtet. */
  gluehen?: number;
  /** Welches Feld hervorgehoben ist (0 = oben links wie im Logo). */
  aktiv?: 0 | 1 | 2 | 3;
  style?: React.CSSProperties;
};

/**
 * HPCN-Markenelement: das 2×2-Raster aus dem Logo („HP / CN“).
 * Das hervorgehobene Feld steht für das blaue „H“.
 */
export const Raster: React.FC<Props> = ({
  groesse = 64,
  gluehen = 1,
  aktiv = 0,
  style,
}) => {
  const luecke = groesse * 0.08;
  const feld = (groesse - luecke) / 2;
  return (
    <svg
      width={groesse}
      height={groesse}
      viewBox={`0 0 ${groesse} ${groesse}`}
      style={{ overflow: "visible", ...style }}
    >
      {[0, 1, 2, 3].map((i) => {
        const x = (i % 2) * (feld + luecke);
        const y = Math.floor(i / 2) * (feld + luecke);
        const an = i === aktiv;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={feld}
            height={feld}
            rx={feld * 0.1}
            fill={an ? farbe.gold : farbe.gedaempft}
            opacity={an ? 1 : 0.75}
            style={
              an && gluehen > 0
                ? {
                    filter: `drop-shadow(0 0 ${8 * gluehen}px ${farbe.kupfer}cc) drop-shadow(0 0 ${22 * gluehen}px ${farbe.kupfer}66)`,
                  }
                : undefined
            }
          />
        );
      })}
    </svg>
  );
};
