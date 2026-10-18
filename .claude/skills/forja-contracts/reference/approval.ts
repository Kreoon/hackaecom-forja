// Aprobación ligada a versión v1 (referencia). Copiar a src/contracts/approval.ts.
// Lo aprobado es exactamente {versión del PageSpec + hash + tienda + destino}. Cualquier cambio la invalida.
// specHash usa node:crypto → solo en el servidor.
import { createHash } from "node:crypto";
import { z } from "zod";

// JSON canónico: claves ordenadas, sin espacios, sin undefined. Mismo input → mismo string.
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(",")}}`;
}

// Hash de lo que se verá publicado: el PageSpec + el contenido real (sha256) de cada asset referenciado.
// Así, reemplazar una imagen sin tocar el JSON también invalida la aprobación.
export function specHash(spec: unknown, assetSha256: Record<string, string>): string {
  const sortedAssets = Object.fromEntries(Object.entries(assetSha256).sort(([a], [b]) => (a < b ? -1 : 1)));
  return createHash("sha256").update(canonicalJson({ spec, assets: sortedAssets })).digest("hex");
}

export const PublishTargetSchema = z.object({
  shopId: z.string(),
  shopDomain: z.string().regex(/^[a-z0-9-]+\.myshopify\.com$/),
  // app_block = theme app extension lee metafield (MVP recomendado); page = pageCreate; theme_files = requiere exención
  strategy: z.enum(["app_block", "page", "theme_files"]),
  productHandle: z.string().regex(/^[a-z0-9-]+$/),
  publishMode: z.enum(["draft", "live"]), // draft = producto sin publicar + preview
});
export type PublishTarget = z.infer<typeof PublishTargetSchema>;

export const ApprovalSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  specVersion: z.number().int().positive(),
  specHash: z.string().regex(/^[a-f0-9]{64}$/),
  target: PublishTargetSchema,
  approvedBy: z.string(), // user id
  approvedAt: z.string(),
  status: z.enum(["active", "superseded", "revoked", "consumed"]),
});
export type Approval = z.infer<typeof ApprovalSchema>;

export type ApprovalCheck =
  | { ok: true }
  | { ok: false; reason: "status" | "version_changed" | "content_changed" | "target_changed" };

// Se llama justo antes de publicar, en el servidor, con el estado actual leído de la base.
export function checkApproval(
  approval: Approval,
  current: { specVersion: number; specHash: string; target: PublishTarget },
): ApprovalCheck {
  if (approval.status !== "active") return { ok: false, reason: "status" };
  if (approval.specVersion !== current.specVersion) return { ok: false, reason: "version_changed" };
  if (approval.specHash !== current.specHash) return { ok: false, reason: "content_changed" };
  if (canonicalJson(approval.target) !== canonicalJson(current.target)) return { ok: false, reason: "target_changed" };
  return { ok: true };
}
