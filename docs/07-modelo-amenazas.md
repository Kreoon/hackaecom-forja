# 07 · Modelo de amenazas y seguridad

Alcance: app FORJA (Next.js + Supabase + Vercel), proveedores BYOK del usuario y su tienda Shopify.
Revisión: agente `forja-byok-guardian` + skill `forja-security-review` antes de cada merge sensible.

## BYOK no significa "sin backend"
Cada usuario paga sus modelos con su llave. Pero FORJA sigue operando y pagando: autenticación, base de datos, almacenamiento de archivos, funciones del servidor, jobs, la app de Shopify y sus propias credenciales de plataforma (Supabase service role, client secret de la app, dominio, monitoreo). El consumo de esa infraestructura no lo cubre BYOK.

**No usar el BYOK de Vercel AI Gateway para llaves de usuarios:** según su doc, si la llave del usuario falla, el Gateway reintenta con las credenciales de Vercel y lo cobra a la cuenta de FORJA. Llamar directo al proveedor con la llave del usuario (`createOpenAI({ apiKey })`, etc.).

**Términos de los proveedores:** OpenAI prohíbe "transferir" llaves y Google pide impedir que otros usen tus credenciales; su aplicación a BYOK no está resuelta (ver `fuentes.md`). **Decisión pendiente de negocio/legal** antes de abrir a usuarios externos.

## Activos
Llaves de IA del usuario · credenciales de su tienda (client id/secret, tokens) · archivos del producto · Brief y PageSpec · tienda del comerciante · cuota y saldo del usuario en sus proveedores · service role de Supabase.

## Amenazas y controles
| # | Amenaza | Control | Verificación |
|---|---|---|---|
| T1 | Fuga de llave al cliente o a logs | Llaves en Supabase Vault; `get_provider_key` sin grant a `authenticated`/`anon`; descifrar solo en Route Handlers/Server Actions; logger con redacción (`Authorization`, `x-api-key`, `X-Shopify-Access-Token`, `client_secret`, cualquier string que parezca llave) | Test de logger; grep en CI; hook `guard-secrets` |
| T2 | Un usuario usa la llave o la tienda de otro | RLS `user_id = auth.uid()` en todo; el worker revalida `shops.user_id = projects.user_id` antes de usar credenciales (ya en `0001_init.sql`) | Test de RLS con dos usuarios |
| T3 | Bug que quema el saldo del usuario | Rate limit por usuario y proveedor; tope de jobs concurrentes; `idempotencyKey` por job; presupuesto por proyecto configurable; `usage_events` visible | Test de doble clic / reintentos |
| T4 | Llave robada o filtrada | Rotación (guardar nueva = nuevo secreto, borrar el anterior), revocación (borrar fila + secreto), `validateKey` al guardar y ante `invalid_key`; la UI muestra solo `last4` | Flujo manual en QA |
| T5 | Archivo malicioso (polyglot, zip bomb, PDF enorme) | Upload directo a Storage con URL firmada; límites por tipo (imagen 15 MB, audio 25 MB, PDF 30 MB/100 páginas); tipo por magic bytes (`file-type`); conteo de páginas antes de enviar al modelo; nunca ejecutar ni renderizar el archivo en el servidor | Fixtures maliciosos en tests |
| T6 | SSRF con URLs de referencia | Solo `https`; resolver DNS y bloquear IPs privadas/link-local/metadata en el socket (`request-filtering-agent`), revalidar en cada redirect (máx. 3), timeout 10 s, tamaño 5 MB; preferir el scraper del usuario (Firecrawl/Apify) | Test con `127.0.0.1`, `169.254.169.254`, redirect a privada |
| T7 | Prompt injection en fotos, audio, PDF o webs | Todo input va entre etiquetas como **datos**; instrucción explícita de ignorar órdenes embebidas; salida siempre por esquema Zod; los modelos no tienen herramientas con efectos (no publican, no leen llaves) | Fixture `golden/00-fixture` (audio con orden embebida) |
| T8 | Referencias de terceros contaminan el producto | Lo que viene de `url`/`reference_image` va a `references`, nunca a `features`/`price`/`benefits` (refinement en `brief.ts`); assets `reference` no son publicables | `dry-run` (precio solo de referencia → rechazado) |
| T9 | Afirmaciones falsas en la página | Política abajo; bloqueo de aprobación por claims sin respaldo | `dry-run` (garantía abierta → aviso) |
| T10 | XSS en preview o tienda | PageSpec sin HTML; React escapa; Liquid con `| escape`; `emphasis` lo aplica el compilador | `/forja-contract-check` |
| T11 | Publicación no autorizada o de otra versión | `checkApproval` en servidor antes de publicar; modo `draft` por defecto; `live` solo con confirmación explícita | Test de aprobación invalidada |
| T12 | Daño a la tienda del comerciante | No escribir el tema; no `productSet` sobre productos ajenos; `snapshot` + `before` + deshacer | Smoke en tienda de desarrollo |
| T13 | Service role expuesto | Solo variables de servidor sin `NEXT_PUBLIC_`; hook lo bloquea | Hook + revisión |
| T14 | Herramientas de desarrollo con demasiado acceso | MCP de Supabase en `read_only` y contra proyecto de desarrollo; no conectar MCP de Vercel/GitHub con permisos de escritura sin confirmación | Revisión de `.mcp.json` |

## Política de contenido: no inventar
- No se generan beneficios, cifras, certificaciones, ingredientes, garantías ni resultados que no estén en el Brief con procedencia.
- Datos con confianza < 0.7 en titulares u oferta → la UI pide confirmación o se suavizan.
- Testimonios generados: siempre con disclaimer visible hasta que el usuario cargue reales; no se publican con nombres de personas reales.
- Categorías con `riskFlags` (salud, antes/después, garantías): lenguaje seguro de `forja-copy-chief`; antes/después solo con evidencia del usuario.
- Marcas de terceros en referencias: inspiración de estilo, nunca copia de textos, logos ni fotos.
