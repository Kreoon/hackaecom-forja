---
name: forja-motion
description: Sistema de animación de FORJA — cuándo animar y cuándo no, tokens de duración y curvas, recetas listas para landing (entrada de secciones, CTA sticky, loop del hero, acordeón FAQ, contador, hover de botón, galería) que funcionan igual en React y en Shopify Liquid, interacciones de la app (drag, toasts, progreso) y glosario en español. Úsalo al implementar cualquier animación, transición, micro-interacción o GIF/loop, o cuando alguien describa un efecto sin saber cómo se llama.
---

# Motion FORJA

En una landing que vende, el movimiento tiene **un trabajo**: guiar la mirada hacia el producto y el botón, y hacer que la página se sienta viva y confiable. Si no hace ese trabajo, no va.

## 1. El filtro (antes de animar cualquier cosa)
Responde las tres. Si alguna es "no", no animes.
1. **¿Qué comunica?** Jerarquía (esto primero), causa-efecto (tocaste → pasó), continuidad (de aquí a allá), o vida (el producto respira). "Se ve bonito" no cuenta.
2. **¿Se repite mucho?** Lo que el usuario hace 50 veces (escribir, navegar el editor) va sin animación o en < 120 ms.
3. **¿Aguanta en un celular de gama media?** Solo `transform` y `opacity`. Si necesitas animar `height`, `top`, `box-shadow` o `filter` grandes, busca otra forma.

## 2. Tokens (únicos en todo FORJA)
Definidos en [reference/forja-motion.css](reference/forja-motion.css), que se importa en el mockup y se copia a `shopify/assets/`. Así React y Liquid se mueven igual.

| Token | Valor | Para |
|---|---|---|
| `--forja-dur-micro` | 120 ms | hover, press, toggles |
| `--forja-dur-ui` | 220 ms | menús, tooltips, toasts |
| `--forja-dur-enter` | 480 ms | entrada de secciones |
| `--forja-dur-hero` | 700 ms | primera aparición del hero |
| `--forja-ease-out` | `cubic-bezier(.2,.8,.2,1)` | entradas (rápido al inicio, frena suave) |
| `--forja-ease-in-out` | `cubic-bezier(.65,0,.35,1)` | cosas que se mueven de un lugar a otro |
| `--forja-ease-spring` | `cubic-bezier(.34,1.4,.64,1)` | "pop" con leve rebote (badges, sticker de oferta) |
| `--forja-distance` | 16 px | desplazamiento de entrada; nunca más de 24 px |

Reglas: las salidas son ~70 % de la duración de la entrada. Nunca `linear` salvo en loops continuos. Nunca más de 700 ms en algo que el usuario espera.

## 3. Nivel de motion por token
`DesignTokens.motion` controla cuánto se usa:
- `none`: solo feedback de botones.
- `subtle` (default): entrada de secciones + hover + CTA sticky + loop del hero muy suave.
- `lively`: además stagger en listas, sticker de oferta con pop, contador animado, parallax leve del producto.

## 4. Recetas de landing (React y Liquid usan las mismas clases)
Todas en `reference/forja-motion.css` + `reference/forja-motion.js` (< 2 KB, sin dependencias).

| Receta | Clase / atributo | Nota |
|---|---|---|
| Entrada de sección | `data-forja-reveal` | IntersectionObserver añade `.is-in` una sola vez; opacity 0→1 + translateY 16→0 |
| Stagger de lista | `data-forja-reveal="stagger"` en el padre | hijos con `--i` → delay `calc(var(--i) * 60ms)`, máximo 6 hijos animados |
| CTA sticky móvil | `.forja-sticky-cta` | aparece cuando el CTA del hero sale de pantalla; se esconde al llegar a `offer` |
| Loop del hero | `<video autoplay muted loop playsinline poster>` | poster primero (LCP), video después de `load`; nunca GIF > 3 MB |
| Respiración del producto | `.forja-float` | translateY ±4 px en 6 s, `ease-in-out`, infinito; solo `motion: lively` |
| Pop de oferta | `.forja-pop` | scale .9→1 con `--forja-ease-spring` al entrar |
| Acordeón FAQ | `<details>` nativo + `.forja-faq` | anima el ícono y el contenido con `grid-template-rows: 0fr→1fr` (no `height`) |
| Contador | `data-forja-count="12"` | cuenta solo al entrar en pantalla, 800 ms, respeta reduced motion |
| Hover de botón | `.forja-btn` | translateY -1 px + sombra corta; press scale .98 |
| Galería | scroll-snap nativo | sin librerías de carrusel |

## 5. Interacciones de la app (carril B)
- **Progreso del pipeline** (se ve en la pantalla de 15 m): cada paso entra con stagger, el paso activo tiene un pulso suave, al terminar cambia a check con pop. La barra avanza con `transform: scaleX`, no `width`.
- **Regenerar sección**: la sección vieja hace fade a 40 % con shimmer; la nueva entra con crossfade de 220 ms. Nunca un salto en blanco.
- **Reordenar secciones**: drag con seguimiento 1:1 del dedo/mouse, el resto se desplaza con 220 ms `ease-in-out`; al soltar, se asienta con spring corto.
- **Toasts**: entran desde abajo en móvil, desde la esquina en desktop; se apilan; se pueden descartar arrastrando.
- **Interrumpible**: toda animación de UI debe poder revertirse a mitad (usar transitions CSS o springs, no keyframes de una sola dirección para estados).

## 6. Accesibilidad y rendimiento (no negociable)
- `@media (prefers-reduced-motion: reduce)`: sin desplazamientos ni loops; solo fades ≤ 120 ms. El video del hero muestra el poster.
- Solo `transform`/`opacity`. `will-change` solo durante la animación, nunca permanente.
- Nada anima antes del primer pintado del hero (no retrasar el LCP).
- Máximo 2 cosas en movimiento continuo por pantalla.

## 7. Glosario (lo que te dicen → cómo se llama)
| Te dicen | Se llama | Receta |
|---|---|---|
| "que vayan apareciendo al bajar" | reveal on scroll | `data-forja-reveal` |
| "que salgan uno tras otro" | stagger | `data-forja-reveal="stagger"` |
| "que el botón brinque un poquito" | pop / overshoot | `--forja-ease-spring` |
| "que el producto flote" | float / idle loop | `.forja-float` |
| "que el fondo se mueva más lento" | parallax | solo `lively`, ±20 px máx. |
| "el botón que se queda abajo" | sticky CTA | `.forja-sticky-cta` |
| "que los números suban" | count-up | `data-forja-count` |
| "que se estire y vuelva" al jalar | rubber-band | solo en drag de la app |
| "brillito que pasa" | shimmer | estados de carga |
| "que una cosa se convierta en otra" | morph / shared element | crossfade + transform en la app |
| "letras que se escriben solas" | typewriter | evitar en titulares (retrasa la lectura) |
| "que tiemble para llamar la atención" | shake / wiggle | solo errores de formulario |
