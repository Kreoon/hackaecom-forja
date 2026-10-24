---
name: forja-supabase-schema
description: Modelo de datos de FORJA en Supabase (perfiles, llaves cifradas, tiendas, proyectos, inputs, assets, versiones de PageSpec, jobs y deployments) con RLS. Úsalo al crear la migración inicial, al agregar tablas o al revisar políticas.
---

# Schema Supabase

Migración inicial lista en [reference/0001_init.sql](reference/0001_init.sql). Copiar a `supabase/migrations/` y aplicar con `supabase db push` (o MCP `apply_migration`).

## Tablas
| Tabla | Para qué |
|---|---|
| `profiles` | 1:1 con `auth.users`, nombre, preferencias de proveedor |
| `provider_keys` | llave por proveedor → `vault.secrets` (solo `last4` visible) |
| `shops` | tienda Shopify conectada (`shop_domain`, client_id/secret en Vault, scopes, estado) |
| `projects` | un producto/landing; `status: draft → ingesting → composing → review → deploying → live / failed` |
| `inputs` | archivos/URLs subidos (`kind`, `storage_path`, `url`) |
| `evidence` | salida de cada extractor |
| `product_dna` | ProductDNA (jsonb) por proyecto, versionado |
| `assets` | imágenes/videos subidos o generados |
| `page_spec_versions` | historial de PageSpec (jsonb) — undo y auditoría |
| `jobs` | pasos async (`type`, `status`, `progress`, `error`) → Realtime para la barra de progreso |
| `deployments` | intentos de deploy (plan A/B/C, ids de Shopify, preview_url, error) |
| `usage_events` | costo estimado por llamada |

## RLS
Todas con RLS activado; patrón `user_id = auth.uid()` (o vía `projects.user_id`). Storage bucket `forja` privado con path `user_id/project_id/...` y política por prefijo. Los jobs de servidor usan service role **solo** en Route Handlers.

## Realtime
Suscribirse a `jobs` filtrando por `project_id` para animar el progreso del pipeline en la UI (clave para la demo en tarima).
