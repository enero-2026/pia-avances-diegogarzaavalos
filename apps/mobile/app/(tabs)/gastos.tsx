import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import type { ExpenseCategory, ExpenseWithRelations, Member } from '@balancehogar/types';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  PressableScale,
  Screen,
  Skeleton,
  Stack,
  Text,
} from '../../src/components/ui';
import { ExpenseRow } from '../../src/components/expenses/ExpenseRow';
import { useSession } from '../../src/providers/SessionProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { currentYearMonth, formatYearMonth } from '../../src/lib/format';

type Filters = {
  categorySlug: ExpenseCategory['slug'] | null;
  paidById: string | null;
  month: string | null;
};

export default function GastosScreen() {
  const { state, api } = useSession();
  const router = useRouter();
  const t = useTheme();

  const [filters, setFilters] = useState<Filters>({
    categorySlug: null,
    paidById: null,
    month: currentYearMonth(),
  });
  const [expenses, setExpenses] = useState<ExpenseWithRelations[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (mode: 'load' | 'refresh' = 'load') => {
      if (mode === 'refresh') setRefreshing(true);
      try {
        const [list, cats] = await Promise.all([
          api.expenses.list({
            page: 1,
            pageSize: 50,
            categorySlug: filters.categorySlug ?? undefined,
            paidById: filters.paidById ?? undefined,
            month: filters.month ?? undefined,
            includeRelations: true,
          }),
          api.expenseCategories.list(),
        ]);
        setExpenses(list.data);
        setCategories(cats);
      } catch {
        /* SessionProvider maneja UNAUTHORIZED */
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [api, filters.categorySlug, filters.paidById, filters.month],
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const activeMembers = useMemo(() => state.members.filter((m) => !m.deletedAt), [state.members]);

  const monthLabel = useMemo(
    () => (filters.month ? formatYearMonth(filters.month) : 'Todo'),
    [filters.month],
  );

  return (
    <Screen
      scroll={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => load('refresh')}
          tintColor={t.colors.accent.base}
        />
      }
    >
      <Animated.View entering={FadeIn.duration(180)}>
        <Stack direction="row" justify="space-between" align="flex-end">
          <View>
            <Text variant="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Gastos
            </Text>
            <Text variant="hero" style={{ marginTop: 2, textTransform: 'capitalize' }}>
              {monthLabel}
            </Text>
          </View>
          <PressableScale
            haptic="light"
            onPress={() => router.push('/modal/agregar-gasto')}
            style={{
              backgroundColor: t.colors.accent.base,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: t.radius.full,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text variant="button" style={{ color: '#FFFFFF' }}>
              Nuevo
            </Text>
          </PressableScale>
        </Stack>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).springify()}>
        <Stack gap="sm">
          <FilterChipsRow
            label="Categoría"
            options={[
              { id: 'all', label: 'Todas', selected: filters.categorySlug === null },
              ...categories.map((c) => ({
                id: c.slug,
                label: c.name,
                color: c.color,
                selected: filters.categorySlug === c.slug,
              })),
            ]}
            onSelect={(id) =>
              setFilters((f) => ({ ...f, categorySlug: id === 'all' ? null : (id as ExpenseCategory['slug']) }))
            }
          />
          <FilterChipsRow
            label="Pagado por"
            options={[
              { id: 'all', label: 'Todos', selected: filters.paidById === null },
              ...activeMembers.map((m) => ({
                id: m.id as unknown as string,
                label: m.name.split(' ')[0] ?? m.name,
                color: m.color,
                selected: filters.paidById === (m.id as unknown as string),
                avatar: m,
              })),
            ]}
            onSelect={(id) =>
              setFilters((f) => ({ ...f, paidById: id === 'all' ? null : id }))
            }
          />
        </Stack>
      </Animated.View>

      <View style={{ flex: 1, marginTop: t.spacing.sm }}>
        {loading ? (
          <Stack gap="sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={70} radius={t.radius.lg} />
            ))}
          </Stack>
        ) : expenses.length === 0 ? (
          <Card variant="muted" style={{ marginTop: t.spacing.lg }}>
            <EmptyState
              icon="search-outline"
              title="Sin coincidencias"
              description="Ajusta los filtros o registra el primer gasto del mes."
              action={
                <Button
                  label="Registrar gasto"
                  iconLeft="add"
                  onPress={() => router.push('/modal/agregar-gasto')}
                />
              }
            />
          </Card>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id as unknown as string}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingBottom: t.spacing['3xl'] }}
            renderItem={({ item }) => (
              <ExpenseRow
                expense={item}
                onPress={() => router.push(`/expense/${item.id as unknown as string}`)}
              />
            )}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => load('refresh')}
                tintColor={t.colors.accent.base}
              />
            }
          />
        )}
      </View>
    </Screen>
  );
}

type ChipOption = {
  id: string;
  label: string;
  color?: string;
  selected?: boolean;
  avatar?: Member;
};

function FilterChipsRow({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: ChipOption[];
  onSelect: (id: string) => void;
}) {
  const t = useTheme();
  return (
    <View>
      <Text variant="caption" tone="muted" style={{ marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {options.map((opt) => {
          const selected = opt.selected;
          const color = opt.color ?? t.colors.accent.base;
          return (
            <PressableScale
              key={opt.id}
              onPress={() => onSelect(opt.id)}
              haptic="light"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: t.radius.full,
                backgroundColor: selected ? `${color}1F` : t.colors.background.surface,
                borderWidth: 1,
                borderColor: selected ? color : t.colors.border.subtle,
              }}
            >
              {opt.avatar ? (
                <Avatar name={opt.avatar.name} color={opt.avatar.color} size={20} />
              ) : opt.color ? (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: opt.color,
                  }}
                />
              ) : null}
              <Text
                variant="bodySm"
                style={{
                  color: selected ? color : t.colors.text.secondary,
                  fontWeight: selected ? '700' : '500',
                }}
              >
                {opt.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

// Forzamos al type checker a aceptar Badge cuando se importa por export-only
void Badge;
