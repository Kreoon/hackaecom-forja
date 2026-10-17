---
name: tienda-shopify-setup
description: "Fase 3 de tienda-express — configura la tienda Shopify destino vía MCP de Shopify (Admin GraphQL): verificar tienda, crear producto con variantes y precios, publicarlo en la tienda online, y dejar la lista de lo que solo se hace a mano en el admin (moneda, dirección, app COD). Úsalo al pasar de brief a tienda o cuando pidan \"crea el producto en Shopify\"."
---

# Setup de Shopify

## 1. Verificar la tienda (siempre)
`get-shop-info` o query `shop { name myshopifyDomain currencyCode billingAddress{country} plan{partnerDevelopment} }` + `themes` + `appInstallations`. Confirmar con el usuario que es la tienda destino. Para cambiar de tienda: `switch-shop` y el usuario reconecta el conector.

## 2. Producto (productSet, síncrono)
- `productSet(input, synchronous: true)` con: `title`, `handle`, `descriptionHtml` (de brief.md), `vendor`, `productType`, `status: ACTIVE`, `tags` (`<evento>-demo`, `contraentrega`), `seo{title,description}`, `productOptions` y `variants`.
- Opciones típicas COD: `Color` × `Oferta` (`1 unidad`, `Pack x2 + regalo`). Cada variante: `price`, `compareAtPrice`, `sku`, `inventoryPolicy: CONTINUE`, `inventoryItem: {tracked: false}` (demo: siempre vendible).
- Precios en COP como números enteros (`"349900"`). Si la moneda de la tienda aún es USD, los números se mantienen al cambiarla.
- Guardar las variables usadas en `tema/product-set-vars.json` (UTF-8) para repetir.

## 3. Publicar en la tienda online
`productSet` con ACTIVE **no** publica en canales. Buscar `publications` y correr `publishablePublish(id, input: [{publicationId: <Tienda online>}])`.

## 4. Solo a mano en el admin (la API no lo permite o requiere aceptar términos)
- Moneda de la tienda (Configuración → Detalles de la tienda → Moneda) — posible mientras no haya pedidos.
- Dirección/país de la tienda.
- Instalar la app COD (Releasit/EasySell) y activar su *App embed* en el editor de temas.
- Quitar la contraseña de la tienda (solo con OK del orquestador; en tiendas de desarrollo no se puede).

## 5. Medios
Subir imágenes al producto cuando existan (`productSet` con `files` o `productCreateMedia`), en el orden de la galería del brief; alt text en español.
