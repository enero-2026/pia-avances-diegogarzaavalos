import type { DashboardSummary } from '@balancehogar/types';
import type { ApiClient } from '../client';

export class DashboardResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/dashboard?month=YYYY-MM (mes opcional, default = mes actual). */
  async getSummary(params: { month?: string } = {}): Promise<DashboardSummary> {
    return this.client.request<DashboardSummary>('/dashboard', {
      query: { month: params.month },
    });
  }
}
