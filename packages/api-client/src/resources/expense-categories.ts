import type { ExpenseCategory } from '@balancehogar/types';
import type { ApiClient } from '../client';

export class ExpenseCategoriesResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/expense-categories — catálogo global (raramente cambia). */
  async list(): Promise<ExpenseCategory[]> {
    return this.client.request<ExpenseCategory[]>('/expense-categories');
  }
}
