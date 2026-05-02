import type {
  AttachmentId,
  ExpenseCategoryId,
  ExpenseId,
  MemberId,
  RecurringExpenseId,
  ResidenceId,
} from './ids';
import type { AmountCents, CurrencyCode, ISODate, ISODateTime } from './primitives';
import type { Attachment } from './attachment';
import type { ExpenseCategory } from './expense-category';
import type { Member } from './member';

/**
 * Gasto puntual. Es la entidad central de la app.
 *
 * Sobre `date` vs `createdAt`:
 *   `date` es la **fecha del gasto** (cuándo se pagó la luz, p.ej.).
 *   `createdAt` es **cuándo se registró** en la app. Pueden ser diferentes:
 *   alguien puede registrar hoy un gasto que pagó hace 3 días.
 *
 * Sobre `recurringExpenseId`:
 *   Si este gasto fue generado a partir de una plantilla recurrente, queda
 *   ligado para poder rastrear el historial de "ocurrencias" del recurrente.
 */
export type Expense = {
  id: ExpenseId;
  residenceId: ResidenceId;
  title: string;
  description: string | null;
  amount: AmountCents;
  currency: CurrencyCode;
  categoryId: ExpenseCategoryId;
  /** Miembro que pagó el gasto (puede no ser quien lo registró). */
  paidById: MemberId;
  /** Quien hizo el registro en la app (auditoría). */
  recordedById: MemberId;
  date: ISODate;
  /** Si nació de un recurrente, queda enlazado. */
  recurringExpenseId: RecurringExpenseId | null;
  /** Lista de IDs de adjuntos. Los objetos completos viven en `ExpenseWithRelations`. */
  attachmentIds: AttachmentId[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

/**
 * Misma entidad pero con relaciones expandidas. La app la usa al renderizar
 * (no quiere hacer 3 lookups por cada fila de la lista).
 *
 * Convención: `<Entity>WithRelations` cuando necesitamos la versión expandida.
 */
export type ExpenseWithRelations = Omit<Expense, 'attachmentIds'> & {
  category: ExpenseCategory;
  paidBy: Member;
  recordedBy: Member;
  attachments: Attachment[];
};
