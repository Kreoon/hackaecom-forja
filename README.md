# FORJA · Kit del escuadrón 02 (HackaEcom 2026)

**De una foto y una nota de voz a una página publicada en tu Shopify.**
Este repo no trae la app hecha: trae el **equipo de agentes** que la construye contigo, desde cero, rápido y bien.

## Qué hay adentro
| Pieza | Dónde | Qué hace |
|---|---|---|
| Punto de entrada | `CLAUDE.md` (AGENTS.md lo enlaza) | flujo, contratos, carriles, reglas, mapa de docs |
| 136 agentes FORJA (17 base + 119 especialistas, ver `docs/13-catalogo-agentes.md`) | `.claude/agents/forja-*.md` | arquitecto, orquestador, investigador, backend, ingesta, prompts, marca, copy, visual, preview, Shopify, Liquid, QA, devops, seguridad, contexto, demo |
| Skills de dominio | `.claude/skills/forja-*` | contratos (PageSpec, ProductDNA, `forja-contracts`), prompts, BYOK, Shopify, Liquid, Supabase, diseño, motion, CRO, SEO |
| Skills de flujo (invocables con `/`) | `.claude/skills/forja-*` | orientación, diseño de feature, investigación, proveedor, ingesta, brief, copy, assets, preview, Shopify, aprobación, recuperación, seguridad, e2e, paralelo, revisión, handoff, contexto |
| Comandos | `.claude/commands/` | `/forja-start` `/forja-task` `/forja-prompt-lab` `/forja-contract-check` `/forja-demo` `/forja-standup` |
| Hooks y mod | `.claude/hooks/`, `mods/forja-hud/` | bloqueo de secretos, contexto de sesión, aviso de carril |
| Validador y prueba en seco | `tools/kit/` | `npm --prefix tools/kit run check` · `npm --prefix tools/kit run dry-run` |
| MCP de desarrollo | `.mcp.json` | Shopify Dev MCP y Supabase MCP en solo lectura |
| Docs | `docs/` | visión, arquitectura, ADR, diagnóstico, publicación, amenazas, pruebas, herramientas, equipo, backlog, arranque, fuentes |

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
y escribe `/forja-start A` (o B, o C). Guía completa: `docs/12-arranque.md`.

## El flujo del producto
```
Inputs ─▶ ProductDNA ─▶ DesignTokens ─▶ PageSpec ─┬─▶ Mockup (React)
 fotos · audio · PDF · URL · refs                  └─▶ Shopify (Liquid)  ✓
```

## Carriles
- **A · Cerebro + backend** — auth en servidor, llaves BYOK, ingesta, brief, prompts, copy, imágenes, jobs.
- **B · Producto + app + preview** — pantallas, sistema de diseño, preview/editor, aprobar.
- **C · Shopify + calidad + infra** — conexión de tienda, publicación, verificación, e2e, CI.

Antes de tocar Shopify, lee `docs/06-version-aprobacion-publicacion.md` (ADR-007).

## Agentes globales opcionales
Algunos agentes mencionan `frontend-designer`, `image-creator`, `video-producer` o `docs-researcher`: vienen del setup de Kreoon (`claude-team-setup`). Si no los tienes, los agentes FORJA funcionan igual.

---
Hecho por el escuadrón 02 para HackaEcom · Feria Effix 2026. Todos los skills son propios de FORJA.
