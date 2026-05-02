import type {
  AuthResponse,
  Member,
  MemberId,
} from '@balancehogar/types';
import type {
  CreateResidenceInput,
  JoinResidenceInput,
} from '@balancehogar/schemas';
import type { ApiClient } from '../client';

export class AuthResource {
  constructor(private readonly client: ApiClient) {}

  /** POST /api/auth/residences — crea residencia + owner. Persiste el token automáticamente. */
  async createResidence(input: CreateResidenceInput): Promise<AuthResponse> {
    const data = await this.client.request<AuthResponse>('/auth/residences', {
      method: 'POST',
      body: input,
      skipAuth: true,
    });
    await this.client.storage.setToken(data.token);
    return data;
  }

  /** POST /api/auth/join — únete con invite code. Persiste el token automáticamente. */
  async join(input: JoinResidenceInput): Promise<AuthResponse> {
    const data = await this.client.request<AuthResponse>('/auth/join', {
      method: 'POST',
      body: input,
      skipAuth: true,
    });
    await this.client.storage.setToken(data.token);
    return data;
  }

  /** POST /api/auth/me — devuelve el miembro de la sesión activa. */
  async me(): Promise<Member> {
    return this.client.request<Member>('/auth/me', { method: 'POST' });
  }

  /** POST /api/auth/logout — revoca la sesión y limpia el token local. */
  async logout(): Promise<void> {
    try {
      await this.client.request<void>('/auth/logout', { method: 'POST' });
    } finally {
      await this.client.storage.clearToken();
    }
  }

  /** Devuelve el id del miembro asociado al token actual sin consultar el server. */
  async hasSession(): Promise<boolean> {
    const token = await this.client.storage.getToken();
    return Boolean(token);
  }

  /**
   * Pequeño type-guard útil para la app: si el server responde 401, entonces
   * la sesión expiró y conviene mandar al onboarding.
   */
  isUnauthorized(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: unknown }).code === 'UNAUTHORIZED'
    );
  }
}

export type { MemberId };
