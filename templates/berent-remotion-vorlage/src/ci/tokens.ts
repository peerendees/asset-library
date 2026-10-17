/**
 * BERENT-CI für Video (mediumgerecht umgesetzt).
 *
 * Grundlage: BERENT-CI-Skill und die BelegChat-Umsetzung (globals.css,
 * layout.tsx, BER-197/BER-199). Abweichungen vom Web-CI sind bewusst und
 * hier begründet – dieselbe Abwägung, die BelegChat für das Cockpit traf.
 *
 *  - Hintergrund bleibt #090806 (Video ist ein Leuchtmedium wie Web).
 *  - Große Überschriften stehen in Champagne #F5EFE4 statt Kupfer: Kupfer als
 *    Vollfläche einer 200-px-Zeile wirkt im Video matt und verliert nach der
 *    Kompression Kontrast. Kupfer trägt die Akzentwörter, Linien und Glühen.
 *  - Gold #E8C98A NUR für das Plus-Symbol. Auch Partikel im Plus-Netz sind
 *    deshalb kleine Plus-Zeichen – sonst dürften sie nicht gold sein.
 *  - Nie #000000, nie #FFFFFF. Der Lichtblitz ist Champagne, nicht Weiß.
 */
export const farbe = {
  grund: "#090806", // CI-Hintergrund, warmes Dunkelbraun-Schwarz
  karte: "#110e0a", // CI-Card
  rand: "#2a2118", // CI-Border
  kupfer: "#b5742a", // Leitfarbe: Akzentwörter, Linien, Glühen
  kupferHell: "#c98d45", // Glühkern, Hover-Ton aus BelegChat .dark
  kupferDunkel: "#8a5720", // Kupfer auf hellem Grund (5,82:1)
  gold: "#e8c98a", // AUSSCHLIESSLICH Plus-Symbol
  champagne: "#f5efe4", // Überschriften im Video, Lichtblitz
  text: "#c4bcb1", // CI-Fließtext
  gedaempft: "#7a6a58", // Sekundärtext
  gedaempft2: "#9a8870", // Kicker, Labels
  tinte: "#2a1a08", // Text auf hellem/kupfernem Grund
} as const;

/** Schriftrollen. Begründung in references/ci-video.md des /remotion-Skills. */
export const schrift = {
  /** Überschriften, Einschläge, Zahlen. Immer Versalien, immer gesperrt. */
  titel: "'Bebas Neue', 'Instrument Sans', sans-serif",
  /** Sätze, Fragen, Aussagen, Untertitel. 600/700 im Video. */
  satz: "'Instrument Sans', sans-serif",
  /** Kicker (FRAGE 01), Kennungen, Platzhalter, Daten. */
  mono: "'JetBrains Mono', monospace",
} as const;

/** Größen für 1920 × 1080. Bei anderen Formaten mit `skaliere()` umrechnen. */
export const groesse = {
  held: 240, // Einschlag-Wort (Bebas)
  titel: 150, // Hauptüberschrift (Bebas)
  satzGross: 92, // Aussage / Frage (Instrument Sans 700)
  satz: 64, // zweite Zeile, Erklärung
  klein: 40, // Unterzeile, Bio
  kicker: 26, // JetBrains Mono, Versalien, Sperrung 0.35em
} as const;

export const sicher = { seite: 140, oben: 120, unten: 120 } as const;

/** Sperrung für Bebas Neue laut CI: 0.04em bis 0.1em. */
export const sperrung = { titel: "0.05em", kicker: "0.35em" } as const;

/** Glühen im Video: weicher Lichtschein statt harter Kontur. */
export const gluehen = (hex: string, staerke = 1) =>
  `0 0 ${12 * staerke}px ${hex}cc, 0 0 ${36 * staerke}px ${hex}88, 0 0 ${80 * staerke}px ${hex}44`;

export const skaliere = (wert: number, breite: number) =>
  (wert * breite) / 1920;
