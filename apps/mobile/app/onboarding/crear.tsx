import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ApiClientError } from '@balancehogar/api-client';
import { createResidenceSchema } from '@balancehogar/schemas';
import { Button, Card, Input, PressableScale, Screen, Stack, Text } from '../../src/components/ui';
import { useSession } from '../../src/providers/SessionProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function CrearResidencia() {
  const router = useRouter();
  const { api, setAuth } = useSession();
  const t = useTheme();

  const [residenceName, setResidenceName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});

    const parsed = createResidenceSchema.safeParse({
      residenceName,
      ownerName,
      ownerEmail: ownerEmail.trim() === '' ? undefined : ownerEmail.trim(),
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
      const result = await api.auth.createResidence(parsed.data);
      setAuth(result);
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('No pudimos conectarnos al servidor. Verifica tu internet e intenta de nuevo.');
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
            Tu residencia
          </Text>
          <Text variant="bodyLg" tone="secondary">
            Dale un nombre y dinos quién eres. Después podrás invitar al resto.
          </Text>
        </View>

        <Card variant="surface" padding={20}>
          <Stack gap="lg">
            <Input
              label="Nombre de la residencia"
              placeholder="Casa de la familia García"
              value={residenceName}
              onChangeText={setResidenceName}
              maxLength={50}
              error={fieldErrors.residenceName}
              autoCapitalize="words"
              iconLeft="home-outline"
            />
            <Input
              label="Tu nombre"
              placeholder="Andrés"
              value={ownerName}
              onChangeText={setOwnerName}
              maxLength={60}
              error={fieldErrors.ownerName}
              autoCapitalize="words"
              iconLeft="person-outline"
            />
            <Input
              label="Correo (opcional)"
              placeholder="andres@correo.com"
              value={ownerEmail}
              onChangeText={setOwnerEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              error={fieldErrors.ownerEmail}
              hint="Lo usamos para mandarte alertas y avisos importantes."
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
          label="Crear residencia"
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
