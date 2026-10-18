---
name: forja-provider-integration
description: "Integrar un proveedor BYOK nuevo en FORJA (adapter con capacidades explícitas, validación de llave, errores tipados, uso y costos). Úsalo para agregar o actualizar OpenAI, Gemini, Anthropic, Firecrawl, Apify, fal, Magnific, KIE, ElevenLabs, Replicate u otro."
argument-hint: "<proveedor>"
---

# /forja-provider-integration
## Entradas
Proveedor (`$ARGUMENTS`), capacidades que se quieren, contrato `forja-contracts/reference/provider.ts`, skill `forja-byok-providers`.

## Pasos
1. `/forja-docs-research` del proveedor: modelos vigentes, endpoint de validación barato, structured output, async/polling, deprecaciones, términos sobre uso por terceros.
2. Si el proveedor no está en `ProviderIdSchema` → pedir a `forja-architect` (ADR). "API MARK" no entra hasta identificarlo (D1).
3. Escribe `ProviderManifest` con **solo** capacidades verificadas y `verifiedAt`.
4. Implementa `src/lib/ai/providers/<id>.ts`: llamada directa con la llave del usuario (nunca AI Gateway BYOK), `AbortSignal`, mapeo de errores HTTP → `ProviderErrorCode`, `UsageEvent` sin secretos.
5. Tests Vitest con `fetch` mockeado: 401 → `invalid_key`, 429 → `rate_limited`, salida inválida → `invalid_output`.
6. 1 llamada real manual con la llave `DEV_*` de `.env.local` (nunca en CI).
7. Fila nueva en `docs/09-herramientas.md` (matriz) y en `docs/fuentes.md`.

## Salida
Adapter + tests + manifest + filas de docs.

## Ejemplo
`/forja-provider-integration firecrawl` → capacidades `["scrape"]`, validación `GET /v2/team/credit-usage` (`free_endpoint`).

## Terminado cuando
Tests en verde (salida pegada), llamada real documentada (o "no ejecutado: sin llave DEV"), ninguna llave en logs ni en el repo.
