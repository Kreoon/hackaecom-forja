---
name: forja-preview-fidelity
description: "Revisión de fidelidad entre el preview de FORJA y lo que Shopify renderiza: mismo PageSpec, mismo hash, mismas secciones, diff visual. Úsalo al construir secciones, antes de aprobar y después de cada publicación de prueba."
argument-hint: "[projectId | url de preview]"
---

# /forja-preview-fidelity
## Entradas
Argumentos: `$ARGUMENTS`.
`specVersion` + `specHash`, URL del preview en FORJA, `previewUrl` de la tienda de desarrollo.

## Pasos
1. `/forja-contract-check`: cada `type` tiene componente React, markup Liquid, caso en `SectionRenderer`, mapeo en el compilador.
2. Preview: muestra `specVersion` y hash; capturas a 390 y 1280 px.
3. Tienda: HTML contiene `data-forja-hash` igual al hash aprobado y un `data-forja-section` por sección.
4. Playwright `toHaveScreenshot` por sección (tolerancia en `e2e/fidelity.spec.ts`); diferencias esperadas documentadas (header/footer del tema, fuentes heredadas).
5. Limitaciones conocidas en `docs/06-version-aprobacion-publicacion.md` §A.

## Salida
Tabla `sección · React · Liquid · en tienda · diff %` + capturas.

## Ejemplo
Hash distinto → la tienda muestra otra versión: no aprobar; revisar `set_metafield`.

## Terminado cuando
Hash coincide, todas las secciones presentes, diffs dentro de tolerancia o explicados.
