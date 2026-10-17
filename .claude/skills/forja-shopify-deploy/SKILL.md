---
name: forja-shopify-deploy
description: Cómo FORJA conecta la tienda Shopify del usuario y publica la página aprobada — autenticación (Dev Dashboard + client credentials), creación de producto y media, y las 3 estrategias para llevar las secciones al tema. Úsalo en todo el carril C, al depurar errores de Admin API o al decidir la estrategia de deploy.
---

# Deploy a Shopify

> **Actualización 2026-10-16 (ADR-007):** la vía por defecto es la **estrategia C (app block + metafield)** con modo `draft`; la A requiere exención y la B (Theme Access) se descarta para producto. Client credentials solo sirve para tiendas de la misma organización del Dev Dashboard. Plan de pasos, aprobación y recuperación: [`docs/06-version-aprobacion-publicacion.md`](../../../docs/06-version-aprobacion-publicacion.md) y [`forja-contracts`](../forja-contracts/SKILL.md). Fuentes: [`docs/fuentes.md`](../../../docs/fuentes.md).

API: **GraphQL Admin API `2026-10`** (REST es legacy). Verificar con el MCP de Shopify (`search_docs_chunks`) antes de cada mutation nueva.

## 1. Conexión de la tienda (BYO app)
Desde ene-2026 **no se pueden crear custom apps desde el admin**. Flujo para el usuario de FORJA:
1. En **Dev Dashboard** crea una app ("FORJA – mi tienda"), distribución para su propia organización.
2. Scopes en la versión de la app: `write_products, read_products, write_files, read_files, write_themes, read_themes, write_online_store_pages, read_online_store_pages, write_metaobjects, write_metaobject_definitions`.
3. Instala la app en su tienda.
4. Pega en FORJA: `shop` (`mitienda.myshopify.com`), `client_id`, `client_secret` → se guardan cifrados (Vault).
5. FORJA pide token con **client credentials grant** (expira en 24 h → refrescar on-demand, cachear en memoria del server con TTL 23 h).

```ts
// src/lib/shopify/token.ts — verificar endpoint exacto en la doc "client-credentials-grant"
const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "client_credentials", client_id, client_secret }),
});
const { access_token, expires_in, scope } = await res.json();
```
Smoke test de conexión: `{ shop { name myshopifyDomain primaryDomain { url } currencyCode } }` y validar que `scope` incluye lo necesario. Mostrar en UI qué scope falta.

> Fase 2 (después del hackathon): app pública con Shopify CLI + OAuth managed install → "Instalar FORJA" en un clic.

## 2. Producto y media (siempre funciona, no requiere exención)
1. `stagedUploadsCreate` → subir cada imagen/GIF/video → `productCreate` / `productSet` con `media` (o `fileCreate` para assets de secciones).
2. Precio y variantes desde `offer.priceTiers` (pack = variante o bundle; v1: variantes "1 unidad / 2 unidades / 3 unidades").
3. SEO: `seo.title`, `seo.description`, `handle`.
4. Guardar `shopifyMediaId` / URL CDN en `assets[]` del PageSpec.
5. Guardar el PageSpec completo en un **metafield** del producto `forja.page_spec` (type `json`) → base de las estrategias B y C.

## 3. Llevar las secciones al tema — ⚠️ riesgo #1
`themeCreate` y `themeFilesUpsert` requieren `write_themes` **y una exención de Shopify** para apps. Día 0, primera tarea del carril C: probar `themeFilesUpsert` con la app de Dev Dashboard en la tienda de desarrollo y anotar el resultado en `docs/04-decisiones.md`.

| Plan | Cómo | Pros | Contras |
|---|---|---|---|
| **A · Theme files** | `themeDuplicate` del tema activo → `themeFilesUpsert` con `sections/forja-*.liquid` + `templates/product.forja-<handle>.json` → `productUpdate(templateSuffix)` → preview URL → ✓ → `themePublish` | Página 100% nativa, editable en el editor de temas | Puede requerir exención |
| **B · Theme Access + CLI** | Usuario instala la app **Theme Access** y pega su password; FORJA arma el tema en carpeta y ejecuta `shopify theme push --password … --store … --unpublished` (en Vercel Sandbox / función con CLI) | Ruta oficial para pushear temas, sin exención | Un dato más que pide al usuario; más lento |
| **C · Theme app extension** | La app FORJA trae un **app block** "FORJA Landing" que lee el metafield `forja.page_spec` y renderiza todas las secciones. El usuario lo agrega una vez al template de producto (deep link al editor) | Cero escritura de temas; correcto para app pública | 1 paso manual del usuario la primera vez |

**Decisión vigente (ADR-007)**: C con el deep link preparado. A solo si Shopify concede la exención. B no se usa en producto. Las secciones Liquid son las mismas en los 3 planes (skill `forja-liquid-sections`), solo cambia cómo llegan.

## 4. Publicación
- Por defecto todo queda **sin publicar** + `previewUrl` (`https://{shop}/products/{handle}?preview_theme_id={id}`).
- El ✓ en FORJA dispara: `themePublish` (plan A) o `productUpdate(status: ACTIVE)` + publicar en el canal Online Store (`publishablePublish`).
- Registrar todo en tabla `deployments` (estado, ids, errores, duración) para el panel y para rollback (`themePublish` del tema anterior).

## Errores comunes
- `ACCESS_DENIED` en theme mutations → falta exención → cambiar a plan C/B automáticamente y avisar.
- Throttling (cost-based): leer `extensions.cost.throttleStatus`, backoff exponencial, lotes ≤ 50 archivos en `themeFilesUpsert`.
- Imágenes: Shopify procesa media async → hacer polling de `media.status == READY` antes de publicar.
- Liquid inválido → Shopify rechaza el archivo: correr `shopify theme check` local sobre `shopify/` en CI.
