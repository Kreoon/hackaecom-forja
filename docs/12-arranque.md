# 12 · Arranque

## Una vez por persona
1. `git pull` en `main`.
2. Windows: `powershell -ExecutionPolicy Bypass -File .\install.ps1` · macOS/Linux: `bash install.sh` (crea `.env.local` desde `.env.example` y guarda tu carril).
3. `npm --prefix tools/kit install` y luego `npm --prefix tools/kit run check` y `npm --prefix tools/kit run dry-run` → ambos "OK".
4. Abre Claude Code con el mod: `claude --plugin-dir mods/forja-hud`. Aprueba los servidores MCP del proyecto (`shopify-dev`, `supabase`) cuando lo pida.
5. `/forja-start <A|B|C>`.

## Nosotros somos el cerebro (carril A)
El frontend lo hace otro compañero. Repartan el carril A entre ustedes por subáreas que no comparten archivos:

| Subárea | Primeras tareas | Agentes |
|---|---|---|
| Proveedores y llaves | A0b → **A1 OpenRouter** (`DEV_OPENROUTER_API_KEY` ya está en `.env.local` de quien la cargó) → A7 | `forja-openrouter-adapter`, `forja-key-vault`, `forja-provider-router` |
| Ingesta y Brief | A3 → A4 (con `golden/00-fixture`) | `forja-upload-validator`, `forja-url-fetcher`, extractores, `forja-dna-synthesizer` |
| Composición, copy y assets | A5 → A6 → A8 | `forja-page-outliner`, `forja-headline-writer`, `forja-image-prompter` |

Antes de todo: P0-1/P0-2 (scaffold y contratos) y publicar [`14-api-cerebro.md`](14-api-cerebro.md) al compañero de frontend.

## Primeras tareas por persona (reparto original A/B/C)
| Persona (carril) | Hoy | Después | Contra qué trabaja mientras otros avanzan |
|---|---|---|---|
| **A · Cerebro + backend** | P0-1 scaffold (o lo hace C) → P0-2 contratos → P0-3 migración | A0b llaves + logger → A1 adapter OpenRouter → A9 jobs | `golden/00-fixture`, `brief.example.json` |
| **B · Producto + preview** | B6 `SectionRenderer` + secciones con `forja-pagespec/reference/example.json` | B1 auth UI → B2 llaves (mock) → B5 Brief | fixtures; mocks de llaves y jobs |
| **C · Shopify + calidad** | C1 smoke test en tienda de desarrollo (requiere D3) | C2 cliente GraphQL → C3 aprobación/plan → P0-4 CI | plan del `dry-run`; tienda de desarrollo |

Bloqueos que hay que resolver primero (dueño en `docs/11-backlog.md`): **D3** tienda de desarrollo + app en el Dev Dashboard de la organización · **D4** proyecto Supabase de desarrollo · **D1** identificar "API MARK".

## Prompt para iniciar la siguiente sesión
```
/forja-orientacion
Después: somos el cerebro (carril A; el frontend lo hace otro compañero). Ejecuta P0-1 y P0-2 del backlog (scaffold Next.js + contratos en src/contracts) con forja-architect, sin tocar .agents/ ni .codex/.
Copia los contratos de .claude/skills/forja-pagespec, forja-product-dna y forja-contracts; agrega tests Vitest que validen los ejemplos;
deja `npm run typecheck`, `npm test`, `npm --prefix tools/kit run check` y `npm --prefix tools/kit run dry-run` en verde, luego A1 (adapter OpenRouter, ADR-010) con forja-openrouter-adapter, y cierra con /forja-handoff.
```
