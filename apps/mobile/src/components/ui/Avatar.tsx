import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

type Props = {
  name: string;
  color?: string;
  size?: number;
  inactive?: boolean;
};

/** Avatar circular con iniciales sobre el color del miembro. */
export function Avatar({ name, color, size = 40, inactive }: Props) {
  const t = useTheme();
  const initials = getInitials(name);
  const bg = inactive ? t.colors.background.muted : color ?? t.colors.accent.base;
  const fg = inactive ? t.colors.text.muted : '#FFFFFF';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: fg, fontSize: size * 0.42, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
