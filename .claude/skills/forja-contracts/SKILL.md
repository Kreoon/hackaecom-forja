---
name: forja-contracts
description: Contratos de FORJA que permiten trabajar en paralelo además de PageSpec y ProductDNA — proveedores BYOK (capacidades, errores, uso), registro de assets con procedencia, Brief con preguntas pendientes, aprobación ligada a versión+hash+tienda, plan de publicación con checkpoints y máquinas de estado. Úsalo al implementar cualquiera de esos módulos o al revisar que un carril respeta la frontera con otro.
---

# Contratos compartidos

| Archivo de referencia | Destino en la app | Dueño | Lo consumen |
|---|---|---|---|
| [`forja-pagespec/reference/pagespec.ts`](../forja-pagespec/reference/pagespec.ts) | `src/contracts/pagespec.ts` | architect | A, B, C |
| [`forja-product-dna/reference/product-dna.ts`](../forja-product-dna/reference/product-dna.ts) | `src/contracts/product-dna.ts` | architect | A, B |
| [`reference/provider.ts`](reference/provider.ts) | `src/contracts/provider.ts` | A | A |
| [`reference/asset.ts`](reference/asset.ts) | `src/contracts/asset.ts` | A | A, B, C |
| [`reference/brief.ts`](reference/brief.ts) | `src/contracts/brief.ts` | A | A, B |
| [`reference/approval.ts`](reference/approval.ts) | `src/contracts/approval.ts` | C | B, C |
| [`reference/publication.ts`](reference/publication.ts) | `src/contracts/publication.ts` | C | B, C |
| [`reference/jobs.ts`](reference/jobs.ts) | `src/contracts/states.ts` | architect | A, B, C |

Todos los archivos de `src/contracts/` viven juntos: los imports entre ellos son relativos (`./product-dna`, `./jobs`).
Ejemplos de fixture en [`examples/`](examples/) (marcados como FIXTURE; no son datos reales).

## Reglas
1. **Cambiar un contrato = ADR** en `docs/04-decisiones.md` + ejemplo actualizado + `npm --prefix tools/kit run dry-run` en verde.
2. **El dueño escribe; los demás importan.** Si necesitas un campo, pídelo al dueño (o a `forja-architect`); no lo agregues en tu carril.
3. Los esquemas validan datos que cruzan una frontera (LLM → app, app → Shopify, base → UI). Dentro de un módulo, usa los tipos inferidos.
4. `approval.ts` usa `node:crypto`: el hash se calcula **solo en el servidor**.
5. Estados: ninguna transición fuera de `*_MACHINE` (`canTransition`). Generación (`PROJECT_MACHINE`, `JOB_MACHINE`) y publicación (`PUBLICATION_MACHINE`) son máquinas separadas.

Flujo completo y razones: [`docs/06-version-aprobacion-publicacion.md`](../../../docs/06-version-aprobacion-publicacion.md).

## Definición de terminado al tocar un contrato
- [ ] Zod + tipo inferido exportados
- [ ] Ejemplo en `examples/` o `forja-pagespec/reference/example.json` valida
- [ ] `npm --prefix tools/kit run dry-run` termina con "OK"
- [ ] ADR escrito y carriles afectados avisados
