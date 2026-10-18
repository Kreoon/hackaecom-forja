# 08 · Plan de pruebas

Regla: **nadie reporta una prueba que no ejecutó**. Si un check no se pudo correr, se escribe "no ejecutado: <motivo>".

| Nivel | Qué prueba | Herramienta | Dónde | Dueño | Cuándo |
|---|---|---|---|---|---|
| Kit | JSON, frontmatter, enlaces, scripts, secretos | `npm --prefix tools/kit run check` | `tools/kit/check-kit.mjs` | todos | cada PR (CI `kit-check`) |
| Contratos | esquemas + hash + aprobación + plan de publicación con fixture | `npm --prefix tools/kit run dry-run` | `tools/kit/dry-run.ts` | architect | al tocar un contrato |
| Unitarias | adapters con proveedor mockeado, extractores, `compile`, `checkApproval`, `planSteps`, logger con redacción | Vitest | `src/**/*.test.ts` | cada carril | cada PR |
| Seguridad | RLS con 2 usuarios, `get_provider_key` sin acceso de `authenticated`, SSRF (`127.0.0.1`, `169.254.169.254`, redirect), archivos falsos por extensión | Vitest + Supabase local | `src/lib/server/*.test.ts`, `supabase/tests/` | A + C | PR que toque auth/llaves/ingesta |
| Contrato React↔Liquid | cada `type` tiene componente, sección Liquid, caso en `SectionRenderer` y mapeo | `/forja-contract-check` | — | B + C | PR que toque secciones |
| Prompts | 5 productos dorados con rúbrica, antes/después | `/forja-prompt-lab` | `golden/01..05` | A | cambio de prompt |
| E2E | registro → llaves (mock) → inputs → preview → aprobar → plan | Playwright | `e2e/*.spec.ts` | C | antes de demo y de merge a `main` |
| Fidelidad visual | captura del preview vs. tienda de desarrollo, por sección | Playwright `toHaveScreenshot` | `e2e/fidelity.spec.ts` | C | después de cada publicación de prueba |
| Smoke Shopify | token, `shop`, producto con 1 imagen, metafield, app block, verificación de hash | script C1 | `scripts/shopify-smoke.ts` | C | día 0 y tras cambiar scopes |
| Ensayo de demo | flujo real cronometrado | `/forja-demo` | `docs/03-demo-runbook.md` | todos | antes de tarima |

## Fixtures
- `golden/00-fixture/` — producto **ficticio** usado por la prueba en seco (incluye una instrucción embebida en el audio para probar prompt injection).
- `golden/01..05/` — productos reales del equipo para prompt-lab (pendiente, tarea A8).
- Las salidas van a `golden/**/outputs/` (gitignored).

## Criterio de "verde" para integrar a `main`
`check` + `dry-run` + tests del carril + (si aplica) `/forja-contract-check` y revisión de seguridad sin críticos.
