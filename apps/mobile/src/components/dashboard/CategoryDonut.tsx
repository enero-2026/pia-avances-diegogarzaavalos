import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui';
import { formatCents } from '../../lib/format';

type Slice = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  slices: Slice[];
  totalCents: number;
  currency?: string;
  size?: number;
  thickness?: number;
};

/**
 * Donut chart custom hecho con react-native-svg. Sin librerías pesadas:
 * controlamos colores, animaciones y radios. Si la lista está vacía mostramos
 * un anillo neutro para mantener el layout estable.
 */
export function CategoryDonut({
  slices,
  totalCents,
  currency = 'MXN',
  size = 180,
  thickness = 16,
}: Props) {
  const t = useTheme();
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((acc, s) => acc + s.value, 0);

  let offset = 0;
  const trackColor = t.colors.background.muted;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={thickness}
            fill="transparent"
          />
          {total > 0 &&
            slices.map((slice, i) => {
              const fraction = slice.value / total;
              const dash = fraction * circumference;
              const gap = circumference - dash;
              const strokeDasharray = `${dash} ${gap}`;
              const strokeDashoffset = -offset;
              offset += dash;
              return (
                <Circle
                  key={`${slice.label}-${i}`}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={thickness}
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                />
              );
            })}
        </G>
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text variant="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          Total del mes
        </Text>
        <Text variant="hero" style={{ fontSize: 28 }}>
          {formatCents(totalCents, currency)}
        </Text>
      </View>
    </View>
  );
}
