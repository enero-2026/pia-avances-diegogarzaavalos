import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { spacing as spacingTokens } from '../../theme/tokens';

type GapKey = keyof typeof spacingTokens;

type Props = ViewProps & {
  direction?: 'row' | 'column';
  gap?: GapKey | number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
};

/**
 * Stack para componer layouts sin pegar a `View` siempre con flexDirection.
 * Permite gap consistente con el design system.
 */
export function Stack({
  direction = 'column',
  gap = 'md',
  align,
  justify,
  wrap,
  style,
  ...rest
}: Props) {
  const t = useTheme();
  const gapValue = typeof gap === 'number' ? gap : t.spacing[gap];

  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: direction,
          gap: gapValue,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : 'nowrap',
        },
        style,
      ]}
    />
  );
}

export function HStack(props: Omit<Props, 'direction'>) {
  return <Stack {...props} direction="row" />;
}

export function VStack(props: Omit<Props, 'direction'>) {
  return <Stack {...props} direction="column" />;
}
