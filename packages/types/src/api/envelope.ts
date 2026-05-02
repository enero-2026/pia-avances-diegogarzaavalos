/**
 * Envelope de respuesta común. Todas las respuestas exitosas del API llegan
 * dentro de `{ data }`; los errores tienen su propia forma (ver errors.ts).
 *
 * Ventaja: cuando agregamos metadatos (timing, versión), no rompemos el contrato.
 */
export type ApiResponse<T> = {
  data: T;
};

/** Forma de respuesta paginada. */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};
