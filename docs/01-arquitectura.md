# 01 · Arquitectura de FORJA

## Diagrama
```
┌──────────── Navegador (Next.js) ────────────┐
│ Registro · Llaves (BYOK) · Conectar Shopify │
│ Subir inputs ─▶ Storage (signed upload)     │
│ Progreso en vivo ◀── Realtime(jobs)         │
│ Mockup (SectionRenderer + forja.css)        │
│ ✓ Aprobar                                    │
└───────────────┬──────────────────────────────┘
                │ Server Actions / Route Handlers (Node, Fluid Compute)
┌───────────────▼──────────────────────────────┐
│ pipeline.run(projectId)                      │
│  1 ingest.*  (paralelo)  → evidence          │  Carril A
│  2 dna.synthesize        → product_dna       │
│  3 brand.tokens          → tokens            │
│  4 page.compose          → page_spec v1      │
│  5 assets (imágenes/loop, paralelo, no bloquea)
│ deploy(projectId)                            │  Carril C
│  a token (client credentials)                │
│  b staged uploads + productSet + metafield   │
│  c metafield(spec+hash) → app block Liquid   │
│  d verificar preview → ✓ → publish           │
└───────────────┬──────────────────────────────┘
       Supabase (Auth, Postgres+RLS, Vault, Storage, Realtime)
       Proveedores IA del usuario · Shopify Admin GraphQL 2026-10
```

## Decisiones base
| Tema | Decisión | Por qué |
|---|---|---|
| App | Next.js App Router en Vercel | un repo, server actions, deploy en 1 comando |
| Jobs | funciones largas (timeout 300 s) + filas en `jobs` + Realtime | suficiente para el hackathon; Vercel Queues/Workflow después |
| IA | AI SDK + adapters propios por proveedor (BYOK), llamada directa al proveedor | structured output uniforme; llave del usuario por request; **sin** BYOK de AI Gateway (ADR-006) |
| Contrato | PageSpec JSON → React y Liquid | mockup = página real; 3 carriles en paralelo |
| Estilos de página | `forja-sections.css` compartido + CSS variables | paridad visual sin depender de Tailwind en Shopify |
| Shopify auth | app del usuario en Dev Dashboard + client credentials | ya no existen custom apps desde el admin; sin OAuth público para la demo |
| Shopify tema | **MVP: app block (theme app extension) + metafield**; theme files solo si Shopify concede exención; Theme Access descartado para producto | ver ADR-007 y `06-version-aprobacion-publicacion.md` |
| Llaves | Supabase Vault + RPC security definer | nunca en texto plano ni en el cliente |

## Estructura de carpetas (objetivo)
```
src/
  contracts/            pagespec, product-dna, provider, asset, brief, approval, publication, states (architect)
  lib/ai/               providers/, prompts/, assets/          (A)
  lib/ingest/           extractors/, pipeline.ts               (A)
  lib/shopify/          client.ts, token.ts, compile.ts, deploy.ts (C)
  lib/publish/          approval.ts, plan.ts, verify.ts           (C)
  lib/server/           auth.ts, keys.ts, jobs.ts, log.ts         (A)
  app/                  (auth)/, (app)/projects/[id]/, api/    (B)
  components/sections/  Hero.tsx … SectionRenderer.tsx         (B)
  styles/forja-sections.css                                    (B, compartido con C)
shopify/                sections/, snippets/, assets/, extensions/ (C)
supabase/migrations/                                           (architect)
golden/00..05/                                                 (A, prompt-lab; 00 = fixture)
e2e/                  pruebas Playwright                         (C)
tools/kit/            validador del kit + prueba en seco         (todos)
```

