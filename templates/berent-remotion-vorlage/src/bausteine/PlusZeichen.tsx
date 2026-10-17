import type React from "react";
import { farbe } from "../ci/tokens";

type Props = {
  groesse?: number;
  /** Strichstärke relativ zur Größe. */
  staerke?: number;
  gluehen?: number;
  style?: React.CSSProperties;
};

/** Das BERENT-Plus. Immer Gold #E8C98A – nie Kupfer. */
export const PlusZeichen: React.FC<Props> = ({
  groesse = 48,
  staerke = 0.14,
  gluehen = 1,
  style,
}) => {
  const s = groesse * staerke;
  return (
    <svg
      width={groesse}
      height={groesse}
      viewBox={`0 0 ${groesse} ${groesse}`}
      style={{
        overflow: "visible",
        filter:
          gluehen > 0
            ? `drop-shadow(0 0 ${8 * gluehen}px ${farbe.gold}aa) drop-shadow(0 0 ${24 * gluehen}px ${farbe.gold}55)`
            : undefined,
        ...style,
      }}
    >
      <rect
        x={(groesse - s) / 2}
        y={0}
        width={s}
        height={groesse}
        rx={s * 0.25}
        fill={farbe.gold}
      />
      <rect
        x={0}
        y={(groesse - s) / 2}
        width={groesse}
        height={s}
        rx={s * 0.25}
        fill={farbe.gold}
      />
    </svg>
  );
};
