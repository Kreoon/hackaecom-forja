# 06 · Versión, aprobación y publicación

Contratos: [`forja-contracts`](../.claude/skills/forja-contracts/SKILL.md) (`approval.ts`, `publication.ts`, `jobs.ts`). Fuentes de Shopify: [`fuentes.md`](fuentes.md).
Prueba en seco de este documento: `npm --prefix tools/kit run dry-run`.

## A. Fidelidad entre preview y Shopify

**Regla:** el preview y la publicación se derivan del **mismo `PageSpec` versionado**. Ningún modelo reconstruye la página después de aprobarla.

```
page_spec_versions(v) ──┬─▶ SectionRenderer (React) + forja-sections.css  → preview
                        └─▶ compile(spec) / app block Liquid + mismo CSS   → Shopify
               specHash(v) = sha256(canonicalJson({ spec, assets: {assetId: sha256 del archivo} }))
```

| Pieza | Dónde vive | Quién la produce |
|---|---|---|
| Secciones, copy, orden | `PageSpec.sections` (catálogo cerrado, sin HTML) | A (IA) + B (edición del usuario) |
| Estilos | `PageSpec.tokens` → variables CSS `--forja-*` | A (brand) |
| CSS de secciones | un solo archivo: `src/styles/forja-sections.css` = `shopify/.../forja.css` | B (dueño), C lo copia en el build |
| Assets | `PageSpec.assets` por `assetId`; contenido identificado por `sha256` (`AssetRecord`) | A |
| Configuración de destino | `PublishTarget` en la aprobación (tienda, estrategia, handle, modo) | B (UI) / C |

**Renderizado del preview:** `SectionRenderer` con `switch` exhaustivo; contenedor aislado (iframe) a 390 px y 1280 px; fuentes de Google Fonts iguales a las de Shopify. El preview muestra `specVersion` y los primeros 8 caracteres de `specHash`.

**Traducción a Shopify (MVP = estrategia `app_block`):**
| PageSpec | Recurso Shopify |
|---|---|
| `seo`, precio de `offer.priceTiers[0]` | producto: título, handle, SEO, variante |
| `priceTiers` (1, 2, 3 unidades) | variantes del producto (solo si el producto lo crea FORJA) |
| `assets` publicables | `stagedUploadsCreate` → `fileCreate` → `READY`; `shopify.fileId/url` se guardan en `AssetRecord` |
| PageSpec completo (+ `specHash`) | metafield `json` de la app en el producto (≤ 128 KB) |
| secciones | app block de la theme app extension (Liquid) que itera el metafield con el mismo markup BEM |
| `whatsapp_cta`, CTA `add_to_cart`/`buy_now` | markup del bloque + formulario nativo de producto |

**Limitaciones conocidas** (deben verse en la UI antes de aprobar):
- App blocks solo funcionan en temas Online Store 2.0; en temas vintage solo hay app embeds → estrategia `page` o aviso.
- La tipografía y el ancho del contenedor pueden heredar estilos del tema; el bloque aísla con un wrapper `.forja-root` y variables propias.
- El header/footer de la tienda no se previsualiza igual (el preview los dibuja genéricos).
- Animaciones de video dependen de que el archivo esté `READY`.

**Verificación de diferencias:** el bloque Liquid imprime `data-forja-hash="{{ specHash }}"` y `data-forja-section="{{ id }}"` por sección. Tras publicar, el paso `verify_storefront` descarga la URL de preview y compara: hash igual, todas las secciones presentes, HTTP 200. Opcional (C, backlog C9): captura Playwright del preview y de la tienda y diff con `toHaveScreenshot` con tolerancia documentada.

## B. Publicación segura

