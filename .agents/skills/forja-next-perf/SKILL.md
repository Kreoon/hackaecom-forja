---
name: forja-next-perf
description: Reglas de rendimiento para la app FORJA en Next.js (App Router) + React sobre Vercel — Server Components por defecto, evitar cascadas de datos, streaming del progreso, Server Actions, límites de payload para uploads, tamaño del bundle, imágenes, fuentes y funciones largas del pipeline de IA. Priorizadas por impacto. Úsalo al escribir o revisar código del carril B o rutas de servidor, o cuando algo "se siente lento".
---

# Rendimiento Next.js en FORJA

Ordenadas por impacto. Las de **crítico** se revisan en cada PR del carril B.

## Crítico
1. **Server Components por defecto.** `"use client"` solo en hojas interactivas (editor, dropzone, grabador, toggles). Nunca en layouts ni páginas completas.
2. **Sin cascadas de datos.** En un Server Component, lanza las consultas independientes juntas con `Promise.all`; no `await` uno tras otro. Pasa promesas a hijos con `<Suspense>` cuando un bloque puede esperar.
3. **Uploads directos a Storage.** El body de una función de Vercel tiene límite de 4.5 MB: los archivos van del navegador a Supabase Storage con URL firmada; al servidor solo llega la ruta.
4. **El pipeline no bloquea la UI.** La acción "Generar" crea el proyecto y los `jobs`, responde de inmediato y el trabajo sigue en una ruta de servidor de larga duración (timeout por defecto 300 s en Fluid Compute). El cliente escucha Realtime de `jobs`; nada de polling cada segundo.
5. **Llamadas de IA en paralelo** cuando no dependen entre sí (extractores, imágenes por sección). Con límite de concurrencia (p. ej. 4) para no golpear el rate limit del usuario.

## Alto
6. **Bundle**: nada de librerías pesadas en el cliente para cosas que hace CSS (animación: `forja-motion`; carrusel: scroll-snap). Importar íconos por nombre (`lucide-react`), nunca el paquete entero. Revisar con el analizador de bundle si una página pasa de ~200 KB de JS.
7. **`next/dynamic`** para lo que no está en el primer pantallazo: grabador de audio, editor de sección, visor de diferencias.
8. **Imágenes con `next/image`** y dimensiones reales; `priority` solo en la imagen más grande del primer pantallazo.
9. **Fuentes con `next/font/google`**: solo pesos usados, `display: swap`. Las fuentes del cliente (tokens) se cargan solo dentro del mockup.
10. **Server Actions** para mutaciones (guardar llave, aprobar, editar sección) con `revalidatePath`/`revalidateTag` del recurso tocado, no de todo.

## Medio
11. **Estado del editor**: el PageSpec vive en un store local (Zustand o `useReducer`) y se guarda con debounce (800 ms) como nueva versión; no re-renderizar todo el mockup por cada tecla — memoizar por `section.id`.
12. **Mockup aislado**: renderizar las secciones en un contenedor con su propio CSS para que los estilos de la app no se mezclen ni provoquen recálculos globales.
13. **Streaming de texto**: si se muestra copy generándose en vivo (efecto para la tarima), usar streaming del AI SDK sobre el runtime Node por defecto; no hace falta Edge.
14. **Cache**: datos del usuario no se cachean entre usuarios; catálogos estáticos (presets, paletas, fuentes) sí.

## Checklist de PR (carril B)
- [ ] Ningún `"use client"` nuevo en layout/página
- [ ] Consultas independientes en paralelo
- [ ] Ningún archivo pasa por el body de una función
- [ ] Imports de íconos por nombre
- [ ] Lo que no está en el primer pantallazo es dinámico
- [ ] Lighthouse móvil de la página principal ≥ 90 en rendimiento
