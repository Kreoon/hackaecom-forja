---
name: forja-product-dna
description: Ingesta multimodal de FORJA — convierte fotos, audio, PDF/investigación, URLs e imágenes de referencia en un ProductDNA validado. Úsalo al construir o depurar el pipeline de ingesta, al agregar un tipo de input o al decidir qué proveedor procesa cada archivo.
---

# ProductDNA — todo lo que sabemos del producto, estructurado

Schema de referencia: [reference/product-dna.ts](reference/product-dna.ts) → copiar a `src/contracts/product-dna.ts`.

## Pipeline (carril A)
```
uploads ─▶ normalizar ─▶ extraer por tipo (paralelo) ─▶ "evidence[]" ─▶ síntesis LLM ─▶ ProductDNA (Zod)
```
Cada extractor devuelve `Evidence { source, kind, text, facts[], confidence }`. La síntesis **solo** usa evidencia; lo que no está, va a `unknowns[]` (nunca se inventa precio, ingredientes, certificaciones ni claims médicos).

| Input | Extractor | Proveedor sugerido (BYOK) | Notas |
|---|---|---|---|
| Fotos del producto | visión: qué es, color, material, contexto, texto visible en empaque | Gemini / GPT / Codex | Guardar original en Storage; generar `alt`. Detectar si tiene fondo limpio (útil para hero). |
| Audio (nota de voz) | transcripción → extracción de facts | Gemini (audio nativo) o OpenAI transcribe | Límite 4.5 MB por request en Vercel: subir directo a Storage y pasar URL firmada. |
| PDF / investigación / texto | parseo → resumen + facts | Gemini (PDF nativo) / Codex | Para PDFs grandes: chunk por página. |
| URL de referencia | scrape (markdown + screenshot) | Firecrawl / Apify | Sacar: estructura de secciones, tono, oferta, colores. Va a `references`, NO a facts del producto. |
| Imágenes de referencia (mood) | visión: estilo, paleta, tipografía, composición | Gemini / GPT | Alimenta `DesignTokens` (skill del brand-director). |

## Reglas
- **Separar producto de referencia**: lo que viene de la web de un competidor es inspiración de estilo/estructura, no facts de nuestro producto.
- **Confianza**: cada fact con `confidence` 0–1 y `sources[]`. La UI muestra en amarillo lo < 0.6 para que el usuario confirme.
- **Pregunta mínima**: si faltan `price` o `name`, la UI los pide (1 pantalla, 2 campos). Todo lo demás se infiere o queda en `unknowns`.
- **Idioma**: detectar idioma del audio; salida en `locale` del proyecto (default es-CO).
- **Claims sensibles** (salud, adelgazar, curar): marcar `riskFlags` para que `forja-copy-chief` los suavice.

## Prompts
Los prompts de extracción y síntesis viven en `forja-prompts` (`ingest.*`, `dna.synthesize`). No escribir prompts inline en el código: importarlos del registro.
