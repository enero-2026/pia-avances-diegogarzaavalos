import type { AmountCents } from '../domain/primitives';
import type { ExpenseCategory } from '../domain/expense-category';
import type { ExpenseWithRelations } from '../domain/expense';
import type { Member } from '../domain/member';
import type { RecurringExpenseWithRelations } from '../domain/recurring-expense';

/**
 * GET /api/residences/:id/dashboard
 *
 * Resumen para la pantalla "Inicio" según el brief:
 * - Totales por categoría (para gráfica).
 * - Estadísticas por miembro.
 * - Últimos gastos.
 * - Próximos gastos recurrentes (y su estado).
 */
export type DashboardSummary = {
  /** Mes que se está reportando (YYYY-MM). */
  month: string;
  totalSpentCents: AmountCents;
  byCategory: {
    category: ExpenseCategory;
    totalCents: AmountCents;
    percentage: number;
  }[];
  byMember: {
    member: Member;
    totalCents: AmountCents;
    expenseCount: number;
  }[];
  latestExpenses: ExpenseWithRelations[];
  upcomingRecurring: RecurringExpenseWithRelations[];
};
