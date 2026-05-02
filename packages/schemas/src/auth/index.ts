import { z } from 'zod';
import {
  INVITE_CODE_LENGTH,
  MEMBER_NAME_MAX_LENGTH,
  RESIDENCE_NAME_MAX_LENGTH,
} from '@balancehogar/constants';

/**
 * Auth sin password (decisión de arquitectura): el creador genera la residencia
 * y obtiene un token; otros se unen con el invite code y reciben su propio token.
 */

const zMemberName = z
  .string()
  .trim()
  .min(1, 'El nombre es obligatorio.')
  .max(MEMBER_NAME_MAX_LENGTH, `Máximo ${MEMBER_NAME_MAX_LENGTH} caracteres.`);

const zEmail = z.string().email('Correo inválido.').optional();

const zPhone = z
  .string()
  .regex(/^\+?\d{7,15}$/, 'Teléfono inválido.')
  .optional();

/** POST /api/auth/residences — Crear residencia y al owner como primer miembro. */
export const createResidenceSchema = z.object({
  residenceName: z
    .string()
    .trim()
    .min(1, 'El nombre de la residencia es obligatorio.')
    .max(
      RESIDENCE_NAME_MAX_LENGTH,
      `Máximo ${RESIDENCE_NAME_MAX_LENGTH} caracteres.`,
    ),
  ownerName: zMemberName,
  ownerEmail: zEmail,
  ownerPhone: zPhone,
});

export type CreateResidenceInput = z.infer<typeof createResidenceSchema>;

/** POST /api/auth/join — Unirse a una residencia existente con invite code. */
export const joinResidenceSchema = z.object({
  inviteCode: z
    .string()
    .trim()
    .toUpperCase()
    .length(INVITE_CODE_LENGTH, `El código debe tener ${INVITE_CODE_LENGTH} caracteres.`),
  memberName: zMemberName,
  memberEmail: zEmail,
  memberPhone: zPhone,
});

export type JoinResidenceInput = z.infer<typeof joinResidenceSchema>;
