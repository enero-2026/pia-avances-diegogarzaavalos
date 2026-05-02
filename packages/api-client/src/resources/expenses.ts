import type {
  Expense,
  ExpenseCategorySlug,
  ExpenseWithRelations,
  PaginatedResponse,
} from '@balancehogar/types';
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from '@balancehogar/schemas';
import type { ApiClient } from '../client';

export type ListExpensesParams = {
  page?: number;
  pageSize?: number;
  categorySlug?: ExpenseCategorySlug;
  paidById?: string;
  /** YYYY-MM. */
  month?: string;
  status?: 'pending' | 'paid';
  includeRelations?: boolean;
};

export class ExpensesResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/expenses (paginado + filtros). */
  async list(
    params: ListExpensesParams = {},
  ): Promise<PaginatedResponse<ExpenseWithRelations>> {
    const query: Record<string, string | number | boolean | undefined | null> = {
      page: params.page,
      pageSize: params.pageSize,
      categorySlug: params.categorySlug,
      paidById: params.paidById,
      month: params.month,
      status: params.status,
      includeRelations: params.includeRelations ?? true,
    };
    return this.client.request<PaginatedResponse<ExpenseWithRelations>>(
      '/expenses',
      { query, raw: true },
    );
  }

  /** GET /api/expenses/:id (siempre con relaciones expandidas). */
  async get(expenseId: string): Promise<ExpenseWithRelations> {
    return this.client.request<ExpenseWithRelations>(`/expenses/${expenseId}`);
  }

  /** POST /api/expenses */
  async create(input: CreateExpenseInput): Promise<Expense> {
    return this.client.request<Expense>('/expenses', {
      method: 'POST',
      body: input,
    });
  }

  /** PATCH /api/expenses/:id */
  async update(expenseId: string, input: UpdateExpenseInput): Promise<Expense> {
    return this.client.request<Expense>(`/expenses/${expenseId}`, {
      method: 'PATCH',
      body: input,
    });
  }

  /** DELETE /api/expenses/:id */
  async delete(expenseId: string): Promise<void> {
    await this.client.request<void>(`/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  }
}
