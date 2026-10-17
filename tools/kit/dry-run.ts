// Prueba en seco de FORJA: materiales (FIXTURE) → evidencia → Brief → PageSpec → aprobación → plan de publicación.
// NO llama a proveedores de IA ni a Shopify. Todo lo que imprime está marcado como FIXTURE.
// Uso: npm --prefix tools/kit install && npm --prefix tools/kit run dry-run
import { cpSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const skills = join(root, ".claude/skills");
const staged = join(here, ".contracts");

// 1. Montar src/contracts virtual: todos los contratos juntos, igual que en la app.
rmSync(staged, { recursive: true, force: true });
mkdirSync(staged, { recursive: true });
const files: Array<[string, string]> = [
  ["forja-pagespec/reference/pagespec.ts", "pagespec.ts"],
  ["forja-product-dna/reference/product-dna.ts", "product-dna.ts"],
  ["forja-contracts/reference/provider.ts", "provider.ts"],
  ["forja-contracts/reference/asset.ts", "asset.ts"],
  ["forja-contracts/reference/brief.ts", "brief.ts"],
  ["forja-contracts/reference/approval.ts", "approval.ts"],
  ["forja-contracts/reference/jobs.ts", "jobs.ts"],
  ["forja-contracts/reference/publication.ts", "publication.ts"],
];
for (const [from, to] of files) cpSync(join(skills, from), join(staged, to));

const { PageSpecSchema } = await import("./.contracts/pagespec.ts");
const { EvidenceSchema } = await import("./.contracts/product-dna.ts");
const { BriefSchema } = await import("./.contracts/brief.ts");
const { specHash, checkApproval, ApprovalSchema } = await import("./.contracts/approval.ts");
const { PROJECT_MACHINE, PUBLICATION_MACHINE, canTransition } = await import("./.contracts/jobs.ts");
const { planSteps, nextStep, PublicationSchema } = await import("./.contracts/publication.ts");

const readJson = (p: string) => JSON.parse(readFileSync(join(root, p), "utf8"));
let failures = 0;
const ok = (msg: string) => console.log(`  ✓ ${msg}`);
const warn = (msg: string) => console.log(`  ! ${msg}`);
const fail = (msg: string) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};
const step = (n: number, title: string) => console.log(`\n${n}. ${title}`);

console.log("FORJA · prueba en seco · FIXTURE (sin proveedores, sin Shopify, sin publicación real)");

// 2. Evidencia simulada
step(1, "Evidencia de los extractores (golden/00-fixture/evidence.json)");
const fixture = readJson("golden/00-fixture/evidence.json");
for (const e of fixture.evidence) {
  const r = EvidenceSchema.safeParse(e);
  r.success ? ok(`evidence ${e.source.kind} válida`) : fail(`evidence ${e.source.kind}: ${r.error.message}`);
}
const injected = fixture.evidence.some((e: { text: string }) => /cura la gripa/i.test(e.text));
injected ? fail("la instrucción embebida del audio llegó a la evidencia") : ok("instrucción embebida en el audio no aparece en la evidencia");

// 3. Brief
step(2, "Brief (forja-contracts/examples/brief.example.json)");
const brief = BriefSchema.safeParse(readJson(".claude/skills/forja-contracts/examples/brief.example.json"));
if (!brief.success) {
  fail(`Brief inválido: ${brief.error.message}`);
} else {
  ok(`Brief '${brief.data.status}' · ${brief.data.dna.features.length} facts · ${brief.data.openQuestions.length} preguntas abiertas`);
  const lowConf = brief.data.dna.features.filter((f) => f.confidence < 0.6 + 1e-9);
  for (const f of lowConf) warn(`dato con confianza baja que la UI debe pedir confirmar: ${f.key} = ${f.value}`);
}
const tampered = BriefSchema.safeParse({
  ...readJson(".claude/skills/forja-contracts/examples/brief.example.json"),
  provenance: [{ path: "price.amount", inputId: "in_ref", kind: "url", confidence: 0.9 }],
});
tampered.success ? fail("un precio respaldado solo por la web de un competidor pasó la validación") : ok("precio respaldado solo por referencia externa → rechazado");

// 4. PageSpec
step(3, "PageSpec (forja-pagespec/reference/example.json)");
const specRaw = readJson(".claude/skills/forja-pagespec/reference/example.json");
const spec = PageSpecSchema.safeParse(specRaw);
if (!spec.success) {
  fail(`PageSpec inválido: ${spec.error.message}`);
  process.exit(1);
}
ok(`PageSpec v${spec.data.version} · ${spec.data.sections.length} secciones · ${spec.data.assets.length} assets`);
const referenced = new Set<string>();
for (const s of spec.data.sections) {
  for (const v of Object.values(s)) if (typeof v === "string" && spec.data.assets.some((a) => a.id === v)) referenced.add(v);
}
const missing = [...JSON.stringify(spec.data.sections).matchAll(/"(?:mediaAssetId|assetId)":"([^"]+)"/g)]
  .map((m) => m[1])
  .filter((id) => !spec.data.assets.some((a) => a.id === id));
missing.length ? fail(`assets referenciados que no existen: ${missing.join(", ")}`) : ok("todas las referencias a assets resuelven");

