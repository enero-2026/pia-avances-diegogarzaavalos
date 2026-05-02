import type { ExpenseCategorySlug } from '@balancehogar/types';

const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string): Intl.NumberFormat {
  const key = `es-MX_${currency}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
    formatters.set(key, f);
  }
  return f;
}

/** Convierte cents (entero) a string formateado: 12500 → "$125". */
export function formatCents(cents: number, currency: string = 'MXN'): string {
  return getFormatter(currency).format(cents / 100);
}

/** Versión compacta (sin centavos). */
export function formatCentsRound(cents: number, currency: string = 'MXN'): string {
  return getFormatter(currency)
    .format(Math.round(cents / 100))
    .replace(/\D00$/, '');
}

const monthFmt = new Intl.DateTimeFormat('es-MX', {
  month: 'short',
  day: 'numeric',
});

const fullDateFmt = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDateShort(iso: string): string {
  return monthFmt.format(new Date(iso));
}

export function formatDateLong(iso: string): string {
  return fullDateFmt.format(new Date(iso));
}

/** Formatea YYYY-MM en algo human (ej: "noviembre 2026"). */
export function formatYearMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split('-').map((n) => parseInt(n, 10));
  if (!year || !month) return yyyymm;
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(date);
}

/** Devuelve el `YYYY-MM` actual en hora local. */
export function currentYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Mapea slug de categoría a un emoji para layouts en los que un icon vector queda raro. */
export function categoryEmoji(slug: ExpenseCategorySlug): string {
  switch (slug) {
    case 'services':
      return '⚡️';
    case 'groceries':
      return '🛒';
    case 'transport':
      return '🚗';
    case 'health':
      return '❤️';
    case 'other':
    default:
      return '📦';
  }
}

/** Mapeo a Ionicons (los que ya tenemos en `@expo/vector-icons`). */
export function categoryIonicon(slug: ExpenseCategorySlug): string {
  switch (slug) {
    case 'services':
      return 'flash';
    case 'groceries':
      return 'cart';
    case 'transport':
      return 'car';
    case 'health':
      return 'medkit';
    case 'other':
    default:
      return 'pricetag';
  }
}

/** Formato de tiempo relativo: "hace 3 días" / "hoy" / "mañana". */
export function relativeDay(iso: string): string {
  const target = new Date(iso);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - now.getTime()) / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';
  if (diffDays > 0 && diffDays <= 7) return `En ${diffDays} días`;
  if (diffDays < 0 && diffDays >= -7) return `Hace ${-diffDays} días`;
  return formatDateShort(iso);
}
