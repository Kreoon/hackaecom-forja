---
name: forja-publish-recovery
description: "Diagnóstico y recuperación de una publicación FORJA fallida o parcial: leer pasos y checkpoints, decidir reanudar o deshacer, sin borrar trabajo del comerciante. Úsalo cuando una publicación queda en partial_failure, la verificación falla o el usuario reporta que la tienda no muestra la página."
argument-hint: "<publicationId>"
disable-model-invocation: true
---

# /forja-publish-recovery
## Entradas
Argumentos: `$ARGUMENTS`.
`Publication` (estado, `steps[]` con `checkpoint`, `before`, `error`), logs del job, tienda de desarrollo.

## Pasos
1. Clasifica el error del paso fallido: `ACCESS_DENIED`/scope → no reintentar, pedir scope; `THROTTLED`/5xx → reintentable; `userErrors` → corregir dato; hash distinto → caché o metafield viejo.
2. Verifica la aprobación (`checkApproval`): si cambió algo, **no** reanudar; pedir nueva aprobación.
3. Reanudar: `nextStep(steps)`; los pasos `done` no se repiten (idempotencia).
4. Deshacer: aplicar `before` en orden inverso; borrar solo objetos con `forja.owner = true` creados por esta publicación.
5. Volver a correr `verify_storefront`.
6. Registrar en `docs/estado.md` qué pasó y qué se hizo.

## Salida
Estado final (`preview_ready`, `rolled_back` o bloqueado con causa) + acción tomada.

## Ejemplo
`upload_media` falló por timeout → reanudar desde ese paso; `snapshot` no se repite.

## Terminado cuando
La tienda queda en el estado anterior o en la versión aprobada, con evidencia de verificación.
