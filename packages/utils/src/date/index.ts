import { RECURRENCE_BY_FREQUENCY } from '@balancehogar/constants';
import type { ISODate, ISODateTime, RecurrenceFrequency } from '@balancehogar/types';

/**
 * Devuelve la fecha actual en ISO (con offset). Aceptamos un `now` para
 * testabilidad: en producción se usa `new Date()`, en tests se inyecta uno fijo.
 */
export function nowISO(now: Date = new Date()): ISODateTime {
  return now.toISOString();
}

/** Devuelve la fecha actual en formato YYYY-MM-DD (UTC). */
export function todayISODate(now: Date = new Date()): ISODate {
  return now.toISOString().slice(0, 10);
}

/**
 * Suma `monthsToAdd` meses a una fecha ISODate y devuelve el resultado.
 * Resuelve el caso de "31 de enero + 1 mes" tomando el último día válido
 * (28/29 de feb).
 */
export function addMonthsToISODate(date: ISODate, monthsToAdd: number): ISODate {
  const [yStr, mStr, dStr] = date.split('-');
  const y = Number(yStr);
  const m = Number(mStr) - 1;
  const d = Number(dStr);

  const candidate = new Date(Date.UTC(y, m + monthsToAdd, d));
  // Si JS rebasó al siguiente mes (ej: 31 ene + 1 mes = 3 mar), retrocedemos al
  // último día del mes destino.
  const expectedMonth = (m + monthsToAdd) % 12;
  if (candidate.getUTCMonth() !== ((expectedMonth + 12) % 12)) {
    candidate.setUTCDate(0);
  }
  return candidate.toISOString().slice(0, 10);
}

/**
 * Calcula la siguiente fecha de vencimiento de un gasto recurrente a partir
 * de la actual y su frecuencia.
 */
export function nextRecurrenceDate(
  currentDueDate: ISODate,
  frequency: RecurrenceFrequency,
): ISODate {
  const def = RECURRENCE_BY_FREQUENCY[frequency];
  return addMonthsToISODate(currentDueDate, def.monthsToAdd);
}

/**
 * Días entre dos fechas (positivo si `to` > `from`). Si difieren por minutos,
 * se redondea hacia abajo: `daysBetween('2026-01-01', '2026-01-02')` → 1.
 */
export function daysBetween(from: ISODate, to: ISODate): number {
  const a = new Date(`${from}T00:00:00Z`).getTime();
  const b = new Date(`${to}T00:00:00Z`).getTime();
  return Math.floor((b - a) / 86_400_000);
}

/**
 * Devuelve `'YYYY-MM'` (mes ISO) a partir de un ISODate.
 */
export function isoMonth(date: ISODate): string {
  return date.slice(0, 7);
}

/**
 * Filtra fechas dentro del mismo mes ISO. Útil para agrupar gastos del mes.
 */
export function isInMonth(date: ISODate, month: string): boolean {
  return isoMonth(date) === month;
}
