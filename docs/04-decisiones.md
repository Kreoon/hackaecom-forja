# 04 · Decisiones (ADR corto)

Formato: `## ADR-NNN · título (fecha)` → Contexto · Decisión · Consecuencias. Las escribe `forja-architect`; cualquiera propone.

## ADR-001 · PageSpec como contrato único (2026-10-16)
**Contexto:** mockup y Shopify deben verse igual y 3 personas trabajan en paralelo.
**Decisión:** JSON de secciones tipadas (Zod) consumido por React y por el compilador Liquid; CSS compartido.
**Consecuencias:** agregar una sección cuesta 3 archivos; a cambio, cero divergencia y trabajo en paralelo.

## ADR-002 · Conexión Shopify por app propia del usuario (2026-10-16)
**Contexto:** desde ene-2026 no se crean custom apps desde el admin; la app pública con OAuth no alcanza para el hackathon.
**Decisión:** el usuario crea una app en Dev Dashboard, la instala y pega client id/secret; FORJA usa client credentials (token 24 h).
**Consecuencias:** 3 minutos de setup para el usuario (guía con capturas en la pantalla de conexión). Fase 2: app pública.

## ADR-003 · Estrategia de tema (PENDIENTE de smoke test C1 — ver ADR-007)
**Contexto:** `themeFilesUpsert` y `themeCreate` requieren `write_themes` + exención de Shopify (confirmado en la doc 2026-10, ver `fuentes.md`).
**Decisión:** sustituida en lo esencial por ADR-007 (app block por defecto). Queda pendiente solo **confirmar en la tienda de desarrollo** (tarea C1) que la app del Dev Dashboard recibe `ACCESS_DENIED` en `themeFilesUpsert` sin exención, y que el app block se puede agregar con deep link.
**Consecuencias:** C1 sigue siendo la primera tarea del carril C; su resultado se anota aquí.

## ADR-004 · Aprobación ligada a versión, hash y destino (2026-10-16)
**Contexto:** se aprueba un diseño y se publica otro si algo cambia en medio (edición, imagen reemplazada, otra tienda).
**Decisión:** `Approval {specVersion, specHash, target}` con `specHash = sha256(JSON canónico de spec + sha256 de cada asset)`; `checkApproval` en el servidor antes de publicar. Cualquier cambio deja la aprobación `superseded`. Contrato: `forja-contracts/reference/approval.ts`.
**Consecuencias:** volver a aprobar es barato (un clic); publicar sin aprobación vigente es imposible. Se requiere guardar `sha256` de cada asset al subirlo o generarlo.

## ADR-005 · Generación y publicación como procesos separados con máquinas de estado (2026-10-16)
**Contexto:** un pipeline único mezclaba fallas de IA con fallas de Shopify y hacía imposible reanudar.
**Decisión:** `PROJECT_MACHINE`/`JOB_MACHINE` para generación y `PUBLICATION_MACHINE` con pasos idempotentes y checkpoints para publicación (`jobs.ts`, `publication.ts`). MVP con funciones largas + tabla `jobs` + Realtime; cola durable en fase 2.
**Consecuencias:** cada paso reintenta solo lo suyo; la publicación se reanuda o deshace desde el último checkpoint.

## ADR-006 · BYOK con llamada directa al proveedor y capacidades explícitas (2026-10-16)
**Contexto:** el BYOK de Vercel AI Gateway reintenta con credenciales de Vercel si la llave del usuario falla (cobra a FORJA) y sus budgets no cuentan BYOK.
**Decisión:** adapters propios por proveedor con `ProviderManifest` (capacidades verificadas, fecha de verificación, método de validación) y llamada directa con la llave del usuario (AI SDK `create*({ apiKey })`). Sin promesa de compatibilidad universal. "API MARK" fuera hasta identificarlo.
**Consecuencias:** cada proveedor nuevo cuesta un adapter + verificación en la doc; a cambio, costo y errores son trazables por usuario.

