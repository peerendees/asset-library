/**
 * Lädt die HPCN-Schriften aus public/fonts (lokal, OFL, kein Google-Abruf).
 * Jede Szene importiert diese Datei, damit sie auch einzeln im Studio stimmt.
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const datei = (name: string) => staticFile(`fonts/${name}.woff2`);

export const schriftenGeladen = Promise.all([
  loadFont({
    family: "Inter",
    url: datei("inter-latin-400-normal"),
    weight: "400",
  }),
  loadFont({
    family: "Inter",
    url: datei("inter-latin-600-normal"),
    weight: "600",
  }),
  loadFont({
    family: "Inter",
    url: datei("inter-latin-700-normal"),
    weight: "700",
  }),
  loadFont({
    family: "Inter",
    url: datei("inter-latin-800-normal"),
    weight: "800",
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