// Política de claims: lo que la página afirma debe estar en el Brief o marcado como pregunta.
if (brief.success) {
  const offer = spec.data.sections.find((s) => s.type === "offer");
  const guaranteeOpen = brief.data.openQuestions.some((q) => q.field === "offer.guarantee" && !q.answer);
  if (offer && offer.type === "offer" && offer.guarantee && guaranteeOpen) {
    warn(`la oferta promete "${offer.guarantee}" pero la garantía sigue como pregunta abierta → bloquear aprobación hasta confirmar`);
  }
  const hero = spec.data.sections.find((s) => s.type === "hero");
  const low = brief.data.dna.features.find((f) => f.key === "retencion_calor");
  if (hero && hero.type === "hero" && /12 horas/.test(hero.headline) && low && low.confidence < 0.7) {
    warn(`el titular usa "12 horas", dato del proveedor con confianza ${low.confidence} → pedir confirmación o suavizar`);
  }
}
const metafieldBytes = Buffer.byteLength(JSON.stringify(spec.data));
metafieldBytes <= 128 * 1024
  ? ok(`PageSpec como metafield json: ${metafieldBytes} B (límite documentado 128 KB)`)
  : fail(`PageSpec de ${metafieldBytes} B supera 128 KB`);

// 5. Hash y aprobación
step(4, "Hash de versión y aprobación");
const assetSha = Object.fromEntries(spec.data.assets.map((a) => [a.id, "0".repeat(63) + "1"])); // FIXTURE: hashes simulados
const hash = specHash(spec.data, assetSha);
ok(`specHash = ${hash.slice(0, 16)}…`);
hash === specHash(JSON.parse(JSON.stringify(spec.data)), { ...assetSha })
  ? ok("el hash es estable (mismo contenido → mismo hash)")
  : fail("el hash no es estable");
const target = {
  shopId: "shop_fixture",
  shopDomain: "forja-fixture.myshopify.com",
  strategy: "app_block" as const,
  productHandle: spec.data.seo.handle,
  publishMode: "draft" as const,
};
const approval = ApprovalSchema.parse({
  id: "apr_fixture",
  projectId: spec.data.projectId,
  specVersion: 3,
  specHash: hash,
  target,
  approvedBy: "user_fixture",
  approvedAt: new Date(0).toISOString(),
  status: "active",
});
const same = checkApproval(approval, { specVersion: 3, specHash: hash, target });
same.ok ? ok("aprobación válida para la misma versión, hash, tienda y destino") : fail("la aprobación debía ser válida");

const edited = structuredClone(spec.data);
const editedHero = edited.sections.find((s) => s.type === "hero");
if (editedHero && editedHero.type === "hero") editedHero.headline = "Tu café caliente todo el día";
const afterEdit = checkApproval(approval, { specVersion: 3, specHash: specHash(edited, assetSha), target });
!afterEdit.ok && afterEdit.reason === "content_changed" ? ok("editar el titular invalida la aprobación (content_changed)") : fail("una edición no invalidó la aprobación");
const swappedImg = checkApproval(approval, { specVersion: 3, specHash: specHash(spec.data, { ...assetSha, a_hero: "f".repeat(64) }), target });
!swappedImg.ok ? ok("cambiar la imagen sin tocar el JSON también la invalida") : fail("cambiar un asset no invalidó la aprobación");
const otherShop = checkApproval(approval, { specVersion: 3, specHash: hash, target: { ...target, shopDomain: "otra.myshopify.com" } });
!otherShop.ok && otherShop.reason === "target_changed" ? ok("otra tienda → aprobación inválida (target_changed)") : fail("cambiar la tienda no invalidó la aprobación");

// 6. Estados
step(5, "Máquinas de estado");
canTransition(PROJECT_MACHINE, "review", "approved") ? ok("proyecto review → approved") : fail("review → approved debería ser válido");
!canTransition(PROJECT_MACHINE, "draft", "approved") ? ok("proyecto draft → approved bloqueado") : fail("draft → approved no debería ser válido");
!canTransition(PUBLICATION_MACHINE, "planned", "live") ? ok("publicación planned → live bloqueada (debe verificarse)") : fail("planned → live no debería ser válido");

// 7. Plan de publicación
step(6, "Plan de publicación (estrategia app_block, modo draft) — NO se ejecuta");
const publishable = spec.data.assets.filter((a) => a.source !== "reference").map((a) => a.id);
const steps = planSteps({ approvalId: approval.id, strategy: "app_block", publishableAssetIds: publishable, publishMode: "draft" });
for (const s of steps) console.log(`    - ${s.kind.padEnd(18)} scopes=[${s.requiresScopes.join(", ")}] key=${s.idempotencyKey}`);
steps.some((s) => s.kind === "publish") ? fail("modo draft no debe incluir el paso publish") : ok("modo draft: sin paso 'publish' (queda en preview)");
const scopes = [...new Set(steps.flatMap((s) => s.requiresScopes))].sort();
ok(`scopes necesarios: ${scopes.join(", ")}`);
scopes.includes("write_themes") ? fail("el plan MVP no debe requerir write_themes") : ok("el plan MVP no requiere write_themes (evita la exención de Shopify)");

// Simular falla parcial y reanudación
steps[0].state = "done";
steps[1].state = "done";
steps[2].state = "failed";
const resumeAt = nextStep(steps);
resumeAt?.kind === steps[2].kind ? ok(`tras una falla parcial se reanuda en '${resumeAt.kind}' sin repetir pasos hechos`) : fail("la reanudación no apunta al paso fallido");
const pub = PublicationSchema.safeParse({
  id: "pub_fixture",
  approvalId: approval.id,
  projectId: spec.data.projectId,
  shopId: target.shopId,
  specHash: hash,
  strategy: "app_block",
  state: "partial_failure",
  steps,
  startedAt: new Date(0).toISOString(),
});
pub.success ? ok("registro de publicación válido (estado partial_failure)") : fail(`publicación inválida: ${pub.error.message}`);

console.log(`\nResultado: ${failures === 0 ? "OK" : `${failures} fallo(s)`} · FIXTURE · no se publicó nada`);
rmSync(staged, { recursive: true, force: true });
process.exit(failures === 0 ? 0 : 1);
