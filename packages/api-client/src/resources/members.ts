import type { Member } from '@balancehogar/types';
import type {
  UpdateMemberInput,
  UpdateMemberPercentagesInput,
} from '@balancehogar/schemas';
import type { ApiClient } from '../client';

export class MembersResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/members/me */
  async me(): Promise<Member> {
    return this.client.request<Member>('/members/me');
  }

  /** GET /api/members — todos los miembros activos de la residencia. */
  async list(): Promise<Member[]> {
    return this.client.request<Member[]>('/members');
  }

  /** GET /api/members/:id */
  async get(memberId: string): Promise<Member> {
    return this.client.request<Member>(`/members/${memberId}`);
  }

  /** PATCH /api/members/:id — actualizar nombre/color/porcentaje. */
  async update(memberId: string, input: UpdateMemberInput): Promise<Member> {
    return this.client.request<Member>(`/members/${memberId}`, {
      method: 'PATCH',
      body: input,
    });
  }

  /** POST /api/members/percentages — actualiza porcentajes en bloque (solo owner). */
  async updatePercentages(input: UpdateMemberPercentagesInput): Promise<Member[]> {
    return this.client.request<Member[]>('/members/percentages', {
      method: 'POST',
      body: input,
    });
  }

  /** POST /api/members/transfer-ownership — el owner pasa el rol a otro miembro. */
  async transferOwnership(newOwnerId: string): Promise<Member[]> {
    return this.client.request<Member[]>('/members/transfer-ownership', {
      method: 'POST',
      body: { newOwnerId },
    });
  }

  /** DELETE /api/members/:id — soft-delete (preserva los gastos históricos). */
  async softDelete(memberId: string): Promise<void> {
    await this.client.request<void>(`/members/${memberId}`, {
      method: 'DELETE',
    });
  }
}
