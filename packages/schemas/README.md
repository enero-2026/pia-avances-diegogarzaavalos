# @balancehogar/schemas

Validaciones con [Zod](https://zod.dev) compartidas entre `apps/mobile` y `apps/api`.

## Por qué existe

La regla "validar en cliente Y en servidor" suele duplicarse. Con Zod podemos definir el schema una vez y:

- En **mobile** lo usamos para validar formularios antes de mandar al backend.
- En **api** (NestJS) lo usamos como pipe de validación de DTOs.
- En **types** podemos derivar tipos con `z.infer<typeof Schema>` para evitar declarar dos veces.

## Estructura

```
src/
├── auth/        # Crear residencia, unirse, sesión
├── residence/   # Schemas de Residence
├── member/      # Schemas de Member (alta, edición, baja)
└── expense/     # Schemas de Expense y RecurringExpense + filtros
```
