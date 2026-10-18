# Jornada 02 · Tienda Shopify express (de cero a vendiendo)

> Un solo equipo. Objetivo: tienda Shopify **vendiendo** en tiempo récord, **idéntica en estructura y estilo a una página de referencia**, con creativos e información de nuestro producto.
> Cada paso que hagamos en el ejemplo se convierte en una skill reutilizable (`.claude/skills/tienda-*`).

## Equipo y responsabilidades

| Rol | Persona | Entrega | Recibe de |
|---|---|---|---|
| Orquestador | Juan Diego Libreros | Ritmo, decisiones, checkpoints, desbloqueos; da el ✓ final | Todos |
| Sitio web (tienda) | Alexander Cast | Shopify configurado + página de producto clonada de la referencia + checkout probado | Creativos (assets), Orquestador (producto/precio) |
| Creativos | (por definir) | Fotos/renders de producto, GIFs/video corto, banners, imágenes de reseñas, logo | Sitio (lista de huecos de la referencia), Anuncios (ángulos) |
| Anuncios | Joaquín | Ángulos, copys, campañas Meta/TikTok, píxel verificado, UTMs | Sitio (URL + eventos), Creativos (piezas) |

**Regla de oro:** la información del producto viene del producto (proveedor, ficha, fotos reales). La referencia solo aporta **estructura y estilo**; nunca cifras, testimonios ni garantías.

## Flujo (fases y checkpoints)

```
F0 Insumos ─▶ F1 Lectura de referencia ─▶ F2 Brief del producto ─▶ F3 Setup Shopify
                    │                              │                      │
                    └──▶ Lista de huecos ──▶ Creativos produce ◀── Ángulos de Anuncios
                                                   │
F4 Construir página (clon) ◀───────────────────────┘ ─▶ F5 QA + compra de prueba ─▶ F6 Lanzamiento (píxel, URL a Anuncios)
```

| Fase | Qué sale | Dueño | Checkpoint (lo valida el orquestador) |
|---|---|---|---|
| F0 Insumos | Producto, precio/costo, proveedor, fotos, info, URL de referencia, país/moneda, método de pago (COD sí/no) | Orquestador | Todo en `jornadas/<producto>/insumos/` |
| F1 Lectura de referencia | Screenshot completo, mapa de secciones en orden, paleta, tipografías, copy por sección, **lista de huecos** (qué imagen/video necesita cada sección, con medidas) | Sitio | Mapa de secciones aprobado |
| F2 Brief | Nombre, promesa, beneficios, objeciones/FAQ, oferta (packs), copy por sección **mapeado 1:1 a la referencia** | Sitio + Anuncios | Copy aprobado |
| F3 Setup Shopify | Tienda, dominio, moneda, envíos, pagos/COD, políticas, producto + variantes, apps mínimas | Sitio | Producto visible en preview |
| F4 Página | Tema base + secciones replicando la referencia; assets de creativos insertados | Sitio | Lado a lado con la referencia (móvil y desktop) |
| F5 QA | Pedido de prueba, móvil, velocidad, enlaces, píxel disparando ViewContent/AddToCart/Purchase | Sitio + Anuncios | Checklist en verde |
| F6 Lanzamiento | Tienda abierta (sin contraseña), URL + UTMs entregadas a Anuncios | Orquestador | Primera campaña publicada |

## Corrida de 15 minutos (agentes en paralelo)

Guion: skill [`tienda-express`](../.claude/skills/tienda-express/SKILL.md). Agentes en `.claude/agents/tienda-*.md`. Scripts en `tools/tienda/`.

| Min | Ola | Agentes | Persona |
|---|---|---|---|
| 0 | Arranque | `nueva.py` | Juan Diego entrega producto + referencia |
| 0–4 | 1 | tienda-referencia · tienda-producto · tienda-creativos | — |
| 4–8 | 2 | tienda-copy (creativos sigue) | Joaquín arranca ángulos con la ficha; Creativos revisa `revision.jpg` |
| 8–11 | 3 | tienda-ensamblador (tema nuevo + producto + galería) | — |
| 11–13 | 4 | tienda-qa | Alexander revisa el preview |
| 13–15 | Cierre | resumen y link | Juan Diego aprueba y publica |

Medido el 2026-10-17 con la jornada HACKY: armado del tema 2,4 s; subida a un tema nuevo 12 s; QA automático `ok` (20 secciones, 79 imágenes, 0 placeholders, 0 enlaces rotos, Releasit activo). La ruta crítica restante es generación de imágenes y copy.

## Skills que vamos a dejar construidas (se completan durante el ejemplo)

