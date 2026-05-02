import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

type Props = {
  label: string;
  tone?: Tone;
  style?: ViewStyle;
};

export function Badge({ label, tone = 'neutral', style }: Props) {
  const t = useTheme();

  const tones: Record<Tone, { bg: string; fg: string }> = {
    neutral: { bg: t.colors.background.muted, fg: t.colors.text.secondary },
    accent: { bg: t.colors.accent.soft, fg: t.colors.accent.onSoft },
    success: { bg: t.colors.success.soft, fg: t.colors.success.onSoft },
    warning: { bg: t.colors.warning.soft, fg: t.colors.warning.onSoft },
    danger: { bg: t.colors.danger.soft, fg: t.colors.danger.onSoft },
    info: { bg: t.colors.info.soft, fg: t.colors.info.onSoft },
  };

  const v = tones[tone];

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          paddingVertical: 4,
          paddingHorizontal: 10,
          borderRadius: t.radius.full,
          backgroundColor: v.bg,
        },
        style,
      ]}
    >
      <Text variant="label" style={{ color: v.fg, textTransform: 'uppercase' }}>
        {label}
      </Text>
    </View>
  );
}
