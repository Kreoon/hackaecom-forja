# 13 · Catálogo de agentes

Generado el 2026-10-16. **17 agentes base** (generalistas por área) + **119 especialistas** con alcance acotado.
Regla de uso: para una tarea amplia, el agente base; para una pieza concreta, el especialista. Si dudas, `forja-orchestrator` decide.
Varios especialistas pueden correr en paralelo (`/forja-parallel`) siempre que sus archivos no se solapen.

## A · Cerebro + backend (47)

| Agente | Rol | Archivos | Generalista |
|---|---|---|---|
| `forja-openrouter-adapter` | Especialista del adapter de OpenRouter (proveedor principal de LLM e imagen, ADR-010) | `src/lib/ai/providers/openrouter.ts`, `src/lib/ai/models.ts` (catálogo de modelos por capacidad) y sus tests | `forja-backend` |
| `forja-gemini-adapter` | Especialista del adapter de Gemini | `src/lib/ai/providers/gemini.ts` y su test | `forja-backend` |
| `forja-openai-adapter` | Especialista del adapter de OpenAI | `src/lib/ai/providers/openai.ts` y su test | `forja-backend` |
| `forja-anthropic-adapter` | Especialista del adapter de Anthropic | `src/lib/ai/providers/anthropic.ts` y su test | `forja-backend` |
| `forja-scraper-adapter` | Especialista de adapters de scraping (Firecrawl y Apify) | `src/lib/ai/providers/firecrawl.ts`, `apify.ts` | `forja-ingest` |
| `forja-media-gen-adapter` | Especialista de adapters de generación multimedia asíncrona (fal, Magnific, KIE, Replicate) | `src/lib/ai/providers/{fal,magnific,kie,replicate}.ts` | `forja-visual-producer` |
| `forja-voice-adapter` | Especialista de audio (transcripción y voz: OpenAI, Gemini, ElevenLabs) | `src/lib/ai/providers/elevenlabs.ts`, `src/lib/ai/transcribe.ts` | `forja-ingest` |
| `forja-provider-router` | Especialista de `resolveProvider`: orden de preferencia, capacidades y fallback entre proveedores | `src/lib/ai/router.ts` | `forja-backend` |
| `forja-structured-output` | Especialista en salidas estructuradas: Zod → JSON schema por proveedor y reparación de salidas inválidas | `src/lib/ai/structured.ts` | `forja-prompt-engineer` |
| `forja-token-budget` | Especialista en presupuesto de contexto, latencia y costo por llamada | `src/lib/ai/budget.ts` | `forja-prompt-engineer` |
| `forja-key-vault` | Especialista en guardar, rotar y revocar llaves en Supabase Vault | `src/lib/server/keys.ts`, propuesta de migración de RPC | `forja-backend` |
| `forja-key-validator` | Especialista en validar llaves al guardarlas y revalidarlas ante `invalid_key` | `src/lib/server/key-validation.ts` | `forja-backend` |
| `forja-usage-meter` | Especialista en registro de uso y costo estimado (`usage_events`) | `src/lib/server/usage.ts` | `forja-backend` |
| `forja-rate-limiter` | Especialista en límites por usuario y proveedor | `src/lib/server/rate-limit.ts` | `forja-backend` |
| `forja-job-runner` | Especialista del runner de jobs (cola en tabla, idempotencia, Realtime) | `src/lib/server/jobs.ts` | `forja-backend` |
| `forja-retry-policy` | Especialista en clasificación de errores y política de reintentos | `src/lib/server/retry.ts` | `forja-backend` |
| `forja-job-cancellation` | Especialista en cancelación de jobs y llamadas largas | `src/lib/server/cancel.ts` | `forja-backend` |
| `forja-upload-validator` | Especialista en validación de archivos subidos | `src/lib/ingest/validate.ts` | `forja-ingest` |
| `forja-url-fetcher` | Especialista en descarga segura de URLs (anti-SSRF) | `src/lib/ingest/fetch-url.ts` | `forja-ingest` |
| `forja-photo-extractor` | Especialista del extractor de fotos del producto | `src/lib/ingest/extractors/photo.ts` | `forja-ingest` |
| `forja-audio-extractor` | Especialista del extractor de notas de voz | `src/lib/ingest/extractors/audio.ts` | `forja-ingest` |
| `forja-document-extractor` | Especialista del extractor de PDFs, investigaciones y texto | `src/lib/ingest/extractors/document.ts` | `forja-ingest` |
| `forja-reference-analyzer` | Especialista en convertir webs e imágenes de referencia en takeaways de estilo y estructura | `src/lib/ingest/extractors/reference.ts` | `forja-brand-director` |
| `forja-photo-enhancer` | Especialista en mejorar la foto original antes de generar (recorte, fondo, luz) | `src/lib/ai/assets/enhance.ts` | `forja-visual-producer` |
| `forja-provenance-tracker` | Especialista en procedencia de cada dato del Brief | `src/lib/ai/provenance.ts` | `forja-ingest` |
| `forja-dna-synthesizer` | Especialista en la síntesis `dna.synthesize` | `src/lib/ai/brief.ts` (síntesis) | `forja-ingest` |
| `forja-question-generator` | Especialista en preguntas pendientes del Brief | `src/lib/ai/questions.ts` | `forja-ingest` |
| `forja-risk-flagger` | Especialista en categorías y afirmaciones de riesgo (salud, antes/después, garantías, marcas) | `src/lib/ai/risk.ts` | `forja-copy-chief` |
| `forja-claim-auditor` | Auditor de afirmaciones del PageSpec contra el Brief | ninguno (solo lectura) | `forja-copy-chief` |
| `forja-locale-adapter` | Especialista en localización LATAM (moneda, formato, modismos por país) | `src/lib/ai/locale.ts` | `forja-copy-chief` |
| `forja-page-outliner` | Especialista en la estructura de la página (qué secciones y en qué orden) | `src/lib/ai/compose/outline.ts` | `forja-prompt-engineer` |
| `forja-headline-writer` | Especialista en titulares, subtítulos y CTAs | prompts de copy de hero/CTA | `forja-copy-chief` |
| `forja-offer-designer` | Especialista en la sección de oferta (packs, precios, bonus, garantía) | prompt/lógica de la sección `offer` | `forja-copy-chief` |
| `forja-faq-writer` | Especialista en FAQ a partir de objeciones | prompt de la sección `faq` | `forja-copy-chief` |
| `forja-section-regenerator` | Especialista en `section.regenerate` | `src/lib/ai/compose/regenerate.ts` | `forja-prompt-engineer` |
| `forja-image-prompter` | Especialista en prompts de imagen por sección (`asset.image_prompts`) | prompt `asset.image_prompts` | `forja-visual-producer` |
| `forja-motion-prompter` | Especialista en prompts de animación image-to-video | prompt `asset.motion_prompt` | `forja-visual-producer` |
| `forja-image-qa` | Revisor de fidelidad de imágenes generadas frente a la foto real | ninguno (solo lectura) | `forja-visual-producer` |
| `forja-asset-optimizer` | Especialista en optimización de assets (WebP, tamaños, MP4 liviano) | `src/lib/ai/assets/optimize.ts` | `forja-visual-producer` |
| `forja-golden-curator` | Curador de productos dorados | `golden/**` | `forja-prompt-engineer` |
| `forja-eval-runner` | Especialista en automatizar la rúbrica de prompts | `scripts/prompt-lab.ts` | `forja-prompt-engineer` |
| `forja-auth-flows` | Especialista en registro, inicio de sesión y recuperación de acceso | `src/lib/server/auth.ts`, `src/middleware.ts` | `forja-backend` |
| `forja-migration-writer` | Especialista en migraciones SQL de Supabase | `supabase/migrations/**` (aprobación de `forja-architect`) | `forja-architect` |
| `forja-rls-tester` | Especialista en pruebas de aislamiento entre cuentas | `supabase/tests/**` | `forja-backend` |
| `forja-storage-manager` | Especialista en Supabase Storage (bucket privado, URLs firmadas, retención) | `src/lib/server/storage.ts` | `forja-backend` |
| `forja-realtime` | Especialista en Supabase Realtime para progreso | `src/lib/server/realtime.ts` | `forja-backend` |
| `forja-data-retention` | Especialista en borrado y exportación de datos del usuario | `src/lib/server/account.ts` | `forja-backend` |

