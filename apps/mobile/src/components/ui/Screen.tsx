import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  /** Padding horizontal en spacing tokens (default 'base'). */
  padded?: boolean;
  /** Bordes seguros a respetar (default top + bottom). */
  edges?: Edge[];
  background?: 'app' | 'surface' | 'muted';
  style?: ViewStyle;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  refreshControl?: ScrollViewProps['refreshControl'];
  keyboardAvoiding?: boolean;
};

/**
 * Pantalla base con SafeArea + scroll opcional + manejo de teclado.
 * Centraliza el padding horizontal y el color de fondo.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ['top', 'bottom'],
  background = 'app',
  style,
  contentContainerStyle,
  refreshControl,
  keyboardAvoiding = true,
}: Props) {
  const t = useTheme();

  const bgColor =
    background === 'surface'
      ? t.colors.background.surface
      : background === 'muted'
      ? t.colors.background.muted
      : t.colors.background.app;

  const horizontalPadding = padded ? t.spacing.base : 0;

  const Body = (
    <View style={{ flex: 1, paddingHorizontal: horizontalPadding }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: t.spacing.md,
              paddingBottom: t.spacing['3xl'],
              gap: t.spacing.base,
            },
            contentContainerStyle,
          ]}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: bgColor }, style]} edges={edges}>
      <StatusBar barStyle={t.mode === 'dark' ? 'light-content' : 'dark-content'} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {Body}
        </KeyboardAvoidingView>
      ) : (
        Body
      )}
    </SafeAreaView>
  );
}
