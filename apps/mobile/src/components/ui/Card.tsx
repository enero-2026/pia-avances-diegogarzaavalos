import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type Props = ViewProps & {
  padding?: number;
  /** Variante visual: 'surface' (con borde sutil) o 'elevated' (con sombra). */
  variant?: 'surface' | 'elevated' | 'muted';
  borderless?: boolean;
};

export function Card({
  style,
  padding,
  variant = 'surface',
  borderless = false,
  children,
  ...rest
}: Props) {
  const t = useTheme();

  const variants = {
    surface: {
      backgroundColor: t.colors.background.surface,
      borderColor: borderless ? 'transparent' : t.colors.border.subtle,
      borderWidth: borderless ? 0 : 1,
      ...t.elevation.none,
    },
    elevated: {
      backgroundColor: t.colors.background.surfaceElevated,
      borderColor: 'transparent',
      borderWidth: 0,
      ...t.elevation.md,
    },
    muted: {
      backgroundColor: t.colors.background.muted,
      borderColor: 'transparent',
      borderWidth: 0,
      ...t.elevation.none,
    },
  } as const;

  return (
    <View
      {...rest}
      style={[
        {
          borderRadius: t.radius.xl,
          padding: padding ?? t.spacing.base,
        },
        variants[variant],
        style,
      ]}
    >
      {children}
    </View>
  );
}
