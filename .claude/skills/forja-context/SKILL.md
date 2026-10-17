---
name: forja-context
description: "Actualizar el contexto del repo FORJA tras un cambio: CLAUDE.md (< 200 líneas), mapa de documentos, estado, backlog y enlaces, sin duplicar reglas. Úsalo después de mergear algo que cambia cómo se trabaja, o cuando Claude repite un error por falta de contexto."
---

# /forja-context
## Entradas
Qué cambió (PR, ADR, decisión). Agente `forja-context-keeper`.

## Pasos
1. Decide el documento dueño del cambio (mapa en `CLAUDE.md`). Escribe ahí el detalle; en `CLAUDE.md` solo un enlace o una regla de una línea.
2. Busca duplicados: `grep -rn "<regla>" CLAUDE.md docs .claude` y deja una sola versión.
3. `wc -l CLAUDE.md` < 200.
4. Línea en `docs/estado.md`.
5. `npm --prefix tools/kit run check` (enlaces, frontmatter).
6. No toques `.agents/` ni `.codex/`: si existen y quedaron desalineados, anótalo en `docs/estado.md` para su autor.

## Salida
Diff de docs + resultado del check.

## Ejemplo
Tras cerrar C1: ADR-003 con el resultado, `CLAUDE.md` sin cambios (ya enlaza ADR), línea en estado.

## Terminado cuando
Check en verde y la regla existe en un solo lugar.
