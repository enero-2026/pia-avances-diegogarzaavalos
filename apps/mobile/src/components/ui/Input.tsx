import React, { useState } from 'react';
import {
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ComponentProps<typeof Ionicons>['name'];
  iconRight?: React.ComponentProps<typeof Ionicons>['name'];
  onIconRightPress?: () => void;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  error,
  hint,
  iconLeft,
  iconRight,
  onIconRightPress,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? t.colors.danger.base
    : focused
    ? t.colors.accent.base
    : t.colors.border.subtle;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="label" tone="secondary" style={{ marginBottom: 6, textTransform: 'uppercase' }}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: t.colors.background.surface,
          borderColor,
          borderWidth: 1.5,
          borderRadius: t.radius.lg,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        {iconLeft ? <Ionicons name={iconLeft} size={18} color={t.colors.text.muted} /> : null}
        <TextInput
          {...rest}
          placeholderTextColor={t.colors.text.muted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            {
              flex: 1,
              color: t.colors.text.primary,
              fontSize: 16,
              paddingVertical: 0,
            },
            style,
          ]}
        />
        {iconRight ? (
          <Ionicons
            name={iconRight}
            size={18}
            color={t.colors.text.muted}
            onPress={onIconRightPress}
          />
        ) : null}
      </View>
      {error ? (
        <Text variant="bodySm" tone="danger" style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="bodySm" tone="muted" style={{ marginTop: 6 }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
