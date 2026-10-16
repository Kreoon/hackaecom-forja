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
│  c compile(spec) → Liquid → plan A | B | C   │
│  d preview → ✓ → publish                     │
└───────────────┬──────────────────────────────┘
       Supabase (Auth, Postgres+RLS, Vault, Storage, Realtime)
       Proveedores IA del usuario · Shopify Admin GraphQL 2026-10
```

## Decisiones base
| Tema | Decisión | Por qué |
|---|---|---|
| App | Next.js App Router en Vercel | un repo, server actions, deploy en 1 comando |
| Jobs | funciones largas (timeout 300 s) + filas en `jobs` + Realtime | suficiente para el hackathon; Vercel Queues/Workflow después |
| IA | AI SDK + adapters propios por proveedor (BYOK) | structured output uniforme; llave del usuario por request |
| Contrato | PageSpec JSON → React y Liquid | mockup = página real; 3 carriles en paralelo |
| Estilos de página | `forja-sections.css` compartido + CSS variables | paridad visual sin depender de Tailwind en Shopify |
| Shopify auth | app del usuario en Dev Dashboard + client credentials | ya no existen custom apps desde el admin; sin OAuth público para la demo |
| Shopify tema | Plan A theme files · B Theme Access + CLI · C app block + metafield | `themeFilesUpsert`/`themeCreate` piden exención |
| Llaves | Supabase Vault + RPC security definer | nunca en texto plano ni en el cliente |

## Estructura de carpetas (objetivo)
```
src/
  contracts/            pagespec.ts, product-dna.ts            (architect)
  lib/ai/               providers/, prompts/, assets/          (A)
  lib/ingest/           extractors/, pipeline.ts               (A)
  lib/shopify/          client.ts, token.ts, compile.ts, deploy.ts (C)
  app/                  (auth)/, (app)/projects/[id]/, api/    (B)
  components/sections/  Hero.tsx … SectionRenderer.tsx         (B)
  styles/forja-sections.css                                    (B, compartido con C)
shopify/                sections/, snippets/, assets/, extensions/ (C)
supabase/migrations/                                           (architect)
golden/01..05/                                                 (A, prompt-lab)
```
