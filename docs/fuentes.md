# Fuentes consultadas

Registro de documentación oficial usada para decisiones. **Fecha de consulta de todo este bloque: 2026-10-16.**
Confianza: **V** = verificado en la doc oficial · **I** = inferido de doc parcial · **N** = no verificado.
Antes de implementar contra una API, vuelve a consultar la fuente (skill `forja-docs-research`) y agrega una fila nueva con la fecha.

## Claude Code
| Tema | Hallazgo usado | Fuente | Conf. |
|---|---|---|---|
| Subagentes | Frontmatter `name`, `description`, `tools`, `disallowedTools`, `model` (`sonnet`/`opus`/`haiku`/`fable`/`inherit`/ID), `color` ∈ red, blue, green, yellow, purple, orange, pink, cyan; `isolation: worktree`; campos desconocidos se ignoran | https://code.claude.com/docs/en/sub-agents.md | V |
| Skills | `.claude/skills/<n>/SKILL.md`; `argument-hint`, `disable-model-invocation`, `allowed-tools`, `context: fork`; se invocan como `/nombre`; < 500 líneas | https://code.claude.com/docs/en/skills.md | V |
| Comandos | `.claude/commands/*.md` siguen funcionando; están fusionados con skills; si comparten nombre, gana la skill | https://code.claude.com/docs/en/skills.md | V |
| Hooks | PreToolUse bloquea con exit 2 (motivo en stderr) o JSON `permissionDecision`; `$CLAUDE_PROJECT_DIR` | https://code.claude.com/docs/en/hooks.md | V |
| Permisos | Orden deny → ask → allow; `Read(./.env.local)`, `Bash(npm run *)` | https://code.claude.com/docs/en/permissions.md | V |
| MCP de proyecto | `.mcp.json` con `${VAR}`/`${VAR:-default}`; Claude pide aprobación para servidores de proyecto | https://code.claude.com/docs/en/mcp.md | V |
| Plugins y mods | `claude --plugin-dir`, `claude plugin validate`; un mod es un plugin con módulo JS/TS que registra handlers (`register(on)`) | https://code.claude.com/docs/en/plugins/mods/overview.md | V |
| Worktrees | `claude -w <nombre>` → `.claude/worktrees/<nombre>/`, rama `worktree-<nombre>`; `.worktreeinclude` | https://code.claude.com/docs/en/worktrees.md | V |
| Agent teams | Experimentales, desactivados por defecto (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) | https://code.claude.com/docs/en/agent-teams.md | V |
| CLAUDE.md | Objetivo < 200 líneas; imports `@ruta`; `CLAUDE.local.md` personal | https://code.claude.com/docs/en/memory.md | V |

