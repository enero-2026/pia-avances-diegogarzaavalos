import { z } from 'zod';

/**
 * ISO 8601 con hora y timezone. Ej: `2026-05-02T18:30:00.000Z`.
 * Usa el built-in `datetime()` de Zod.
 */
export const zISODateTime = z.string().datetime({
  offset: true,
  message: 'Debe ser una fecha ISO 8601 con timezone.',
});

/**
 * Fecha sin hora. Ej: `2026-05-02`. El built-in `.date()` de Zod 3.23+ valida YYYY-MM-DD.
 */
export const zISODate = z.string().date('Debe tener formato YYYY-MM-DD.');
