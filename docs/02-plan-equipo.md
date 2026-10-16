# 02 · Plan del escuadrón (3 personas)

Integrantes: **Máster · Joako · Samuel**. Asignen carril aquí y en `/forja-start`:

| Carril | Persona |
|---|---|
| A · Cerebro IA | _____ |
| B · App + Mockup | _____ |
| C · Shopify | _____ |

Regla del 13 oct: **llegamos con el trabajo adelantado**; en tarima se da "el último detalle" y se explica el porqué. Solo demos.
Marca ✅ al terminar cada tarea (lo leen `/forja-start` y `/forja-standup`).

## Día 0 · Preparación (antes de la tarima)
### Todos (30 min)
- [ ] Clonar repo, correr `install.ps1` / `install.sh`, `/forja-start <carril>`
- [ ] Proyecto Supabase creado, `.env.local` con URL/anon/service role (cada quien local)
- [ ] Tienda de desarrollo Shopify (Partner/Dev Dashboard) compartida por el equipo
- [ ] `forja-architect`: scaffold Next.js + copiar contratos a `src/contracts` + migración `0001_init.sql`

### Carril A · Cerebro IA
- [ ] A1 Adapter Gemini (text/vision/audio/pdf/image) + `validateKey` — `forja-ingest`
- [ ] A2 Registro de prompts v1 desde `forja-prompts` — `forja-prompt-engineer`
- [ ] A3 Extractores photo/audio/document/url en paralelo → evidence — `forja-ingest`
- [ ] A4 `dna.synthesize` → ProductDNA validado — `forja-ingest`
- [ ] A5 `brand.tokens` + `page.compose` → PageSpec validado — `forja-prompt-engineer`
- [ ] A6 Assets: imagen con referencia + loop image-to-video (no bloqueante) — `forja-visual-producer`
- [ ] A7 Adapters OpenAI y Anthropic (texto/visión) — `forja-ingest`
- [ ] A8 `golden/01..05` + prompt-lab — `forja-prompt-engineer`

### Carril B · App + Mockup
- [ ] B1 Auth (registro/login) + layout de app — `forja-page-composer`
- [ ] B2 Pantalla de llaves (guardar vía RPC, validar, solo last4) — `forja-page-composer` + `forja-byok-guardian`
- [ ] B3 Pantalla conectar Shopify (shop + client id/secret, test de conexión) — con C
- [ ] B4 Nuevo proyecto: dropzone fotos/audio/PDF + URLs + grabar audio en el navegador
- [ ] B5 Progreso del pipeline en vivo (Realtime `jobs`) — que luzca en pantalla gigante
- [ ] B6 `SectionRenderer` + 14 secciones con `forja-sections.css` — `forja-page-composer`
- [ ] B7 Editor: editar texto, regenerar sección, lock, reordenar, undo
- [ ] B8 Botón ✓ + estado de deploy + preview URL

### Carril C · Shopify
- [ ] C1 **Smoke test** client credentials + productCreate + themeFilesUpsert → decide plan (anotar en 04-decisiones) — `forja-shopify-engineer`
- [ ] C2 Cliente GraphQL tipado (userErrors, throttling, redacción) — `forja-shopify-engineer`
- [ ] C3 Media: stagedUploads + productSet + metafield `forja.page_spec`
- [ ] C4 Secciones Liquid (14) con paridad + `forja-tokens.liquid` — `forja-liquid-compiler`
- [ ] C5 `compile(spec)` + snapshot tests + `shopify theme check`
- [ ] C6 Deploy plan A (o C) + preview + publish + rollback
- [ ] C7 Fallback automático A→C si ACCESS_DENIED

### Cierre del día 0
- [ ] `/forja-contract-check` verde · `forja-byok-guardian` sin críticos
- [ ] `/forja-demo golden/01` < 5 min total
- [ ] Deploy a Vercel (producción) + cuenta demo con llaves y tienda conectadas
- [ ] **Video de respaldo** del flujo completo (lo pide el checklist técnico del show)

## Tarima · 78 min de producción ("último detalle")
Elegir 3 mejoras visibles, una por carril, ya ensayadas a medias:
| Hora | Reto del show | Qué mostramos |
|---|---|---|
| 9:55 R1 Señal de vida | primer mockup generado en pantalla | B |
| 10:10 R2 Insumo del público | marca/nicho/ciudad del público → regenerar hero + tokens en vivo | A |
| 10:25 R3 Speed run | la mini función que pida el Núcleo (tener 3 candidatas listas: "modo oscuro", "sección comparativa", "WhatsApp flotante") | quien esté libre |
| 10:40 R4 Explícalo en 30 s | guion en `03-demo-runbook.md` | vocero |
| 11:09 Prueba final (6 min) | producto sorpresa de 0 a Shopify | todos, vocero maneja |
