---
name: forja-copy-eval
description: "Generar y evaluar el copy de una landing FORJA contra el Brief: claims sin respaldo, voz de IA, reglas CRO LATAM y límites del PageSpec. Úsalo después de componer o regenerar secciones y antes de aprobar."
argument-hint: "[projectId o ruta a PageSpec]"
---

# /forja-copy-eval
## Entradas
Argumentos: `$ARGUMENTS`.
PageSpec + Brief. Skills `forja-ecom-cro`, `forja-voz-humana`, rúbrica `forja-prompts/prompts/rubric.md`.

## Pasos
1. Valida `PageSpecSchema`.
2. Por sección: extrae afirmaciones (cifras, tiempos, garantías, certificaciones, comparaciones) y busca respaldo en `Brief.dna` + `provenance`. Sin respaldo → **bloqueante**. Respaldo con confianza < 0.7 → suavizar o confirmar.
3. Testimonios: `disclaimer` presente.
4. Voz: lista negra de `forja-prompts`, titular ≤ 9 palabras, frases ≤ 14 palabras, tuteo.
5. Si reescribes, respeta `locked: true` y devuelve secciones válidas.

## Salida
Tabla `sección · hallazgo · severidad (bloqueante/alto/medio) · fix` + puntaje de rúbrica.

## Ejemplo
Con el fixture del termo: "Garantía: si no te encanta…" con la garantía como pregunta abierta → bloqueante; "12 horas" con confianza 0.6 → confirmar (lo detecta también el dry-run).

## Terminado cuando
Cero bloqueantes o lista de preguntas enviada al usuario; el PageSpec resultante valida.
