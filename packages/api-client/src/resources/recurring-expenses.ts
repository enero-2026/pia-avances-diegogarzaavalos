import type {
  RecurringExpense,
  RecurringExpenseWithRelations,
} from '@balancehogar/types';
import type {
  CreateRecurringExpenseInput,
  MarkRecurringPaidInput,
  UpdateRecurringExpenseInput,
} from '@balancehogar/schemas';
import type { ApiClient } from '../client';

export class RecurringExpensesResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/recurring-expenses */
  async list(): Promise<RecurringExpenseWithRelations[]> {
    return this.client.request<RecurringExpenseWithRelations[]>('/recurring-expenses');
  }

  /** GET /api/recurring-expenses/:id */
  async get(id: string): Promise<RecurringExpenseWithRelations> {
    return this.client.request<RecurringExpenseWithRelations>(
      `/recurring-expenses/${id}`,
    );
  }

  /** POST /api/recurring-expenses */
  async create(input: CreateRecurringExpenseInput): Promise<RecurringExpense> {
    return this.client.request<RecurringExpense>('/recurring-expenses', {
      method: 'POST',
      body: input,
    });
  }

  /** PATCH /api/recurring-expenses/:id */
  async update(
    id: string,
    input: UpdateRecurringExpenseInput,
  ): Promise<RecurringExpense> {
    return this.client.request<RecurringExpense>(`/recurring-expenses/${id}`, {
      method: 'PATCH',
      body: input,
    });
  }

  /**
   * POST /api/recurring-expenses/:id/mark-paid
   * Marca el recurrente como pagado, crea un Expense puntual asociado y avanza
   * la próxima fecha de vencimiento.
   */
  async markPaid(id: string, input: MarkRecurringPaidInput) {
    return this.client.request<{
      expense: import('@balancehogar/types').Expense;
      recurring: RecurringExpense;
    }>(`/recurring-expenses/${id}/mark-paid`, {
      method: 'POST',
      body: input,
    });
  }

  /** DELETE /api/recurring-expenses/:id */
  async delete(id: string): Promise<void> {
    await this.client.request<void>(`/recurring-expenses/${id}`, {
      method: 'DELETE',
    });
  }
}
