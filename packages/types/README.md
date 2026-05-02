# @balancehogar/types

Tipos TypeScript del dominio de BalanceHogar.

## Por qué existe

Tener una **única fuente de verdad** para los tipos del dominio entre la app móvil y el backend evita drift de modelos: si cambia `Expense`, cambia en un solo lado y los consumidores rompen en compile-time.

## Decisiones de modelado

### IDs con branded types

Cada entidad tiene su propio tipo de ID (`ResidenceId`, `MemberId`, `ExpenseId`, etc.). Internamente son `string` (UUID v7), pero TypeScript impide pasar uno donde se espera otro.

```ts
function deleteMember(id: MemberId) { ... }
const expenseId: ExpenseId = '...' as ExpenseId;
deleteMember(expenseId); // ❌ Compile error
```

Costo: cero en runtime. Beneficio: alto en compile-time. Trade-off claro a favor.

### Dinero en centavos enteros

`AmountCents = number`. Almacenamos `109.50 MXN` como `10950`.

Razón: `0.1 + 0.2` en JavaScript da `0.30000000000000004`. Al sumar muchos gastos los errores se acumulan. Con enteros es imposible.

### Fechas como ISO 8601 string

`ISODateTime` (con hora) y `ISODate` (solo fecha). Strings, no `Date`.

Razón: `Date` no se serializa solo a JSON, requiere conversión manual al cruzar HTTP. Usando ISO el formato es estable en BD, en HTTP y en el código.

### Patrón "puro vs expandido" para relaciones

Cada entidad con relaciones tiene dos shapes:

```ts
type Expense                  = { paidById: MemberId, ... }      // puro, normalizado
type ExpenseWithRelations     = Expense & { paidBy: Member, ... } // expandido, listo para UI
```

La api retorna lo que el cliente pida (con o sin `?include=relations`). Esto evita N+1 lookups en el cliente sin sobre-fetching cuando no se necesitan las relaciones.

### Soft delete para Member

`Member.deletedAt: ISODateTime | null`. El brief exige preservar el historial de gastos cuando un miembro es eliminado, así que se marca como borrado pero el registro persiste. Las queries activas filtran por `deletedAt IS NULL`.

### Notificaciones como discriminated union

`NotificationPayload` es una union discriminada por `type`. Esto permite a TypeScript estrechar el tipo automáticamente en `switch (payload.type) { ... }` y garantiza que cada evento solo lleve los datos que le corresponden.

## Estructura

```
src/
├── domain/
│   ├── brand.ts                # Utility type Brand<T, K>
│   ├── ids.ts                  # ResidenceId, MemberId, ...
│   ├── primitives.ts           # ISODateTime, ISODate, AmountCents, CurrencyCode
│   ├── residence.ts            # Residence
│   ├── member.ts               # Member
│   ├── expense-category.ts     # ExpenseCategory + ExpenseCategorySlug
│   ├── expense.ts              # Expense + ExpenseWithRelations
│   ├── recurring-expense.ts    # RecurringExpense + ...WithRelations
│   ├── recurrence.ts           # RecurrenceFrequency
│   ├── status.ts               # RecurringExpenseStatus
│   ├── attachment.ts           # Attachment + AttachmentMimeType
│   ├── notification.ts         # Notification + NotificationPayload
│   └── index.ts                # Reexports públicos
└── api/
    └── index.ts                # DTOs de API (placeholder hasta fase de sync)
```

## Uso

```ts
import type { Expense, Member, ResidenceId } from '@balancehogar/types';
// o por subpath:
import type { Member } from '@balancehogar/types/domain';
```
