import { z } from 'zod';
import { MEMBER_NAME_MAX_LENGTH } from '@balancehogar/constants';

/**
 * Aceptamos cualquier color hex `#RRGGBB`. La paleta de `MEMBER_COLORS` es
 * sólo una recomendación; la app puede mandar cualquier hex válido.
 */
const zMemberColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hex (#RRGGBB).');

const zPercentage = z
  .number()
  .min(0, 'El porcentaje no puede ser negativo.')
  .max(100, 'El porcentaje no puede superar 100.');

/** PATCH /api/members/:id — Editar color, nombre o porcentaje. */
export const updateMemberSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio.')
      .max(MEMBER_NAME_MAX_LENGTH, `Máximo ${MEMBER_NAME_MAX_LENGTH} caracteres.`)
      .optional(),
    color: zMemberColor.optional(),
    percentage: zPercentage.nullable().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: 'Debe enviar al menos un campo a actualizar.',
  });

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

/**
 * Si la app gestiona porcentajes, validamos que la suma cuadre.
 * El backend recibe el array completo de miembros con sus nuevos porcentajes.
 */
export const updateMemberPercentagesSchema = z
  .object({
    members: z
      .array(
        z.object({
          memberId: z.string().uuid(),
          percentage: zPercentage,
        }),
      )
      .min(1),
  })
  .refine(
    (v) => {
      const total = v.members.reduce((acc, m) => acc + m.percentage, 0);
      return Math.abs(total - 100) < 0.001;
    },
    { message: 'La suma de los porcentajes debe ser 100.' },
  );

export type UpdateMemberPercentagesInput = z.infer<typeof updateMemberPercentagesSchema>;
