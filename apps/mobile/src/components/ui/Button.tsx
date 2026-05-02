import React from 'react';
import { ActivityIndicator, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: React.ComponentProps<typeof Ionicons>['name'];
  iconRight?: React.ComponentProps<typeof Ionicons>['name'];
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  style,
}: Props) {
  const t = useTheme();

  const sizes = {
    sm: { paddingVertical: 8, paddingHorizontal: 14, iconSize: 16, gap: 6 },
    md: { paddingVertical: 12, paddingHorizontal: 18, iconSize: 18, gap: 8 },
    lg: { paddingVertical: 16, paddingHorizontal: 22, iconSize: 20, gap: 10 },
  } as const;

  const variants: Record<
    Variant,
    { bg: string; fg: string; border: string }
  > = {
    primary: {
      bg: t.colors.accent.base,
      fg: t.colors.text.onAccent,
      border: 'transparent',
    },
    secondary: {
      bg: t.colors.background.muted,
      fg: t.colors.text.primary,
      border: t.colors.border.subtle,
    },
    ghost: {
      bg: 'transparent',
      fg: t.colors.text.primary,
      border: 'transparent',
    },
    danger: {
      bg: t.colors.danger.base,
      fg: '#FFFFFF',
      border: 'transparent',
    },
    success: {
      bg: t.colors.success.base,
      fg: '#FFFFFF',
      border: 'transparent',
    },
  };

  const v = variants[variant];
  const s = sizes[size];

  return (
    <PressableScale
      onPress={loading || disabled ? undefined : onPress}
      haptic={disabled ? false : 'light'}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: 1,
          borderRadius: t.radius.lg,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.5 : 1,
        },
        style as ViewStyle,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: s.gap,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={v.fg} />
        ) : (
          <>
            {iconLeft ? <Ionicons name={iconLeft} size={s.iconSize} color={v.fg} /> : null}
            <Text variant="button" style={{ color: v.fg }}>
              {label}
            </Text>
            {iconRight ? <Ionicons name={iconRight} size={s.iconSize} color={v.fg} /> : null}
          </>
        )}
      </View>
    </PressableScale>
  );
}
