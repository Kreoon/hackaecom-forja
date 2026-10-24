// Plan y registro de publicación v1 (referencia). Copiar a src/contracts/publication.ts.
// Publicar = ejecutar un plan de pasos idempotentes, cada uno con checkpoint, a partir de UNA aprobación.
import { z } from "zod";
import { PUBLICATION_STATES } from "./jobs";

export const PublishStepKindSchema = z.enum([
  "snapshot", // leer estado previo: producto por handle, scopes, tema principal (OS 2.0 o vintage)
  "upload_media", // stagedUploadsCreate → fileCreate → esperar READY (reusar fileId si el sha256 ya subió)
  "upsert_product", // crear si no existe; si existe y NO es de FORJA, solo campos que FORJA posee
  "set_metafield", // metafieldsSet: namespace de la app, key page_spec, type json (≤ 128 KB)
  "ensure_app_block", // estrategia app_block: comprobar o guiar (deep link addAppBlockId) al comerciante
  "create_page", // estrategia page: pageCreate/pageUpdate por handle
  "verify_storefront", // leer la URL de preview y comprobar data-forja-hash == specHash
  "publish", // solo con publishMode = live: publishablePublish (write_publications)
]);
export type PublishStepKind = z.infer<typeof PublishStepKindSchema>;

export const PublishStepSchema = z.object({
  kind: PublishStepKindSchema,
  idempotencyKey: z.string(), // approvalId + kind + objeto (p. ej. assetId): repetir no duplica
  requiresScopes: z.array(z.string()),
  state: z.enum(["pending", "done", "failed", "skipped"]),
  // Lo que el paso creó o cambió: base para reanudar y para deshacer.
  checkpoint: z.record(z.string(), z.string()).optional(), // p. ej. { productId, fileId, metafieldId }
  before: z.record(z.string(), z.unknown()).optional(), // valor previo de lo que FORJA sobrescribió
  error: z.object({ code: z.string(), message: z.string(), retryable: z.boolean() }).optional(),
});
export type PublishStep = z.infer<typeof PublishStepSchema>;

export const PublicationSchema = z.object({
  id: z.string(),
  approvalId: z.string(),
  projectId: z.string(),
  shopId: z.string(),
  specHash: z.string().regex(/^[a-f0-9]{64}$/),
  strategy: z.enum(["app_block", "page", "theme_files"]),
  state: z.enum(PUBLICATION_STATES),
  steps: z.array(PublishStepSchema).min(1),
  previewUrl: z.string().url().optional(),
  verification: z
    .object({
      checkedAt: z.string(),
      hashMatches: z.boolean(),
      httpStatus: z.number().int(),
      missingSections: z.array(z.string()), // ids de secciones que no aparecieron en el HTML
      notes: z.array(z.string()),
    })
    .optional(),
  startedAt: z.string(),
  finishedAt: z.string().optional(),
});
export type Publication = z.infer<typeof PublicationSchema>;

// Plan por estrategia. theme_files queda fuera del MVP (requiere exención de Shopify).
export function planSteps(args: {
  approvalId: string;
  strategy: "app_block" | "page";
  publishableAssetIds: string[];
  publishMode: "draft" | "live";
}): PublishStep[] {
  const k = (kind: PublishStepKind, obj = "") => `${args.approvalId}:${kind}${obj ? `:${obj}` : ""}`;
  const steps: PublishStep[] = [
    { kind: "snapshot", idempotencyKey: k("snapshot"), requiresScopes: ["read_products"], state: "pending" },
    ...args.publishableAssetIds.map(
      (id): PublishStep => ({ kind: "upload_media", idempotencyKey: k("upload_media", id), requiresScopes: ["write_files"], state: "pending" }),
    ),
    { kind: "upsert_product", idempotencyKey: k("upsert_product"), requiresScopes: ["write_products"], state: "pending" },
    { kind: "set_metafield", idempotencyKey: k("set_metafield"), requiresScopes: ["write_products"], state: "pending" },
    args.strategy === "app_block"
      ? { kind: "ensure_app_block", idempotencyKey: k("ensure_app_block"), requiresScopes: ["read_themes"], state: "pending" }
      : { kind: "create_page", idempotencyKey: k("create_page"), requiresScopes: ["write_online_store_pages"], state: "pending" },
    { kind: "verify_storefront", idempotencyKey: k("verify_storefront"), requiresScopes: [], state: "pending" },
  ];
  if (args.publishMode === "live") {
    steps.push({ kind: "publish", idempotencyKey: k("publish"), requiresScopes: ["write_publications"], state: "pending" });
  }
  return steps;
}

// Reanudar: el primer paso no terminado. Los "done" no se repiten.
export const nextStep = (steps: PublishStep[]) => steps.find((s) => s.state === "pending" || s.state === "failed");
