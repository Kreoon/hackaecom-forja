# 09 · Herramientas, dependencias e integraciones

Consulta: 2026-10-16 (fuentes en [`fuentes.md`](fuentes.md)). Antes de instalar algo, vuelve a verificar versión y licencia.
Tres categorías que **no se mezclan**:
1. **Herramientas de los 3 desarrolladores** (Claude Code, MCPs, CLIs). No se despliegan.
2. **Dependencias del producto en ejecución** (lo que va en `package.json` de la app).
3. **Servicios BYOK** que conecta cada usuario con su llave.

Un MCP sirve a Claude Code mientras desarrollamos; **no** es una integración del producto.

## 1. Herramientas del equipo
| Herramienta | Recomendación | Alternativa | Motivo | Licencia | Estado en el repo |
|---|---|---|---|---|---|
| Shopify Dev MCP (`@shopify/dev-mcp`) | **Sí** | plugin `shopify-ai-toolkit` | Docs, esquema GraphQL y validación de queries sin credenciales | ISC | Configurado en `.mcp.json` |
| Supabase MCP (remoto) | **Sí, solo lectura** | Supabase CLI | Consultar esquema y logs del proyecto de desarrollo | Apache-2.0 | Configurado en `.mcp.json` con `${SUPABASE_PROJECT_REF}` y `read_only=true` |
| Context7 | Opcional | WebFetch + `forja-docs-research` | Docs de librerías; contenido de comunidad sin garantía | MIT | No configurado (cada quien lo agrega a nivel usuario) |
| Playwright MCP | Opcional | navegador integrado de Claude / Playwright CLI | "Not a security boundary"; usar con `--allowed-origins` | Apache-2.0 | No configurado |
| GitHub MCP | Opcional, `--read-only` | `gh` CLI (ya instalado) | `gh` cubre PRs y issues sin otro token | MIT | No configurado |
| Vercel MCP | No en el repo | Vercel CLI | Sin modo solo lectura; puede desplegar | — | No configurado |
| Shopify CLI | **Sí (carril C)** | — | Theme app extension, `shopify theme check`, app dev | MIT | No instalado en el equipo del autor; `install.ps1/.sh` lo sugiere |
| Supabase CLI | Sí | MCP | Migraciones locales y tests de RLS | MIT | Instalado (2.120) en el equipo del autor |
| Mod `forja-hud` | Sí | — | Aviso de carril | propio | `claude --plugin-dir mods/forja-hud` |

## 2. Dependencias del producto
| Necesidad | Recomendación | Alternativa | Motivo | Licencia · versión vista |
|---|---|---|---|---|
| Framework | Next.js App Router | — | Ya decidido en ADR del kit | MIT |
| Validación | `zod` 4 | — | Contratos y structured output | MIT · 4.6.7 |
| IA | `ai` 7 + `@openrouter/ai-sdk-provider` 3.1.0 (Apache-2.0, `createOpenRouter({ apiKey })` por request; requiere `ai@^7`, Node ≥ 22) y `@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/anthropic` con `apiKey` por request | SDKs oficiales (`openai`, `@google/genai`, `@anthropic-ai/sdk`) | Interfaz uniforme; **sin** BYOK del AI Gateway (ADR-006) | Apache-2.0 · ai 7.0.143 |
| Datos/Auth/Storage | `@supabase/supabase-js`, Supabase Vault | — | Ya decidido; no usar `pgsodium` directo (pending deprecation) | MIT |
| Shopify Admin | `@shopify/admin-api-client` (GraphQL 2026-10) | `@shopify/shopify-api` (fase 2, OAuth) | Cliente liviano para client credentials | MIT · 2.0.1 |
| Theme app extension | Shopify CLI (`shopify app generate extension`) | — | Única vía revisable para tocar el tema | MIT |
| Jobs MVP | tabla `jobs` + funciones largas + Realtime | — | Simple y suficiente para demo | — |
| Jobs fase 2 | Vercel Workflow (`workflow` 5.x) | Inngest (free con pausa al agotar) · Trigger.dev · `@vercel/queue` (beta) | Durable, mismo proveedor de deploy; validar GA antes | Apache-2.0 |
| SSRF | `request-filtering-agent` + `ipaddr.js` | `ssrf-req-filter` (sin releases desde 2024) | Filtra tras resolver DNS | MIT · 3.2.1 |
| Tipo de archivo | `file-type` | — | Magic bytes | MIT · 22.2.0 |
| PDF | `unpdf` (texto y páginas) | `pdf-lib` (sin releases desde 2022) | Límite de páginas antes del modelo | MIT · 1.9.0 |
| UI | shadcn/ui + Tailwind | — | Ya decidido (`forja-app-ui`) | MIT |
| Tests | Vitest 5, Playwright, pixelmatch | — | Vitest 5 es major nuevo: revisar breaking changes | MIT / Apache-2.0 / ISC |

