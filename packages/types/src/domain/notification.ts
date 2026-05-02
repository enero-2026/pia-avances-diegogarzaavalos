import type {
  ExpenseId,
  MemberId,
  NotificationId,
  RecurringExpenseId,
  ResidenceId,
} from './ids';
import type { ISODateTime } from './primitives';

/**
 * Tipos de eventos del sistema. Cada tipo tiene su propio payload tipado abajo.
 * Esto permite hacer pattern matching seguro en el cliente:
 *
 *   switch (n.payload.type) {
 *     case 'expense.created': // n.payload.expenseId está disponible aquí ✅
 *   }
 */
export type NotificationType =
  | 'expense.created'
  | 'expense.updated'
  | 'recurring.due_soon'
  | 'recurring.marked_paid'
  | 'member.joined'
  | 'member.removed';

/**
 * Discriminated union: cada `type` lleva los datos relevantes a ese evento.
 * Es lo que se persiste como JSON en la columna `payload` de la BD.
 */
export type NotificationPayload =
  | {
      type: 'expense.created';
      expenseId: ExpenseId;
      createdById: MemberId;
    }
  | {
      type: 'expense.updated';
      expenseId: ExpenseId;
      updatedById: MemberId;
    }
  | {
      type: 'recurring.due_soon';
      recurringExpenseId: RecurringExpenseId;
      daysUntilDue: number;
    }
  | {
      type: 'recurring.marked_paid';
      recurringExpenseId: RecurringExpenseId;
      paidById: MemberId;
    }
  | {
      type: 'member.joined';
      newMemberId: MemberId;
    }
  | {
      type: 'member.removed';
      removedMemberId: MemberId;
      removedById: MemberId;
    };

/**
 * Notificación entregada a un miembro específico. Por ejemplo: cuando alguien
 * registra un gasto, se crea **una notificación por cada otro miembro de la
 * residencia**. Cada uno la marca como leída independientemente.
 */
export type Notification = {
  id: NotificationId;
  residenceId: ResidenceId;
  recipientId: MemberId;
  payload: NotificationPayload;
  readAt: ISODateTime | null;
  createdAt: ISODateTime;
};
