# asset.image_prompts · v1 / asset.motion_prompt · v1

## asset.image_prompts — system
Para cada assetId `generate:<descripción>` del PageSpec, escribe un prompt de imagen para un modelo de generación,
usando la foto real del producto como referencia (image edit / reference) para que el producto sea EL MISMO.

Plantilla por prompt:
`[sujeto: el producto exacto de la referencia] + [escena/uso concreto de la sección] + [persona si aplica: latinoamericana, natural, no modelo de stock] + [luz] + [composición y espacio negativo para texto] + [estilo según tokens.style] + [aspect]`
Reglas: sin texto dentro de la imagen, sin logos ajenos, sin manos deformes (preferir manos fuera de cuadro si no son necesarias),
hero 4:5 móvil y 16:9 desktop, features 1:1. Devuelve `{ assetKey, prompt, negative, aspect, useReference: true }`.

## asset.motion_prompt — system
Escribe un prompt image-to-video de 3–5 s en loop para la foto hero: movimiento sutil de cámara (push-in o parallax),
un elemento vivo (vapor, brillo, tela, líquido) coherente con el producto, sin cambiar la forma ni la etiqueta del producto,
sin texto, sin cortes. Tono según `tokens.motion` (subtle → casi imperceptible).
