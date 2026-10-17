---
name: forja-review
description: "Revisión de código de FORJA antes de un PR: corrección, contratos, carriles, pruebas, seguridad y convenciones del repo. Úsalo sobre la rama actual o un PR antes de pedir revisión humana."
argument-hint: "[rama | PR]"
---

# /forja-review
## Entradas
Argumentos: `$ARGUMENTS`.
`git diff main...HEAD` (o PR con `gh pr diff <n>`).

## Pasos
1. ¿Toca archivos de otro carril o contratos sin ADR? (tabla de `docs/10-guia-equipo.md`).
2. Corrección: bugs, estados fuera de las máquinas (`canTransition`), errores no tipados, promesas sin `await`, falta de `AbortSignal` en llamadas largas.
3. Contratos: Zod en las fronteras; `/forja-contract-check` si toca secciones.
4. Seguridad: si toca llaves/auth/ingesta/Shopify → `/forja-security-review`.
5. Pruebas: ¿hay tests para lo nuevo? Córrelos.
6. Convenciones: español en UI/docs/commits, código en inglés, prompts no inline, `feat(a|b|c)`.

## Salida
Hallazgos por severidad con archivo:línea + checks ejecutados.

## Ejemplo
`/forja-review` en `c/C2-client` → falta manejo de `throttleStatus` (alto).

## Terminado cuando
Cada hallazgo es concreto y cada check citado se ejecutó en esta sesión.
