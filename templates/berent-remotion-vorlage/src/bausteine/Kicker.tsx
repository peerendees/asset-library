import type React from "react";
import { farbe, groesse, schrift, sperrung } from "../ci/tokens";

/** Kleine Überzeile in JetBrains Mono, Versalien, weit gesperrt: „FRAGE 01“. */
export const Kicker: React.FC<{
  children: React.ReactNode;
  farbeText?: string;
  versalien?: boolean;
  style?: React.CSSProperties;
}> = ({ children, farbeText = farbe.kupfer, versalien = true, style }) => (
  <div
    style={{
      fontFamily: schrift.mono,
      fontWeight: 700,
      fontSize: groesse.kicker,
      letterSpacing: sperrung.kicker,
      textTransform: versalien ? "uppercase" : "none",
      color: farbeText,
      ...style,
    }}
  >
    {children}
  </div>
);
