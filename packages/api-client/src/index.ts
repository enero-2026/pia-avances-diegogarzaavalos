/**
 * Cliente HTTP tipado para consumir apps/api desde apps/mobile (y eventualmente web).
 *
 * Uso típico:
 *
 *   const api = createApiClient({
 *     baseUrl: process.env.EXPO_PUBLIC_API_URL!,
 *     storage: secureStoreAdapter,
 *     onUnauthorized: () => router.replace('/onboarding'),
 *   });
 *
 *   await api.auth.createResidence({ ... });
 *   const dashboard = await api.dashboard.getSummary();
 */
import { ApiClient, type ApiClientConfig } from './client';
import { AuthResource } from './resources/auth';
import { ResidencesResource } from './resources/residences';
import { MembersResource } from './resources/members';
import { ExpensesResource } from './resources/expenses';
import { RecurringExpensesResource } from './resources/recurring-expenses';
import { ExpenseCategoriesResource } from './resources/expense-categories';
import { NotificationsResource } from './resources/notifications';
import { DashboardResource } from './resources/dashboard';
import { AttachmentsResource } from './resources/attachments';
import { HealthResource } from './resources/health';

export type BalanceHogarApi = {
  client: ApiClient;
  auth: AuthResource;
  residences: ResidencesResource;
  members: MembersResource;
  expenses: ExpensesResource;
  recurringExpenses: RecurringExpensesResource;
  expenseCategories: ExpenseCategoriesResource;
  notifications: NotificationsResource;
  dashboard: DashboardResource;
  attachments: AttachmentsResource;
  health: HealthResource;
};

export function createApiClient(config: ApiClientConfig): BalanceHogarApi {
  const client = new ApiClient(config);
  return {
    client,
    auth: new AuthResource(client),
    residences: new ResidencesResource(client),
    members: new MembersResource(client),
    expenses: new ExpensesResource(client),
    recurringExpenses: new RecurringExpensesResource(client),
    expenseCategories: new ExpenseCategoriesResource(client),
    notifications: new NotificationsResource(client),
    dashboard: new DashboardResource(client),
    attachments: new AttachmentsResource(client),
    health: new HealthResource(client),
  };
}

export { ApiClient } from './client';
export type { ApiClientConfig } from './client';
export { ApiClientError, NetworkError } from './errors';
export { InMemoryTokenStorage } from './storage';
export type { TokenStorage } from './storage';
export type { ListExpensesParams } from './resources/expenses';
export type { AttachmentUploadInput } from './resources/attachments';
