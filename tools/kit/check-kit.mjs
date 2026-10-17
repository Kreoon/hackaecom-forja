#!/usr/bin/env node
// Validador del kit FORJA. Uso: npm --prefix tools/kit run check   (exit 1 si hay errores)
// Revisa: JSON válidos, frontmatter de agentes/skills/comandos, enlaces internos, rutas y scripts
// citados, tamaño de CLAUDE.md y ausencia de secretos. No toca la red ni modifica archivos.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${relative(root, file).replace(/\\/g, "/")}: ${msg}`);
const warn = (file, msg) => warnings.push(`${relative(root, file).replace(/\\/g, "/")}: ${msg}`);

// Fuera del alcance: dependencias, git, export de otra herramienta (sin confirmar) y worktrees.
const SKIP = new Set(["node_modules", ".git", ".agents", ".codex", "worktrees", ".contracts", "outputs"]);
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
const files = walk(root);
const read = (p) => readFileSync(p, "utf8");

// 1. JSON
for (const f of files.filter((f) => f.endsWith(".json"))) {
  try {
    JSON.parse(read(f));
  } catch (e) {
    err(f, `JSON inválido: ${e.message}`);
  }
}

// 2. Frontmatter
const VALID_COLORS = new Set(["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]);
const VALID_MODELS = /^(sonnet|opus|haiku|fable|inherit|claude-[\w.-]+)$/;
function frontmatter(f) {
  const m = read(f).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  try {
    return parseYaml(m[1]);
  } catch (e) {
    err(f, `frontmatter YAML inválido: ${e.message.split("\n")[0]}`);
    return undefined;
  }
}
const agents = files.filter((f) => /[\\/]\.claude[\\/]agents[\\/][^\\/]+\.md$/.test(f));
for (const f of agents) {
  const fm = frontmatter(f);
  if (fm === null) { err(f, "sin frontmatter"); continue; }
  if (!fm) continue;
  if (!fm.name || !fm.description) err(f, "agente sin name o description");
  if (fm.color && !VALID_COLORS.has(fm.color)) err(f, `color no válido: ${fm.color}`);
  if (fm.model && !VALID_MODELS.test(fm.model)) err(f, `model no válido: ${fm.model}`);
  if (fm.name && !f.endsWith(`${fm.name}.md`)) warn(f, `name (${fm.name}) distinto del archivo`);
}
const skills = files.filter((f) => /[\\/]\.claude[\\/]skills[\\/][^\\/]+[\\/]SKILL\.md$/.test(f));
const skillNames = new Set();
for (const f of skills) {
  const fm = frontmatter(f);
  if (fm === null) { err(f, "sin frontmatter"); continue; }
  if (!fm) continue;
  if (!fm.description) err(f, "skill sin description");
  const dirName = f.split(/[\\/]/).at(-2);
  if (fm.name && fm.name !== dirName) err(f, `name (${fm.name}) distinto de la carpeta (${dirName})`);
  skillNames.add(dirName);
  if (read(f).split("\n").length > 500) err(f, "SKILL.md supera 500 líneas");
}
const commands = files.filter((f) => /[\\/]\.claude[\\/]commands[\\/][^\\/]+\.md$/.test(f));
for (const f of commands) {
  const fm = frontmatter(f);
  if (fm === null) { err(f, "comando sin frontmatter"); continue; }
  if (fm && !fm.description) err(f, "comando sin description");
  const name = f.split(/[\\/]/).at(-1).replace(/\.md$/, "");
  if (skillNames.has(name)) warn(f, `skill y comando con el mismo nombre (/${name}): gana la skill`);
}

// 3. Enlaces markdown relativos y rutas citadas en backticks
const mdFiles = files.filter((f) => f.endsWith(".md"));
for (const f of mdFiles) {
  const text = read(f);
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const path = target.split("#")[0];
    if (!path) continue;
    if (!existsSync(resolve(dirname(f), path))) err(f, `enlace roto: ${target}`);
  }
}
// Rutas del kit que deben existir cuando se citan (no se validan rutas futuras de la app: src/, shopify/, e2e/, supabase/).
const KIT_PREFIXES = ["docs/", ".claude/", "tools/kit/", "golden/00-fixture", "mods/", ".github/"];
for (const f of mdFiles) {
  for (const [, p] of read(f).matchAll(/`((?:docs|\.claude|tools\/kit|golden\/00-fixture|mods|\.github)\/[^`*<>\s]*[^`*<>\s/])`/g)) {
    if (!KIT_PREFIXES.some((k) => p.startsWith(k))) continue;
    if (/[{}|]|\.\.|\$/.test(p) || p.endsWith(".local")) continue; // .local = archivo personal generado
    if (!existsSync(join(root, p))) err(f, `ruta citada no existe: ${p}`);
  }
}

// 4. Scripts npm citados del kit
const kitPkg = JSON.parse(read(join(root, "tools/kit/package.json")));
for (const f of mdFiles) {
  for (const [, s] of read(f).matchAll(/npm --prefix tools\/kit run ([\w-]+)/g)) {
    if (!kitPkg.scripts?.[s]) err(f, `script inexistente en tools/kit: ${s}`);
  }
}
// Hooks de settings.json apuntan a archivos existentes
const settings = JSON.parse(read(join(root, ".claude/settings.json")));
for (const groups of Object.values(settings.hooks ?? {})) {
  for (const g of groups) for (const h of g.hooks ?? []) {
    const m = h.command?.match(/\$CLAUDE_PROJECT_DIR\/([^"\s]+)/);
    if (m && !existsSync(join(root, m[1]))) err(join(root, ".claude/settings.json"), `hook apunta a archivo inexistente: ${m[1]}`);
  }
}

// 5. CLAUDE.md
const claudeLines = read(join(root, "CLAUDE.md")).split("\n").length;
if (claudeLines > 200) err(join(root, "CLAUDE.md"), `${claudeLines} líneas (> 200)`);

// 6. Secretos (mismos patrones que .claude/hooks/guard-secrets.mjs)
const SECRET_PATTERNS = [
  [/sk-(?:proj-|ant-)?[A-Za-z0-9_-]{24,}/, "llave OpenAI/Anthropic"],
  [/AIza[0-9A-Za-z_-]{35}/, "llave Google"],
  [/shp(?:at|ss|ca|pa)_[a-f0-9]{32}/, "token Shopify"],
  [/apify_api_[A-Za-z0-9]{30,}/, "token Apify"],
  [/fc-[a-f0-9]{32}/, "llave Firecrawl"],
  [/eyJhbGciOi[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/, "JWT"],
];
for (const f of files) {
  if (/\.env(\.|$)/.test(f.split(/[\\/]/).at(-1)) && !f.endsWith(".env.example")) continue; // .env.local es local e ignorado
  if (/\.(png|jpe?g|webp|gif|mp4|mp3|wav|pdf|lock)$/i.test(f) || f.endsWith("package-lock.json")) continue;
  const text = read(f);
  for (const [re, label] of SECRET_PATTERNS) if (re.test(text)) err(f, `posible secreto (${label})`);
}
const envExample = read(join(root, ".env.example"));
for (const line of envExample.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.+)$/);
  if (m && !/^(http:\/\/localhost|2026-10|true|false)/.test(m[2])) err(join(root, ".env.example"), `${m[1]} tiene valor (usa placeholder vacío)`);
}

console.log(`FORJA kit-check · ${agents.length} agentes · ${skills.length} skills · ${commands.length} comandos · ${mdFiles.length} .md`);
for (const w of warnings) console.log(`  ! ${w}`);
for (const e of errors) console.log(`  ✗ ${e}`);
console.log(errors.length ? `${errors.length} error(es)` : "OK");
process.exit(errors.length ? 1 : 0);
