import type { AmountCents } from '@balancehogar/types';

/**
 * Formatea una cantidad en centavos a string MXN: `10950` → `"$109.50"`.
 *
 * Usa Intl.NumberFormat para respetar locale (`es-MX`). No se prefijan ceros
 * extra ni se trunca: 0 → "$0.00", 1 → "$0.01".
 */
export function formatMXN(amountCents: AmountCents): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

/**
 * Convierte un número decimal de pesos (109.50) a centavos enteros (10950).
 * Redondea con `Math.round` para evitar errores de punto flotante.
 *
 * Lanza si el valor no es finito o resulta en un entero fuera de rango.
 */
export function pesosToCents(pesos: number): AmountCents {
  if (!Number.isFinite(pesos)) {
    throw new RangeError('pesosToCents: el valor no es finito.');
  }
  return Math.round(pesos * 100) as AmountCents;
}

/** Inverso de `pesosToCents`. Útil para alimentar inputs numéricos. */
export function centsToPesos(amountCents: AmountCents): number {
  return amountCents / 100;
}

/**
 * Suma una lista de cantidades en centavos. Devuelve siempre un entero exacto
 * (sin errores de redondeo, ya que sumamos enteros).
 */
export function sumCents(amounts: readonly AmountCents[]): AmountCents {
  let total = 0;
  for (const a of amounts) total += a;
  return total as AmountCents;
}
