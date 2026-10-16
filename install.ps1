# FORJA · bootstrap del integrante (Windows). Idempotente: se puede correr varias veces.
$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

function Ok($m)   { Write-Host "  [ok] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "  [!]  $m" -ForegroundColor Yellow }
function Has($cmd) { $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue) }

Write-Host "`nFORJA - escuadron 02 - preparando tu entorno`n" -ForegroundColor Cyan

# 1. Herramientas
if (Has 'node') {
  $major = [int]((node -v).TrimStart('v').Split('.')[0])
  if ($major -ge 22) { Ok "node $(node -v)" } else { Warn "node $(node -v): se necesita 22+ (AI SDK). Instala desde nodejs.org" }
} else { Warn "Falta Node.js 22+ (nodejs.org)" }
if (Has 'git') { Ok 'git' } else { Warn 'Falta git' }
if (Has 'claude') { Ok 'Claude Code' } else { Warn 'Falta Claude Code: npm i -g @anthropic-ai/claude-code' }
foreach ($t in @(
  @{ cmd = 'shopify';  hint = 'npm i -g @shopify/cli   (carril C)' },
  @{ cmd = 'supabase'; hint = 'npm i -g supabase   o   scoop install supabase' },
  @{ cmd = 'vercel';   hint = 'npm i -g vercel' }
)) { if (Has $t.cmd) { Ok $t.cmd } else { Warn "Opcional: $($t.cmd) -> $($t.hint)" } }

# 2. Variables locales
if (-not (Test-Path '.env.local')) { Copy-Item '.env.example' '.env.local'; Ok '.env.local creado desde .env.example (llenalo)' }
else { Ok '.env.local ya existe' }

# 3. Carril
$lanePath = '.claude/lane.local'
if (-not (Test-Path $lanePath)) {
  $lane = Read-Host 'Tu carril: A (Cerebro IA), B (App + Mockup) o C (Shopify)'
  $lane = $lane.Trim().ToUpper()
  if ($lane -match '^[ABC]$') { Set-Content -Path $lanePath -Value $lane -Encoding utf8; Ok "carril $lane guardado" }
  else { Warn 'Carril no valido; luego usa /forja-start o /forja-lane' }
} else { Ok "carril $((Get-Content $lanePath).Trim())" }

# 4. Verificacion del kit
$agents = (Get-ChildItem '.claude/agents' -Filter 'forja-*.md').Count
$skills = (Get-ChildItem '.claude/skills' -Directory).Count
Ok "$agents agentes FORJA, $skills skills, $((Get-ChildItem '.claude/commands').Count) comandos"
if (Has 'claude') { claude plugin validate 'mods/forja-hud' | Out-Null; if ($LASTEXITCODE -eq 0) { Ok 'mod forja-hud valido' } else { Warn 'mod forja-hud: revisa con  claude plugin validate mods/forja-hud' } }

Write-Host "`nListo. Abre Claude Code con el mod:" -ForegroundColor Cyan
Write-Host "  claude --plugin-dir mods/forja-hud"
Write-Host "y escribe:  /forja-start`n"