## B · Producto + app + preview (27)

| Agente | Rol | Archivos | Generalista |
|---|---|---|---|
| `forja-ux-flows` | Especialista en flujos de usuario de punta a punta | `docs/ux/**` | `forja-page-composer` |
| `forja-design-system` | Especialista del sistema de diseño de la app (no de la landing) | `src/styles/app.css`, `components.json` | `forja-page-composer` |
| `forja-auth-ui` | Especialista en pantallas de acceso | `src/app/(auth)/**` | `forja-page-composer` |
| `forja-onboarding-ui` | Especialista en el primer uso guiado | `src/app/(app)/onboarding/**` | `forja-page-composer` |
| `forja-keys-ui` | Especialista en la pantalla de llaves BYOK | `src/app/(app)/settings/keys/**` | `forja-page-composer` |
| `forja-shop-connect-ui` | Especialista en la pantalla de conexión de tienda | `src/app/(app)/settings/shop/**` | `forja-page-composer` |
| `forja-dashboard-ui` | Especialista en la lista de proyectos | `src/app/(app)/projects/page.tsx` | `forja-page-composer` |
| `forja-upload-ui` | Especialista en la carga de materiales | `src/app/(app)/projects/new/**` | `forja-page-composer` |
| `forja-audio-recorder` | Especialista en grabar audio en el navegador | `src/components/audio-recorder/**` | `forja-page-composer` |
| `forja-brief-ui` | Especialista en la pantalla de Brief | `src/app/(app)/projects/[id]/brief/**` | `forja-page-composer` |
| `forja-progress-ui` | Especialista en el progreso del pipeline en vivo | `src/components/progress/**` | `forja-page-composer` |
| `forja-responsive-preview` | Especialista en el contenedor del preview | `src/components/preview/**` | `forja-page-composer` |
| `forja-section-hero-offer` | Especialista en secciones de conversión (announcement, hero, offer, cta_banner, whatsapp_cta) | `src/components/sections/{Announcement,Hero,Offer,CtaBanner,WhatsappCta}.tsx` | `forja-page-composer` |
| `forja-section-trust` | Especialista en secciones de confianza (benefits, problem_solution, social_proof, comparison, faq, how_it_works) | `src/components/sections/{Benefits,ProblemSolution,SocialProof,Comparison,Faq,HowItWorks}.tsx` | `forja-page-composer` |
| `forja-section-media` | Especialista en secciones multimedia (gallery, video, features_media) | `src/components/sections/{Gallery,Video,FeaturesMedia}.tsx` | `forja-page-composer` |
| `forja-inline-editor` | Especialista en edición dentro del preview | `src/components/editor/**` | `forja-page-composer` |
| `forja-version-history-ui` | Especialista en historial de versiones | `src/components/versions/**` | `forja-page-composer` |
| `forja-approval-ui` | Especialista en la pantalla de aprobación | `src/app/(app)/projects/[id]/approve/**` | `forja-page-composer` |
| `forja-publish-status-ui` | Especialista en el estado de la publicación | `src/components/publication/**` | `forja-page-composer` |
| `forja-settings-ui` | Especialista en ajustes de cuenta | `src/app/(app)/settings/**` (excepto keys y shop) | `forja-page-composer` |
| `forja-cost-ui` | Especialista en mostrar consumo y costo estimado | `src/components/usage/**` | `forja-page-composer` |
| `forja-empty-error-states` | Especialista en estados vacíos, de carga y de error | `src/components/states/**` | `forja-page-composer` |
| `forja-a11y-auditor` | Auditor de accesibilidad de la app y de las landings | ninguno (solo lectura) | `forja-page-composer` |
| `forja-i18n-ui` | Especialista en textos de la interfaz | `src/i18n/**` | `forja-page-composer` |
| `forja-stage-mode` | Especialista en el modo tarima (pantalla gigante) | `src/styles/stage.css`, toggle de modo | `forja-page-composer` |
| `forja-state-management` | Especialista en datos en el cliente (Server Actions, caché, revalidación) | `src/lib/client/**` | `forja-page-composer` |
| `forja-form-validation` | Especialista en formularios con Zod | `src/components/forms/**` | `forja-page-composer` |

