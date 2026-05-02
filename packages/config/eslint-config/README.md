# @balancehogar/eslint-config

Reglas de ESLint compartidas. Cada app/package extiende del preset que corresponda.

## Presets

| Archivo            | Para                                       |
| ------------------ | ------------------------------------------ |
| `base.js`          | Cualquier package TypeScript               |
| `react-native.js`  | `apps/mobile` (extiende de `base`)         |
| `nest.js`          | `apps/api` (extiende de `base`)            |

> Las reglas concretas se llenarán en la fase de implementación. Por ahora estos archivos viven como placeholders documentados.
