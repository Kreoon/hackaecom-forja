---
name: forja-ui-review
description: Revisión de interfaz de FORJA — accesibilidad, usabilidad móvil, formularios, estados, jerarquía visual, rendimiento percibido y paridad mockup ↔ Shopify. Sirve para la app (carril B) y para las landings generadas. Entrega hallazgos con archivo:línea y arreglo concreto. Úsalo cuando pidan "revisa la UI", "audita accesibilidad", "¿esto está bien hecho?", antes de un merge de frontend o antes de la demo.
---

# Revisión de UI FORJA

Lee el código (y si hay app corriendo, ábrela en el navegador integrado a 390 px y 1280 px). No edites: reporta.

## Checklist
### Accesibilidad
- [ ] Contraste AA (usa `forja-art-direction/scripts/contrast.mjs` para los tokens)
- [ ] Foco visible en todo lo interactivo; orden de tabulación lógico
- [ ] Imágenes con `alt` significativo; decorativas con `alt=""`
- [ ] Inputs con `<label>` asociado; errores ligados con `aria-describedby`
- [ ] Botones son `<button>`, enlaces son `<a>`; nada de `div` con onClick
- [ ] `prefers-reduced-motion` respetado
- [ ] Idioma del documento correcto (`lang="es"`)

### Móvil y toque
- [ ] Nada se desborda horizontalmente a 360 px
- [ ] Objetivos táctiles ≥ 44 × 44 px con separación
- [ ] Texto base ≥ 16 px (evita el zoom de iOS en inputs)
- [ ] CTA principal visible sin scroll en la landing; sticky al bajar
- [ ] Teclado correcto por input (`inputmode`, `type="email"`, `autocomplete`)

### Formularios y estados
- [ ] Validación al salir del campo y al enviar, no mientras se escribe
- [ ] Botón de envío con estado de carga y deshabilitado mientras corre
- [ ] Toda vista tiene estados cargando / vacío / error definidos
- [ ] Mensajes de error dicen qué hacer, en español y sin jerga

### Jerarquía y contenido
- [ ] Un foco por pantalla; un solo botón primario
- [ ] Titulares escaneables; párrafos ≤ 72 caracteres de ancho
- [ ] Nada de texto de relleno ni lorem ipsum
- [ ] Copy sin voz de IA (`forja-voz-humana`)

### Rendimiento percibido
- [ ] Imágenes con tamaño reservado (sin saltos de layout)
- [ ] Skeletons con la forma final
- [ ] Respuesta a toques < 100 ms (feedback inmediato aunque la acción tarde)

### Paridad (solo landings)
- [ ] Cada sección se ve igual en el mockup y en la preview de Shopify (mismas clases `forja-*`, mismos tokens)
- [ ] Mismo orden, mismo copy, mismas imágenes

## Formato de salida
```
## Veredicto
<listo / listo con ajustes / no listo> — <1 línea>

| Prioridad | Archivo:línea | Problema | Arreglo |
|---|---|---|---|
| P0 | src/app/(app)/keys/page.tsx:58 | el input de la llave no tiene label | <Label htmlFor="key-openai">Llave de OpenAI</Label> |
```
P0 = bloquea uso o accesibilidad básica · P1 = degrada la experiencia · P2 = pulido. Máximo 15 hallazgos, los más importantes primero.
