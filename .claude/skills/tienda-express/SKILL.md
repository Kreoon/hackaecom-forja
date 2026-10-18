---
name: tienda-express
description: "Orquesta una corrida tienda-express en ~15 minutos: producto + página de referencia → página de producto clonada en un tema nuevo de Shopify, con creativos nuevos, copy, contraentrega (Releasit) y QA, usando 6 agentes en paralelo. Úsalo cuando alguien diga \"montemos la tienda de <producto>\", \"clonemos esta página para <producto>\" o \"corrida de 15 minutos\"."
---

# Tienda express · corrida de 15 minutos

Documento maestro (roles, decisiones): [`docs/jornada-02-tienda-express.md`](../../../docs/jornada-02-tienda-express.md). Contrato del brief: [`tools/tienda/brief.schema.md`](../../../tools/tienda/brief.schema.md).

## 0. Antes de que corra el reloj (tienda base, una sola vez)
Verificar con el MCP de Shopify y no repetir si ya está:
- [ ] Tienda `hackaecom.myshopify.com`: moneda COP, mercado Colombia, zona de envío Colombia, bodega en Colombia (`tienda-shopify-setup` §7).
- [ ] Releasit instalado y configurado en español; App embed en el tema base (`tienda-shopify-setup` §8).
- [ ] Páginas y menús en español sin enlaces rotos (§6). Inicio con `hk-redirect`.
- [ ] Tema base **"HACKY Landing"** (id 165468078339) con el kit `hk-*`, logo, header/footer HACKY y locale en español. No se edita durante la corrida: se duplica.
- [ ] Panel del navegador con la tienda desbloqueada (contraseña escrita por el usuario) y sesión de admin; Shopify CLI con sesión (`shopify theme list --store hackaecom.myshopify.com`).
- [ ] Créditos de Magnific ≥ 2.000 (`account_balance`).

## 1. Arranque (minuto 0)
Pide en un solo mensaje lo que falte: URL o fotos del producto, URL de referencia, precio/oferta (si no, demo). Luego:
```
python -I tools/tienda/nueva.py <slug> "<url producto>" "<url referencia>"
```

## 2. Olas (lanzar cada ola en UN mensaje con varias llamadas `Agent`)
| Min | Ola | Agentes en paralelo | Sale |
|---|---|---|---|
| 0–4 | 1 | `tienda-referencia` · `tienda-producto` · `tienda-creativos` (arranca con la URL; espera `producto.json` si lo necesita) | mapa + estilo · ficha + producto.json · imágenes |
| 4–8 | 2 | `tienda-copy` (creativos sigue corriendo) | brief.json |
| 8–11 | 3 | `tienda-ensamblador` (cuando copy y creativos terminaron) | tema nuevo + producto + preview |
| 11–13 | 4 | `tienda-qa` | qa.js ok + capturas |
| 13–15 | — | Orquestador: resumen al equipo, link de preview, pendientes humanos | |

Prompt de cada agente: `Corrida jornadas/<slug>. Lee corrida.json y sigue tu definición. Presupuesto N min.` (nada más: el agente sabe qué hacer).
Mientras corre la ola 2, avisar a Anuncios (Joaquín): ficha + ángulos del brief para empezar campañas; a Creativos: `creativos/revision.jpg` para aprobar.

## 3. Si algo se atrasa
- Creativos tarde → ensamblar igual: las imágenes que falten salen como placeholder rayado con su ID; se re-sube solo `assets/` después (`--only assets/*`).
- Referencia con sección SIN KIT → usar la clave más cercana y anotarlo para crear la sección después (no frenar la corrida).
- Agente sin acceso al navegador → el orquestador corre `tools/tienda/qa.js` él mismo.

## 4. Cierre
- Publicar el tema (solo con OK del orquestador; el conector no publica temas: admin → Temas → Publicar).
- Pedido de prueba por Releasit y cancelación (`tienda-shopify-setup` §8), solo si el equipo lo pide.
- `corrida.json` con todos los hitos → tiempo total en `docs/estado.md`.

## Reglas
- La referencia aporta estructura y estilo; los datos salen del producto. Cifras, reseñas y garantías solo con fuente o decisión del equipo (reseñas demo marcadas).
- Misma estructura que la referencia, sin quitar secciones ni elementos.
- **Navegación sin callejones**: todo enlace del menú apunta a una página creada o se quita.
- Cada corrida en un **tema nuevo** y con su propia plantilla `product.<sufijo>`; nunca editar el tema publicado ni el base.
- Trabajo largo fuera de la ruta crítica (variantes de anuncios, video) → Hermes (`delegar-hermes`).
