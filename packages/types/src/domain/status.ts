/**
 * Estado de un `RecurringExpense`. Aplica solo a la **ocurrencia actual**:
 * cuando se marca como `paid` y llega la siguiente fecha, vuelve a `pending`.
 *
 * Para gastos puntuales (`Expense`) no hay estado: existir = haberse pagado.
 */
export type RecurringExpenseStatus = 'pending' | 'paid';
