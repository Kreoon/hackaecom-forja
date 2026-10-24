---
name: forja-seo-shopify
description: SEO y búsqueda con IA (GEO/AEO) para las páginas de producto que FORJA publica en Shopify — título, meta descripción, handle, alt de imágenes, encabezados, datos estructurados Product/FAQ, velocidad (Core Web Vitals) y contenido que los buscadores con IA puedan citar. Incluye una auditoría rápida con salida priorizada. Úsalo al generar `seo` del PageSpec, al compilar secciones Liquid, o cuando pregunten por posicionamiento o por qué una página no aparece.
---

# SEO de producto en Shopify

La mayoría del tráfico de una landing FORJA viene de anuncios, pero el SEO correcto baja el costo de largo plazo, mejora la calidad percibida en Meta/Google Ads y hace que asistentes de IA citen el producto. Se resuelve **en el PageSpec y en el compilador**, no a mano después.

## 1. Lo que FORJA genera siempre (PageSpec `seo`)
| Campo | Regla |
|---|---|
| `seo.title` | ≤ 60 caracteres. `Producto + beneficio o diferenciador + (marca si cabe)`. Sin MAYÚSCULAS ni emojis. |
| `seo.description` | 140–155 caracteres. Qué es, para quién, 1 dato, 1 razón de compra local (contraentrega, envío). |
| `seo.handle` | minúsculas, guiones, sin tildes ni stopwords: `termo-inteligente-led`. Estable: si cambia después de publicar, crear redirect (`urlRedirectCreate`). |
| alt de cada asset | describe la imagen para alguien que no la ve: producto + contexto. Nada de "imagen de". ≤ 125 caracteres. |

## 2. Lo que el compilador Liquid debe respetar
- **Un solo H1**: el titular del hero. Las secciones usan H2; los ítems, H3.
- **Datos estructurados**: los temas Shopify modernos ya emiten `Product` JSON-LD en la plantilla de producto. Verificar que exista (no duplicar). Si el tema no lo trae, emitirlo con `{{ product | structured_data }}`.
- **FAQ**: la sección `faq` en HTML semántico (`<details>`/`<summary>` o `<h3>` + `<p>`). Las preguntas reales del comprador son exactamente lo que los buscadores con IA citan.
- **Imágenes**: `image_url` con `widths` y `sizes`; hero `loading="eager"` + `fetchpriority="high"`; el resto `lazy`. WebP lo resuelve el CDN de Shopify.
- **Velocidad**: CSS de secciones < 30 KB, JS < 5 KB, cero librerías de terceros en la landing. Fuentes con `display=swap` y solo los pesos usados.
- **Idioma**: `lang` del tema según `locale`; moneda y formatos locales en el copy.

## 3. GEO / AEO (que la IA te cite)
- Una frase en el hero o en `benefits` que defina el producto de forma citable: "X es un Y que Z para W."
- Especificaciones en formato escaneable (lista o tabla en `comparison`/`features_media`).
- FAQ con respuestas de 1–3 frases, autocontenidas, sin "como dijimos arriba".
- Datos verificables (medidas, materiales, garantía). Nada inventado: lo que no está en el ProductDNA no se afirma.

## 4. Auditoría rápida (cuando pidan revisar una página publicada)
Revisa con el navegador o `curl` la URL de preview y entrega:

| Prioridad | Chequeo | Cómo verificar |
|---|---|---|
| P0 | La página responde 200 y no tiene `noindex` | headers + `<meta name="robots">` |
| P0 | Un H1, igual al titular | DOM |
| P0 | `title` y `meta description` presentes y en rango | DOM |
| P1 | JSON-LD Product válido, un solo bloque | buscar `application/ld+json` |
| P1 | LCP < 2.5 s en móvil, CLS < 0.1 | Lighthouse / PageSpeed |
| P1 | Todas las imágenes con alt descriptivo | DOM |
| P2 | Handle limpio y canonical correcto | `<link rel="canonical">` |
| P2 | FAQ semántica y respuestas citables | DOM |

Formato: tabla `Prioridad · Problema · Evidencia · Arreglo (en qué campo del PageSpec o archivo Liquid)`.
