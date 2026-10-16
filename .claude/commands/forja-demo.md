---
description: Ensayo end-to-end de FORJA con un producto (simula la prueba final con el producto sorpresa)
argument-hint: "[carpeta de golden/ o descripción del producto]"
---

Usa el agente `forja-demo-qa` con `docs/03-demo-runbook.md`.

Producto: `$ARGUMENTS` (por defecto `golden/01`).

1. Verifica que la app corre (dev server o URL de preview de Vercel) y abre el navegador integrado.
2. Recorre el flujo completo cronometrando cada etapa.
3. Valida la tienda de desarrollo después del ✓.
4. Entrega: tabla de tiempos vs. meta, fallos con repro, y una lista "si falla en tarima, hacemos X".
5. Agrega el resultado a `docs/estado.md` con fecha y hora.
