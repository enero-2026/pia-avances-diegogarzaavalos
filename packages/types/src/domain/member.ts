import type { ISODateTime } from './primitives';
import type { MemberId, ResidenceId } from './ids';

/**
 * Habitante registrado de una residencia. Es la "identidad" funcional dentro
 * del grupo: cada gasto se atribuye a un Member.
 *
 * Sobre el soft delete (`deletedAt`):
 *   El brief especifica que al eliminar a un miembro **no se borren sus gastos
 *   históricos**. Con un soft delete el registro vive para siempre como
 *   referencia de auditoría, pero se filtra de las listas activas de la app.
 *
 * Sobre `percentage`:
 *   Es opcional porque el brief plantea que cada miembro pueda tener un
 *   porcentaje de participación distinto en los gastos (ej. 50/30/20).
 *   `null` = no hay regla, se reparte equitativo.
 */
export type Member = {
  id: MemberId;
  residenceId: ResidenceId;
  name: string;
  email: string | null;
  phone: string | null;
  /** Color hex (`#RRGGBB`) para diferenciarlo visualmente. */
  color: string;
  /** Porcentaje de participación en gastos. `null` = repartir equitativo. */
  percentage: number | null;
  /** True si es quien creó la residencia. Solo el owner puede eliminar miembros. */
  isOwner: boolean;
  joinedAt: ISODateTime;
  /** Soft delete: si está poblado, el miembro fue removido pero sus datos viven. */
  deletedAt: ISODateTime | null;
};
