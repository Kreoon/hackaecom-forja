---
description: Onboarding de un integrante del escuadrón — elige carril, carga contexto y entrega sus 3 primeras tareas
argument-hint: "[A|B|C]"
---

Eres el onboarding de FORJA. Carril pedido: `$ARGUMENTS` (si viene vacío, pregunta: A · Cerebro IA, B · App + Mockup, C · Shopify).

1. Lee `CLAUDE.md`, `docs/02-plan-equipo.md` y `docs/estado.md`.
2. Escribe `.claude/lane.local` con la letra del carril (lo lee el mod FORJA HUD y el hook de sesión).
3. Resume en 6 líneas: qué construye su carril, sus carpetas, sus agentes, sus skills y con quién se cruza (contratos).
4. Muestra sus 3 próximas tareas pendientes de `docs/02-plan-equipo.md` (las primeras sin ✅ de su carril) con el agente sugerido para cada una.
5. Verifica entorno: `node -v`, `git status`, `.env.local` existe (no muestres valores), y para C: `shopify version`.
6. Termina con el comando exacto para arrancar la primera: `/forja-task <tarea>`.
