# AGENTS.md — FORJA (para Codex y otros agentes)

Lee `CLAUDE.md`: es la fuente de verdad (flujo, contratos, carriles, reglas y mapa de documentos). Este archivo no repite reglas.

Mínimo operativo:
- Contratos: `.claude/skills/forja-pagespec/`, `forja-product-dna/` y `forja-contracts/` (se copian a `src/contracts/`). Cambios solo con ADR en `docs/04-decisiones.md`.
- Tareas: `docs/11-backlog.md`. Equipo y carpetas por carril: `docs/10-guia-equipo.md`.
- Shopify: `docs/06-version-aprobacion-publicacion.md` (ADR-007). Seguridad: `docs/07-modelo-amenazas.md`.
- Checks: `npm --prefix tools/kit run check` y `npm --prefix tools/kit run dry-run`.
- `.agents/` y `.codex/` (exportación a Codex) deben regenerarse desde `.claude/`; hoy están desalineados (ver `docs/05-diagnostico.md`).
