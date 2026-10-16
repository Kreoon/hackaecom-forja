// Referencia del contrato ProductDNA v1. Copiar a src/contracts/product-dna.ts el día 0.
import { z } from "zod";

export const SourceRef = z.object({
  inputId: z.string(),
  kind: z.enum(["photo", "audio", "document", "url", "reference_image", "user_form"]),
});

export const Fact = z.object({
  key: z.string(), // p.ej. "material", "capacidad", "tiempo_de_uso"
  value: z.string(),
  confidence: z.number().min(0).max(1),
  sources: z.array(SourceRef).min(1),
});

export const EvidenceSchema = z.object({
  source: SourceRef,
  text: z.string(), // transcripción / resumen / descripción visual
  facts: z.array(Fact.omit({ sources: true })),
  confidence: z.number().min(0).max(1),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const ProductDNASchema = z.object({
  version: z.literal("1"),
  name: z.string(),
  category: z.string(),
  oneLiner: z.string().max(140), // qué es y para quién, en una frase
  price: z.object({ amount: z.number().positive(), currency: z.string(), compareAt: z.number().optional() }).optional(),
  audience: z.object({
    who: z.string(),
    pains: z.array(z.string()).min(1).max(6),
    desires: z.array(z.string()).min(1).max(6),
    objections: z.array(z.string()).max(8),
  }),
  benefits: z.array(z.string()).min(2).max(8),
  features: z.array(Fact),
  usage: z.array(z.string()).max(6), // cómo se usa, pasos
  differentiators: z.array(z.string()).max(5),
  offerIdeas: z.array(z.string()).max(5), // 2x1, contraentrega, envío gratis…
  tone: z.enum(["cercano", "premium", "técnico", "divertido", "urgente"]),
  photos: z.array(z.object({ assetId: z.string(), description: z.string(), cleanBackground: z.boolean(), heroCandidate: z.boolean() })),
  references: z.array(z.object({ inputId: z.string(), takeaways: z.array(z.string()) })), // inspiración, no facts
  riskFlags: z.array(z.enum(["health_claim", "before_after", "guarantee_claim", "regulated_category", "trademark"])),
  unknowns: z.array(z.string()), // lo que NO sabemos y no se debe inventar
});
export type ProductDNA = z.infer<typeof ProductDNASchema>;
