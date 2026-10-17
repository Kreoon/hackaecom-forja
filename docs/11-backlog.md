# 11 · Backlog priorizado

Fuente única de tareas (lo leen `/forja-start` y `/forja-standup`). Marca `[x]` al cerrar **solo tu fila**.
Tamaño: S ≤ 2 h · M ≤ 1 día · L > 1 día. "∥" = puede ir en paralelo con lo indicado.
Contratos de referencia: [`forja-contracts`](../.claude/skills/forja-contracts/SKILL.md). Arquitectura: [`01`](01-arquitectura.md), [`06`](06-version-aprobacion-publicacion.md).

## P0 · Base compartida (desbloquea a todos)
| ✓ | ID | Resultado | Área | Depende | Archivos | Aceptación | Prueba | T | ∥ |
|---|---|---|---|---|---|---|---|---|---|
| [ ] | P0-1 | Scaffold Next.js + TS + Tailwind + shadcn, `package.json` con `test`, `typecheck`, `lint` | architect (A o C) | — | raíz, `src/` | `npm run build` y `npm test` corren | CI | M | ∥ C1 |
| [ ] | P0-2 | Contratos en `src/contracts/` (pagespec, product-dna, provider, asset, brief, approval, publication, states) | architect | P0-1 | `src/contracts/**` | `tsc` limpio; `dry-run` OK | Vitest de esquemas con ejemplos | S | — |
| [ ] | P0-3 | Migración `0001_init.sql` + tablas `approvals`, `publications`, `asset_records.sha256`, `jobs.attempt/idempotency_key/cancel_requested` | architect (A) | P0-1 | `supabase/migrations/**` | aplica en Supabase local; RLS activo en todas | test RLS con 2 usuarios | M | ∥ P0-2 |
| [ ] | P0-4 | CI de la app (typecheck + test + kit-check) | C | P0-1 | `.github/workflows/**` | PR muestra checks | PR de prueba | S | ∥ |

## Carril A · Cerebro + backend
| ✓ | ID | Resultado | Depende | Archivos | Aceptación | Prueba | T | ∥ |
|---|---|---|---|---|---|---|---|---|
| [ ] | A0 | Auth servidor: helpers de sesión, middleware de rutas, recuperación de contraseña | P0-1, P0-3 | `src/lib/server/auth.ts` | rutas privadas redirigen; reset por email funciona en local | e2e C5 | S | ∥ B1 |
| [ ] | A0b | Llaves: `saveKey`, `validateKey`, `rotate`, `revoke` vía RPC Vault; logger con redacción | P0-3 | `src/lib/server/keys.ts`, `log.ts` | la UI solo recibe `last4/status`; log de prueba sin secretos | Vitest + grep de logs | M | ∥ B2 |
| [ ] | A1 | **Adapter OpenRouter** (ADR-010) + catálogo `models.ts` por capacidad (texto, visión, imagen) | P0-2, A0b | `src/lib/ai/providers/openrouter.ts`, `src/lib/ai/models.ts` | validación de llave sin gastar; structured output; imagen con foto de referencia; errores 401/402/429 mapeados | Vitest mock + 1 llamada real con `DEV_OPENROUTER_API_KEY` | M | — |
| [ ] | A1b | Adapter Gemini directo (audio/transcripción y lo que OpenRouter no cubra) | A1 | `src/lib/ai/providers/gemini.ts` | manifest verificado | Vitest mock | M | ∥ A3 |
| [ ] | A2 | Registro de prompts v1 | P0-2 | `src/lib/ai/prompts/**` | ningún prompt inline (`/forja-contract-check`) | Vitest | S | ∥ A1 |
| [ ] | A3 | Extractores photo/audio/document/url (con anti-SSRF y límites de archivo) → `Evidence` | A1, A2 | `src/lib/ingest/**` | `golden/00-fixture` produce evidence válida; SSRF bloqueado | Vitest + fixtures maliciosos | L | — |
| [ ] | A4 | `brief.ts`: síntesis → `Brief` con procedencia y preguntas | A3 | `src/lib/ai/brief.ts` | dato solo de referencia → rechazado; precio faltante → pregunta bloqueante | Vitest + prompt-lab | M | — |
| [ ] | A5 | `brand.tokens` + `page.compose` → PageSpec válido | A4 | `src/lib/ai/compose.ts` | PageSpec pasa Zod; sin claims fuera del Brief | prompt-lab golden | M | — |
| [ ] | A6 | Assets: imagen con la foto real como referencia, `sha256`, `usage_events`; video opcional no bloqueante | A1, P0-3 | `src/lib/ai/assets/**` | sin llave de imagen → usa foto original | Vitest mock | M | ∥ A4 |
| [ ] | A7 | Adapters OpenAI y Anthropic (texto/visión) | A1 | `providers/openai.ts`, `anthropic.ts` | manifests con fecha; `gpt-image-1` no usado | Vitest mock | M | ∥ A3 |
| [ ] | A8 | `golden/01..05` con productos reales + prompt-lab | A2 | `golden/**`, `scripts/prompt-lab.ts` | tabla de rúbrica antes/después | `/forja-prompt-lab` | M | ∥ |
| [ ] | A9 | Jobs: runner con reintento, cancelación, `idempotencyKey`, Realtime | P0-3 | `src/lib/server/jobs.ts` | doble clic no duplica gasto; cancelar aborta | Vitest | M | ∥ A1 |

