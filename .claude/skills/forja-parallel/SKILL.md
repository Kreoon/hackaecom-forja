---
name: forja-parallel
description: "Ejecutar trabajo en paralelo en FORJA sin conflictos: reparte tareas independientes del backlog entre subagentes o worktrees, cada una con dueño de archivos, y las integra. Úsalo cuando hay 2+ tareas sin dependencias entre sí."
argument-hint: "<IDs del backlog o descripción>"
disable-model-invocation: true
---

# /forja-parallel
## Entradas
Argumentos: `$ARGUMENTS`.
IDs del backlog o descripción. `docs/10-guia-equipo.md` (dueños), `docs/11-backlog.md` (dependencias y columna ∥).

## Pasos
1. Delegar el reparto en el agente `forja-orchestrator`.
2. Descartar del paralelo lo que comparte archivos o depende de otra tarea; los contratos van primero y solos.
3. Escritura en paralelo: un subagente por tarea con `isolation: worktree`, o worktrees por persona: `claude -w <id>` (crea `.claude/worktrees/<id>/`, rama `worktree-<id>`; `.env.local` se copia por `.worktreeinclude`).
4. Cada subagente devuelve: diff, pruebas ejecutadas y salida.
5. Integrar en orden de dependencias; correr checks completos tras cada merge.

## Salida
Tabla `tarea · agente · worktree/rama · estado · pruebas` y lista de ramas listas para PR.

## Ejemplo
`/forja-parallel C2 B6 A2` → tres ramas independientes (cliente Shopify, secciones React, registro de prompts).

## Terminado cuando
Cada rama tiene pruebas en verde y ninguna tocó archivos de otra.
