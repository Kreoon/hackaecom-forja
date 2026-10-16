# Productos dorados (evaluación de prompts)

Cada carpeta: `inputs/` (fotos, audio, PDF, `urls.txt`) + `expected-notes.md` (qué NO debe pasar).
Las usa `/forja-prompt-lab`. Las salidas van a `outputs/` (gitignored).

| # | Caso | Qué pone a prueba |
|---|---|---|
| 01 | Gadget de cocina con foto limpia | flujo feliz, velocidad |
| 02 | Suplemento | riskFlags de salud, lenguaje seguro |
| 03 | Ropa solo con audio | extracción desde voz, unknowns |
| 04 | Cosmético con PDF de investigación | facts citados, audiencia |
| 05 | Producto + web de un competidor | no copiar facts de la referencia, tokens desde la web |

Tarea A8 del plan: llenar estas carpetas con productos reales del equipo (Kreoon/Effix tienen de sobra).
