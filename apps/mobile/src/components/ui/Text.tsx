import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { typography } from '../../theme/tokens';

type Variant = keyof typeof typography;
type Tone = 'primary' | 'secondary' | 'muted' | 'inverse' | 'accent' | 'success' | 'warning' | 'danger';

type Props = RNTextProps & {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
};

export function Text({
  variant = 'body',
  tone = 'primary',
  align,
  weight,
  style,
  ...rest
}: Props) {
  const t = useTheme();

  const tones: Record<Tone, string> = {
    primary: t.colors.text.primary,
    secondary: t.colors.text.secondary,
    muted: t.colors.text.muted,
    inverse: t.colors.text.inverse,
    accent: t.colors.accent.base,
    success: t.colors.success.base,
    warning: t.colors.warning.base,
    danger: t.colors.danger.base,
  };

  return (
    <RNText
      {...rest}
      style={[
        t.typography[variant],
        {
          color: tones[tone],
          textAlign: align,
        },
        weight !== undefined && { fontWeight: weight },
        style,
      ]}
    />
  );
}
