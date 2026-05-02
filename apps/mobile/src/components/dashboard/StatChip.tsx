import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui';

type Props = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  trend?: { delta: string; tone: 'success' | 'danger' | 'neutral' };
  style?: ViewStyle;
};

export function StatChip({ icon, label, value, trend, style }: Props) {
  const t = useTheme();
  const trendTone =
    trend?.tone === 'success'
      ? t.colors.success.base
      : trend?.tone === 'danger'
      ? t.colors.danger.base
      : t.colors.text.muted;

  return (
    <View
      style={[
        {
          flex: 1,
          padding: t.spacing.base,
          backgroundColor: t.colors.background.surface,
          borderRadius: t.radius.lg,
          borderWidth: 1,
          borderColor: t.colors.border.subtle,
          gap: 6,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon ? <Ionicons name={icon} size={14} color={t.colors.text.muted} /> : null}
        <Text variant="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
          {label}
        </Text>
      </View>
      <Text variant="h2">{value}</Text>
      {trend ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons
            name={
              trend.tone === 'success'
                ? 'arrow-down'
                : trend.tone === 'danger'
                ? 'arrow-up'
                : 'remove'
            }
            size={12}
            color={trendTone}
          />
          <Text variant="bodySm" style={{ color: trendTone }}>
            {trend.delta}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
