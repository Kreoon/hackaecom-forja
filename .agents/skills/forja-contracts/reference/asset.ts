// Registro de assets con procedencia v1 (referencia). Copiar a src/contracts/asset.ts.
// Complementa AssetSchema de pagespec.ts (que es la vista que consume la página).
import { z } from "zod";

export const AssetRecordSchema = z.object({
  id: z.string().min(1),
  projectId: z.string(),
  kind: z.enum(["image", "gif", "video", "audio", "document"]),
  // upload = lo subió el usuario (su producto); generated = IA; reference = material de terceros (solo inspiración)
  source: z.enum(["upload", "generated", "reference"]),
  storagePath: z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\//), // <user_id>/<project_id>/...
  mime: z.string(), // detectado por magic bytes, no por extensión
  bytes: z.number().int().positive(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/), // entra en el specHash de la aprobación
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  alt: z.string().max(140).optional(),
  generation: z
    .object({
      provider: z.string(),
      model: z.string(),
      prompt: z.string(),
      referenceAssetIds: z.array(z.string()), // la foto real usada como referencia
      jobId: z.string(),
    })
    .optional(),
  // Los assets "reference" nunca se publican en la tienda del usuario.
  publishable: z.boolean(),
  shopify: z.object({ fileId: z.string().optional(), mediaId: z.string().optional(), url: z.string().url().optional() }).optional(),
  createdAt: z.string(),
});
export type AssetRecord = z.infer<typeof AssetRecordSchema>;

export const isPublishable = (a: AssetRecord) => a.publishable && a.source !== "reference";
