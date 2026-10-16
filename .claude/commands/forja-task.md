---
description: Enruta una tarea al agente especialista correcto, con el contrato y el skill adecuados
argument-hint: "<descripción de la tarea>"
---

Tarea: $ARGUMENTS

1. Lee `.claude/lane.local` (carril del usuario) y `CLAUDE.md`.
2. Si la tarea toca `src/contracts/**`, `supabase/migrations/**` o cruza carriles → primero `forja-architect` para el plan.
3. Enruta según el tema:
   - ingesta, audio, PDF, scraping, ProductDNA → `forja-ingest`
   - prompts o salidas malas de IA → `forja-prompt-engineer`
   - tokens, look & feel → `forja-brand-director`
   - copy → `forja-copy-chief`
   - imágenes, GIF, video → `forja-visual-producer`
   - componentes de sección, editor, mockup, aprobación → `forja-page-composer`
   - Shopify API, conexión, deploy → `forja-shopify-engineer`
   - Liquid, compilador → `forja-liquid-compiler`
   - llaves, RLS, seguridad → `forja-byok-guardian`
4. Lanza el agente con: la tarea, los archivos del carril, el skill a leer y el criterio de "hecho" (test o verificación concreta).
5. Al terminar: corre tests del área, propone commit `feat(<carril>): …` y marca la tarea en `docs/02-plan-equipo.md` y una línea en `docs/estado.md`.
