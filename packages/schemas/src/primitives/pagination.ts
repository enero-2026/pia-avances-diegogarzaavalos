import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@balancehogar/constants';

/**
 * Parámetros de paginación cursor-less. Para datasets pequeños del MVP es suficiente;
 * cuando crezca, se puede migrar a cursor sin romper el contrato externo.
 */
export const zPaginationParams = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export type PaginationParams = z.infer<typeof zPaginationParams>;
