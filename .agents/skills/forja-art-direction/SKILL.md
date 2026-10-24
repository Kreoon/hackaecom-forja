---
name: forja-art-direction
description: Dirección de arte de FORJA para landings de producto — cómo elegir estilo, paleta, tipografía, composición e imágenes según la categoría del producto y las referencias del usuario, y cómo detectar y evitar el "look de IA". Úsalo al definir DesignTokens, al diseñar o rediseñar una sección, al revisar si un mockup se ve genérico, o cuando alguien pida "que se vea más pro".
---

# Dirección de arte FORJA

Una landing de FORJA tiene que parecer hecha por un estudio que conoce el producto, no por una plantilla.
La dirección se decide **antes** de escribir CSS y se expresa en `DesignTokens` (contrato en `forja-pagespec`).

## 1. Decide en este orden
1. **¿Quién compra y desde dónde?** Celular, tráfico frío desde un anuncio, 3 segundos de atención. El diseño sirve a la venta (ver `forja-ecom-cro`).
2. **Categoría → preset** en [data/category-presets.json](data/category-presets.json). Es el punto de partida, no el resultado.
3. **Referencias del usuario** (imágenes, webs): suben o bajan el preset. Toma de ellas *temperatura, contraste, densidad, peso tipográfico, radio y cantidad de movimiento*. Nunca logos, nunca layouts calcados.
4. **Una idea memorable**: un solo rasgo que la gente recuerde (un titular gigante en serif, una franja de color acento que atraviesa secciones, fotos recortadas sin fondo flotando, un sticker de oferta girado). Uno. No cinco.
5. **Tokens**: paleta de [data/palettes.json](data/palettes.json) o derivada, pareja de [data/font-pairs.json](data/font-pairs.json), radio, estilo, motion.

## 2. Paleta
- Estructura fija: `background`, `surface`, `text`, `muted`, `primary`, `primaryText`, `accent`. Máximo **un** acento.
- El `primary` es el color del botón de compra. Debe ser el color más "llamativo" de la página y no repetirse en elementos decorativos grandes.
- Contraste **calculado** (no estimado): texto/fondo ≥ 4.5:1; texto grande y botón ≥ 3:1. Script de verificación en [scripts/contrast.mjs](scripts/contrast.mjs).
- Fondo casi nunca blanco puro ni negro puro: crema, hueso, gris cálido o tinta muy oscura dan más calidad percibida.
- Deriva de la foto del producto: si el producto es protagonista de color (un termo rojo), el fondo se calma y el acento acompaña; si el producto es neutro (acero, blanco), la paleta aporta el color.

## 3. Tipografía
- Dos familias máximo, ambas de Google Fonts (las mismas cargan en Shopify).
- El titular lleva el carácter: serif expresiva, grotesca condensada o display. El cuerpo es legible y neutro.
- Escala para móvil: titular hero 36–44 px, H2 28–32 px, cuerpo 16–18 px, interlineado cuerpo 1.5, titulares 1.05–1.15. Tracking negativo leve en titulares grandes.
- Prohibido como titular: Inter, Roboto, Arial, Open Sans, Poppins genérica (sirven de cuerpo, no de voz).

## 4. Composición
- Ritmo vertical en múltiplos de 8. Secciones con padding 64–96 px en móvil, 96–144 px en desktop.
- Alterna densidades: una sección aireada, una densa, una a sangre completa. La monotonía (tres tarjetas iguales tras tres tarjetas iguales) es la firma de la IA.
- Ancho de lectura 60–72 caracteres. Nada de párrafos a todo el ancho en desktop.
- Asimetría intencional en desktop (split 7/5, imagen que rompe la grilla); en móvil, pila limpia con la imagen antes del texto solo si la imagen vende más que el titular.
- Un solo foco por pantalla. Si dos cosas gritan, ninguna se oye.

## 5. Imágenes
- La foto real del producto manda. Las generadas deben mostrar **el mismo** producto (ver `forja-visual-producer`).
- Producto recortado sin fondo + sombra de contacto suave > foto de catálogo con fondo gris.
- Personas: latinoamericanas, naturales, en contexto real de uso. Cero stock genérico.
- Íconos: un solo set, trazo uniforme (Lucide). Nunca emojis como íconos.

## 6. Test anti-"look de IA"
Si la página tiene 3 o más de estas, rediseña:
- [ ] Gradiente morado→azul o "aurora" de fondo
- [ ] Tarjetas idénticas con ícono en círculo de color pastel
- [ ] Todo centrado, todo con el mismo padding
- [ ] Titulares que empiezan con "Descubre", "Eleva", "Transforma", "Revoluciona"
- [ ] Glassmorphism sin razón
- [ ] Sombras grandes y difusas en todo
- [ ] Ninguna foto real del producto en el primer pantallazo
- [ ] Emojis en titulares o como íconos
- [ ] Botones con gradiente

## 7. Entrega
Cuando definas o revises dirección, entrega:
1. Tokens JSON válidos (`DesignTokensSchema`).
2. `rationale`: 2–3 frases que citen qué viene de cada referencia o del preset.
3. La "idea memorable" en una línea y en qué sección vive.
4. Resultado del script de contraste.
