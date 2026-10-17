// Contrato de proveedores BYOK v1 (referencia). Copiar a src/contracts/provider.ts.
// Regla: un adapter declara SOLO las capacidades que verificó en la doc oficial del proveedor.
import { z } from "zod";

export const CapabilitySchema = z.enum([
  "text",
  "vision",
  "audio_transcribe",
  "pdf",
  "image_generate",
  "image_edit",
  "video_generate",
  "scrape",
]);
export type Capability = z.infer<typeof CapabilitySchema>;

// Ids admitidos. "apimark" NO está: "API MARK" sigue sin identificar (docs/09-herramientas.md).
export const ProviderIdSchema = z.enum([
  "openrouter", // proveedor principal de LLM e imagen (ADR-010): un adapter, muchos modelos
  "openai",
  "gemini",
  "anthropic",
  "fal",
  "magnific",
  "kie",
  "apify",
  "firecrawl",
  "elevenlabs",
  "replicate",
]);
export type ProviderId = z.infer<typeof ProviderIdSchema>;

// Lo que el adapter sabe de sí mismo. Se muestra en Ajustes y decide resolveProvider().
export const ProviderManifestSchema = z.object({
  id: ProviderIdSchema,
  displayName: z.string(),
  capabilities: z.array(CapabilitySchema).min(1),
  // Cómo se valida la llave: endpoint barato y documentado. "paid_call" = no hay gratuito (avisar al usuario).
  validation: z.enum(["free_endpoint", "paid_call", "none"]),
  structuredOutput: z.boolean(), // soporta JSON schema nativo
  asyncJobs: z.boolean(), // imagen/video por tarea + polling
  docsUrl: z.string().url(),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // fecha de la última verificación en la doc
  notes: z.string().max(400).optional(),
});
export type ProviderManifest = z.infer<typeof ProviderManifestSchema>;

// Errores tipados: la UI y los reintentos dependen de esta clasificación.
export const ProviderErrorCodeSchema = z.enum([
  "invalid_key", // 401/403: no reintentar; marcar provider_keys.status = invalid
  "insufficient_quota", // saldo o cuota agotada: no reintentar; avisar
  "rate_limited", // 429: reintentar con backoff respetando Retry-After
  "timeout", // reintentar 1 vez
  "provider_unavailable", // 5xx: reintentar con backoff, luego siguiente proveedor
  "content_policy", // rechazo por política: no reintentar igual
  "invalid_output", // no pasó Zod: 1 reintento con los errores
  "unsupported_capability", // bug de código: no reintentar
]);
export type ProviderErrorCode = z.infer<typeof ProviderErrorCodeSchema>;

export const RETRYABLE: Record<ProviderErrorCode, boolean> = {
  invalid_key: false,
  insufficient_quota: false,
  rate_limited: true,
  timeout: true,
  provider_unavailable: true,
  content_policy: false,
  invalid_output: true,
  unsupported_capability: false,
};

// Registro de uso por llamada (tabla usage_events). Nunca incluye la llave ni el prompt completo.
export const UsageEventSchema = z.object({
  provider: ProviderIdSchema,
  operation: CapabilitySchema,
  model: z.string(),
  units: z.record(z.string(), z.number()), // p. ej. { inputTokens, outputTokens, images, seconds }
  estCostUsd: z.number().nonnegative().optional(), // solo si el proveedor publica precio
  latencyMs: z.number().int().nonnegative(),
  jobId: z.string().optional(),
});
export type UsageEvent = z.infer<typeof UsageEventSchema>;

// Interfaz del adapter (TypeScript; no se serializa). Cada método existe solo si la capability está declarada.
export interface ProviderAdapter {
  manifest: ProviderManifest;
  validateKey(key: string, signal?: AbortSignal): Promise<{ ok: boolean; code?: ProviderErrorCode; detail?: string }>;
  generateObject?<T>(args: {
    key: string;
    schema: z.ZodType<T>;
    system: string;
    prompt: string;
    images?: string[]; // URLs firmadas, nunca base64 enorme en logs
    files?: string[];
    signal?: AbortSignal;
  }): Promise<{ value: T; usage: UsageEvent }>;
  transcribe?(args: { key: string; audioUrl: string; language?: string; signal?: AbortSignal }): Promise<{ text: string; usage: UsageEvent }>;
  generateImage?(args: {
    key: string;
    prompt: string;
    referenceImages?: string[];
    aspect: "1:1" | "4:5" | "16:9" | "9:16";
    signal?: AbortSignal;
  }): Promise<{ url: string; usage: UsageEvent }>;
  generateVideo?(args: { key: string; prompt: string; imageUrl: string; seconds: number; signal?: AbortSignal }): Promise<{
    url?: string;
    providerJobId?: string; // async: el job runner hace polling
    usage: UsageEvent;
  }>;
  scrape?(args: { key: string; url: string; signal?: AbortSignal }): Promise<{ markdown: string; screenshotUrl?: string; usage: UsageEvent }>;
}
