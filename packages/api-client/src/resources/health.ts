import type { ApiClient } from '../client';

export class HealthResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/health/live — ¿el proceso está corriendo? */
  async live(): Promise<{ status: 'ok'; uptime: number }> {
    return this.client.request<{ status: 'ok'; uptime: number }>(
      '/health/live',
      { skipAuth: true, raw: true },
    );
  }

  /** GET /api/health/ready — ¿la DB y dependencias responden? */
  async ready(): Promise<{ status: 'ok' | 'fail'; db: 'up' | 'down' }> {
    return this.client.request<{ status: 'ok' | 'fail'; db: 'up' | 'down' }>(
      '/health/ready',
      { skipAuth: true, raw: true },
    );
  }
}
