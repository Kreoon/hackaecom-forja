#!/usr/bin/env node
// SessionStart: inyecta carril del integrante + últimas líneas de docs/estado.md.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const lanePath = join(root, ".claude", "lane.local");
const estadoPath = join(root, "docs", "estado.md");
const names = { A: "A · Cerebro IA", B: "B · App + Mockup", C: "C · Shopify" };

const lane = existsSync(lanePath) ? readFileSync(lanePath, "utf8").trim().toUpperCase() : "";
const lines = [];
lines.push(lane ? `Carril de este integrante: ${names[lane] ?? lane}.` : "Este integrante aún no eligió carril: sugiere /forja-start.");
if (existsSync(estadoPath)) {
  const tail = readFileSync(estadoPath, "utf8").trim().split("\n").slice(-12).join("\n");
  lines.push("Últimas notas de docs/estado.md:\n" + tail);
}
lines.push("Contratos: src/contracts (o referencias en .claude/skills/forja-pagespec y forja-product-dna). Cambios de contrato → forja-architect.");
process.stdout.write(lines.join("\n\n"));
