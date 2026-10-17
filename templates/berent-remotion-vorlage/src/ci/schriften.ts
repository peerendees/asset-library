/**
 * Lädt die CI-Schriften aus public/fonts (lokal, DSGVO-konform, OFL).
 * Jede Szene importiert diese Datei, damit sie auch als eigenständige
 * (verbundene) Komposition richtig aussieht.
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const datei = (name: string) => staticFile(`fonts/${name}.woff2`);

export const schriftenGeladen = Promise.all([
  loadFont({
    family: "Bebas Neue",
    url: datei("bebas-neue-latin-400-normal"),
    weight: "400",
  }),
  loadFont({
    family: "Instrument Sans",
    url: datei("instrument-sans-latin-400-normal"),
    weight: "400",
  }),
  loadFont({
    family: "Instrument Sans",
    url: datei("instrument-sans-latin-500-normal"),
    weight: "500",
  }),
  loadFont({
    family: "Instrument Sans",
    url: datei("instrument-sans-latin-600-normal"),
    weight: "600",
  }),
  loadFont({
    family: "Instrument Sans",
    url: datei("instrument-sans-latin-700-normal"),
    weight: "700",
  }),
  loadFont({
    family: "JetBrains Mono",
    url: datei("jetbrains-mono-latin-400-normal"),
    weight: "400",
  }),
  loadFont({
    family: "JetBrains Mono",
    url: datei("jetbrains-mono-latin-700-normal"),
    weight: "700",
  }),
]);
