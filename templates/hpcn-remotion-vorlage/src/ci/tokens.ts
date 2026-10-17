/**
 * HPCN-CI für Remotion. Ersetzt `src/ci/tokens.ts` der BERENT-Vorlage.
 *
 * Die Schlüssel behalten die Rollennamen der Vorlage, damit alle Bausteine
 * ohne Änderung laufen:
 *   kupfer      → Akzentblau (Leitfarbe der Akzente)
 *   gold        → Markenzeichen-Farbe (in HPCN: Markenblau-hell für das Raster)
 *   champagne   → Hellste Schriftfarbe
 * Vollflächen in HPCN: Navy oder Markenblau mit heller Schrift.
 */
export const farbe = {
  grund: "#071a30",
  karte: "#0c2a4d",
  rand: "#1e3f66",
  kupfer: "#7e9bf0", // Akzentblau
  kupferHell: "#a9bdf7",
  kupferDunkel: "#3450ac", // Markenblau – Vollfläche, helle Schrift darauf 6,42:1
  gold: "#a9bdf7", // Markenzeichen (2×2-Raster)
  champagne: "#eef1f5",
  text: "#c9ced6",
  gedaempft: "#7f8a99",
  gedaempft2: "#a7b0bd",
  tinte: "#071a30",
  // HPCN-eigene Rollen
  markenblau: "#3450ac",
  markengrau: "#787878",
  navy: "#003366",
  mittelblau: "#005c9e",
} as const;

export const schrift = {
  /** Titel: Inter 800, gemischte Schreibung oder Versalien, leicht enger. */
  titel: "'Inter', sans-serif",
  satz: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const groesse = {
  held: 200,
  titel: 128,
  satzGross: 88,
  satz: 60,
  klein: 38,
  kicker: 24,
} as const;

export const sicher = { seite: 140, oben: 120, unten: 120 } as const;
export const sperrung = { titel: "-0.02em", kicker: "0.3em" } as const;

export const gluehen = (hex: string, staerke = 1) =>
  `0 0 ${10 * staerke}px ${hex}aa, 0 0 ${30 * staerke}px ${hex}66, 0 0 ${70 * staerke}px ${hex}33`;

export const skaliere = (wert: number, breite: number) =>
  (wert * breite) / 1920;
