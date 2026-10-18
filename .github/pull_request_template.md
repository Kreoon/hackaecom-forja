## Qué cambia
<!-- 2-3 líneas. ID del backlog: P0-1, A3, C1… -->

## Carril
- [ ] A · cerebro + backend  - [ ] B · producto + app + preview  - [ ] C · Shopify + calidad + infra  - [ ] contratos (con ADR)

## Pruebas ejecutadas (pega la salida)
```
npm --prefix tools/kit run check
npm --prefix tools/kit run dry-run
<tests del carril>
```

## Checklist de integración (docs/10-guia-equipo.md)
- [ ] Sin cambios en carpetas de otro carril (o aprobados por su dueño)
- [ ] Contrato tocado → ADR + ejemplos actualizados
- [ ] Llaves / auth / ingesta / Shopify → `/forja-security-review` sin críticos
- [ ] Secciones → `/forja-contract-check`
- [ ] Fila del backlog actualizada

## Handoff
<!-- docs/plantillas/handoff.md si la tarea sigue en manos de otra persona -->
