import type { Residence } from '@balancehogar/types';
import type { UpdateResidenceInput } from '@balancehogar/schemas';
import type { ApiClient } from '../client';

export class ResidencesResource {
  constructor(private readonly client: ApiClient) {}

  /** GET /api/residences/me — residencia asociada al miembro autenticado. */
  async getMine(): Promise<Residence> {
    return this.client.request<Residence>('/residences/me');
  }

  /** PATCH /api/residences/:id — sólo owner. */
  async update(residenceId: string, input: UpdateResidenceInput): Promise<Residence> {
    return this.client.request<Residence>(`/residences/${residenceId}`, {
      method: 'PATCH',
      body: input,
    });
  }

  /** POST /api/residences/:id/regenerate-invite — invalida el código viejo. */
  async regenerateInvite(residenceId: string): Promise<Residence> {
    return this.client.request<Residence>(`/residences/${residenceId}/regenerate-invite`, {
      method: 'POST',
    });
  }

  /** DELETE /api/residences/:id — borra la residencia y todo lo asociado. */
  async delete(residenceId: string): Promise<void> {
    await this.client.request<void>(`/residences/${residenceId}`, {
      method: 'DELETE',
    });
  }
}
