---
name: forja-approve-publish
description: "Flujo de aprobación y publicación de FORJA: crear la aprobación ligada a versión+hash+tienda, ejecutar el plan de publicación con checkpoints, verificar y mostrar el resultado. Úsalo al implementar o ejecutar la publicación en una tienda de desarrollo."
argument-hint: "[projectId]"
disable-model-invocation: true
---

# /forja-approve-publish
## Entradas
Argumentos: `$ARGUMENTS`.
Proyecto en `review`, PageSpec versionado, `PublishTarget` (tienda, estrategia `app_block`, handle, modo `draft`), contratos `approval.ts` y `publication.ts`.

## Pasos
1. Bloqueos previos: preguntas bloqueantes del Brief, claims sin respaldo (`/forja-copy-eval`), assets `reference`.
2. Calcular `specHash` en el servidor; crear `Approval` (la anterior pasa a `superseded`).
3. `planSteps()` → mostrar al usuario los pasos y scopes; confirmar.
4. Antes del primer paso: `checkApproval`. Ejecutar pasos en orden guardando `checkpoint` y `before`.
5. `verify_storefront`: hash y secciones en la URL de preview.
6. Estado `preview_ready` + `previewUrl`. `live` solo con una segunda confirmación explícita del usuario.

## Salida
`Publication` con estado, pasos y verificación.

## Ejemplo
Plan del fixture: `npm --prefix tools/kit run dry-run` (sección 6) — no ejecuta nada en Shopify.

## Terminado cuando
Hay `Publication` con `verification.hashMatches = true` en una tienda **de desarrollo**. Nunca reportes publicación sin esa evidencia.
