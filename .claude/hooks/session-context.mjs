#!/usr/bin/env node
// SessionStart: inyecta carril del integrante + últimas líneas de docs/estado.md.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const lanePath = join(root, ".claude", "lane.local");
const estadoPath = join(root, "docs", "estado.md");
const names = { A: "A · Cerebro + backend", B: "B · Producto + preview", C: "C · Shopify + calidad" };

const lane = existsSync(lanePath) ? readFileSync(lanePath, "utf8").trim().toUpperCase() : "";
const lines = [];
lines.push(lane ? `Carril de este integrante: ${names[lane] ?? lane}.` : "Este integrante aún no eligió carril: sugiere /forja-start.");
if (existsSync(estadoPath)) {
  const tail = readFileSync(estadoPath, "utf8").trim().split("\n").slice(-12).join("\n");
  lines.push("Últimas notas de docs/estado.md:\n" + tail);
}
lines.push("Contratos: src/contracts (o referencias en .claude/skills/forja-pagespec, forja-product-dna y forja-contracts). Cambios de contrato → forja-architect. Tareas: docs/11-backlog.md. Orientación: /forja-orientacion.");
process.stdout.write(lines.join("\n\n"));
