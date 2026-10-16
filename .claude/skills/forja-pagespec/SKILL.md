---
name: forja-pagespec
description: Contrato PageSpec de FORJA — el JSON de secciones que renderizan igual el mockup (React) y Shopify (Liquid). Úsalo al crear, validar, editar o renderizar una página, al agregar un tipo de sección, o cuando dos carriles discutan "qué forma tiene la página".
---

# PageSpec — la única fuente de verdad de la página

`PageSpec` describe una landing de producto como una lista ordenada de secciones tipadas, más los
`DesignTokens` y los assets. El carril A lo **produce**, el carril B lo **muestra/edita**, el carril C
lo **compila a Shopify**. El schema Zod de referencia está en [reference/pagespec.ts](reference/pagespec.ts):
cópialo a `src/contracts/pagespec.ts` el día 0 (lo hace `forja-architect`).

## Reglas del contrato
1. **Versionado**: `version: "1"`. Un cambio que rompe → `"2"` + migrador. Nunca cambios silenciosos.
2. **Secciones cerradas**: solo los `type` del catálogo. Un tipo nuevo = schema Zod + componente React + sección Liquid + ejemplo, en el mismo commit.
3. **Sin HTML libre en el copy**. Texto plano + `emphasis` (palabras a resaltar). Así Liquid y React no divergen y no hay XSS.
4. **Assets por referencia** (`assetId`), nunca URLs crudas dentro de secciones. `assets[]` resuelve a URL de Supabase Storage (mockup) o a `shopify://` / CDN de Shopify (después del deploy).
5. **Cada sección tiene `id` estable** (nanoid). Regenerar una sección conserva su `id`.
6. **`locked: true`** = el usuario la editó a mano; la IA no la sobreescribe al regenerar.
7. Todo PageSpec que sale de un LLM pasa `PageSpecSchema.safeParse`. Falla → 1 reintento con los errores → si falla, error visible.

## Catálogo de secciones (v1)
| type | Para qué | Campos clave |
|---|---|---|
| `announcement` | barra superior (envío gratis, contraentrega) | `text`, `icon?` |
| `hero` | promesa + imagen principal + CTA | `headline`, `subheadline`, `cta`, `mediaAssetId`, `layout: split\|full-bleed\|stacked`, `badges[]` |
| `benefits` | 3–6 beneficios con ícono | `title`, `items[{icon,title,body}]` |
| `problem_solution` | dolor → solución | `problem`, `solution`, `mediaAssetId?` |
| `features_media` | característica + imagen/GIF alternados | `items[{title,body,mediaAssetId}]` |
| `how_it_works` | pasos 1-2-3 | `steps[{title,body}]` |
| `social_proof` | testimonios / reseñas | `items[{name,city?,quote,rating}]`, `disclaimer` |
| `comparison` | nosotros vs. otros | `columns`, `rows[{label,us,them}]` |
| `offer` | precio, packs, bonus, garantía | `priceTiers[{label,qty,price,compareAt?,highlight?}]`, `guarantee`, `bonus?` |
| `faq` | objeciones | `items[{q,a}]` |
| `gallery` | fotos producto | `assetIds[]` |
| `video` | video/animación | `assetId`, `autoplay` |
| `cta_banner` | cierre con urgencia | `headline`, `cta`, `urgency?` |
| `whatsapp_cta` | botón flotante / bloque WhatsApp | `phone`, `message` |

`cta.action` ∈ `add_to_cart | buy_now | whatsapp | scroll_to:<sectionId>`.

## Orden recomendado (landing de producto LATAM)
announcement → hero → benefits → problem_solution → features_media → social_proof → how_it_works → offer → comparison → faq → cta_banner (+ whatsapp_cta flotante). El LLM puede quitar o reordenar, pero `hero` y `offer` son obligatorios. Ver `forja-ecom-cro`.

## Edición por sección (carril B)
- `regenerateSection(spec, sectionId, instruction)` → solo esa sección, mismo `type` salvo que el usuario pida cambiarlo.
- Undo = historial de `PageSpec` en tabla `page_spec_versions`.

## Checklist al tocar el contrato
- [ ] Zod actualizado y exporta `type` inferido
- [ ] Componente React en `src/components/sections/<Type>.tsx`
- [ ] Sección Liquid en `shopify/sections/forja-<type>.liquid` (skill `forja-liquid-sections`)
- [ ] Ejemplo en `reference/example.json` sigue validando
- [ ] `/forja-contract-check` en verde
