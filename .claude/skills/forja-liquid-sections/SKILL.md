---
name: forja-liquid-sections
description: Compilador PageSpec → Liquid de FORJA. Patrones para escribir las secciones `forja-*.liquid`, el template JSON del producto y el app block, con paridad visual con el mockup React. Úsalo al crear o arreglar una sección Liquid o el compilador.
---

# PageSpec → Shopify (Liquid)

Carpeta: `shopify/` (versionada, es un mini-tema parcial):
```
shopify/
  sections/forja-hero.liquid, forja-benefits.liquid, …   # una por type del catálogo
  snippets/forja-tokens.liquid                            # CSS variables desde DesignTokens
  assets/forja.css                                        # estilos base compartidos (misma escala que Tailwind del mockup)
  extensions/forja-landing/blocks/landing.liquid          # plan C: app block que itera el metafield
```

## Dos modos de compilación (mismo HTML)
1. **Template JSON (plan A/B)**: `compile(spec) → { "sections/…": liquid, "templates/product.forja-<handle>.json": json }`. Cada sección del PageSpec → entrada en `sections` del template con sus `settings`/`blocks`. El copy va en settings (texto), no hardcodeado.
2. **Metafield (plan C)**: el app block lee `product.metafields.forja.page_spec.value` y hace `{% render 'forja-section-' | append: s.type, s: s %}`. Mismos markups, distinto origen de datos.

## Reglas de paridad mockup ↔ Liquid
- Mismas clases semánticas BEM (`forja-hero__title`) en React y Liquid; el CSS de `forja.css` es el MISMO archivo que importa el mockup (`src/styles/forja-sections.css`). Así el mockup *es* la página.
- Tokens → CSS variables (`--forja-primary`, `--forja-font-heading`, `--forja-radius`) en `forja-tokens.liquid` y en el wrapper React.
- Fuentes: solo Google Fonts (cargar con `<link>` en el snippet).
- Imágenes: `{{ img | image_url: width: 1200 | image_tag: loading: 'lazy', widths: '400,800,1200', alt: alt }}`; hero con `loading: 'eager'` y `fetchpriority: 'high'`.
- Motion: CSS (`@keyframes` + `IntersectionObserver` mínimo en `forja.js`), respetar `prefers-reduced-motion`. Nada de librerías JS pesadas en el tema.
- Escapar siempre: `{{ s.headline | escape }}`. `emphasis` → envolver palabras con `<mark class="forja-em">` en el compilador (no en el LLM).
- CTA `add_to_cart`/`buy_now`: form de producto nativo (`{% form 'product', product %}`) con `variant_id` del tier.
- `whatsapp`: `https://wa.me/{{ phone }}?text={{ message | url_encode }}`.

## Esqueleto de sección
```liquid
{%- liquid
  assign s = section.settings
-%}
<section class="forja-hero forja-hero--{{ s.layout }}" id="forja-{{ section.id }}">
  <div class="forja-container">
    <h1 class="forja-hero__title">{{ s.headline | escape }}</h1>
    <p class="forja-hero__sub">{{ s.subheadline | escape }}</p>
    {%- if s.image != blank -%}{{ s.image | image_url: width: 1400 | image_tag: loading: 'eager', fetchpriority: 'high', class: 'forja-hero__media' }}{%- endif -%}
  </div>
</section>
{% schema %}
{ "name": "FORJA · Hero", "settings": [
  { "type": "text", "id": "headline", "label": "Título" },
  { "type": "textarea", "id": "subheadline", "label": "Subtítulo" },
  { "type": "image_picker", "id": "image", "label": "Imagen" },
  { "type": "select", "id": "layout", "label": "Layout", "default": "split",
    "options": [{"value":"split","label":"Split"},{"value":"full-bleed","label":"Full"},{"value":"stacked","label":"Apilado"}] }
] }
{% endschema %}
```

## Validación
- `shopify theme check shopify/` sin errores.
- Test Vitest: `compile(example.json)` → snapshot + cada template JSON parsea + cada `type` del catálogo tiene archivo.
