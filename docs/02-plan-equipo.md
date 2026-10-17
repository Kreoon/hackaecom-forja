# 02 · Plan del escuadrón (3 personas)

Integrantes: **Máster · Joako · Samuel**. Asignen carril aquí y en `/forja-start`:

| Carril | Persona |
|---|---|
| A · Cerebro + backend (IA, ingesta, BYOK, jobs) | _____ |
| B · Producto + app + preview | _____ |
| C · Shopify + calidad + infra | _____ |

Regla del 13 oct: **llegamos con el trabajo adelantado**; en tarima se da "el último detalle" y se explica el porqué. Solo demos.
Las tareas se marcan en `docs/11-backlog.md`.

## Día 0 · Preparación (antes de la tarima)
### Todos (30 min)
- [ ] Clonar repo, correr `install.ps1` / `install.sh`, `/forja-start <carril>`
- [ ] Proyecto Supabase creado, `.env.local` con URL/anon/service role (cada quien local)
- [ ] Tienda de desarrollo Shopify (Partner/Dev Dashboard) compartida por el equipo
- [ ] `forja-architect`: P0-1..P0-3 del backlog (scaffold, contratos, migración)

### Tareas por carril
El detalle (resultado, dependencias, archivos, aceptación, prueba, tamaño y paralelismo) vive en **[`11-backlog.md`](11-backlog.md)**, fuente única que leen `/forja-start` y `/forja-standup`. Los IDs A*/B*/C* se conservan. Reparto de carriles: [`10-guia-equipo.md`](10-guia-equipo.md).

### Cierre del día 0
- [ ] `/forja-contract-check` verde · `forja-byok-guardian` sin críticos
- [ ] `/forja-demo golden/01` < 5 min total
- [ ] Deploy a Vercel (producción) + cuenta demo con llaves y tienda conectadas
- [ ] **Video de respaldo** del flujo completo (lo pide el checklist técnico del show)

## Tarima · 78 min de producción ("último detalle")
Elegir 3 mejoras visibles, una por carril, ya ensayadas a medias:
| Hora | Reto del show | Qué mostramos |
|---|---|---|
| 9:55 R1 Señal de vida | primer mockup generado en pantalla | B |
| 10:10 R2 Insumo del público | marca/nicho/ciudad del público → regenerar hero + tokens en vivo | A |
| 10:25 R3 Speed run | la mini función que pida el Núcleo (tener 3 candidatas listas: "modo oscuro", "sección comparativa", "WhatsApp flotante") | quien esté libre |
| 10:40 R4 Explícalo en 30 s | guion en `03-demo-runbook.md` | vocero |
| 11:09 Prueba final (6 min) | producto sorpresa de 0 a Shopify | todos, vocero maneja |