## 3. Servicios BYOK (capacidades por proveedor)
✅ = documentado · ◐ = parcial o depende de la cuenta · — = no ofrece · ? = no verificado

| Proveedor | texto/visión | audio | PDF | imagen | video/animación | scrape | Validar llave | MVP |
|---|---|---|---|---|---|---|---|---|
| **OpenRouter** (ADR-010) | ✅ (muchos modelos; structured output según proveedor) | ◐ entrada `input_audio` base64 | ✅ parte `file` + plugin `file-parser` | ✅ `POST /api/v1/images` (con `input_references`) | ✅ `POST /api/v1/videos` (async) | — | `GET /api/v1/key` (gratis) | **Sí (principal)** |
| Gemini | ✅ | ✅ | ✅ | ✅ | ◐ (Veo preview) | — | `GET /v1beta/models` (?) | Sí (alternativa directa) |
| OpenAI | ✅ | ✅ transcripción | ? | ✅ (`gpt-image-1` se apaga el 23-oct-2026) | — (Videos API apagada el 24-sep-2026) | — | `GET /v1/models` (?) | Sí |
| Anthropic | ✅ | — | ? | — | — | — | `GET /v1/models` | Sí |
| Firecrawl | — | — | — | — | — | ✅ | `GET /v2/team/credit-usage` | Opcional |
| Apify | — | — | — | — | — | ✅ (Actors) | `GET /v2/users/me` | Opcional |
| fal.ai | — | ◐ | — | ✅ | ✅ | — | sin endpoint gratis (llamada paga) | Después |
| Magnific | — | — | — | ✅ upscale/relight | ◐ | — | ? | Después |
| KIE.ai | — | — | — | ◐ | ◐ | — | sin endpoint de saldo; errores con HTTP 200 | Después |
| ElevenLabs | — | ✅ TTS/STT | — | — | — | — | `GET /v1/user/subscription` | Después |
| Replicate | ◐ | ◐ | — | ✅ | ✅ | — | `GET /v1/account` | Después |
| "API MARK" | ? | ? | ? | ? | ? | ? | ? | **Bloqueado** |

**"API MARK" — pendiente de identificar.** Candidato más probable: APIMart (`apimart.ai`, gateway compatible con OpenAI). Su operador no está identificado y anuncia precios por debajo de los oficiales, lo que plantea dudas de procedencia y de términos. **Paso para desbloquear:** que quien propuso "API MARK" confirme la URL exacta del servicio; después, `forja-provider-integration` evalúa términos, capacidades y validación.

**Riesgo de términos (todos los proveedores):** antes de abrir a usuarios externos, revisar con criterio legal el uso de llaves de clientes (OpenAI "transfer API keys", Google APIs ToS §4(b)(1)). Mientras tanto: solo el equipo y usuarios de prueba.

## "mods"
Corresponde a los **mods de Claude Code** (plugin con módulo de hooks que dibuja UI y reacciona a eventos). En este repo: `mods/forja-hud`. No es un ecosistema del producto.
