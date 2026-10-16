#!/usr/bin/env node
// Verifica contraste WCAG de unos DesignTokens o de una paleta de data/palettes.json.
// Uso: node contrast.mjs tokens.json   |   node contrast.mjs --palette crema-terracota
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
let palette;
if (args[0] === "--palette") {
  palette = JSON.parse(readFileSync(join(here, "..", "data", "palettes.json"), "utf8"))[args[1]];
  if (!palette) throw new Error(`No existe la paleta ${args[1]}`);
} else {
  const json = JSON.parse(readFileSync(args[0], "utf8"));
  palette = json.palette ?? json.tokens?.palette ?? json;
}

const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const checks = [
  ["text", "background", 4.5],
  ["text", "surface", 4.5],
  ["muted", "background", 4.5],
  ["primaryText", "primary", 4.5],
  ["primary", "background", 3],
];
let failed = 0;
for (const [fg, bg, min] of checks) {
  const r = ratio(palette[fg], palette[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "OK  " : "FALLA"} ${fg} sobre ${bg}: ${r.toFixed(2)}:1 (mín ${min})`);
}
process.exit(failed ? 1 : 0);
