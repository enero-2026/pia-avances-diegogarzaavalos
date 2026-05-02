import type { ISODateTime } from './primitives';
import type { MemberId, ResidenceId } from './ids';

/**
 * Una vivienda / grupo de gastos compartidos.
 *
 * - Lo crea un usuario que se vuelve el `ownerId`.
 * - El `inviteCode` permite a otros unirse mediante la opción "Unirse a residencia".
 * - Solo el owner puede eliminar miembros (regla de negocio del brief).
 */
export type Residence = {
  id: ResidenceId;
  name: string;
  ownerId: MemberId;
  inviteCode: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};
