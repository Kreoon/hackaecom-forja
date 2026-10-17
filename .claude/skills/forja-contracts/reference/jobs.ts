// Máquinas de estado v1 (referencia). Copiar a src/contracts/states.ts.
// Generación y publicación son procesos distintos: un proyecto puede tener jobs de generación
// y, aparte, publicaciones (cada una ligada a una aprobación).
import { z } from "zod";

type Machine<S extends string> = Record<S, readonly S[]>;

export const PROJECT_STATES = ["draft", "ingesting", "briefing", "composing", "review", "approved", "failed", "archived"] as const;
export type ProjectState = (typeof PROJECT_STATES)[number];
export const PROJECT_MACHINE: Machine<ProjectState> = {
  draft: ["ingesting", "archived"],
  ingesting: ["briefing", "failed"],
  briefing: ["composing", "ingesting", "failed"], // vuelve a ingesting si el usuario agrega material
  composing: ["review", "failed"],
  review: ["composing", "approved", "ingesting"], // pedir cambios = composing
  approved: ["review", "archived"], // editar tras aprobar = vuelve a review (la aprobación queda superseded)
  failed: ["ingesting", "composing", "archived"], // reintentar desde la etapa que falló
  archived: [],
};

export const JOB_STATES = ["queued", "running", "succeeded", "failed", "cancelled", "retrying"] as const;
export type JobState = (typeof JOB_STATES)[number];
export const JOB_MACHINE: Machine<JobState> = {
  queued: ["running", "cancelled"],
  running: ["succeeded", "failed", "cancelled", "retrying"],
  retrying: ["running", "failed", "cancelled"],
  succeeded: [],
  failed: ["queued"], // reintento manual = nuevo intento del mismo job (attempt + 1)
  cancelled: [],
};

export const PUBLICATION_STATES = [
  "planned", // plan calculado, nada tocado en Shopify
  "applying", // ejecutando pasos con checkpoint
  "verifying", // leyendo de vuelta lo publicado
  "preview_ready", // publicado en borrador + URL de preview
  "live", // visible para compradores (solo con publishMode = live)
  "partial_failure", // algún paso falló; los anteriores quedaron aplicados
  "rolled_back",
  "failed", // falló antes de tocar nada
] as const;
export type PublicationState = (typeof PUBLICATION_STATES)[number];
export const PUBLICATION_MACHINE: Machine<PublicationState> = {
  planned: ["applying", "failed"],
  applying: ["verifying", "partial_failure"],
  verifying: ["preview_ready", "live", "partial_failure"],
  preview_ready: ["live", "rolled_back"],
  live: ["rolled_back"],
  partial_failure: ["applying", "rolled_back"], // reanudar desde el último checkpoint o deshacer
  rolled_back: [],
  failed: [],
};

export function canTransition<S extends string>(machine: Machine<S>, from: S, to: S): boolean {
  return machine[from].includes(to);
}

export const JobSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  type: z.string(), // ingest.photo, dna.synthesize, brief, tokens, compose, asset.image, asset.video, publish.*
  state: z.enum(JOB_STATES),
  attempt: z.number().int().min(1),
  maxAttempts: z.number().int().min(1).default(3),
  progress: z.number().min(0).max(100),
  idempotencyKey: z.string(), // projectId + type + hash del input: repetir no duplica trabajo ni gasto
  cancelRequested: z.boolean().default(false), // el worker lo revisa entre pasos y aborta con AbortSignal
  error: z.object({ code: z.string(), message: z.string(), retryable: z.boolean() }).optional(),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
});
export type Job = z.infer<typeof JobSchema>;
