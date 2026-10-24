---
name: forja-visual-assets
description: "Generar y optimizar recursos visuales de una landing FORJA (imágenes con la foto real como referencia, variantes por formato, loops de video opcionales) con procedencia y costo. Úsalo al implementar o ejecutar la generación de assets."
---

# /forja-visual-assets
## Entradas
PageSpec con `mediaAssetId` faltantes, foto real (`AssetRecord` source=upload), `resolveProvider(user, "image_edit" | "image_generate" | "video_generate")`, prompts `asset.*`.

## Pasos
1. Sin llave con la capacidad → usar la foto original + motion CSS (`forja-motion`) y avisar; nunca bloquear.
2. Imagen del producto: siempre edición/referencia con la foto real; sin texto en la imagen.
3. Formatos: hero 4:5 y 16:9, features 1:1; WebP; video MP4 H.264 silencioso ≤ 6 s (GIF solo si se pide, < 3 MB).
4. Guardar en Storage, `sha256`, `generation{provider, model, prompt, referenceAssetIds, jobId}`, `usage_events`.
5. Verificar modelos vigentes (`docs/09-herramientas.md`): p. ej. `gpt-image-1` se apaga el 23-oct-2026.

## Salida
`AssetRecord[]` publicables + nueva versión del PageSpec con los `assetId`.

## Ejemplo
Termo: hero 4:5 desde la foto del termo sobre madera con luz cálida; `a_loop` con image-to-video solo si el usuario tiene Gemini con Veo.

## Terminado cuando
Revisión visual: el producto coincide con la foto; cada asset tiene procedencia y hash; el costo aparece en `usage_events`.
