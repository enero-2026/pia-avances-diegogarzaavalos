import type {
  ExpenseCategoryId,
  MemberId,
  RecurringExpenseId,
  ResidenceId,
} from './ids';
import type { AmountCents, CurrencyCode, ISODate, ISODateTime } from './primitives';
import type { ExpenseCategory } from './expense-category';
import type { Member } from './member';
import type { RecurrenceFrequency } from './recurrence';
import type { RecurringExpenseStatus } from './status';

/**
 * Plantilla de un gasto que se repite ("Netflix mensual", "Predial anual"...).
 *
 * - El brief pide alertas en la pantalla "Inicio" del tipo "se acerca el pago de la luz",
 *   por eso `nextDueDate` vive en la entidad: la app calcula contra `now` para mostrar
 *   los próximos. Cuando se marca como `paid` y se genera el `Expense` real, se recalcula
 *   `nextDueDate` con base en `frequency`.
 * - `isActive: false` permite "pausar" un recurrente sin borrarlo (perdió el servicio,
 *   se canceló temporalmente, etc.).
 */
export type RecurringExpense = {
  id: RecurringExpenseId;
  residenceId: ResidenceId;
  title: string;
  description: string | null;
  amount: AmountCents;
  currency: CurrencyCode;
  categoryId: ExpenseCategoryId;
  /** Quién creó la plantilla. */
  createdById: MemberId;
  frequency: RecurrenceFrequency;
  nextDueDate: ISODate;
  status: RecurringExpenseStatus;
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type RecurringExpenseWithRelations = RecurringExpense & {
  category: ExpenseCategory;
  createdBy: Member;
};
