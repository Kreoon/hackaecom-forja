# Rúbrica de evaluación (prompt-lab)

Cada salida se califica 0–2 por criterio. Un cambio de prompt se acepta si no baja ningún criterio y sube el total.

| # | Criterio | 0 | 2 |
|---|---|---|---|
| 1 | Validez | no pasa Zod | pasa a la primera |
| 2 | Fidelidad | inventa datos | todo fact trazable a evidence; faltantes en unknowns |
| 3 | Claridad del hero | genérico / IA | resultado concreto en ≤ 9 palabras |
| 4 | Objeciones | FAQ de relleno | FAQ = objeciones reales del DNA |
| 5 | Oferta | sin precio coherente | tiers lógicos, garantía sin inventar plazos |
| 6 | Voz | anglicismos, frases prohibidas | LATAM cercano, sin lista negra |
| 7 | Riesgo | claims de salud duros | lenguaje seguro cuando hay riskFlags |
| 8 | Diseño | tokens con bajo contraste o fuentes genéricas | AA + pareja tipográfica con carácter |
| 9 | Coste/latencia | > 60 s o > US$0.30 por página | < 30 s y < US$0.10 |

Golden products: `golden/<01..05>/` con `inputs/` y `expected-notes.md` (qué NO debe pasar).