## MVP y fases (actualizado 2026-10-16)
| Capacidad | MVP | Después |
|---|---|---|
| Cuentas | Email + contraseña (Supabase Auth), recuperación por email, 1 usuario = 1 espacio | Equipos/organizaciones, roles, SSO |
| BYOK | **OpenRouter** (LLM + imagen, ADR-010); Gemini/OpenAI/Anthropic directos como alternativa; scraper opcional (Firecrawl o Apify) | fal, Magnific, KIE, ElevenLabs, Replicate; "API MARK" cuando se identifique |
| Ingesta | foto, audio (subido o grabado), PDF, texto, URL de referencia, imágenes de referencia | video del producto, catálogo CSV |
| Brief | ProductDNA + procedencia + preguntas pendientes (`brief.ts`) | edición colaborativa |
| Generación | copy + estructura (PageSpec) + imágenes con la foto real como referencia | video/animación (si el proveedor lo permite), variantes A/B |
| Preview | render del PageSpec, edición de texto, regenerar sección, versiones | editor visual libre, comentarios |
| Shopify | tiendas de desarrollo de la organización (client credentials), app block + metafield, modo draft + preview, verificación | app pública multi-tienda (OAuth/token exchange), Billing, webhooks de privacidad |
| Jobs | funciones largas + tabla `jobs` + Realtime, reintentos y cancelación | cola durable (Vercel Queues/Workflow, Inngest o Trigger.dev; ver `09-herramientas.md`) |

## Módulos y límites
| Módulo | Carpeta | Carril | Contrato de entrada → salida |
|---|---|---|---|
| Auth y sesión | `src/app/(auth)`, `src/lib/server/auth.ts` | A (server) + B (UI) | Supabase Auth → `user.id` |
| Aislamiento | RLS en `supabase/migrations` | architect | `user_id = auth.uid()` en toda tabla |
| Llaves BYOK | `src/lib/server/keys.ts` (RPC Vault) | A | llave → `provider_keys(last4, status)`; nunca vuelve al cliente |
| Proveedores | `src/lib/ai/providers/*` | A | `ProviderAdapter` (`provider.ts`) |
| Ingesta | `src/lib/ingest/*` | A | `inputs` → `Evidence[]` |
| Brief | `src/lib/ai/brief.ts` | A | `Evidence[]` + formulario → `Brief` |
| Composición | `src/lib/ai/compose.ts` | A | `Brief` + tokens → `PageSpec` (sin assets generados) |
| Assets | `src/lib/ai/assets/*` | A | PageSpec → `AssetRecord[]` (no bloquea) |
| Jobs | `src/lib/server/jobs.ts` | A | `Job` (`jobs.ts`), Realtime |
| Preview/editor | `src/components/sections`, `src/app/(app)/projects/[id]` | B | `PageSpec` → UI; edición → nueva versión |
| Aprobación | `src/lib/publish/approval.ts` | C (lógica) + B (UI) | versión + hash + destino → `Approval` |
| Publicación | `src/lib/shopify/*`, `src/lib/publish/*`, `shopify/` | C | `Approval` → `Publication` |
| Observabilidad | `src/lib/server/log.ts` | C | logs con redacción + `jobs`/`publications` como auditoría |

## Ingesta y procedencia
1. Upload directo a Storage (URL firmada) en `<user_id>/<project_id>/`; el servidor recibe solo rutas.
2. Validación (tipo por magic bytes, tamaño, páginas) y registro en `inputs` + `AssetRecord` con `sha256`.
3. Extractores en paralelo (`Promise.allSettled`), uno por tipo; cada uno = un `Job`.
4. Cada dato del Brief guarda `ProvenanceSchema` (input, ubicación, cita, confianza). La UI muestra la fuente al pasar el cursor y pide confirmar lo < 0.6.
5. URLs pasan por el filtro anti-SSRF (`07-modelo-amenazas.md`, T6) o por el scraper BYOK del usuario.

## Orquestación de modelos
`resolveProvider(userId, capability)` elige según el orden del usuario y las capacidades declaradas en cada `ProviderManifest`. Sin llave para una capacidad → el paso se omite con aviso (p. ej. sin imagen generada se usa la foto original + motion CSS). Prompts versionados en `src/lib/ai/prompts/` (skill `forja-prompts`).

## Observabilidad
- Cada job y publicación queda en base con estado, intento, duración y error tipado (`ProviderErrorCode` o código de Shopify).
- Logs estructurados (JSON) con `projectId`, `jobId`, `userId` y redacción de secretos; nunca prompts completos con datos del usuario en producción.
- Panel del proyecto: progreso en vivo, costo estimado (`usage_events`) y estado de la publicación.

Ver también: [06 · versión, aprobación y publicación](06-version-aprobacion-publicacion.md) · [07 · amenazas](07-modelo-amenazas.md) · [08 · pruebas](08-plan-pruebas.md) · [contratos](../.claude/skills/forja-contracts/SKILL.md).
