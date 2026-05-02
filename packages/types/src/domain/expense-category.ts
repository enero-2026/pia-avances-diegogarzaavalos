import type { ExpenseCategoryId } from './ids';

/**
 * Slugs estables de categorías de gasto del brief. Vivimos como union para que
 * TypeScript valide en compile-time que solo se usen estos valores.
 *
 * - `services`   — servicios (luz, agua, internet, gas, streaming…)
 * - `groceries`  — despensa
 * - `transport`  — transporte (gasolina, taxi, peajes…)
 * - `health`     — salud
 * - `other`      — otros
 *
 * Si más adelante se agrega una categoría, se extiende aquí y todo el código
 * que dependa del union se rompe en compile-time (deseable: nos avisa qué actualizar).
 */
export type ExpenseCategorySlug =
  | 'services'
  | 'groceries'
  | 'transport'
  | 'health'
  | 'other';

export type ExpenseCategory = {
  id: ExpenseCategoryId;
  slug: ExpenseCategorySlug;
  /** Nombre legible localizado, ej. "Servicios". */
  name: string;
  /** Identificador del ícono (lo resuelve el cliente, ej. lucide-react-native). */
  icon: string;
  /** Color hex de la categoría. */
  color: string;
};
