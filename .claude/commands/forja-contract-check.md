---
description: Verifica que el código respete los contratos PageSpec/ProductDNA y la paridad React ↔ Liquid
---

1. Compara `src/contracts/*.ts` con las referencias en `.claude/skills/forja-pagespec/reference/` y `forja-product-dna/reference/`. Reporta diferencias (¿hay ADR en `docs/04-decisiones.md` que las justifique?).
2. Lista los `type` de `SectionSchema` y verifica que cada uno tenga:
   - `src/components/sections/<Type>.tsx`
   - `shopify/sections/forja-<type>.liquid`
   - caso en el `switch` de `SectionRenderer`
   - mapeo en `src/lib/shopify/compile.ts`
3. Busca prompts inline (`system:` con strings largos fuera de `src/lib/ai/prompts`) y HTML en copy (`dangerouslySetInnerHTML` en secciones).
4. Corre `npx tsc --noEmit` y `npx vitest run` si existen.
5. Devuelve una tabla ✅/❌ por chequeo y los fixes concretos.
