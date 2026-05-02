# @balancehogar/api-client

Cliente HTTP tipado para consumir `apps/api` desde `apps/mobile`.

## Por qué existe (aunque ahora esté vacío)

El brief dice arrancar local pero saltar a sincronización **en cuanto se pueda**. Tener el package creado:

1. Reserva el lugar en el grafo de dependencias (la app ya puede importarlo sin reorganizar).
2. Mantiene los tipos del backend desacoplados del transporte (mañana podemos cambiar `fetch` por `tRPC` o `ts-rest` sin tocar a los consumidores).
3. Concentra el manejo de errores y reintentos en un solo lugar.

## Estructura prevista

```
src/
├── http.ts        # fetch wrapper con auth, timeout, reintentos
├── errors.ts      # NetworkError, ValidationError, AuthError tipados
└── resources/
    ├── residences.ts
    ├── members.ts
    ├── expenses.ts
    └── recurring-expenses.ts
```
