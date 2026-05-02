import type {
  AmountCents,
  Expense,
  ExpenseCategoryId,
  Member,
  MemberId,
} from '@balancehogar/types';
import { sumCents } from '../currency';

/**
 * Reparte una cantidad en centavos entre N miembros equitativamente.
 * Si no divide exacto, los centavos sobrantes se reparten uno a uno entre
 * los primeros miembros (algoritmo "largest remainder").
 *
 * @example splitEqually(10001, 3) → [3334, 3334, 3333]
 */
export function splitEqually(
  amountCents: AmountCents,
  membersCount: number,
): AmountCents[] {
  if (membersCount <= 0) {
    throw new RangeError('splitEqually: membersCount debe ser > 0.');
  }
  const base = Math.floor(amountCents / membersCount);
  const remainder = amountCents - base * membersCount;
  return Array.from({ length: membersCount }, (_, i) =>
    (base + (i < remainder ? 1 : 0)) as AmountCents,
  );
}

/**
 * Reparte una cantidad entre miembros según porcentajes pre-asignados.
 * Asume que la suma de porcentajes es 100 (validado en el schema).
 *
 * Usa "largest remainder" para que la suma de los splits sea exacta hasta el
 * último centavo (sin perder ni ganar dinero por redondeo).
 */
export function splitByPercentages(
  amountCents: AmountCents,
  weights: readonly { memberId: MemberId; percentage: number }[],
): { memberId: MemberId; amountCents: AmountCents }[] {
  if (weights.length === 0) return [];

  const raw = weights.map((w) => ({
    memberId: w.memberId,
    floor: Math.floor((amountCents * w.percentage) / 100),
    fractional: ((amountCents * w.percentage) / 100) % 1,
  }));

  const assigned = sumCents(raw.map((r) => r.floor as AmountCents));
  let remainder = amountCents - assigned;

  const sortedByFractional = [...raw].sort((a, b) => b.fractional - a.fractional);
  for (const r of sortedByFractional) {
    if (remainder <= 0) break;
    r.floor += 1;
    remainder -= 1;
  }

  return raw.map((r) => ({
    memberId: r.memberId,
    amountCents: r.floor as AmountCents,
  }));
}

/**
 * Total acumulado por categoría a partir de una lista de gastos.
 * Devuelve un Map para preservar orden de inserción y permitir lookup O(1).
 */
export function totalsByCategory(
  expenses: readonly Pick<Expense, 'amount' | 'categoryId'>[],
): Map<ExpenseCategoryId, AmountCents> {
  const map = new Map<ExpenseCategoryId, AmountCents>();
  for (const e of expenses) {
    const prev = map.get(e.categoryId) ?? (0 as AmountCents);
    map.set(e.categoryId, (prev + e.amount) as AmountCents);
  }
  return map;
}

/** Total acumulado por miembro pagador. */
export function totalsByPayer(
  expenses: readonly Pick<Expense, 'amount' | 'paidById'>[],
): Map<MemberId, AmountCents> {
  const map = new Map<MemberId, AmountCents>();
  for (const e of expenses) {
    const prev = map.get(e.paidById) ?? (0 as AmountCents);
    map.set(e.paidById, (prev + e.amount) as AmountCents);
  }
  return map;
}

/**
 * Calcula el porcentaje (0-100) de cada categoría sobre el total para una
 * gráfica tipo pie del dashboard.
 */
export function categoryPercentages(
  expenses: readonly Pick<Expense, 'amount' | 'categoryId'>[],
): { categoryId: ExpenseCategoryId; total: AmountCents; percentage: number }[] {
  const totals = totalsByCategory(expenses);
  const grand = sumCents([...totals.values()]);
  if (grand === 0) return [];

  return [...totals.entries()].map(([categoryId, total]) => ({
    categoryId,
    total,
    percentage: (total / grand) * 100,
  }));
}

/** Filtra miembros activos (no soft-deleted). */
export function activeMembers<T extends Pick<Member, 'deletedAt'>>(members: readonly T[]): T[] {
  return members.filter((m) => m.deletedAt === null);
}
