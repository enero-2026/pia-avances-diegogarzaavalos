import type { ApiError, ApiErrorCode, ApiValidationIssue } from '@balancehogar/types';

/**
 * Error normalizado del API. El cliente lo lanza ante cualquier respuesta
 * !2xx. Permite hacer `instanceof ApiClientError` y leer `code` para reaccionar
 * (ej: si `UNAUTHORIZED`, mandar a login).
 */
export class ApiClientError extends Error {
  public readonly code: ApiErrorCode;
  public readonly status: number;
  public readonly details?: ApiValidationIssue[];

  constructor(params: {
    code: ApiErrorCode;
    message: string;
    status: number;
    details?: ApiValidationIssue[];
  }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
  }

  static fromResponse(status: number, body: unknown): ApiClientError {
    const apiError = body as Partial<ApiError>;
    if (apiError && apiError.error && typeof apiError.error.code === 'string') {
      return new ApiClientError({
        code: apiError.error.code,
        message: apiError.error.message ?? 'Error desconocido',
        status,
        details: apiError.error.details,
      });
    }

    let fallbackCode: ApiErrorCode = 'INTERNAL_ERROR';
    if (status === 401) fallbackCode = 'UNAUTHORIZED';
    else if (status === 403) fallbackCode = 'FORBIDDEN';
    else if (status === 404) fallbackCode = 'NOT_FOUND';
    else if (status === 409) fallbackCode = 'CONFLICT';
    else if (status === 413) fallbackCode = 'PAYLOAD_TOO_LARGE';
    else if (status === 415) fallbackCode = 'UNSUPPORTED_MEDIA_TYPE';
    else if (status >= 400 && status < 500) fallbackCode = 'VALIDATION_ERROR';

    return new ApiClientError({
      code: fallbackCode,
      message:
        typeof body === 'string' && body.length > 0 ? body : `HTTP ${status}: ${defaultMessage(status)}`,
      status,
    });
  }
}

/** Error de red (sin respuesta del servidor). */
export class NetworkError extends Error {
  public readonly originalCause?: unknown;
  constructor(message: string, originalCause?: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.originalCause = originalCause;
  }
}

function defaultMessage(status: number): string {
  if (status >= 500) return 'Error del servidor';
  if (status >= 400) return 'Solicitud inválida';
  return 'Respuesta inesperada';
}