## Shopify
| Tema | Hallazgo usado | Fuente | Conf. |
|---|---|---|---|
| Versión API | `2026-10` es la última estable (publicada 1-oct-2026, soportada hasta oct-2027); `2027-01` RC | https://shopify.dev/docs/api/usage/versioning | V |
| Custom apps del admin | "You can no longer create new admin-created custom apps"; las existentes siguen. La fecha "enero 2026" del kit **no** aparece en la doc | https://shopify.dev/docs/apps/build/authentication-authorization/legacy/admin-custom-apps | V (fecha N) |
| Client credentials | `POST https://{shop}.myshopify.com/admin/oauth/access_token` con `grant_type=client_credentials`; token de 24 h; **solo tiendas de la misma organización** del Dev Dashboard (si no: `shop_not_permitted`) | https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant | V |
| App pública | Embebida → token exchange; fuera del admin → authorization code; managed installation; tokens offline expirables obligatorios desde 1-ene-2027; la revisión exige theme app extensions para tocar el tema | https://shopify.dev/docs/apps/launch/distribution · https://shopify.dev/docs/apps/launch/app-store-review/pass-app-review · https://shopify.dev/changelog/posts/expiring-offline-access-tokens-required-for-all-public-apps-as-of-january-1-2027 | V |
| Mutations de tema | `themeCreate`, `themeDuplicate`, `themePublish`, `themeFilesUpsert` exigen `write_themes` **y exención** (formulario); `themeFilesUpsert` ≤ 50 archivos | https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/themeFilesUpsert | V (criterios de exención N) |
| Theme app extensions | App blocks solo en temas OS 2.0; app embeds también en vintage; 10 MB, 30 bloques, 100 KB de Liquid; leen metafields; deep link `addAppBlockId` | https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration | V |
| Productos y media | `productSet` con `identifier` (id/handle/customId) hace upsert y **sincroniza listas (borra lo omitido)**; media: `stagedUploadsCreate` → `fileCreate` → sondear `READY`; `metafieldsSet` ≤ 25 por llamada; metafield `json` ≤ 128 KB (desde 2026-04) | https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productSet · https://shopify.dev/docs/apps/build/product-merchandising/products-and-collections/manage-media · https://shopify.dev/docs/apps/build/metafields/metafield-limits | V |
| Publicación | `publishablePublish` requiere `write_publications`; `pageCreate` requiere `write_content` u `write_online_store_pages` | (mismas páginas de la API 2026-10) | V |
| Rate limits | Costo calculado, leaky bucket por app+tienda; `extensions.cost.throttleStatus` | https://shopify.dev/docs/apps/build/apis/graphql-admin/rate-limits | V |
| Theme Access / CLI | `shopify theme push --unpublished`; Theme Access está pensado para desarrolladores y CI | https://shopify.dev/docs/storefronts/themes/tools/theme-access | V (uso por un SaaS: I, no apropiado) |
| Webhooks de privacidad | `customers/data_request`, `customers/redact`, `shop/redact` obligatorios en apps públicas | https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance | V |
| Dev MCP | `@shopify/dev-mcp` (ISC, 1.17.0): `claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest` | https://shopify.dev/docs/apps/build/devmcp | V |
| Librerías | `@shopify/shopify-api` 15.0.1, `@shopify/admin-api-client` 2.0.1, `@shopify/shopify-app-react-router` 3.0.2 (MIT); Theme Check dentro del CLI | https://shopify.dev/docs/api/shopify-app-react-router | V (recomendación para Next.js: I) |

## Proveedores BYOK y librerías
| Tema | Hallazgo usado | Fuente | Conf. |
|---|---|---|---|
| Vercel AI Gateway BYOK | Si la llave del usuario falla, el Gateway **reintenta con credenciales de Vercel** y cobra a la cuenta del SaaS; los budgets no cuentan BYOK | https://vercel.com/docs/ai-gateway/authentication-and-byok/byok | V |
| AI SDK | `ai` 7.x; `createOpenAI({ apiKey })` (y equivalentes Google/Anthropic) aceptan llave por request | https://ai-sdk.dev/providers/ai-sdk-providers/openai | V (openai) / I (resto) |
| OpenAI | Videos API (sora-2) apagada el 24-sep-2026; `gpt-image-1` se apaga el 23-oct-2026 | https://developers.openai.com/api/docs/deprecations | V |
| OpenAI términos | Business Terms prohíben "buy, sell, or transfer API keys"; aplicación a BYOK ambigua | https://openai.com/policies/business-terms | I |
| Gemini | Modelos de texto, imagen, Veo y audio; Files API 2 GB/archivo, 48 h; en el free tier Google usa los datos para entrenar | https://ai.google.dev/gemini-api/docs/models · https://ai.google.dev/gemini-api/terms | V |
| Google términos | APIs ToS §4(b)(1): impedir que otros API Clients usen tus credenciales → tensión con BYOK, sin resolver | https://developers.google.com/terms · https://discuss.ai.google.dev/t/terms-of-service-question-about-a-bring-your-own-api-key-byok-saas-feature/178632 | I |
| Anthropic | `GET /v1/models` valida llave; el cliente responde por la actividad de su cuenta | https://platform.claude.com/docs/en/models/overview · https://www.anthropic.com/legal/commercial-terms | V |
| Apify | Validar con `GET /v2/users/me` | https://docs.apify.com/api/v2/users-me-get | I |
| Firecrawl | Validar con `GET /v2/team/credit-usage` | https://docs.firecrawl.dev/api-reference/endpoint/credit-usage | V |
| fal.ai | Sin endpoint de validación gratuito documentado | https://fal.ai/docs/model-apis/authentication | V |
| Magnific | `docs.freepik.com` redirige a `docs.magnific.com`; header/precios sin confirmar | https://docs.magnific.com/introduction | N |
| "API MARK" | Candidato más probable: APIMart (apimart.ai), gateway compatible con OpenAI; operador sin confirmar. **No se integra hasta confirmar** | https://apimart.ai · https://docs.apimart.ai/en | N |
| Supabase Vault | Soportado; `pgsodium` en "pending deprecation" (no usarlo directamente) | https://supabase.com/docs/guides/database/vault · https://supabase.com/docs/guides/database/extensions/pgsodium | V |
| Supabase MCP | `https://mcp.supabase.com/mcp?read_only=true&project_ref=…`; no usar contra producción | https://supabase.com/docs/guides/getting-started/mcp | V |
| SSRF | `request-filtering-agent` 3.2.1 (MIT, mantenido); `ssrf-req-filter` sin releases desde 2024-05 | npm (`npm view`) | V |
| Jobs | `@vercel/queue` beta; Vercel Workflows 5.x; Inngest/Trigger.dev con planes gratuitos limitados | https://vercel.com/docs · npm | I |

