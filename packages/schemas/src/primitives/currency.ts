import { z } from 'zod';
import {
  EXPENSE_AMOUNT_MAX_CENTS,
  EXPENSE_AMOUNT_MIN_CENTS,
} from '@balancehogar/constants';

/**
 * Validador de cantidades en centavos. Sólo acepta enteros positivos dentro
 * de los límites del dominio.
 */
export const zAmountCents = z
  .number()
  .int('El monto debe ser un entero (centavos).')
  .min(EXPENSE_AMOUNT_MIN_CENTS, 'El monto debe ser mayor a 0.')
  .max(EXPENSE_AMOUNT_MAX_CENTS, 'El monto excede el máximo permitido.');

export const zCurrencyCode = z.literal('MXN');
