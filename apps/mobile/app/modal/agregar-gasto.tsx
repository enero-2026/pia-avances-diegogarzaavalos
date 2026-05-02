import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, View } from 'react-native';
import type { ExpenseCategory, ExpenseCategoryId, MemberId } from '@balancehogar/types';
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
import { useTheme } from '../../src/theme/ThemeProvider';
import { categoryIonicon, formatDateShort } from '../../src/lib/format';

type Frequency = 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual';

const FREQUENCY_LABELS: Record<Frequency, string> = {
  monthly: 'Mensual',
  bimonthly: 'Bimestral',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual',
};

export default function AgregarGastoModal() {
  const router = useRouter();
  const { state, api } = useSession();
  const t = useTheme();

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]!);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [paidById, setPaidById] = useState<string | null>(state.member?.id as unknown as string ?? null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [attachmentUri, setAttachmentUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.expenseCategories
      .list()
      .then((cats) => {
        setCategories(cats);
        if (!categoryId && cats[0]) {
          setCategoryId(cats[0].id as unknown as string);
        }
      })
      .catch(() => {
        /* ignore */
      });
  }, [api]);

  useEffect(() => {
    if (!paidById && state.member) {
      setPaidById(state.member.id as unknown as string);
    }
  }, [state.member, paidById]);

  const activeMembers = state.members.filter((m) => !m.deletedAt);

  const handlePickImage = async (mode: 'camera' | 'library') => {
    if (mode === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Permiso necesario', 'Activa el permiso de cámara desde ajustes para tomar fotos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      if (!result.canceled && result.assets[0]) setAttachmentUri(result.assets[0].uri);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Permiso necesario', 'Activa el permiso de fotos desde ajustes.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.7,
        mediaTypes: 'images',
      });
      if (!result.canceled && result.assets[0]) setAttachmentUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Falta el título', 'Dale un nombre al gasto.');
      return;
    }
    const amountFloat = parseFloat(amount.replace(',', '.'));
    if (Number.isNaN(amountFloat) || amountFloat <= 0) {
      Alert.alert('Monto inválido', 'Ingresa una cantidad mayor a cero.');
      return;
    }
    if (!categoryId) {
      Alert.alert('Selecciona categoría', 'Elige una categoría para continuar.');
      return;
    }
    if (!paidById) {
      Alert.alert('Selecciona pagador', '¿Quién pagó este gasto?');
      return;
    }

    setSubmitting(true);
    try {
      const cents = Math.round(amountFloat * 100);

      if (isRecurring) {
        await api.recurringExpenses.create({
          title: title.trim(),
          description: description.trim() === '' ? null : description.trim(),
          amount: cents,
          currency: 'MXN',
          categoryId: categoryId as ExpenseCategoryId,
          frequency,
          nextDueDate: date,
        });
      } else {
        const expense = await api.expenses.create({
          title: title.trim(),
          description: description.trim() === '' ? null : description.trim(),
          amount: cents,
          currency: 'MXN',
          categoryId: categoryId as ExpenseCategoryId,
          paidById: paidById as MemberId,
          date,
        });

        if (attachmentUri) {
          try {
            await api.attachments.upload({
              expenseId: expense.id as unknown as string,
              file: {
                uri: attachmentUri,
                name: `gasto-${expense.id}.jpg`,
                type: 'image/jpeg',
              },
            });
          } catch {
            /* el gasto ya existe; el adjunto se puede subir luego */
          }
        }
      }

      router.back();
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : 'No se pudo guardar el gasto.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen background="app">
      <Stack gap="lg">
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="hero">Nuevo gasto</Text>
          <PressableScale
            onPress={() => router.back()}
            haptic={false}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: t.colors.background.surface,
              borderWidth: 1,
              borderColor: t.colors.border.subtle,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={18} color={t.colors.text.secondary} />
          </PressableScale>
        </Stack>

        <Card variant="surface" padding={20}>
          <Stack gap="lg">
            <Input
              label="Título"
              placeholder="Renta, despensa, internet…"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
              iconLeft="pricetag-outline"
            />

            <View>
              <Text variant="label" tone="secondary" style={{ textTransform: 'uppercase', marginBottom: 6 }}>
                Categoría
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {categories.map((cat) => {
                  const selected = categoryId === (cat.id as unknown as string);
                  return (
                    <PressableScale
                      key={cat.id as unknown as string}
                      onPress={() => setCategoryId(cat.id as unknown as string)}
                      haptic="light"
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: t.radius.full,
                        backgroundColor: selected
                          ? `${cat.color ?? t.colors.accent.base}1F`
                          : t.colors.background.surface,
                        borderWidth: 1,
                        borderColor: selected ? cat.color ?? t.colors.accent.base : t.colors.border.subtle,
                      }}
                    >
                      <Ionicons
                        name={categoryIonicon(cat.slug) as React.ComponentProps<typeof Ionicons>['name']}
                        size={14}
                        color={cat.color ?? t.colors.accent.base}
                      />
                      <Text
                        variant="bodySm"
                        style={{
                          color: selected ? cat.color ?? t.colors.accent.base : t.colors.text.secondary,
                          fontWeight: selected ? '700' : '500',
                        }}
                      >
                        {cat.name}
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>
            </View>

            <View>
              <Text variant="label" tone="secondary" style={{ textTransform: 'uppercase', marginBottom: 6 }}>
                Pagado por
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {activeMembers.map((m) => {
                  const id = m.id as unknown as string;
                  const selected = paidById === id;
                  return (
                    <PressableScale
                      key={id}
                      onPress={() => setPaidById(id)}
                      haptic="light"
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: t.radius.full,
                        backgroundColor: selected ? `${m.color}1F` : t.colors.background.surface,
                        borderWidth: 1,
                        borderColor: selected ? m.color : t.colors.border.subtle,
                      }}
                    >
                      <Avatar name={m.name} color={m.color} size={20} />
                      <Text
                        variant="bodySm"
                        style={{
                          color: selected ? m.color : t.colors.text.secondary,
                          fontWeight: selected ? '700' : '500',
                        }}
                      >
                        {m.name.split(' ')[0] ?? m.name}
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>
            </View>

            <Input
              label="Monto"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              iconLeft="cash-outline"
            />

            <Input
              label="Fecha"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              iconLeft="calendar-outline"
              hint={`Se guardará como ${formatDateShort(date)}`}
            />

            <Input
              label="Notas (opcional)"
              placeholder="Detalles, ticket, contexto…"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={{ minHeight: 60, textAlignVertical: 'top' }}
              iconLeft="document-text-outline"
            />
          </Stack>
        </Card>

        <Card variant="surface" padding={16}>
          <Stack gap="md">
            <PressableScale
              onPress={() => setIsRecurring((v) => !v)}
              haptic="light"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: t.spacing.md,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 13,
                  padding: 2,
                  backgroundColor: isRecurring ? t.colors.accent.base : t.colors.background.muted,
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#FFFFFF',
                    alignSelf: isRecurring ? 'flex-end' : 'flex-start',
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyLg">Es un gasto recurrente</Text>
                <Text variant="bodySm" tone="muted">
                  Crea una plantilla en lugar de un gasto puntual.
                </Text>
              </View>
            </PressableScale>

            {isRecurring ? (
              <View>
                <Text variant="label" tone="secondary" style={{ textTransform: 'uppercase', marginBottom: 6 }}>
                  Frecuencia
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => {
                    const selected = frequency === f;
                    return (
                      <PressableScale
                        key={f}
                        onPress={() => setFrequency(f)}
                        haptic="light"
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                          borderRadius: t.radius.full,
                          backgroundColor: selected ? t.colors.accent.soft : t.colors.background.surface,
                          borderWidth: 1,
                          borderColor: selected ? t.colors.accent.base : t.colors.border.subtle,
                        }}
                      >
                        <Text
                          variant="bodySm"
                          style={{
                            color: selected ? t.colors.accent.onSoft : t.colors.text.secondary,
                            fontWeight: selected ? '700' : '500',
                          }}
                        >
                          {FREQUENCY_LABELS[f]}
                        </Text>
                      </PressableScale>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </Stack>
        </Card>

        {!isRecurring ? (
          <Card variant="surface" padding={16}>
            <Stack gap="sm">
              <Text variant="h3">Comprobante</Text>
              <Text variant="bodySm" tone="muted">
                Adjunta una foto o ticket. Opcional, pero útil para ti y los demás.
              </Text>
              <Stack direction="row" gap="sm">
                <Button
                  label="Cámara"
                  iconLeft="camera-outline"
                  variant="secondary"
                  size="sm"
                  onPress={() => handlePickImage('camera')}
                />
                <Button
                  label="Galería"
                  iconLeft="image-outline"
                  variant="secondary"
                  size="sm"
                  onPress={() => handlePickImage('library')}
                />
                {attachmentUri ? (
                  <Button
                    label="Quitar"
                    iconLeft="close"
                    variant="ghost"
                    size="sm"
                    onPress={() => setAttachmentUri(null)}
                  />
                ) : null}
              </Stack>
              {attachmentUri ? (
                <Image
                  source={{ uri: attachmentUri }}
                  style={{
                    width: '100%',
                    height: 180,
                    borderRadius: t.radius.lg,
                    marginTop: 8,
                  }}
                />
              ) : null}
            </Stack>
          </Card>
        ) : null}

        <Stack direction="row" gap="md">
          <Button
            label="Cancelar"
            variant="secondary"
            fullWidth
            onPress={() => router.back()}
            style={{ flex: 1 }}
          />
          <Button
            label="Guardar"
            iconRight="checkmark"
            fullWidth
            loading={submitting}
            onPress={handleSubmit}
            style={{ flex: 1 }}
          />
        </Stack>
      </Stack>
    </Screen>
  );
}
