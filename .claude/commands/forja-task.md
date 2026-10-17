---
description: Enruta una tarea al agente especialista correcto, con el contrato y el skill adecuados
argument-hint: "<descripción de la tarea>"
---

Tarea: $ARGUMENTS

1. Lee `.claude/lane.local` (carril del usuario) y `CLAUDE.md`.
2. Si la tarea toca `src/contracts/**`, `supabase/migrations/**` o cruza carriles → primero `forja-architect` (contrato) y `forja-orchestrator` (reparto).
3. Enruta según el tema:
   - ingesta, audio, PDF, scraping, ProductDNA → `forja-ingest`
   - prompts o salidas malas de IA → `forja-prompt-engineer`
   - tokens, look & feel → `forja-brand-director`
   - copy → `forja-copy-chief`
   - imágenes, GIF, video → `forja-visual-producer`
   - componentes de sección, editor, mockup, aprobación → `forja-page-composer`
   - Shopify API, conexión, deploy → `forja-shopify-engineer`
   - Liquid, compilador → `forja-liquid-compiler`
   - auth, RLS, jobs, server de llaves, logger → `forja-backend`
   - aprobación, plan de publicación, verificación → `forja-shopify-engineer`
   - pruebas, e2e, fidelidad visual → `forja-qa-fidelity`
   - CI, entornos, observabilidad → `forja-devops`
   - API externa nueva → `forja-docs-researcher` antes que nadie
   - revisión de llaves, RLS, ingesta, seguridad → `forja-byok-guardian`
   - docs y CLAUDE.md → `forja-context-keeper`
3b. Si la tarea es una pieza concreta, busca el especialista en `docs/13-catalogo-agentes.md` (p. ej. adapter OpenRouter → `forja-openrouter-adapter`).
4. Lanza el agente con: la tarea, los archivos del carril, el skill a leer y el criterio de "hecho" (test o verificación concreta).
5. Al terminar: corre tests del área, propone commit `feat(<carril>): …`, marca la fila en `docs/11-backlog.md` y cierra con `/forja-handoff`.
