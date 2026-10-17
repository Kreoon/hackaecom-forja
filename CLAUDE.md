# FORJA · Tiendas Shopify con IA — Escuadrón 02 (HackaEcom 2026)

> Subes fotos, un audio, un PDF, una web o imágenes de referencia. FORJA entiende el producto,
> arma un brief, diseña la página, te muestra el preview y, cuando le das ✓, la deja **en tu Shopify**.

Este archivo es el **punto de entrada**. El detalle vive en los documentos enlazados (una fuente de verdad por tema).
Estado actual: kit de agentes, skills, contratos y docs listos; **la app aún no tiene scaffold** (tarea P0-1).
**Este equipo es el cerebro (carril A).** El frontend (B) lo hace otro compañero; la frontera es [docs/14-api-cerebro.md](docs/14-api-cerebro.md). Proveedor principal de IA: **OpenRouter** (LLM + imagen, ADR-010).

## Flujo y contratos
```
Inputs ─▶ Evidence ─▶ Brief ─▶ DesignTokens + PageSpec(v, hash) ─┬─▶ Preview (React)
 [A]        [A]        [A]              [A + B]                    └─▶ Aprobación(v, hash, tienda) ─▶ Publicación (Shopify) [C]
```
- `PageSpec` es la única fuente de verdad de la página: preview y Shopify renderizan **el mismo** spec versionado.
- Contratos: `forja-pagespec`, `forja-product-dna` y [`forja-contracts`](.claude/skills/forja-contracts/SKILL.md) (proveedor, asset, brief, aprobación, publicación, estados). **Cambiar un contrato = ADR vía `forja-architect`.**

## Stack
Next.js (App Router) + TypeScript + Tailwind + shadcn/ui · Supabase (Auth, Postgres+RLS, Storage, Vault) · Vercel · Zod · AI SDK (llave del usuario por request, sin BYOK de AI Gateway) · Shopify GraphQL Admin API `2026-10` · Vitest + Playwright.

## Carriles (detalle: [docs/10-guia-equipo.md](docs/10-guia-equipo.md))
| Carril | Alcance | Carpetas | Agentes principales |
|---|---|---|---|
| **A · Cerebro + backend** | auth servidor, llaves BYOK, adapters, ingesta, Brief, composición, assets, jobs | `src/lib/ai/**`, `src/lib/ingest/**`, `src/lib/server/**` | `forja-backend`, `forja-ingest`, `forja-prompt-engineer`, `forja-brand-director`, `forja-copy-chief`, `forja-visual-producer` |
| **B · Producto + app + preview** | pantallas, sistema de diseño, preview/editor, UI de aprobación | `src/app/**`, `src/components/**`, `src/styles/**` | `forja-page-composer` |
| **C · Shopify + calidad + infra** | tienda, aprobación (lógica), publicación, verificación, e2e, CI | `src/lib/shopify/**`, `src/lib/publish/**`, `shopify/**`, `e2e/**`, `.github/**` | `forja-shopify-engineer`, `forja-liquid-compiler`, `forja-qa-fidelity`, `forja-devops` |
| Especialistas | 119 agentes acotados por pieza (ver catálogo); el generalista del área sigue siendo la entrada por defecto | — | `forja-orchestrator` elige |
| Transversal | contratos, reparto, docs, seguridad, demo | `src/contracts/**`, `supabase/migrations/**` | `forja-architect`, `forja-orchestrator`, `forja-docs-researcher`, `forja-context-keeper`, `forja-byok-guardian`, `forja-demo-qa` |

