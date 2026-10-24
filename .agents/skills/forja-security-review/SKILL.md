---
name: forja-security-review
description: "Revisión de seguridad de FORJA sobre un diff o módulo: llaves BYOK, aislamiento RLS, logs, uploads, SSRF, prompt injection, publicación y política de no inventar. Úsalo antes de mergear cambios en auth, llaves, ingesta, Supabase o Shopify, y antes de la demo."
argument-hint: "[ruta, rama o PR]"
---

# /forja-security-review
## Entradas
Argumentos: `$ARGUMENTS`.
Diff (`git diff main...HEAD` o PR), `docs/07-modelo-amenazas.md`. Delegar en el agente `forja-byok-guardian`.

## Pasos
1. Mapea cada archivo tocado a las amenazas T1–T14.
2. Busca: secretos (`npm --prefix tools/kit run check`), `NEXT_PUBLIC_` con secretos, `service_role` fuera del servidor, `console.log` de headers/llaves, tablas sin RLS, `fetch(` a URLs del usuario sin el filtro anti-SSRF, prompts sin etiquetas de datos, publicación sin `checkApproval`.
3. Corre los tests de seguridad del módulo si existen.
4. `npm audit --omit=dev` (si hay `package.json`).

## Salida
Hallazgos `crítico/alto/medio · archivo:línea · amenaza · fix`. Los críticos bloquean el merge.

## Ejemplo
`/forja-security-review src/lib/ingest/url.ts` → verifica T6 (SSRF) y T7 (injection).

## Terminado cuando
Cada hallazgo tiene evidencia; checks ejecutados listados con su salida.
