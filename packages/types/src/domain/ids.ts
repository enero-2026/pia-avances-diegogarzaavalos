import type { Brand } from './brand';

/**
 * IDs del dominio. Internamente son strings (UUID v7), pero el tipo branded
 * impide pasar un MemberId donde se espera un ResidenceId, etc.
 *
 * Conversión segura desde string crudo: `value as ResidenceId` (típicamente
 * solo en la capa que lee de la BD o del request HTTP, después de validar).
 */

export type ResidenceId = Brand<string, 'ResidenceId'>;
export type MemberId = Brand<string, 'MemberId'>;
export type ExpenseId = Brand<string, 'ExpenseId'>;
export type RecurringExpenseId = Brand<string, 'RecurringExpenseId'>;
export type ExpenseCategoryId = Brand<string, 'ExpenseCategoryId'>;
export type AttachmentId = Brand<string, 'AttachmentId'>;
export type NotificationId = Brand<string, 'NotificationId'>;
