import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ApiClientError } from '@balancehogar/api-client';
import {
  Avatar,
  Button,
  Card,
  Input,
  PressableScale,
  Screen,
  Stack,
  Text,
} from '../../src/components/ui';
import { useSession } from '../../src/providers/SessionProvider';
import { memberPalette } from '../../src/theme/tokens';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function EditMemberScreen() {
  const router = useRouter();
  const { state, api, refreshMembers } = useSession();
  const t = useTheme();
  const member = state.member;

  const [name, setName] = useState(member?.name ?? '');
  const [color, setColor] = useState<string>(member?.color ?? memberPalette[0]!);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!member) {
    return (
      <Screen scroll={false} background="app">
        <Text>Cargando…</Text>
      </Screen>
    );
  }

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await api.members.update(member.id as unknown as string, {
        name: name.trim(),
        color,
      });
      await refreshMembers();
      router.back();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'No se pudo guardar.');
    } finally {
      setSubmitting(false);
    }
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

        <View>
          <Text variant="hero" style={{ marginBottom: 6 }}>
            Tu perfil
          </Text>
          <Text variant="bodyLg" tone="secondary">
            Actualiza cómo te ven los demás miembros.
          </Text>
        </View>

        <Card variant="surface" padding={20}>
          <Stack gap="lg">
            <Stack align="center" gap="sm">
              <Avatar name={name || ' '} color={color} size={88} />
            </Stack>

            <Input label="Nombre" value={name} onChangeText={setName} autoCapitalize="words" />

            <View>
              <Text variant="label" tone="secondary" style={{ textTransform: 'uppercase', marginBottom: 8 }}>
                Tu color
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {memberPalette.map((c) => {
                  const selected = c === color;
                  return (
                    <PressableScale
                      key={c}
                      onPress={() => setColor(c)}
                      haptic="light"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: c,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: selected ? 3 : 0,
                        borderColor: t.colors.background.app,
                      }}
                    >
                      {selected ? <Ionicons name="checkmark" size={22} color="#FFFFFF" /> : null}
                    </PressableScale>
                  );
                })}
              </View>
            </View>
          </Stack>
        </Card>

        {error ? (
          <Card variant="surface" padding={14} style={{ borderColor: t.colors.danger.base }}>
            <Stack direction="row" gap="sm" align="center">
              <Ionicons name="alert-circle" size={20} color={t.colors.danger.base} />
              <Text variant="body" tone="danger" style={{ flex: 1 }}>
                {error}
              </Text>
            </Stack>
          </Card>
        ) : null}

        <Button
          label="Guardar cambios"
          iconRight="checkmark"
          size="lg"
          fullWidth
          loading={submitting}
          onPress={handleSubmit}
        />
      </Stack>
    </Screen>
  );
}
