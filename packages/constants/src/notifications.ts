import type { NotificationType } from '@balancehogar/types';

/**
 * Etiquetas y plantillas de mensajes para cada tipo de notificación. La app
 * las consume al renderizar el feed; el backend también las usa para el push.
 *
 * Las plantillas reciben placeholders `{name}`, `{amount}`, etc. que la capa
 * de rendering reemplaza con datos del payload + relaciones.
 */
export type NotificationTemplate = {
  type: NotificationType;
  /** Título corto, apto para el push y para el listado. */
  titleTemplate: string;
  /** Cuerpo más descriptivo para el detalle de la notificación. */
  bodyTemplate: string;
};

export const NOTIFICATION_TEMPLATES: Readonly<Record<NotificationType, NotificationTemplate>> = {
  'expense.created': {
    type: 'expense.created',
    titleTemplate: 'Nuevo gasto registrado',
    bodyTemplate: '{actor} registró {title} por {amount}',
  },
  'expense.updated': {
    type: 'expense.updated',
    titleTemplate: 'Gasto actualizado',
    bodyTemplate: '{actor} editó el gasto "{title}"',
  },
  'recurring.due_soon': {
    type: 'recurring.due_soon',
    titleTemplate: 'Pago próximo',
    bodyTemplate: 'Se acerca el pago de "{title}" en {daysUntilDue} días',
  },
  'recurring.marked_paid': {
    type: 'recurring.marked_paid',
    titleTemplate: 'Pago realizado',
    bodyTemplate: '{actor} marcó "{title}" como pagado',
  },
  'member.joined': {
    type: 'member.joined',
    titleTemplate: 'Nuevo miembro',
    bodyTemplate: '{actor} se unió a la residencia',
  },
  'member.removed': {
    type: 'member.removed',
    titleTemplate: 'Miembro eliminado',
    bodyTemplate: '{actor} fue eliminado de la residencia',
  },
};
