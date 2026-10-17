---
name: tienda-express
description: "Orquesta una jornada \"tienda Shopify express\" — de cero a vendiendo un producto, replicando estructura y estilo de una página de referencia con creativos e info propios. Úsalo cuando alguien diga \"montemos la tienda de <producto>\", \"clonemos esta página para <producto>\", o al arrancar cualquier fase (insumos, referencia, brief, setup Shopify, página, QA, lanzamiento)."
---

# Tienda express

Documento maestro (roles, fases, checkpoints): [`docs/jornada-02-tienda-express.md`](../../../docs/jornada-02-tienda-express.md).

## Al arrancar
1. Crear `jornadas/<slug-producto>/{insumos,referencia,creativos,tema}` y `brief.md`, `qa.md`.
2. Confirmar insumos F0 (si falta uno, preguntar; no inventar): producto, precio de venta y costo, proveedor/ficha, fotos reales, URL de referencia, país y moneda, COD sí/no, tienda Shopify destino.
3. Verificar la tienda conectada con `get-shop-info` del MCP de Shopify y **confirmar que es la de destino** antes de escribir nada.

## Fases → skill
| Fase | Skill |
|---|---|
| F0 Ficha del producto | `tienda-ficha-producto` |
| F1 Leer referencia | `tienda-leer-referencia` |
| F1→Creativos | `tienda-pedido-creativos` |
| F2 Brief y copy (+ marca y logo si no hay) | `tienda-brief-producto` (+ `forja-ecom-cro`, `forja-voz-humana`) |
| F3 Setup Shopify | `tienda-shopify-setup` |
| F4 Página clonada | `tienda-clonar-pagina` (+ `forja-liquid-sections`, `forja-art-direction`) |
| F5–F6 QA y lanzamiento | `tienda-qa-lanzamiento` |

Si una skill aún no existe, hacer el paso a mano, anotar lo que funcionó en `jornadas/<slug>/notas-skill.md` y al cerrar la fase convertirlo en la skill.

## Reglas
- La referencia aporta estructura y estilo; los datos salen del producto. Cifras, reseñas, garantías y "envío gratis" solo si el equipo los confirma.
- Cada fase cierra con su checkpoint del orquestador (Juan Diego) antes de pasar a la siguiente.
- Nada se publica sin contraseña quitada por decisión explícita del orquestador; pedidos de prueba se cancelan/reembolsan.
- Trabajo largo y fuera de la ruta crítica (investigación de competidores, variantes de copy de anuncios, video) → Hermes (`delegar-hermes`).
