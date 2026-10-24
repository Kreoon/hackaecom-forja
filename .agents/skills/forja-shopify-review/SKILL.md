---
name: forja-shopify-review
description: "Revisión de una integración o cambio Shopify de FORJA: auth y organización, scopes mínimos, mutations verificadas contra 2026-10, idempotencia, protección del trabajo del comerciante, throttling y estrategia (app block vs. tema). Úsalo antes de mergear código del carril C o al depurar errores de la Admin API."
argument-hint: "[ruta o PR]"
---

# /forja-shopify-review
## Entradas
Argumentos: `$ARGUMENTS`.
Diff o archivos (`src/lib/shopify/**`, `src/lib/publish/**`, `shopify/**`), `docs/06-version-aprobacion-publicacion.md`, ADR-007, skill `forja-shopify-deploy`.

## Checklist
1. Versión `2026-10` en un solo lugar (`SHOPIFY_API_VERSION`).
2. Cada query/mutation validada con el MCP `shopify-dev` (`validate_graphql_codeblocks`) — pega la salida.
3. Client credentials solo con tiendas de la organización; token en caché ≤ 23 h, nunca en logs.
4. Scopes mínimos (sin `write_themes` en MVP); scopes faltantes se muestran al usuario.
5. `productSet` solo sobre productos con `forja.owner = true`; en ajenos solo `metafieldsSet`.
6. Media: `stagedUploadsCreate` → `fileCreate` → polling `READY` antes de usar.
7. `userErrors` y `extensions.cost.throttleStatus` manejados; backoff.
8. Cada paso con `idempotencyKey`, `checkpoint` y `before`.
9. `checkApproval` antes del primer paso y antes de `publish`; `draft` por defecto.
10. Liquid: `shopify theme check` limpio; < 100 KB en la extensión.

## Salida
Checklist ✅/❌ con archivo:línea y fix.

## Ejemplo
`/forja-shopify-review src/lib/publish/run.ts`.

## Terminado cuando
Sin ❌ o con fixes listados y dueño asignado; validaciones del MCP pegadas.