## OpenRouter (ADR-010) — consulta 2026-10-16 (resúmenes vía WebFetch: contrastar campos exactos antes de implementar)
| Tema | Hallazgo usado | Fuente | Conf. |
|---|---|---|---|
| Chat | `POST /api/v1/chat/completions`, compatible con OpenAI, `usage.cost` | https://openrouter.ai/docs/api-reference/overview | V |
| AI SDK | `@openrouter/ai-sdk-provider` 3.1.0, Apache-2.0, `createOpenRouter({ apiKey })`, requiere `ai@^7` y Node ≥ 22 | https://github.com/OpenRouterTeam/ai-sdk-provider | V |
| Structured output | `response_format` json_schema; soporte por proveedor; forzar con `provider.require_parameters: true` | https://openrouter.ai/docs/features/structured-outputs | V |
| Imagen | `POST /api/v1/images` → `data[].b64_json`; `input_references` para editar con foto; `aspect_ratio` incluye 4:5, 16:9, 1:1; modelos en `GET /api/v1/images/models` | https://openrouter.ai/docs/guides/overview/multimodal/image-generation | V |
| PDF / audio | PDF como parte `file` + `file-parser` (`cloudflare-ai` gratis; `mistral-ocr` cobra a la cuenta); audio `input_audio` base64, sin URLs | https://openrouter.ai/docs/guides/overview/multimodal/pdfs · https://openrouter.ai/docs/guides/overview/multimodal/audio | V |
| Video | `POST /api/v1/videos` asíncrono con `polling_url`; modelos en `GET /api/v1/videos/models` | https://openrouter.ai/docs/cookbook/video-generation/choose-video-model.md | V |
| Validar llave | `GET /api/v1/key`: límite, uso, `is_free_tier` (no da el saldo de créditos) | https://openrouter.ai/docs/api-reference/limits | V |
| Errores | 402 con `metadata.limit_source`; 429 con `Retry-After`; en streaming el error llega como evento SSE | https://openrouter.ai/docs/api-reference/limits | V |
| Privacidad | `provider.data_collection: "deny"`, `provider.zdr: true`; por defecto no registra prompts | https://openrouter.ai/docs/guides/routing/provider-selection · https://openrouter.ai/docs/faq | V |
| Términos | §3.2 el usuario responde por sus credenciales; §7 prohíbe revender acceso; nada explícito sobre BYOK de terceros | https://openrouter.ai/terms | V (texto) / N (aplicación) |
| OAuth PKCE | Aparece en el índice de la doc; no se abrió | https://openrouter.ai/docs/llms.txt | N |

