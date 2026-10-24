---
name: forja-brief-to-page
description: "Convertir un Brief listo en DesignTokens y PageSpec validados (estructura, copy y referencias a assets), y regenerar secciones sueltas. Úsalo al implementar brand.tokens, page.compose o section.regenerate."
---

# /forja-brief-to-page
## Entradas
`Brief` con `status: ready`, imágenes de referencia, prompts `brand.tokens`, `page.compose`, `section.regenerate`; skills `forja-pagespec`, `forja-ecom-cro`, `forja-art-direction`.

## Pasos
1. Tokens: `DesignTokensSchema`; contraste AA con `forja-art-direction/scripts/contrast.mjs`.
2. Composición: orden recomendado de `forja-pagespec`; `hero` y `offer` obligatorios; assets por `assetId` (solo uploads o generados, nunca `reference`).
3. Validar `PageSpecSchema` (1 reintento con errores); guardar como nueva fila de `page_spec_versions`.
4. Regenerar sección: mismo `id` y `type`; respeta `locked`; nueva versión.
5. Pasar `/forja-copy-eval`.

## Salida
`PageSpec` versionado listo para preview.

## Ejemplo
Brief del fixture → `forja-pagespec/reference/example.json` (7 secciones).

## Terminado cuando
Valida contra Zod, cero claims bloqueantes en copy-eval, todas las referencias a assets resuelven.
