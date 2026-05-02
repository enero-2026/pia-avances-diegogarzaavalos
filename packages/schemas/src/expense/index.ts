import { z } from 'zod';
import {
  EXPENSE_DESCRIPTION_MAX_LENGTH,
  EXPENSE_TITLE_MAX_LENGTH,
} from '@balancehogar/constants';
import { zAmountCents, zCurrencyCode } from '../primitives/currency';
import { zISODate } from '../primitives/dates';
import { zExpenseCategoryId, zMemberId } from '../primitives/ids';

const zTitle = z
  .string()
  .trim()
  .min(1, 'El título es obligatorio.')
  .max(EXPENSE_TITLE_MAX_LENGTH, `Máximo ${EXPENSE_TITLE_MAX_LENGTH} caracteres.`);

const zDescription = z
  .string()
  .trim()
  .max(EXPENSE_DESCRIPTION_MAX_LENGTH, `Máximo ${EXPENSE_DESCRIPTION_MAX_LENGTH} caracteres.`)
  .nullable()
  .optional();

/**
 * POST /api/expenses
 *
 * Crea un gasto. Los adjuntos se suben en una llamada posterior a
 * `POST /api/expenses/:id/attachments` (multipart). Esto evita el problema
 * de "attachments huérfanos" si el cliente sube y luego nunca crea el gasto.
 */
export const createExpenseSchema = z.object({
  title: zTitle,
  description: zDescription,
  amount: zAmountCents,
  currency: zCurrencyCode.default('MXN'),
  categoryId: zExpenseCategoryId,
  paidById: zMemberId,
  date: zISODate,
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

/** PATCH /api/expenses/:id */
export const updateExpenseSchema = createExpenseSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: 'Debe enviar al menos un campo a actualizar.' },
);

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

/**
 * Filtros para GET /api/residences/:id/expenses
 * Brief: filtro por categoría, miembro, mes y estado.
 *
 * Nota: los enums se declaran con literales explícitos (no con
 * `EXPENSE_CATEGORY_SLUGS` runtime) porque `z.enum` requiere tuple readonly
 * en compile-time. Cualquier cambio en `@balancehogar/types` rompe en compile-time
 * la consistencia (el `satisfies` lo garantiza si se agrega).
 */
export const expenseFiltersSchema = z.object({
  categorySlug: z
    .enum(['services', 'groceries', 'transport', 'health', 'other'])
    .optional(),
  paidById: z.string().uuid().optional(),
  /** Mes en formato YYYY-MM. */
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Formato esperado: YYYY-MM.')
    .optional(),
  /** Solo aplica a recurrentes; aquí se permite si el cliente filtra "vencidos del mes". */
  status: z.enum(['pending', 'paid']).optional(),
  /** Si se quiere incluir relaciones expandidas en la respuesta. */
  includeRelations: z.coerce.boolean().optional().default(false),
});

export type ExpenseFilters = z.infer<typeof expenseFiltersSchema>;

// ─── Recurring expenses ─────────────────────────────────────────────────

const zRecurrenceFrequency = z.enum([
  'monthly',
  'bimonthly',
  'quarterly',
  'semiannual',
  'annual',
]);

/** POST /api/residences/:residenceId/recurring-expenses */
export const createRecurringExpenseSchema = z.object({
  title: zTitle,
  description: zDescription,
  amount: zAmountCents,
  currency: zCurrencyCode.default('MXN'),
  categoryId: zExpenseCategoryId,
  frequency: zRecurrenceFrequency,
  /** Primera fecha de vencimiento. */
  nextDueDate: zISODate,
});

export type CreateRecurringExpenseInput = z.infer<typeof createRecurringExpenseSchema>;

export const updateRecurringExpenseSchema = createRecurringExpenseSchema
  .extend({ isActive: z.boolean() })
  .partial()
  .refine((v) => Object.keys(v).length > 0, {
    message: 'Debe enviar al menos un campo a actualizar.',
  });

export type UpdateRecurringExpenseInput = z.infer<typeof updateRecurringExpenseSchema>;

/**
 * POST /api/recurring-expenses/:id/mark-paid
 * Marca el recurrente como pagado y crea un Expense puntual asociado.
 */
export const markRecurringPaidSchema = z.object({
  paidById: zMemberId,
  /** Fecha real del pago (puede no ser hoy). */
  date: zISODate,
});

export type MarkRecurringPaidInput = z.infer<typeof markRecurringPaidSchema>;
