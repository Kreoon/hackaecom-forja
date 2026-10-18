---
name: forja-handoff
description: "Cierre de sesión y handoff entre personas de FORJA: estado de la rama, pruebas ejecutadas, pendientes, decisiones y bloqueos; prepara el PR. Úsalo al terminar cada sesión de trabajo o antes de pasar una tarea a otra persona."
---

# /forja-handoff
## Entradas
Rama actual, tarea del backlog, plantilla `docs/plantillas/handoff.md`, `.github/pull_request_template.md`.

## Pasos
1. `git status` y `git diff --stat main...HEAD`. Nada sin confirmar en `main`.
2. Corre los checks del carril y `npm --prefix tools/kit run check`; pega salidas.
3. Llena la plantilla de handoff (qué quedó, cómo probar, pendiente, decisiones, bloqueos, archivos de otros carriles tocados).
4. Si hay PR: cuerpo con la plantilla de PR; si no, bloque en `docs/estado.md`.
5. Actualiza solo tu fila de `docs/11-backlog.md`.
6. Si cambió una regla o decisión → `forja-context-keeper` / ADR.

## Salida
Bloque de handoff listo para pegar + comandos para que otra persona continúe.

## Ejemplo
"C1 hecho: ACCESS_DENIED confirmado en themeFilesUpsert; app block por deep link OK; ADR-003 actualizado; siguiente C2."

## Terminado cuando
Otra persona puede continuar solo con el bloque (sin preguntar) y todos los checks citados se ejecutaron.
