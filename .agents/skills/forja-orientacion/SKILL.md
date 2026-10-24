---
name: forja-orientacion
description: "Diagnóstico y orientación en el repositorio FORJA: estado de git, qué existe y qué falta, checks del kit, tareas abiertas del backlog y riesgos. Úsalo al iniciar una sesión, al volver después de días o cuando pregunten '¿en qué estado está el proyecto?'."
---

# /forja-orientacion
## Entradas
Ninguna obligatoria. Opcional: carril (A/B/C) para filtrar.

## Pasos
1. `git status -sb`, `git log --oneline -10`, `git branch -a`. Anota cambios sin confirmar **sin tocarlos**.
2. Lee `AGENTS.md`, `docs/05-diagnostico.md`, últimas 15 líneas de `docs/estado.md`.
3. ¿Existe `package.json` en la raíz? Si sí: `npm run typecheck` y `npm test` (si existen los scripts). Si no: "app sin scaffold (P0-1)".
4. `npm --prefix tools/kit run check` y `npm --prefix tools/kit run dry-run` (si `tools/kit/node_modules` no existe: `npm --prefix tools/kit install`).
5. De `docs/11-backlog.md`: tareas P0 abiertas + 3 primeras abiertas del carril.
6. Bloqueos de la tabla "Decisiones / bloqueos" que sigan abiertos.

## Salida
```
Rama · cambios sin confirmar · último commit
Checks: kit OK|N fallos · dry-run OK|… · app: typecheck/test OK|no existe
Siguiente: <ID> <resultado> (<agente>)
Bloqueos: D1 …
```

## Ejemplo
`/forja-orientacion C` → estado + C1, C2, C3 con `forja-shopify-engineer`.

## Terminado cuando
Cada línea de la salida sale de un comando ejecutado en esta sesión (nada recordado).
