# FORJA · Kit del escuadrón 02 (HackaEcom 2026)

**De una foto y una nota de voz a una página publicada en tu Shopify.**
Este repo no trae la app hecha: trae el **equipo de agentes** que la construye contigo, desde cero, rápido y bien.

## Qué hay adentro
| Pieza | Dónde | Qué hace |
|---|---|---|
| Cerebro del proyecto | `CLAUDE.md` / `AGENTS.md` | misión, contrato, carriles, reglas (Claude Code y Codex) |
| 11 agentes FORJA | `.claude/agents/forja-*.md` | arquitecto, prompts, ingesta, marca, copy, visual, mockup, Shopify, Liquid, seguridad, demo |
| 8 skills FORJA | `.claude/skills/forja-*` | contratos PageSpec/ProductDNA, prompts v1 + rúbrica, BYOK, Shopify deploy, Liquid, Supabase, CRO LATAM |
| 15 skills de diseño | `.claude/skills/*` | de **Tododeia claude-webkit** (MIT, ver `ATTRIBUTION-tododeia.md`): frontend-design, emil-design-eng, animate, shadcn-ui, humanizer, seo-audit… |
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
Diseño base: [Tododeia](https://github.com/Hainrixz/claude-webkit) (MIT). Hecho para HackaEcom · Feria Effix 2026.
