---
name: forja-feature-design
description: "Diseño de una funcionalidad de FORJA antes de codear: alcance, contratos que toca, reparto por carril, archivos, pruebas y riesgos. Úsalo para planear cualquier feature nueva o cambio que cruce módulos."
argument-hint: "<descripción de la feature>"
---

# /forja-feature-design
## Entradas
Descripción de la feature (`$ARGUMENTS`). Si es ambigua en algo que cambia el diseño, pregunta UNA cosa.

## Pasos
1. Busca si ya existe algo parecido (`docs/11-backlog.md`, `src/`, skills de dominio).
2. Ubica la feature en `docs/01-arquitectura.md` (módulo) y en las máquinas de estado (`forja-contracts/reference/jobs.ts`).
3. ¿Cambia un contrato? → propuesta de cambio + ADR borrador para `forja-architect` (no lo apliques tú).
4. Reparte: tareas ≤ 1 día, cada una con carril, agente, archivos (sin solaparse), prueba.
5. Seguridad: recorre T1–T14 de `docs/07-modelo-amenazas.md` y anota las que aplican.
6. Si la feature usa una API externa → `/forja-docs-research` primero.

## Salida
- Resumen (3 líneas) · Contratos afectados · Tabla `ID · Carril · Agente · Archivos · Depende · ∥ · Prueba · T` · Riesgos · Preguntas abiertas.
- Filas nuevas propuestas para `docs/11-backlog.md` (agrégalas si el usuario lo aprueba).

## Ejemplo
`/forja-feature-design botón de WhatsApp flotante` → no toca contratos (ya existe `whatsapp_cta`), tareas B (componente) y C (Liquid), prueba `/forja-contract-check`.

## Terminado cuando
Cada tarea tiene un solo dueño de archivos y una prueba ejecutable; los cambios de contrato están marcados para ADR.
