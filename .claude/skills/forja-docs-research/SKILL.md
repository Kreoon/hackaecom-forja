---
name: forja-docs-research
description: "Investigación de documentación oficial actual antes de usar una API o configurar Claude Code, con registro de fuente y fecha en docs/fuentes.md. Úsalo antes de cualquier integración con Shopify, Supabase, Vercel o un proveedor de IA."
argument-hint: "<pregunta concreta>"
---

# /forja-docs-research
## Entradas
Pregunta concreta (`$ARGUMENTS`) y módulo que la usará.

## Pasos
1. Revisa `docs/fuentes.md`: si ya hay una fila de < 30 días que responde, úsala.
2. Fuentes en orden: doc oficial (shopify.dev, code.claude.com, supabase.com, vercel.com/docs, docs del proveedor) → MCP `shopify-dev` para GraphQL (`search_docs_chunks`, `introspect_graphql_schema`, `validate_graphql_codeblocks`) → changelog oficial → terceros solo como pista.
3. Confirma versión (Shopify `2026-10`), scopes, límites, errores y deprecaciones.
4. Agrega una fila a `docs/fuentes.md`: `Tema · Hallazgo · URL · Conf (V/I/N)` con la fecha.

## Salida
Respuesta en ≤ 6 líneas + tabla de evidencias + fila añadida.

## Ejemplo
"¿`productSet` borra variantes omitidas?" → Sí, sincroniza listas (V, URL de la mutation 2026-10) → consecuencia: no usarlo en productos ajenos.

## Terminado cuando
Cada afirmación tiene URL y nivel de confianza; lo que no pudiste abrir está marcado N.
