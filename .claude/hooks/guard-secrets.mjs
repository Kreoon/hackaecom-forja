#!/usr/bin/env node
// PreToolUse (Write|Edit|MultiEdit|Bash): bloquea llaves reales en archivos o comandos.
// FORJA maneja llaves de usuarios: ninguna debe terminar en el repo ni en un log.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const t = input.tool_input ?? {};
const filePath = String(t.file_path ?? "");
const text = [t.content, t.new_string, t.command, ...(t.edits ?? []).map((e) => e.new_string)]
  .filter(Boolean)
  .join("\n");

const patterns = [
  [/sk-(?:proj-|ant-)?[A-Za-z0-9_-]{24,}/, "llave OpenAI/Anthropic"],
  [/AIza[0-9A-Za-z_-]{35}/, "llave Google/Gemini"],
  [/shp(?:at|ss|ca|pa)_[a-f0-9]{32}/, "token/secret de Shopify"],
  [/apify_api_[A-Za-z0-9]{30,}/, "token de Apify"],
  [/fc-[a-f0-9]{32}/, "llave de Firecrawl"],
  [/eyJhbGciOi[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/, "JWT (¿service role de Supabase?)"],
];

const isEnvLocal = /(^|[\\/])\.env(\.local|\.development\.local)?$/.test(filePath);
if (!isEnvLocal) {
  for (const [re, label] of patterns) {
    if (re.test(text)) {
      process.stderr.write(
        `FORJA guard: parece un secreto real (${label}). Ponlo en .env.local (gitignored) o en Supabase Vault, nunca en el código ni en comandos.\n`,
      );
      process.exit(2);
    }
  }
}

if (/\bNEXT_PUBLIC_[A-Z_]*(SECRET|SERVICE_ROLE|API_KEY|TOKEN)\b/.test(text)) {
  process.stderr.write("FORJA guard: una variable NEXT_PUBLIC_ con secreto se expone al navegador. Quita el prefijo.\n");
  process.exit(2);
}
process.exit(0);
