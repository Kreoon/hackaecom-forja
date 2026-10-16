# FORJA · Tiendas Shopify con IA — Escuadrón 02 (HackaEcom 2026)

> Subes fotos, un audio, un PDF, una web o imágenes de referencia. FORJA entiende el producto,
> diseña la página, te muestra el mockup y, cuando le das ✓, la deja **publicada en tu Shopify**.

Este repo es el **kit de arranque**: agentes, skills, prompts, contratos y comandos ya afinados.
El producto se construye en vivo, desde cero, por 3 personas. Nada de la app existe todavía;
lo que existe es el equipo de agentes que la construye rápido y bien.

## Producto (qué construimos)
1. **Registro** (email + contraseña) con Supabase Auth.
2. **BYOK**: cada usuario carga SUS llaves (OpenAI, Gemini, Anthropic, fal, Magnific, KIE, Apify, Firecrawl…). FORJA no paga IA de nadie.
3. **Conecta SU Shopify** (app propia del usuario en Dev Dashboard → client credentials).
4. **Ingesta multimodal** → `ProductDNA` (fotos, audio, PDF/investigación, URL de referencia, imágenes de referencia).
5. **Dirección de marca** → `DesignTokens` (paleta, tipografías, estilo, motion) a partir de las referencias.
6. **Composición** → `PageSpec` (JSON de secciones) + copy + assets generados (imágenes, GIF/animaciones).
7. **Mockup** en FORJA renderizado desde el mismo `PageSpec`. El usuario edita/regenera por sección.
8. **✓ Aprobar** → compilar `PageSpec` a Shopify (producto + media + secciones Liquid/template) y publicar.

## El contrato que lo une todo
```
Inputs ─▶ ProductDNA ─▶ DesignTokens ─▶ PageSpec ─┬─▶ Mockup (React)      [Carril B]
 [Carril A]            [Carril A]      [A+B]      └─▶ Shopify (Liquid)    [Carril C]
```
`PageSpec` es la única fuente de verdad. El mockup y Shopify **renderizan lo mismo**.
Schemas en `.claude/skills/forja-pagespec/` y `.claude/skills/forja-product-dna/`. **Nadie cambia un contrato sin pasar por `forja-architect`.**

## Stack
Next.js (App Router) + TypeScript + Tailwind + shadcn/ui · Supabase (Auth, Postgres+RLS, Storage, Vault) · Vercel · Zod · AI SDK · Shopify GraphQL Admin API. Tests con Vitest.

## Carriles del equipo (3 personas)
| Carril | Dueño | Qué entrega | Agentes |
|---|---|---|---|
| **A · Cerebro IA** | _asignar_ | ingesta, ProductDNA, tokens, copy, imágenes/animación, BYOK adapters | `forja-ingest`, `forja-prompt-engineer`, `forja-brand-director`, `forja-copy-chief`, `forja-visual-producer` |
| **B · App + Mockup** | _asignar_ | auth, onboarding de llaves, uploads, editor/mockup, flujo de aprobación | `forja-page-composer`, `frontend-designer`, `forja-byok-guardian` |
| **C · Shopify** | _asignar_ | conexión de tienda, compilador PageSpec→Liquid, deploy, verificación | `forja-shopify-engineer`, `forja-liquid-compiler` |
| Transversal | todos | contratos, QA, demo | `forja-architect`, `forja-demo-qa` |

Cada quien trabaja en su carpeta: A → `src/lib/ai/**`, `src/lib/ingest/**` · B → `src/app/**`, `src/components/**` · C → `src/lib/shopify/**`, `shopify/**`. Compartido (solo vía architect): `src/contracts/**`, `supabase/migrations/**`.

## Comandos del kit
- `/forja-start` — onboarding: eliges carril y te carga contexto y tareas.
- `/forja-task <descripción>` — enruta la tarea al agente correcto con el contrato al lado.
- `/forja-prompt-lab <prompt-id>` — prueba un prompt contra los productos dorados.
- `/forja-contract-check` — revisa que el código respete PageSpec/ProductDNA.
- `/forja-demo [producto]` — ensayo end-to-end (el "producto sorpresa").
- `/forja-standup` — estado de los 3 carriles desde git + `docs/estado.md`.

## Reglas
- Español en UI, docs y commits; código e identificadores en inglés.
- **Llaves del usuario**: se cifran (Supabase Vault), solo se descifran en servidor, nunca se loguean, nunca llegan al cliente. Ver skill `forja-byok-providers`.
- Toda salida de LLM se valida con Zod (structured output). Si falla, se reintenta una vez con el error.
- Cada sección del PageSpec debe renderizar igual en mockup y Liquid. Si agregas un tipo de sección, lo agregas en los DOS lados el mismo commit.
- Nada de diseño "genérico de IA": usar skills `frontend-design`, `emil-design-eng`, `forja-ecom-cro`.
- Antes de usar una API externa, `docs-researcher` confirma la versión (Shopify API `2026-10`).
- No publicar el tema en vivo sin ✓ explícito del usuario. Por defecto: tema/página **sin publicar** + link de preview.
- Commits pequeños por carril: `feat(a): …`, `feat(b): …`, `feat(c): …`.

## Riesgo #1 (leer antes de tocar Shopify)
`themeCreate` y `themeFilesUpsert` exigen `write_themes` **y exención de Shopify**. Plan A/B/C en `.claude/skills/forja-shopify-deploy/SKILL.md`. Validarlo es la PRIMERA tarea del carril C.

## Documentos
`docs/00-vision.md` · `docs/01-arquitectura.md` · `docs/02-plan-equipo.md` · `docs/03-demo-runbook.md` · `docs/04-decisiones.md` · `docs/estado.md`
