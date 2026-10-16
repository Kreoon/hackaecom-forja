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

## ADR-003 · Estrategia de tema (PENDIENTE de smoke test C1)
**Contexto:** `themeFilesUpsert` y `themeCreate` requieren `write_themes` + exención de Shopify.
**Decisión:** _completar tras C1_ → A (theme files) si pasa; si no, C (app block + metafield) con B (Theme Access) de respaldo.
**Consecuencias:** _completar_.
