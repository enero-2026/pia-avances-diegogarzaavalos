import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, View } from 'react-native';
import type { ExpenseWithRelations } from '@balancehogar/types';
import { ApiClientError } from '@balancehogar/api-client';
import {
  Avatar,
  Badge,
  Button,
  Card,
  PressableScale,
  Screen,
  Skeleton,
  Stack,
  Text,
} from '../../src/components/ui';
import { useSession } from '../../src/providers/SessionProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import {
  categoryIonicon,
  formatCents,
  formatDateLong,
} from '../../src/lib/format';

export default function ExpenseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { api } = useSession();
  const t = useTheme();

  const [expense, setExpense] = useState<ExpenseWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.expenses.get(id);
      setExpense(data);
    } catch {
      /* lo manejamos abajo */
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = () => {
    if (!expense) return;
    Alert.alert('Eliminar gasto', '¿Borrar este gasto definitivamente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.expenses.delete(expense.id as unknown as string);
            router.back();
          } catch (err) {
            Alert.alert(
              'Error',
              err instanceof ApiClientError ? err.message : 'No se pudo eliminar el gasto.',
            );
          }
        },
      },
    ]);
  };

  return (
    <Screen background="app">
      <Stack gap="lg">
        <PressableScale
          onPress={() => router.back()}
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 6,
            paddingHorizontal: 4,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={t.colors.text.secondary} />
          <Text variant="body" tone="secondary">
            Volver
          </Text>
        </PressableScale>

        {loading || !expense ? (
          <Stack gap="md">
            <Skeleton height={140} radius={t.radius.xl} />
            <Skeleton height={70} radius={t.radius.lg} />
            <Skeleton height={70} radius={t.radius.lg} />
          </Stack>
        ) : (
          <>
            <Card variant="elevated" padding={24}>
              <Stack gap="md" align="center">
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    backgroundColor: `${expense.category.color ?? t.colors.accent.base}1F`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={
                      categoryIonicon(expense.category.slug) as React.ComponentProps<
                        typeof Ionicons
                      >['name']
                    }
                    size={26}
                    color={expense.category.color ?? t.colors.accent.base}
                  />
                </View>
                <Text variant="display" align="center">
                  {formatCents(expense.amount, expense.currency)}
                </Text>
                <Text variant="h2" align="center">
                  {expense.title}
                </Text>
                <Stack direction="row" gap="sm">
                  <Badge label={expense.category.name} tone="accent" />
                  <Badge label={formatDateLong(expense.date)} tone="neutral" />
                </Stack>
              </Stack>
            </Card>

            <Card variant="surface" padding={16}>
              <Stack gap="md">
                <DetailRow label="Pagado por">
                  <Stack direction="row" align="center" gap="sm">
                    <Avatar name={expense.paidBy.name} color={expense.paidBy.color} size={28} />
                    <Text variant="body">{expense.paidBy.name}</Text>
                  </Stack>
                </DetailRow>
                <DetailRow label="Registrado por">
                  <Text variant="body">{expense.recordedBy.name}</Text>
                </DetailRow>
                {expense.description ? (
                  <DetailRow label="Notas">
                    <Text variant="body" tone="secondary">
                      {expense.description}
                    </Text>
                  </DetailRow>
                ) : null}
              </Stack>
            </Card>

            {expense.attachments.length > 0 ? (
              <Card variant="surface" padding={16}>
                <Stack gap="sm">
                  <Text variant="h3">Comprobantes</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {expense.attachments.map((att) => (
                      <Image
                        key={att.id as unknown as string}
                        source={{ uri: api.attachments.fileUrl(att.id as unknown as string) }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: t.radius.md,
                          backgroundColor: t.colors.background.muted,
                        }}
                      />
                    ))}
                  </View>
                </Stack>
              </Card>
            ) : null}

            <Button
              label="Eliminar gasto"
              variant="danger"
              iconLeft="trash-outline"
              fullWidth
              onPress={handleDelete}
            />
          </>
        )}
      </Stack>
    </Screen>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <Text variant="bodySm" tone="muted" style={{ paddingTop: 2 }}>
        {label}
      </Text>
      <View style={{ alignItems: 'flex-end', flexShrink: 1 }}>{children}</View>
    </View>
  );
}
