---
name: forja-app-ui
description: Guía de la interfaz de la app FORJA (no de la landing del cliente) con shadcn/ui + Tailwind en Next.js — qué componentes usar en cada pantalla (registro, llaves BYOK, conexión Shopify, nuevo proyecto, progreso del pipeline, editor/mockup, aprobación), formularios con Zod, estados de carga/error/vacío, tema claro/oscuro y modo "pantalla gigante" para la tarima. Úsalo al construir o revisar cualquier pantalla del carril B.
---

# UI de la app FORJA

Dos mundos separados:
- **La app** (paneles, formularios, editor): shadcn/ui + Tailwind. Este skill.
- **La página del cliente** (mockup y Shopify): solo `forja-sections.css` + tokens + `forja-motion`. Nunca componentes shadcn dentro de una sección.

## Setup
```bash
npx shadcn@latest init
npx shadcn@latest add button input label form card dialog sheet tabs badge progress sonner tooltip dropdown-menu separator skeleton scroll-area toggle-group alert textarea
```
Verificar la versión vigente del CLI con `docs-researcher` antes de iniciar. Los componentes quedan en `src/components/ui/` (código propio, se editan libremente).

## Mapa de pantallas → componentes
| Pantalla | Componentes clave | Notas |
|---|---|---|
| Registro / login | `Card`, `Form`, `Input`, `Button` | Supabase Auth; errores en línea, no en alertas |
| Llaves (BYOK) | `Card` por proveedor, `Badge` de estado (válida / inválida / sin verificar), `Dialog` para pegar la llave | el input es `type="password"`, se envía a la RPC y se borra del estado; la UI solo muestra `•••• last4` |
| Conectar Shopify | `Tabs` (Guía / Credenciales / Probar), `Alert` de scopes faltantes | guía paso a paso con capturas del Dev Dashboard |
| Nuevo proyecto | zona de arrastre propia (sobre `Card`), grabador de audio, `Textarea` para notas, lista de URLs | subida directa a Storage con barra por archivo |
| Progreso del pipeline | lista de pasos propia + `Progress` | ver `forja-motion` §5; debe leerse desde 10 m |
| Editor / mockup | `ToggleGroup` móvil/desktop, `ScrollArea`, `Sheet` lateral para editar sección, `DropdownMenu` por sección (regenerar, bloquear, mover, borrar), `Tooltip` | el mockup va en un contenedor aislado con los tokens del cliente |
| Aprobar | `Dialog` de confirmación con tienda, estrategia y "quedará sin publicar hasta…" | el botón principal es el único `primary` de la pantalla |
| Notificaciones | `sonner` | éxito breve; errores con acción ("Reintentar", "Cambiar proveedor") |

## Formularios
- `react-hook-form` + `zodResolver` con los mismos schemas Zod del servidor (una sola validación compartida).
- Validar al salir del campo y al enviar; nunca mientras se escribe la primera vez.
- Botón de envío con estado `pending` (spinner dentro del botón, texto "Guardando…"), deshabilitado mientras corre.
- Server Actions devuelven `{ ok: true } | { ok: false, fieldErrors, message }`; nunca lanzan al cliente el error crudo del proveedor.

## Estados (toda pantalla los define)
| Estado | Patrón |
|---|---|
| Cargando | `Skeleton` con la forma final, no spinner a pantalla completa |
| Vacío | ilustración mínima + una acción ("Crea tu primer producto") |
| Error | qué pasó en humano + qué hacer + botón; detalle técnico colapsado |
| Parcial | el pipeline sigue aunque falle un extractor; se marca en ámbar ese input |

## Tema
- Variables CSS de shadcn (`--background`, `--primary`…) con la marca FORJA; modo oscuro por defecto en tarima (contraste alto en pantalla gigante).
- **Modo tarima** (`?stage=1` o toggle): escala base 125 %, texto mínimo 20 px, oculta paneles secundarios, animaciones de progreso más grandes.

## Accesibilidad mínima
Foco visible siempre, labels en todos los inputs, `aria-live="polite"` en el progreso, todo usable con teclado (el editor incluido), objetivos táctiles ≥ 44 px.
