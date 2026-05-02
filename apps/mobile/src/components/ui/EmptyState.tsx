import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

type Props = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon = 'sparkles-outline', title, description, action }: Props) {
  const t = useTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        padding: t.spacing.xl,
        gap: t.spacing.md,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: t.colors.accent.soft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={26} color={t.colors.accent.base} />
      </View>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text variant="h3" align="center">
          {title}
        </Text>
        {description ? (
          <Text variant="body" tone="secondary" align="center" style={{ maxWidth: 280 }}>
            {description}
          </Text>
        ) : null}
      </View>
      {action ? <View style={{ marginTop: t.spacing.sm }}>{action}</View> : null}
    </View>
  );
}
