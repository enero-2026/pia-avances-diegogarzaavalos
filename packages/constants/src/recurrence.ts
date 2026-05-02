import type { RecurrenceFrequency } from '@balancehogar/types';

/**
 * Metadatos de cada frecuencia: nombre legible y cuántos meses suma para
 * calcular `nextDueDate`.
 */
export type RecurrenceDefinition = {
  frequency: RecurrenceFrequency;
  label: string;
  monthsToAdd: number;
};

export const RECURRENCE_DEFINITIONS: readonly RecurrenceDefinition[] = [
  { frequency: 'monthly', label: 'Mensual', monthsToAdd: 1 },
  { frequency: 'bimonthly', label: 'Bimensual', monthsToAdd: 2 },
  { frequency: 'quarterly', label: 'Trimestral', monthsToAdd: 3 },
  { frequency: 'semiannual', label: 'Semestral', monthsToAdd: 6 },
  { frequency: 'annual', label: 'Anual', monthsToAdd: 12 },
] as const;

export const RECURRENCE_BY_FREQUENCY: Readonly<
  Record<RecurrenceFrequency, RecurrenceDefinition>
> = RECURRENCE_DEFINITIONS.reduce(
  (acc, def) => {
    acc[def.frequency] = def;
    return acc;
  },
  {} as Record<RecurrenceFrequency, RecurrenceDefinition>,
);

/**
 * Días antes de la fecha de vencimiento en los que se considera que un gasto
 * recurrente está "próximo" (genera notificación tipo `recurring.due_soon`).
 */
export const DUE_SOON_THRESHOLD_DAYS = 3;
