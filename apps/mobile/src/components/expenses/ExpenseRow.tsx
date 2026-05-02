import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ExpenseWithRelations } from '@balancehogar/types';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar, PressableScale, Text } from '../ui';
import { categoryIonicon, formatCents, formatDateShort } from '../../lib/format';

type Props = {
  expense: ExpenseWithRelations;
  onPress?: () => void;
  showDate?: boolean;
};

export function ExpenseRow({ expense, onPress, showDate = true }: Props) {
  const t = useTheme();
  const categoryColor = expense.category.color ?? t.colors.accent.base;

  return (
    <PressableScale
      haptic="light"
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacing.md,
        paddingVertical: t.spacing.md,
        paddingHorizontal: t.spacing.base,
        backgroundColor: t.colors.background.surface,
        borderRadius: t.radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border.subtle,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: `${categoryColor}1F`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={categoryIonicon(expense.category.slug) as React.ComponentProps<typeof Ionicons>['name']}
          size={20}
          color={categoryColor}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text variant="bodyLg" numberOfLines={1}>
          {expense.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Avatar
            name={expense.paidBy.name}
            color={expense.paidBy.color}
            size={16}
            inactive={Boolean(expense.paidBy.deletedAt)}
          />
          <Text variant="bodySm" tone="muted" numberOfLines={1} style={{ flexShrink: 1 }}>
            {expense.paidBy.name}
          </Text>
          {showDate ? (
            <Text variant="bodySm" tone="muted">
              · {formatDateShort(expense.date)}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="h3">{formatCents(expense.amount, expense.currency)}</Text>
      </View>
    </PressableScale>
  );
}
