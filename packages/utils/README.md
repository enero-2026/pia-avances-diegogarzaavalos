# @balancehogar/utils

Utilidades **puras** (sin estado, sin dependencias de plataforma) reutilizables entre mobile y api.

## Por qué existe

La lógica de cálculo de gastos (split por porcentaje, totales, comparación mes-a-mes) tiene que dar **el mismo resultado** en mobile y en api. Si vive en un solo lugar, no hay forma de que se desincronice.

## Estructura

```
src/
├── currency/   # Formato y parseo de dinero (MXN)
├── date/       # Recurrencias, agrupado por mes, fechas relativas
├── expenses/   # Splits, totales por categoría, % para dashboard
└── strings/    # Iniciales, códigos de invitación, slugs
```

## Reglas

- **Funciones puras**. Nada de `Date.now()` directo: recibe `now` como parámetro para testabilidad.
- **Sin dependencias nativas**. Tiene que correr en RN, Node y eventualmente en navegador.
- **Trabajar en centavos enteros** para evitar errores de punto flotante.
