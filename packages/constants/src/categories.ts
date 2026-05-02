import type { ExpenseCategorySlug } from '@balancehogar/types';

/**
 * Catálogo cerrado de categorías. Los IDs se asignan al momento de seedearlos
 * en la BD (UUID v7). El cliente las identifica por `slug`, que es estable.
 *
 * Si necesitas un nuevo `slug`, agrégalo aquí y al union en
 * `@balancehogar/types/domain/expense-category` (TypeScript te avisará dónde
 * más se rompe).
 */
export type CategoryDefinition = {
  slug: ExpenseCategorySlug;
  name: string;
  /** Identificador del ícono. La app usa lucide-react-native para resolverlo. */
  icon: string;
  /** Color hex de la categoría. */
  color: string;
};

export const EXPENSE_CATEGORIES: readonly CategoryDefinition[] = [
  { slug: 'services', name: 'Servicios', icon: 'plug-zap', color: '#3B82F6' },
  { slug: 'groceries', name: 'Despensa', icon: 'shopping-cart', color: '#10B981' },
  { slug: 'transport', name: 'Transporte', icon: 'car', color: '#F59E0B' },
  { slug: 'health', name: 'Salud', icon: 'heart-pulse', color: '#EF4444' },
  { slug: 'other', name: 'Otros', icon: 'package', color: '#64748B' },
] as const;

export const EXPENSE_CATEGORY_SLUGS = EXPENSE_CATEGORIES.map((c) => c.slug);
