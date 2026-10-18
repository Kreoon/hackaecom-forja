# 00 · FIXTURE — Termo LED (producto ficticio)

> **Esto es un fixture de prueba.** Producto, textos, precios y URLs son inventados para probar el flujo.
> No representa un producto real ni se publica en ninguna tienda.

Lo usa `npm --prefix tools/kit run dry-run` para recorrer: materiales → evidencia → Brief → PageSpec → aprobación → plan de publicación.
El PageSpec que usa es `.claude/skills/forja-pagespec/reference/example.json` (el mismo termo).

| Archivo | Simula |
|---|---|
| `inputs/ficha.txt` | texto que el usuario pega en el formulario |
| `inputs/nota-de-voz.transcripcion.txt` | transcripción de un audio de 30 s (no hay audio real) |
| `inputs/urls.txt` | URL de referencia de un "competidor" (dominio reservado `example.com`) |
| `evidence.json` | salida simulada de los extractores (sin llamar a ningún proveedor) |
