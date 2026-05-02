import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button, PressableScale, Screen, Stack, Text } from '../../src/components/ui';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function OnboardingIndex() {
  const router = useRouter();
  const t = useTheme();

  return (
    <Screen scroll={false} background="app">
      <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: t.spacing['2xl'] }}>
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <Stack gap="lg" align="flex-start">
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: t.colors.accent.base,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="home" size={30} color="#FFFFFF" />
            </View>
            <View>
              <Text variant="hero" style={{ marginBottom: 8 }}>
                BalanceHogar
              </Text>
              <Text variant="bodyLg" tone="secondary">
                Lleva los gastos compartidos del hogar sin discusiones, hojas de cálculo, ni
                dolores de cabeza.
              </Text>
            </View>
          </Stack>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).springify()}>
          <Stack gap="md">
            <FeatureRow
              icon="people-outline"
              title="Una residencia, varios miembros"
              description="Comparte gastos con quien vive contigo en tiempo real."
            />
            <FeatureRow
              icon="repeat-outline"
              title="Recurrentes inteligentes"
              description="Renta, agua, luz: aviso a tiempo y registro automático."
            />
            <FeatureRow
              icon="sparkles-outline"
              title="Resúmenes con IA"
              description="Comparativos mes con mes y consejos accionables."
            />
          </Stack>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280).springify()}>
          <Stack gap="md">
            <Button
              label="Crear residencia"
              iconRight="arrow-forward"
              size="lg"
              fullWidth
              onPress={() => router.push('/onboarding/crear')}
            />
            <Button
              label="Tengo un código de invitación"
              variant="secondary"
              size="lg"
              fullWidth
              onPress={() => router.push('/onboarding/unirse')}
            />
          </Stack>
        </Animated.View>
      </View>
    </Screen>
  );
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
}) {
  const t = useTheme();
  return (
    <PressableScale
      haptic={false}
      style={{
        flexDirection: 'row',
        gap: t.spacing.md,
        padding: t.spacing.base,
        borderRadius: t.radius.lg,
        backgroundColor: t.colors.background.surface,
        borderWidth: 1,
        borderColor: t.colors.border.subtle,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors.accent.soft,
        }}
      >
        <Ionicons name={icon} size={20} color={t.colors.accent.base} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="h3" style={{ marginBottom: 2 }}>
          {title}
        </Text>
        <Text variant="body" tone="secondary">
          {description}
        </Text>
      </View>
    </PressableScale>
  );
}