## Comandos (skills invocables)
| Para | Comando |
|---|---|
| Arrancar / diagnosticar | `/forja-start <A\|B\|C>` · `/forja-orientacion` · `/forja-standup` |
| Planear y repartir | `/forja-feature-design` · `/forja-task` · `/forja-parallel` |
| Investigar | `/forja-docs-research` |
| Construir | `/forja-provider-integration` · `/forja-ingesta` · `/forja-brief` · `/forja-brief-to-page` · `/forja-visual-assets` · `/forja-copy-eval` · `/forja-prompt-lab` |
| Revisar | `/forja-review` · `/forja-security-review` · `/forja-shopify-review` · `/forja-contract-check` · `/forja-preview-fidelity` |
| Probar | `/forja-e2e` · `/forja-demo` |
| Publicar | `/forja-approve-publish` · `/forja-publish-recovery` |
| Cerrar sesión | `/forja-handoff` · `/forja-context` |

Checks del kit: `npm --prefix tools/kit run check` (frontmatter, enlaces, secretos) · `npm --prefix tools/kit run dry-run` (flujo completo con FIXTURE, sin publicar).

## Reglas
- Español en UI, docs y commits; código e identificadores en inglés. Commits `feat(a|b|c): …`, `contracts: …`, `docs: …`.
- **Llaves del usuario**: Vault, solo servidor, nunca en logs ni en el cliente (`docs/07-modelo-amenazas.md`).
- Toda salida de LLM se valida con Zod; 1 reintento con el error.
- **No inventar**: ningún dato, cifra, garantía o testimonio sin procedencia en el Brief; referencias externas = inspiración, nunca facts.
- Cada sección se renderiza igual en preview y Liquid; un tipo nuevo se agrega en los dos lados en el mismo PR.
- Antes de usar una API externa: `/forja-docs-research` y fila en `docs/fuentes.md`.
- **Publicar**: solo con aprobación vigente (versión + hash + tienda); `draft` + preview por defecto; `live` con confirmación explícita. Nunca sobrescribir trabajo del comerciante.
- Nadie afirma pruebas, llamadas o publicaciones que no ejecutó.
- `.agents/` y `.codex/` son una exportación a Codex sin confirmar: no editarla desde aquí.

## Riesgo #1 (leer antes de tocar Shopify)
Las mutations de tema exigen `write_themes` **y exención**; client credentials solo funciona con tiendas de la misma organización. MVP: app block + metafield (ADR-007). C1 (smoke test) es la primera tarea del carril C.

## Mapa de documentos
| Tema | Documento |
|---|---|
| Visión | [docs/00-vision.md](docs/00-vision.md) |
| Arquitectura, MVP y módulos | [docs/01-arquitectura.md](docs/01-arquitectura.md) |
| Calendario y tarima | [docs/02-plan-equipo.md](docs/02-plan-equipo.md) · [docs/03-demo-runbook.md](docs/03-demo-runbook.md) |
| Decisiones (ADR) | [docs/04-decisiones.md](docs/04-decisiones.md) |
| Diagnóstico e inventario de reutilización | [docs/05-diagnostico.md](docs/05-diagnostico.md) |
| Versión, aprobación, publicación, estados | [docs/06-version-aprobacion-publicacion.md](docs/06-version-aprobacion-publicacion.md) |
| Amenazas y seguridad | [docs/07-modelo-amenazas.md](docs/07-modelo-amenazas.md) |
| Pruebas | [docs/08-plan-pruebas.md](docs/08-plan-pruebas.md) |
| Herramientas y proveedores | [docs/09-herramientas.md](docs/09-herramientas.md) |
| Equipo, ramas, worktrees, handoff | [docs/10-guia-equipo.md](docs/10-guia-equipo.md) |
| Backlog (fuente única de tareas) | [docs/11-backlog.md](docs/11-backlog.md) |
| Arranque por persona | [docs/12-arranque.md](docs/12-arranque.md) |
| Fuentes oficiales con fecha | [docs/fuentes.md](docs/fuentes.md) |
| API del cerebro para el frontend | [docs/14-api-cerebro.md](docs/14-api-cerebro.md) |
| Catálogo de 136 agentes (base + especialistas) | [docs/13-catalogo-agentes.md](docs/13-catalogo-agentes.md) |
| Bitácora | [docs/estado.md](docs/estado.md) |
