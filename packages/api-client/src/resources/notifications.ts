import type {
  Notification,
  PaginatedResponse,
} from '@balancehogar/types';
import type { RegisterPushTokenInput } from '@balancehogar/schemas';
import type { ApiClient } from '../client';

export class NotificationsResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/notifications (feed paginado). */
  async list(params: { page?: number; pageSize?: number } = {}) {
    return this.client.request<PaginatedResponse<Notification>>(
      '/notifications',
      { query: params, raw: true },
    );
  }

  /** GET /api/notifications/unread-count */
  async unreadCount(): Promise<number> {
    const data = await this.client.request<{ count: number }>(
      '/notifications/unread-count',
    );
    return data.count;
  }

  /** POST /api/notifications/:id/read */
  async markRead(id: string): Promise<Notification> {
    return this.client.request<Notification>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  /** POST /api/notifications/read-all */
  async markAllRead(): Promise<{ markedCount: number }> {
    return this.client.request<{ markedCount: number }>(
      '/notifications/read-all',
      { method: 'POST' },
    );
  }

  /** POST /api/devices/push-token */
  async registerPushToken(input: RegisterPushTokenInput): Promise<void> {
    await this.client.request<void>('/devices/push-token', {
      method: 'POST',
      body: input,
    });
  }

  /** DELETE /api/devices/push-token */
  async unregisterPushToken(token: string): Promise<void> {
    await this.client.request<void>('/devices/push-token', {
      method: 'DELETE',
      query: { token },
    });
  }
}
