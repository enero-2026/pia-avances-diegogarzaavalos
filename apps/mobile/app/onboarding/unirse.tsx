import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ApiClientError } from '@balancehogar/api-client';
import { joinResidenceSchema } from '@balancehogar/schemas';
import { Button, Card, Input, PressableScale, Screen, Stack, Text } from '../../src/components/ui';
import { useSession } from '../../src/providers/SessionProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function UnirseResidencia() {
  const router = useRouter();
  const { api, setAuth } = useSession();
  const t = useTheme();

  const [inviteCode, setInviteCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});

    const parsed = joinResidenceSchema.safeParse({
      inviteCode: inviteCode.trim().toUpperCase(),
      memberName,
      memberEmail: memberEmail.trim() === '' ? undefined : memberEmail.trim(),
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === 'string') fe[path] = issue.message;
      }
      setFieldErrors(fe);
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.auth.join(parsed.data);
      setAuth(result);
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.code === 'NOT_FOUND') setError('Código no encontrado. Verifícalo con el creador.');
        else setError(err.message);
      } else {
        setError('No pudimos conectarnos al servidor. Verifica tu internet.');
      }
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
            Únete con código
          </Text>
          <Text variant="bodyLg" tone="secondary">
            Pídele el código de invitación a quien creó la residencia.
          </Text>
        </View>

        <Card variant="surface" padding={20}>
          <Stack gap="lg">
            <Input
              label="Código de invitación"
              placeholder="A1B2C3"
              value={inviteCode}
              onChangeText={(v) => setInviteCode(v.toUpperCase())}
              autoCapitalize="characters"
              maxLength={6}
              error={fieldErrors.inviteCode}
              iconLeft="key-outline"
              hint="6 caracteres, sin espacios."
            />
            <Input
              label="Tu nombre"
              placeholder="María"
              value={memberName}
              onChangeText={setMemberName}
              maxLength={60}
              error={fieldErrors.memberName}
              autoCapitalize="words"
              iconLeft="person-outline"
            />
            <Input
              label="Correo (opcional)"
              placeholder="maria@correo.com"
              value={memberEmail}
              onChangeText={setMemberEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              error={fieldErrors.memberEmail}
              iconLeft="mail-outline"
            />
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
          label="Unirme"
          iconRight="arrow-forward"
          size="lg"
          fullWidth
          loading={submitting}
          onPress={handleSubmit}
        />
      </Stack>
    </Screen>
  );
}
