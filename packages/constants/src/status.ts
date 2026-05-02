import type { RecurringExpenseStatus } from '@balancehogar/types';

export const RECURRING_EXPENSE_STATUSES: readonly RecurringExpenseStatus[] = [
  'pending',
  'paid',
] as const;

export const RECURRING_STATUS_LABELS: Readonly<Record<RecurringExpenseStatus, string>> = {
  pending: 'Pendiente',
  paid: 'Pagado',
};
