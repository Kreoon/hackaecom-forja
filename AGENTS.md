# AGENTS.md — FORJA (para Codex y otros agentes)

Lee `CLAUDE.md`: es la fuente de verdad (misión, contrato PageSpec, carriles, reglas).

Resumen operativo:
- Contratos: `.claude/skills/forja-pagespec/reference/pagespec.ts` y `.claude/skills/forja-product-dna/reference/product-dna.ts` (copiados a `src/contracts/`). No los cambies sin ADR en `docs/04-decisiones.md`.
- Prompts: `.claude/skills/forja-prompts/prompts/` → `src/lib/ai/prompts/`. Nunca inline.
- Shopify: `.claude/skills/forja-shopify-deploy/SKILL.md` (GraphQL Admin `2026-10`, client credentials, plan A/B/C de tema).
- Seguridad: llaves del usuario solo en Supabase Vault y en server. Nunca en cliente, logs ni commits.
- Carpetas por carril: A `src/lib/ai|ingest`, B `src/app|components|styles`, C `src/lib/shopify` + `shopify/`.
- Español en UI/docs/commits; código en inglés. Commits `feat(a|b|c): …`.
