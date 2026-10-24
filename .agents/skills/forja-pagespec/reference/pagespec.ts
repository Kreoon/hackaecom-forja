// Referencia del contrato PageSpec v1. Copiar a src/contracts/pagespec.ts el día 0.
import { z } from "zod";

export const AssetRef = z.string().min(1); // assetId

export const Cta = z.object({
  label: z.string().min(2).max(40),
  action: z.union([
    z.enum(["add_to_cart", "buy_now", "whatsapp"]),
    z.string().regex(/^scroll_to:[\w-]+$/),
  ]),
});

const Copy = z.string().min(1).max(600);
const Emphasis = z.array(z.string()).max(5).default([]);

const base = {
  id: z.string().min(4),
  locked: z.boolean().default(false),
  emphasis: Emphasis,
};

export const SectionSchema = z.discriminatedUnion("type", [
  z.object({ ...base, type: z.literal("announcement"), text: z.string().max(90), icon: z.string().optional() }),
  z.object({
    ...base,
    type: z.literal("hero"),
    headline: z.string().max(90),
    subheadline: Copy,
    cta: Cta,
    mediaAssetId: AssetRef,
    layout: z.enum(["split", "full-bleed", "stacked"]).default("split"),
    badges: z.array(z.string().max(30)).max(4).default([]),
  }),
  z.object({
    ...base,
    type: z.literal("benefits"),
    title: z.string().max(80),
    items: z.array(z.object({ icon: z.string(), title: z.string().max(50), body: Copy })).min(3).max(6),
  }),
  z.object({ ...base, type: z.literal("problem_solution"), problem: Copy, solution: Copy, mediaAssetId: AssetRef.optional() }),
  z.object({
    ...base,
    type: z.literal("features_media"),
    items: z.array(z.object({ title: z.string().max(60), body: Copy, mediaAssetId: AssetRef })).min(1).max(5),
  }),
  z.object({
    ...base,
    type: z.literal("how_it_works"),
    steps: z.array(z.object({ title: z.string().max(50), body: Copy })).min(2).max(5),
  }),
  z.object({
    ...base,
    type: z.literal("social_proof"),
    items: z.array(z.object({ name: z.string(), city: z.string().optional(), quote: Copy, rating: z.number().min(1).max(5) })).min(2).max(8),
    // Testimonios generados por IA SIEMPRE se marcan como ejemplo hasta que el usuario los reemplace.
    disclaimer: z.string().default("Testimonios de ejemplo — reemplázalos por reseñas reales."),
  }),
  z.object({
    ...base,
    type: z.literal("comparison"),
    columns: z.tuple([z.string(), z.string()]),
    rows: z.array(z.object({ label: z.string(), us: z.string(), them: z.string() })).min(3).max(8),
  }),
  z.object({
    ...base,
    type: z.literal("offer"),
    priceTiers: z
      .array(
        z.object({
          label: z.string(),
          qty: z.number().int().positive(),
          price: z.number().positive(),
          compareAt: z.number().positive().optional(),
          highlight: z.boolean().default(false),
        }),
      )
      .min(1)
      .max(4),
    guarantee: z.string().max(160),
    bonus: z.string().max(160).optional(),
    cta: Cta,
  }),
  z.object({ ...base, type: z.literal("faq"), items: z.array(z.object({ q: z.string().max(120), a: Copy })).min(3).max(10) }),
  z.object({ ...base, type: z.literal("gallery"), assetIds: z.array(AssetRef).min(1).max(12) }),
  z.object({ ...base, type: z.literal("video"), assetId: AssetRef, autoplay: z.boolean().default(true) }),
  z.object({ ...base, type: z.literal("cta_banner"), headline: z.string().max(90), cta: Cta, urgency: z.string().max(80).optional() }),
  z.object({ ...base, type: z.literal("whatsapp_cta"), phone: z.string().regex(/^\+?\d{8,15}$/), message: z.string().max(200) }),
]);
export type Section = z.infer<typeof SectionSchema>;
export type SectionType = Section["type"];

export const DesignTokensSchema = z.object({
  palette: z.object({
    background: z.string(), surface: z.string(), text: z.string(), muted: z.string(),
    primary: z.string(), primaryText: z.string(), accent: z.string(),
  }),
  fonts: z.object({ heading: z.string(), body: z.string() }), // Google Fonts disponibles también en Shopify
  radius: z.enum(["none", "sm", "md", "lg", "full"]),
  style: z.enum(["minimal", "bold", "premium", "playful", "clinical", "organic"]),
  motion: z.enum(["none", "subtle", "lively"]),
  rationale: z.string().max(400), // por qué estas decisiones, citando las referencias
});
export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const AssetSchema = z.object({
  id: z.string(),
  kind: z.enum(["image", "gif", "video"]),
  source: z.enum(["upload", "generated", "reference"]),
  url: z.string().url(),
  alt: z.string().max(140),
  width: z.number().optional(),
  height: z.number().optional(),
  prompt: z.string().optional(), // si fue generado
  shopifyMediaId: z.string().optional(), // se llena en el deploy
});

export const PageSpecSchema = z.object({
  version: z.literal("1"),
  projectId: z.string(),
  locale: z.string().default("es-CO"),
  currency: z.string().default("COP"),
  seo: z.object({ title: z.string().max(70), description: z.string().max(160), handle: z.string().regex(/^[a-z0-9-]+$/) }),
  tokens: DesignTokensSchema,
  assets: z.array(AssetSchema),
  sections: z.array(SectionSchema).min(3).max(16)
    .refine((s) => s.some((x) => x.type === "hero"), "Falta sección hero")
    .refine((s) => s.some((x) => x.type === "offer"), "Falta sección offer"),
});
export type PageSpec = z.infer<typeof PageSpecSchema>;