| Skill | Fase | Qué hace |
|---|---|---|
| `tienda-express` | todas | Orquestadora: fases, checkpoints, quién hace qué, carpeta de la jornada |
| `tienda-leer-referencia` | F1 | URL → screenshot + mapa de secciones + tokens + lista de huecos (Firecrawl / navegador) |
| `tienda-brief-producto` | F2 | Insumos del producto → brief y copy por sección, respetando la estructura de la referencia |
| `tienda-shopify-setup` | F3 | Configuración de la tienda vía Admin API/MCP: producto, variantes, envíos, COD, políticas |
| `tienda-clonar-pagina` | F4 | Mapa de secciones → secciones Liquid / template JSON del tema; push con Shopify CLI |
| `tienda-qa-lanzamiento` | F5–F6 | Checklist de QA, pedido de prueba, píxel, entrega a Anuncios |
| `tienda-pedido-creativos` | F1→Creativos | Lista de huecos → brief de creativos con medidas y referencias |

Reutilizamos del kit FORJA: `forja-ecom-cro` (criterio de conversión), `forja-art-direction`, `forja-reference-reader`, `forja-liquid-sections`, `forja-seo-shopify`, `forja-voz-humana`.

## Carpeta de cada jornada

```
jornadas/<producto>/
  insumos/        # fotos, ficha, audio, PDF del proveedor
  referencia/     # screenshots, mapa-secciones.md, tokens.json
  brief.md        # copy por sección
  creativos/      # entregas del equipo de creativos
  tema/           # secciones Liquid y templates (lo que se sube a Shopify)
  qa.md           # checklist y evidencias
```

## Hermes (servidor casa)
Se usa para trabajo largo y acotado que no bloquea la ruta crítica:
- `estratega`: investigación de competidores/ángulos del producto (para Anuncios).
- `redes` / `anuncios`: variantes de copy y anuncios en video (HyperFrames) para Joaquín y Creativos.
- `vibecoding`: boilerplate de secciones Liquid repetitivas si hace falta.
La ruta crítica (referencia → página → checkout) se queda aquí.

## Stack elegido (investigación 2026-10-17)

| Pieza | Elección | Por qué |
|---|---|---|
| Base de secciones | Repo propio `AlexanderKast/biolipo-tienda` (secciones `bl-*`: packs, sticky ATC, comparativa, testimonios, trust bar, videos, WhatsApp; `scripts/gen_templates.py` copy.md → template JSON) | Tienda real de 1 producto ya probada; solo falta adaptarla a COD |
| Tema base | Shopify **Horizon** (o Dawn si queremos lo más liviano) | Oficial, OS 2.0; licencia solo para tiendas Shopify |
| Subir el tema | **Shopify CLI 4.9.4** (`theme pull/dev/push --unpublished`, auth con Theme Access) + `shopify theme check` | Nunca `--allow-live` sin aprobación. Falta instalarlo en esta máquina |
| Docs y validación | Plugin oficial **Shopify AI Toolkit** (skill `shopify`) + MCP `@shopify/dev-mcp` | Valida Liquid/GraphQL contra el esquema actual. Ojo: manda telemetría a shopify.dev |
| Leer referencia | **Firecrawl MCP** (screenshot, branding, markdown) + `/products.json` de la tienda de referencia | Ya conectado |
| Contraentrega | App **Releasit COD Form** (alt. EasySell), activada como *App embed* | No hay COD open source mantenido; instalar y aceptar términos lo hace una persona |
| Anuncios / creativos | `marketingskills/ad-creative` (specs y zonas seguras) + repo propio `Kreoon/ugc-factory` (video UGC con fal.ai) + Hermes | Para Joaquín y Creativos |

Descartados: scrapers de tiendas de baja calidad, `screenshot-to-code` (no genera Liquid), `thomasavada/shopify-clone-store` (solo como inspiración: depende de skills deprecadas).

## Pendientes conocidos
- Shopify CLI 4.9.4 instalado (2026-10-17). Falta crear la contraseña de Theme Access en la tienda destino. Si `shopify` se queda colgado sin salida, correrlo con `CI=1`.
- Precios por plan de Releasit/EasySell sin verificar.
- **Tienda de la jornada: `hackaecom.myshopify.com`** (creada 2026-10-17, tienda de desarrollo de partner, USD/EE. UU., tema Horizon publicado, sin productos, sin apps salvo el conector de Claude). **No tocar `cod-dev`.** Para cobrar de verdad hará falta pasarla a plan pagado; moneda y país se ajustan en F3.
- El MCP `shopify-dev` (docs) no conectó en esta sesión; reintentar con `/mcp`.