## Carril B · Producto + app + preview
| ✓ | ID | Resultado | Depende | Archivos | Aceptación | Prueba | T | ∥ |
|---|---|---|---|---|---|---|---|---|
| [ ] | B1 | Registro/login/recuperación + layout | P0-1 | `src/app/(auth)/**` | flujo completo en local | e2e C5 | S | ∥ A0 |
| [ ] | B2 | Pantalla de llaves (capacidades por proveedor desde `ProviderManifest`, last4, estado, rotar/borrar) | A0b (o mock) | `src/app/(app)/settings/keys/**` | nunca muestra la llave completa | e2e | M | ∥ A1 |
| [ ] | B3 | Conectar Shopify (dominio + client id/secret, test de conexión, guía) | C2 (o mock) | `src/app/(app)/settings/shop/**` | muestra scopes faltantes | e2e | S | ∥ |
| [ ] | B4 | Nuevo proyecto: dropzone fotos/audio/PDF + URLs + grabar audio | A0 | `src/app/(app)/projects/new/**` | upload directo a Storage; límites visibles | e2e | M | ∥ A3 |
| [ ] | B5 | Pantalla de Brief: datos con fuente, confianza < 0.6 en amarillo, preguntas pendientes | A4 (o `brief.example.json`) | `src/app/(app)/projects/[id]/brief/**` | no deja componer con preguntas bloqueantes | e2e | M | ∥ A4 |
| [ ] | B6 | `SectionRenderer` + 14 secciones con `forja-sections.css` | P0-2 | `src/components/sections/**`, `src/styles/**` | `example.json` se ve a 390/1280 px | `/forja-contract-check`, captura | L | ∥ C4 |
| [ ] | B7 | Editor: texto, regenerar sección, lock, reordenar, versiones | B6, A5 | `src/app/(app)/projects/[id]/**` | cada cambio = nueva versión; hash visible | e2e | L | — |
| [ ] | B8 | Aprobar: muestra destino, bloqueos (claims, preguntas), crea `Approval`; estado de publicación y preview URL | B7, C3 | `src/app/(app)/projects/[id]/approve/**` | editar tras aprobar invalida | e2e | M | — |
| [ ] | B9 | Progreso del pipeline en vivo (Realtime `jobs`) | A9 | `src/components/progress/**` | estados de `JOB_MACHINE`, cancelar | e2e | M | ∥ |

## Carril C · Shopify + calidad + infra
| ✓ | ID | Resultado | Depende | Archivos | Aceptación | Prueba | T | ∥ |
|---|---|---|---|---|---|---|---|---|
| [ ] | C1 | **Smoke test** en tienda de desarrollo: client credentials, `shop`, `productSet` con 1 imagen, metafield json, `themeFilesUpsert` (esperado: ACCESS_DENIED), app block con deep link | tienda + app Dev Dashboard | `scripts/shopify-smoke.ts` | resultado anotado en ADR-003 | ejecución real (salida en PR) | M | ∥ P0-1 |
| [ ] | C2 | Cliente GraphQL tipado (userErrors, throttling, redacción) + token con caché 23 h | P0-1 | `src/lib/shopify/client.ts`, `token.ts` | errores tipados; token nunca en logs | Vitest | M | ∥ |
| [ ] | C3 | `approval.ts` + `plan.ts` + persistencia de `publications` | P0-2, P0-3 | `src/lib/publish/**` | `checkApproval` antes de cada publicación | Vitest (reusar casos del dry-run) | M | ∥ B6 |
| [ ] | C4 | Theme app extension: app block que itera el metafield con markup BEM y `data-forja-hash` | C1 | `shopify/extensions/forja-landing/**` | `shopify theme check` limpio; < 100 KB Liquid | theme check + tienda dev | L | ∥ B6 |
| [ ] | C5 | E2E Playwright del flujo con proveedores mockeados | B1–B8 en progreso | `e2e/**` | corre en CI | Playwright | M | ∥ |
| [ ] | C6 | Ejecutar plan (`upload_media`, `upsert_product`, `set_metafield`, `ensure_app_block`) con checkpoints y reanudar | C2, C3 | `src/lib/publish/run.ts` | reintento no duplica; producto ajeno no se sobrescribe | Vitest + tienda dev | L | — |
| [ ] | C7 | `verify_storefront` + deshacer (`before`) | C6, C4 | `src/lib/publish/verify.ts`, `rollback.ts` | hash coincide; deshacer deja la tienda como antes | tienda dev | M | — |
| [ ] | C8 | Observabilidad: logs estructurados, panel de jobs/publicaciones | A9 | `src/lib/server/log.ts` (con A) | sin secretos en logs | grep + test | S | ∥ |
| [ ] | C9 | Diff visual preview vs. tienda | C7, B6 | `e2e/fidelity.spec.ts` | tolerancia documentada | Playwright | M | — |

## Decisiones / bloqueos con dueño
| ID | Qué | Quién decide | Paso concreto |
|---|---|---|---|
| D1 | Identificar "API MARK" | quien lo propuso | Enviar URL del servicio; luego `/forja-provider-integration` |
| D2 | Términos de proveedores para BYOK con usuarios externos | Founder | Revisión legal antes de abrir registro público |
| D3 | Tienda de desarrollo y app en Dev Dashboard de la organización | C + Founder | Crear y compartir credenciales vía `.env.local` (nunca por chat) |
| D4 | Proyecto Supabase de desarrollo | A + Founder | Crear proyecto y entregar `SUPABASE_PROJECT_REF` |
| D5 | Exención de Shopify para escritura de tema | Founder | Solo si se quiere `theme_files`; formulario enlazado en la doc de `themeFilesUpsert` |
