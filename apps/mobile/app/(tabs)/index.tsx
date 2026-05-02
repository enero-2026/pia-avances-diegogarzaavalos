import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import type { DashboardSummary } from '@balancehogar/types';
import { Badge, Button, Card, EmptyState, Screen, Skeleton, Stack, Text } from '../../src/components/ui';
import { CategoryDonut } from '../../src/components/dashboard/CategoryDonut';
import { StatChip } from '../../src/components/dashboard/StatChip';
import { ExpenseRow } from '../../src/components/expenses/ExpenseRow';
import { useSession } from '../../src/providers/SessionProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { categoryIonicon, currentYearMonth, formatCents, formatYearMonth, relativeDay } from '../../src/lib/format';

export default function InicioScreen() {
  const { state, api } = useSession();
  const router = useRouter();
  const t = useTheme();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const month = currentYearMonth();

  const load = useCallback(
    async (mode: 'load' | 'refresh' = 'load') => {
      if (mode === 'refresh') setRefreshing(true);
      try {
        const data = await api.dashboard.getSummary({ month });
        setSummary(data);
      } catch {
        /* el SessionProvider ya maneja UNAUTHORIZED */
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [api, month],
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const memberName = state.member?.name ?? '';

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => load('refresh')}
          tintColor={t.colors.accent.base}
        />
      }
    >
      <Animated.View entering={FadeIn.duration(180)}>
        <Stack direction="row" align="flex-end" justify="space-between">
          <View style={{ flex: 1 }}>
            <Text variant="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {state.residence?.name ?? '—'}
            </Text>
            <Text variant="hero" style={{ marginTop: 2 }}>
              Hola, {memberName.split(' ')[0] ?? 'tú'}
            </Text>
            <Text variant="body" tone="secondary" style={{ marginTop: 2, textTransform: 'capitalize' }}>
              {formatYearMonth(month)}
            </Text>
          </View>
          <Badge label={memberName ? 'Activo' : '...'} tone="accent" />
        </Stack>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).springify()}>
        <Card variant="elevated" padding={20}>
          <Stack gap="lg" align="center">
            {loading || !summary ? (
              <Skeleton width={180} height={180} radius={90} />
            ) : (
              <CategoryDonut
                slices={summary.byCategory.map((c, i) => ({
                  label: c.category.name,
                  value: c.totalCents,
                  color: c.category.color ?? t.colors.chart[i % t.colors.chart.length]!,
                }))}
                totalCents={summary.totalSpentCents}
                currency={summary.byCategory[0]?.category ? 'MXN' : 'MXN'}
              />
            )}

            <Stack direction="row" gap="md" wrap style={{ justifyContent: 'center' }}>
              {(loading || !summary
                ? Array.from({ length: 4 }, (_, i) => ({ key: i }))
                : summary.byCategory.slice(0, 6)
              ).map((entry, i) => {
                if ('key' in entry) {
                  return <Skeleton key={i} width={84} height={20} radius={6} />;
                }
                return (
                  <View
                    key={entry.category.id as unknown as string}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor:
                          entry.category.color ?? t.colors.chart[i % t.colors.chart.length],
                      }}
                    />
                    <Text variant="bodySm" tone="secondary">
                      {entry.category.name} · {Math.round(entry.percentage)}%
                    </Text>
                  </View>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(140).springify()}>
        <Stack direction="row" gap="md">
          <StatChip
            icon="people-outline"
            label="Miembros"
            value={String(state.members.filter((m) => !m.deletedAt).length || '—')}
          />
          <StatChip
            icon="receipt-outline"
            label="Gastos del mes"
            value={String(summary?.byMember.reduce((acc, b) => acc + b.expenseCount, 0) ?? '—')}
          />
        </Stack>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <SectionHeader
          title="Próximos vencimientos"
          actionLabel="Ver todos"
          onAction={() => router.push('/(tabs)/gastos')}
        />
        {loading || !summary ? (
          <Stack gap="sm">
            <Skeleton height={66} radius={t.radius.lg} />
            <Skeleton height={66} radius={t.radius.lg} />
          </Stack>
        ) : summary.upcomingRecurring.length === 0 ? (
          <Card variant="muted">
            <EmptyState
              icon="checkmark-circle-outline"
              title="Sin vencimientos cercanos"
              description="Todos los recurrentes están al día. Buen trabajo."
            />
          </Card>
        ) : (
          <Stack gap="sm">
            {summary.upcomingRecurring.slice(0, 3).map((rec) => (
              <Card key={rec.id} variant="surface" padding={14}>
                <Stack direction="row" align="center" gap="md">
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: `${rec.category.color ?? t.colors.accent.base}1F`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name={
                        categoryIonicon(rec.category.slug) as React.ComponentProps<
                          typeof Ionicons
                        >['name']
                      }
                      size={18}
                      color={rec.category.color ?? t.colors.accent.base}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyLg">{rec.title}</Text>
                    <Text variant="bodySm" tone="muted">
                      {relativeDay(rec.nextDueDate)} · {formatCents(rec.amount, rec.currency)}
                    </Text>
                  </View>
                  <Badge
                    label={isDueSoon(rec.nextDueDate) ? 'Pronto' : 'Programado'}
                    tone={isDueSoon(rec.nextDueDate) ? 'warning' : 'neutral'}
                  />
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(260).springify()}>
        <SectionHeader
          title="Últimos gastos"
          actionLabel="Ver todos"
          onAction={() => router.push('/(tabs)/gastos')}
        />
        {loading || !summary ? (
          <Stack gap="sm">
            <Skeleton height={70} radius={t.radius.lg} />
            <Skeleton height={70} radius={t.radius.lg} />
            <Skeleton height={70} radius={t.radius.lg} />
          </Stack>
        ) : summary.latestExpenses.length === 0 ? (
          <Card variant="muted">
            <EmptyState
              icon="add-circle-outline"
              title="Aún no hay gastos"
              description="Registra el primer gasto del mes para empezar a ver tu balance."
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
          <Stack gap="sm">
            {summary.latestExpenses.slice(0, 5).map((expense) => (
              <ExpenseRow
                key={expense.id as unknown as string}
                expense={expense}
                onPress={() => router.push(`/expense/${expense.id as unknown as string}`)}
              />
            ))}
          </Stack>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(320).springify()}>
        <Button
          label="Registrar nuevo gasto"
          iconLeft="add"
          size="lg"
          fullWidth
          onPress={() => router.push('/modal/agregar-gasto')}
        />
      </Animated.View>
    </Screen>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginTop: 4,
      }}
    >
      <Text variant="h2">{title}</Text>
      {actionLabel ? (
        <Text
          variant="body"
          tone="accent"
          onPress={onAction}
          style={{ paddingVertical: 4, paddingHorizontal: 4 }}
        >
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

function isDueSoon(iso: string): boolean {
  const target = new Date(iso);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = (target.getTime() - now.getTime()) / 86400000;
  return diff <= 3;
}