## C · Shopify + calidad + infra (34)

| Agente | Rol | Archivos | Generalista |
|---|---|---|---|
| `forja-shopify-auth` | Especialista en autenticación con Shopify | `src/lib/shopify/token.ts` | `forja-shopify-engineer` |
| `forja-shopify-product` | Especialista en productos y variantes | `src/lib/shopify/product.ts` | `forja-shopify-engineer` |
| `forja-shopify-media` | Especialista en archivos y media de Shopify | `src/lib/shopify/media.ts` | `forja-shopify-engineer` |
| `forja-shopify-metafields` | Especialista en metafields | `src/lib/shopify/metafields.ts` | `forja-shopify-engineer` |
| `forja-theme-extension` | Especialista en la theme app extension | `shopify/extensions/forja-landing/**` | `forja-liquid-compiler` |
| `forja-liquid-conversion` | Especialista Liquid de secciones de conversión | `shopify/extensions/forja-landing/snippets/forja-{announcement,hero,offer,cta-banner,whatsapp}.liquid` | `forja-liquid-compiler` |
| `forja-liquid-trust` | Especialista Liquid de secciones de confianza | `shopify/extensions/forja-landing/snippets/forja-{benefits,problem,social,comparison,faq,steps}.liquid` | `forja-liquid-compiler` |
| `forja-liquid-media` | Especialista Liquid de secciones multimedia | `shopify/extensions/forja-landing/snippets/forja-{gallery,video,features}.liquid` | `forja-liquid-compiler` |
| `forja-theme-compat` | Especialista en compatibilidad con temas del comerciante | `src/lib/shopify/theme-detect.ts`, `.forja-root` en CSS | `forja-shopify-engineer` |
| `forja-shopify-pages` | Especialista en la estrategia `page` (pageCreate/pageUpdate) | `src/lib/shopify/page.ts` | `forja-shopify-engineer` |
| `forja-publish-planner` | Especialista en planes de publicación | `src/lib/publish/plan.ts` | `forja-shopify-engineer` |
| `forja-publish-executor` | Especialista en ejecutar publicaciones con checkpoints | `src/lib/publish/run.ts` | `forja-shopify-engineer` |
| `forja-storefront-verifier` | Especialista en verificar lo publicado | `src/lib/publish/verify.ts` | `forja-qa-fidelity` |
| `forja-rollback-engineer` | Especialista en deshacer publicaciones | `src/lib/publish/rollback.ts` | `forja-shopify-engineer` |
| `forja-shopify-throttle` | Especialista en límites de la Admin API | `src/lib/shopify/client.ts` (capa de throttling) | `forja-shopify-engineer` |
| `forja-graphql-validator` | Validador de queries y mutations de Shopify | ninguno (solo lectura) | `forja-shopify-engineer` |
| `forja-shopify-webhooks` | Especialista en webhooks de Shopify | `src/app/api/shopify/webhooks/**` | `forja-shopify-engineer` |
| `forja-public-app-planner` | Planificador de la app pública de Shopify (fase 2) | docs/fase2-app-publica.md (a crear) | `forja-architect` |
| `forja-seo-structured-data` | Especialista en SEO técnico de la landing publicada | snippet SEO en la extensión, campo `seo` del PageSpec | `forja-liquid-compiler` |
| `forja-liquid-perf` | Auditor de rendimiento de la landing en Shopify | ninguno (solo lectura) | `forja-liquid-compiler` |
| `forja-unit-tester` | Especialista en pruebas unitarias con Vitest | `**/*.test.ts` (coordinando con el dueño del módulo) | `forja-qa-fidelity` |
| `forja-e2e-writer` | Especialista en e2e con Playwright | `e2e/**` | `forja-qa-fidelity` |
| `forja-visual-diff` | Especialista en diff visual preview ↔ tienda | `e2e/fidelity.spec.ts` | `forja-qa-fidelity` |
| `forja-mock-server` | Especialista en mocks de proveedores y Shopify | `test/mocks/**` | `forja-qa-fidelity` |
| `forja-fixture-builder` | Especialista en fixtures de prueba | `golden/00-*`, `test/fixtures/**` | `forja-qa-fidelity` |
| `forja-perf-auditor` | Auditor de rendimiento de la app FORJA | ninguno (solo lectura) | `forja-qa-fidelity` |
| `forja-ci-pipeline` | Especialista en GitHub Actions | `.github/workflows/**` | `forja-devops` |
| `forja-vercel-config` | Especialista en configuración de Vercel | `vercel.ts` | `forja-devops` |
| `forja-env-manager` | Especialista en variables de entorno | `.env.example`, docs/entornos.md (a crear) | `forja-devops` |
| `forja-observability` | Especialista en logs, métricas y trazas | `src/lib/server/log.ts` (con A) | `forja-devops` |
| `forja-incident-responder` | Especialista en incidentes | ninguno (solo lectura; propone fixes) | `forja-devops` |
| `forja-release-manager` | Especialista en releases | `CHANGELOG.md`, docs/release.md (a crear) | `forja-devops` |
| `forja-dependency-auditor` | Auditor de dependencias | ninguno (solo lectura) | `forja-devops` |
| `forja-infra-cost` | Especialista en costos de la plataforma (no BYOK) | docs/costos-plataforma.md (a crear) | `forja-devops` |

