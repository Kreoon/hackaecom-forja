---
name: forja-e2e
description: "Pruebas de extremo a extremo del flujo FORJA (registro, llaves, materiales, brief, preview, aprobación, plan de publicación) con Playwright y proveedores mockeados; y la prueba en seco del kit cuando la app aún no existe. Úsalo para probar un flujo completo o antes de mergear a main."
argument-hint: "[flujo]"
---

# /forja-e2e
## Entradas
Argumentos: `$ARGUMENTS`.
App corriendo (`npm run dev`) o, si no hay app, solo la prueba en seco. Fixtures `golden/00-fixture`.

## Pasos
1. Sin app: `npm --prefix tools/kit run dry-run` y reporta su salida.
2. Con app: `npx playwright test e2e/<flujo>.spec.ts` con mocks de proveedores (MSW o route interception); nunca llaves reales en CI.
3. Flujo base: registro → guardar llave falsa (mock `validateKey` ok) → subir fixtures → Brief → preview → aprobar → plan (sin ejecutar Shopify) → editar → aprobación invalidada.
4. Si hay tienda de desarrollo y el usuario lo pide: publicación `draft` real + `/forja-preview-fidelity`.

## Salida
Resultado por paso (✓/✗), trazas de Playwright de los fallos, tiempo total.

## Ejemplo
`/forja-e2e aprobacion` → valida que editar el titular invalida la aprobación en la UI.

## Terminado cuando
Comando y salida pegados; fallos con repro y dueño.
