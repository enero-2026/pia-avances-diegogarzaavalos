# @balancehogar/typescript-config

Configuraciones base de TypeScript compartidas en todo el monorepo.

## Configuraciones disponibles

| Archivo               | Para qué sirve                                                  |
| --------------------- | --------------------------------------------------------------- |
| `base.json`           | Base estricta, usada por todos los demás                        |
| `library.json`        | Para packages que se compilan a `dist/` (types, utils, etc.)    |
| `react-native.json`   | Reglas estrictas para `apps/mobile`. Combinar con `expo/tsconfig.base` mediante array de `extends` |
| `nest.json`           | Para `apps/api` (decoradores + emitDecoratorMetadata)           |

## Uso

En el `tsconfig.json` del package que lo necesite:

```json
{
  "extends": "@balancehogar/typescript-config/library.json"
}
```

Para `apps/mobile` se usa array de `extends` (TS 5.0+) para combinar con la base de Expo:

```json
{
  "extends": [
    "expo/tsconfig.base",
    "@balancehogar/typescript-config/react-native.json"
  ]
}
```
