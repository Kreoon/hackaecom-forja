# 14 · API del cerebro para el frontend

El **frontend (carril B) lo construye otro compañero**. Nosotros somos **el cerebro (carril A)**: todo lo que pasa en el servidor entre «el usuario subió materiales» y «hay un PageSpec listo para revisar».
Este documento es la frontera: lo que el cerebro expone y lo que el frontend consume. Cambiarlo = ADR (igual que un contrato).

Regla: el frontend nunca llama a proveedores de IA ni ve llaves; solo usa estas acciones y lee estas tablas (con RLS).

## Acciones del servidor (Server Actions o Route Handlers en `src/app/api/brain/**`, dueño A)
| Acción | Entrada (Zod) | Salida | Estados / errores |
|---|---|---|---|
| `saveProviderKey` | `{ provider: ProviderId, key: string }` | `{ provider, last4, status }` | `invalid_key`, `rate_limited` |
| `deleteProviderKey` | `{ provider }` | `{ ok }` | — |
| `listProviders` | — | `{ manifest: ProviderManifest, status, last4? }[]` | — |
| `createProject` | `{ name? }` | `{ projectId }` | — |
| `getUploadUrl` | `{ projectId, kind, fileName, bytes, mime }` | `{ uploadUrl, storagePath }` (URL firmada) | límite excedido → error por campo |
| `registerInputs` | `{ projectId, inputs: { kind, storagePath? , url?, text? }[] }` | `{ inputIds }` | URL bloqueada (SSRF) |
| `startIngest` | `{ projectId }` | `{ jobIds }` | sin llave para una capacidad → aviso, no error |
| `getBrief` | `{ projectId }` | `Brief` (`forja-contracts/reference/brief.ts`) | — |
| `answerQuestions` | `{ projectId, answers: { id, answer }[] }` | `Brief` | — |
| `confirmFacts` | `{ projectId, paths: string[] }` | `Brief` | — |
| `composePage` | `{ projectId }` | `{ jobId }` → PageSpec v(n) | bloqueado si `Brief.status != ready` |
| `regenerateSection` | `{ projectId, sectionId, instruction }` | `{ jobId }` → PageSpec v(n+1) | sección `locked` → error |
| `saveEdit` | `{ projectId, baseVersion, sections: Section[] }` | `{ version, specHash }` | conflicto de versión |
| `generateAssets` | `{ projectId, assetIds?: string[] }` | `{ jobIds }` | no bloquea la página |
| `cancelJob` | `{ jobId }` | `{ ok }` | — |
| `getUsage` | `{ projectId }` | `{ byProvider: { provider, units, estCostUsd? }[] }` | — |

La aprobación y la publicación son de C (`docs/06-version-aprobacion-publicacion.md`); el cerebro solo entrega `version` y `specHash`.

## Lectura en vivo (Supabase, con RLS)
- `jobs` por `project_id` (Realtime) → progreso; estados de `JOB_MACHINE`.
- `page_spec_versions` → PageSpec por versión.
- `provider_keys` → solo `provider`, `last4`, `status` (nunca la llave).

## Cómo trabaja el frontend sin esperarnos
Mocks con los fixtures: `forja-contracts/examples/brief.example.json`, `forja-pagespec/reference/example.json`, estados de `forja-contracts/reference/jobs.ts`. Cuando una acción real esté lista, se marca aquí con ✅ y la fecha.

| Acción | Estado |
|---|---|
| todas | propuesto (sin código aún) |
