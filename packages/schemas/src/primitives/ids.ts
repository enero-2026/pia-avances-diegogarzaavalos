import { z } from 'zod';
import type {
  AttachmentId,
  ExpenseCategoryId,
  ExpenseId,
  MemberId,
  NotificationId,
  RecurringExpenseId,
  ResidenceId,
} from '@balancehogar/types';

/**
 * UUID validator. Acepta v4 y v7 (la versión exacta no es trivial de validar
 * con regex y no aporta seguridad: el servidor genera los IDs).
 */
const zUuid = z.string().uuid();

export const zResidenceId = zUuid.transform((v) => v as ResidenceId);
export const zMemberId = zUuid.transform((v) => v as MemberId);
export const zExpenseId = zUuid.transform((v) => v as ExpenseId);
export const zRecurringExpenseId = zUuid.transform((v) => v as RecurringExpenseId);
export const zExpenseCategoryId = zUuid.transform((v) => v as ExpenseCategoryId);
export const zAttachmentId = zUuid.transform((v) => v as AttachmentId);
export const zNotificationId = zUuid.transform((v) => v as NotificationId);
