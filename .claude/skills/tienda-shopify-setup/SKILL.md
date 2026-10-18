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

## 6. Navegación completa (obligatorio antes de dar la tienda por lista)
Regla: **todo enlace del menú o del footer apunta a una página que existe**; si no, se quita.
1. Páginas mínimas COD con `pageCreate` (publicadas, español, marcadas demo si aplica): `preguntas-frecuentes`, `rastrear-pedido`, `envios-y-entregas`, `politica-de-devoluciones`, `terminos-y-condiciones`; renombrar `contact` → "Contacto" y `data-sharing-opt-out` → "Tus opciones de privacidad" con `pageUpdate`. Contenido = ficha + decisiones (sin inventar).
2. Menús con `menuUpdate`: principal (producto, FAQ, rastrear, contacto) y footer (FAQ, contacto, rastrear, envíos, devoluciones, términos, privacidad). Usar `type: PAGE` + `resourceId` para páginas.
3. Inicio: en el tema de trabajo, `templates/index.json` con la sección `hk-redirect` → landing del producto (no redirige dentro del editor).
4. Idioma: si el idioma principal de la tienda es inglés, fusionar `locales/es.json` sobre `locales/en.default.json` en el tema (carrito, búsqueda, cuenta en español). Los archivos de locale traen comentarios `/* */` y `//`: limpiarlos antes de `json.loads`. El checkout y `<html lang>` solo cambian cambiando el idioma principal en el admin.
5. Footer y anuncio en los grupos globales (`footer-group.json`, `header-group.json`) para que salgan en todas las páginas, no solo en la plantilla del producto.
6. Verificar en el preview con un `fetch` de cada `a[href]` interno (con `preview_theme_id`): todos deben dar 200 y el título de la página correcto.
`shopPolicyUpdate` necesita `write_legal_policies` (el conector no lo tiene): por eso las políticas van como páginas; la política de privacidad automática de Shopify se traduce en el admin.

## 5. Medios
Subir imágenes al producto cuando existan (`productSet` con `files` o `productCreateMedia`), en el orden de la galería del brief; alt text en español.
