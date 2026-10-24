// Brief del producto v1 (referencia). Copiar a src/contracts/brief.ts.
// El Brief = ProductDNA validado + procedencia por dato + preguntas pendientes + estado de confirmación.
// No duplica ProductDNA: lo envuelve.
import { z } from "zod";
import { ProductDNASchema } from "./product-dna";

// Procedencia fina: de qué input y de qué parte (página del PDF, segundo del audio, región de la foto).
export const ProvenanceSchema = z.object({
  path: z.string(), // ruta JSON dentro del DNA, p. ej. "features[2].value" o "price.amount"
  inputId: z.string(),
  kind: z.enum(["photo", "audio", "document", "url", "reference_image", "user_form"]),
  locator: z.string().optional(), // "p.3", "00:12-00:18", "bbox:10,20,200,80"
  quote: z.string().max(300).optional(), // fragmento literal que respalda el dato
  confidence: z.number().min(0).max(1),
});

export const OpenQuestionSchema = z.object({
  id: z.string(),
  field: z.string(), // qué parte del DNA bloquea
  question: z.string().max(200), // en el idioma del usuario
  blocking: z.boolean(), // true = no se puede componer la página sin respuesta (p. ej. precio)
  answer: z.string().optional(),
  answeredAt: z.string().optional(),
});

export const BriefSchema = z
  .object({
    version: z.literal("1"),
    projectId: z.string(),
    dnaVersion: z.number().int().positive(),
    dna: ProductDNASchema,
    provenance: z.array(ProvenanceSchema),
    openQuestions: z.array(OpenQuestionSchema),
    // Lo que el usuario confirmó a mano (gana sobre la IA al recomponer).
    confirmedPaths: z.array(z.string()),
    status: z.enum(["draft", "needs_answers", "ready"]),
  })
  .superRefine((b, ctx) => {
    const pending = b.openQuestions.some((q) => q.blocking && !q.answer);
    if (b.status === "ready" && pending) {
      ctx.addIssue({ code: "custom", message: "Brief 'ready' con preguntas bloqueantes sin responder" });
    }
    // Ningún dato del producto puede salir solo de una referencia de terceros.
    const refOnly = b.provenance.filter((p) => p.kind === "url" || p.kind === "reference_image");
    for (const p of refOnly) {
      if (p.path.startsWith("features") || p.path.startsWith("price") || p.path.startsWith("benefits")) {
        const backed = b.provenance.some(
          (q) => q.path === p.path && q.kind !== "url" && q.kind !== "reference_image",
        );
        if (!backed) ctx.addIssue({ code: "custom", message: `Dato de producto respaldado solo por referencia: ${p.path}` });
      }
    }
  });
export type Brief = z.infer<typeof BriefSchema>;
