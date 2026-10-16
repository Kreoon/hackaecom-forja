---
name: forja-byok-providers
description: BYOK (bring your own key) de FORJA — interfaz única de proveedores de IA (texto, visión, audio, imagen, animación, scraping), matriz de capacidades, cifrado de llaves y selección automática según las llaves que cargó el usuario. Úsalo al agregar un proveedor, al llamar a cualquier modelo o al tocar el manejo de llaves.
---

# BYOK — cada usuario trae sus llaves

## Interfaz única (`src/lib/ai/providers/`)
```ts
export type Capability = "text" | "vision" | "audio_transcribe" | "pdf" | "image_generate" | "image_edit" | "video_generate" | "scrape";

export interface ProviderAdapter {
  id: "openai" | "gemini" | "anthropic" | "fal" | "magnific" | "kie" | "apify" | "firecrawl";
  capabilities: Capability[];
  validateKey(key: string): Promise<{ ok: boolean; detail?: string }>; // llamada barata real
  // Cada método existe solo si la capability está declarada
  generateObject?<T>(args: { schema: ZodType<T>; system: string; prompt: string; images?: string[]; files?: string[] }): Promise<T>;
  transcribe?(args: { audioUrl: string; language?: string }): Promise<string>;
  generateImage?(args: { prompt: string; referenceImages?: string[]; aspect: "1:1" | "4:5" | "16:9" | "9:16" }): Promise<{ url: string }>;
  generateVideo?(args: { prompt: string; imageUrl: string; seconds: number }): Promise<{ url: string; jobId?: string }>;
  scrape?(args: { url: string }): Promise<{ markdown: string; screenshotUrl?: string }>;
}
```
`resolveProvider(userId, capability)` → elige el primer proveedor con llave válida según el orden de preferencia del usuario (editable en Ajustes) y, si ninguno, error con CTA "agrega una llave que haga X".

## Matriz sugerida (verificar modelos vigentes con `docs-researcher` el día 0)
| Proveedor | text/vision | audio | pdf | imagen | animación/video | scrape |
|---|---|---|---|---|---|---|
| Gemini | ✅ | ✅ nativo | ✅ nativo | ✅ (familia Gemini image) | ✅ (Veo, si la cuenta lo tiene) | — |
| OpenAI | ✅ | ✅ transcribe | ✅ | ✅ (gpt-image) | según cuenta | — |
| Anthropic | ✅ (mejor en copy y JSON largo) | — | ✅ | — | — | — |
| fal.ai | — | ✅ (whisper) | — | ✅ (flux, edits) | ✅ (image-to-video) | — |
| Magnific / KIE | — | — | — | ✅ upscale / imagen | ✅ video | — |
| Firecrawl / Apify | — | — | — | — | — | ✅ |

"Mínimo viable" para que FORJA funcione completo: **una llave Gemini** (texto+visión+audio+pdf+imagen). Recomendarlo en el onboarding. Sin scraper, las URLs de referencia se procesan con un fetch simple + screenshot por proveedor de visión.

## Animaciones / GIF
Orden de preferencia: (1) motion CSS en las secciones (gratis, siempre); (2) image-to-video corto (3–5 s, loop) desde la foto hero → convertir a MP4 silencioso (no GIF pesado) para `video`/`features_media`; (3) GIF solo si el usuario lo pide explícitamente.

## Seguridad de llaves (no negociable)
- Tabla `provider_keys(user_id, provider, secret_id → vault.secrets, last4, status, validated_at)`. El texto plano **nunca** se guarda en tablas normales.
- Cifrado/descifrado solo en server (Route Handlers / Server Actions) con service role; función `get_provider_key(provider)` `security definer` que verifica `auth.uid()`.
- Nunca enviar llaves al cliente; la UI solo ve `last4` y `status`.
- Nunca loguear prompts con llaves ni headers. Redactar `Authorization`/`x-api-key`/`X-Shopify-Access-Token` en el logger.
- Validar la llave al guardarla (`validateKey`) y marcar `status`.
- Rate limit por usuario en endpoints que gastan su llave (evita que un bug le queme el saldo).
- Costos: registrar tokens/imagenes por job en `usage_events` y mostrar "esto te costó ~$X" al final.
