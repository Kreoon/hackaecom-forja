# Arranque de una corrida de 15 minutos (copiar y pegar)

Abre una **conversación nueva** en este repo (`hackaecom-forja`), haz los 3 pasos previos y pega el bloque de abajo con tus datos.

## Antes de pegar (1 minuto)
1. **Panel del navegador** de la conversación nueva: abre `https://hackaecom.myshopify.com`, escribe la contraseña de la tienda y entra. En otra pestaña deja abierto el admin (`https://admin.shopify.com/store/hackaecom`) con tu sesión.
2. Ten a mano el producto: **URL** (Amazon, AliExpress, página oficial) **o fotos / hoja de branding** adjuntas al mensaje.
3. Créditos de Magnific: una corrida gasta ≈ 2.500. Si hay menos, recarga antes.

## Bloque para pegar

```
/tienda-express
Corrida cronometrada de 15 minutos. Sigue la skill tienda-express al pie de la letra y llama a los agentes tienda-* por olas, en paralelo.

DATOS
- Producto: <URL del producto | "fotos adjuntas">
- Página de referencia (la que copiamos): <URL>
- Slug: <nombre-corto-sin-espacios>
- Oferta: <"demo" | 1 unidad $____ · Pack x2 $____ + regalo ____>
- Garantía: <"demo 7 días" | la real>
- Marca de la tienda: <la del producto | otra | "nombre de la tienda">
- Tienda: hackaecom.myshopify.com · tema base "Base tienda express (no tocar)" (neutro; la marca la pone la corrida) · contraentrega con Releasit

CÓMO CORRERLA
1. Arranque: python -I tools/tienda/nueva.py <slug> "<producto>" "<referencia>". Si mandé fotos, guárdalas en jornadas/<slug>/insumos/.
2. Ola 1 (un solo mensaje, en paralelo): tienda-referencia, tienda-producto, tienda-creativos.
   - tienda-referencia deja PRIMERO referencia/imgs/<id>.jpg (imagen objetivo por cada ID) y luego el mapa y estilo.json.
   - tienda-producto deja PRIMERO insumos/ref_frontal.jpg (+ otras vistas) y luego la ficha y producto.json.
   - tienda-creativos usa Nano Banana Pro 1k con las vistas del producto + la imagen objetivo de cada ID; UGC uno por uno; actualiza urls.json y corre descargar.py después de cada espera.
3. Ola 2: tienda-copy apenas terminen referencia y producto (creativos sigue).
4. Ola 3: tienda-ensamblador cuando terminen copy Y creativos (tema nuevo duplicado de "Base tienda express (no tocar)", producto, galería, push).
5. Ola 4: tienda-qa. Si el agente no tiene navegador, corre tú tools/tienda/qa.js en el panel.
6. Cierre: python -I tools/tienda/estado.py jornadas/<slug> debe decir AL DÍA. Dame el link de preview, el tiempo por ola (corrida.json → hitos) y los pendientes humanos.

REGLAS
- Misma estructura y elementos que la referencia, sin quitar secciones. Datos solo del producto (nada de cifras, reseñas ni garantías de la referencia; reseñas de ejemplo marcadas demo).
- Se cambian TODAS las imágenes y el producto se ve igual en todas, con la etiqueta legible. Revisa creativos/revision.jpg (referencia | nuestra) antes de ensamblar.
- Si algo cambia después del armado (creativos rehechos, brief editado): relanza tienda-ensamblador en MODO RE-SUBIDA (assets + plantilla + galería reemplazada) en el mismo turno. No digas "listo" mientras estado.py diga DESACTUALIZADO.
- Si un agente se corta, relánzalo con "continúa" (descargar.py recupera lo generado).
- Nunca toques el tema publicado ni el tema base; no publiques el tema ni envíes pedidos sin mi OK.
- Estoy autorizando por adelantado: crear el producto, publicarlo en Tienda online, cargar/reemplazar su galería, duplicar el tema base y subir el tema nuevo.
- Avísame en una línea al empezar cada ola. Mientras corre la ola 2 mándame la ficha y los ángulos para Anuncios (Joaquín) y la revision.jpg para Creativos.
```

## Qué esperar
| Min | Qué pasa | Qué recibes |
|---|---|---|
| 0–4 | Ola 1: referencia, producto y creativos en paralelo | Aviso de arranque |
| 4–8 | Ola 2: copy (creativos sigue) | Ficha y ángulos para Anuncios, `revision.jpg` |
| 8–11 | Ola 3: tema nuevo, producto, galería | Link de preview |
| 11–13 | Ola 4: QA automático + revisión visual + formulario Releasit | OK / NO OK y lo arreglado |
| 13–15 | Cierre | Tiempos por ola y pendientes (publicar, reseñas reales) |

## Si algo sale mal
- **"Las imágenes no cambiaron"** → pide: `corre estado.py y si dice DESACTUALIZADO relanza tienda-ensamblador en modo re-subida`.
- **"Las imágenes se ven genéricas o sin etiqueta"** → pide: `rehaz con tienda-creativos los IDs <lista> calcando referencia/imgs/<id>.jpg; luego re-subida`.
- **El agente se detiene pidiendo permiso** → apruébalo; para que no vuelva a pasar, permite de antemano las mutaciones de Shopify con `/permissions` desde una terminal `claude`.
- **Pantalla de contraseña en el preview** → vuelve a escribir la contraseña en el panel del navegador de esa conversación.

Referencias: skill [`tienda-express`](../.claude/skills/tienda-express/SKILL.md) · agentes `.claude/agents/tienda-*.md` · contrato [`tools/tienda/brief.schema.md`](../tools/tienda/brief.schema.md) · ensayo NÜMA y sus lecciones: `jornadas/numa-movilidad-articular/`.