**Vía elegida** (ver ADR-007 en `04-decisiones.md`):
| Etapa | Vía | Por qué | Qué la invalida |
|---|---|---|---|
| MVP / demo (tiendas de desarrollo del equipo) | App del Dev Dashboard de la **misma organización** + client credentials (token 24 h) | Oficial y sin OAuth público | Tienda fuera de la organización → `shop_not_permitted` |
| Escritura del tema | **No** en el MVP | `themeFilesUpsert`/`themeCreate`/`themePublish` exigen `write_themes` + exención | Si Shopify concede la exención, se puede evaluar `theme_files` |
| Secciones en la tienda | Theme app extension (app block) + metafield | Ruta que exige la revisión de App Store; no toca archivos del comerciante | Tema vintage (solo embeds) |
| Producto multi-tienda (fase 2) | App pública embebida (plantilla React Router), managed installation, token exchange, tokens offline expirables (obligatorios desde 2027-01-01), webhooks de privacidad, Billing de Shopify | Única vía para tiendas de terceros | — |
| Theme Access + CLI | Descartado para producto | Pensado para desarrolladores y CI | — |

**Permisos mínimos MVP:** `read_products`, `write_products`, `write_files`, `read_themes` (para detectar OS 2.0) y, solo en modo live, `write_publications`. Sin `write_themes`.

**Aprobación ligada:** `Approval {projectId, specVersion, specHash, target}`. Se invalida (pasa a `superseded`) con cualquier edición, regeneración, reemplazo de asset, cambio de tienda, estrategia, handle o modo. `checkApproval()` se ejecuta en el servidor **justo antes** del primer paso y otra vez antes de `publish`.

**Bloqueos de aprobación** (la UI no deja aprobar): preguntas bloqueantes del Brief sin respuesta; afirmaciones de la página sin respaldo (garantías, cifras con confianza < 0.7, testimonios sin disclaimer); assets `reference` en la página.

**Idempotencia y conservación del trabajo del comerciante:**
1. `snapshot` guarda el estado previo de todo lo que se tocará (`before`).
2. Producto: si el handle no existe → FORJA lo crea y lo marca (metafield `forja.owner = true`). Si existe y no es de FORJA → **no** usar `productSet` (sincroniza listas y borra lo omitido); solo `metafieldsSet` y, si el usuario lo pide, `productUpdate` de campos concretos.
3. Media: se reutiliza el `fileId` si ese `sha256` ya se subió para la tienda.
4. Cada paso tiene `idempotencyKey = approvalId:paso:objeto`; un reintento salta los `done`.

**Historial y recuperación:**
- Tabla `publications` (una fila por intento) con `steps[]` y checkpoints; `projects.live_publication_id`.
- `partial_failure` → "Reanudar" (desde `nextStep`) o "Deshacer" (aplica `before` en orden inverso; nunca borra objetos que no creó FORJA).
- Volver a una versión anterior = aprobar esa versión de nuevo (nuevo hash, nueva publicación). No hay "editar en caliente".
- Procedimiento operativo: skill `forja-publish-recovery`.

## C. Máquinas de estado
Definidas en `jobs.ts` (`PROJECT_MACHINE`, `JOB_MACHINE`, `PUBLICATION_MACHINE`). Resumen:

```
Proyecto:   draft → ingesting → briefing → composing → review ⇄ composing → approved
                        ↑______________________________|  (nuevo material)      ↓ editar
                                                                              review
Job:        queued → running → succeeded | failed | cancelled ; running → retrying → running
Publicación: planned → applying → verifying → preview_ready → live
                         ↘ partial_failure ⇄ applying ; partial_failure|preview_ready|live → rolled_back
```

| Error | Dónde | Reintento |
|---|---|---|
| `invalid_key`, `insufficient_quota`, `content_policy` | proveedor | No. Se avisa con CTA ("revisa tu llave de X") |
| `rate_limited`, `timeout`, `provider_unavailable` | proveedor | Sí, backoff exponencial, máx. 3; luego siguiente proveedor con la capacidad |
| `invalid_output` (Zod) | LLM | 1 reintento con los errores de validación |
| `THROTTLED` | Shopify | Sí, según `throttleStatus` |
| `ACCESS_DENIED` / scope faltante | Shopify | No. Mostrar qué scope falta |
| `userErrors` de mutation | Shopify | No automático; queda en `partial_failure` |
| verificación (hash distinto) | Shopify | Reintento de `verify_storefront` a los 30 s (caché); luego `partial_failure` |

**Cancelación:** `jobs.cancel_requested = true`; el worker lo revisa entre pasos y aborta la llamada con `AbortSignal`. Una publicación solo se cancela antes de `applying`; durante `applying` se termina el paso en curso y queda `partial_failure`.
