/**
 * Tema activo (light / dark) que combina los tokens base con asignaciones
 * semánticas. Las pantallas siempre leen `theme.colors.text.primary` en lugar
 * de `palette.slate[900]`, para no acoplarse a un color crudo.
 */
import {
  elevation,
  memberPalette,
  motion,
  palette,
  radius,
  spacing,
  typography,
} from './tokens';

export type ThemeColors = {
  background: {
    app: string;
    surface: string;
    surfaceElevated: string;
    muted: string;
    inverse: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    onAccent: string;
    link: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    inverse: string;
  };
  accent: { base: string; hover: string; soft: string; onSoft: string };
  success: { base: string; soft: string; onSoft: string };
  warning: { base: string; soft: string; onSoft: string };
  danger: { base: string; soft: string; onSoft: string };
  info: { base: string; soft: string; onSoft: string };
  chart: string[];
};

export type Theme = {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  elevation: typeof elevation;
  motion: typeof motion;
  memberPalette: typeof memberPalette;
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: {
      app: palette.slate[50],
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      muted: palette.slate[100],
      inverse: palette.slate[900],
      overlay: 'rgba(15, 23, 42, 0.6)',
    },
    text: {
      primary: palette.slate[900],
      secondary: palette.slate[600],
      muted: palette.slate[500],
      inverse: '#FFFFFF',
      onAccent: '#FFFFFF',
      link: palette.blue[600],
    },
    border: {
      subtle: palette.slate[200],
      default: palette.slate[300],
      strong: palette.slate[400],
      inverse: palette.slate[700],
    },
    accent: {
      base: palette.blue[600],
      hover: palette.blue[700],
      soft: palette.blue[50],
      onSoft: palette.blue[700],
    },
    success: {
      base: palette.emerald[600],
      soft: palette.emerald[50],
      onSoft: palette.emerald[700],
    },
    warning: {
      base: palette.amber[600],
      soft: palette.amber[50],
      onSoft: palette.amber[700],
    },
    danger: {
      base: palette.rose[600],
      soft: palette.rose[50],
      onSoft: palette.rose[700],
    },
    info: {
      base: palette.violet[600],
      soft: palette.violet[50],
      onSoft: palette.violet[700],
    },
    chart: [
      palette.blue[500],
      palette.emerald[500],
      palette.amber[500],
      palette.rose[500],
      palette.violet[500],
      '#06B6D4',
      '#EC4899',
      '#84CC16',
    ],
  },
  spacing,
  radius,
  typography,
  elevation,
  motion,
  memberPalette,
};

export const darkTheme: Theme = {
  ...lightTheme,
  mode: 'dark',
  colors: {
    background: {
      app: palette.slate[950],
      surface: palette.slate[900],
      surfaceElevated: palette.slate[800],
      muted: palette.slate[800],
      inverse: '#FFFFFF',
      overlay: 'rgba(2, 6, 23, 0.75)',
    },
    text: {
      primary: palette.slate[50],
      secondary: palette.slate[300],
      muted: palette.slate[400],
      inverse: palette.slate[900],
      onAccent: '#FFFFFF',
      link: palette.blue[300],
    },
    border: {
      subtle: palette.slate[800],
      default: palette.slate[700],
      strong: palette.slate[600],
      inverse: palette.slate[200],
    },
    accent: {
      base: palette.blue[500],
      hover: palette.blue[400],
      soft: 'rgba(59, 130, 246, 0.15)',
      onSoft: palette.blue[300],
    },
    success: {
      base: palette.emerald[500],
      soft: 'rgba(16, 185, 129, 0.15)',
      onSoft: palette.emerald[400],
    },
    warning: {
      base: palette.amber[500],
      soft: 'rgba(245, 158, 11, 0.15)',
      onSoft: palette.amber[300],
    },
    danger: {
      base: palette.rose[500],
      soft: 'rgba(244, 63, 94, 0.15)',
      onSoft: palette.rose[300],
    },
    info: {
      base: palette.violet[500],
      soft: 'rgba(139, 92, 246, 0.15)',
      onSoft: palette.violet[300],
    },
    chart: lightTheme.colors.chart,
  },
};

export { palette, memberPalette, spacing, radius, typography, elevation, motion } from './tokens';
