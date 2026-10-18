# 10 · Guía de trabajo para 3 personas

Integrantes: **Máster · Joako · Samuel** (asignen carril en la tabla y con `/forja-start <A|B|C>`).

> **Actualización 2026-10-16:** el **frontend (carril B) lo hace otro compañero**. Este equipo es **el cerebro (carril A)**; C (Shopify) sigue definido aquí hasta que se asigne. La frontera con el frontend está en [`14-api-cerebro.md`](14-api-cerebro.md). Proveedor principal de IA: OpenRouter (ADR-010).

## Carriles (ADR-009)
Las letras A/B/C se mantienen porque las usan el mod `forja-hud`, el hook de sesión y los commits `feat(a|b|c)`.

| Carril | Equivale en la propuesta del equipo | Responsable | Revisor | Alcance | Carpetas |
|---|---|---|---|---|---|
| **A · Cerebro + backend** | Persona B | _asignar_ | C | auth del lado servidor, llaves BYOK, adapters, ingesta, Brief, composición, assets, jobs | `src/lib/ai/**`, `src/lib/ingest/**`, `src/lib/server/**` |
| **B · Producto + app + preview** | Persona A | _asignar_ | A | experiencia, pantallas (registro, llaves, tienda, proyecto), preview/editor, aprobación (UI), sistema de diseño | `src/app/**`, `src/components/**`, `src/styles/**` |
| **C · Shopify + calidad + infra** | Persona C | _asignar_ | B | conexión de tienda, aprobación (lógica), publicación, verificación, e2e, CI, observabilidad | `src/lib/shopify/**`, `src/lib/publish/**`, `shopify/**`, `e2e/**`, `.github/**` |
| Compartido (vía `forja-architect`) | todos | rota | 2 personas | contratos y migraciones | `src/contracts/**`, `supabase/migrations/**` |

El revisor de cada carril es de otro carril: nadie depende siempre de la misma persona.

## Contratos compartidos y dependencias
| Contrato | Dueño | Lo necesita | Para qué |
|---|---|---|---|
| `PageSpec` + tokens | architect | A produce, B muestra, C publica | todo |
| `Brief` / `ProductDNA` | A | B (pantalla de preguntas) | confirmar datos |
| `ProviderManifest` | A | B (Ajustes) | mostrar capacidades por llave |
| `Job` / estados | architect | A escribe, B muestra | progreso |
| `Approval` | C | B (botón ✓) | aprobar versión |
| `Publication` | C | B (estado/preview URL) | publicar y recuperar |

Mientras un contrato no existe en `src/contracts/`, cada carril trabaja contra **los ejemplos de fixture** (`forja-contracts/examples/`, `forja-pagespec/reference/example.json`) y con mocks. Así B no espera a A ni C a B.

## Ramas, PR y worktrees
- `main` siempre verde (`check` + `dry-run` + tests). Nadie empuja directo a `main` salvo docs triviales.
- Rama por tarea: `a/<id>-<slug>`, `b/<id>-<slug>`, `c/<id>-<slug>` (p. ej. `c/C1-smoke-shopify`). Contratos: `contracts/<slug>`.
- Commits: `feat(a): …`, `fix(c): …`, `docs: …`, `contracts: …`.
- PR pequeño (≤ 400 líneas útiles), plantilla `.github/pull_request_template.md`, 1 revisor del carril indicado arriba.
- **Worktrees** para trabajo paralelo en la misma máquina: `claude -w c-smoke` crea `.claude/worktrees/c-smoke/` en la rama `worktree-c-smoke` (ignorado por git). Para subagentes en paralelo: skill `/forja-parallel`.
- Copia `.env.local` a un worktree con `.worktreeinclude` (ya está en la raíz con `.env.local`).

## Evitar ediciones incompatibles
1. Un archivo = un dueño (tabla de carpetas). Tocar algo de otro carril → avisarle antes (el mod lo marca).
2. Contratos: un cambio por PR, con ADR, y se mergea **antes** que el código que lo usa.
3. Archivos "imán" con un solo editor por vez: `CLAUDE.md` (context-keeper), `docs/04-decisiones.md` (architect), `docs/11-backlog.md` (quien cierra la tarea, solo su fila).
4. `forja-sections.css`: dueño B; C solo lo copia en el build, no lo edita.
5. Migraciones: numeración secuencial; antes de crear una, `git pull` y revisar el último número.

## Handoff al terminar cada sesión
Ejecuta `/forja-handoff`. Deja en el PR (o en `docs/estado.md` si no hay PR) el bloque de `docs/plantillas/handoff.md`: qué quedó, qué falta, cómo probarlo, decisiones y bloqueos. Nunca termines con cambios sin confirmar en `main`.

## Registro de decisiones
`docs/04-decisiones.md` (ADR cortos). Proponer: cualquiera. Escribir y numerar: `forja-architect`. Una decisión sin ADR no existe.

## Checklist de integración (antes de merge a `main`)
- [ ] `npm --prefix tools/kit run check` y `run dry-run` en verde
- [ ] tests del carril en verde (salida pegada en el PR)
- [ ] sin cambios en carpetas de otro carril (o con su aprobación en el PR)
- [ ] contrato tocado → ADR + ejemplos + aviso a carriles afectados
- [ ] llaves, auth, ingesta o Shopify tocados → `/forja-security-review` sin críticos
- [ ] secciones tocadas → `/forja-contract-check`
- [ ] fila del backlog actualizada (`docs/11-backlog.md`)
