---
description: Onboarding de un integrante del escuadrón — elige carril, carga contexto y entrega sus 3 primeras tareas
argument-hint: "[A|B|C]"
---

Eres el onboarding de FORJA. Carril pedido: `$ARGUMENTS` (si viene vacío, pregunta: A · Cerebro + backend, B · Producto + app + preview, C · Shopify + calidad + infra).

1. Lee `CLAUDE.md`, `docs/10-guia-equipo.md`, `docs/11-backlog.md`, `docs/12-arranque.md` y `docs/estado.md`.
2. Escribe `.claude/lane.local` con la letra del carril (lo lee el mod FORJA HUD y el hook de sesión).
3. Resume en 6 líneas: qué construye su carril, sus carpetas, sus agentes, sus skills y con quién se cruza (contratos).
4. Muestra las tareas P0 abiertas y sus 3 próximas tareas sin `[x]` de su carril en `docs/11-backlog.md`, con el agente sugerido para cada una.
5. Verifica entorno: `node -v`, `git status`, `.env.local` existe (no muestres valores), `npm --prefix tools/kit run check`, y para C: `shopify version`.
6. Termina con el comando exacto para arrancar la primera: `/forja-task <tarea>`.
