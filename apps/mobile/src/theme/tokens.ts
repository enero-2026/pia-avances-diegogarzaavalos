/**
 * Tokens del design system de BalanceHogar.
 *
 * Objetivo: que toda la app respire una identidad premium consistente.
 * Cualquier cambio visual de fondo/color/spacing pasa por acá: las pantallas
 * sólo consumen `theme`, nunca colores o números mágicos.
 */

const slate = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617',
} as const;

const blue = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
} as const;

const emerald = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  400: '#34D399',
  500: '#10B981',
  600: '#059669',
  700: '#047857',
} as const;

const amber = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  300: '#FCD34D',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
} as const;

const rose = {
  50: '#FFF1F2',
  100: '#FFE4E6',
  300: '#FDA4AF',
  500: '#F43F5E',
  600: '#E11D48',
  700: '#BE123C',
} as const;

const violet = {
  50: '#F5F3FF',
  100: '#EDE9FE',
  300: '#C4B5FD',
  500: '#8B5CF6',
  600: '#7C3AED',
  700: '#6D28D9',
} as const;

export const palette = { slate, blue, emerald, amber, rose, violet } as const;

/**
 * Paleta para asignar a miembros: 8 acentos vibrantes pero balanceados.
 * Se intenta evitar parejas que choquen visualmente.
 */
export const memberPalette = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#F43F5E', // rose-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#EC4899', // pink-500
  '#84CC16', // lime-500
] as const;

/** Espaciados sobre grilla de 4px (Apple HIG / Material). */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 999,
} as const;

/** Tipografía: jerarquía clara con line-heights premium. */
export const typography = {
  // Display / hero numbers (montos grandes)
  display: { fontSize: 40, lineHeight: 44, fontWeight: '700' as const, letterSpacing: -0.8 },
  hero: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const, letterSpacing: -0.5 },

  // Títulos
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, letterSpacing: -0.4 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const, letterSpacing: -0.2 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const, letterSpacing: -0.1 },

  // Cuerpo
  bodyLg: { fontSize: 17, lineHeight: 24, fontWeight: '500' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '500' as const },
  bodySm: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },

  // Etiquetas / overline
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const, letterSpacing: 0.4 },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '500' as const },

  // Botones
  button: { fontSize: 16, lineHeight: 20, fontWeight: '600' as const, letterSpacing: -0.1 },
} as const;

/** Sombras (elevation) para iOS / Android. */
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 14,
  },
} as const;

/** Curvas de motion estandarizadas. */
export const motion = {
  duration: {
    instant: 100,
    fast: 180,
    base: 250,
    slow: 400,
  },
  spring: {
    soft: { damping: 18, stiffness: 220, mass: 0.7 },
    bouncy: { damping: 14, stiffness: 240, mass: 0.6 },
    snappy: { damping: 22, stiffness: 320, mass: 0.5 },
  },
} as const;

export type Palette = typeof palette;
export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;