## ADR-007 · Publicación MVP: app block + metafield, modo draft por defecto (2026-10-16)
**Contexto:** las mutations de tema requieren exención; client credentials solo sirve para tiendas de la misma organización; la revisión de App Store exige theme app extensions para tocar el tema.
**Decisión:** MVP en tiendas de desarrollo de la organización con client credentials; producto + media + metafield `json` con el PageSpec; secciones mediante app block de una theme app extension; `draft` + preview por defecto, `live` solo con confirmación. Fase 2: app pública embebida (token exchange, tokens expirables, webhooks de privacidad, Billing). Detalle: `06-version-aprobacion-publicacion.md`.
**Consecuencias:** sin escritura del tema ni exención; 1 paso manual la primera vez (agregar el bloque con deep link); temas vintage necesitan la estrategia `page`.

## ADR-008 · Datos de entrada como no confiables (2026-10-16)
**Contexto:** fotos, audios, PDFs y webs pueden traer instrucciones o datos de terceros.
**Decisión:** todo input se trata como dato (etiquetas + instrucción anti-injection + salida por esquema); lo que viene de referencias externas nunca respalda por sí solo un dato del producto (refinement de `brief.ts`); URLs pasan por filtro anti-SSRF. Ver `07-modelo-amenazas.md`.
**Consecuencias:** algunos datos útiles de la competencia no se usan como facts; a cambio, no se publican afirmaciones de otros.

## ADR-009 · Fuente única de instrucciones y carriles (2026-10-16)
**Contexto:** CLAUDE.md, AGENTS.md, README, skills y la exportación a Codex (`.agents/`, `.codex/`) repetían reglas.
**Decisión:** CLAUDE.md es el punto de entrada (< 200 líneas) y enlaza; cada tema tiene un único documento dueño (ver mapa en CLAUDE.md). Se mantienen las letras de carril A/B/C (las usan el mod, los hooks y los commits) con el reparto: A = backend, ingesta, IA y BYOK; B = producto, UX, frontend y preview; C = Shopify, publicación, QA e infraestructura.
**Consecuencias:** la propuesta "Persona A/B/C" del equipo se traduce con la tabla de `10-guia-equipo.md`; la exportación a Codex debe regenerarse desde `.claude/`.

## ADR-010 · OpenRouter como proveedor principal de LLM e imagen (2026-10-16)
**Contexto:** el equipo decidió usar OpenRouter para modelos de lenguaje y de imagen: una sola llave del usuario da acceso a muchos modelos.
**Decisión:** `openrouter` es el primer proveedor del orden por defecto para `text`, `vision`, `pdf` e `image_generate`/`image_edit` (solo con modelos cuya capacidad esté verificada en la doc y registrada en `src/lib/ai/models.ts` con fecha). Los adapters directos (Gemini, OpenAI, Anthropic) quedan como alternativa y para capacidades que OpenRouter no cubra (p. ej. video, transcripción si no está disponible). Se llama con la llave del usuario por request (`createOpenRouter({ apiKey })`); texto con `response_format` json_schema y `provider.require_parameters: true` (si no, el formato es solo preferencia); imágenes por `POST /api/v1/images` con la foto real en `input_references` (no por `modalities` del chat); video por `POST /api/v1/videos` con polling; `provider.data_collection: "deny"` en todas las llamadas; validación de llave con `GET /api/v1/key` (gratis). Errores: 402 (`limit_source`) → `insufficient_quota`, 429 → `rate_limited`. Agente: `forja-openrouter-adapter`.
**Consecuencias:** un adapter en lugar de varios para el MVP y un catálogo de modelos por capacidad que hay que mantener; dependencia de OpenRouter. Sus términos no cubren expresamente que un SaaS guarde y use la llave de un usuario: **bloqueo D2**; alternativa a evaluar: OAuth PKCE de OpenRouter (el usuario autoriza sin pegar la llave), aún no verificado. El plugin `mistral-ocr` para PDFs cobra a la cuenta de OpenRouter: usar `cloudflare-ai` o `native`. Detalles verificados en `docs/fuentes.md` (fila OpenRouter).

