/**
 * Forma estandarizada de errores del API. Inspirada en RFC 9457
 * (Problem Details) pero simplificada.
 *
 * - `code` es un identificador estable que el cliente puede pattern-matchear.
 * - `message` es para humanos (puede localizarse en el cliente).
 * - `details` es opcional y se usa para errores de validación con la lista
 *   exacta de campos que fallaron.
 */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'INTERNAL_ERROR';

export type ApiValidationIssue = {
  path: (string | number)[];
  message: string;
};

export type ApiError = {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: ApiValidationIssue[];
  };
};
