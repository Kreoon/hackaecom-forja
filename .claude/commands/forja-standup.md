---
description: Estado del escuadrón — qué hizo cada carril, bloqueos y siguiente paso
---

1. `git fetch --all -q` y `git log --since="12 hours ago" --all --pretty="%h %an %s"`; agrupa commits por prefijo `feat(a|b|c)`.
2. Lee `docs/estado.md` y `docs/02-plan-equipo.md`.
3. Devuelve por carril A/B/C: hecho · en curso · bloqueado por · siguiente. Máximo 3 líneas cada uno.
4. Señala riesgos para la demo (contratos sin cerrar, smoke test de Shopify pendiente, tiempos por encima de la meta).
5. Agrega un bloque fechado a `docs/estado.md`.
