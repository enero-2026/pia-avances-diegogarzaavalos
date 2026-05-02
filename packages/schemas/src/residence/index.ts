import { z } from 'zod';
import { RESIDENCE_NAME_MAX_LENGTH } from '@balancehogar/constants';

/** PATCH /api/residences/:id — Sólo el owner puede renombrar. */
export const updateResidenceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre de la residencia es obligatorio.')
    .max(RESIDENCE_NAME_MAX_LENGTH, `Máximo ${RESIDENCE_NAME_MAX_LENGTH} caracteres.`),
});

export type UpdateResidenceInput = z.infer<typeof updateResidenceSchema>;
