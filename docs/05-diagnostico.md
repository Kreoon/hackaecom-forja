# 05 · Diagnóstico del estado real (2026-10-16)

Evidencia: inspección del árbol, `git log`, `git status`, `gh pr list`, `gh issue list` y versiones locales, ejecutados el 2026-10-16.
Estados: **Implementado** · **Parcial** · **Propuesto** (documentado, sin código) · **Bloqueado** (falta algo externo).

## Repositorio
| Dato | Valor observado |
|---|---|
| Remoto | `Kreoon/hackaecom-forja`, solo `origin/main` |
| Historial | 3 commits (AlexanderKast, 2026-10-16): kit inicial, fix de RLS de tiendas, reemplazo de skills de terceros |
| Sin confirmar | `.agents/` y `.codex/` (export del kit a Codex; ver abajo). **No se modifican** |
| PRs / issues | Ninguno |
| CI | No existe `.github/` antes de este paquete |
| App | **No hay `package.json` ni `src/`**: la app no está creada |
| Entorno local del autor | Node 24.16, Claude Code 2.1.284, gh 2.96, Supabase CLI 2.120; Shopify CLI no instalado |

## Qué existe
| Pieza | Estado | Evidencia |
|---|---|---|
| CLAUDE.md / AGENTS.md / README | Implementado | AGENTS.md apunta a CLAUDE.md (fuente única) |
| 11 agentes `forja-*` | Implementado (ajustados en este paquete) | `.claude/agents/`; 2 tenían `color: magenta`, valor no válido según la doc |
| 17 skills de dominio | Implementado | `.claude/skills/forja-*` |
| 6 comandos | Implementado | `.claude/commands/` |
| Hooks | Implementado | `guard-secrets.mjs` (bloquea secretos, exit 2), `session-context.mjs` |
| Mod `forja-hud` | Implementado | `mods/forja-hud/` (banda de carril, `/forja-lane`, aviso al editar fuera del carril); test `lanes.test.ts` usa `claude-code/testing` |
| Contratos PageSpec / ProductDNA | Parcial (referencia) | `.claude/skills/forja-pagespec/reference/pagespec.ts`, `example.json`, `forja-product-dna/reference/product-dna.ts`; aún no copiados a `src/contracts/` |
| Migración Supabase | Parcial (referencia) | `forja-supabase-schema/reference/0001_init.sql`; no aplicada |
| Prompts v1 + rúbrica | Parcial (referencia) | `forja-prompts/prompts/` |
| Productos dorados | Propuesto | `golden/README.md` sin carpetas |
| Smoke test Shopify (C1) | **Bloqueado** | Requiere tienda de desarrollo + app de Dev Dashboard; ADR-003 abierto |
| Estrategia de tema "Plan A" (theme files) | **Bloqueado** | La doc confirma que necesita exención de Shopify (ver `fuentes.md`) |

## Defectos encontrados en el trabajo sin confirmar (`.agents/`, `.codex/`)
- Rutas reescritas a `.Codex/skills/...` (no existen).
- `.codex/hooks.json` con ruta absoluta de Windows de un equipo concreto.
- `forja-product-dna` y `forja-prompts` difieren de `.claude/skills/`.
Recomendación para su autor: regenerarlo desde `.claude/` antes de confirmarlo, o añadirlo a `.gitignore`.

## Decisiones existentes
ADR-001 (PageSpec como contrato único) y ADR-002 (app propia del usuario + client credentials) cerrados; ADR-003 (estrategia de tema) pendiente. Este paquete agrega ADR-004 en adelante en `docs/04-decisiones.md`.

## Interpretaciones registradas
- **TodoIA**: no hay repositorio accesible con ese nombre (búsqueda en `D:\Github`, orgs `Kreoon` y `AlexanderKast`). La única pista es "Tododeia claude-webkit" (MIT, Enrique Rocha), 15 skills de diseño que el kit incluyó en `5198e46` y retiró en `7115816`. Interpretación probable, **no confirmada**.
- **mods**: sí es tecnología identificada: mods de Claude Code (plugin con módulo de hooks). Ejemplo: `mods/forja-hud`.
- **"API MARK"**: sin identificar. Candidato más probable: APIMart (apimart.ai), sin confirmar. Ver `docs/09-herramientas.md`.

## Inventario de reutilización
| Componente | Origen | Licencia / permiso | Utilidad | Dependencias | Adaptación | Riesgo |
|---|---|---|---|---|---|---|
| `pagespec.ts` + `example.json` | Este repo | Propio | Contrato preview ↔ Shopify | zod | Copiar a `src/contracts/`; añadir hash (ver `forja-contracts`) | Cambios sin ADR rompen 3 carriles |
| `product-dna.ts` | Este repo | Propio | Brief/evidencia | zod | Base de `Brief` | Procedencia solo por input, no por fragmento |
| `0001_init.sql` | Este repo | Propio | Esquema + RLS + Vault | Supabase | Añadir tablas de aprobación/publicación (A0-db en backlog) | `get_provider_key` debe seguir sin grant a `authenticated` |
| `guard-secrets.mjs` | Este repo | Propio | Bloqueo de secretos | Node | Reutilizado por `tools/kit/check-kit.mjs` | Patrones incompletos (no cubre fal/KIE) |
| `contrast.mjs` | Este repo | Propio | Contraste AA | Node | Ninguna | — |
| `forja-motion.css/.js` | Este repo | Propio | Motion compartido | Ninguna | Copiar a `src/styles` y `shopify/assets` | Divergencia si se edita en un lado |
| Prompts v1 | Este repo | Propio | Ingesta, DNA, tokens, compose | AI SDK | Mover a `src/lib/ai/prompts/` | Sin evaluar contra golden |
| Mod `forja-hud` | Este repo | Propio | Aviso de carril | Claude Code ≥ mods | Carpetas nuevas añadidas en `lanes.ts` | API de mods puede cambiar |
| Skills Tododeia/Emil Kowalski | Historial `5198e46` | MIT (con atribución) | Diseño/motion | — | Ya reemplazadas por skills propias | Reintroducirlas exige atribución |
| Dev MCP de Shopify | `@shopify/dev-mcp` | ISC | Docs y validación GraphQL para devs | npx | Configurado en `.mcp.json` | Solo herramienta de desarrollo |
| Supabase MCP | Supabase | Apache-2.0 | Consultas de solo lectura en dev | Cuenta Supabase | `read_only=true`, proyecto de desarrollo | Prompt injection por datos |
| Plantilla de app Shopify (React Router) | Shopify | MIT | App pública posterior (multi-tienda) | Shopify CLI | Fase 2 | Stack distinto a Next.js |
