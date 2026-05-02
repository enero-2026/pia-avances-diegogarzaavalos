/**
 * Paleta de colores usada para asignar a cada miembro de una residencia.
 * Cuando alguien se une, se le asigna el primer color que no esté ocupado.
 *
 * Criterios de la paleta:
 * - Suficientemente distintos entre sí para diferenciar a 8-10 personas.
 * - Buen contraste sobre fondos claro y oscuro.
 * - No incluye solo morados ni solo azules; es una paleta variada.
 */
export const MEMBER_COLORS: readonly string[] = [
  '#EF4444', // rojo
  '#F97316', // naranja
  '#F59E0B', // ámbar
  '#10B981', // verde esmeralda
  '#06B6D4', // cyan
  '#3B82F6', // azul
  '#8B5CF6', // violeta
  '#EC4899', // rosa
  '#14B8A6', // teal
  '#84CC16', // lima
] as const;

/** Color por defecto cuando no se ha asignado ninguno. */
export const DEFAULT_MEMBER_COLOR = '#64748B';
