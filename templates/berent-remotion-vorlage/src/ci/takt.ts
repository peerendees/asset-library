/**
 * Taktraster. Schnitte, Einschläge und Blitze liegen auf Zählzeiten der Musik.
 *
 * Standard 120 BPM bei 30 fps: 1 Schlag = 15 Frames, 1 Takt (4/4) = 60 Frames
 * = 2 s. 30 s = 15 Takte. Ganzzahlige Frames, kein Driften.
 *
 * Bei einem echten Musikstück: BPM und Versatz des ersten Downbeats mit
 * `python3 scripts/takt-analyse.py <datei>` messen und hier eintragen.
 */
export const TAKT = {
  bpm: 120,
  /** Sekunden bis zum ersten Downbeat im Musikstück. */
  versatz: 0,
  schlaegeProTakt: 4,
} as const;

export const schlagInFrames = (fps: number, bpm: number = TAKT.bpm) =>
  (60 / bpm) * fps;

/** Frame des n-ten Schlags (0-basiert), auf ganze Frames gerundet. */
export const schlag = (n: number, fps: number, bpm: number = TAKT.bpm) =>
  Math.round(TAKT.versatz * fps + n * schlagInFrames(fps, bpm));

/** Frame des Beginns von Takt n (0-basiert). */
export const takt = (n: number, fps: number, bpm: number = TAKT.bpm) =>
  schlag(n * TAKT.schlaegeProTakt, fps, bpm);

/** Dauer von n Takten in Frames. */
export const takte = (n: number, fps: number, bpm: number = TAKT.bpm) =>
  Math.round(n * TAKT.schlaegeProTakt * schlagInFrames(fps, bpm));

/** Pulsieren auf dem Schlag: 1 direkt auf dem Schlag, fällt bis zum nächsten auf 0. */
export const puls = (frame: number, fps: number, bpm: number = TAKT.bpm) => {
  const s = schlagInFrames(fps, bpm);
  const phase = (((frame - TAKT.versatz * fps) % s) + s) % s;
  return Math.exp((-phase / s) * 5);
};
