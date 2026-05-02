/**
 * Límites del dominio. Se usan tanto en validación (Zod) como en UI.
 */

/** Largo máximo del nombre de una residencia. */
export const RESIDENCE_NAME_MAX_LENGTH = 80;

/** Largo del invite code generado para residencias. */
export const INVITE_CODE_LENGTH = 8;

/** Largo máximo del nombre de un miembro. */
export const MEMBER_NAME_MAX_LENGTH = 60;

/** Cantidad máxima de miembros activos por residencia. */
export const MAX_MEMBERS_PER_RESIDENCE = 20;

/** Largo máximo del título de un gasto. */
export const EXPENSE_TITLE_MAX_LENGTH = 100;

/** Largo máximo de la descripción de un gasto. */
export const EXPENSE_DESCRIPTION_MAX_LENGTH = 500;

/** Cantidad máxima de adjuntos por gasto. */
export const MAX_ATTACHMENTS_PER_EXPENSE = 5;

/** Tamaño máximo de un adjunto en bytes (5 MB). */
export const ATTACHMENT_MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Monto mínimo (1 centavo) y máximo (~10M MXN, 1_000_000_000 cents) de un gasto. */
export const EXPENSE_AMOUNT_MIN_CENTS = 1;
export const EXPENSE_AMOUNT_MAX_CENTS = 1_000_000_000;

/** Tamaño de página por defecto y máximo permitido en endpoints paginados. */
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