## Transversal (11)

| Agente | Rol | Archivos | Generalista |
|---|---|---|---|
| `forja-code-reviewer` | Revisor de código antes del PR | ninguno (solo lectura) | `forja-orchestrator` |
| `forja-contract-guard` | Vigilante de contratos | ninguno (solo lectura) | `forja-architect` |
| `forja-lane-guard` | Vigilante de carriles | ninguno (solo lectura) | `forja-orchestrator` |
| `forja-backlog-groomer` | Especialista en el backlog | `docs/11-backlog.md` | `forja-orchestrator` |
| `forja-adr-scribe` | Redactor de ADR | borradores en `docs/04-decisiones.md` | `forja-architect` |
| `forja-api-mark-scout` | Investigador dedicado a identificar «API MARK» | fila en `docs/09-herramientas.md` y `docs/fuentes.md` | `forja-docs-researcher` |
| `forja-legal-terms` | Especialista en términos, privacidad y BYOK | `docs/legal/**` (borradores) | `forja-docs-researcher` |
| `forja-user-docs` | Especialista en documentación para el usuario final | `docs/usuario/**` | `forja-context-keeper` |
| `forja-tech-debt` | Registrador de deuda técnica | ninguno (propone filas al backlog) | `forja-orchestrator` |
| `forja-demo-scriptwriter` | Guionista de la demo y del pitch | `docs/03-demo-runbook.md` (sección guion) | `forja-demo-qa` |
| `forja-retro-facilitator` | Facilitador de retrospectivas | `docs/retros/**` | `forja-context-keeper` |
