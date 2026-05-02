import type { ApiResponse } from '@balancehogar/types';
import { ApiClientError, NetworkError } from './errors';
import { InMemoryTokenStorage, type TokenStorage } from './storage';

export type ApiClientConfig = {
  /** URL base del API (incluyendo `/api` si aplica). Ej: `https://api.balancehogar.app/api`. */
  baseUrl: string;
  /** Storage para el token. Si no se provee, se usa memoria. */
  storage?: TokenStorage;
  /**
   * Hook que se llama cada vez que se recibe `UNAUTHORIZED`.
   * Útil para mandar al user al login y limpiar estado.
   */
  onUnauthorized?: () => void | Promise<void>;
  /** Timeout por request en ms. */
  timeoutMs?: number;
  /** Headers adicionales (ej. version del cliente). */
  defaultHeaders?: Record<string, string>;
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** No envuelve la respuesta en `{ data }`; útil para health checks. */
  raw?: boolean;
  /** Si `true`, no agrega header `Authorization`. */
  skipAuth?: boolean;
  signal?: AbortSignal;
  /** Sobrescribe Content-Type. Para multipart se pasa undefined. */
  headers?: Record<string, string>;
  /** Cuerpo crudo (FormData / Blob). Si está, ignora `body`. */
  rawBody?: BodyInit;
};

/**
 * Cliente HTTP único hacia apps/api.
 *
 * Decisiones:
 *   - Toda llamada pasa por `request()` para centralizar auth y manejo de errores.
 *   - El backend responde `{ data: T }` en éxito y `{ error: { code, message } }` en error.
 *     `request()` desempaca `{ data }` automáticamente para que las resources lean el tipo limpio.
 *   - Token se guarda en `TokenStorage` inyectable (Secure Store en mobile).
 */
export class ApiClient {
  public readonly baseUrl: string;
  public readonly storage: TokenStorage;
  private readonly onUnauthorized?: () => void | Promise<void>;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.storage = config.storage ?? new InMemoryTokenStorage();
    this.onUnauthorized = config.onUnauthorized;
    this.timeoutMs = config.timeoutMs ?? 20000;
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  /** Ejecuta una request y devuelve `T` ya desempaquetado de `{ data }`. */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path, options.query);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...this.defaultHeaders,
      ...(options.headers ?? {}),
    };

    if (!options.rawBody && options.body !== undefined && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (!options.skipAuth) {
      const token = await this.storage.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
    const externalSignal = options.signal;
    if (externalSignal) {
      if (externalSignal.aborted) controller.abort();
      else externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: options.method ?? 'GET',
        headers,
        body: options.rawBody ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('Tiempo de espera agotado', error);
      }
      throw new NetworkError('No se pudo conectar al servidor', error);
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    let parsed: unknown;
    try {
      parsed = text.length > 0 ? JSON.parse(text) : undefined;
    } catch {
      parsed = text;
    }

    if (!response.ok) {
      const apiError = ApiClientError.fromResponse(response.status, parsed);
      if (apiError.code === 'UNAUTHORIZED') {
        await this.storage.clearToken();
        if (this.onUnauthorized) await this.onUnauthorized();
      }
      throw apiError;
    }

    if (options.raw) return parsed as T;

    return (parsed as ApiResponse<T>).data;
  }

  /** Construye URL absoluta con query string. */
  private buildUrl(path: string, query?: RequestOptions['query']): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const base = `${this.baseUrl}${cleanPath}`;
    if (!query) return base;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      params.append(key, String(value));
    }
    const qs = params.toString();
    return qs.length > 0 ? `${base}?${qs}` : base;
  }
}
