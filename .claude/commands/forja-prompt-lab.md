---
description: Evalúa un prompt contra los 5 productos dorados con la rúbrica y compara versiones
argument-hint: "<prompt-id> [instrucción de cambio]"
---

Usa el agente `forja-prompt-engineer`.

Prompt: `$ARGUMENTS`

1. Carga el prompt desde `src/lib/ai/prompts/` (o desde `.claude/skills/forja-prompts/prompts/` si aún no existe en el código).
2. Si hay instrucción de cambio, crea la versión candidata (bump de versión) sin borrar la actual.
3. Corre ambas versiones sobre `golden/01..05` (script `npm run prompt-lab -- <id>` si existe; si no, créalo en `scripts/prompt-lab.ts` usando el adapter con la llave de `.env.local`).
4. Califica con `.claude/skills/forja-prompts/prompts/rubric.md` y muestra tabla antes/después por criterio, costo y latencia.
5. Recomienda aceptar o no. Si se acepta, registra una línea en `docs/04-decisiones.md`.
