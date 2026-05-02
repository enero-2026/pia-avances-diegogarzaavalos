import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import type { Member } from '@balancehogar/types';
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
import { useSession } from '../../src/providers/SessionProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { formatCents } from '../../src/lib/format';

export default function MiembrosScreen() {
  const { state, api, refreshMembers, refreshResidence, logout } = useSession();
  const router = useRouter();
  const t = useTheme();

  const [memberTotals, setMemberTotals] = useState<Record<string, { totalCents: number; count: number }>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (mode: 'load' | 'refresh' = 'load') => {
      if (mode === 'refresh') setRefreshing(true);
      try {
        const [, , dashboard] = await Promise.all([
          refreshResidence().catch(() => null),
          refreshMembers().catch(() => null),
          api.dashboard.getSummary().catch(() => null),
        ]);
        if (dashboard) {
          const map: Record<string, { totalCents: number; count: number }> = {};
          for (const stat of dashboard.byMember) {
            map[stat.member.id as unknown as string] = {
              totalCents: stat.totalCents,
              count: stat.expenseCount,
            };
          }
          setMemberTotals(map);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [api, refreshMembers, refreshResidence],
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const isOwner = state.member?.isOwner ?? false;
  const activeMembers = state.members.filter((m) => !m.deletedAt);

  const copyInvite = async () => {
    if (!state.residence) return;
    await Clipboard.setStringAsync(state.residence.inviteCode);
    Alert.alert('Listo', 'Código copiado al portapapeles.');
  };

  const handleRegenerate = async () => {
    if (!state.residence) return;
    Alert.alert(
      'Regenerar código',
      'El código actual dejará de funcionar. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Regenerar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.residences.regenerateInvite(state.residence!.id as unknown as string);
              await refreshResidence();
            } catch (err) {
              Alert.alert('Error', 'No se pudo regenerar el código.');
            }
          },
        },
      ],
    );
  };

  const handleRemove = (member: Member) => {
    Alert.alert(
      'Eliminar miembro',
      `${member.name} dejará de aparecer en la app, pero sus gastos históricos se conservan.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.members.softDelete(member.id as unknown as string);
              await refreshMembers();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar al miembro.');
            }
          },
        },
      ],
    );
  };

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
        <View>
          <Text variant="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Hogar
          </Text>
          <Text variant="hero" style={{ marginTop: 2 }}>
            Miembros
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).springify()}>
        <Card variant="elevated" padding={20}>
          <Stack gap="md">
            <Stack direction="row" justify="space-between" align="center">
              <Text variant="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
                Código de invitación
              </Text>
              {isOwner ? (
                <PressableScale onPress={handleRegenerate} haptic="light">
                  <Stack direction="row" align="center" gap="xs">
                    <Ionicons name="refresh" size={14} color={t.colors.accent.base} />
                    <Text variant="bodySm" tone="accent">
                      Regenerar
                    </Text>
                  </Stack>
                </PressableScale>
              ) : null}
            </Stack>

            <PressableScale
              onPress={copyInvite}
              haptic="medium"
              style={{
                paddingVertical: 16,
                borderRadius: t.radius.lg,
                backgroundColor: t.colors.accent.soft,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: '800',
                  letterSpacing: 6,
                  color: t.colors.accent.onSoft,
                  textAlign: 'center',
                }}
              >
                {state.residence?.inviteCode ?? '——————'}
              </Text>
              <Stack direction="row" align="center" gap="xs" style={{ marginTop: 6 }}>
                <Ionicons name="copy-outline" size={14} color={t.colors.accent.onSoft} />
                <Text variant="bodySm" tone="accent">
                  Tocar para copiar
                </Text>
              </Stack>
            </PressableScale>
          </Stack>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(140).springify()}>
        <View style={{ marginBottom: 8, marginTop: 4 }}>
          <Text variant="h2">En el hogar</Text>
        </View>

        {loading && activeMembers.length === 0 ? (
          <Stack gap="sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={70} radius={t.radius.lg} />
            ))}
          </Stack>
        ) : activeMembers.length === 0 ? (
          <Card variant="muted">
            <EmptyState
              icon="person-add-outline"
              title="Aún estás solo"
              description="Comparte el código de invitación con quien viva contigo para que se sumen."
            />
          </Card>
        ) : (
          <Stack gap="sm">
            {activeMembers.map((member) => {
              const totals = memberTotals[member.id as unknown as string];
              const showRemove = isOwner && member.id !== state.member?.id && !member.isOwner;
              return (
                <Card key={member.id as unknown as string} variant="surface" padding={14}>
                  <Stack direction="row" align="center" gap="md">
                    <Avatar name={member.name} color={member.color} size={44} />
                    <View style={{ flex: 1 }}>
                      <Stack direction="row" align="center" gap="xs">
                        <Text variant="bodyLg" style={{ flexShrink: 1 }}>
                          {member.name}
                          {member.id === state.member?.id ? ' (tú)' : ''}
                        </Text>
                        {member.isOwner ? <Badge label="Owner" tone="accent" /> : null}
                      </Stack>
                      <Text variant="bodySm" tone="muted">
                        {totals
                          ? `${formatCents(totals.totalCents)} este mes · ${totals.count} gastos`
                          : 'Sin gastos este mes'}
                      </Text>
                    </View>
                    {showRemove ? (
                      <PressableScale
                        haptic="medium"
                        onPress={() => handleRemove(member)}
                        style={{
                          padding: 8,
                          borderRadius: 999,
                          backgroundColor: t.colors.danger.soft,
                        }}
                      >
                        <Ionicons name="close" size={16} color={t.colors.danger.base} />
                      </PressableScale>
                    ) : null}
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Stack gap="sm">
          <Button
            label="Editar mi perfil"
            variant="secondary"
            iconLeft="person-outline"
            fullWidth
            onPress={() => router.push('/member/edit')}
          />
          <Button
            label="Cerrar sesión"
            variant="ghost"
            iconLeft="log-out-outline"
            fullWidth
            onPress={() => {
              Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Salir', style: 'destructive', onPress: () => logout() },
              ]);
            }}
          />
        </Stack>
      </Animated.View>
    </Screen>
  );
}
