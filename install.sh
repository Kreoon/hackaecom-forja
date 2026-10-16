#!/usr/bin/env bash
# FORJA · bootstrap del integrante (macOS / Linux / WSL). Idempotente.
set -euo pipefail
cd "$(dirname "$0")"

ok()   { printf '  \033[32m[ok]\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m[!]\033[0m  %s\n' "$1"; }
has()  { command -v "$1" >/dev/null 2>&1; }

printf '\n\033[36mFORJA · escuadron 02 · preparando tu entorno\033[0m\n\n'

if has node; then
  major=$(node -v | sed 's/^v//' | cut -d. -f1)
  if [ "$major" -ge 22 ]; then ok "node $(node -v)"; else warn "node $(node -v): se necesita 22+"; fi
else warn "Falta Node.js 22+"; fi
has git && ok git || warn "Falta git"
has claude && ok "Claude Code" || warn "Falta Claude Code: npm i -g @anthropic-ai/claude-code"
has shopify && ok shopify || warn "Opcional: npm i -g @shopify/cli (carril C)"
has supabase && ok supabase || warn "Opcional: brew install supabase/tap/supabase"
has vercel && ok vercel || warn "Opcional: npm i -g vercel"

if [ ! -f .env.local ]; then cp .env.example .env.local; ok ".env.local creado (llenalo)"; else ok ".env.local ya existe"; fi

lane_file=.claude/lane.local
if [ ! -f "$lane_file" ]; then
  read -r -p "Tu carril: A (Cerebro IA), B (App + Mockup) o C (Shopify): " lane
  lane=$(printf '%s' "$lane" | tr '[:lower:]' '[:upper:]' | tr -d '[:space:]')
  case "$lane" in A|B|C) echo "$lane" > "$lane_file"; ok "carril $lane guardado";; *) warn "Carril no valido; usa /forja-start";; esac
else ok "carril $(cat "$lane_file")"; fi

ok "$(ls .claude/agents/forja-*.md | wc -l | tr -d ' ') agentes FORJA, $(ls -d .claude/skills/*/ | wc -l | tr -d ' ') skills, $(ls .claude/commands | wc -l | tr -d ' ') comandos"
if has claude; then claude plugin validate mods/forja-hud >/dev/null && ok "mod forja-hud valido" || warn "revisa: claude plugin validate mods/forja-hud"; fi

printf '\n\033[36mListo.\033[0m Abre Claude Code con el mod:\n  claude --plugin-dir mods/forja-hud\ny escribe:  /forja-start\n\n'
