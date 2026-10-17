---
name: forja-brief
description: "Convertir la evidencia y referencias de un proyecto en un Brief estructurado (ProductDNA + procedencia + preguntas pendientes) sin inventar datos. Úsalo al implementar dna.synthesize, la pantalla de Brief o al depurar un Brief con datos falsos o vacíos."
---

# /forja-brief
## Entradas
`Evidence[]`, formulario del usuario, contrato `forja-contracts/reference/brief.ts`, prompt `dna.synthesize` (`forja-prompts`).

## Pasos
1. Síntesis con modelo fuerte y salida `ProductDNASchema` (1 reintento con errores Zod).
2. Construir `provenance[]`: cada dato con `inputId`, `locator`, `quote` y `confidence`.
3. `openQuestions`: precio o nombre faltantes → `blocking: true`; garantía, duración, certificaciones sin evidencia → no bloqueantes.
4. `BriefSchema.parse` (rechaza datos del producto respaldados solo por referencias).
5. `status`: `needs_answers` si hay bloqueantes; si no, `ready`. Lo confirmado a mano va a `confirmedPaths` y gana en recomposiciones.

## Salida
`Brief` válido + lista de preguntas para la UI (B5).

## Ejemplo
`.claude/skills/forja-contracts/examples/brief.example.json` (FIXTURE).

## Terminado cuando
El Brief valida; ningún precio, cifra o garantía sin procedencia; datos < 0.6 de confianza listados para confirmar.
