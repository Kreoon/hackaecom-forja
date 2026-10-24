---
name: forja-motion-review
description: Auditoría de animación de FORJA en modo solo lectura — encuentra dónde falta movimiento que ayudaría a vender o a entender, dónde sobra, y qué animaciones existentes están mal hechas (lentas, bruscas, no interrumpibles, caras para el celular, sin reduced-motion). Entrega hallazgos priorizados con valores exactos y planes listos para que otro agente los implemente. Úsalo cuando pidan "revisa las animaciones", "dale más vida", "¿qué se podría animar?" o antes de la demo.
---

# Revisión de motion FORJA

Lees, no editas. Tu salida es un informe que otro agente (o un modelo más barato) puede ejecutar sin preguntar.
Estándar de referencia: `forja-motion` (filtro, tokens, recetas). Si algo no está en ese estándar, propón añadirlo, no improvises valores.

## Qué revisar (en este orden)
1. **Primer pantallazo del mockup y de la página Shopify**: ¿el hero aparece de inmediato? ¿algo retrasa el LCP? ¿el CTA es lo primero que "se mueve" hacia el ojo?
2. **Recorrido de scroll en 390 px**: ¿las secciones entran con reveal consistente? ¿aparece el CTA sticky al perder el del hero y se esconde en la oferta?
3. **Momentos de decisión**: oferta (pop del pack destacado), FAQ (acordeón), botón (hover/press).
4. **App (carril B)**: progreso del pipeline, regenerar sección, reordenar, toasts, guardado de llaves.
5. **Paridad**: lo que se mueve en el mockup se mueve igual en Liquid (mismas clases `forja-*`).

## Estándares (cada incumplimiento es un hallazgo)
| # | Estándar | Falla típica |
|---|---|---|
| 1 | Tiene propósito (pasa el filtro de `forja-motion`) | animación decorativa en algo que se usa 50 veces |
| 2 | Usa tokens, no números sueltos | `transition: all .5s ease` |
| 3 | Solo `transform`/`opacity` | anima `height`, `width`, `top`, `box-shadow` grande |
| 4 | Entradas con ease-out, movimientos con ease-in-out | `linear` o `ease-in` en una entrada |
| 5 | Duraciones dentro de rango | > 700 ms en algo que el usuario espera |
| 6 | Interrumpible | keyframes de una vía para un estado que se puede revertir |
| 7 | Respeta `prefers-reduced-motion` | loops y desplazamientos sin media query |
| 8 | No retrasa el contenido | hero con opacity 0 hasta que cargue JS |
| 9 | Máximo 2 movimientos continuos por pantalla | float + parallax + marquee + video juntos |
| 10 | Assets livianos | GIF > 3 MB, video sin poster, video autoplay con audio |

## Dónde buscar oportunidades (y cuándo decir que no)
- Sí: cambio de estado sin feedback (botón que no reacciona, sección regenerada que "salta"), espera sin progreso visible, lista que aparece de golpe, CTA que se pierde al hacer scroll, número clave que podría contarse.
- No: texto de párrafos, navegación del editor, formularios largos, cualquier cosa que el usuario repite, titulares letra por letra.

## Formato de salida (obligatorio)
```
## Resumen
<2 líneas: estado general y el cambio de mayor impacto>

## Hallazgos
| Prioridad | Dónde (archivo:línea o sección) | Problema | Estándar | Arreglo exacto |
|---|---|---|---|---|
| P0 | src/components/sections/Hero.tsx:42 | hero inicia en opacity 0 hasta hidratar | 8 | quitar data-forja-reveal del hero; animar solo badges con .forja-pop |

## Oportunidades
| Impacto | Dónde | Propuesta | Receta/token |

## Planes de implementación
### Plan 1 · <título>
Archivos: …  ·  Pasos: 1… 2… 3…  ·  Verificación: cómo comprobar que quedó (reduced motion incluido)
```
Prioridades: **P0** rompe la demo o el rendimiento, **P1** se nota en la experiencia, **P2** pulido.
Tono: directo, sin adjetivos. Si algo está bien, una línea lo dice y sigues.
