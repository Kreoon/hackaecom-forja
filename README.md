# FORJA · Kit del escuadrón 02 (HackaEcom 2026)

**De una foto y una nota de voz a una página publicada en tu Shopify.**
Este repo no trae la app hecha: trae el **equipo de agentes** que la construye contigo, desde cero, rápido y bien.

## Qué hay adentro
| Pieza | Dónde | Qué hace |
|---|---|---|
| Cerebro del proyecto | `CLAUDE.md` / `AGENTS.md` | misión, contrato, carriles, reglas (Claude Code y Codex) |
| 11 agentes FORJA | `.claude/agents/forja-*.md` | arquitecto, prompts, ingesta, marca, copy, visual, mockup, Shopify, Liquid, seguridad, demo |
| 8 skills de producto | `.claude/skills/forja-*` | contratos PageSpec/ProductDNA, prompts v1 + rúbrica, BYOK, Shopify deploy, Liquid, Supabase, CRO LATAM |
| 9 skills de diseño y calidad | `.claude/skills/forja-*` | dirección de arte (con paletas, fuentes y presets por categoría), motion compartido React/Liquid, revisión de motion, voz humana LATAM, SEO Shopify, UI de la app, revisión de UI, lector de referencias, rendimiento Next.js |
| 6 comandos | `.claude/commands/` | `/forja-start` `/forja-task` `/forja-prompt-lab` `/forja-contract-check` `/forja-demo` `/forja-standup` |
| Hooks | `.claude/hooks/` | bloqueo de llaves en código/comandos · contexto del carril al iniciar sesión |
| Mod | `mods/forja-hud/` | banda con tu carril, aviso al tocar carpetas de otro carril o contratos, `/forja-lane` |
| Docs | `docs/` | visión, arquitectura, plan por carril, runbook de la demo, decisiones |

## Arranque (cada integrante)
Windows:
```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```
macOS / Linux:
```bash
bash install.sh
```
Luego abre Claude Code en la carpeta (con el mod):
```bash
claude --plugin-dir mods/forja-hud
```
y escribe `/forja-start A` (o B, o C).

## El flujo del producto
```
Inputs ─▶ ProductDNA ─▶ DesignTokens ─▶ PageSpec ─┬─▶ Mockup (React)
 fotos · audio · PDF · URL · refs                  └─▶ Shopify (Liquid)  ✓
```

## Carriles
- **A · Cerebro IA** — ingesta, prompts, copy, imágenes y animación con las llaves del usuario.
- **B · App + Mockup** — registro, llaves, uploads, progreso en vivo, editor, aprobar.
- **C · Shopify** — conexión de tienda, compilador a Liquid, deploy y publicación.

Antes de tocar Shopify, lee el riesgo #1 en `.claude/skills/forja-shopify-deploy/SKILL.md`.

## Agentes globales opcionales
Algunos agentes mencionan `frontend-designer`, `image-creator`, `video-producer` o `docs-researcher`: vienen del setup de Kreoon (`claude-team-setup`). Si no los tienes, los agentes FORJA funcionan igual.

---
Hecho por el escuadrón 02 para HackaEcom · Feria Effix 2026. Todos los skills son propios de FORJA.
